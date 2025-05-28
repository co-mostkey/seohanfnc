import { NextRequest, NextResponse } from 'next/server';
import {
    getUserConversations,
    findOrCreateConversation,
    markMessagesAsRead,
} from '@/lib/intranet-chat';

// 임시 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
const getCurrentUserId = async () => 'user1';

export async function GET() {
    try {
        const currentUserId = await getCurrentUserId();
        const conversations = await getUserConversations(currentUserId);
        return NextResponse.json(conversations);
    } catch (error) {
        console.error('[GET /api/intranet/chat/conversations]', error);
        return NextResponse.json({ error: '대화 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUserId = await getCurrentUserId();
        const { targetUserId } = await request.json();

        if (!targetUserId) {
            return NextResponse.json({ error: '대상 사용자 ID가 필요합니다.' }, { status: 400 });
        }

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: '자기 자신과의 대화는 생성할 수 없습니다.' }, { status: 400 });
        }

        const conversation = await findOrCreateConversation(currentUserId, targetUserId);
        return NextResponse.json(conversation);
    } catch (error) {
        console.error('[POST /api/intranet/chat/conversations]', error);
        return NextResponse.json({ error: '대화 생성 또는 조회 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 이 라우트는 /api/intranet/chat/conversations/[conversationId]/read 로 분리하는 것이 RESTful 하지만,
// 편의상 여기에 통합. 클라이언트에서 호출 시 conversationId를 body로 전달받음.
export async function PATCH(request: NextRequest) {
    try {
        const currentUserId = await getCurrentUserId();
        const { conversationId } = await request.json();

        if (!conversationId) {
            return NextResponse.json({ error: '대화 ID가 필요합니다.' }, { status: 400 });
        }

        await markMessagesAsRead(conversationId, currentUserId);
        return NextResponse.json({ message: '메시지를 읽음 처리했습니다.' });
    } catch (error) {
        console.error('[PATCH /api/intranet/chat/conversations/read]', error);
        return NextResponse.json({ error: '메시지 읽음 처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 