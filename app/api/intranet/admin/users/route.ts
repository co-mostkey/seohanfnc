import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        // 인트라넷 관리자 권한 확인
        const intranetSessionId = request.cookies.get('intranetSessionId')?.value;

        if (!intranetSessionId) {
            return NextResponse.json(
                { success: false, error: '인트라넷 인증이 필요합니다.' },
                { status: 401 }
            );
        }

        // 인트라넷 사용자 데이터베이스 읽기
        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const dbData = await fs.readFile(dbPath, 'utf8');
        const database = JSON.parse(dbData);

        // 현재 세션 확인 및 권한 체크
        const currentSession = database.sessions.find((s: any) =>
            s.id === intranetSessionId && s.isActive
        );

        if (!currentSession) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 세션입니다.' },
                { status: 401 }
            );
        }

        // 관리자 권한 확인
        const currentUser = database.users.find((u: any) => u.id === currentSession.userId);

        if (!currentUser || currentUser.role !== '인트라넷관리자') {
            return NextResponse.json(
                { success: false, error: '관리자 권한이 필요합니다.' },
                { status: 403 }
            );
        }

        // 사용자 목록 반환 (비밀번호 제외)
        const users = database.users.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            department: user.department,
            position: user.position,
            employeeId: user.employeeId,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        }));

        // 대기 중인 사용자 목록 반환 (비밀번호 제외)
        const pendingUsers = database.pendingUsers.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            employeeId: user.employeeId,
            department: user.department,
            position: user.position,
            phone: user.phone,
            requestedAt: user.requestedAt,
            status: user.status,
            rejectReason: user.rejectReason
        }));

        return NextResponse.json({
            success: true,
            users,
            pendingUsers
        });
    } catch (error) {
        console.error('인트라넷 사용자 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '사용자 목록 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 