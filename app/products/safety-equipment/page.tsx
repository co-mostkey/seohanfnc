import { Metadata } from "next";
import { findProductsByCategory } from '@/data/products';
import { sortProductsByCategory } from '@/lib/utils/product-order';
import { SafetyEquipmentCategoryPage } from "./client";

export const metadata: Metadata = {
  title: "안전장비 | 서한에프앤씨",
  description: "서한에프앤씨의 안전장비 제품들을 살펴보세요.",
};

/**
 * 안전장비 카테고리 페이지
 * 
 * 서버 컴포넌트에서 제품 데이터를 가져와 클라이언트 컴포넌트에 전달합니다.
 * - findProductsByCategory: 해당 카테고리의 모든 제품을 가져옵니다.
 * - sortProductsByCategory: 제품을 카테고리별로 정렬합니다.
 */
export default function SafetyEquipmentPage() {
  // 서버에서 데이터 가져오기
  const allSafetyProducts = findProductsByCategory("b-type");
  console.log('서버: 안전장비 전체 제품 개수:', allSafetyProducts.length);
  console.log('서버: 안전장비 제품 ID 목록:', allSafetyProducts.map(p => p.id));

  const safetyProducts = sortProductsByCategory(
    allSafetyProducts,
    "b-type"
  );
  console.log('서버: 정렬된 안전장비 제품 개수:', safetyProducts.length);
  console.log('서버: 정렬된 안전장비 제품 ID 목록:', safetyProducts.map(p => p.id));

  // 클라이언트 컴포넌트에 데이터 전달
  return <SafetyEquipmentCategoryPage products={safetyProducts} />;
}
