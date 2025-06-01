import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 인트라넷 세션 검증 API
export async function POST(request: NextRequest) {
    try {
        // 쿠키에서 세션 ID 가져오기
        const sessionId = request.cookies.get('intranetSessionId')?.value;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: '세션 ID가 없습니다.' },
                { status: 401 }
            );
        }

        // 인트라넷 데이터베이스 읽기
        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const dbData = await fs.readFile(dbPath, 'utf8');
        const database = JSON.parse(dbData);

        // 세션 찾기
        const session = database.sessions.find((s: any) =>
            s.id === sessionId && s.isActive
        );

        if (!session) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 세션입니다.' },
                { status: 401 }
            );
        }

        // 세션 만료 확인
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);

        if (now > expiresAt) {
            // 만료된 세션 비활성화
            const sessionIndex = database.sessions.findIndex((s: any) => s.id === sessionId);
            if (sessionIndex !== -1) {
                database.sessions[sessionIndex].isActive = false;
                await fs.writeFile(dbPath, JSON.stringify(database, null, 4), 'utf8');
            }

            return NextResponse.json(
                { success: false, error: '세션이 만료되었습니다.' },
                { status: 401 }
            );
        }

        // 사용자 정보 가져오기
        const user = database.users.find((u: any) => u.id === session.userId);

        if (!user || !user.isActive) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없거나 비활성화된 계정입니다.' },
                { status: 401 }
            );
        }

        // 검증 성공
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                department: user.department,
                position: user.position,
                permissions: user.permissions
            },
            session: {
                id: session.id,
                expiresAt: session.expiresAt
            }
        });

    } catch (error) {
        console.error('인트라넷 세션 검증 오류:', error);
        return NextResponse.json(
            { success: false, error: '세션 검증 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 