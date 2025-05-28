/**
 * 게시판 관련 타입 정의
 */

/**
 * 다국어 문자열 타입 
 */
export interface LocalizedString {
    ko: string;
    en?: string;
    cn?: string;
    [key: string]: string | undefined;
}

/**
 * 게시판 카테고리 타입
 */
export interface BoardCategory {
    id: string;
    name: LocalizedString;
    description?: LocalizedString;
    slug: string;
    order: number;
    type: 'notice' | 'news' | 'qna' | 'faq' | 'gallery' | 'download' | 'custom';
    isPublic: boolean;
    hasAttachment: boolean;
    hasComment: boolean;
    hasPassword: boolean; // 비회원 글쓰기 시 비밀번호 필요
    allowAnonymous: boolean;
    allowHtml: boolean;
    requireApproval: boolean; // 관리자 승인 필요
    createdAt: string;
    updatedAt: string;
}

/**
 * 게시판 글 타입
 */
export interface Post {
    id: string;
    boardId: string;
    title: LocalizedString;
    content: LocalizedString;
    author: string | { name: string; id?: string }; // 작성자 이름 또는 객체
    authorId?: string; // 회원인 경우 회원 ID
    authorEmail?: string;
    authorIp?: string;
    viewCount: number;
    likeCount: number;
    isNotice: boolean; // 공지글 여부
    isSecret: boolean; // 비밀글 여부
    isPrivate?: boolean; // 비공개글 여부 (admin/posts/page.tsx에서 사용)
    isPublished?: boolean; // 게시 여부 (admin/posts/page.tsx에서 사용)
    isPinned?: boolean; // 상단 고정 여부 (admin/posts/page.tsx에서 사용)
    password?: string; // 비밀글인 경우 비밀번호 (해시 처리)
    isDeleted: boolean;
    status: 'published' | 'draft' | 'pending' | 'rejected';
    thumbnail?: string; // 썸네일 이미지 경로
    attachments: Attachment[];
    comments: Comment[];
    tags?: string[];
    category?: string; // 카테고리 (admin/posts/page.tsx에서 사용)
    customFields?: Record<string, any>; // 추가 필드 (JSON 형태)
    createdAt: string;
    updatedAt: string;
}

/**
 * 첨부파일 타입
 */
export interface Attachment {
    id: string;
    postId: string;
    filename: string;
    originalFilename: string;
    filesize: number;
    mimetype: string;
    path: string;
    url: string;
    isImage: boolean;
    downloadCount: number;
    createdAt: string;
}

/**
 * 댓글 타입
 */
export interface Comment {
    id: string;
    postId: string;
    parentId?: string; // 대댓글인 경우 부모 댓글 ID
    content: string;
    author: string;
    authorId?: string;
    authorEmail?: string;
    authorIp?: string;
    isSecret: boolean;
    password?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * 게시판 검색 옵션
 */
export interface BoardSearchOptions {
    keyword?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    author?: string;
    tags?: string[];
    status?: string;
    page: number;
    limit: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}

/**
 * 게시판 설정 옵션
 */
export interface BoardSettings {
    defaultPageSize: number;
    useWysiwyg: boolean;
    allowFileUpload: boolean;
    maxFileSize: number; // KB
    allowedFileTypes: string[]; // ['.jpg', '.png', ...]
    maxFiles: number;
    useRecaptcha: boolean;
    notifyNewPost: boolean; // 새 글 알림
    notifyNewComment: boolean; // 새 댓글 알림
} 