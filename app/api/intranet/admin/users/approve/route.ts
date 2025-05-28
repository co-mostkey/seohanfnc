import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        // 인트라넷 관리자 권한 확인
        const intranetSessionId = request.cookies.get('intranetSessionId')?.value;

        if (!intranetSessionId) {
            return NextResponse.json(
                { success: false, error: '인트라넷 인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { pendingUserId } = body;

        if (!pendingUserId) {
            return NextResponse.json(
                { success: false, error: '승인할 사용자 ID가 필요합니다.' },
                { status: 400 }
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

        // 대기 중인 사용자 찾기
        const pendingUserIndex = database.pendingUsers.findIndex((u: any) =>
            u.id === pendingUserId && u.status === 'pending'
        );

        if (pendingUserIndex === -1) {
            return NextResponse.json(
                { success: false, error: '대기 중인 신청을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const pendingUser = database.pendingUsers[pendingUserIndex];

        // 새 사용자 생성
        const newUser = {
            id: `user-${uuidv4()}`,
            username: pendingUser.username,
            password: pendingUser.password, // 이미 해시됨
            email: pendingUser.email,
            role: '직원', // 기본 역할
            name: pendingUser.name,
            department: pendingUser.department,
            position: pendingUser.position,
            employeeId: pendingUser.employeeId,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            permissions: [
                'intranet.access',
                'intranet.documents.read',
                'intranet.notices.read'
            ]
        };

        // 사용자 추가
        database.users.push(newUser);

        // 대기 상태 업데이트
        database.pendingUsers[pendingUserIndex].status = 'approved';
        database.pendingUsers[pendingUserIndex].reviewedBy = currentUser.name;
        database.pendingUsers[pendingUserIndex].reviewedAt = new Date().toISOString();

        // 메타데이터 업데이트
        database.metadata.lastUpdated = new Date().toISOString();
        database.metadata.totalUsers = database.users.length;
        database.metadata.activeUsers = database.users.filter((u: any) => u.isActive).length;
        database.metadata.pendingApprovals = database.pendingUsers.filter((u: any) => u.status === 'pending').length;

        // 데이터베이스 저장
        await fs.writeFile(dbPath, JSON.stringify(database, null, 4), 'utf8');

        return NextResponse.json({
            success: true,
            message: '계정이 승인되었습니다.',
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('인트라넷 계정 승인 오류:', error);
        return NextResponse.json(
            { success: false, error: '계정 승인 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 