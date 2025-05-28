/**
 * 로깅 시스템 구현
 * 관리자 활동 로그를 저장하고 조회하는 기능을 제공합니다.
 */
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import 'server-only';
import { LogEntry, LogLevel, LogCategory, LogFilterOptions, LogSearchResult, LogStats } from '@/types/log';
import { withMutex } from './mutex';

// Edge 런타임 감지 (process.cwd가 없는 경우 Edge 런타임으로 간주)
const isEdgeRuntime = typeof process === 'undefined' || !process.cwd;

// 로그 디렉토리 및 파일 경로 결정 함수
const getLogPaths = () => {
    // Edge 런타임인 경우 더미 경로 반환
    if (isEdgeRuntime) {
        return {
            logDir: '/logs',
            adminLogFile: '/logs/admin-activity.json'
        };
    }

    // Node.js 환경에서는 process.cwd() 사용
    const logDir = path.join(process.cwd(), 'logs');
    const adminLogFile = path.join(logDir, 'admin-activity.json');

    return { logDir, adminLogFile };
};

// 로그 경로 가져오기
const { logDir: LOG_DIR, adminLogFile: ADMIN_LOG_FILE } = getLogPaths();

// 로그 디렉토리 존재 확인 및 생성
const ensureLogDirectory = () => {
    if (isEdgeRuntime) return; // Edge 런타임에서는 건너뜀

    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
};

// 로그 파일 존재 확인 및 생성
const ensureLogFile = () => {
    if (isEdgeRuntime) return; // Edge 런타임에서는 건너뜀

    if (!fs.existsSync(ADMIN_LOG_FILE)) {
        fs.writeFileSync(ADMIN_LOG_FILE, JSON.stringify({ logs: [] }), 'utf8');
    }
};

// Node.js 환경에서만 파일 시스템 초기화
if (!isEdgeRuntime) {
    // 로그 파일 초기화 확인
    ensureLogDirectory();
    ensureLogFile();
}

// 로그 엔트리를 로그 파일에 저장
const saveLogEntry = async (entry: LogEntry): Promise<void> => {
    // Edge 런타임에서는 로그 저장을 건너뜀
    if (isEdgeRuntime) {
        console.log('[Edge] 로그 저장 스킵:', entry.action);
        return;
    }

    return withMutex('admin_log_write', async () => {
        let logData = { logs: [] as LogEntry[] };

        try {
            const fileContent = fs.readFileSync(ADMIN_LOG_FILE, 'utf8');
            logData = JSON.parse(fileContent);
        } catch (error) {
            console.error('로그 파일을 읽는 중 오류가 발생했습니다:', error);
            ensureLogFile();
        }

        // 로그 항목 추가
        logData.logs.unshift(entry);

        // 로그 파일 최대 크기 제한 (약 1000개 항목)
        if (logData.logs.length > 1000) {
            // 아카이빙 처리할 수 있음 (여기서는 간단히 자름)
            logData.logs = logData.logs.slice(0, 1000);
        }

        try {
            fs.writeFileSync(ADMIN_LOG_FILE, JSON.stringify(logData, null, 2), 'utf8');
        } catch (error) {
            console.error('로그 파일을 쓰는 중 오류가 발생했습니다:', error);
        }
    });
};

/**
 * 새 로그 항목 생성
 */
export const createLog = async ({
    level,
    category,
    action,
    message,
    userId,
    username,
    details,
    request,
    status,
    duration
}: {
    level: LogLevel;
    category: LogCategory;
    action: string;
    message: string;
    userId?: string;
    username?: string;
    details?: Record<string, any>;
    request?: Request;
    status?: number;
    duration?: number;
}): Promise<LogEntry> => {
    // 요청에서 IP 및 User-Agent 정보 추출
    let ip = '';
    let userAgent = '';
    let path = '';
    let method = '';

    if (request) {
        try {
            const headersList = await headers();
            ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
            userAgent = headersList.get('user-agent') || 'unknown';
            path = new URL(request.url).pathname;
            method = request.method;
        } catch (error) {
            console.error('요청 정보 추출 중 오류:', error);
        }
    }

    // 로그 항목 생성
    const logEntry: LogEntry = {
        id: uuid(),
        timestamp: new Date().toISOString(),
        level,
        category,
        action,
        message,
        userId,
        username,
        details,
        ip,
        userAgent,
        path,
        method,
        status,
        duration
    };

    // Edge 런타임에서는 콘솔 로그만 출력
    if (isEdgeRuntime) {
        console.log(`[Edge Log] ${level.toUpperCase()} - ${category} - ${action}: ${message}`);
        return logEntry;
    }

    // 로그 저장 (Node.js 환경)
    await saveLogEntry(logEntry);

    return logEntry;
};

