// 이 파일은 서버 컴포넌트나 API 라우트에서만 사용됩니다 (fs 모듈은 클라이언트 측에서 사용 불가)
import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

// 데이터 저장 경로 설정
export const DATA_DIR = path.join(process.cwd(), 'data', 'db');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'db', 'backups');
const METADATA_DIR = path.join(process.cwd(), 'data', 'db', 'metadata');
const SCHEDULED_BACKUP_DIR = path.join(process.cwd(), 'data', 'db', 'scheduled-backups');
const LOCK_TIMEOUT = 5000; // 5초 타임아웃
const LOCK_RETRY_INTERVAL = 100; // 0.1초 간격으로 재시도
const MAX_BACKUPS = 50; // 파일당 최대 백업 수

/**
 * 파일 잠금 획득
 * @param filePath 잠글 파일 경로
 */
export async function acquireLock(filePath: string): Promise<void> {
    const lockFilePath = `${filePath}.lock`;
    const startTime = Date.now();

    while (true) {
        try {
            await fs.writeFile(lockFilePath, Date.now().toString(), { flag: 'wx' }); // wx: 파일이 존재하면 실패
            return;
        } catch (error: any) {
            if (error.code === 'EEXIST') {
                // 이미 잠금 파일이 존재하는 경우
                if (Date.now() - startTime > LOCK_TIMEOUT) {
                    // 오래된 lock 파일일 수 있으므로 강제로 삭제
                    try {
                        const lockContent = await fs.readFile(lockFilePath, 'utf-8');
                        const lockTime = parseInt(lockContent, 10);

                        // 10초 이상 지난 잠금은 강제 해제 (교착 상태 방지)
                        if (Date.now() - lockTime > 10000) {
                            await fs.unlink(lockFilePath);
                            continue;
                        }
                    } catch (innerError) {
                        // 잠금 파일 읽기/삭제 실패 시 일반 타임아웃 오류 발생
                    }

                    throw new Error(`Failed to acquire lock: Timeout. File ${filePath} is currently locked.`);
                }
                await new Promise(resolve => setTimeout(resolve, LOCK_RETRY_INTERVAL));
            } else {
                // 디렉토리가 없는 경우 생성
                if (error.code === 'ENOENT') {
                    await fs.mkdir(path.dirname(lockFilePath), { recursive: true });
                    continue;
                }
                throw error;
            }
        }
    }
}

/**
 * 파일 잠금 해제
 * @param filePath 잠금 해제할 파일 경로
 */
export async function releaseLock(filePath: string): Promise<void> {
    const lockFilePath = `${filePath}.lock`;
    try {
        await fs.unlink(lockFilePath);
    } catch (error: any) {
        // 파일이 이미 없거나 다른 이유로 실패해도 무시 (최대한 lock 해제 시도)
        if (error.code !== 'ENOENT') {
            console.warn('Failed to release lock file:', error.message);
        }
    }
}

/**
 * 디렉토리 존재 확인 및 생성
 * @param dir 생성할 디렉토리 경로
 */
export async function ensureDirectoryExists(dir: string): Promise<void> {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error: any) {
        // 이미 있는 경우는 무시
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * 데이터 파일 읽기
 * @param filename 파일 이름
 * @returns 파일 내용을 파싱한 객체
 */
export async function readJsonFile<T>(filename: string): Promise<T> {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // 파일 내용이 비어있거나 공백 문자만 있는 경우 빈 객체 반환
        if (!fileContent.trim()) {
            return {} as T;
        }
        return JSON.parse(fileContent) as T;
    } catch (error: any) {
        // 파일이 없는 경우 또는 JSON 파싱 오류 시 빈 객체 반환
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.warn(`File ${filename} not found or not a valid JSON, returning empty object. Error: ${error.message}`);
            return {} as T;
        }
        throw error;
    }
}

