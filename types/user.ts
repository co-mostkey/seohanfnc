// 사용자 권한 타입 정의
export type UserRole = '관리자' | '에디터' | '스태프' | '일반 사용자' | '게스트';

/**
 * 관리자 사용자 타입 정의
 */
export interface AdminUser {
    id: string;
    username: string;
    password?: string; // 평문 비밀번호 (입력용)
    passwordHash?: string; // 해시된 비밀번호 (저장용)
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    permissions: string[];
}

/**
 * 관리자 사용자 데이터 구조
 */
export interface AdminUsersData {
    users: AdminUser[];
    roles: Record<string, {
        name: string;
        description: string;
        permissions: string[];
        level: number;
    }>;
    sessions: AdminSession[];
    metadata: {
        lastUpdated: string;
        totalUsers: number;
        activeUsers: number;
        totalSessions: number;
    };
}

/**
 * 관리자 세션 타입
 */
export interface AdminSession {
    id: string;
    userId: string;
    username: string;
    role: string;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
} 