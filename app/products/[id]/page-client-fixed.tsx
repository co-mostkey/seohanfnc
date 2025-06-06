"use client";

import React, { useEffect, useState, useRef } from 'react';
import { initHeroEffect } from './hero-effect';
import Link from 'next/link';
import Image from 'next/image';
import { FeatureCard } from '@/components/products/FeatureCard';
import { SpecTable } from '@/components/products/SpecTable';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { Product } from '@/types/product';
import { ChevronLeft, AlertTriangle, Shield, Clock, FileText, Award, CheckCircle, ChevronRight } from 'lucide-react';
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

// 제품 상세 페이지 클라이언트 컴포넌트 (B타입 수정 버전)
export function ProductDetailClientFixed({ productId }: ProductDetailClientProps) {
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
                setProductVideos(videoFiles);
                setProductImages(imageFiles);

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

    return (
        <ProductDetailFrameLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* 히어로 섹션 */}
                <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>

                    <div className="relative container mx-auto px-4 py-16 lg:py-24">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* B타입에서도 히어로 타이틀이 있는 경우 표시 */}
                            {(productStyle !== 'B' || product.pageHeroTitle) && (
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
                                </>
                            )}

                            <SimpleBreadcrumb
                                items={[
                                    { text: '홈', href: '/' },
                                    { text: '제품', href: '/products' },
                                    { text: categoryName, href: `/products/category/${product.category}` },
                                    { text: getSafeString(product.name), href: '#', active: true }
                                ]}
                                className="justify-center text-blue-200"
                            />
                        </div>
                    </div>
                </section>

                {/* 메인 콘텐츠 */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-7xl mx-auto">

                        {/* B타입 레이아웃 (세로형) */}
                        {productStyle === 'B' && (
                            <div className="space-y-16">

                                {/* 제품 이미지 갤러리 */}
                                {productImages.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">제품 이미지</h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* 메인 이미지 */}
                                            <div className="space-y-4">
                                                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                                    <Image
                                                        src={productImages[selectedImageIndex]?.src || productImages[0]?.src}
                                                        alt={productImages[selectedImageIndex]?.alt || getSafeString(product.name)}
                                                        fill
                                                        className="w-full h-full object-cover"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                    />
                                                </div>

                                                {/* 썸네일 이미지들 */}
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
                                                                <Image
                                                                    src={img.src}
                                                                    alt={img.alt}
                                                                    fill
                                                                    className="w-full h-full object-cover"
                                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 제품 정보 */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                                        {getSafeString(product.name)}
                                                    </h1>
                                                    <p className="text-lg text-gray-600 leading-relaxed">
                                                        {getSafeString(product.description)}
                                                    </p>
                                                </div>

                                                {/* 제품 특징 */}
                                                {product.features && product.features.length > 0 && (
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">주요 특징</h3>
                                                        <div className="space-y-2">
                                                            {product.features.map((feature: any, index: number) => (
                                                                <div key={index} className="flex items-start gap-3">
                                                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-gray-700">{getSafeString(feature)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 승인번호 */}
                                                {product.approvalNumber && (
                                                    <div className="bg-blue-50 p-4 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Award className="w-5 h-5 text-blue-600" />
                                                            <span className="font-semibold text-blue-900">형식승인번호</span>
                                                        </div>
                                                        <p className="text-blue-800 mt-1">{product.approvalNumber}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* 비디오 섹션 */}
                                {productVideos.length > 0 && (
                                    <ProductVideoSection videos={productVideos} />
                                )}

                                {/* 규격별 상세 사양 (B타입 전용) */}
                                {product.detailedSpecTable && product.detailedSpecTable.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">규격별 상세 사양</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-blue-50">
                                                        {product.detailedSpecTable[0]?.map((header: string, index: number) => (
                                                            <th key={index} className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.detailedSpecTable.slice(1).map((row: any, rowIndex: number) => {
                                                        const rowArray = Array.isArray(row) ? row : Object.values(row);
                                                        return (
                                                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                                {rowArray.map((cell: any, cellIndex: number) => (
                                                                    <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-gray-700">
                                                                        {String(cell)}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}

                                {/* 충격흡수 비교 데이터 (B타입 전용) */}
                                {product.impactAbsorptionData && product.impactAbsorptionData.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">충격흡수 비교 데이터</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-green-50">
                                                        {product.impactAbsorptionData[0]?.map((header: string, index: number) => (
                                                            <th key={index} className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.impactAbsorptionData.slice(1).map((row: any, rowIndex: number) => {
                                                        const rowArray = Array.isArray(row) ? row : Object.values(row);
                                                        return (
                                                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                                {rowArray.map((cell: any, cellIndex: number) => (
                                                                    <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-gray-700">
                                                                        {String(cell)}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}

                                {/* 기술 데이터 (B타입 전용) */}
                                {product.technicalData && product.technicalData.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">기술 데이터</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {product.technicalData.map((data: any, index: number) => (
                                                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                                                    <h3 className="font-semibold text-gray-900 mb-2">{data.label}</h3>
                                                    <p className="text-gray-700">{data.value}</p>
                                                    {data.unit && <span className="text-sm text-gray-500 ml-1">{data.unit}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 인증 및 특징 (B타입 전용) */}
                                {product.certificationsAndFeatures && product.certificationsAndFeatures.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">인증 및 특징</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {product.certificationsAndFeatures.map((item: any, index: number) => (
                                                <FeatureCard
                                                    key={index}
                                                    icon={item.icon || Shield}
                                                    title={item.title}
                                                    description={item.description}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 기본 사양표 */}
                                {product.specTable && product.specTable.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">제품 사양</h2>
                                        <SpecTable specifications={product.specifications || {}} />
                                    </section>
                                )}

                                {/* 문서 다운로드 */}
                                {product.documents && product.documents.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">관련 문서</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {product.documents.map((doc: any, index: number) => (
                                                <DownloadCard
                                                    key={index}
                                                    title={doc.title}
                                                    url={doc.url}
                                                    fileSize={doc.size}
                                                    fileType={doc.type}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 관련 제품 */}
                                {relatedProducts.length > 0 && (
                                    <section className="bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">관련 제품</h2>
                                        <RelatedProducts products={relatedProducts} />
                                    </section>
                                )}

                                {/* 모델별 상세 사양 테이블 */}
                                {product.modelSpecs && (
                                    <section className="mb-16 bg-white rounded-2xl shadow-lg p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">모델별 상세 사양</h2>
                                        {Array.isArray(product.modelSpecs) && product.modelSpecs.length > 0 ? (
                                            <ModelSpecTable title="" subtitle="" modelSpecs={product.modelSpecs} />
                                        ) : (
                                            <p className="text-center text-gray-500">모델별 사양 정보가 없습니다.</p>
                                        )}
                                    </section>
                                )}
                            </div>
                        )}

                        {/* A타입 레이아웃 (기존 가로형) */}
                        {productStyle !== 'B' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                                {/* 왼쪽: 제품 이미지 */}
                                <div className="space-y-6">
                                    {productImages.length > 0 && (
                                        <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                                            <Image
                                                src={productImages[selectedImageIndex]?.src || productImages[0]?.src}
                                                alt={productImages[selectedImageIndex]?.alt || getSafeString(product.name)}
                                                fill
                                                className="w-full h-full object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
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
                                                    <Image
                                                        src={img.src}
                                                        alt={img.alt}
                                                        fill
                                                        className="w-full h-full object-cover"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
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