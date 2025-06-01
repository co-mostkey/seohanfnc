/**
 * 디버그 모드 헬퍼 함수
 * [TRISID] 2024-12-19: 시스템 설정의 디버그 모드 적용
 */

import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data/settings.json');

/**
 * 디버그 모드 상태 확인
 * @returns 디버그 모드 활성화 여부
 */
export async function isDebugMode(): Promise<boolean> {
    try {
        const content = await fs.readFile(SETTINGS_FILE, 'utf8');
        const settings = JSON.parse(content);
        return settings.general?.debugMode || false;
    } catch (error) {
        console.error('디버그 모드 설정 확인 실패:', error);
        return false;
    }
}

/**
 * 디버그 정보 포함한 에러 메시지 생성
 * @param error 에러 객체
 * @param context 에러 발생 컨텍스트
 * @returns 디버그 정보가 포함된 에러 메시지
 */
export async function formatErrorMessage(
    error: Error,
    context: string = ''
): Promise<string> {
    const debugEnabled = await isDebugMode();

    if (debugEnabled) {
        return `
[디버그 정보]
컨텍스트: ${context}
에러 메시지: ${error.message}
스택 트레이스: ${error.stack}
발생 시간: ${new Date().toISOString()}
    `.trim();
    } else {
        return '시스템 오류가 발생했습니다. 관리자에게 문의해 주세요.';
    }
}

/**
 * 디버그 로그 출력 (디버그 모드에서만)
 * @param message 로그 메시지
 * @param data 추가 데이터
 */
export async function debugLog(message: string, data?: any): Promise<void> {
    const debugEnabled = await isDebugMode();

    if (debugEnabled) {
        console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
}

/**
 * API 응답에 디버그 정보 추가
 * @param response 기본 응답
 * @param debugInfo 디버그 정보
 * @returns 디버그 정보가 포함된 응답
 */
export async function addDebugInfo(
    response: any,
    debugInfo: any = {}
): Promise<any> {
    const debugEnabled = await isDebugMode();

    if (debugEnabled) {
        return {
            ...response,
            debug: {
                timestamp: new Date().toISOString(),
                ...debugInfo
            }
        };
    }

    return response;
} 