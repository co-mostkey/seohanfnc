// 이 파일은 서버 컴포넌트나 API 라우트에서만 사용됩니다
import 'server-only';

/**
 * 간단한 뮤텍스 구현
 * 동일한 리소스에 대한 동시 접근을 제어하기 위한 기능 제공
 */

interface MutexLock {
    release: () => void;
}

class Mutex {
    private locks: Map<string, Promise<void>> = new Map();

    /**
     * 특정 키에 대한 잠금 획득
     * @param key 잠금 키
     * @param timeout 타임아웃(ms)
     * @returns 잠금 객체
     */
    async acquire(key: string, timeout = 30000): Promise<MutexLock> {
        let release: () => void = () => { };
        const startTime = Date.now();

        // 기존 잠금이 있으면 해제될 때까지 대기
        while (this.locks.has(key)) {
            // 타임아웃 체크
            if (Date.now() - startTime > timeout) {
                throw new Error(`Mutex acquisition timed out after ${timeout}ms for key: ${key}`);
            }

            // 기존 잠금이 완료될 때까지 대기
            await this.locks.get(key);

            // 다른 프로세스가 잠금을 획득했을 수 있으므로 짧게 대기 후 재시도
            if (this.locks.has(key)) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        // 새 잠금 생성
        const lockPromise = new Promise<void>(resolve => {
            release = () => {
                this.locks.delete(key);
                resolve();
            };
        });

        // 잠금 등록
        this.locks.set(key, lockPromise);

        // 잠금 객체 반환
        return { release };
    }

    /**
     * 특정 키에 대한 잠금 상태 확인
     * @param key 잠금 키
     * @returns 잠금 상태
     */
    isLocked(key: string): boolean {
        return this.locks.has(key);
    }

    /**
     * 모든 잠금 해제 (비상용)
     */
    releaseAll(): void {
        this.locks.clear();
    }
}

// 싱글톤 인스턴스 생성
const mutex = new Mutex();
export default mutex;

/**
 * 뮤텍스를 사용하여 함수 실행 (자동 잠금/해제)
 * @param key 잠금 키
 * @param fn 실행할 함수
 * @param timeout 타임아웃(ms)
 * @returns 함수 실행 결과
 */
export async function withMutex<T>(key: string, fn: () => Promise<T>, timeout?: number): Promise<T> {
    const lock = await mutex.acquire(key, timeout);
    try {
        return await fn();
    } finally {
        lock.release();
    }
} 