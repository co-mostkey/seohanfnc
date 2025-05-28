'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import {
  ChevronLeft, Award, Shield, AlertTriangle, Clock,
  Activity, Film, MessageSquare, FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductDetailImage } from '@/components/products/ProductDetailImage';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { ProductVideoSection } from '@/components/products/ProductVideoSection';

interface ProductDetailViewProps {
  product: Product;
  productName: string;
  categoryName: string;
  productDescription?: string;
  productImages: Array<{ src: string, alt: string, type: 'image' }>;
  productVideos: Array<{ src: string, alt: string, type: 'video' }>;
  onSelectImage: (index: number) => void;
}

/**
 * 제품 상세 정보를 표시하는 컴포넌트
 * 제품 이미지, 사양, 비디오 등의 정보를 구조화된 형태로 표시합니다.
 */
export function ProductDetailView({
  product,
  productName,
  categoryName,
  productDescription = '',
  productImages,
  productVideos,
  onSelectImage
}: ProductDetailViewProps) {
  return (
    <>
      {/* 제품 상세 콘텐츠 헤더 - 스크롤 애니메이션과 함께 표시 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 animate-fadeIn">{productName}</h2>
              <div className="flex items-center">
                <div className="h-0.5 w-12 bg-red-600/80 mr-3"></div>
                <span className="text-red-400/90 font-medium text-sm">{categoryName}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/products"
                className="inline-flex items-center px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-red-600/30 group"
              >
                <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                제품 목록 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
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
                <div className="px-5 py-2 bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-t-lg text-white font-medium text-sm border-t border-l border-r border-red-500/20 cursor-pointer">
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    제품 상세
                  </span>
                </div>
                <div className="px-5 py-2 bg-gray-800/30 rounded-t-lg text-gray-400 hover:text-white text-sm border-t border-l border-r border-gray-700/30 transition-colors cursor-pointer">
                  <span className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    제품 사양
                  </span>
                </div>
                <div className="px-5 py-2 bg-gray-800/30 rounded-t-lg text-gray-400 hover:text-white text-sm border-t border-l border-r border-gray-700/30 transition-colors cursor-pointer">
                  <span className="flex items-center">
                    <Film className="w-5 h-5 mr-2" />
                    영상
                  </span>
                </div>
              </div>
            </div>

            {/* 제품 상세 정보 - 레이아웃 개선 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* 좌측 - 이미지 갤러리 (크게 표시) */}
              <div className="order-1 lg:col-span-3 animate-fadeIn">
                <div className="backdrop-blur-sm bg-gray-800/20 p-4 rounded-xl border border-gray-700/30 shadow-lg">
                  <ProductDetailImage
                    images={productImages}
                    onSelectImage={onSelectImage}
                  />
                </div>
              </div>

              {/* 우측 - 제품 정보 및 특성 */}
              <div className="order-2 lg:col-span-2 flex flex-col space-y-6 animate-fadeInRight">
                {/* 제품 특성 표시 */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-red-700/20 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-400" />
                    제품 사양
                  </h3>

                  {/* 모델별 상세 사양 테이블 */}
                  {product.specTable && (
                    <div className="mb-6">
                      <ModelSpecTable specTable={product.specTable} className="bg-gray-900/30" />
                    </div>
                  )}

                  {/* 주요 특성 표시 - 디자인 개선 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center p-3.5 rounded-lg bg-red-900/20 border border-red-900/30 hover:bg-red-900/30 transition-colors">
                      <Award className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">소방산업기술원 인증</span>
                    </div>
                    <div className="flex items-center p-3.5 rounded-lg bg-red-900/20 border border-red-900/30 hover:bg-red-900/30 transition-colors">
                      <Clock className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">신속한 설치 시간</span>
                    </div>
                    <div className="flex items-center p-3.5 rounded-lg bg-red-900/20 border border-red-900/30 hover:bg-red-900/30 transition-colors">
                      <Shield className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">고급 소재 사용</span>
                    </div>
                    <div className="flex items-center p-3.5 rounded-lg bg-red-900/20 border border-red-900/30 hover:bg-red-900/30 transition-colors">
                      <Activity className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">우수한 성능</span>
                    </div>
                  </div>
                </div>

                {/* 문의하기 버튼 */}
                <div className="mt-4">
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

            {/* 제품 비디오 섹션 - 개선된 스타일 */}
            {productVideos.length > 0 && (
              <div className="mt-16 relative bg-gray-800/30 rounded-xl p-6 border border-gray-700/40 animate-fadeIn">
                <ProductVideoSection videos={productVideos} title="제품 작동 영상" />
              </div>
            )}

            {/* 주의사항 섹션 - 개선된 스타일 */}
            {product.cautions && product.cautions.length > 0 && (
              <div className="mt-12 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-amber-500" />
                  주의사항
                </h2>
                <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-6 shadow-lg">
                  <ul className="space-y-4">
                    {product.cautions.map((caution: string, index: number) => (
                      <li key={`caution-${index}`} className="flex items-start group">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0 group-hover:text-amber-400 transition-colors" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">{caution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
