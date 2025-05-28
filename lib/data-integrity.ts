import { AdminUsersData, AdminUser } from '@/types/user';
import { MemberData, Member } from '@/types/member';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'db');

/**
 * 관리자 사용자 데이터 무결성 검증
 */
export function validateAdminUsersData(data: any): data is AdminUsersData {
    if (!data || typeof data !== 'object') {
        return false;
    }

    // users 배열 검증
    if (!Array.isArray(data.users)) {
        return false;
    }

    // 각 사용자 객체 검증
    for (const user of data.users) {
        if (!validateAdminUser(user)) {
            return false;
        }
    }

    // roles 객체 검증
    if (!data.roles || typeof data.roles !== 'object') {
        return false;
    }

    // sessions 배열 검증
    if (!Array.isArray(data.sessions)) {
        return false;
    }

    // metadata 객체 검증
    if (!data.metadata || typeof data.metadata !== 'object') {
        return false;
    }

    return true;
}

/**
 * 관리자 사용자 객체 검증
 */
export function validateAdminUser(user: any): user is AdminUser {
    return (
        user &&
        typeof user === 'object' &&
        typeof user.id === 'string' &&
        typeof user.username === 'string' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        typeof user.role === 'string' &&
        typeof user.isActive === 'boolean' &&
        typeof user.createdAt === 'string' &&
        typeof user.lastLogin === 'string' &&
        Array.isArray(user.permissions)
    );
}

/**
 * 회원 데이터 무결성 검증
 */
export function validateMemberData(data: any): data is MemberData {
    if (!data || typeof data !== 'object') {
        return false;
    }

    // members 배열 검증
    if (!Array.isArray(data.members)) {
        return false;
    }

    // 각 회원 객체 검증
    for (const member of data.members) {
        if (!validateMember(member)) {
            return false;
        }
    }

    // metadata 객체 검증
    if (!data.metadata || typeof data.metadata !== 'object') {
        return false;
    }

    return true;
}

/**
 * 회원 객체 검증
 */
export function validateMember(member: any): member is Member {
    return (
        member &&
        typeof member === 'object' &&
        typeof member.id === 'string' &&
        typeof member.email === 'string' &&
        typeof member.name === 'string' &&
        typeof member.status === 'string' &&
        typeof member.emailVerified === 'boolean' &&
        typeof member.createdAt === 'string' &&
        typeof member.source === 'string' &&
        typeof member.marketingConsent === 'boolean' &&
        typeof member.privacyConsent === 'boolean'
    );
}

/**
 * 데이터 자동 복구 시스템
 */
export class DataRecoverySystem {
    private static instance: DataRecoverySystem;

    static getInstance(): DataRecoverySystem {
        if (!DataRecoverySystem.instance) {
            DataRecoverySystem.instance = new DataRecoverySystem();
        }
        return DataRecoverySystem.instance;
    }

    /**
     * 관리자 사용자 데이터 검증 및 복구
     */
    async validateAndRecoverAdminUsers(filePath: string): Promise<AdminUsersData> {
        try {
            const data = await safeReadJSON<any>(filePath, null);

            if (validateAdminUsersData(data)) {
                // 데이터가 유효하지만 빈 배열인 경우 기본 데이터로 복구
                if (data.users.length === 0) {
                    console.warn('[DataRecovery] 관리자 사용자가 없음, 기본 데이터로 복구');
                    const defaultData = this.getDefaultAdminUsersData();
                    await safeWriteJSON(filePath, defaultData);
                    return defaultData;
                }
                return data;
            } else {
                console.warn('[DataRecovery] 관리자 사용자 데이터 무결성 검증 실패, 기본 데이터로 복구');
                const defaultData = this.getDefaultAdminUsersData();
                await safeWriteJSON(filePath, defaultData);
                return defaultData;
            }
        } catch (error) {
            console.error('[DataRecovery] 관리자 사용자 데이터 복구 실패:', error);
            const defaultData = this.getDefaultAdminUsersData();
            await safeWriteJSON(filePath, defaultData);
            return defaultData;
        }
    }

    /**
     * 회원 데이터 검증 및 복구
     */
    async validateAndRecoverMembers(filePath: string): Promise<MemberData> {
        try {
            const data = await safeReadJSON<any>(filePath, null);

            if (validateMemberData(data)) {
                return data;
            } else {
                console.warn('[DataRecovery] 회원 데이터 무결성 검증 실패, 기본 데이터로 복구');
                const defaultData = this.getDefaultMemberData();
                await safeWriteJSON(filePath, defaultData);
                return defaultData;
            }
        } catch (error) {
            console.error('[DataRecovery] 회원 데이터 복구 실패:', error);
            const defaultData = this.getDefaultMemberData();
            await safeWriteJSON(filePath, defaultData);
            return defaultData;
        }
    }

    /**
     * 기본 관리자 사용자 데이터 생성
     */
    private getDefaultAdminUsersData(): AdminUsersData {
        return {
            users: [
                {
                    id: "admin-001",
                    username: "admin",
                    password: "$2b$10$hashedPasswordForAdmin123",
                    email: "admin@seohanfc.com",
                    role: "관리자",
                    name: "시스템 관리자",
                    isActive: true,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    lastLogin: new Date().toISOString(),
                    permissions: [
                        "admin.full",
                        "users.manage",
                        "content.manage",
                        "system.manage",
                        "statistics.view"
                    ]
                },
                {
                    id: "editor-001",
                    username: "editor",
                    password: "$2b$10$hashedPasswordForEditor123",
                    email: "editor@seohanfc.com",
                    role: "에디터",
                    name: "콘텐츠 에디터",
                    isActive: true,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    lastLogin: "2024-01-19T15:30:00.000Z",
                    permissions: [
                        "content.manage",
                        "products.manage",
                        "inquiries.manage"
                    ]
                }
            ],
            roles: {
                "관리자": {
                    name: "관리자",
                    description: "시스템 전체 관리 권한",
                    permissions: ["admin.full", "users.manage", "content.manage", "system.manage", "statistics.view"],
                    level: 100
                },
                "에디터": {
                    name: "에디터",
                    description: "콘텐츠 관리 권한",
                    permissions: ["content.manage", "products.manage", "inquiries.manage"],
                    level: 50
                },
                "스태프": {
                    name: "스태프",
                    description: "기본 스태프 권한",
                    permissions: ["inquiries.view", "statistics.view"],
                    level: 20
                }
            },
            sessions: [],
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalUsers: 2,
                activeUsers: 2,
                totalSessions: 0
            }
        };
    }

    /**
     * 기본 회원 데이터 생성
     */
    private getDefaultMemberData(): MemberData {
        return {
            members: [],
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalMembers: 0,
                activeMembers: 0,
                pendingMembers: 0
            }
        };
    }
}

/**
 * 전역 데이터 복구 시스템 인스턴스
 */
export const dataRecovery = DataRecoverySystem.getInstance(); 