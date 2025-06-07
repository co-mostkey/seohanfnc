// 이 파일은 서버 컴포넌트나 API 라우트에서만 사용됩니다 (fs 모듈은 클라이언트 측에서 사용 불가)
import 'server-only';
import { writeFile, mkdir, stat, unlink, readFile, readdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

// 파일 저장 경로 설정 - process.cwd()를 사용하여 현재 작업 디렉토리 기준으로 상대 경로 지정
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 환경에 따른 베이스 URL 설정 (개발 환경과 서버 환경의 차이 해결)
const BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || '';

/**
 * 파일 타입 확인
 * @param mimetype 파일 MIME 타입
 * @returns 이미지 여부
 */
export function isImageFile(mimetype: string): boolean {
    return mimetype.startsWith('image/');
}

/**
 * 파일 크기 검증
 * @param size 파일 크기
 * @param maxSize 최대 허용 크기 (기본값: 10MB)
 * @returns 유효 여부
 */
export function validateFileSize(size: number, maxSize: number = MAX_FILE_SIZE): boolean {
    return size <= maxSize;
}

/**
 * 파일 확장자 추출
 * @param filename 파일명
 * @returns 파일 확장자
 */
export function getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
}

/**
 * 안전한 파일명 생성
 * @param originalFilename 원본 파일명
 * @returns 안전한 파일명
 */
export function generateSafeFilename(originalFilename: string): string {
    const extension = getFileExtension(originalFilename);
    const timestamp = Date.now();
    const uuid = uuidv4().substring(0, 8);
    return `${timestamp}-${uuid}${extension}`;
}

/**
 * 디렉토리 존재 확인 및 생성
 * @param dir 디렉토리 경로
 */
export async function ensureDirectoryExists(dir: string): Promise<void> {
    try {
        // console.log(`[file-storage] Checking if directory exists: ${dir}`);
        await stat(dir);
        // console.log(`[file-storage] Directory already exists: ${dir}`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // console.log(`[file-storage] Directory does not exist, creating: ${dir}`);
            try {
                await mkdir(dir, { recursive: true });
                // console.log(`[file-storage] Successfully created directory: ${dir}`);
            } catch (mkdirError: any) {
                console.error(`[file-storage] Error creating directory ${dir}:`, mkdirError);
                throw new Error(`Failed to create directory ${dir}: ${mkdirError.message}`);
            }
        } else {
            console.error(`[file-storage] Error checking directory ${dir}:`, error);
            throw new Error(`Failed to access directory ${dir}: ${error.message}`);
        }
    }
}

/**
 * 경로 정규화 (중복 슬래시 제거 및 경로 구분자 정리)
 * @param filePath 정규화할 파일 경로
 * @returns 정규화된 경로
 */
export function normalizePath(filePath: string): string {
    let normalized = filePath.replace(/\/+/g, '/');
    normalized = normalized.replace(/\\/g, '/');
    // Ensure it starts with a single slash if it's meant to be a root-relative path
    if (normalized.startsWith('//')) {
        normalized = normalized.substring(1);
    }
    // Remove trailing slash if it's not the root path itself
    if (normalized !== '/' && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
}

/**
 * 파일 저장
 * @param fileData 파일 데이터 (Buffer)
 * @param fileName 파일명
 * @param subDir 하위 디렉토리 (선택 사항)
 * @returns 저장된 파일 정보
 */
export async function saveFile(
    fileData: Buffer,
    fileName: string,
    subDir: string = ''
): Promise<{ path: string; url: string }> {
    const normalizedSubDir = normalizePath(subDir); // Ensure subDir is normalized
    const targetDir = path.join(UPLOADS_DIR, normalizedSubDir);
    // console.log(`[file-storage] Target directory for save: ${targetDir}`);

    try {
        await ensureDirectoryExists(targetDir);
    } catch (dirError: any) {
        // ensureDirectoryExists 내부에서 이미 로깅 및 throw 함
        throw dirError; // Re-throw the error to be caught by processUploadedFile
    }

    const filePath = path.join(targetDir, fileName);
    // console.log(`[file-storage] Full file path for save: ${filePath}`);

    try {
        await writeFile(filePath, fileData);
        // console.log(`[file-storage] File saved successfully: ${filePath}`);
    } catch (writeError: any) {
        console.error(`[file-storage] Error writing file ${filePath}:`, writeError);
        throw new Error(`Failed to write file ${filePath}: ${writeError.message}`);
    }

    const publicPath = normalizePath(`/uploads/${normalizedSubDir}/${fileName}`);
    // console.log(`[file-storage] Generated public URL: ${publicPath}`);

    return {
        path: filePath,
        url: publicPath,
    };
}

/**
 * 파일 메타데이터 저장
 * @param filePath 파일 경로
 * @param metadata 저장할 메타데이터
 */
export async function saveFileMetadata(
    filePath: string,
    metadata: Record<string, any>
): Promise<void> {
    const metadataPath = `${filePath}.meta.json`;
    try {
        await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        // console.log(`[file-storage] Metadata saved: ${metadataPath}`);
    } catch (error: any) {
        console.error(`[file-storage] Error saving metadata ${metadataPath}:`, error);
        // 메타데이터 저장 실패가 전체 작업을 중단시켜야 하는지에 따라 오류를 throw 할지 결정
    }
}

/**
 * 파일 메타데이터 읽기
 * @param filePath 파일 경로
 * @returns 메타데이터 객체
 */
export async function readFileMetadata(
    filePath: string
): Promise<Record<string, any>> {
    const metadataPath = `${filePath}.meta.json`;
    try {
        const data = await readFile(metadataPath, 'utf-8');
        // console.log(`[file-storage] Metadata read: ${metadataPath}`);
        return JSON.parse(data);
    } catch (error: any) {
        // console.warn(`[file-storage] Error reading metadata ${metadataPath}:`, error.message);
        return {}; // 메타데이터가 없거나 읽기 실패 시 빈 객체 반환
    }
}

/**
 * 파일 해시 생성 (중복 확인용)
 * @param data 파일 데이터
 * @returns SHA-256 해시 문자열
 */
export function generateFileHash(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
}

/**
 * 파일 삭제
 * @param filePath 삭제할 파일 경로 (public/uploads/ 이후 경로)
 * @returns 삭제 성공 여부
 */
export async function deleteFile(filePath: string): Promise<boolean> {
    try {
        let internalFilePath = filePath;
        if (internalFilePath.startsWith('/uploads/')) {
            internalFilePath = internalFilePath.substring('/uploads/'.length);
        } else if (internalFilePath.startsWith('uploads/')) {
            internalFilePath = internalFilePath.substring('uploads/'.length);
        }

        // Remove leading slash if any, to correctly join with UPLOADS_DIR
        if (internalFilePath.startsWith('/')) {
            internalFilePath = internalFilePath.substring(1);
        }

        const fullPath = path.join(UPLOADS_DIR, normalizePath(internalFilePath));
        console.log(`[file-storage] Attempting to delete file: ${fullPath}`);

        await stat(fullPath); // Check if file exists

        // Attempt to delete metadata file first (if it exists)
        const metadataPath = `${fullPath}.meta.json`;
        try {
            await stat(metadataPath); // Check if metadata file exists
            await unlink(metadataPath);
            console.log(`[file-storage] Deleted metadata file: ${metadataPath}`);
        } catch (metaError: any) {
            if (metaError.code !== 'ENOENT') {
                console.warn(`[file-storage] Could not delete metadata file ${metadataPath}:`, metaError.message);
            } else {
                // console.log(`[file-storage] No metadata file found for ${fullPath}, skipping deletion.`);
            }
        }

        await unlink(fullPath);
        console.log(`[file-storage] Successfully deleted file: ${fullPath}`);
        return true;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.warn(`[file-storage] File not found for deletion: ${filePath} (resolved to ${error.path || 'unknown path'})`);
            // Consider returning true or specific code if not finding is acceptable for a delete op
            return false; // Or true, depending on desired behavior for "delete non-existent"
        }
        console.error(`[file-storage] Error deleting file ${filePath}:`, error);
        return false;
    }
}

