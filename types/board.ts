// types/board.ts

import { AdminUser } from '@/types/user'; // AdminUser 타입으로 변경

export interface Attachment {
    id: string;
    filename: string;
    originalFilename?: string;
    url: string;
    fileType?: string;
    fileSize?: number;
    createdAt: string;
}

export interface Comment {
    id: string;
    postId: string;
    author: Partial<AdminUser>; // AdminUser 타입의 일부 정보만 사용 (id, name 등)
    content: string;
    createdAt: string;
    updatedAt?: string;
    isPrivate?: boolean; // 비밀 댓글 여부
}

export interface BoardPost {
    id: string;         // 게시글 ID (UUID 또는 DB 시퀀스)
    boardId: string;    // 소속 게시판 ID
    title: string;
    content: string;      // HTML 또는 Markdown 형식의 본문
    author: Partial<AdminUser>; // AdminUser 타입의 일부 정보만 사용 (id, name 등)
    createdAt: string;    // ISO 8601 형식 (예: "2023-10-27T10:00:00Z")
    updatedAt?: string;
    viewCount?: number;
    likeCount?: number;
    isPublished?: boolean; // 게시(공개) 여부
    isPinned?: boolean;    // 상단 고정 여부
    isPrivate?: boolean;   // 비밀글 여부 (QnA, 온라인견적 등에 사용)
    password?: string;     // 비밀글일 경우 암호 (해시하여 저장 권장, 지금은 단순 텍스트)
    tags?: string[];
    attachments?: Attachment[];
    comments?: Comment[];
    category?: string;     // 게시판 내 하위 카테고리 (선택 사항)
    // 기타 필요한 메타데이터 필드 추가 가능
}

export interface Board {
    id: string; // 예: "notices", "faq", "qna", "news", "intranet-notice", "intranet-general"
    name: string; // 예: "공지사항", "자주 묻는 질문"
    description?: string;
    readPermission?: 'all' | 'user' | 'admin'; // 읽기 권한
    writePermission?: 'user' | 'admin';       // 쓰기 권한
    commentPermission?: 'user' | 'admin';    // 댓글 권한
    isPrivateBoard?: boolean; // 게시판 자체가 비공개 (예: 인트라넷)
    postCount?: number; // 해당 게시판의 총 게시글 수 (동적으로 채워짐)
    // 기타 게시판 설정 필드 추가 가능
} 