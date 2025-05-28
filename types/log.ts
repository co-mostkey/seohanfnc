/**
 * 관리자 활동 로그 시스템을 위한 타입 정의
 */

// 로그 레벨 정의
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// 로그 범주 정의
export type LogCategory =
    | 'auth'
    | 'user'
    | 'product'
    | 'post'
    | 'inquiry'
    | 'content'
    | 'backup'
    | 'setting'
    | 'menu'
    | 'design'
    | 'security'
    | 'api'
    | 'system';

// 로그 항목 타입 정의
export interface LogEntry {
    id: string;
    timestamp: string;
    level: LogLevel;
    category: LogCategory;
    action: string;
    message: string;
    userId?: string;
    username?: string;
    details?: Record<string, any>;
    ip?: string;
    userAgent?: string;
    path?: string;
    method?: string;
    status?: number;
    duration?: number;
}

// 로그 필터 옵션 타입 정의
export interface LogFilterOptions {
    level?: LogLevel;
    category?: LogCategory;
    startDate?: string;
    endDate?: string;
    username?: string;
    action?: string;
    search?: string;
    limit?: number;
    page?: number;
}

// 로그 검색 결과 타입 정의
export interface LogSearchResult {
    logs: LogEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// 로그 통계 데이터 타입 정의
export interface LogStats {
    totalLogs: number;
    logsByLevel: Record<LogLevel, number>;
    logsByCategory: Record<string, number>;
    logsByDay: Record<string, number>;
    topActions: Array<{ action: string, count: number }>;
    topUsers: Array<{ username: string, count: number }>;
    recentErrors: LogEntry[];
} 