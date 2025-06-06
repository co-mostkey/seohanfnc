import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// 인트라넷 사용자 데이터 타입
interface IntranetUser {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    name: string;
    department: string;
    position: string;
    employeeId: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string | null;
    permissions: string[];
}

interface IntranetSession {
    id: string;
    userId: string;
    username: string;
    role: string;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
}

interface IntranetDatabase {
    users: IntranetUser[];
    roles: Record<string, any>;
    sessions: IntranetSession[];
    pendingUsers: any[];
    metadata: {
        lastUpdated: string;
        totalUsers: number;
        activeUsers: number;
        totalSessions: number;
        pendingApprovals: number;
    };
}

// 테스트용 기본 비밀번호 (실제 운영에서는 환경변수로 관리)
const DEFAULT_PASSWORDS: Record<string, string> = {
    'intranet_admin': process.env.ADMIN_DEFAULT_PASSWORD || 'seohanfnc2024!@#'
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: '사용자명과 비밀번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        // 인트라넷 사용자 데이터베이스 읽기
        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const dbData = await fs.readFile(dbPath, 'utf8');
        const database: IntranetDatabase = JSON.parse(dbData);

        // 사용자 찾기
        const user = database.users.find(u => u.username === username);

        if (!user) {
            return NextResponse.json(
                { success: false, error: '사용자명 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        // 활성 사용자인지 확인
        if (!user.isActive) {
            return NextResponse.json(
                { success: false, error: '비활성화된 계정입니다. 관리자에게 문의하세요.' },
                { status: 403 }
            );
        }

        // 비밀번호 검증
        let isValidPassword = false;

        // 해시된 비밀번호와 비교
        if (user.password.startsWith('$2b$')) {
            // 테스트 환경에서는 기본 비밀번호도 허용
            if (DEFAULT_PASSWORDS[username] && password === DEFAULT_PASSWORDS[username]) {
                isValidPassword = true;
            } else {
                try {
                    isValidPassword = await bcrypt.compare(password, user.password);
                } catch (err) {
                    console.error('비밀번호 비교 오류:', err);
                    isValidPassword = false;
                }
            }
        }

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: '사용자명 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        // 기존 활성 세션 비활성화
        database.sessions = database.sessions.map(session => ({
            ...session,
            isActive: session.userId === user.id ? false : session.isActive
        }));

        // 새 세션 생성
        const sessionId = uuidv4();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일

        const newSession: IntranetSession = {
            id: sessionId,
            userId: user.id,
            username: user.username,
            role: user.role,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            isActive: true
        };

        database.sessions.push(newSession);

        // 마지막 로그인 시간 업데이트
        const userIndex = database.users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            database.users[userIndex].lastLogin = now.toISOString();
        }

        // 메타데이터 업데이트
        database.metadata.lastUpdated = now.toISOString();
        database.metadata.totalSessions = database.sessions.filter(s => s.isActive).length;

        // 데이터베이스 저장
        await fs.writeFile(dbPath, JSON.stringify(database, null, 4), 'utf8');

        // 응답에 쿠키 설정
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                department: user.department,
                position: user.position,
                permissions: user.permissions
            }
        });

        // 인트라넷 세션 쿠키 설정
        response.cookies.set('intranetSessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7일
        });

        response.cookies.set('isIntranetAuthenticated', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7일
        });

        return response;
    } catch (error) {
        console.error('인트라넷 로그인 오류:', error);
        return NextResponse.json(
            { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 