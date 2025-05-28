'use client';

import React, { useState } from 'react';
import { SafetyEquipment } from '@/types/safety-equipment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, FileText, Download, Shield, Award, Clock, LucideProps } from 'lucide-react';
import DynamicModelViewer from '@/components/products/DynamicModelViewer';
import dynamic from 'next/dynamic';
import { getRelatedProducts } from '@/lib/safety-equipment';
import SafetyEquipmentRelatedProducts from '@/components/products/SafetyEquipmentRelatedProducts';

// 동적으로 아이콘 가져오기
const DynamicIcon = dynamic(
  () => import('lucide-react').then((mod) => {
    // 동적 임포트를 통해 lucide-react의 모든 아이콘에 접근
    return ({ name, ...props }: { name: string } & Omit<LucideProps, 'ref'>) => {
      // Lucide 아이콘 가져오기
      const LucideIcon = mod[name as keyof typeof mod] as React.ComponentType<LucideProps> | undefined;
      return LucideIcon ? <LucideIcon {...props} /> : <Shield {...props} />;
    };
  }),
  { ssr: false }
);

interface SafetyEquipmentDetailClientProps {
  product: SafetyEquipment;
}

/**
 * 안전장비 상세 정보 클라이언트 컴포넌트
 * 
 * 안전장비 제품의 상세 정보를 표시하는 클라이언트 컴포넌트입니다.
 * 3D 모델 뷰어, 제품 사양, 특징, 관련 문서 등을 탭 형식으로 제공합니다.
 */
