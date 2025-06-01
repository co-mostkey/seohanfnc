'use client';

import React, { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Product } from '@/types/product';
import { findProductById, getCategoryName, getRelatedProducts } from '@/data/products';
import Image from 'next/image';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { ProductDetailView } from './ProductDetailView';
import RelatedProducts from '@/components/products/RelatedProducts';

/**
 * 제품 비주얼 이미지 경로 처리 함수
 * @param productId 제품 ID
 * @returns 이미지 경로
 */
function getProductVisualImage(productId: string): string {
  // 제품 비주얼 이미지 경로 (없는 경우 기본 이미지 사용)
  return `/images/products/${productId}/${productId}-visual.jpg`;
}

interface ProductDetailClientProps {
  productId: string;
}

/**
 * 제품 상세 페이지 클라이언트 컴포넌트
 * 제품 데이터 로딩 및 상태 관리를 담당합니다.
 */
export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  // 상태 관리
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [productImages, setProductImages] = useState<any[]>([]);
  const [productVideos, setProductVideos] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // 제품 데이터 로딩
  useEffect(() => {
    async function loadProductData() {
      try {
        // 제품 데이터 가져오기
        const productData = findProductById(productId);

        if (!productData) {
          setError('제품을 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        // 제품 데이터 설정
        setProduct(productData);
        setProductName(typeof productData.name === 'string' ? productData.name : productData.name?.ko || '');
        setProductDescription(typeof productData.description === 'string' ? productData.description : productData.description?.ko || '');

        // 카테고리 이름 가져오기
        const category = productData.categoryId ? getCategoryName(productData.categoryId) : '';
        setCategoryName(category || '');

        // 관련 제품 가져오기
        const related = getRelatedProducts(productId, 4);
        setRelatedProducts(related);

        // 미디어 파일 분리 (이미지와 비디오)
        const images: any[] = [];
        const videos: any[] = [];

        // 제품 미디어 처리
        if (productData.media && productData.media.length > 0) {
          productData.media.forEach((item: { type: string; src: string; alt?: string }) => {
            if (item.type === 'image') {
              images.push({
                src: item.src,
                alt: item.alt || `${productData.name} 이미지`,
                type: 'image'
              });
            } else if (item.type === 'video') {
              videos.push({
                src: item.src,
                alt: item.alt || `${productData.name} 영상`,
                type: 'video'
              });
            }
          });
        }

        // 이미지가 없는 경우 기본 이미지 추가
        if (images.length === 0) {
          images.push({
            src: `/images/products/${productId}/${productId}.jpg`,
            alt: productData.name,
            type: 'image'
          });
        }

        // 상태 업데이트
        setProductImages(images);
        setProductVideos(videos);
        setLoading(false);
      } catch (error) {
        console.error('제품 데이터 로드 오류:', error);
        setError('제품 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    }

    loadProductData();
  }, [productId]);

  // 브레드크럼 아이템 설정
  const breadcrumbItems = [
    { href: '/', label: '홈', text: '홈' },
    { href: '/products', label: '제품', text: '제품' },
    { href: `/products/${productId}`, label: productName, text: productName, active: true }
  ];

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-40 bg-gray-700/50 rounded-md mb-8"></div>
          <div className="h-64 w-full max-w-2xl bg-gray-800/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error || !product) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">오류 발생</h2>
          <p className="text-gray-400">{error || '제품을 찾을 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
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
                (e.target as HTMLImageElement).src={getImagePath('/images/products/default-visual.jpg')};
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
                {productDescription || '최고의 품질과 기술력으로 제작된 안전 솔루션'}
              </p>
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

      {/* 제품 상세 컴포넌트 */}
      <ProductDetailView
        product={product}
        productName={productName}
        categoryName={categoryName}
        productDescription={productDescription}
        productImages={productImages}
        productVideos={productVideos}
        onSelectImage={setSelectedImageIndex}
      />

      {/* 관련 제품 */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
