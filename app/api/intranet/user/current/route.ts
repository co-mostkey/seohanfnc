import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        // 인트라넷 세션 확인
        const intranetSessionId = request.cookies.get('intranetSessionId')?.value;

        if (!intranetSessionId) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        // 인트라넷 사용자 데이터베이스 읽기
        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const dbData = await fs.readFile(dbPath, 'utf8');
        const database = JSON.parse(dbData);

        // 현재 세션 찾기
        const currentSession = database.sessions.find((s: any) =>
            s.id === intranetSessionId && s.isActive
        );

        if (!currentSession) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 세션입니다.' },
                { status: 401 }
            );
        }

        // 사용자 정보 찾기
        const user = database.users.find((u: any) => u.id === currentSession.userId);

        if (!user) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 민감한 정보 제외하고 반환
        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            department: user.department,
            position: user.position,
            employeeId: user.employeeId,
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive
        };

        return NextResponse.json({
            success: true,
            user: userInfo
        });
    } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '사용자 정보 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 