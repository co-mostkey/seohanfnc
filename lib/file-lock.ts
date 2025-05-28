import fs from 'fs/promises';
import path from 'path';

// 파일 잠금 관리
class FileLockManager {
    private locks: Map<string, Promise<any>> = new Map();

    async withLock<T>(filePath: string, operation: () => Promise<T>): Promise<T> {
        const normalizedPath = path.normalize(filePath);

        // 기존 잠금이 있으면 대기
        if (this.locks.has(normalizedPath)) {
            await this.locks.get(normalizedPath);
        }

        // 새로운 잠금 생성
        const lockPromise = this.executeWithLock(operation);
        this.locks.set(normalizedPath, lockPromise);

        try {
            const result = await lockPromise;
            return result;
        } finally {
            // 잠금 해제
            this.locks.delete(normalizedPath);
        }
    }

    private async executeWithLock<T>(operation: () => Promise<T>): Promise<T> {
        return await operation();
    }
}

// 전역 파일 잠금 관리자
const fileLockManager = new FileLockManager();

/**
 * 파일 잠금을 사용하여 안전하게 파일을 읽습니다.
 */
export async function safeReadFile(filePath: string): Promise<string> {
    return fileLockManager.withLock(filePath, async () => {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            if ((error as any).code === 'ENOENT') {
                throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
            }
            throw error;
        }
    });
}

/**
 * 파일 잠금을 사용하여 안전하게 파일을 씁니다.
 */
export async function safeWriteFile(filePath: string, data: string): Promise<void> {
    return fileLockManager.withLock(filePath, async () => {
        const dir = path.dirname(filePath);

        // 디렉토리 확인 및 생성
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }

        // 백업 파일 생성
        const backupPath = `${filePath}.backup`;
        try {
            const existingData = await fs.readFile(filePath, 'utf8');
            await fs.writeFile(backupPath, existingData, 'utf8');
        } catch (error) {
            // 원본 파일이 없으면 백업 생략
            if ((error as any).code !== 'ENOENT') {
                console.warn('백업 파일 생성 실패:', error);
            }
        }

        // 임시 파일에 쓰기
        const tempPath = `${filePath}.tmp`;
        await fs.writeFile(tempPath, data, 'utf8');

        // 원자적 이동
        await fs.rename(tempPath, filePath);

        console.log(`파일 안전 저장 완료: ${filePath}`);
    });
}

/**
 * JSON 데이터를 안전하게 읽습니다.
 */
export async function safeReadJSON<T>(filePath: string, defaultValue: T): Promise<T> {
    try {
        const content = await safeReadFile(filePath);
        return JSON.parse(content);
    } catch (error) {
        console.warn(`JSON 파일 읽기 실패, 기본값 사용: ${filePath}`, error);
        return defaultValue;
    }
}

/**
 * JSON 데이터를 안전하게 씁니다.
 */
export async function safeWriteJSON<T>(filePath: string, data: T): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    await safeWriteFile(filePath, jsonString);
}

/**
 * 파일 백업을 복원합니다.
 */
export async function restoreFromBackup(filePath: string): Promise<boolean> {
    const backupPath = `${filePath}.backup`;
    try {
        const backupData = await fs.readFile(backupPath, 'utf8');
        await fs.writeFile(filePath, backupData, 'utf8');
        console.log(`백업에서 복원 완료: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`백업 복원 실패: ${filePath}`, error);
        return false;
    }
} 