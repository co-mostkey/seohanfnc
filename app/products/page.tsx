import { getAllProducts, getCategoryName } from "@/data/products"; // 데이터 가져오기 함수 임포트
import { Product } from "@/types/product"; // Product 타입 임포트
import { ProductsClient } from "./products-client"; // 클라이언트 컴포넌트 임포트

/**
 * 제품 페이지 (서버 컴포넌트)
 * 초기 데이터를 로드하고 클라이언트 컴포넌트에 전달합니다.
 */
export default function ProductsPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // 전체 제품 데이터 가져오기
  const allProducts: Product[] = getAllProducts();

  // 에어매트 제품 ID 목록 (client.tsx와 동일하게 사용 가능)
  const airMatProductIds = [
    "Cylinder-Type-SafetyAirMat",
    "Fan-Type-Air-Safety-Mat",
    "Lifesaving-Mat",
    "Training-Air-Mattress-Fall-Prevention-Mat"
  ];

  // 제품 카테고리 리스트 생성 (전체 제품만 표시)
  const productCategories = [
    { id: "all", nameKo: "전체 제품", descriptionKo: "서한에프앤씨의 모든 제품을 확인하세요." }
  ];

  // 해시 기반의 필터링을 위한 클라이언트 사이드 스크립트
  const clientScript = `
    // 현재 해시에 따라 헬퍼 함수들 정의
    function getHashFromURL() {
      return window.location.hash.slice(1) || 'all';
    }

    function filterProductsByCategory() {
      const selectedCategory = getHashFromURL();
      // 카테고리 버튼들
      document.querySelectorAll('[href^="#"]').forEach(button => {
        const category = button.getAttribute('href').slice(1) || 'all';
        if (category === selectedCategory) {
          button.classList.add('bg-blue-600', 'text-white', 'shadow-md');
          button.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:text-gray-200', 'dark:hover:bg-gray-700');
        } else {
          button.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
          button.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100', 'dark:bg-gray-800', 'dark:text-gray-200', 'dark:hover:bg-gray-700');
        }
      });

      // 카테고리 설명 표시
      document.querySelectorAll('[id]').forEach(categoryDesc => {
        if (categoryDesc.id === selectedCategory) {
          categoryDesc.classList.remove('hidden');
          categoryDesc.classList.add('block');
        } else {
          categoryDesc.classList.add('hidden');
          categoryDesc.classList.remove('block');
        }
      });

      // 필터링할 데이터 속성 & 선택자
      const categoryDataAttr = 'data-category';
      const productSelector = '.product-card[' + categoryDataAttr + ']';
      const allProducts = document.querySelectorAll(productSelector);
      
      let hasVisibleProducts = false;

      // 카테고리에 따른 필터링
      allProducts.forEach(product => {
        const productCategory = product.getAttribute(categoryDataAttr);
        
        if (selectedCategory === 'all' || productCategory === selectedCategory) {
          product.style.display = '';
          hasVisibleProducts = true;
        } else {
          product.style.display = 'none';
        }
      });

      // 결과가 없을 때 메시지 표시
      const noResultsMessage = document.getElementById('no-results-message');
      if (noResultsMessage) {
        noResultsMessage.style.display = hasVisibleProducts ? 'none' : 'block';
      }
    }

    // 연결된 피리
    document.addEventListener('DOMContentLoaded', function() {
      filterProductsByCategory();
    });
    
    // 해시 변경시 필터링 적용
    window.addEventListener('hashchange', filterProductsByCategory);
  `;

  // 클라이언트 컴포넌트에 데이터 전달
  return (
    <ProductsClient
      allProducts={allProducts}
      productCategories={productCategories}
      basePath={basePath}
      clientScript={clientScript}
    />
  );
}