/**
 * 레벨별 로그 생성 함수
 */
export const logInfo = (category: LogCategory, action: string, message: string, options?: Omit<Parameters<typeof createLog>[0], 'level' | 'category' | 'action' | 'message'>) => {
    return createLog({ level: 'info', category, action, message, ...options });
};

export const logWarn = (category: LogCategory, action: string, message: string, options?: Omit<Parameters<typeof createLog>[0], 'level' | 'category' | 'action' | 'message'>) => {
    return createLog({ level: 'warn', category, action, message, ...options });
};

export const logError = (category: LogCategory, action: string, message: string, options?: Omit<Parameters<typeof createLog>[0], 'level' | 'category' | 'action' | 'message'>) => {
    return createLog({ level: 'error', category, action, message, ...options });
};

export const logDebug = (category: LogCategory, action: string, message: string, options?: Omit<Parameters<typeof createLog>[0], 'level' | 'category' | 'action' | 'message'>) => {
    // Edge 런타임에서는 NODE_ENV 접근 불가능하므로 항상 로깅
    if (isEdgeRuntime || process.env.NODE_ENV === 'development') {
        return createLog({ level: 'debug', category, action, message, ...options });
    }
    return Promise.resolve(null as unknown as LogEntry);
};

/**
 * 로그 검색 및 필터링
 */
export const searchLogs = async (options: LogFilterOptions = {}): Promise<LogSearchResult> => {
    // Edge 런타임에서는 빈 결과 반환
    if (isEdgeRuntime) {
        return {
            logs: [],
            total: 0,
            page: 1,
            limit: 50,
            totalPages: 0
        };
    }

    return withMutex('admin_log_read', async () => {
        try {
            // 기본값 설정
            const {
                level,
                category,
                startDate,
                endDate,
                username,
                action,
                search,
                limit = 50,
                page = 1
            } = options;

            // 로그 파일 읽기
            const fileContent = fs.readFileSync(ADMIN_LOG_FILE, 'utf8');
            const logData = JSON.parse(fileContent);

            // 필터링
            let filteredLogs = logData.logs as LogEntry[];

            if (level) {
                filteredLogs = filteredLogs.filter(log => log.level === level);
            }

            if (category) {
                filteredLogs = filteredLogs.filter(log => log.category === category);
            }

            if (startDate) {
                const startDateTime = new Date(startDate).getTime();
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp).getTime() >= startDateTime);
            }

            if (endDate) {
                const endDateTime = new Date(endDate).getTime();
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp).getTime() <= endDateTime);
            }

            if (username) {
                filteredLogs = filteredLogs.filter(log => log.username?.includes(username));
            }

            if (action) {
                filteredLogs = filteredLogs.filter(log => log.action === action);
            }

            if (search) {
                const searchLower = search.toLowerCase();
                filteredLogs = filteredLogs.filter(log =>
                    log.message.toLowerCase().includes(searchLower) ||
                    log.username?.toLowerCase().includes(searchLower) ||
                    log.action.toLowerCase().includes(searchLower) ||
                    log.category.toLowerCase().includes(searchLower)
                );
            }

            // 총 개수 계산
            const total = filteredLogs.length;
            const totalPages = Math.ceil(total / limit);

            // 페이지네이션
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

            return {
                logs: paginatedLogs,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error) {
            console.error('로그 검색 중 오류가 발생했습니다:', error);
            return {
                logs: [],
                total: 0,
                page: 1,
                limit: 50,
                totalPages: 0
            };
        }
    });
};

