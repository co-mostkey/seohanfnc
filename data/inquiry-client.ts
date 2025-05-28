// 클라이언트 컴포넌트에서 문의 데이터에 접근하기 위한 함수들
import { Inquiry, InquiryResponse, InquiryStatus, InquiryType, InquiryPriority } from '@/types/inquiry';

/**
 * 모든 문의 가져오기 (API 사용)
 */
export const getAllInquiries = async (): Promise<Inquiry[]> => {
    const response = await fetch('/api/admin/inquiries');
    if (!response.ok) {
        throw new Error('문의 데이터를 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return data.inquiries;
};

/**
 * 특정 문의 가져오기 (API 사용)
 */
export const getInquiryById = async (id: string): Promise<Inquiry | null> => {
    const response = await fetch(`/api/admin/inquiries?id=${id}`);
    if (!response.ok) {
        throw new Error('문의 데이터를 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return data.inquiry;
};

/**
 * 필터링된 문의 가져오기 (API 사용)
 */
export const getFilteredInquiries = async (
    page = 1,
    limit = 10,
    status?: InquiryStatus,
    type?: InquiryType,
    priority?: InquiryPriority,
    isRead?: boolean,
    search?: string
) => {
    // API 파라미터 구성
    let apiUrl = `/api/admin/inquiries?page=${page}&limit=${limit}`;

    if (status) {
        apiUrl += `&status=${status}`;
    }

    if (type) {
        apiUrl += `&type=${type}`;
    }

    if (priority) {
        apiUrl += `&priority=${priority}`;
    }

    if (isRead !== undefined) {
        apiUrl += `&isRead=${isRead}`;
    }

    if (search) {
        apiUrl += `&search=${encodeURIComponent(search)}`;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('문의 데이터를 불러오는데 실패했습니다.');
    }
    return await response.json();
};

/**
 * 문의에 응답 추가 (API 사용)
 */
export const addResponseToInquiry = async (
    inquiryId: string,
    content: string,
    isPublic: boolean,
    author: string,
    authorId: string,
    authorRole: string,
    attachments: any[] = []
): Promise<{ response: InquiryResponse, inquiry: Inquiry }> => {
    const response = await fetch('/api/admin/inquiries/response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inquiryId,
            content,
            isPublic,
            author,
            authorId,
            authorRole,
            attachments
        })
    });

    if (!response.ok) {
        throw new Error('응답 등록에 실패했습니다.');
    }

    return await response.json();
};

/**
 * 문의 상태 변경 (API 사용)
 */
export const updateInquiryStatus = async (id: string, status: InquiryStatus): Promise<Inquiry> => {
    const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status })
    });

    if (!response.ok) {
        throw new Error('상태 변경에 실패했습니다.');
    }

    const data = await response.json();
    return data.inquiry;
};

/**
 * 문의 읽음 상태 변경 (API 사용)
 */
export const markInquiryAsRead = async (id: string, isRead = true): Promise<Inquiry> => {
    const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isRead })
    });

    if (!response.ok) {
        throw new Error('읽음 상태 변경에 실패했습니다.');
    }

    const data = await response.json();
    return data.inquiry;
};

/**
 * 미읽은 문의 수 가져오기 (API 사용)
 */
export const getUnreadInquiriesCount = async (): Promise<number> => {
    const response = await fetch('/api/admin/inquiries?countOnly=unread');
    if (!response.ok) {
        throw new Error('미읽은 문의 수를 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return data.unreadCount;
};

/**
 * 새로운 문의 생성 (API 사용)
 */
export const createInquiry = async (inquiryData: any): Promise<Inquiry> => {
    const response = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData)
    });

    if (!response.ok) {
        throw new Error('문의 생성에 실패했습니다.');
    }

    const data = await response.json();
    return data.inquiry;
};

/**
 * 문의 삭제 (API 사용)
 */
export const deleteInquiry = async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('문의 삭제에 실패했습니다.');
    }

    return true;
};

/**
 * 문의 업데이트 (API 사용)
 */
export const updateInquiry = async (id: string, updatedData: Partial<Inquiry>): Promise<Inquiry> => {
    const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updatedData })
    });

    if (!response.ok) {
        throw new Error('문의 업데이트에 실패했습니다.');
    }

    const data = await response.json();
    return data.inquiry;
}; 