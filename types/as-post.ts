export interface ASPost {
    id: string;
    title: string;
    author: string;
    email?: string;
    phone?: string;
    company?: string;
    content: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    status?: 'pending' | 'answered' | 'closed'; // A/S 처리 상태
    reply?: string; // 관리자 답변
    answer?: string;
    answeredAt?: string;
    isRead?: boolean;
    responses?: any[];
} 