// 연관 파일:
// - types/product.ts (Product, Document, MediaGalleryItem 타입 정의처)
// - client.tsx (ProductDetailClientProps 사용처)
// - page.tsx (ProductDetailClientProps 간접적 연관)

import { Product, Document, MediaGalleryItem } from './product';

// 제품 상세 페이지 클라이언트 컴포넌트용 Props
export interface ProductDetailClientProps {
    productId: string;
    initialProductName: string;
    galleryImagesData: MediaGalleryItem[];
    videoGalleryData: MediaGalleryItem[];
    mainImage?: string;
    initialDescription?: string;
    features?: Product['features'];
    documents?: Document[];
    specTable?: Product['specTable'];
    modelNumber?: string;
    manufacturer?: string;
    countryOfOrigin?: string;
    dimensions?: string;
    weight?: string;
    materials?: string;
    certificationsAndFeatures?: Product['certificationsAndFeatures'];
    cautions?: string[];
    pageBackgroundImage?: string;
    approvalNumber?: string;
    applicableHeight?: string;
    otherOptions?: string;
    additionalSections?: Array<{ title: string; content: string; }>;
    modelPath?: string;
}

// 필요에 따라 다른 컴포넌트들의 공용 prop 타입도 여기에 정의 가능 