/**
 * 데이터 파일 쓰기 (잠금 사용)
 * @param filename 파일 이름
 * @param data 저장할 데이터
 */
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(DATA_DIR, filename);
    await acquireLock(filePath);

    try {
        // 디렉토리 존재 확인 및 생성
        await ensureDirectoryExists(path.dirname(filePath));

        // 백업 생성 (기존 파일이 있는 경우)
        try {
            const currentContent = await fs.readFile(filePath, 'utf-8');
            const backupFileName = `${path.basename(filename, '.json')}_${Date.now()}.json`;
            const backupPath = path.join(BACKUP_DIR, backupFileName);

            // 백업 디렉토리 생성
            await ensureDirectoryExists(BACKUP_DIR);
            await fs.writeFile(backupPath, currentContent, 'utf-8');

            // 파일 메타데이터 업데이트
            await updateFileMetadata(filename, {
                lastBackup: Date.now(),
                lastModified: Date.now(),
                backupFileName
            });

            // 백업 파일 개수 제한 (최근 MAX_BACKUPS개만 유지)
            const backupFiles = await fs.readdir(BACKUP_DIR);
            if (backupFiles.length > MAX_BACKUPS) {
                const sortedFiles = backupFiles
                    .filter(file => file.startsWith(path.basename(filename, '.json')))
                    .sort();

                // 가장 오래된 백업 파일들 삭제
                for (let i = 0; i < sortedFiles.length - MAX_BACKUPS; i++) {
                    await fs.unlink(path.join(BACKUP_DIR, sortedFiles[i]));
                }
            }
        } catch (error: any) {
            // 기존 파일이 없는 경우 백업 생성 오류는 무시
            if (error.code !== 'ENOENT') {
                console.warn('Failed to create backup:', error.message);
            } else {
                // 새 파일 생성 시 메타데이터 초기화
                await updateFileMetadata(filename, {
                    created: Date.now(),
                    lastModified: Date.now(),
                });
            }
        }

        // 데이터에 checksum 계산 및 추가
        const jsonData = JSON.stringify(data, null, 2);
        const checksum = createHash('sha256').update(jsonData).digest('hex');

        // 파일 쓰기
        await fs.writeFile(filePath, jsonData, 'utf-8');

        // 체크섬 파일 생성
        await fs.writeFile(`${filePath}.checksum`, checksum, 'utf-8');
    } finally {
        await releaseLock(filePath);
    }
}

/**
 * 데이터 파일 유효성 검증
 * @param filename 검증할 파일 이름
 * @returns 검증 결과 (파일 존재 여부, 체크섬 일치 여부)
 */
export async function validateFile(filename: string): Promise<{ exists: boolean; valid: boolean }> {
    const filePath = path.join(DATA_DIR, filename);

    try {
        // 파일 존재 확인
        await fs.access(filePath);

        // 체크섬 파일 확인
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const storedChecksum = await fs.readFile(`${filePath}.checksum`, 'utf-8');
            const calculatedChecksum = createHash('sha256').update(fileContent).digest('hex');

            return {
                exists: true,
                valid: storedChecksum === calculatedChecksum
            };
        } catch (error) {
            // 체크섬 파일이 없거나 읽기 실패
            return { exists: true, valid: false };
        }
    } catch (error) {
        // 파일 접근 실패
        return { exists: false, valid: false };
    }
}

/**
 * 지정된 파일에서 항목 목록 읽기
 * @param filename 파일 이름
 * @param listKey 목록이 저장된 객체 키 (없으면 전체 객체를 목록으로 간주)
 * @returns 항목 목록
 */
export async function readItems<T>(filename: string, listKey?: string): Promise<T[]> {
    try {
        const filePath = path.join(DATA_DIR, filename);

        // 파일이 존재하는지 확인
        try {
            await fs.access(filePath);
        } catch (err) {
            // 파일이 없으면 새 파일 생성
            await ensureDirectoryExists(DATA_DIR);

            // 빈 배열로 초기화
            if (listKey) {
                const initialData = { [listKey]: [] };
                await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
            } else {
                await fs.writeFile(filePath, '[]', 'utf-8');
            }

            return [] as T[];
        }

        // 파일 읽기
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // 파일이 비어있거나 유효하지 않은 JSON인 경우 처리
        if (!fileContent.trim()) {
            // 빈 파일인 경우 초기화
            if (listKey) {
                const initialData = { [listKey]: [] };
                await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
            } else {
                await fs.writeFile(filePath, '[]', 'utf-8');
            }
            return [] as T[];
        }

        try {
            const data = JSON.parse(fileContent);

            if (listKey) {
                if (!data[listKey]) {
                    data[listKey] = [];
                    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
                }
                return (Array.isArray(data[listKey]) ? data[listKey] : []) as T[];
            }

            // 데이터가 배열이 아니면 빈 배열로 초기화
            if (!Array.isArray(data)) {
                await fs.writeFile(filePath, '[]', 'utf-8');
                return [] as T[];
            }

            return data as T[];
        } catch (e) {
            // JSON 파싱 오류 - 파일 재초기화
            console.error(`유효하지 않은 JSON 파일 (${filename}). 파일을 초기화합니다.`, e);
            if (listKey) {
                const initialData = { [listKey]: [] };
                await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
            } else {
                await fs.writeFile(filePath, '[]', 'utf-8');
            }
            return [] as T[];
        }
    } catch (error) {
        console.error(`Error reading items from ${filename}:`, error);
        return [] as T[];
    }
}

