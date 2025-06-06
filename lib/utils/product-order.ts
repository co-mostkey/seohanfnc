/**
 * 제품 정렬 유틸리티 함수
 * 특정 카테고리의 제품 표시 순서를 관리합니다.
 */

// 공기안전매트 카테고리 제품 정렬 순서
const SAFETY_MAT_ORDER = [
  'Cylinder-Type-SafetyAirMat', // 1순위: 실린더형 공기안전매트
  'Fan-Type-Air-Safety-Mat',    // 2순위: 팬형 공기안전매트
  'Lifesaving-Mat'              // 3순위: 인명구조 매트
];

/**
 * 특정 카테고리의 제품 목록을 원하는 순서로 정렬
 * @param products 제품 목록
 * @param categoryId 카테고리 ID
 * @returns 정렬된 제품 목록
 */
export function sortProductsByCategory(products: any[], categoryId: string): any[] {
  // 안전장비 카테고리인 경우 지정된 순서로 정렬
  if (categoryId === 'b-type') {
    // 안전장비 카테고리에 속한 제품만 필터링
    const safetyProducts = products.filter(p => p.category === 'b-type');

    // 공기안전매트 제품들 (지정된 순서대로 정렬)
    const safetyMats = safetyProducts
      .filter(p => SAFETY_MAT_ORDER.includes(p.id))
      .sort((a, b) => {
        return SAFETY_MAT_ORDER.indexOf(a.id) - SAFETY_MAT_ORDER.indexOf(b.id);
      });

    // 그 외 안전장비 제품들 (기존 순서 유지)
    const otherSafetyProducts = safetyProducts
      .filter(p => !SAFETY_MAT_ORDER.includes(p.id));

    // 정렬된 안전장비 제품들과 기타 제품들 병합
    return [...safetyMats, ...otherSafetyProducts];
  }

  // 다른 카테고리는 원래 순서 유지
  return products;
}

/**
 * 전체 제품 목록에서 카테고리별 정렬 적용
 * @param products 전체 제품 목록
 * @returns 카테고리별로 정렬된 제품 목록
 */
export function applyCategoryOrdering(products: any[]): any[] {
  // 카테고리별로 그룹화
  const groupedByCategory: { [key: string]: any[] } = {};

  // 카테고리별로 제품 그룹화
  products.forEach(product => {
    const category = product.category || 'uncategorized';
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }
    groupedByCategory[category].push(product);
  });

  // 각 카테고리별로 정렬 적용
  const sortedProducts: any[] = [];
  Object.keys(groupedByCategory).forEach(categoryId => {
    const sortedCategoryProducts = sortProductsByCategory(
      groupedByCategory[categoryId],
      categoryId
    );
    sortedProducts.push(...sortedCategoryProducts);
  });

  return sortedProducts;
}
