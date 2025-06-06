"use client";

import { SafetyEquipment3DShowcase } from './3d-showcase';
import { type Product } from '@/types/product';

/**
 * 안전장비 카테고리 클라이언트 컴포넌트
 * 
 * 이 컴포넌트는 새로 구현된 3D 쇼케이스 컴포넌트를 사용합니다.
 * - 상하 스크롤을 통한 3D 제품 탐색
 * - 제품별 3D 모델링 공간
 * - 자연스러운 3D 공간감 제공
 */
export function SafetyEquipmentCategoryPage({ products }: { products: Product[] }) {
  // products 배열에 category 필드를 추가하여 3D Showcase와 호환되도록 변환
  const productsWithCategory = products.map(product => ({
    ...product,
    category: product.categoryId || 'b-type' // categoryId를 category로 매핑
  }));

  return <SafetyEquipment3DShowcase products={productsWithCategory} />;
}