/**
 * 지정된 파일에 항목 목록 쓰기
 * @param filename 파일 이름
 * @param items 항목 목록
 * @param listKey 목록을 저장할 객체 키 (없으면 목록을 직접 저장)
 */
export async function writeItems<T>(filename: string, items: T[], listKey?: string): Promise<void> {
    try {
        if (listKey) {
            const data = await readJsonFile<any>(filename);
            data[listKey] = items;
            await writeJsonFile(filename, data);
        } else {
            await writeJsonFile(filename, items);
        }
    } catch (error) {
        console.error(`Error writing items to ${filename}:`, error);
        throw error;
    }
}

/**
 * ID로 항목 찾기
 * @param items 항목 목록
 * @param id 찾을 ID
 * @param idField ID 필드명 (기본값: 'id')
 * @returns 찾은 항목과 인덱스
 */
export function findItemById<T>(items: T[], id: string, idField: keyof T = 'id' as keyof T): { item: T | null, index: number } {
    const index = items.findIndex(item => (item as any)[idField] === id);
    return {
        item: index >= 0 ? items[index] : null,
        index
    };
}

/**
 * 항목 추가/업데이트
 * @param filename 파일 이름
 * @param item 추가/업데이트할 항목
 * @param listKey 목록을 저장할 객체 키 (없으면 목록을 직접 저장)
 * @param idField ID 필드명 (기본값: 'id')
 * @returns 추가/업데이트된 항목
 */
export async function saveItem<T>(filename: string, item: T, listKey?: string, idField: keyof T = 'id' as keyof T): Promise<T> {
    const items = await readItems<T>(filename, listKey);
    const id = (item as any)[idField];

    if (!id) {
        throw new Error(`Item must have an '${String(idField)}' field`);
    }

    const { index } = findItemById(items, id, idField);

    if (index >= 0) {
        // 기존 항목 업데이트
        items[index] = { ...items[index], ...item };
    } else {
        // 새 항목 추가
        items.push(item);
    }

    await writeItems(filename, items, listKey);
    return item;
}

/**
 * 항목 삭제
 * @param filename 파일 이름
 * @param id 삭제할 항목 ID
 * @param listKey 목록을 저장할 객체 키 (없으면 목록을 직접 저장)
 * @param idField ID 필드명 (기본값: 'id')
 * @returns 삭제 성공 여부
 */
export async function deleteItem<T>(filename: string, id: string, listKey?: string, idField: keyof T = 'id' as keyof T): Promise<boolean> {
    const items = await readItems<T>(filename, listKey);
    const { index } = findItemById(items, id, idField);

    if (index >= 0) {
        items.splice(index, 1);
        await writeItems(filename, items, listKey);
        return true;
    }

    return false;
}

/**
 * 특정 ID를 가진 항목 업데이트
 * @param filename 파일 이름
 * @param id 업데이트할 항목 ID
 * @param updatedData 업데이트할 데이터 (부분 업데이트 지원)
 * @param listKey 목록을 저장할 객체 키 (없으면 목록을 직접 저장)
 * @param idField ID 필드명 (기본값: 'id')
 * @returns 업데이트된 항목
 */
