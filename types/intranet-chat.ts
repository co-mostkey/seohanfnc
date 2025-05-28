export interface ChatUser {
    id: string; // 사용자 고유 ID (예: 직원 ID)
    name: string;
    avatar?: string; // 프로필 이미지 경로
    position?: string; // 직책
    department?: string; // 부서
    isOnline?: boolean; // 접속 상태 (실시간은 어려우므로, 최근 활동 기반으로 표시 가능)
}

export interface ChatMessage {
    id: string; // 메시지 고유 ID (uuid)
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: string; // ISO Date string
    isRead?: boolean; // 수신자에 의한 읽음 여부 (1:1 채팅 기준)
    attachments?: { name: string; url: string; type: string; size?: number }[]; // 첨부 파일
}

export interface Conversation {
    id: string; // 대화 고유 ID (uuid, 또는 참여자 ID 조합)
    participantIds: string[]; // 대화 참여자 ID 목록 (1:1이면 2개)
    lastMessageId?: string; // 마지막 메시지 ID
    lastMessageTimestamp?: string; // 마지막 메시지 시간
    lastMessageSenderId?: string; // 마지막 메시지 보낸 사람
    lastMessageContent?: string; // 마지막 메시지 내용 (목록 표시에 사용)
    unreadCounts?: { [userId: string]: number }; // 사용자별 안 읽은 메시지 수
    // isGroupChat?: boolean; // 그룹 채팅 여부 (추후 확장)
    // groupName?: string; // 그룹 채팅 이름
    // groupAvatar?: string; // 그룹 채팅 프로필 이미지
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}

// API 응답 등에 사용될 수 있는 확장된 대화 정보
export interface EnrichedConversation extends Conversation {
    participants: ChatUser[]; // 참여자 상세 정보
    lastMessage?: ChatMessage; // 마지막 메시지 상세 정보
} 