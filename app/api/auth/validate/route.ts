import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 사용자 타입 정의
interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    permissions: string[];
}

interface Session {
    id: string;
    userId: string;
    username: string;
    role: string;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
}

interface UsersData {
    users: User[];
    roles: Record<string, any>;
    sessions: Session[];
    metadata: {
        lastUpdated: string;
        totalUsers: number;
        activeUsers: number;
        totalSessions: number;
    };
}

// 사용자 데이터 로드 함수
function loadUsers(): UsersData {
    try {
        const usersPath = path.join(process.cwd(), 'data', 'db', 'users.json');
        const usersData = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(usersData);
    } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
        return {
            users: [],
            roles: {},
            sessions: [],
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalUsers: 0,
                activeUsers: 0,
                totalSessions: 0
            }
        };
    }
}

// POST: 세션 검증
export async function POST(request: NextRequest) {
    try {
        console.log('[ValidateAPI] 세션 검증 요청 시작');

        // 쿠키에서 세션 ID 읽기
        const sessionId = request.cookies.get('sessionId')?.value;
        console.log('[ValidateAPI] 쿠키에서 세션 ID:', sessionId ? '존재함' : '없음');

        if (!sessionId) {
            console.log('[ValidateAPI] 세션 ID 없음');
            return NextResponse.json(
                { success: false, error: '세션 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const usersData = loadUsers();
        console.log('[ValidateAPI] 사용자 데이터 로드 완료');

        // 최상위 sessions 배열에서 세션 찾기
        const validSession = usersData.sessions.find((s: any) =>
            s.id === sessionId &&
            s.isActive &&
            new Date(s.expiresAt) > new Date()
        );

        if (!validSession) {
            console.log('[ValidateAPI] 유효한 세션을 찾을 수 없음');
            return NextResponse.json(
                { success: false, error: '유효하지 않은 세션입니다.' },
                { status: 401 }
            );
        }

        // 세션의 userId로 사용자 찾기
        const sessionUser = usersData.users.find((u: User) => u.id === validSession.userId);

        if (!sessionUser) {
            console.log('[ValidateAPI] 세션에 해당하는 사용자를 찾을 수 없음');
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 401 }
            );
        }

        if (!sessionUser.isActive) {
            console.log('[ValidateAPI] 비활성 사용자');
            return NextResponse.json(
                { success: false, error: '비활성 사용자입니다.' },
                { status: 401 }
            );
        }

        console.log('[ValidateAPI] 세션 검증 성공:', { userId: sessionUser.id, role: sessionUser.role });

        return NextResponse.json({
            success: true,
            user: {
                id: sessionUser.id,
                username: sessionUser.username,
                name: sessionUser.name,
                email: sessionUser.email,
                role: sessionUser.role,
                permissions: sessionUser.permissions
            },
            session: {
                id: validSession.id,
                expiresAt: validSession.expiresAt
            }
        });

    } catch (error: any) {
        console.error('[ValidateAPI] 세션 검증 오류:', error);
        return NextResponse.json(
            { success: false, error: '세션 검증 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 