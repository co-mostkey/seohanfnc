// 이 파일은 서버 컴포넌트나 API 라우트에서만 사용됩니다 (fs 모듈은 클라이언트 측에서 사용 불가)
import 'server-only';
import { Inquiry, InquiryResponse, InquiryAttachment, InquiryType, InquiryStatus, InquiryPriority } from '@/types/inquiry';
import { v4 as uuidv4 } from 'uuid';
import { readItems, writeItems, findItemById, saveItem, deleteItem } from '@/lib/file-db';
import { withMutex } from '@/lib/mutex';

// 데이터 파일 정보
const INQUIRIES_FILE = 'inquiries.json';
const INQUIRY_MUTEX_KEY = 'inquiry_data';

/**
 * 샘플 문의 데이터
 */
const sampleInquiries: Inquiry[] = [
    {
        id: 'inq-001',
        type: 'product',
        title: 'Cylinder-Type-SafetyAirMat 제품 견적 문의',
        content: `안녕하세요,
        
귀사의 Cylinder-Type-SafetyAirMat 제품에 대한 견적을 요청드립니다.
물류창고에 설치할 목적으로 10개 정도 필요합니다.
        
배송 및 설치 관련 정보도 함께 알려주시면 감사하겠습니다.`,
        customerName: '김철수',
        customerEmail: 'customer@example.com',
        customerPhone: '010-1234-5678',
        company: '한국물류 주식회사',
        productId: 'prod-001',
        productName: 'Cylinder-Type-SafetyAirMat',
        status: 'pending',
        priority: 'medium',
        isRead: false,
        isFeatured: false,
        responses: [],
        attachments: [],
        sourceUrl: '/products/safety-equipment/Cylinder-Type-SafetyAirMat',
        createdAt: '2025-05-15T09:30:00Z',
        updatedAt: '2025-05-15T09:30:00Z'
    },
    {
        id: 'inq-002',
        type: 'partnership',
        title: '기업 제휴 문의',
        content: `안녕하세요,
        
저희 회사는 건설 안전장비 유통업체입니다.
서한에프앤씨 제품 중 안전 매트 시리즈에 대한 제휴 판매를 문의드립니다.
        
미팅 가능한 시간이 있으시면 연락 부탁드립니다.`,
        customerName: '박영희',
        customerEmail: 'partner@example.com',
        customerPhone: '010-9876-5432',
        company: '안전제일 건설장비',
        status: 'in_progress',
        priority: 'high',
        isRead: true,
        isFeatured: true,
        responses: [
            {
                id: 'resp-001',
                inquiryId: 'inq-002',
                content: '안녕하세요, 문의주셔서 감사합니다. 제휴 관련 담당자를 통해 연락드리겠습니다.',
                isPublic: true,
                author: '이지원',
                authorId: 'staff-001',
                authorRole: '영업팀장',
                attachments: [],
                createdAt: '2025-05-15T14:20:00Z',
                updatedAt: '2025-05-15T14:20:00Z'
            }
        ],
        attachments: [],
        tags: ['partnership', 'distributor'],
        adminNotes: '우수 유통업체, 적극 검토 필요',
        createdAt: '2025-05-15T10:15:00Z',
        updatedAt: '2025-05-15T14:20:00Z'
    },
    {
        id: 'inq-003',
        type: 'service',
        title: '설치된 제품 A/S 요청',
        content: `지난 달 설치한 안전 매트에 문제가 발생했습니다.
공기가 새는 것 같으니 점검 부탁드립니다.
        
설치 위치: 서울시 강남구 테헤란로 123
설치일: 2025년 4월 10일`,
        customerName: '정민수',
        customerEmail: 'service@example.com',
        customerPhone: '010-5555-7777',
        company: '스마트 로지스틱스',
        status: 'completed',
        priority: 'urgent',
        isRead: true,
        isFeatured: false,
        responses: [
            {
                id: 'resp-002',
                inquiryId: 'inq-003',
                content: '안녕하세요, A/S 요청 접수되었습니다. 5월 16일 오전 10시에 방문 예정입니다.',
                isPublic: true,
                author: '김기술',
                authorId: 'staff-002',
                authorRole: 'A/S팀',
                attachments: [],
                createdAt: '2025-05-15T11:10:00Z',
                updatedAt: '2025-05-15T11:10:00Z'
            },
            {
                id: 'resp-003',
                inquiryId: 'inq-003',
                content: '방문 완료, 에어밸브 교체 작업 진행했습니다. 고객 만족도 높음.',
                isPublic: false,
                author: '김기술',
                authorId: 'staff-002',
                authorRole: 'A/S팀',
                attachments: [],
                createdAt: '2025-05-16T12:30:00Z',
                updatedAt: '2025-05-16T12:30:00Z'
            }
        ],
        attachments: [
            {
                id: 'attach-001',
                inquiryId: 'inq-003',
                filename: 'problem-photo.jpg',
                originalFilename: '문제사진.jpg',
                filesize: 1500000,
                mimetype: 'image/jpeg',
                path: '/uploads/inquiries/inq-003/problem-photo.jpg',
                url: '/uploads/inquiries/inq-003/problem-photo.jpg',
                isImage: true,
                createdAt: '2025-05-15T11:00:00Z'
            }
        ],
        createdAt: '2025-05-15T11:00:00Z',
        updatedAt: '2025-05-16T12:30:00Z'
    },
    {
        id: 'inq-004',
        type: 'other',
        title: '카탈로그 요청',
        content: '최신 제품 카탈로그를 이메일로 보내주실 수 있을까요?',
        customerName: '최지수',
        customerEmail: 'catalog@example.com',
        status: 'completed',
        priority: 'low',
        isRead: true,
        isFeatured: false,
        responses: [
            {
                id: 'resp-004',
                inquiryId: 'inq-004',
                content: '안녕하세요, 요청하신 카탈로그를 첨부파일로 보내드립니다.',
                isPublic: true,
                author: '관리자',
                authorId: 'admin',
                authorRole: '관리자',
                attachments: [
                    {
                        id: 'attach-002',
                        inquiryId: 'inq-004',
                        responseId: 'resp-004',
                        filename: 'catalog-2025.pdf',
                        originalFilename: '서한에프앤씨_카탈로그_2025.pdf',
                        filesize: 8500000,
                        mimetype: 'application/pdf',
                        path: '/uploads/inquiries/inq-004/catalog-2025.pdf',
                        url: '/uploads/inquiries/inq-004/catalog-2025.pdf',
                        isImage: false,
                        createdAt: '2025-05-15T15:45:00Z'
                    }
                ],
                createdAt: '2025-05-15T15:45:00Z',
                updatedAt: '2025-05-15T15:45:00Z'
            }
        ],
        attachments: [],
        createdAt: '2025-05-15T14:50:00Z',
        updatedAt: '2025-05-15T15:45:00Z'
    },
    {
        id: 'inq-005',
        type: 'support',
        title: '매뉴얼 문의',
        content: '구매한 제품의 매뉴얼이 없어 문의드립니다. 전자 매뉴얼 또는 PDF로 받을 수 있을까요?',
        customerName: '이지은',
        customerEmail: 'support@example.com',
        customerPhone: '010-2222-3333',
        status: 'pending',
        priority: 'medium',
        isRead: false,
        isFeatured: false,
        responses: [],
        attachments: [],
        createdAt: '2025-05-16T09:10:00Z',
        updatedAt: '2025-05-16T09:10:00Z'
    }
];

