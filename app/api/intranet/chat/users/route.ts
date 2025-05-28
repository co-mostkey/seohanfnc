import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/intranet-chat';

// 임시 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
const getCurrentUserId = async () => 'user1';

export async function GET() {
    try {
        const currentUserId = await getCurrentUserId();
        const allUsers = await getUsers();
        const users = allUsers.filter(user => user.id !== currentUserId);
        return NextResponse.json(users);
    } catch (error) {
        console.error('[GET /api/intranet/chat/users]', error);
        return NextResponse.json({ error: '사용자 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 