// 연관 파일:
// - data/products.ts (Product, Document, MediaGalleryItem 사용처)
// - types/component-props.ts (Product 타입을 사용하여 Props 정의)
// - client.tsx (Product, Document, MediaGalleryItem 타입 사용)

/**
 * 제품 관련 문서 파일 정보
 */
export interface Document {
  id: string;
  name: string;       // 문서 이름
  nameKo: string;
  nameEn?: string;   // 영문 문서 이름 (선택사항)
  nameCn?: string;
  description?: string; // 문서 설명
  url: string;       // 문서 다운로드 URL
  filename?: string; // 다운로드시 파일명
  fileType?: string; // 파일 형식 (PDF, DWG 등)
  type: 'pdf' | 'doc' | 'etc';
  fileSize?: string; // 파일 크기 정보
  path: string;     // 로컬 경로 (내부 사용)
}

/**
 * 다국어 문자열 타입 - name 및 description에 사용
 */
export interface LocalizedString {
  ko?: string;
  en?: string;
  cn?: string;
  [key: string]: string | undefined;
}

/**
 * 갤러리/미디어 아이템 공통 인터페이스 (data/products.ts의 loadedVideos/loadedGalleryImages 기준)
 */
export interface MediaGalleryItem {
  id: string;
  src: string; // 이미지 경로 또는 비디오 경로
  alt: string;
  type: 'image' | 'video';
  description?: string;
  caption?: string;
}

/**
 * 제품 특징 인터페이스
 */
export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

/**
 * 제품 스펙 인터페이스
 */
export interface Specification {
  name: string;
  value: string;
  unit?: string;
}

export interface SpecTableItem {
  title: string;
  [key: string]: string; // For model-specific values like 5F_A, 10F, etc.
}

// Air-Slide 전용 갤러리 아이템 (isFeatured, caption, videoSrc 등이 필요할 수 있음)
export interface GalleryImageItem {
  src: string; // 이미지 썸네일 또는 비디오 썸네일
  alt?: string;
  type?: 'image' | 'video';
  isFeatured?: boolean;
  caption?: string;
  videoSrc?: string; // 실제 비디오 경로
}

export interface Product {
  id: string;
  name?: string | LocalizedString;  // 기본/영문 제품명 또는 다국어 객체
  nameKo?: string;
  nameEn?: string;       // 명시적 영문명 (json의 nameEn과 매칭)
  nameCn?: string;

  productCategoryId?: string; // API 응답 및 내부 로직용 (저장 시에는 제거)
  categoryId?: string;      // products.json 저장용 (상위 카테고리 id와 동일)
  // category: string;     // products.json의 category 필드와 동일, productCategoryId와 중복될 수 있어 categoryId로 통일 고려

  description?: string | LocalizedString;  // 기본/영문 설명 또는 다국어 객체
  descriptionKo?: string;
  descriptionEn?: string;
  descriptionCn?: string;

  // 제품 스타일 타입 (A: 기본 업로드 스타일, B: 에어매트 스타일)
  productStyle?: 'A' | 'B';

  longDescription?: string;
  image: string;
  gallery_images_data?: MediaGalleryItem[];
  videos?: MediaGalleryItem[];
  features?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  specifications?: Record<string, string>;
  specTable?: SpecTableItem[];
  detailedSpecTable?: string[][];
  impactAbsorptionData?: string[][];
  technicalData?: Array<{
    label: string;
    value: string;
    unit?: string;
  }>;
  certificationsAndFeatures?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  documents?: Document[];
  cautions?: string[];
  pageBackgroundImage?: string;
  pageHeroTitle?: string;
  pageHeroSubtitles?: {
    text: string;
    color?: string; // HEX 또는 Tailwind 색상 클래스
    size?: number;  // px 단위 폰트 크기
  }[];
  seoStructuredData?: string; // JSON-LD 등 LLM 최적화 스크립트
  relatedProductIds?: string[];
  modelName?: string;
  modelNumber?: string;
  modelImage?: string;
  modelFile?: string;        // 3D 모델 파일 (.glb) 경로
  modelStyle?: string;       // 3D 모델 스타일 프리셋
  series?: string;
  tags?: string[];
  additionalGalleryImages?: GalleryImageItem[];
  showInProductList?: boolean;
  isSummaryPage?: boolean;
  isPublished?: boolean;  // 게시 상태 (관리자 페이지에서 사용)
  sortOrder?: number;     // 정렬 순서 (드래그 앤 드롭으로 변경 가능)

  [key: string]: any; // 기존 유지, 단 categoryId로 대체된 category 필드는 여기서 제외될 수 있도록 주의
}

export interface ProductCategory {
  id: string;
  nameKo: string;
  nameEn: string;
  descriptionKo?: string;
  descriptionEn?: string;
  image?: string;
  products: Product[];
}

// API에서 사용하는 카테고리 그룹 타입 (ProductCategory와 유사하지만 다국어 지원 확장)
export interface ProductCategoryGroup {
  id: string;
  nameKo: string;
  nameEn: string;
  nameCn: string;
  descriptionKo?: string;
  descriptionEn?: string;
  descriptionCn?: string;
  image?: string;
  products: Product[];
} 