export async function updateItem<T>(filename: string, id: string, updatedData: Partial<T>, listKey?: string, idField: keyof T = 'id' as keyof T): Promise<T | null> {
    const items = await readItems<T>(filename, listKey);
    const { item, index } = findItemById(items, id, idField);

    if (index >= 0 && item) {
        // 항목 업데이트
        const updatedItem = { ...item, ...updatedData } as T;
        items[index] = updatedItem;
        await writeItems(filename, items, listKey);
        return updatedItem;
    }

    return null;
}

/**
 * 파일 메타데이터 정보 타입
 */
interface FileMetadata {
    created?: number;
    lastModified?: number;
    lastBackup?: number;
    backupCount?: number;
    version?: number;
    backupFileName?: string;
    description?: string;
    sizeBytes?: number;
    author?: string;
    checksum?: string;
    [key: string]: any; // 추가 메타데이터 필드
}

/**
 * 파일 메타데이터 읽기
 * @param filename 대상 파일명
 * @returns 메타데이터 객체
 */
export async function readFileMetadata(filename: string): Promise<FileMetadata> {
    try {
        const metaFilePath = path.join(METADATA_DIR, `${path.basename(filename, '.json')}.meta.json`);
        const content = await fs.readFile(metaFilePath, 'utf-8');
        return JSON.parse(content);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return {};
        }
        throw error;
    }
}

/**
 * 파일 메타데이터 업데이트
 * @param filename 대상 파일명
 * @param metadata 업데이트할 메타데이터 필드
 */
export async function updateFileMetadata(filename: string, metadata: Partial<FileMetadata>): Promise<FileMetadata> {
    try {
        // 메타데이터 디렉토리 생성
        await ensureDirectoryExists(METADATA_DIR);

        const metaFilePath = path.join(METADATA_DIR, `${path.basename(filename, '.json')}.meta.json`);
        let currentMetadata: FileMetadata = {};

        try {
            const content = await fs.readFile(metaFilePath, 'utf-8');
            currentMetadata = JSON.parse(content);
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            // 파일이 없으면 새 메타데이터 생성
        }

        // 메타데이터 업데이트
        const updatedMetadata = { ...currentMetadata, ...metadata };

        // 버전 자동 증가 (메타데이터에 version 필드가 있는 경우)
        if (currentMetadata.version !== undefined) {
            updatedMetadata.version = currentMetadata.version + 1;
        }

        await fs.writeFile(metaFilePath, JSON.stringify(updatedMetadata, null, 2), 'utf-8');
        return updatedMetadata;
    } catch (error) {
        console.error(`Failed to update metadata for ${filename}:`, error);
        throw error;
    }
}

/**
 * 백업 목록 조회
 * @param filename 대상 파일명
 * @returns 백업 파일명 목록과 타임스탬프
 */
export async function listFileBackups(filename: string): Promise<{ fileName: string, timestamp: number, path: string }[]> {
    try {
        await ensureDirectoryExists(BACKUP_DIR);

        const baseName = path.basename(filename, '.json');
        const files = await fs.readdir(BACKUP_DIR);

        return files
            .filter(file => file.startsWith(`${baseName}_`) && file.endsWith('.json'))
            .map(file => {
                const timestamp = parseInt(file.replace(`${baseName}_`, '').replace('.json', ''), 10);
                return {
                    fileName: file,
                    timestamp: isNaN(timestamp) ? 0 : timestamp,
                    path: path.join(BACKUP_DIR, file)
                };
            })
            .sort((a, b) => b.timestamp - a.timestamp); // 내림차순 정렬 (최신순)
    } catch (error) {
        console.error(`Failed to list backups for ${filename}:`, error);
        return [];
    }
}

/**
 * 백업에서 복원
 * @param filename 대상 파일명
 * @param backupFileName 백업 파일명 (전체 파일명)
 */
