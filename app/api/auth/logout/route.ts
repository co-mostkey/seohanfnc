import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 사용자 데이터 타입 정의
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
    users: any[];
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

// 사용자 데이터 저장 함수
function saveUsers(data: UsersData): void {
    try {
        const usersPath = path.join(process.cwd(), 'data', 'db', 'users.json');

        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalSessions = data.sessions.filter(session => session.isActive).length;

        fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('사용자 데이터 저장 실패:', error);
        throw error;
    }
}

// POST: 로그아웃
export async function POST(request: NextRequest) {
    try {
        const sessionId = request.cookies.get('sessionId')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: '세션이 없습니다.' },
                { status: 400 }
            );
        }

        const usersData = loadUsers();

        // 세션 비활성화
        const sessionIndex = usersData.sessions.findIndex(session => session.id === sessionId);
        if (sessionIndex !== -1) {
            usersData.sessions[sessionIndex].isActive = false;
        }

        // 데이터 저장
        saveUsers(usersData);

        // 응답 생성
        const response = NextResponse.json({
            success: true,
            message: '로그아웃되었습니다.'
        });

        // 쿠키 삭제
        response.cookies.delete('sessionId');
        response.cookies.delete('isAuthenticated');
        response.cookies.delete('userRole');

        return response;

    } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        return NextResponse.json(
            { success: false, error: '로그아웃 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 