/**
 * 초기 데이터 로드 및 저장
 */
async function initializeInquiryData(): Promise<void> {
    try {
        // 현재 데이터 읽기
        const currentInquiries = await readItems<Inquiry>(INQUIRIES_FILE);

        // 데이터가 없으면 샘플 데이터 저장
        if (currentInquiries.length === 0) {
            await writeItems<Inquiry>(INQUIRIES_FILE, sampleInquiries);
            console.log('[Inquiry Data] Initialized with sample data');
        }
    } catch (error) {
        console.error('[Inquiry Data] Failed to initialize data:', error);
        // 오류 발생 시 빈 배열 저장
        await writeItems<Inquiry>(INQUIRIES_FILE, []);
    }
}

// 서버가 시작될 때 초기화 호출
if (typeof window === 'undefined') {
    initializeInquiryData().catch(console.error);
}

/**
 * 모든 문의 가져오기
 */
export const getAllInquiries = async (): Promise<Inquiry[]> => {
    return await readItems<Inquiry>(INQUIRIES_FILE);
};

/**
 * 특정 문의 가져오기
 */
export const getInquiryById = async (id: string): Promise<Inquiry | null> => {
    const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
    const { item } = findItemById(inquiries, id);
    return item;
};

/**
 * 필터링된 문의 가져오기
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
    const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
    let filteredInquiries = [...inquiries];

    // 상태 필터
    if (status) {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.status === status);
    }

    // 타입 필터
    if (type) {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.type === type);
    }

    // 우선순위 필터
    if (priority) {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.priority === priority);
    }

    // 읽음 상태 필터
    if (isRead !== undefined) {
        filteredInquiries = filteredInquiries.filter(inquiry => inquiry.isRead === isRead);
    }

    // 검색어 필터
    if (search) {
        const searchLower = search.toLowerCase();
        filteredInquiries = filteredInquiries.filter(inquiry =>
            inquiry.title.toLowerCase().includes(searchLower) ||
            inquiry.content.toLowerCase().includes(searchLower) ||
            inquiry.customerName.toLowerCase().includes(searchLower) ||
            inquiry.customerEmail.toLowerCase().includes(searchLower) ||
            (inquiry.company && inquiry.company.toLowerCase().includes(searchLower))
        );
    }

    // 정렬 (최신순)
    filteredInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 중요 문의를 상단에 표시
    const featuredInquiries = filteredInquiries.filter(inquiry => inquiry.isFeatured);
    const normalInquiries = filteredInquiries.filter(inquiry => !inquiry.isFeatured);

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInquiries = [...featuredInquiries, ...normalInquiries.slice(startIndex, endIndex)];

    return {
        inquiries: paginatedInquiries,
        total: normalInquiries.length,
        page,
        limit,
        totalPages: Math.ceil(normalInquiries.length / limit)
    };
};

/**
 * 문의에 응답 추가
 */
