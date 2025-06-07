import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// [TRISID] 인트라넷 계정 신청 거절 API
export async function POST(request: NextRequest) {
    try {
        // 세션 쿠키 확인
        const intranetSessionId = request.cookies.get('intranetSessionId')?.value;
        if (!intranetSessionId) {
            return NextResponse.json({ success: false, error: '인트라넷 인증이 필요합니다.' }, { status: 401 });
        }

        const { pendingUserId, rejectReason } = await request.json();

        if (!pendingUserId || !rejectReason?.trim()) {
            return NextResponse.json({ success: false, error: '거절할 신청 ID와 사유가 필요합니다.' }, { status: 400 });
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const raw = await fs.readFile(dbPath, 'utf8');
        const database = JSON.parse(raw);

        // 현재 세션 및 관리자 확인
        const currentSession = database.sessions.find((s: any) => s.id === intranetSessionId && s.isActive);
        if (!currentSession) {
            return NextResponse.json({ success: false, error: '유효하지 않은 세션입니다.' }, { status: 401 });
        }

        const currentUser = database.users.find((u: any) => u.id === currentSession.userId);
        if (!currentUser || currentUser.role !== '인트라넷관리자') {
            return NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 });
        }

        // pending user 찾기
        const pendingUserIndex = database.pendingUsers.findIndex((u: any) => u.id === pendingUserId && u.status === 'pending');
        if (pendingUserIndex === -1) {
            return NextResponse.json({ success: false, error: '대기 중인 신청을 찾을 수 없습니다.' }, { status: 404 });
        }

        database.pendingUsers[pendingUserIndex].status = 'rejected';
        database.pendingUsers[pendingUserIndex].reviewedBy = currentUser.name;
        database.pendingUsers[pendingUserIndex].reviewedAt = new Date().toISOString();
        database.pendingUsers[pendingUserIndex].rejectReason = rejectReason.trim();

        // 메타데이터 업데이트
        database.metadata.lastUpdated = new Date().toISOString();
        database.metadata.pendingApprovals = database.pendingUsers.filter((u: any) => u.status === 'pending').length;

        await fs.writeFile(dbPath, JSON.stringify(database, null, 4), 'utf8');

        return NextResponse.json({ success: true, message: '계정 신청이 거절되었습니다.' });
    } catch (err) {
        console.error('[TRISID] 계정 거절 오류:', err);
        return NextResponse.json({ success: false, error: '계정 거절 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 