export async function restoreFromBackup(filename: string, backupFileName: string): Promise<void> {
    const backupPath = path.join(BACKUP_DIR, backupFileName);
    const targetPath = path.join(DATA_DIR, filename);

    await acquireLock(targetPath);

    try {
        // 현재 파일 임시 백업 (복원 실패 시 롤백용)
        let tempBackup: string | null = null;
        try {
            const currentContent = await fs.readFile(targetPath, 'utf-8');
            tempBackup = `${path.basename(filename, '.json')}_restore_backup_${Date.now()}.json`;
            await fs.writeFile(path.join(BACKUP_DIR, tempBackup), currentContent, 'utf-8');
        } catch (error: any) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            // 현재 파일이 없는 경우 무시
        }

        // 백업 파일 읽기
        const backupContent = await fs.readFile(backupPath, 'utf-8');

        // 복원
        await fs.writeFile(targetPath, backupContent, 'utf-8');

        // 메타데이터 업데이트
        await updateFileMetadata(filename, {
            lastModified: Date.now(),
            restoredFrom: backupFileName,
            version: (await readFileMetadata(filename)).version ?? 0
        });

    } catch (error) {
        console.error(`Failed to restore from backup ${backupFileName}:`, error);
        throw error;
    } finally {
        await releaseLock(targetPath);
    }
}

/**
 * 전체 시스템 백업 생성
 * @param backupName 백업 이름 (기본값: 현재 타임스탬프)
 * @returns 생성된 백업 파일 경로와 백업한 파일 목록
 */
export async function createFullBackup(backupName: string = `full_backup_${Date.now()}`): Promise<{ backupPath: string, backedUpFiles: string[] }> {
    try {
        // 스케줄 백업 디렉토리 생성
        await ensureDirectoryExists(SCHEDULED_BACKUP_DIR);

        // 백업 디렉토리 생성
        const backupDir = path.join(SCHEDULED_BACKUP_DIR, backupName);
        await ensureDirectoryExists(backupDir);

        // DB 디렉토리 내 모든 JSON 파일 검색
        const allFiles = await fs.readdir(DATA_DIR);
        const jsonFiles = allFiles.filter(file => file.endsWith('.json'));

        // 각 파일 백업
        const backedUpFiles: string[] = [];

        for (const file of jsonFiles) {
            try {
                const sourcePath = path.join(DATA_DIR, file);
                const destPath = path.join(backupDir, file);

                // 파일 복사
                const content = await fs.readFile(sourcePath, 'utf-8');
                await fs.writeFile(destPath, content, 'utf-8');

                // 메타데이터도 백업 (있는 경우)
                try {
                    const metaPath = path.join(METADATA_DIR, `${path.basename(file, '.json')}.meta.json`);
                    const metaContent = await fs.readFile(metaPath, 'utf-8');

                    const metaBackupDir = path.join(backupDir, 'metadata');
                    await ensureDirectoryExists(metaBackupDir);

                    await fs.writeFile(
                        path.join(metaBackupDir, `${path.basename(file, '.json')}.meta.json`),
                        metaContent,
                        'utf-8'
                    );
                } catch (error: any) {
                    // 메타데이터 파일 없으면 무시
                    if (error.code !== 'ENOENT') {
                        console.warn(`Failed to backup metadata for ${file}:`, error);
                    }
                }

                backedUpFiles.push(file);
            } catch (error) {
                console.error(`Failed to backup file ${file}:`, error);
            }
        }

        // 백업 메타데이터 생성
        const backupMeta = {
            createdAt: new Date().toISOString(),
            totalFiles: backedUpFiles.length,
            files: backedUpFiles,
        };

        await fs.writeFile(
            path.join(backupDir, 'backup-info.json'),
            JSON.stringify(backupMeta, null, 2),
            'utf-8'
        );

        return {
            backupPath: backupDir,
            backedUpFiles,
        };
    } catch (error) {
        console.error('Failed to create full backup:', error);
        throw error;
    }
}

/**
 * 스케줄 백업 목록 조회
 * @returns 사용 가능한 백업 목록
 */
