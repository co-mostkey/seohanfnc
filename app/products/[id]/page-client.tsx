"use client";

import React, { useEffect, useState, useRef } from 'react';
import { initHeroEffect } from './hero-effect';
import Link from 'next/link';
import Image from 'next/image';
import { ProductDetailImage } from '@/components/products/ProductDetailImage';
import { FeatureCard } from '@/components/products/FeatureCard';
import { SpecTable } from '@/components/products/SpecTable';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { Product } from '@/types/product';
import { ChevronLeft, AlertTriangle, Shield, Clock, FileText, Award, CheckCircle, ChevronRight } from 'lucide-react';
import RelatedProducts from '@/components/products/RelatedProducts';
import { Button } from '@/components/ui/button';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { DownloadCard } from '@/components/ui/DownloadCard';
// import { findProductById, getCategoryName } from '@/data/products'; // 서버 전용 함수는 API를 통해 접근
import { Badge } from '@/components/ui/badge';
import { cn, getImagePath } from '@/lib/utils';
import { ProductVideoSection } from '@/components/products/ProductVideoSection';

// 제품 비주얼 이미지 경로 처리 함수
const getProductVisualImage = (product: Product): string => {
  // 1. 제품 데이터에 pageBackgroundImage가 있으면 해당 경로 사용
  if (product.pageBackgroundImage && typeof product.pageBackgroundImage === 'string') {
    return product.pageBackgroundImage;
  }

  // 2. 예외 처리: Cylinder-Type-SafetyAirMat 제품에 대한 특별 처리
  if (product.id === 'Cylinder-Type-SafetyAirMat') {
    return `/images/products/${product.id}/Cylinder-Type-SafetyAirMat02.jpg`;
  }

  // 3. 기본 경로
  return `/images/products/visuals/${product.id.toLowerCase().replace(/-/g, '-')}-visual.jpg`;
};

type ProductDetailClientProps = {
  productId: string;
  product: Product;
  initialRelatedProducts: Product[];
  categoryName: string;
  visualExceptions: any;
};

