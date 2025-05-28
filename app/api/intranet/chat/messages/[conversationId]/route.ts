import { NextRequest, NextResponse } from 'next/server';
import {
    getMessagesForConversation,
    addMessageToConversation,
    getConversationById,
} from '@/lib/intranet-chat';

// 임시 현재 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
const getCurrentUserId = async () => 'user1';

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
    try {
        const { conversationId } = await params;
        const currentUserId = await getCurrentUserId();

        // 사용자가 해당 대화에 참여하고 있는지 확인 (선택적 보안 강화)
        const conversation = await getConversationById(conversationId);
        if (!conversation || !conversation.participantIds.includes(currentUserId)) {
            return NextResponse.json({ error: '권한이 없거나 존재하지 않는 대화입니다.' }, { status: 403 });
        }

        const messages = await getMessagesForConversation(conversationId);
        return NextResponse.json(messages);
    } catch (error) {
        console.error('[GET /api/intranet/chat/messages/:conversationId]', error);
        return NextResponse.json({ error: '메시지를 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
    try {
        const { conversationId } = await params;
        const currentUserId = await getCurrentUserId();
        const { content, attachments } = await request.json(); // senderId는 서버에서 현재 사용자로 설정

        if (!content && (!attachments || attachments.length === 0)) {
            return NextResponse.json({ error: '메시지 내용 또는 첨부 파일이 필요합니다.' }, { status: 400 });
        }

        // 사용자가 해당 대화에 참여하고 있는지 확인
        const conversation = await getConversationById(conversationId);
        if (!conversation || !conversation.participantIds.includes(currentUserId)) {
            return NextResponse.json({ error: '권한이 없거나 존재하지 않는 대화입니다.' }, { status: 403 });
        }

        const newMessage = await addMessageToConversation(conversationId, currentUserId, content || '', attachments);
        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('[POST /api/intranet/chat/messages/:conversationId]', error);
        // @ts-ignore
        if (error.message === 'Conversation not found') {
            // @ts-ignore
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: '메시지 전송 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 