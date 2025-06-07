import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// [TRISID] 인트라넷 사용자 활성/비활성 토글 API
export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        if (!userId) {
            return NextResponse.json({ success: false, error: '사용자 ID가 필요합니다.' }, { status: 400 });
        }

        const intranetSessionId = request.cookies.get('intranetSessionId')?.value;
        if (!intranetSessionId) {
            return NextResponse.json({ success: false, error: '인트라넷 인증이 필요합니다.' }, { status: 401 });
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const raw = await fs.readFile(dbPath, 'utf8');
        const database = JSON.parse(raw);

        const currentSession = database.sessions.find((s: any) => s.id === intranetSessionId && s.isActive);
        if (!currentSession) {
            return NextResponse.json({ success: false, error: '유효하지 않은 세션입니다.' }, { status: 401 });
        }

        const currentUser = database.users.find((u: any) => u.id === currentSession.userId);
        if (!currentUser || currentUser.role !== '인트라넷관리자') {
            return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
        }

        const targetIndex = database.users.findIndex((u: any) => u.id === userId);
        if (targetIndex === -1) {
            return NextResponse.json({ success: false, error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
        }

        const targetUser = database.users[targetIndex];

        // 관리자 자신 또는 다른 관리자 계정 상태 변경 방지
        if (targetUser.role === '인트라넷관리자') {
            return NextResponse.json({ success: false, error: '관리자 계정의 상태는 변경할 수 없습니다.' }, { status: 400 });
        }

        // 상태 토글
        database.users[targetIndex].isActive = !targetUser.isActive;

        // 활성 세션 정리 (비활성화 시)
        if (!database.users[targetIndex].isActive) {
            database.sessions = database.sessions.map((s: any) =>
                s.userId === userId ? { ...s, isActive: false } : s
            );
        }

        // 메타데이터 업데이트
        database.metadata.lastUpdated = new Date().toISOString();
        database.metadata.activeUsers = database.users.filter((u: any) => u.isActive).length;

        await fs.writeFile(dbPath, JSON.stringify(database, null, 4), 'utf8');

        return NextResponse.json({ success: true, message: '사용자 상태가 변경되었습니다.' });
    } catch (err) {
        console.error('[TRISID] 사용자 상태 변경 오류:', err);
        return NextResponse.json({ success: false, error: '상태 변경 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 