export const addResponseToInquiry = async (inquiryId: string, response: Omit<InquiryResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<InquiryResponse | null> => {
    return await withMutex(INQUIRY_MUTEX_KEY, async () => {
        const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
        const { item: inquiry, index } = findItemById(inquiries, inquiryId);

        if (!inquiry) return null;

        const newResponse: InquiryResponse = {
            id: `resp-${uuidv4()}`,
            ...response,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        inquiry.responses.push(newResponse);
        inquiry.updatedAt = new Date().toISOString();

        inquiries[index] = inquiry;
        await writeItems(INQUIRIES_FILE, inquiries);

        return newResponse;
    });
};

/**
 * 문의 상태 변경
 */
export const updateInquiryStatus = async (inquiryId: string, status: InquiryStatus): Promise<Inquiry | null> => {
    return await withMutex(INQUIRY_MUTEX_KEY, async () => {
        const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
        const { item: inquiry, index } = findItemById(inquiries, inquiryId);

        if (!inquiry) return null;

        inquiry.status = status;
        inquiry.updatedAt = new Date().toISOString();

        inquiries[index] = inquiry;
        await writeItems(INQUIRIES_FILE, inquiries);

        return inquiry;
    });
};

/**
 * 문의 읽음 상태 변경
 */
export const markInquiryAsRead = async (inquiryId: string, isRead = true): Promise<Inquiry | null> => {
    return await withMutex(INQUIRY_MUTEX_KEY, async () => {
        const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
        const { item: inquiry, index } = findItemById(inquiries, inquiryId);

        if (!inquiry) return null;

        inquiry.isRead = isRead;
        inquiry.updatedAt = new Date().toISOString();

        inquiries[index] = inquiry;
        await writeItems(INQUIRIES_FILE, inquiries);

        return inquiry;
    });
};

/**
 * 미읽은 문의 수 가져오기
 */
export const getUnreadInquiriesCount = async (): Promise<number> => {
    const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
    return inquiries.filter(inquiry => !inquiry.isRead).length;
};

/**
 * 새로운 문의 생성
 */
export const createInquiry = async (inquiry: Omit<Inquiry, 'id' | 'responses' | 'createdAt' | 'updatedAt' | 'isRead'>): Promise<Inquiry> => {
    return await withMutex(INQUIRY_MUTEX_KEY, async () => {
        const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);

        const newInquiry: Inquiry = {
            id: `inq-${uuidv4()}`,
            ...inquiry,
            responses: [],
            isRead: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        inquiries.unshift(newInquiry);
        await writeItems(INQUIRIES_FILE, inquiries);

        return newInquiry;
    });
};

/**
 * 문의 삭제
 */
export const deleteInquiry = async (inquiryId: string): Promise<boolean> => {
    return await withMutex(INQUIRY_MUTEX_KEY, async () => {
        const result = await deleteItem<Inquiry>(INQUIRIES_FILE, inquiryId);
        return result;
    });
};

/**
 * 문의 업데이트
 */
export const updateInquiry = async (inquiryId: string, updatedData: Partial<Inquiry>): Promise<Inquiry | null> => {
    return await withMutex(INQUIRY_MUTEX_KEY, async () => {
        const inquiries = await readItems<Inquiry>(INQUIRIES_FILE);
        const { item: inquiry, index } = findItemById(inquiries, inquiryId);

        if (!inquiry) return null;

        // adminNotes가 삭제되지 않도록 보호
        const updatedInquiry: Inquiry = {
            ...inquiry,
            ...updatedData,
            adminNotes: updatedData.adminNotes !== undefined ? updatedData.adminNotes : inquiry.adminNotes,
            updatedAt: new Date().toISOString()
        };

        inquiries[index] = updatedInquiry;
        await writeItems(INQUIRIES_FILE, inquiries);

        return updatedInquiry;
    });
}; 