/**
 * 로그 통계 계산
 */
export const getLogStats = async (): Promise<LogStats> => {
    // Edge 런타임에서는 빈 통계 반환
    if (isEdgeRuntime) {
        return {
            totalLogs: 0,
            logsByLevel: { info: 0, warn: 0, error: 0, debug: 0 },
            logsByCategory: {},
            recentErrors: [],
            topActions: [],
            topUsers: [],
            logsByDay: {}
        };
    }

    return withMutex('admin_log_read', async () => {
        try {
            // 로그 파일 읽기
            const fileContent = fs.readFileSync(ADMIN_LOG_FILE, 'utf8');
            const logData = JSON.parse(fileContent);
            const logs = logData.logs as LogEntry[];

            // 기본 통계
            const totalLogs = logs.length;

            // 레벨별 통계
            const logsByLevel: Record<LogLevel, number> = {
                info: 0,
                warn: 0,
                error: 0,
                debug: 0
            };

            // 카테고리별 통계
            const logsByCategory: Record<string, number> = {};

            // 날짜별 통계
            const logsByDay: Record<string, number> = {};

            // 액션별 통계
            const actionCounts: Record<string, number> = {};

            // 사용자별 통계
            const userCounts: Record<string, number> = {};

            // 최근 에러 목록
            const recentErrors: LogEntry[] = [];

            // 통계 계산
            logs.forEach(log => {
                // 레벨별 카운트
                logsByLevel[log.level] = (logsByLevel[log.level] || 0) + 1;

                // 카테고리별 카운트
                logsByCategory[log.category] = (logsByCategory[log.category] || 0) + 1;

                // 날짜별 카운트 (YYYY-MM-DD 형식)
                const day = log.timestamp.split('T')[0];
                logsByDay[day] = (logsByDay[day] || 0) + 1;

                // 액션별 카운트
                actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;

                // 사용자별 카운트
                if (log.username) {
                    userCounts[log.username] = (userCounts[log.username] || 0) + 1;
                }

                // 에러 수집
                if (log.level === 'error') {
                    recentErrors.push(log);
                }
            });

            // 상위 액션
            const topActions = Object.entries(actionCounts)
                .map(([action, count]) => ({ action, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // 상위 사용자
            const topUsers = Object.entries(userCounts)
                .map(([username, count]) => ({ username, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // 최근 에러 정렬 및 제한
            recentErrors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            const limitedRecentErrors = recentErrors.slice(0, 10);

            return {
                totalLogs,
                logsByLevel,
                logsByCategory,
                logsByDay,
                topActions,
                topUsers,
                recentErrors: limitedRecentErrors
            };
        } catch (error) {
            console.error('로그 통계 계산 중 오류가 발생했습니다:', error);
            return {
                totalLogs: 0,
                logsByLevel: { info: 0, warn: 0, error: 0, debug: 0 },
                logsByCategory: {},
                logsByDay: {},
                topActions: [],
                topUsers: [],
                recentErrors: []
            };
        }
    });
};

/**
 * 로그 삭제
 */
export const clearLogs = async (olderThan?: Date): Promise<boolean> => {
    // Edge 런타임에서는 항상 성공 반환
    if (isEdgeRuntime) {
        return true;
    }

    return withMutex('admin_log_write', async () => {
        try {
            if (olderThan) {
                // 특정 날짜보다 오래된 로그만 삭제
                const targetTime = olderThan.getTime();

                const fileContent = fs.readFileSync(ADMIN_LOG_FILE, 'utf8');
                const logData = JSON.parse(fileContent);

                logData.logs = logData.logs.filter((log: LogEntry) =>
                    new Date(log.timestamp).getTime() > targetTime
                );

                fs.writeFileSync(ADMIN_LOG_FILE, JSON.stringify(logData, null, 2), 'utf8');
            } else {
                // 모든 로그 초기화
                fs.writeFileSync(ADMIN_LOG_FILE, JSON.stringify({ logs: [] }, null, 2), 'utf8');
            }

            return true;
        } catch (error) {
            console.error('로그 삭제 중 오류가 발생했습니다:', error);
            return false;
        }
    });
}; 