// 제품 상세 페이지 클라이언트 컴포넌트
export function ProductDetailClient({
  productId,
  product,
  initialRelatedProducts,
  categoryName,
  visualExceptions
}: ProductDetailClientProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(initialRelatedProducts);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [transformedImages, setTransformedImages] = useState<Array<{ src: string, alt: string, type: 'image' | 'video' }>>([]);
  const [productVideos, setProductVideos] = useState<Array<{ src: string, alt: string, type: 'video' }>>([]);
  const [productImages, setProductImages] = useState<Array<{ src: string, alt: string, type: 'image' }>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroEffectCleanup = useRef<(() => void) | null>(null);

  // 마우스 효과 초기화
  useEffect(() => {
    // DOM이 완전히 마운트된 후 효과 초기화
    const timer = setTimeout(() => {
      if (heroEffectCleanup.current) {
        // 기존 이펙트 정리
        heroEffectCleanup.current();
      }
      // 새 이펙트 초기화
      heroEffectCleanup.current = initHeroEffect();
    }, 500);

    return () => {
      clearTimeout(timer);
      // 컴포넌트 언마운트 시 이펙트 정리
      if (heroEffectCleanup.current) {
        heroEffectCleanup.current();
      }
    };
  }, [product]); // 제품 데이터가 변경될 때마다 효과 재초기화

  // 문자열 값을 안전하게 가져오는 헬퍼 함수
  const getSafeString = (value: any, fallback: string = ''): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;
    // @ts-ignore - 동적 value 객체에 대한 접근
    if (typeof value === 'object' && value.ko) return value.ko;
    return String(value) || fallback;
  };

  // 제품 데이터 변환 및 미디어 처리
  useEffect(() => {
    // 미디어 파일(이미지와 비디오) 변환
    const mediaFiles = [];

    // 파일 형식 확인 함수
    const isVideoFile = (src: string): boolean => {
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', 'mp4', 'webm', 'ogg', 'mov', 'avi'];
      const lowerSrc = src.toLowerCase();
      const isVideo = videoExtensions.some(ext => lowerSrc.endsWith(ext));
      console.log(`파일 경로: ${src}, 비디오 파일 여부: ${isVideo}`);
      return isVideo;
    };

    try {
      // 기본 미디어가 있으면 추가
      if (product.image) {
        mediaFiles.push({
          src: product.image,
          alt: getSafeString(product.name, '제품'),
          type: isVideoFile(product.image) ? 'video' as const : 'image' as const
        });
      }

      // 추가 미디어 처리
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach((media: any) => {
          const mediaSrc = typeof media === 'string' ? media : (media?.path || media?.url || '');
          if (mediaSrc) {
            mediaFiles.push({
              src: mediaSrc,
              alt: getSafeString(product.name, '제품'),
              type: isVideoFile(mediaSrc) ? 'video' as const : 'image' as const
            });
          }
        });
      }

      // 추가 샘플 미디어 (테스트용)
      if (productId === 'Cylinder-Type-SafetyAirMat') {
        // 비디오 파일을 먼저 추가하여 확실히 목록에 포함되도록 함
        const additionalFiles = [
          // 맨 먼저 비디오 파일 추가
          `/images/products/${productId}/${productId}.mp4`,
          // 그 다음 이미지 파일들 추가
          `/images/products/${productId}/${productId}.jpg`,
          `/images/products/${productId}/${productId}-front.jpg`,
          `/images/products/${productId}/${productId}-perspective.jpg`,
          `/images/products/${productId}/${productId}-test.jpg`,
          `/images/products/${productId}/${productId}02.jpg`
        ];

        // 비디오 파일 경로를 로그로 출력하여 확인
        console.log('비디오 파일 경로:', `/images/products/${productId}/${productId}.mp4`);

        // 중복 미디어 제거 및 유효성 검사
        const existingSrcs = mediaFiles.map(file => file.src);
        additionalFiles.forEach(fileSrc => {
          if (fileSrc && typeof fileSrc === 'string' && !existingSrcs.includes(fileSrc)) {
            mediaFiles.push({
              src: fileSrc,
              alt: getSafeString(product.name, '제품'),
              type: isVideoFile(fileSrc) ? 'video' as const : 'image' as const
            });
            existingSrcs.push(fileSrc);
          }
        });
      }
    } catch (error) {
      console.error('미디어 파일 처리 오류:', error);
    }

    // 미디어 파일을 비디오와 이미지로 분리
    const videoFiles = mediaFiles.filter(media => media.type === 'video');
    const imageFiles = mediaFiles.filter(media => media.type === 'image');

    // 이미지가 없는 경우 기본 이미지 추가
    if (imageFiles.length === 0) {
      imageFiles.push({
        src: `/images/products/Cylinder-Type-SafetyAirMat.jpg`,
        alt: getSafeString(product.name, '제품'),
        type: 'image' as const
      });
    }

    console.log('변환된 이미지 파일:', imageFiles);
    console.log('변환된 비디오 파일:', videoFiles);

    // 상태 업데이트 - 이미지를 화면에 먼저 표시하고 비디오는 따로 저장
    setTransformedImages([...imageFiles, ...videoFiles]);
    setProductImages(imageFiles as any);
    setProductVideos(videoFiles as any);
  }, [product, productId]);

  // 제품명 안전하게 가져오기 (국문 우선)
  const productName = getSafeString(product.nameKo || product.name, '제품명 없음');
  const productDescription = getSafeString(product.descriptionKo || product.description, '');

  // 유효한 미디어 인덱스 계산 (selectedImageIndex가 범위를 벗어나면 0으로 설정)
  const validIndex = productImages.length > selectedImageIndex ? selectedImageIndex : 0;

  // 브레드크럼 네비게이션 설정
  const breadcrumbItems = [
    { text: '홈', href: '/' },
    { text: '제품', href: '/products' },
    { text: categoryName, href: `/products/category/${product.category}` },
    { text: productName, href: `/products/${product.id}`, active: true }
  ];

  // 일반 제품 (A타입) 레이아웃
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mx-auto">
      {/* 브레드크럼 네비게이션 */}
      <div className="mb-8">
        <SimpleBreadcrumb items={breadcrumbItems} />
      </div>
      {/* 일반 제품 히어로 섹션 */}
      <div className="w-full relative mb-16 group hero-section">
        <div className="w-full h-[50vh] lg:h-[60vh] relative overflow-hidden rounded-xl shadow-xl">
          {/* 전체 배경 이미지 */}
          <div className="absolute inset-0 z-0">
            <Image
              src={getProductVisualImage(product)}
              alt={`${productName} 비주얼 이미지`}
              fill
              className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
              priority
              onError={(e) => {
                console.error('비주얼 이미지 로드 오류', productId);
                (e.target as HTMLImageElement).src = getImagePath('/images/products/default-visual.png');
              }}
            />
          </div>

          {/* 일반 제품 오버레이 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-gray-900/80 to-gray-900/40 z-10 
            transition-opacity duration-500 group-hover:opacity-75"></div>

          {/* 마우스 움직임에 반응하는 카드 기반 물결 효과 */}
          <div id="mouseGlow" className="absolute -inset-40 pointer-events-none bg-gradient-to-r from-primary-500/5 to-primary-700/10 opacity-0 
            group-hover:opacity-100 blur-3xl rounded-full transition-opacity duration-700 z-10"
            style={{ transform: 'translate(50%, 50%)' }}></div>

          {/* 추가 심미적인 선 효과 */}
          <div className="absolute inset-0 bg-[url('/images/patterns/dot-pattern.png')] bg-repeat opacity-10 z-10"></div>

          {/* 타이틀 콘텐츠 */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:w-2/3 animate-fadeInUp">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-600/20 backdrop-blur-sm border border-red-500/30 w-fit">
              <p className="text-sm font-medium text-red-200">{categoryName}</p>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight max-w-4xl">
              {productName}
            </h1>
            <div className="max-w-2xl">
              <p className="text-xl text-gray-300/90 leading-relaxed animate-fadeIn delay-200">
                {productDescription || '최고의 품질과 기술력으로 제작된 솔루션'}
              </p>
              {/* 인증 배지 */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-red-900/30 border-red-500/40 text-white px-3 py-1 flex items-center">
                  <Award className="w-4 h-4 mr-1 text-red-400" />
                  <span>한국소방산업기술원 인증</span>
                </Badge>
                <Badge variant="outline" className="bg-amber-900/30 border-amber-500/40 text-white px-3 py-1 flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-amber-400" />
                  <span>안전 제품</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 일반 제품 상세 컨테이너 */}
      <div className="bg-gray-900/70 backdrop-blur-xl border border-red-900/30 rounded-2xl p-8 overflow-hidden shadow-2xl relative mb-16 animate-fadeIn">
        {/* 배경 장식 요소 */}
        <div className="absolute -top-80 -right-80 w-[500px] h-[500px] rounded-full bg-red-500/10 blur-3xl"></div>
        <div className="absolute -bottom-80 -left-80 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl"></div>

        {/* 새로운 레이아웃 - 제품 이미지와 상세 정보 */}
        <div className="mb-16 relative z-10">
          {/* 제품명 및 카테고리 헤더 */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-orange-400 mb-3">
              {productName}
            </h2>
            <div className="flex items-center">
              <div className="h-0.5 w-16 bg-red-600/70 mr-3"></div>
              <span className="text-red-400/90 font-medium">{categoryName}</span>
            </div>

            {/* 승인 배지 */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="default" className="bg-red-600/90 text-white shadow-lg px-3 py-1.5">
                제품 승인 번호: {product.approvalNumber || '19-4-1'}
              </Badge>
            </div>
          </div>

          {/* 제품 상세 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 좌측 - 이미지 갤러리 */}
            <div className="order-1 lg:order-1 animate-fadeInLeft">
              <ProductDetailImage
                images={productImages}
                onSelectImage={setSelectedImageIndex}
              />
            </div>

            {/* 우측 - 제품 사양 테이블 */}
            <div className="order-2 lg:order-2 animate-fadeInRight">
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-red-700/30 rounded-xl p-5 shadow-lg">
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

                {/* 주요 특성 표시 */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center p-3 rounded-lg bg-red-900/20 border border-red-900/30">
                    <Award className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm text-gray-300">소방산업기술원 인증</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-red-900/20 border border-red-900/30">
                    <Clock className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm text-gray-300">신속한 설치 시간</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-red-900/20 border border-red-900/30">
                    <Shield className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm text-gray-300">다양한 층수별 모델</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-red-900/20 border border-red-900/30">
                    <CheckCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm text-gray-300">소방 장비 호환성</span>
                  </div>
                </div>

                {/* 제품 목록으로 돌아가는 버튼 */}
                <div className="mt-8">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-red-600/30 group"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    제품 목록 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 제품 비디오 섹션 - 사양 아래에 추가 */}
        {productVideos.length > 0 && (
          <div className="mt-10 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-red-400" />
              제품 작동 영상
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productVideos.map((video, index) => (
                <div
                  key={`video-${index}`}
                  className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-red-700/30 rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="aspect-video relative">
                    <video
                      src={video.src}
                      controls
                      className="w-full h-full object-cover object-bottom"
                    >
                      <source src={video.src} type="video/mp4" />
                      <p>브라우저가 비디오 태그를 지원하지 않습니다.</p>
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 섹션 */}
        {product.cautions && product.cautions.length > 0 && (
          <div className="mb-12 animate-fadeIn">
            <div className="bg-gradient-to-br from-amber-800/20 to-orange-900/30 border border-amber-600/40 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-amber-400" />
                주의사항 및 안전수칙
              </h3>
              <ul className="space-y-3 text-amber-100/90">
                {product.cautions.map((caution: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm leading-relaxed">{caution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 다운로드 섹션 */}
        {product.documents && product.documents.length > 0 && (
          <div className="mb-12 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-red-700/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-red-400" />
                제품 문서 다운로드
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.documents.map((doc: any, index: number) => (
                  <DownloadCard
                    key={index}
                    title={doc.name || '제품 문서'}
                    url={doc.url}
                    fileType={doc.fileType || 'PDF'}
                    fileSize={doc.fileSize}
                    className="bg-gray-900/50 border-gray-600/30 hover:border-red-500/40"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 관련 제품 섹션 */}
        {relatedProducts.length > 0 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ChevronRight className="w-6 h-6 mr-2 text-red-400" />
              관련 제품
            </h2>
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
