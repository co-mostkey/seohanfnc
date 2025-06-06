'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MessageSquare, FileText, Shield, Check, Download } from 'lucide-react';

// 분리된 컴포넌트들 가져오기
import ProductHeader from '@/components/products/b-type/ProductHeader';
import ProductModelViewer from '@/components/products/b-type/ProductModelViewer';
import ProductSpecifications from '@/components/products/b-type/ProductSpecifications';
import ProductTestData from '@/components/products/b-type/ProductTestData';
import ProductFeatures from '@/components/products/b-type/ProductFeatures';
import ProductCautions from '@/components/products/b-type/ProductCautions';
import ProductDocuments from '@/components/products/b-type/ProductDocuments';

/**
 * 안전장비 제품 상세 인터페이스
 */
interface ProductDetailProps {
  productId: string;
  productName: string;
  description: string;
  specifications: Record<string, string>;
  features: Array<{ title: string; description: string }>;
  fallbackImage: string;
  documents?: Array<{
    id: string;
    nameKo: string;
    path: string;
    type: string;
  }>;
  specTable?: any;
  cautions?: string[];
  category?: string;
}

/**
 * 안전장비 제품 상세 페이지 클라이언트 컴포넌트
 * 
 * 3D 모델을 메인 비주얼로 사용하며, 로딩 중이거나 모델이 없을 경우 대체 이미지를 표시합니다.
 * 제품 상세 정보, 사양, 특징, 주의사항 등을 탭으로 구분하여 보여줍니다.
 */
export default function SafetyEquipmentProductDetail({
  productId,
  productName,
  description,
  specifications,
  features,
  fallbackImage,
  documents,
  specTable,
  cautions,
  category = 'b-type'
}: ProductDetailProps) {
  // 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'documents'>('overview');

  return (
    // React Fragment로 감싸서 불필요한 div 레이어 제거
    <>
      {/* 제품 상세 컨테이너 - 모던한 트랜스페런트 디자인 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative bg-gray-900/80 border border-red-900/20 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          {/* 배경 장식 요소 - 느낌있는 그라디언트 */}
          <div className="absolute -top-80 -right-80 w-[600px] h-[600px] rounded-full bg-red-500/10 blur-3xl"></div>
          <div className="absolute -bottom-80 -left-80 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl"></div>
          <div className="absolute top-40 left-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-3xl"></div>

          {/* 상세 정보 탭 레이아웃 */}
          <div className="relative z-10 p-6 md:p-8 lg:p-10">
            {/* 탭 네비게이션 */}
            <div className="border-b border-red-900/20 mb-8">
              <div className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                <div
                  className={cn(
                    "px-5 py-2 rounded-t-lg text-sm border-t border-l border-r transition-colors cursor-pointer",
                    activeTab === 'overview'
                      ? "bg-gradient-to-br from-red-900/40 to-red-800/20 text-white font-medium border-red-500/20"
                      : "bg-gray-800/30 text-gray-400 hover:text-white border-gray-700/30"
                  )}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    제품 상세
                  </span>
                </div>
                <div
                  className={cn(
                    "px-5 py-2 rounded-t-lg text-sm border-t border-l border-r transition-colors cursor-pointer",
                    "bg-gray-800/30 text-gray-400 hover:text-white border-gray-700/30 hover:bg-gradient-to-br hover:from-red-900/30 hover:to-red-800/10"
                  )}
                  onClick={() => {
                    // 탭 전환 대신 스크롤 이동
                    const specSection = document.getElementById('specificationSection');
                    if (specSection) {
                      specSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <span className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    제품 사양
                  </span>
                </div>

                <div
                  className={cn(
                    "px-5 py-2 rounded-t-lg text-sm border-t border-l border-r transition-colors cursor-pointer",
                    activeTab === 'features'
                      ? "bg-gradient-to-br from-red-900/40 to-red-800/20 text-white font-medium border-red-500/20"
                      : "bg-gray-800/30 text-gray-400 hover:text-white border-gray-700/30"
                  )}
                  onClick={() => setActiveTab('features')}
                >
                  <span className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    제품 특징
                  </span>
                </div>

                {documents && documents.length > 0 && (
                  <div
                    className={cn(
                      "px-5 py-2 rounded-t-lg text-sm border-t border-l border-r transition-colors cursor-pointer",
                      activeTab === 'documents'
                        ? "bg-gradient-to-br from-red-900/40 to-red-800/20 text-white font-medium border-red-500/20"
                        : "bg-gray-800/30 text-gray-400 hover:text-white border-gray-700/30"
                    )}
                    onClick={() => setActiveTab('documents')}
                  >
                    <span className="flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      자료
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 컨텐츠 영역 */}
            <div>
              {/* 제품 상세 정보 탭 */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* 제품 소개 및 모델 섹션 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 좌측 - 3D 모델/이미지 갤러리 */}
                    <div className="animate-fadeIn">
                      <ProductModelViewer
                        productId={productId}
                        productName={productName}
                        fallbackImage={fallbackImage}
                      />
                    </div>

                    {/* 우측 - 제품 정보 */}
                    <div className="space-y-6">
                      {/* 제품 제목 및 설명 */}
                      <ProductHeader
                        productName={productName}
                        description={description}
                      />

                      {/* 기능 아이콘 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center p-3.5 rounded-lg bg-red-900/20 border border-red-900/30 hover:bg-red-900/30 transition-colors">
                          <div className="p-2 rounded-full bg-red-900/30 mr-3">
                            <Shield className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-white">안전 인증</h3>
                            <p className="text-xs text-gray-400">품질 보증</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3.5 rounded-lg bg-blue-900/20 border border-blue-900/30 hover:bg-blue-900/30 transition-colors">
                          <div className="p-2 rounded-full bg-blue-900/30 mr-3">
                            <Shield className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-white">안전 인증</h3>
                            <p className="text-xs text-gray-400">안전기준 충족</p>
                          </div>
                        </div>
                      </div>

                      {/* 버튼 그룹 */}
                      <div className="space-y-3">
                        {/* 제품 사양 바로가기 버튼 */}
                        <button
                          onClick={() => {
                            const specSection = document.getElementById('specificationSection');
                            if (specSection) {
                              specSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="flex justify-center w-full items-center px-5 py-3 rounded-lg bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/80 hover:to-red-800/80 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-red-600/30"
                        >
                          <Shield className="h-5 w-5 mr-2" />
                          제품 사양 및 테스트 데이터 보기
                        </button>

                        {/* 제품 문의하기 버튼 */}
                        <Link
                          href="/contact"
                          className="flex justify-center w-full items-center px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-600/30"
                        >
                          <MessageSquare className="h-5 w-5 mr-2" />
                          제품 문의하기
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 제품 사양 섹션 */}
                  <div id="specificationSection">
                    <ProductSpecifications
                      specifications={specifications}
                      specTable={specTable}
                    />
                  </div>

                  {/* 충격흡수 비교 데이터 */}
                  <ProductTestData productId={productId} />

                  {/* 주의사항 섹션 */}
                  {cautions && cautions.length > 0 && (
                    <ProductCautions cautions={cautions} />
                  )}
                </div>
              )}

              {/* 제품 특징 탭 */}
              {activeTab === 'features' && (
                <ProductFeatures features={features} />
              )}

              {/* 문서 탭 */}
              {activeTab === 'documents' && documents && (
                <ProductDocuments documents={documents} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
