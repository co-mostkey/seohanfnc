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
import { ChevronLeft, AlertTriangle, Shield, Clock, FileText, Award, CheckCircle, ChevronRight, Zap, BarChart3, TrendingUp, ExternalLink, Download, Package } from 'lucide-react';
import RelatedProducts from '@/components/products/RelatedProducts';
import { Button } from '@/components/ui/button';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { DownloadCard } from '@/components/ui/DownloadCard';
import ProductDetailFrameLayout from '@/components/layouts/ProductDetailFrameLayout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductVideoSection } from '@/components/products/ProductVideoSection';

// 제품 비주얼 이미지 경로 처리 함수
const getProductVisualImage = (productId: string): string => {
    if (productId === 'Cylinder-Type-SafetyAirMat') {
        return `/images/products/${productId}/Cylinder-Type-SafetyAirMat02.jpg`;
    }
    return `/images/products/visuals/${productId.toLowerCase().replace(/-/g, '-')}-visual.jpg`;
};

type ProductDetailClientProps = {
    productId: string;
};

// 제품 상세 페이지 클라이언트 컴포넌트 (B타입 레이아웃)
export function ProductDetailClient({ productId }: ProductDetailClientProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [transformedImages, setTransformedImages] = useState<Array<{ src: string, alt: string, type: 'image' | 'video' }>>([]);
    const [productVideos, setProductVideos] = useState<Array<{ src: string, alt: string, type: 'video' }>>([]);
    const [productImages, setProductImages] = useState<Array<{ src: string, alt: string, type: 'image' }>>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroEffectCleanup = useRef<(() => void) | null>(null);

    // 마우스 효과 초기화
    useEffect(() => {
        const timer = setTimeout(() => {
            if (heroEffectCleanup.current) {
                heroEffectCleanup.current();
            }
            heroEffectCleanup.current = initHeroEffect();
        }, 500);

        return () => {
            clearTimeout(timer);
            if (heroEffectCleanup.current) {
                heroEffectCleanup.current();
            }
        };
    }, [product]);

    // 문자열 값을 안전하게 가져오는 헬퍼 함수
    const getSafeString = (value: any, fallback: string = ''): string => {
        if (!value) return fallback;
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value.ko) return value.ko;
        return String(value) || fallback;
    };

    // 개별 이미지 갤러리를 위한 상태
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // 제품 데이터 로드
    useEffect(() => {
        async function loadProductData() {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    setLoading(false);
                    return;
                }

                const productData = await response.json();
                if (!productData) {
                    setLoading(false);
                    return;
                }

                console.log('[DEBUG] 제품 데이터 로드:', productData);
                console.log('[DEBUG] productStyle:', productData.productStyle);
                console.log('[DEBUG] productId:', productId);

                setProduct(productData);

                // 카테고리명 설정
                const catName = productData.category || '기타';
                setCategoryName(catName);

                // 관련 제품 로드
                if (productData.relatedProducts && productData.relatedProducts.length > 0) {
                    const relatedPromises = productData.relatedProducts.map(async (id: string) => {
                        const relatedResponse = await fetch(`/api/products/${id}`);
                        return relatedResponse.ok ? await relatedResponse.json() : null;
                    });
                    const related = (await Promise.all(relatedPromises)).filter(Boolean) as Product[];
                    setRelatedProducts(related);
                }

                // 미디어 파일 변환
                const mediaFiles = [];

                const isVideoFile = (src: string): boolean => {
                    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
                    return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
                };

                try {
                    if (productData.image) {
                        mediaFiles.push({
                            src: productData.image,
                            alt: getSafeString(productData.name, '제품'),
                            type: isVideoFile(productData.image) ? 'video' as const : 'image' as const
                        });
                    }

                    if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
                        productData.images.forEach((media: any) => {
                            const mediaSrc = typeof media === 'string' ? media : (media?.path || media?.url || '');
                            if (mediaSrc) {
                                mediaFiles.push({
                                    src: mediaSrc,
                                    alt: getSafeString(productData.name, '제품'),
                                    type: isVideoFile(mediaSrc) ? 'video' as const : 'image' as const
                                });
                            }
                        });
                    }
                } catch (error) {
                    console.error('미디어 파일 처리 오류:', error);
                }

                const videoFiles = mediaFiles.filter(media => media.type === 'video');
                const imageFiles = mediaFiles.filter(media => media.type === 'image');

                if (imageFiles.length === 0) {
                    imageFiles.push({
                        src: `/images/products/Cylinder-Type-SafetyAirMat.jpg`,
                        alt: getSafeString(productData.name, '제품'),
                        type: 'image' as const
                    });
                }

                setTransformedImages(mediaFiles);
                setProductVideos(videoFiles.filter((v): v is { src: string; alt: string; type: 'video' } => v.type === 'video'));
                setProductImages(imageFiles.filter((i): i is { src: string; alt: string; type: 'image' } => i.type === 'image'));

            } catch (error) {
                console.error('제품 데이터 로드 오류:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProductData();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">제품 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">제품을 찾을 수 없습니다</h1>
                    <p className="text-gray-600 mb-8">요청하신 제품이 존재하지 않거나 삭제되었습니다.</p>
                    <Link href="/products" className="text-blue-600 hover:text-blue-800 underline">
                        제품 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const productStyle = product.productStyle || 'A';
    console.log('[DEBUG] Final productStyle:', productStyle);
    console.log('[DEBUG] productStyle === "B":', productStyle === 'B');
    console.log('[DEBUG] product.id:', product.id);

    // B타입 제품 확인 - Emergency-Airmat-Professional은 무조건 B타입으로 처리
    const isBTypeProduct = productStyle === 'B' || product.id === 'Emergency-Airmat-Professional' || productId === 'Emergency-Airmat-Professional';
    console.log('[DEBUG] isBTypeProduct:', isBTypeProduct);

    return (
        <ProductDetailFrameLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* 히어로 섹션 */}
                <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>

                    <div className="relative container mx-auto px-4 py-16 lg:py-24">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* B타입에서는 간소화된 히어로만 표시 */}
                            {isBTypeProduct ? (
                                <div className="space-y-6">
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        서한F&C 전문 제품
                                    </h1>
                                    <p className="text-lg text-blue-100 opacity-90">
                                        Professional Safety Equipment Solutions
                                    </p>
                                    <SimpleBreadcrumb
                                        items={[
                                            { text: '홈', href: '/' },
                                            { text: '제품', href: '/products' },
                                            { text: categoryName, href: `/products/category/${product.category}` },
                                            { text: getSafeString(product.name), href: '#' }
                                        ]}
                                        className="justify-center text-blue-200"
                                    />
                                </div>
                            ) : (
                                // A타입의 경우 기존 히어로 유지
                                <>
                                    <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        {product.pageHeroTitle || getSafeString(product.name)}
                                    </h1>

                                    {product.pageHeroSubtitles && product.pageHeroSubtitles.length > 0 && (
                                        <div className="space-y-2 mb-8">
                                            {product.pageHeroSubtitles.map((subtitle: any, index: number) => (
                                                <p
                                                    key={index}
                                                    className="text-lg lg:text-xl opacity-90"
                                                    style={{
                                                        color: subtitle.color || '#d1d5db',
                                                        fontSize: subtitle.size ? `${subtitle.size}px` : '18px'
                                                    }}
                                                >
                                                    {subtitle.text}
                                                </p>
                                            ))}
                                        </div>
                                    )}

                                    <SimpleBreadcrumb
                                        items={[
                                            { text: '홈', href: '/' },
                                            { text: '제품', href: '/products' },
                                            { text: categoryName, href: `/products/category/${product.category}` },
                                            { text: getSafeString(product.name), href: '#' }
                                        ]}
                                        className="justify-center text-blue-200"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* 메인 콘텐츠 */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-7xl mx-auto">

                        {/* B타입 레이아웃 (혁신적인 사이버펑크 디자인) */}
                        {isBTypeProduct && (
                            <div className="relative">
                                {/* 전체 배경 - 다이나믹 그라데이션 */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl"></div>
                                <div className="absolute inset-0 bg-[url('/images/patterns/dot-pattern.png')] opacity-10"></div>

                                {/* 메인 컨테이너 */}
                                <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

                                    {/* 헤더 섹션 - 네온 스타일 */}
                                    <div className="relative p-8 lg:p-12 border-b border-white/10">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20"></div>
                                        <div className="relative text-center">
                                            {/* 네온 제품명 */}
                                            <div className="inline-block mb-6">
                                                <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg leading-tight">
                                                    {getSafeString(product.name)}
                                                </h1>
                                                <div className="w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full mt-2 shadow-lg shadow-blue-500/50"></div>
                                            </div>

                                            {/* 승인번호 - 네온 배지 */}
                                            {product.approvalNumber && (
                                                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full shadow-lg shadow-cyan-500/50 border border-cyan-400/50">
                                                    <Award className="w-6 h-6 drop-shadow-lg" />
                                                    <span className="font-bold text-lg drop-shadow-lg">형식승인: {product.approvalNumber}</span>
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                </div>
                                            )}

                                            {/* 제품 설명 */}
                                            <p className="text-xl text-slate-200 leading-relaxed max-w-4xl mx-auto mt-6 drop-shadow-lg">
                                                {getSafeString(product.description)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 메인 콘텐츠 그리드 */}
                                    <div className="p-8 lg:p-12">

                                        {/* 이미지 및 핵심 데이터 섹션 */}
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">

                                            {/* 3D 이미지 갤러리 */}
                                            <div className="space-y-6">
                                                <div className="relative group">
                                                    {/* 홀로그래픽 효과 */}
                                                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

                                                    <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                                                        {productImages.length > 0 && (
                                                            <ProductDetailImage
                                                                images={[productImages[selectedImageIndex] || productImages[0]]}
                                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                                            />
                                                        )}

                                                        {/* 네온 오버레이 */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                        <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 transition-colors duration-500 rounded-2xl"></div>
                                                    </div>

                                                    {/* 홀로그래픽 썸네일 */}
                                                    {productImages.length > 1 && (
                                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                                            <div className="flex gap-3 bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 border border-cyan-500/30">
                                                                {productImages.map((_, index) => (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => setSelectedImageIndex(index)}
                                                                        className={cn(
                                                                            "w-3 h-3 rounded-full transition-all duration-300",
                                                                            selectedImageIndex === index
                                                                                ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125"
                                                                                : "bg-slate-500 hover:bg-cyan-400/70 hover:shadow-md hover:shadow-cyan-400/30"
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 실시간 데이터 대시보드 */}
                                            <div className="space-y-8">

                                                {/* 핵심 성능 메트릭 */}
                                                {product.technicalData && product.technicalData.length > 0 && (
                                                    <div className="relative">
                                                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-20"></div>
                                                        <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30">
                                                            <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                                                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                                                                실시간 성능 데이터
                                                                <div className="flex-1 h-px bg-gradient-to-r from-emerald-400 to-transparent"></div>
                                                            </h3>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                {product.technicalData.slice(0, 8).map((data: any, index: number) => (
                                                                    <div key={index} className="group relative">
                                                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50 group-hover:border-cyan-500/50 transition-colors duration-300"></div>
                                                                        <div className="relative p-4 text-center">
                                                                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-300 mb-1">
                                                                                {data.value}
                                                                                {data.unit && <span className="text-lg text-cyan-400">{data.unit}</span>}
                                                                            </div>
                                                                            <div className="text-sm text-slate-300 font-medium">{data.key || data.label}</div>

                                                                            {/* 진행바 효과 */}
                                                                            <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                                                <div
                                                                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 delay-300"
                                                                                    style={{ width: `${Math.min(100, parseInt(data.value) || 85)}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 주요 특징 - 홀로그래픽 카드 */}
                                                {product.features && product.features.length > 0 && (
                                                    <div className="relative">
                                                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-20"></div>
                                                        <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
                                                            <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                                                                <Zap className="w-6 h-6 text-purple-400" />
                                                                혁신 기술
                                                                <div className="flex-1 h-px bg-gradient-to-r from-purple-400 to-transparent"></div>
                                                            </h3>

                                                            <div className="space-y-4">
                                                                {product.features.slice(0, 4).map((feature: any, index: number) => (
                                                                    <div key={index} className="group flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-purple-500/50 transition-all duration-300">
                                                                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                                                                            <CheckCircle className="w-5 h-5 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-white mb-1">{getSafeString(feature.title || feature)}</div>
                                                                            {feature.description && (
                                                                                <div className="text-sm text-slate-300 leading-relaxed">{feature.description}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 추가 섹션들 - 충격 흡수 데이터, 상세 사양, 인증, 문서, 관련 제품 등 */}
                                        {/* 여기에 나머지 섹션들을 추가할 수 있습니다 */}

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* A타입 레이아웃 (기존 유지) */}
                        {!isBTypeProduct && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                                {/* 왼쪽: 제품 이미지 */}
                                <div className="space-y-6">
                                    {productImages.length > 0 && (
                                        <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                                            <ProductDetailImage
                                                images={[productImages[selectedImageIndex] || productImages[0]]}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {productImages.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {productImages.map((img, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className={cn(
                                                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                                        selectedImageIndex === index
                                                            ? "border-blue-500 ring-2 ring-blue-200"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    )}
                                                >
                                                    <ProductDetailImage
                                                        images={[img]}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 오른쪽: 제품 정보 */}
                                <div className="space-y-8">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                            {getSafeString(product.name)}
                                        </h1>
                                        <p className="text-xl text-gray-600 leading-relaxed">
                                            {getSafeString(product.description)}
                                        </p>
                                    </div>

                                    {/* 제품 특징 */}
                                    {product.features && product.features.length > 0 && (
                                        <div>
                                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">주요 특징</h3>
                                            <div className="space-y-3">
                                                {product.features.map((feature: any, index: number) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-lg text-gray-700">{getSafeString(feature)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 승인번호 */}
                                    {product.approvalNumber && (
                                        <div className="bg-blue-50 p-6 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Award className="w-6 h-6 text-blue-600" />
                                                <span className="text-lg font-semibold text-blue-900">형식승인번호</span>
                                            </div>
                                            <p className="text-blue-800 mt-2 text-lg">{product.approvalNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProductDetailFrameLayout>
    );
} 