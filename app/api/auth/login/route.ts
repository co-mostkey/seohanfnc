import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AdminUser, AdminUsersData, AdminSession } from '@/types/user';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';
import { dataRecovery } from '@/lib/data-integrity';

const dataDir = path.join(process.cwd(), 'data', 'db');
const usersFilePath = path.join(dataDir, 'users.json');

// 기본 관리자 사용자 데이터 (로그인 API용)
const defaultUsersData: AdminUsersData = {
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

// 사용자 데이터 로드 함수 (무결성 검증 포함)
async function loadUsers(): Promise<{ data: AdminUsersData; hasValidData: boolean; errorType?: string }> {
    try {
        console.log('[LoadUsers] 관리자 사용자 데이터 로드 시작');
        const data = await dataRecovery.validateAndRecoverAdminUsers(usersFilePath);

        if (data.users.length === 0) {
            console.error('[LoadUsers] 등록된 사용자가 없습니다');
            return {
                data,
                hasValidData: false,
                errorType: 'NO_USERS'
            };
        }

        console.log('[LoadUsers] 사용자 데이터 로드 성공, 총 사용자:', data.users.length);
        return {
            data,
            hasValidData: true
        };

    } catch (error) {
        console.error('[LoadUsers] 사용자 데이터 로드 실패:', error);

        // 기본 데이터로 복구 시도
        try {
            const defaultData = await dataRecovery.validateAndRecoverAdminUsers(usersFilePath);
            return {
                data: defaultData,
                hasValidData: false,
                errorType: 'RECOVERED_FROM_DEFAULT'
            };
        } catch (recoveryError) {
            console.error('[LoadUsers] 데이터 복구도 실패:', recoveryError);
            return {
                data: {
                    users: [],
                    roles: {},
                    sessions: [],
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        totalUsers: 0,
                        activeUsers: 0,
                        totalSessions: 0
                    }
                },
                hasValidData: false,
                errorType: 'CRITICAL_ERROR'
            };
        }
    }
}

// 사용자 데이터 저장 함수 (무결성 검증 포함)
async function saveUsers(data: AdminUsersData): Promise<void> {
    try {
        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalUsers = data.users.length;
        data.metadata.activeUsers = data.users.filter(user => user.isActive).length;
        data.metadata.totalSessions = data.sessions.filter(session => session.isActive).length;

        // 데이터 검증
        if (!data.users || !Array.isArray(data.users)) {
            throw new Error('잘못된 사용자 데이터 구조');
        }

        await safeWriteJSON(usersFilePath, data);
        console.log('[SaveUsers] 사용자 데이터 저장 완료, 사용자 수:', data.users.length);
    } catch (error) {
        console.error('[SaveUsers] 사용자 데이터 저장 실패:', error);
        throw error;
    }
}

// 간단한 비밀번호 검증 (실제 환경에서는 bcrypt 사용 권장)
function verifyPassword(inputPassword: string, storedPassword: string): boolean {
    // 현재는 하드코딩된 비밀번호와 비교
    if (inputPassword === 'admin123' && storedPassword.includes('$2b$10$')) {
        return true;
    }
    if (inputPassword === 'editor123' && storedPassword.includes('$2b$10$')) {
        return true;
    }
    return inputPassword === storedPassword;
}

// 세션 생성
function createSession(user: AdminUser): AdminSession {
    const sessionId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 후 만료

    return {
        id: sessionId,
        userId: user.id,
        username: user.username,
        role: user.role,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true
    };
}

// POST: 로그인
export async function POST(request: NextRequest) {
    try {
        console.log('[LoginAPI] 로그인 요청 시작');

        // 요청 본문 검증
        let body;
        try {
            const text = await request.text();
            console.log('[LoginAPI] 요청 본문 길이:', text.length);

            if (!text || text.trim() === '') {
                console.log('[LoginAPI] 빈 요청 본문');
                return NextResponse.json(
                    { success: false, error: '요청 데이터가 없습니다.' },
                    { status: 400 }
                );
            }

            body = JSON.parse(text);
        } catch (parseError) {
            console.log('[LoginAPI] JSON 파싱 오류:', parseError);
            return NextResponse.json(
                { success: false, error: '잘못된 요청 형식입니다.' },
                { status: 400 }
            );
        }

        const { username, password } = body;
        console.log('[LoginAPI] 로그인 시도:', { username });

        if (!username || !password) {
            console.log('[LoginAPI] 필수 필드 누락');
            return NextResponse.json(
                { success: false, error: '아이디와 비밀번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        const { data: usersData, hasValidData } = await loadUsers();
        console.log('[LoginAPI] 사용자 데이터 로드 완료, 총 사용자:', usersData.users.length);

        if (!hasValidData) {
            console.log('[LoginAPI] 사용자 데이터가 유효하지 않음');
            return NextResponse.json(
                { success: false, error: '사용자 데이터가 유효하지 않습니다.' },
                { status: 500 }
            );
        }

        // 사용자 찾기
        const user = usersData.users.find(u => u.username === username && u.isActive);

        if (!user) {
            console.log('[LoginAPI] 사용자를 찾을 수 없음:', username);

            // 관리자 계정을 찾으려고 했는데 없는 경우 특별한 메시지
            if (username === 'admin') {
                return NextResponse.json(
                    { success: false, error: '사용자를 찾을 수 없습니다. 관리자 계정이 손실되었을 수 있습니다.' },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                { success: false, error: '아이디 또는 비밀번호가 잘못되었습니다.' },
                { status: 401 }
            );
        }

        console.log('[LoginAPI] 사용자 찾음:', { id: user.id, role: user.role });

        // 비밀번호 검증
        if (!verifyPassword(password, user.password)) {
            console.log('[LoginAPI] 비밀번호 불일치');
            return NextResponse.json(
                { success: false, error: '아이디 또는 비밀번호가 잘못되었습니다.' },
                { status: 401 }
            );
        }

        console.log('[LoginAPI] 비밀번호 검증 성공');

        // 기존 세션 비활성화
        const oldActiveSessions = usersData.sessions.filter(s => s.userId === user.id && s.isActive).length;
        usersData.sessions = usersData.sessions.map(session =>
            session.userId === user.id ? { ...session, isActive: false } : session
        );
        console.log('[LoginAPI] 기존 활성 세션 비활성화:', oldActiveSessions);

        // 새 세션 생성
        const newSession = createSession(user);
        usersData.sessions.push(newSession);
        console.log('[LoginAPI] 새 세션 생성:', { sessionId: newSession.id, expiresAt: newSession.expiresAt });

        // 마지막 로그인 시간 업데이트
        const userIndex = usersData.users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            usersData.users[userIndex].lastLogin = new Date().toISOString();
        }

        // 데이터 저장
        await saveUsers(usersData);
        console.log('[LoginAPI] 사용자 데이터 저장 완료');

        // 응답 생성
        const response = NextResponse.json({
            success: true,
            message: '로그인에 성공했습니다.',
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            },
            session: {
                id: newSession.id,
                expiresAt: newSession.expiresAt
            }
        });

        console.log('[LoginAPI] 쿠키 설정 시작');

        // 쿠키 설정
        response.cookies.set('sessionId', newSession.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7일
            path: '/'
        });

        response.cookies.set('isAuthenticated', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7일
            path: '/'
        });

        response.cookies.set('userRole', user.role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7일
            path: '/'
        });

        console.log('[LoginAPI] 쿠키 설정 완료, 응답 반환');
        return response;

    } catch (error) {
        console.error('[LoginAPI] 로그인 처리 중 오류:', error);
        return NextResponse.json(
            { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 