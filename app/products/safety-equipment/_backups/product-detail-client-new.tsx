'use client';

import React, { useState, useEffect, Suspense } from 'react';
import DynamicModelViewer from '@/components/products/DynamicModelViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info, Download, ExternalLink, Award, Shield, AlertTriangle, Clock, Activity, Film, MessageSquare, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { ProductDetailImage } from '@/components/products/ProductDetailImage';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { cn, getImagePath } from '@/lib/utils';
import { getCategoryName } from '@/data/products';

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
 * 제품 비주얼 이미지 경로 처리 함수
 */
const getProductVisualImage = (productId: string): string => {
  // 새로운 폴더 구조 사용: /images/products/[productId]/main/visual.jpg
  const visualPath = `/images/products/${productId}/main/visual.jpg`;
  return visualPath;
};

/**
 * 문자열 값을 안전하게 가져오는 헬퍼 함수
 */
const getSafeString = (value: any, fallback: string = ''): string => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.ko) return value.ko;
  return String(value) || fallback;
};

/**
 * 안전장비 제품 상세 페이지 클라이언트 컴포넌트
 * 
 * 3D 모델을 메인 비주얼로 사용하며, 로딩 중이거나 모델이 없을 경우 대체 이미지를 표시합니다.
 * 제품 상세 정보, 사양, 특징, 주의사항 등을 탭으로 구분하여 보여줍니다.
 */
