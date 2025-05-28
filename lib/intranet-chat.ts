import 'server-only';
import { readItems, writeItems } from '@/lib/file-db'; // 실제 사용 가능한 함수들만 import
import { ChatUser, ChatMessage, Conversation, EnrichedConversation } from '@/types/intranet-chat';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const DB_BASE_PATH = 'data/db/intranet-chat';
const USERS_FILE = `${DB_BASE_PATH}/users.json`;
const CONVERSATIONS_FILE = `${DB_BASE_PATH}/conversations.json`;
const MESSAGES_DIR = `${DB_BASE_PATH}/messages`;

// --- Helper Functions ---
async function readData<T>(filePath: string, defaultValue: T[] = []): Promise<T[]> {
    try {
        const fileName = path.basename(filePath);
        return await readItems<T>(fileName);
    } catch (error) {
        // 파일이 없으면 기본값으로 초기화
        await writeData(filePath, defaultValue);
        return defaultValue;
    }
}

async function writeData<T>(filePath: string, data: T[]): Promise<void> {
    const fileName = path.basename(filePath);
    await writeItems(fileName, data);
}

async function getMessagesFilePath(conversationId: string): Promise<string> {
    return `${MESSAGES_DIR}/${conversationId}.json`;
}

// --- User Functions ---
export async function getUsers(): Promise<ChatUser[]> {
    return readData<ChatUser>(USERS_FILE, [
        // 기본 관리자/테스트 사용자 (실제로는 관리자 페이지에서 추가/관리)
        { id: 'admin', name: '관리자', position: '시스템 관리자', department: 'IT팀', avatar: '/images/avatars/avatar-admin.png', isOnline: true },
        { id: 'user1', name: '김철수', position: '대표이사', department: '경영지원', avatar: '/images/avatars/avatar-1.jpg', isOnline: true },
        { id: 'user2', name: '이영희', position: '이사', department: '영업', avatar: '/images/avatars/avatar-2.jpg', isOnline: true },
        { id: 'user3', name: '박지성', position: '부장', department: '영업', avatar: '/images/avatars/avatar-3.jpg', isOnline: false },
    ]);
}

export async function getUserById(userId: string): Promise<ChatUser | undefined> {
    const users = await getUsers();
    return users.find(u => u.id === userId);
}

// --- Conversation Functions ---
export async function getConversations(): Promise<Conversation[]> {
    return readData<Conversation>(CONVERSATIONS_FILE);
}

export async function getConversationById(conversationId: string): Promise<Conversation | undefined> {
    const conversations = await getConversations();
    return conversations.find(c => c.id === conversationId);
}

// 1:1 대화 조회 또는 생성 (없으면 새로 만듦)
export async function findOrCreateConversation(userId1: string, userId2: string): Promise<Conversation> {
    const conversations = await getConversations();
    let conversation = conversations.find(c =>
        c.participantIds.length === 2 &&
        c.participantIds.includes(userId1) &&
        c.participantIds.includes(userId2)
    );

    if (!conversation) {
        const now = new Date().toISOString();
        conversation = {
            id: uuidv4(),
            participantIds: [userId1, userId2].sort(), // 일관성을 위해 정렬
            createdAt: now,
            updatedAt: now,
            unreadCounts: { [userId1]: 0, [userId2]: 0 }
        };
        conversations.unshift(conversation); // 새 대화를 맨 앞에 추가
        await writeData(CONVERSATIONS_FILE, conversations);
        // 새 대화 메시지 파일 생성
        await writeData(await getMessagesFilePath(conversation.id), []);
    }
    return conversation;
}

// 사용자의 모든 대화 목록을 상세 정보와 함께 가져오기
export async function getUserConversations(userId: string): Promise<EnrichedConversation[]> {
    const allConversations = await getConversations();
    const userConvs = allConversations.filter(c => c.participantIds.includes(userId));
    const users = await getUsers();

    const enrichedConversations = await Promise.all(
        userConvs.map(async (conv) => {
            const participants = conv.participantIds
                .map(pid => users.find(u => u.id === pid))
                .filter(Boolean) as ChatUser[];

            let lastMessage: ChatMessage | undefined = undefined;
            if (conv.lastMessageId) {
                const messages = await getMessagesForConversation(conv.id);
                lastMessage = messages.find(m => m.id === conv.lastMessageId);
            }

            return {
                ...conv,
                participants,
                lastMessage,
            } as EnrichedConversation;
        })
    );

    // 최근 메시지 시간 순으로 정렬
    return enrichedConversations.sort((a, b) => {
        const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : new Date(a.updatedAt).getTime();
        const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : new Date(b.updatedAt).getTime();
        return timeB - timeA;
    });
}

// --- Message Functions ---
export async function getMessagesForConversation(conversationId: string): Promise<ChatMessage[]> {
    const filePath = await getMessagesFilePath(conversationId);
    try {
        const fileName = path.basename(filePath);
        return await readItems<ChatMessage>(fileName);
    } catch (error) {
        return []; // 대화는 있으나 메시지 파일이 없을 경우
    }
}

export async function addMessageToConversation(conversationId: string, senderId: string, content: string, attachments?: ChatMessage['attachments']): Promise<ChatMessage> {
    const messages = await getMessagesForConversation(conversationId);
    const conversations = await getConversations();
    const conversation = conversations.find(c => c.id === conversationId);

    if (!conversation) {
        throw new Error('Conversation not found');
    }

    const now = new Date().toISOString();
    const newMessage: ChatMessage = {
        id: uuidv4(),
        conversationId,
        senderId,
        content,
        timestamp: now,
        isRead: false, // 기본값
        attachments: attachments || []
    };

    messages.push(newMessage);
    await writeData(await getMessagesFilePath(conversationId), messages);

    // 대화 정보 업데이트 (마지막 메시지 등)
    conversation.lastMessageId = newMessage.id;
    conversation.lastMessageTimestamp = newMessage.timestamp;
    conversation.lastMessageSenderId = newMessage.senderId;
    conversation.lastMessageContent = newMessage.content.substring(0, 50); // 미리보기용
    conversation.updatedAt = now;

    // 안 읽은 메시지 수 업데이트
    conversation.unreadCounts = conversation.unreadCounts || {};
    conversation.participantIds.forEach(pid => {
        if (pid !== senderId) {
            conversation.unreadCounts![pid] = (conversation.unreadCounts![pid] || 0) + 1;
        }
    });

    await writeData(CONVERSATIONS_FILE, conversations);
    return newMessage;
}

export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const messages = await getMessagesForConversation(conversationId);
    let changed = false;
    messages.forEach(msg => {
        if (msg.senderId !== userId && !msg.isRead) {
            msg.isRead = true;
            changed = true;
        }
    });

    if (changed) {
        await writeData(await getMessagesFilePath(conversationId), messages);
    }

    // 대화 목록에서 해당 사용자의 안 읽은 메시지 수 초기화
    const conversations = await getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.unreadCounts && conversation.unreadCounts[userId] > 0) {
        conversation.unreadCounts[userId] = 0;
        await writeData(CONVERSATIONS_FILE, conversations);
    }
} 