export async function listScheduledBackups(): Promise<{ name: string, createdAt: string, fileCount: number }[]> {
    try {
        await ensureDirectoryExists(SCHEDULED_BACKUP_DIR);

        const backups = await fs.readdir(SCHEDULED_BACKUP_DIR);
        const result = [];

        for (const backup of backups) {
            try {
                const backupInfoPath = path.join(SCHEDULED_BACKUP_DIR, backup, 'backup-info.json');
                const infoContent = await fs.readFile(backupInfoPath, 'utf-8');
                const info = JSON.parse(infoContent);

                result.push({
                    name: backup,
                    createdAt: info.createdAt || 'Unknown',
                    fileCount: info.totalFiles || 0,
                });
            } catch (error) {
                // 백업 정보 파일이 없거나 읽기 실패한 경우
                result.push({
                    name: backup,
                    createdAt: 'Unknown',
                    fileCount: 0,
                });
            }
        }

        return result.sort((a, b) => {
            // 날짜 기준 내림차순 정렬 (최신순)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    } catch (error) {
        console.error('Failed to list scheduled backups:', error);
        return [];
    }
}

/**
 * 스케줄 백업에서 복원
 * @param backupName 복원할 백업 이름
 * @returns 복원 결과 (성공 여부, 복원된 파일 목록)
 */
export async function restoreFromScheduledBackup(backupName: string): Promise<{ success: boolean, restoredFiles: string[] }> {
    const backupDir = path.join(SCHEDULED_BACKUP_DIR, backupName);
    const restoredFiles: string[] = [];

    try {
        // 백업 디렉토리 확인
        await fs.access(backupDir);

        // 백업 정보 파일 확인
        const backupInfoPath = path.join(backupDir, 'backup-info.json');
        const backupInfo = JSON.parse(await fs.readFile(backupInfoPath, 'utf-8'));

        // 복원 전에 현재 상태 백업
        const tempBackupName = `pre_restore_${Date.now()}`;
        await createFullBackup(tempBackupName);

        // 파일 복원
        const files = await fs.readdir(backupDir);
        for (const file of files) {
            if (file === 'backup-info.json' || file === 'metadata') continue;

            try {
                const sourcePath = path.join(backupDir, file);
                const destPath = path.join(DATA_DIR, file);

                // 파일 복사
                const content = await fs.readFile(sourcePath, 'utf-8');
                await fs.writeFile(destPath, content, 'utf-8');

                restoredFiles.push(file);
            } catch (error) {
                console.error(`Failed to restore file ${file}:`, error);
            }
        }

        // 메타데이터 복원 (있는 경우)
        const metaBackupDir = path.join(backupDir, 'metadata');
        try {
            await fs.access(metaBackupDir);

            const metaFiles = await fs.readdir(metaBackupDir);
            for (const metaFile of metaFiles) {
                try {
                    const sourcePath = path.join(metaBackupDir, metaFile);
                    const destPath = path.join(METADATA_DIR, metaFile);

                    // 메타데이터 복사
                    const content = await fs.readFile(sourcePath, 'utf-8');
                    await fs.writeFile(destPath, content, 'utf-8');
                } catch (error) {
                    console.error(`Failed to restore metadata file ${metaFile}:`, error);
                }
            }
        } catch (error: any) {
            // 메타데이터 디렉토리가 없으면 무시
            if (error.code !== 'ENOENT') {
                console.warn('Failed to restore metadata directory:', error);
            }
        }

        return {
            success: true,
            restoredFiles,
        };
    } catch (error) {
        console.error(`Failed to restore from backup ${backupName}:`, error);
        return {
            success: false,
            restoredFiles,
        };
    }
}

/**
 * 여러 파일에 대한 백업 작업을 한 번에 수행
 * @param filenames 백업할 파일명 배열
 */
export async function backupMultipleFiles(filenames: string[]): Promise<void> {
    for (const filename of filenames) {
        try {
            const filePath = path.join(DATA_DIR, filename);

            // 파일 존재 확인
            try {
                await fs.access(filePath);
            } catch (error: any) {
                if (error.code === 'ENOENT') {
                    console.warn(`Skipping backup for non-existent file: ${filename}`);
                    continue;
                }
                throw error;
            }

            // 백업용 파일 읽기
            const content = await fs.readFile(filePath, 'utf-8');

            // 백업 디렉토리 생성
            await ensureDirectoryExists(BACKUP_DIR);

            // 백업 파일 생성
            const backupFileName = `${path.basename(filename, '.json')}_${Date.now()}.json`;
            const backupPath = path.join(BACKUP_DIR, backupFileName);
            await fs.writeFile(backupPath, content, 'utf-8');

            // 메타데이터 업데이트
            await updateFileMetadata(filename, {
                lastBackup: Date.now(),
                backupFileName
            });

        } catch (error) {
            console.error(`Error during backup of ${filename}:`, error);
        }
    }
} 