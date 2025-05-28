'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { getProductGalleryImages } from '@/lib/utils/product-images';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  productId: string;
  initialImageCount?: number; // 초기 이미지 개수
  className?: string;
}

/**
 * 제품 갤러리 컴포넌트
 * 새로운 폴더 구조를 활용하여 제품의 서브 이미지를 갤러리 형태로 표시합니다.
 */
export function ProductGallery({ 
  productId, 
  initialImageCount = 5, 
  className 
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 갤러리 이미지 로드
  useEffect(() => {
    const images = getProductGalleryImages(productId, initialImageCount);
    setGalleryImages(images);
    setLoadedImages(new Array(images.length).fill(false));
  }, [productId, initialImageCount]);
  
  // 이미지 로드 상태 업데이트
  const handleImageLoad = (index: number) => {
    const newLoadedImages = [...loadedImages];
    newLoadedImages[index] = true;
    setLoadedImages(newLoadedImages);
  };
  
  // 이미지 로드 오류 처리
  const handleImageError = (index: number) => {
    // 이미지 로드 오류 시 해당 이미지 제거
    const newGalleryImages = galleryImages.filter((_, i) => i !== index);
    const newLoadedImages = loadedImages.filter((_, i) => i !== index);
    
    setGalleryImages(newGalleryImages);
    setLoadedImages(newLoadedImages);
    
    // 선택된 이미지가 제거된 이미지였다면 인덱스 조정
    if (selectedIndex >= newGalleryImages.length) {
      setSelectedIndex(Math.max(0, newGalleryImages.length - 1));
    } else if (selectedIndex === index && newGalleryImages.length > 0) {
      setSelectedIndex(0);
    }
  };
  
  // 다음 이미지로 이동
  const nextImage = () => {
    if (galleryImages.length > 0) {
      setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };
  
  // 이전 이미지로 이동
  const prevImage = () => {
    if (galleryImages.length > 0) {
      setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };
  
  // 전체화면 모드 토글
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // 이미지가 없는 경우
  if (galleryImages.length === 0) {
    return (
      <div className={cn("relative rounded-lg overflow-hidden bg-gray-800/40 flex items-center justify-center", className)}>
        <div className="text-center p-6">
          <p className="text-gray-400">이미지를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* 메인 이미지 영역 */}
      <div className={cn(
        "relative aspect-square overflow-hidden rounded-lg border border-gray-700/30 bg-gray-800/30 backdrop-blur-sm transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-black rounded-none border-0" : ""
      )}>
        {/* 현재 선택된 이미지 */}
        <Image
          src={galleryImages[selectedIndex]}
          alt={`제품 이미지 ${selectedIndex + 1}`}
          fill
          className={cn(
            "object-contain p-2 transition-opacity duration-300",
            loadedImages[selectedIndex] ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
          onLoad={() => handleImageLoad(selectedIndex)}
          onError={() => handleImageError(selectedIndex)}
        />
        
        {/* 로딩 스켈레톤 */}
        {!loadedImages[selectedIndex] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-red-500 animate-spin"></div>
          </div>
        )}
        
        {/* 네비게이션 버튼 */}
        {galleryImages.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* 전체화면 버튼 */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          onClick={toggleFullscreen}
        >
          <Maximize className="w-4 h-4" />
        </button>
        
        {/* 이미지 인덱스 표시 */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white text-xs">
          {selectedIndex + 1} / {galleryImages.length}
        </div>
        
        {/* 전체화면 모드일 때 닫기 버튼 */}
        {isFullscreen && (
          <button 
            className="absolute top-4 right-4 px-3 py-1 rounded-md bg-red-600 text-white text-sm"
            onClick={toggleFullscreen}
          >
            닫기
          </button>
        )}
      </div>
      
      {/* 썸네일 갤러리 */}
      {!isFullscreen && galleryImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={`thumb-${index}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border transition-all duration-200 hover:border-red-500/60",
                selectedIndex === index
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-gray-700/30 opacity-70 hover:opacity-100"
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image}
                alt={`썸네일 ${index + 1}`}
                fill
                className="object-cover p-1"
                sizes="(max-width: 768px) 20vw, 10vw"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
