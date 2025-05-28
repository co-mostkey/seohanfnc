"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { ArrowRight, Filter, Grid, List, Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { sortProductsByCategory } from '@/lib/utils/product-order';

interface ProductsClientProps {
  allProducts: Product[];
  productCategories: {
    id: string;
    nameKo: string;
    descriptionKo: string;
  }[];
  basePath: string;
  clientScript: string;
}

/**
 * 제품 페이지 클라이언트 컴포넌트
 * 클라이언트 측 상호작용이 필요한 부분들을 처리합니다.
 */
export function ProductsClient({
  allProducts,
  productCategories,
  basePath,
  clientScript
}: ProductsClientProps) {
  // 현재 활성화된 탭 및 카테고리 상태 관리
  const [activeSection, setActiveSection] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '제품', href: `${basePath}/products`, active: true }
  ];

  // 탭 메뉴 정의 - 탭 메뉴는 카테고리에서 직접 가져와서 사용
  const tabSections = productCategories.map(category => ({
    id: category.id,
    title: category.nameKo
  }));

  // 제품 승인번호 포맷 함수
  const getApprovalNumberDisplay = (product: Product): string | undefined => {
    if (product.id === "Lifesaving-Mat") {
      return "KFI 인정번호 : 매트 17-1";
    }
    if (product.id === "Training-Air-Mattress-Fall-Prevention-Mat") {
      return undefined; // 표시 안 함
    }

    // 에어슬라이드, 완강기, 간이완강기의 승인번호 추가
    if (product.id === "Air-Slide") {
      return "형식승인번호 : 19-4-1";
    }
    if (product.id === "Descending-Life-Line") {
      return "형식승인번호 : 완15-1-1";
    }
    if (product.id === "Handy-Descending-Life-Line") {
      return "형식승인번호 : 간완15-1-2";
    }

    // 수직강하식 구조대와 경사강하식 구조대의 형식승인번호 추가
    if (product.id === "Vertical-Rescue-Equipment") {
      return "형식승인번호 : 구23-3";
    }
    if (product.id === "Sloping-Rescue-Chute") {
      return "형식승인번호 : 구 04-2-1";
    }

    let rawApprovalInfo: string | undefined | string[];
    if (product.id === "Cylinder-Type-SafetyAirMat") {
      // approvalNumber 필드 우선 확인
      if (product.approvalNumber) {
        return `제품승인번호 : ${product.approvalNumber}`;
      }
      // specifications에서 제품승인번호 확인
      rawApprovalInfo = product.specifications?.['제품승인번호'];
      if (typeof rawApprovalInfo === 'string') {
        return `제품승인번호 : ${rawApprovalInfo.trim()}`;
      }
    } else if (product.id === "Fan-Type-Air-Safety-Mat") {
      // approvalNumber 필드 우선 확인
      if (product.approvalNumber) {
        return `제품승인번호 : ${product.approvalNumber}`;
      }
      // specifications에서 제품승인번호 확인
      rawApprovalInfo = product.specifications?.['제품승인번호'];
      if (typeof rawApprovalInfo === 'string') {
        return `제품승인번호 : ${rawApprovalInfo.trim()}`;
      }
    }
    return undefined;
  };

  // 에어매트 제품 ID 목록
  const airMatProductIds = [
    "Cylinder-Type-SafetyAirMat",
    "Fan-Type-Air-Safety-Mat",
    "Lifesaving-Mat",
    "Training-Air-Mattress-Fall-Prevention-Mat"
  ];

  const categoryFilteredProducts = activeSection === 'all'
    ? allProducts
    : activeSection === 'air-mats' // "에어매트" 탭 선택 시
      ? allProducts.filter(p => airMatProductIds.includes(p.id)) // ID 목록으로 필터링
      : sortProductsByCategory( // 다른 카테고리는 기존 방식대로
        allProducts.filter((product: Product) => product.category === activeSection),
        activeSection
      );

  const airMatProductsToDisplay = activeSection === 'air-mats'
    ? categoryFilteredProducts // 에어매트 탭이면 필터된 전체가 에어매트 제품
    : categoryFilteredProducts.filter(p => airMatProductIds.includes(p.id)); // 전체 탭일 때 에어매트 분리

  const otherProductsToDisplay = categoryFilteredProducts.filter(p => !airMatProductIds.includes(p.id));

  return (
    <div className="relative z-10 container mx-auto px-4 pt-20 pb-4 md:pt-24 md:pb-8">
      {/* 개선된 브레드크럼브 - 더 심플하게 */}
      <div className="mb-6 flex items-center text-sm text-gray-400 transition-opacity hover:text-gray-300">
        <Link
          href={breadcrumbItems[0].href}
          className="hover:text-primary-400 transition-colors"
        >
          {breadcrumbItems[0].text}
        </Link>
        <ArrowRight className="h-3 w-3 mx-2 opacity-60" />
        <span className="font-medium text-white">{breadcrumbItems[1].text}</span>
      </div>
      {/* 탭 네비게이션과 타이틀 */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              PRODUCTS
            </h1>
            <p className="text-gray-400 text-base">
              생명과 재산을 보호하여 보다 안전한 사회건설을 위하여 최선의 노력을 다할 것 입니다.
            </p>
          </div>

          {/* 보기 옵션 버튼 */}
          <div className="flex space-x-3 h-10 mt-2 md:mt-0">
            <div className="flex items-center rounded-md bg-gray-800/50 p-1 mr-3">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2.5 rounded-sm",
                  viewMode === 'grid'
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white"
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={15} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2.5 rounded-sm",
                  viewMode === 'list'
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white"
                )}
                onClick={() => setViewMode('list')}
              >
                <List size={15} />
              </Button>
            </div>

            {/* 탭 메뉴 버튼들 - 다소 큰 화면에서만 보임 */}
            <div className="hidden md:flex space-x-2">
              {tabSections.slice(0, 4).map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-all text-sm",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary-500/20"
                      : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/80 hover:text-white"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 탭 메뉴 - 모바일 버전 */}
      <div className="md:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4 flex">
        <div className="flex gap-2">
          {tabSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-all text-xs whitespace-nowrap",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary-500/20"
                  : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/80 hover:text-white"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
      {/* 전체 탭 메뉴 - 큰 화면에서만 보임 */}
      <div className="hidden md:flex overflow-x-auto pb-2 -mx-1 px-1 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {tabSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-all text-xs whitespace-nowrap",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary-500/20"
                  : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/80 hover:text-white"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
      {/* 카테고리 정보 노출 (에어매트 탭일 때도 표시되도록 조건 수정) */}
      {activeSection !== 'all' && productCategories.filter(cat => cat.id === activeSection).map(category => (
        <div key={category.id} className="mb-8 p-4 bg-gray-900/50 border border-gray-800/30 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-1">{category.nameKo}</h2>
          <p className="text-gray-400 text-sm">{category.descriptionKo}</p>
        </div>
      ))}
      {/* 검색결과 메시지 */}
      <div className="mb-6 text-sm text-gray-400 flex items-center justify-between">
        <span>검색결과: 전체 {allProducts.length}개 중 {categoryFilteredProducts.length}개 제품</span>
      </div>
      {/* 에어매트 섹션 (activeSection이 'all' 이거나 'air-mats' 일 때) */}
      {airMatProductsToDisplay.length > 0 && (activeSection === 'all' || activeSection === 'air-mats') && (
        <section className={cn(activeSection === 'all' && 'mb-12')}>
          {activeSection === 'all' && (
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">에어매트 제품</h2>
          )}
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          )}>
            {airMatProductsToDisplay.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nameKo || product.name}
                description={product.descriptionKo || product.description}
                image={product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined)}
                category={product.category}
                inquiryOnly={product.inquiryOnly as boolean | undefined}
                approvalNumber={getApprovalNumberDisplay(product)}
              />
            ))}
          </div>
        </section>
      )}
      {/* 기타 제품 섹션 (activeSection이 'all'이고 otherProductsToDisplay가 있을 때만) */}
      {otherProductsToDisplay.length > 0 && activeSection === 'all' && (
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">기타 안전장비</h2>
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          )}>
            {otherProductsToDisplay.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nameKo || product.name}
                description={product.descriptionKo || product.description}
                image={product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined)}
                category={product.category}
                inquiryOnly={product.inquiryOnly as boolean | undefined}
                approvalNumber={getApprovalNumberDisplay(product)}
              />
            ))}
          </div>
        </section>
      )}
      {/* 특정 카테고리 선택 시 (에어매트 제외) */}
      {activeSection !== 'all' && activeSection !== 'air-mats' && categoryFilteredProducts.length > 0 && (
        <section>
          {/* 카테고리명은 이미 위에서 표시됨 */}
          <div className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-4"
          )}>
            {categoryFilteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.nameKo || product.name}
                description={product.descriptionKo || product.description}
                image={product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined)}
                category={product.category}
                inquiryOnly={product.inquiryOnly as boolean | undefined}
                approvalNumber={getApprovalNumberDisplay(product)}
              />
            ))}
          </div>
        </section>
      )}
      {/* 결과 없을 때 메시지 (전체 필터링 후 최종 결과 기준) */}
      {categoryFilteredProducts.length === 0 && (
        <div className="col-span-full py-16 bg-gray-900/50 border border-gray-800/30 rounded-lg text-center">
          <Package className="mx-auto mb-4 h-10 w-10 text-gray-500" />
          <h3 className="text-xl font-medium mb-3 text-white">
            선택하신 카테고리에 해당하는 제품이 없습니다.
          </h3>
          <p className="text-gray-400 mb-6">
            다른 카테고리를 선택하시거나 전체 제품 목록을 확인해 보세요.
          </p>
          <Button
            variant="outline"
            className="border-gray-700 bg-black hover:bg-gray-900 text-white"
            onClick={() => {
              setActiveSection('all');
              window.location.hash = '';
            }}
          >
            전체 제품 보기 <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      )}
      {/* 하단 여백 */}
      <div className="pb-24 md:pb-32"></div>
      {/* 클라이언트 스크립트 주입 - 필요한 경우 사용 */}
      <script dangerouslySetInnerHTML={{ __html: clientScript }} />
    </div>
  );
}
