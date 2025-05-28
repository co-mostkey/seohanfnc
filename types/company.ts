export interface CompanyInfo {
    id: string; // unique identifier, e.g., 'default'
    nameKo: string;
    nameEn?: string;
    addressKo: string;
    addressEn?: string;
    phone?: string;
    fax?: string;
    email?: string;
    supportEmail?: string;
    businessHours?: string;
    CEO?: string;
    businessNumber?: string;
    established?: string; // YYYY-MM-DD
    description?: string; // 회사 소개 (메인 타이틀 아래, About 페이지 서브타이틀로도 활용)
    intro?: string;       // 인사말/개요 첫 번째 문단 (About 페이지용)
    philosophy?: string;  // 인사말/개요 두 번째 문단 (About 페이지용)
    aboutPageMainTitleFormat?: string; // About 페이지 메인 타이틀 형식 (플레이스홀더: {nameKo})
    aboutPageSectionTitleFormat?: string; // About 페이지 "인사말 및 회사 개요" 섹션 제목 형식 (플레이스홀더: {nameKo}, HTML 허용)
    aboutPageMainTitleClassName?: string; // 추가: About 페이지 메인 타이틀 Tailwind 클래스
    logoUrl?: string; // 기본 회사 로고 URL
    aboutPageVisualUrl?: string; // About 페이지 "인사말" 섹션용 비주얼(이미지/로고) URL
    aboutPageHeroImageUrl?: string; // About 페이지 상단 히어로 영역 배경 이미지 URL
    showAboutIntroSection?: boolean; // About 페이지 "인사말 및 회사 개요" 섹션 표시 여부
    logo3DSettings?: Logo3DSettings; // 3D 로고 설정
    philosophyStatement?: string; // 경영 철학 탭 전용 내용
    coreValues?: CoreValueItem[]; // 핵심 가치 목록
    businessType?: string;
    employees?: string;
    annualRevenue?: string;
    website?: string;
    history?: string;
    historyStyles?: HistoryStyles; // 연혁 스타일 설정
    vision?: string;
    awardsAndCertifications?: AwardItem[]; // 새로운 인증/수상 정보 필드
    researchPage?: ResearchPageData; // 연구개발 페이지 데이터
    // 위치 정보
    latitude?: string;
    longitude?: string;
    mapApiKey?: string;
    directions?: string;
    transportation?: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
        blog?: string;
        linkedin?: string;
    };
    // 추가될 수 있는 다른 필드들
    [key: string]: any; // To allow for dynamic properties if needed
}

export interface CoreValueItem {
    id: string; // 각 아이템을 식별하기 위한 고유 ID (예: UUID 또는 타임스탬프)
    icon?: string; // Lucide 아이콘 이름 또는 이미지 URL
    mainTitle?: string;
    subTitle?: string;
    description?: string;
}

export interface HistoryStyles {
    colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
    timelineStyle: 'modern' | 'classic' | 'minimal';
    showIcons: boolean;
    showDates: boolean;
    compactMode: boolean;
}

export interface Logo3DSettings {
    enableRotation?: boolean;
    rotationSpeed?: number;
    modelScale?: number;
    stylePreset?: Logo3DStylePreset;
    glbFileUrl?: string;

    viewerBackgroundType?: 'color' | 'hdri' | 'transparent';
    viewerBackgroundColor?: string;
    viewerBackgroundHdriPath?: string;
}

export type Logo3DStylePreset = 'default' | 'metallic' | 'vibrant' | 'darkElegant' | 'minimalLight';

export interface AwardItem {
    id: string; // 각 아이템을 식별하기 위한 고유 ID
    title: string; // 인증/수상명
    description?: string; // 세부 설명
    year?: string; // 취득 연도
    issuingOrganization?: string; // 발행 기관
    imageUrl?: string; // 이미지 URL
    link?: string; // 관련 링크
}

export interface ResearchPageData {
    hero: {
        title: string;
        subtitle: string;
        backgroundColor?: string;
        backgroundImageUrl?: string;
        backgroundOpacity?: number;
        backgroundOverlayColor?: string;
    };
    introduction: {
        title: string;
        description: string;
        imageUrl?: string;
    };
    areas: {
        title: string;
        items: Array<{
            id: string;
            icon: string;
            title: string;
            description: string;
        }>;
    };
    achievements: {
        title: string;
        items: Array<{
            id: string;
            year: string;
            title: string;
            details: string;
        }>;
    };
    awardsSectionTitle: string;
    infrastructure: {
        title: string;
        description: string;
        imageUrl?: string;
    };
} 