export function SafetyEquipmentProductDetail({
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
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [categoryName, setCategoryName] = useState('안전장비');
  const [productImages, setProductImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  // 모델 로딩 완료 시 호출되는 콜백
  const handleModelLoaded = () => {
    setIsModelLoaded(true);
    // 모델 로딩 후 잠시 대기 후 폴백 이미지 숨김 (부드러운 전환을 위해)
    setTimeout(() => {
      setShowFallback(false);
    }, 500);
  };

  // 모델 로딩 오류 시 호출되는 콜백
  const handleModelError = () => {
    setShowFallback(true);
  };

  // 카테고리 이름 가져오기
  useEffect(() => {
    const categoryDisplayName = getCategoryName(category);
    setCategoryName(categoryDisplayName || '안전장비');

    // 제품 이미지 준비
    const imageFiles: any[] = [];
    // 기본 이미지 추가
    imageFiles.push({
      src: fallbackImage,
      alt: productName,
      type: 'image'
    });

    // 추가 이미지 경로 (실제 파일이 있다면 추가)
    const additionalImages = [
      `/images/products/${productId}/${productId}-front.jpg`,
      `/images/products/${productId}/${productId}-side.jpg`,
      `/images/products/${productId}/${productId}-back.jpg`
    ];

    additionalImages.forEach(imgSrc => {
      imageFiles.push({
        src: imgSrc,
        alt: productName,
        type: 'image'
      });
    });

    setProductImages(imageFiles);
  }, [productId, category, fallbackImage, productName]);

  // 브레드크럼 네비게이션 설정
  const breadcrumbItems = [
    { text: '홈', href: '/' },
    { text: '제품', href: '/products' },
    { text: categoryName, href: `/products/category/${category}` },
    { text: productName, href: `/products/b-type/${productId}`, active: true }
  ];

  return (
    <div className="w-full bg-gray-900 text-white min-h-screen">
      {/* 상단 고정 네비게이션 - 스크롤할 때도 보이도록 */}
      <div className="sticky top-0 bg-gray-900/90 backdrop-blur-md z-50 py-2 px-4 sm:px-6 border-b border-red-900/30 mb-6">
        <SimpleBreadcrumb items={breadcrumbItems} className="text-sm" />
      </div>

      {/* 페이지 타이틀 - 풀스크린 히어로 스타일 */}
      <div className="relative group mb-12">
        <div className="w-full h-[40vh] sm:h-[50vh] lg:h-[70vh] relative overflow-hidden rounded-xl shadow-2xl">
          {/* 배경 이미지 */}
          <div className="absolute inset-0 z-0">
            <Image
              src={getProductVisualImage(productId)}
              alt={`${productName} 비주얼 이미지`}
              fill
              className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
              priority
              onError={(e) => {
                console.error('비주얼 이미지 로드 오류', productId);
                (e.target as HTMLImageElement).src = { getImagePath('/images/products/default-visual.jpg') };
              }}
            />
          </div>

          {/* 개선된 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-gray-900/80 to-gray-900/50 z-10"></div>

          {/* 물결 패턴 오버레이 (시각적 깊이 추가) */}
          <div className="absolute inset-0 bg-[url('/images/patterns/dot-pattern.png')] bg-repeat opacity-5 z-10"></div>

          {/* 히어로 콘텐츠 - 중앙 정렬 */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 sm:px-12 lg:px-20 max-w-5xl">
            {/* 카테고리 배지 */}
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-600/20 backdrop-blur-sm border border-red-500/30 w-fit animate-fadeIn">
              <p className="text-sm font-medium text-red-200">{categoryName}</p>
            </div>

            {/* 제품명 - 애니메이션 효과 */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight animate-fadeInUp">
              {productName}
            </h1>

            {/* 제품 설명 */}
            <div className="max-w-2xl animate-fadeIn delay-150">
              <p className="text-base sm:text-xl text-gray-300/90 leading-relaxed">
                {description || '최고의 품질과 기술력으로 제작된 안전 솔루션'}
              </p>

              {/* 인증 배지 */}
              <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn delay-300">
                <Badge variant="outline" className="bg-red-900/30 border-red-500/40 text-white px-3 py-1.5 flex items-center">
                  <Award className="w-4 h-4 mr-1 text-red-400" />
                  <span>한국소방산업기술원 인증</span>
                </Badge>
                <Badge variant="outline" className="bg-red-900/30 border-red-500/40 text-white px-3 py-1.5 flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-amber-400" />
                  <span>안전 제품</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* 스크롤 안내 인디케이터 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/50 text-center mt-2 text-xs">스크롤하여 더 보기</p>
          </div>
        </div>
      </div>

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
      <div className="w-full">
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
                    activeTab === 'specifications'
                      ? "bg-gradient-to-br from-red-900/40 to-red-800/20 text-white font-medium border-red-500/20"
                      : "bg-gray-800/30 text-gray-400 hover:text-white border-gray-700/30"
                  )}
                  onClick={() => setActiveTab('specifications')}
                >
                  <span className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    제품 사양
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
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  {/* 좌측 - 3D 모델/이미지 갤러리 */}
                  <div className="order-1 lg:col-span-3 animate-fadeIn">
                    <div className="backdrop-blur-sm bg-gray-800/20 p-4 rounded-xl border border-gray-700/30 shadow-lg">
                      {/* 3D 모델 뷰어 영역 */}
                      <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-850 rounded-lg overflow-hidden">
                        {/* 3D 모델 뷰어 */}
                        <div className={`absolute inset-0 transition-opacity duration-500 ${isModelLoaded && !showFallback ? 'opacity-100' : 'opacity-0'}`}>
                          <Suspense fallback={<div className="w-full h-full bg-gray-900 flex items-center justify-center">모델 로드 중...</div>}>
                            <DynamicModelViewer
                              modelPath={`/models/products/${productId}/${productId}.glb`}
                              productName={productName}
                              variant="simple"
                            />
                          </Suspense>
                        </div>

                        {/* 폴백 이미지 (모델 로딩 중 또는 오류 시 표시) */}
                        <div className={`absolute inset-0 transition-opacity duration-500 ${showFallback ? 'opacity-100' : 'opacity-0'}`}>
                          <ProductDetailImage
                            images={productImages}
                            onSelectImage={setSelectedImageIndex}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 제품 설명 섹션 */}
                    <div className="mt-8 bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                      <h3 className="text-xl font-bold text-white mb-4">제품 개요</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-line">{description}</p>
                      </div>

                      {/* 제품 특징 표시 */}
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">주요 특징</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-800/60 border border-gray-700/40 rounded-lg p-4 hover:border-red-500/30 hover:bg-gray-800/80 transition-colors"
                            >
                              <h4 className="text-lg font-medium text-red-400 mb-2">{feature.title}</h4>
                              <p className="text-gray-300 text-sm">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 주의사항 섹션 */}
                      {cautions && cautions.length > 0 && (
                        <div className="mt-8 bg-amber-950/30 border border-amber-500/20 rounded-lg p-5">
                          <h3 className="flex items-center text-lg font-medium text-amber-400 mb-3">
                            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                            주의사항
                          </h3>
                          <ul className="list-disc space-y-2 pl-5 text-amber-200/80">
                            {cautions.map((caution, idx) => (
                              <li key={idx}>{caution}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 우측 - 제품 정보 및 특성 */}
                  <div className="order-2 lg:col-span-2 flex flex-col space-y-6 animate-fadeInRight">
                    {/* 제품 사양 요약 */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-red-700/20 rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-red-400" />
                        주요 사양
                      </h3>

                      {/* 사양 목록 */}
                      <div className="space-y-3">
                        {Object.entries(specifications).map(([key, value], idx) => (
                          <div
                            key={idx}
                            className="flex justify-between border-b border-gray-700/30 pb-2 last:border-0"
                          >
                            <span className="text-gray-400 text-sm">{key}</span>
                            <span className="text-white font-medium text-sm">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* 사양 더 보기 버튼 */}
                      <button
                        className="w-full mt-4 py-2 px-3 bg-red-900/20 rounded-lg border border-red-700/30 text-red-400 text-sm font-medium hover:bg-red-900/30 transition-colors flex items-center justify-center"
                        onClick={() => setActiveTab('specifications')}
                      >
                        <span>상세 사양 보기</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    {/* 인증 섹션 */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-red-700/20 rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-white mb-5 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-amber-400" />
                        인증 및 특징
                      </h3>

                      {/* 인증 배지 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              )}

              {/* 제품 사양 탭 */}
              {activeTab === 'specifications' && (
                <div className="space-y-8">
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-xl font-bold text-white mb-5">상세 사양</h3>

                    {/* 기본 사양 정보 */}
                    <div className="overflow-hidden rounded-lg border border-gray-700/40 mb-8">
                      <table className="min-w-full divide-y divide-gray-700/40">
                        <tbody className="divide-y divide-gray-700/40">
                          {Object.entries(specifications).map(([key, value], idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 bg-gray-800/60 text-sm font-medium text-gray-300 w-1/3">{key}</td>
                              <td className="px-4 py-3 text-sm text-gray-200 bg-gray-800/30">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 상세 규격 테이블 (있는 경우) */}
                    {specTable && specTable.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4 text-red-400">규격별 상세 사양</h3>
                        <ModelSpecTable specTable={specTable} className="bg-gray-800/30" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 문서 및 자료 탭 */}
              {activeTab === 'documents' && documents && (
                <div className="space-y-8">
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                    <h3 className="text-xl font-bold text-white mb-5">제품 자료</h3>

                    {documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((doc) => (
                          <Link
                            href={doc.path}
                            key={doc.id}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 border border-gray-700/40 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 hover:border-blue-500/30 transition-colors"
                          >
                            <div className="p-2 rounded-full bg-blue-900/30 mr-3">
                              <Download className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-white">{doc.nameKo}</h3>
                              <p className="text-xs text-gray-400">
                                {doc.type.toUpperCase()} 파일
                              </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-gray-400" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">등록된 제품 자료가 없습니다.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
