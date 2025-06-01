import * as fs from 'fs';
import * as path from 'path';

/**
 * 파일 백업 함수
 * @param filePath 백업할 파일 경로
 * @param backupDir 백업 디렉토리 경로 (기본값: data/db/backups)
 */
export async function backupDataFile(filePath: string, backupDir: string = 'data/db/backups'): Promise<void> {
    try {
        if (!fs.existsSync(filePath)) {
            return;
        }

        // 백업 디렉토리 생성
        ensureDirExists(backupDir);

        const fileName = path.basename(filePath);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `${fileName}.${timestamp}.backup`);

        // 파일 복사
        fs.copyFileSync(filePath, backupPath);

        // 오래된 백업 삭제 (최대 10개 유지)
        const backups = fs.readdirSync(backupDir)
            .filter(file => file.startsWith(fileName) && file.endsWith('.backup'))
            .sort()
            .reverse();

        if (backups.length > 10) {
            backups.slice(10).forEach(backup => {
                fs.unlinkSync(path.join(backupDir, backup));
            });
        }
    } catch (error) {
        console.error('백업 실패:', error);
    }
}

/**
 * 디렉토리 존재 확인 및 생성
 * @param dirPath 디렉토리 경로
 */
export function ensureDirExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * 문서 데이터 유효성 검사
 * @param data 검사할 데이터
 */
export function validateDocumentData(data: any): boolean {
    if (!data || typeof data !== 'object') {
        return false;
    }

    // 필수 필드 확인
    const requiredFields = ['title', 'category'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return false;
        }
    }

    return true;
}

/**
 * 회원 데이터 유효성 검사
 * @param data 검사할 데이터
 */
export function validateMemberData(data: any): boolean {
    if (!data || typeof data !== 'object') {
        return false;
    }

    // 필수 필드 확인
    const requiredFields = ['email', 'name'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return false;
        }
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    return true;
}

/**
 * 문의 데이터 유효성 검사
 * @param data 검사할 데이터
 */
export function validateInquiriesData(data: any): boolean {
    if (!data || typeof data !== 'object') {
        return false;
    }

    // 문의 목록이 배열인지 확인
    if (data.inquiries && !Array.isArray(data.inquiries)) {
        return false;
    }

    return true;
} 