export default function SafetyEquipmentDetailClient({ product }: SafetyEquipmentDetailClientProps) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 관련 제품 가져오기
  const relatedProducts = getRelatedProducts(product.id, 3);

  // 3D 모델 로딩 핸들러
  const handleModelLoad = () => {
    setModelLoaded(true);
  };

  // 3D 모델 오류 핸들러
  const handleModelError = () => {
    setModelError(true);
  };

  // 탭 변경 시 호출되는 함수
  const handleTabChange = (value: string) => {
    // 현재 스크롤 위치 저장
    const scrollPosition = window.scrollY;

    // 애니메이션 프레임이 적용된 후 스크롤 복원
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 50);
  };

  // 불필요한 외부 래핑 레이어를 제거하고 바로 Fragment를 사용합니다
  return (
    <>
      {/* 브레드크럼 네비게이션 */}
      <div className="flex items-center text-sm mb-6 text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">
          홈
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products" className="hover:text-white transition-colors">
          제품
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products/safety-equipment" className="hover:text-white transition-colors">
          안전장비
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-white">{product.nameKo}</span>
      </div>

      {/* 제품 헤더 섹션 */}
      <div className="mb-10 border-b border-gray-800/50 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {product.nameKo}
        </h1>
        <p className="text-xl text-gray-400 mb-1">{product.nameEn}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 - 2열 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* 좌측 열 - 3D 모델 및 이미지 */}
        <div className="space-y-6">
          {/* 3D 모델 / 이미지 표시 영역 - 성능 최적화 */}
          <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-gray-800/50 overflow-hidden h-[400px]">
            {!modelError ? (
              <>
                {/* 3D 모델 뷰어 - 로딩된 경우에만 표시하여 메모리 최적화 */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${modelLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <DynamicModelViewer
                    modelPath={product.modelPath}
                    productName={product.nameEn}
                    variant="simple"
                  />
                </div>

                {/* 로딩 중 또는 오류 시 대체 이미지 - 불필요한 리렌더링 방지 */}
                {!modelLoaded && (
                  <div className="absolute inset-0 transition-opacity duration-500">
                    <Image
                      src={product.thumbnail}
                      alt={product.nameKo}
                      fill
                      className="object-contain p-6"
                      priority
                      onError={() => setModelError(true)}
                    />
                    {!modelError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6 rounded-lg backdrop-blur-sm bg-black/30">
                          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-gray-300">3D 모델 로딩 중...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* 3D 모델 로드 실패 시 대체 이미지 - 메모이제이션 효과 */
              <div className="absolute inset-0">
                <Image
                  src={product.images[activeImageIndex]}
                  alt={`${product.nameKo} - 이미지 ${activeImageIndex + 1}`}
                  fill
                  className="object-contain p-6"
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            )}
          </div>

          {/* 썸네일 이미지 갤러리 */}
          {modelError && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-md border-2 transition-all ${activeImageIndex === index
                    ? 'border-red-500 opacity-100 scale-105'
                    : 'border-gray-700 opacity-60 hover:opacity-100'
                    }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${product.nameKo} 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 제품 설명 */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">제품 설명</h3>
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* 우측 열 - 제품 정보 탭 */}
        <div>
          <Tabs
            defaultValue="specifications"
            className="w-full"
            onValueChange={(value) => {
              // 현재 스크롤 위치 저장
              const scrollPosition = window.scrollY;

              // 탭 변경 후 스크롤 위치 복원
              setTimeout(() => {
                window.scrollTo(0, scrollPosition);
              }, 50);
            }}
          >
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-900/50 border border-gray-800/50">
              <TabsTrigger value="specifications" className="data-[state=active]:bg-gray-800">
                제품 사양
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-gray-800">
                주요 특징
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-gray-800">
                관련 자료
              </TabsTrigger>
            </TabsList>

            {/* 제품 사양 탭 */}
            <TabsContent value="specifications">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">기술 사양</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={index} className="flex border-b border-gray-800/30 pb-3 last:border-0">
                      <div className="w-1/3 font-medium text-gray-400">{key}</div>
                      <div className="w-2/3 text-white">{value}</div>
                    </div>
                  ))}
                </div>

                {/* 추가 정보 */}
                <h3 className="text-xl font-bold text-white mt-8 mb-4">추가 정보</h3>
                <div className="space-y-3">
                  {Object.entries(product.additionalInfo).map(([key, value], index) => (
                    <div key={index} className="flex border-b border-gray-800/30 pb-3 last:border-0">
                      <div className="w-1/3 font-medium text-gray-400">
                        {key === 'manufacturer' ? '제조사' :
                          key === 'warranty' ? '보증' :
                            key === 'installation' ? '설치' :
                              key === 'maintenanceCycle' ? '유지보수 주기' :
                                key === 'storageRequirement' ? '보관 조건' :
                                  key === 'certification' ? '인증' :
                                    key === 'accessories' ? '포함 액세서리' :
                                      key === 'powerRequirement' ? '전원 요구사항' : key}
                      </div>
                      <div className="w-2/3 text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 주요 특징 탭 */}
            <TabsContent value="features">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">주요 특징</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <Card key={index} className="bg-gray-800/30 border-gray-700/30">
                      <CardContent className="p-4 flex items-start space-x-4">
                        <div className="p-2 bg-gradient-to-br from-red-900/30 to-gray-800 rounded-lg">
                          <DynamicIcon
                            name={feature.icon || 'Shield'}
                            className="h-6 w-6 text-red-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-medium">{feature.title}</h4>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 관련 자료 탭 */}
            <TabsContent value="documents">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">관련 자료</h3>
                <div className="grid grid-cols-1 gap-4">
                  {product.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center p-3 border border-gray-800/30 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                      <div className="p-2 bg-gradient-to-br from-red-900/30 to-gray-800 rounded-lg mr-4">
                        {doc.type === 'manual' ? <FileText className="h-5 w-5 text-red-400" /> :
                          doc.type === 'certification' ? <Award className="h-5 w-5 text-red-400" /> :
                            doc.type === 'guide' ? <Clock className="h-5 w-5 text-red-400" /> :
                              <FileText className="h-5 w-5 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{doc.nameKo}</h4>
                        <p className="text-gray-400 text-xs">{doc.nameEn}</p>
                      </div>
                      <Link href={doc.filePath} target="_blank">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Download className="h-4 w-4 mr-1" />
                          다운로드
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>

                {product.documents.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>관련 자료가 없습니다.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* 문의하기 버튼 */}
          <div className="mt-6">
            <Link href="/contact">
              <Button className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 border-0">
                제품 문의하기
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 관련 제품 섹션 - 푸터 극과 갭 제거를 위해 마진 조정 */}
      {relatedProducts.length > 0 && (
        <div className="mt-10 mb-0 pb-0">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800/30 rounded-xl p-6 mb-0">
            <SafetyEquipmentRelatedProducts products={relatedProducts} />
          </div>
        </div>
      )}
    </>
  );
}
