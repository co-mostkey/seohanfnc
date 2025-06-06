// 연관 파일:
// - client.tsx (ProductModelViewer 사용처)
// - SimpleModelViewer.tsx (실제 3D 렌더링 담당)

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import DynamicModelViewer from '@/components/products/DynamicModelViewer';

interface ProductModelViewerProps {
  productId: string;
  productName?: string;
  fallbackImage: string;
  modelPath?: string;
}

// 3D 모델을 사용하지 않는 제품 ID 목록
const NO_3D_MODEL_PRODUCTS = [
  'Descending-Life-Line',  // 완강기
  'Handy-Descending-Life-Line',  // 간이완강기
  'Air-Slide',  // 에어슬라이드
];

/**
 * 제품 3D 모델 또는 이미지를 표시하는 컴포넌트
 * 3D 모델 로딩 실패 시 대체 이미지를 표시합니다.
 */
const ProductModelViewer = ({ productId, productName = '제품', fallbackImage, modelPath }: ProductModelViewerProps) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // 특정 제품은 3D 모델을 건너뛰고 바로 이미지 표시
  useEffect(() => {
    if (NO_3D_MODEL_PRODUCTS.includes(productId)) {
      setShowFallback(true);
    }
  }, [productId]);

  // 3D 모델 로드 성공 시 호출
  const handleModelLoaded = () => {
    console.log(`[ProductModelViewer] ${productId} 3D 모델 로딩 성공!`);
    setIsModelLoaded(true);
  };

  // 3D 모델 로드 실패 시 호출
  const handleModelError = () => {
    console.log(`[ProductModelViewer] ${productId} 3D 모델 로딩 실패, 대체 이미지로 전환`);
    setShowFallback(true);
  };

  // 기본 이미지 URL 생성
  const getProductVisualImage = (id: string): string => {
    return `/images/products/${id}/${id}-main.jpg`;
  };

  console.log(`[ProductModelViewer] ${productId} 렌더링 상태:`, {
    isModelLoaded,
    showFallback,
    modelPath,
    isNoModelProduct: NO_3D_MODEL_PRODUCTS.includes(productId)
  });

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-xl aspect-[4/3]">
      {/* 제품 이미지/모델 표시 영역 */}
      <div className="w-full h-full">
        {/* 3D 모델 뷰어 - 특정 제품은 표시하지 않음 */}
        {!NO_3D_MODEL_PRODUCTS.includes(productId) && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${isModelLoaded && !showFallback ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={<div className="w-full h-full bg-gray-900 flex items-center justify-center">모델 로드 중...</div>}>
              <DynamicModelViewer
                modelPath={modelPath || `/models/products/${productId}/${productId}.glb`}
                productName={productName}
                variant="simple"
                onLoad={handleModelLoaded}
                onError={handleModelError}
                productId={productId}
              />
            </Suspense>
          </div>
        )}

        {/* 대체 이미지: 3D 모델 로딩에 실패했거나 로딩 중일 때 표시 */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${!isModelLoaded || showFallback || NO_3D_MODEL_PRODUCTS.includes(productId) ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-full h-full">
            <Image
              src={fallbackImage || getProductVisualImage(productId)}
              alt={productName || `제품 ${productId} 이미지`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 bg-gray-900/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModelViewer;
