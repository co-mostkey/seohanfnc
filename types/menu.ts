export interface SiteMenuItem {
    id: string;           // unique ID
    label: string;        // 메뉴 표시 이름
    path: string;         // 내부 링크 또는 외부 URL
    order: number;
    external?: boolean;   // 외부 링크 여부
    parentId?: string | null; // 상위 메뉴 ID (null 이면 최상위)
    content?: string; // 메뉴와 연관된 간단한 설명/컨텐츠 (옵션)
} 