import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// [TRISID] 인트라넷 현재 로그인 사용자 정보 반환 API (GET)
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('intranetSessionId')?.value;
    if (!sessionId) {
      return NextResponse.json({ success: false, error: '세션 ID가 없습니다.' }, { status: 401 });
    }

    const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
    const raw = await fs.readFile(dbPath, 'utf8');
    const database = JSON.parse(raw);

    const session = database.sessions.find((s: any) => s.id === sessionId && s.isActive);
    if (!session) {
      return NextResponse.json({ success: false, error: '유효하지 않은 세션입니다.' }, { status: 401 });
    }

    const user = database.users.find((u: any) => u.id === session.userId);
    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: '사용자를 찾을 수 없거나 비활성화된 계정입니다.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position,
        permissions: user.permissions,
        lastLogin: user.lastLogin,
      },
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (err) {
    console.error('[TRISID] 현재 사용자 조회 오류:', err);
    return NextResponse.json({ success: false, error: '사용자 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 