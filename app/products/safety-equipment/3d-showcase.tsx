'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
// 서버 컴포넌트와의 분리를 위해 직접 가져오기 대신 props로 데이터를 전달받도록 수정
// import { findProductsByCategory } from '@/data/products';
// import { sortProductsByCategory } from '@/lib/utils/product-order';
import DynamicModelViewer from '@/components/products/DynamicModelViewer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Product as ImportedProduct } from '@/types/product';

// 제품 타입 정의
interface Feature {
  title: string;
  description?: string;
}

// 3D Showcase에서 필요한 속성만 선택적으로 사용
type SafetyProduct = ImportedProduct & {
  category?: string; // 선택적으로 만들어서 타입 호환성 확보
};

import './safety-equipment-3d.css';

/**
 * 안전장비 카테고리 3D 쇼케이스 페이지
 * 상하 스크롤로 제품 간 이동이 가능한 3D 환경을 제공합니다.
 */
export function SafetyEquipment3DShowcase({ products }: { products: SafetyProduct[] }) {
  // 제품 데이터를 props로 받아오도록 수정
  const safetyProducts = products;
  console.log('표시할 안전장비 제품 개수:', safetyProducts.length);
  console.log('표시할 안전장비 제품 ID 목록:', safetyProducts.map(p => p.id));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 모델 경로 생성 - 강화된 캐시 방지 기능 적용
  const getModelPath = (productId: string) => {
    // 캐시 방지를 위한 현재 시간 기반 난수 생성 (밀리초 단위 포함)
    const now = new Date();
    const random = Math.floor(Math.random() * 1000);
    const cacheKey = `${now.getTime()}_${random}`;

    // 디버깅을 위한 로그 추가
    const modelPath = `/models/products/${productId}/${productId}.glb?v=${cacheKey}`;
    console.log(`[3D-Showcase] 제품 ${productId}의 모델 경로:`, modelPath);
    console.log(`[3D-Showcase] 캐시 방지 키:`, cacheKey);
    return modelPath;
  };

  // 현재 선택된 제품
  const currentProduct = safetyProducts[currentIndex];
  console.log('현재 표시 중인 제품:', currentProduct?.id, currentProduct?.nameKo);

  // 모델 경로 및 현재 로드된 제품 추적 - 디버깅 용도
  useEffect(() => {
    if (currentProduct) {
      console.log('[3D-Showcase] 현재 로드된 제품:', {
        id: currentProduct.id,
        name: currentProduct.nameKo,
        category: currentProduct.category,
        modelPath: getModelPath(currentProduct.id)
      });

      // 실제 파일 경로 검증
      const expectedPath = `/models/products/${currentProduct.id}/${currentProduct.id}.glb`;
      console.log(`[3D-Showcase] 파일 존재 여부 확인 필요:`, expectedPath);
    }
  }, [currentProduct]);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // 기본 스크롤 동작 방지

      if (isScrolling) return; // 이미 스크롤 중이면 무시

      setIsScrolling(true);

      // 아래로 스크롤
      if (e.deltaY > 0) {
        navigateToNext();
      }
      // 위로 스크롤
      else if (e.deltaY < 0) {
        navigateToPrev();
      }

      // 스크롤 디바운싱
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, isScrolling, safetyProducts.length]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown') {
        navigateToNext();
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.key === 'ArrowUp') {
        navigateToPrev();
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, isScrolling, safetyProducts.length]);

  // 다음 제품으로 이동
  const navigateToNext = () => {
    if (currentIndex < safetyProducts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 이전 제품으로 이동
  const navigateToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 제품 정보 표시 토글
  const toggleProductInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-hidden relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    >
      {/* 상단 네비게이션 */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm">
        {/* GlobalNav는 client-layout.tsx에서 전역적으로 추가되므로 중복 사용 제거 */}
      </header>

      {/* 메인 제목 */}
      <div className="absolute top-24 left-0 right-0 text-center z-10">
        <h1 className="text-4xl font-bold text-white">공기안전매트</h1>
        <p className="text-lg text-gray-300 mt-2">혁신적인 안전 솔루션</p>
      </div>

      {/* 3D 공간 */}
      <div className="scene-container w-full h-full">
        {/* 배경 요소 */}
        <div className="parallax-bg"></div>
        <div className="grid-lines"></div>

        {/* 제품 컨테이너 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct?.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {currentProduct && (
              <div className="w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 h-full pt-28 pb-20">
                {/* 3D 모델 영역 - 좌측 */}
                <div className="w-full lg:w-3/5 h-[60vh] lg:h-full relative">
                  <div className="model-viewer-container w-full h-full">
                    <DynamicModelViewer
                      modelPath={getModelPath(currentProduct.id)}
                      productName={currentProduct.nameKo || ""}
                      variant="simple"
                    />
                  </div>
                </div>

                {/* 제품 정보 영역 - 우측 */}
                <div className="w-full lg:w-2/5 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                  >
                    <h2 className="text-3xl font-bold mb-4">{currentProduct.nameKo}</h2>
                    <p className="text-gray-300 mb-6">{currentProduct.descriptionKo}</p>

                    {/* 제품 특징 */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-primary-400">주요 특징</h3>
                      <div className="flex flex-wrap">
                        {currentProduct.features?.map((feature: any, index: number) => (
                          <span key={index} className="feature-badge">
                            {feature.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 자세히 보기 버튼 */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/products/safety-equipment/${currentProduct.id}`}>
                        <Button className="w-full bg-primary-600 hover:bg-primary-700">
                          제품 자세히 보기
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700"
                        onClick={toggleProductInfo}
                      >
                        사양 정보
                      </Button>
                    </div>

                    {/* 제품 사양 (토글) */}
                    <AnimatePresence>
                      {showInfo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-gray-700 overflow-hidden"
                        >
                          <h3 className="text-xl font-semibold mb-3 text-primary-400">제품 사양</h3>
                          <ul className="space-y-2">
                            {Object.entries(currentProduct.specifications || {}).map(([key, value]) => (
                              <li key={key} className="flex">
                                <span className="text-gray-400 w-24 flex-shrink-0">{key}:</span>
                                <span>{String(value)}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 네비게이션 인디케이터 */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col items-center space-y-2">
            {safetyProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsScrolling(true);
                  setTimeout(() => setIsScrolling(false), 1000);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  idx === currentIndex
                    ? "bg-primary-500 scale-125"
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`제품 ${idx + 1} 보기`}
              />
            ))}
          </div>
        </div>

        {/* 스크롤 네비게이션 버튼 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
          <button
            onClick={navigateToPrev}
            disabled={currentIndex === 0}
            className={cn(
              "p-2 rounded-full transition-all mb-2",
              currentIndex === 0
                ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-800/70 text-white hover:bg-primary-600/70"
            )}
            aria-label="이전 제품"
          >
            <ChevronUp size={24} />
          </button>

          <p className="text-white text-sm mb-2">
            {currentIndex + 1} / {safetyProducts.length}
          </p>

          <button
            onClick={navigateToNext}
            disabled={currentIndex === safetyProducts.length - 1}
            className={cn(
              "p-2 rounded-full transition-all",
              currentIndex === safetyProducts.length - 1
                ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-800/70 text-white hover:bg-primary-600/70"
            )}
            aria-label="다음 제품"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
