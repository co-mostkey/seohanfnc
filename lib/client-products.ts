// 클라이언트 사이드용 제품 데이터 유틸리티
// fs 모듈을 사용하지 않는 순수 데이터 조작 함수들

import { Product } from '@/types/product';

// 기본 제품 데이터 (빌드 시점에 포함됨)
const defaultProducts: Product[] = [
    {
        id: 'Cylinder-Type-SafetyAirMat',
        nameKo: '실린더형 공기안전매트',
        name: 'Cylinder Type Safety Air Mat',
        category: 'b-type',
        productCategoryId: 'b-type',
        showInProductList: true,
        description: '실린더형 공기안전매트입니다.',
        image: '/images/products/Cylinder-Type-SafetyAirMat.jpg'
    },
    {
        id: 'test-b-type-advanced',
        nameKo: '테스트 B타입 고급 제품',
        name: 'Test B-Type Advanced Product',
        category: 'b-type',
        productCategoryId: 'b-type',
        showInProductList: true,
        description: 'A타입 수준 디자인과 3D 모델링이 통합된 고급 B타입 제품입니다.',
        image: '/images/products/test-b-type-advanced/thumbnail.jpg'
    }
];

// 제품 ID로 제품 찾기
export function getProductByIdClient(id: string): Product | undefined {
    return defaultProducts.find(product => product.id === id);
}

// 카테고리별 제품 찾기
export function getProductsByCategoryClient(categoryId: string): Product[] {
    return defaultProducts.filter(product =>
        product.category === categoryId || product.productCategoryId === categoryId
    );
}

// 관련 제품 찾기
export function getRelatedProductsClient(productId: string, limit: number = 4): Product[] {
    const currentProduct = getProductByIdClient(productId);
    if (!currentProduct) return [];

    const category = currentProduct.category || currentProduct.productCategoryId;
    if (!category) return [];

    return defaultProducts
        .filter(product =>
            product.id !== productId &&
            (product.category === category || product.productCategoryId === category)
        )
        .slice(0, limit);
}

// 모든 제품 가져오기
export function getAllProductsClient(): Product[] {
    return defaultProducts;
} 