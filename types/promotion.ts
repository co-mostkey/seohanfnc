export interface DeliveryRecord {
    id: string; // 각 납품 실적 항목에 대한 고유 ID
    company: string;
    project: string;
    date: string; // YYYY-MM-DD 형식 또는 YYYY-MM 형식
    isApartment?: boolean;
}

export type PromotionType =
    | 'mainHeroVideo' // 메인 히어로 전용 비디오
    | 'deliveryRecordList' // 납품 실적 목록 (여러 DeliveryRecord를 포함)
    | 'video' // 일반 홍보 비디오
    | 'image' // 홍보 이미지
    | 'document'; // 홍보 문서 (PDF 등 링크)

export interface PromotionItem {
    id: string; // 홍보 자료의 고유 ID
    type: PromotionType;
    title: string; // 홍보 자료 제목
    description?: string; // 상세 설명

    // type 'mainHeroVideo' 또는 'video'일 때 사용
    videoUrl?: string; // 비디오 파일 경로 또는 외부 URL
    thumbnailUrl?: string; // 비디오 썸네일 이미지 경로

    // type 'image'일 때 사용
    imageUrl?: string; // 이미지 파일 경로 또는 외부 URL

    // type 'document'일 때 사용
    documentUrl?: string; // 문서 파일 경로 또는 외부 URL
    fileName?: string; // 문서 파일명 (예: "회사소개서.pdf")

    // type 'deliveryRecordList'일 때 사용
    records?: DeliveryRecord[]; // 납품 실적 데이터 목록

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