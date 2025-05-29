export interface DeliveryRecord {
    id: string; // 각 납품 실적 항목에 대한 고유 ID
    company: string;
    project: string;
    date: string; // YYYY-MM-DD 형식 또는 YYYY-MM 형식
    isApartment?: boolean;
}

export type PromotionType =
    | 'deliveryRecordList' // 납품 실적 목록 (여러 DeliveryRecord를 포함)
    | 'video' // 일반 홍보 비디오
    | 'image' // 홍보 이미지
    | 'document' // 홍보 문서 (PDF 등 링크)
    | 'mainTitleBoxMultiVideo' // MainTitleBox 내부 플레이어용 다중 비디오
    | 'customContent' // 커스텀 HTML 콘텐츠
    | 'gallery' // 이미지 갤러리
    | 'news' // 뉴스/소식
    | 'timeline'; // 연혁/타임라인

export interface PromotionItem {
    id: string; // 홍보 자료의 고유 ID
    type: PromotionType;
    title: string; // 홍보 자료 제목
    description?: string; // 상세 설명
    boxTitle?: string; // 컨테이너 박스에 표시될 타이틀 (예: "2024년 주요 납품실적")

    // type 'mainHeroVideo' 또는 'video'일 때 사용
    videoUrl?: string; // 비디오 파일 경로 또는 외부 URL
    videoUrls?: string[]; // 다중 비디오 파일 경로 또는 외부 URL (mainTitleBoxMultiVideo 타입용)
    thumbnailUrl?: string; // 비디오 썸네일 이미지 경로

    // 버튼 관련 필드 (mainTitleBoxMultiVideo 타입에서 주로 사용)
    showButton?: boolean; // 버튼 표시 여부
    buttonText?: string; // 버튼 텍스트 (예: "제품 보러가기")
    buttonLink?: string; // 버튼 클릭 시 이동할 링크

    // type 'image'일 때 사용
    imageUrl?: string; // 이미지 파일 경로 또는 외부 URL

    // type 'document'일 때 사용
    documentUrl?: string; // 문서 파일 경로 또는 외부 URL
    fileName?: string; // 문서 파일명 (예: "회사소개서.pdf")

    // type 'deliveryRecordList'일 때 사용
    records?: DeliveryRecord[]; // 납품 실적 데이터 목록

    // type 'customContent'일 때 사용 - 마크다운 및 HTML 지원
    customHtml?: string; // 커스텀 HTML 콘텐츠
    markdownContent?: string; // 마크다운 형식의 콘텐츠
    contentType?: 'html' | 'markdown'; // 콘텐츠 타입 구분

    // type 'gallery'일 때 사용 - 다중 이미지 업로드 지원
    galleryImages?: {
        id: string;
        url: string;
        caption?: string;
        order?: number;
    }[]; // 갤러리 이미지 목록

    // type 'news'일 때 사용 - 외부 링크 지원 개선
    newsLink?: string; // 뉴스 외부 링크
    newsDescription?: string; // 뉴스 설명
    newsDate?: string; // 뉴스 날짜
    newsSource?: string; // 뉴스 출처

    // 기존 newsItems는 deprecated로 유지 (호환성)
    newsItems?: { title: string; date: string; content: string; link?: string }[]; // 뉴스 항목 목록

    // type 'timeline'일 때 사용
    timelineItems?: { year: string; title: string; description: string }[]; // 타임라인 항목 목록

    order: number; // 표시 순서
    isVisible: boolean; // 공개 여부 (메인 페이지 노출 여부 등)
    createdAt: string; // 생성일 (ISO 8601 형식)
    updatedAt: string; // 수정일 (ISO 8601 형식)
}

// 초기 납품 실적 데이터 (기존 ProjectReference와 유사)
export const initialDeliveryRecords: DeliveryRecord[] = [
    { id: 'delivery-1', company: "한국도로공사", project: "고속도로 VMS 시스템", date: "2024-07", isApartment: false },
    { id: 'delivery-2', company: "롯데건설", project: "롯데캐슬 시그니처 중앙공원", date: "2024-06", isApartment: true },
    { id: 'delivery-3', company: "현대건설", project: "힐스테이트 더 운정", date: "2024-05", isApartment: true },
    { id: 'delivery-4', company: "포스코이앤씨", project: "더샵 아르테", date: "2024-04", isApartment: true },
    { id: 'delivery-5', company: "반도건설", project: "운서역 반도유보라", date: "2024-03", isApartment: true },
    { id: 'delivery-6', company: "대우건설", project: "푸르지오 스타셀라49", date: "2024-02", isApartment: true },
    { id: 'delivery-7', company: "태영건설", project: "데시앙 아파트", date: "2024-01", isApartment: true },
]; 