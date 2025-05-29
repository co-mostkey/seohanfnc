import { LocalizedString } from './post';

/**
 * 문의 상태 타입
 */
export type InquiryStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

/**
 * 문의 타입
 */
export type InquiryType = 'product' | 'service' | 'support' | 'partnership' | 'other' | 'quotation' | 'general';

/**
 * 문의 우선순위
 */
export type InquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * 문의 타입 정의
 */
export interface Inquiry {
    id: string;
    type: InquiryType;
    title: string;
    content: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    company?: string;
    productId?: string;
    productName?: string;
    password?: string; // 비밀번호 (견적 요청 등에서 사용)
    status: InquiryStatus;
    priority: InquiryPriority;
    isRead: boolean;
    isFeatured: boolean;
    responses: InquiryResponse[];
    attachments: InquiryAttachment[];
    tags?: string[];
    sourceUrl?: string; // 문의가 어디서 왔는지 (홈페이지, 모바일 앱 등)
    adminNotes?: string; // 관리자만 볼 수 있는 메모
    createdAt: string;
    updatedAt: string;
}

/**
 * 문의 응답 타입 정의
 */
export interface InquiryResponse {
    id: string;
    inquiryId: string;
    content: string;
    isPublic: boolean; // true: 고객에게 보임, false: 내부용
    author: string;
    authorId: string;
    authorRole: string;
    attachments: InquiryAttachment[];
    createdAt: string;
    updatedAt: string;
}

/**
 * 문의 첨부파일 타입 정의
 */
export interface InquiryAttachment {
    id: string;
    inquiryId: string;
    responseId?: string;
    filename: string;
    originalFilename: string;
    filesize: number;
    mimetype: string;
    path: string;
    url: string;
    isImage: boolean;
    createdAt: string;
}

/**
 * 문의 검색 옵션
 */
export interface InquirySearchOptions {
    keyword?: string;
    type?: InquiryType;
    status?: InquiryStatus;
    priority?: InquiryPriority;
    startDate?: string;
    endDate?: string;
    isRead?: boolean;
    page: number;
    limit: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
} 