/**
 * 디렉토리 내 파일 목록 조회
 * @param subDir 조회할 하위 디렉토리
 * @returns 파일 경로 목록
 */
export async function listFiles(subDir: string = ''): Promise<string[]> {
    try {
        const targetDir = path.join(UPLOADS_DIR, subDir);
        await stat(targetDir);
        const files = await readdir(targetDir);
        return files
            .filter(file => !file.endsWith('.meta.json'))
            .map(file => normalizePath(`/uploads/${subDir}/${file}`));
    } catch (error) {
        // console.error('[file-storage] Error listing files in dir:', subDir, error);
        return [];
    }
}

/**
 * 업로드된 파일 처리 (FormData에서 받은 경우)
 * @param file FormData에서 받은 File 객체
 * @param subDir 저장할 하위 디렉토리
 * @returns 저장된 파일 정보
 */
export async function processUploadedFile(
    file: File,
    subDir: string = ''
): Promise<{
    filename: string;
    originalFilename: string;
    path: string;
    url: string;
    filesize: number;
    mimetype: string;
    isImage: boolean;
}> {
    // console.log(`[file-storage] Processing uploaded file. Original: ${file.name}, Size: ${file.size}, Type: ${file.type}, SubDir: ${subDir}`);

    if (!validateFileSize(file.size, MAX_FILE_SIZE)) { // MAX_FILE_SIZE 명시적 전달
        console.error(`[file-storage] File size validation failed for ${file.name}. Size: ${file.size}, Max: ${MAX_FILE_SIZE}`);
        throw new Error(`File size ${file.name} exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    const originalFilename = file.name;
    const safeFilename = generateSafeFilename(originalFilename);
    // console.log(`[file-storage] Generated safe filename: ${safeFilename} for original: ${originalFilename}`);

    const fileDataArrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(fileDataArrayBuffer);
    // console.log(`[file-storage] File data converted to Buffer. Length: ${fileData.length}`);

    try {
        const savedFileInfo = await saveFile(fileData, safeFilename, subDir);
        // console.log(`[file-storage] File saved via saveFile. Path: ${savedFileInfo.path}, URL: ${savedFileInfo.url}`);

        const fileMimeType = file.type || 'application/octet-stream';
        const imageCheck = isImageFile(fileMimeType);

        return {
            filename: safeFilename, // 저장된 실제 파일명
            originalFilename: originalFilename, // 원본 파일명
            path: savedFileInfo.path,       // 서버 내 실제 경로
            url: savedFileInfo.url,         // 웹 접근 가능 URL
            filesize: file.size,
            mimetype: fileMimeType,
            isImage: imageCheck,
        };
    } catch (error: any) {
        // saveFile 또는 그 이전 단계에서 발생한 오류를 여기서 잡아서 다시 throw
        // console.error(`[file-storage] Error during processUploadedFile for ${originalFilename}:`, error);
        // saveFile 내부에서 이미 상세 로깅 및 구체적인 오류 메시지를 포함한 Error 객체를 throw 하므로, 그대로 다시 throw
        throw error;
    }
} 