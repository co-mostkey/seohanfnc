/**
 * [TRISID] B타입 자동 생성 시스템 - 고급 업그레이드 완료!
 * 
 * Cylinder-Type-SafetyAirMat 기준 + A타입 수준 디자인 통합
 * 
 * ✨ 새로운 기능: A타입 수준 네비게이션 + 3D 모델링 + 고급 애니메이션
 * ✨ 유지된 기능: 3D 모델 뷰어, 카드형 레이아웃, 갤러리 시스템
 * 
 * 최종 업그레이드: 2024년 12월
 * 기준 샘플: Cylinder-Type-SafetyAirMat
 * 통합 수준: A타입 디자인 + B타입 3D 모델링
 */

import * as fs from "fs";
import * as path from "path";
import { Product } from "@/types/product";

// B타입 제품을 위한 정적 페이지 생성 함수 (고급 버전)
export async function createStaticBTypeProductPage(product: Product): Promise<void> {
    try {
        const productId = product.id;
        const productDir = path.join(process.cwd(), 'app', 'products', productId);

        // 디렉토리 생성
        if (!fs.existsSync(productDir)) {
            fs.mkdirSync(productDir, { recursive: true });
        }

        // page.tsx 파일 생성 (Cylinder-Type-SafetyAirMat 기반)
        const pageContent = `import { Metadata } from "next";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./client";

export const metadata: Metadata = {
    title: "${product.nameKo || productId} | 서한에프앤씨",
    description: "${product.descriptionKo || `${product.nameKo || productId} 상세페이지입니다.`}",
};

/**
 * ${product.nameKo || productId} 상세 페이지 (B타입 고급 버전)
 * products/${productId}
 */
export default function ${productId.replace(/[^a-zA-Z0-9]/g, '')}Page() {
    const product = getProductById("${productId}");
    
    if (!product) {
        notFound();
    }
    
    return <ProductDetailClient product={product} />;
}`;

        // client.tsx 파일 생성 (A타입 수준 디자인 + 3D 모델링)
        const clientContent = createAdvancedBTypeClientContent(product);

        // 파일 쓰기
        fs.writeFileSync(path.join(productDir, 'page.tsx'), pageContent, { encoding: 'utf8' });
        fs.writeFileSync(path.join(productDir, 'client.tsx'), clientContent, { encoding: 'utf8' });

        console.log(`[TRISID] B타입 제품 ${productId} 고급 정적 페이지 생성 완료 (A타입 수준 디자인 + 3D 모델링)`);

    } catch (error) {
        console.error(`[TRISID] B타입 제품 ${product.id} 페이지 생성 실패:`, error);
        throw error;
    }
}

// B타입 고급 클라이언트 컴포넌트 생성 함수
function createAdvancedBTypeClientContent(product: Product): string {
    return `'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Shield, ListChecks, FileText as FileTextIcon, ImageIcon, Package, ArrowLeft, MessageCircle,
    AlertTriangle, ChevronDown, CheckCircle2, ExternalLink, Download, ChevronRight, Award, Play, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { cn, getImagePath } from '@/lib/utils';
import ProductFeaturesComponent from '@/components/products/b-type/ProductFeatures';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import ProductImageGallery from '@/components/products/b-type/ProductImageGallery';
import { MediaGalleryItem, SpecTableItem } from '@/types/product';
import { ImpactAbsorptionChart } from '@/components/products/ImpactAbsorptionChart';
import dynamic from 'next/dynamic';

const SimpleModelViewer = dynamic(() => import('@/components/products/SimpleModelViewer'), { ssr: false });

type SectionId = 'hero' | 'overview' | 'model3d' | 'technicalSpecifications' | 'documents' | 'gallery';

interface ProductDetailClientProps {
    product: Product;
}

const ProductDetail: React.FC<ProductDetailClientProps> = ({ product }) => {
    const sectionRefs = {
        hero: useRef<HTMLDivElement>(null),
        overview: useRef<HTMLDivElement>(null),
        model3d: useRef<HTMLDivElement>(null),
        technicalSpecifications: useRef<HTMLDivElement>(null),
        documents: useRef<HTMLDivElement>(null),
        gallery: useRef<HTMLDivElement>(null),
    };

    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showNav, setShowNav] = useState(false);

    const currentProductName = product.nameKo || product.name || "B타입 제품";
    const currentDescription = product.descriptionKo || product.description || "B타입 제품 상세 정보입니다.";
    
    // 3D 모델 관련 설정 (B타입 고유 기능)
    const model3dPath = product.model3D?.glbFile || \`/models/products/\${product.id}/\${product.id}.glb\`;
    const visualImage = product.useTransparentBackground ? '' : 
        (product.pageBackgroundImage || \`/images/products/\${product.id}/main/visual.jpg\`);
    const thumbnailImage = product.image || \`/images/products/\${product.id}/thumbnail.jpg\`;

    // 인증 정보
    const certifications = product.certifications || [];
    const certificationSubtitle = certifications.map((c: any) => c.description).join(' / ');
    const currentApprovalNumber = certificationSubtitle || "형식승인번호 : -";

    // 갤러리 데이터 통합
    const allMediaItems: MediaGalleryItem[] = useMemo(() => {
        const galleryData = (product.gallery_images_data || product.gallery || []).map((item: any) => ({
            ...item,
            type: 'image' as const,
            id: item.id || \`img-\${item.src}\`,
            src: typeof item === 'string' ? item : item.src
        })).filter((item: any) => item.src);
        
        const videoData = (product.videos || []).map((item: any, index: number) => ({
            type: 'video' as const,
            id: \`vid-\${index}\`,
            src: typeof item === 'string' ? item : item.src,
            alt: \`제품 동영상 \${index + 1}\`
        }));
        
        return [...galleryData, ...videoData].sort((a, b) => (a.id && b.id) ? a.id.localeCompare(b.id) : 0);
    }, [product.gallery_images_data, product.gallery, product.videos]);

    const imageItems = useMemo(() => allMediaItems.filter(item => item.type === 'image'), [allMediaItems]);
    const videoItems = useMemo(() => allMediaItems.filter(item => item.type === 'video'), [allMediaItems]);

    // 기본 갤러리 이미지 설정
    const galleryImages = useMemo(() => {
        const baseImages = [];
        if (thumbnailImage) {
            baseImages.push(thumbnailImage);
        }
        const additionalImages = imageItems.map(item => item.src).filter(Boolean);
        return [...baseImages, ...additionalImages];
    }, [thumbnailImage, imageItems]);

    const [activeImage, setActiveImage] = useState(
        galleryImages.length > 0 ? galleryImages[0] : (visualImage || '/images/placeholder.jpg')
    );

    // 특징 데이터 처리
    const displayFeaturesToRender = useMemo(() => 
        product.features && product.features.length > 0 ? product.features.map(({ icon, ...rest }) => rest) :
            [
                { title: "고품질 제품", description: "최고급 소재와 기술력으로 제작된 신뢰할 수 있는 제품입니다." },
                { title: "안전 인증", description: "관련 기관의 인증을 받은 안전하고 검증된 제품입니다." },
                { title: "사용 편의성", description: "직관적이고 간편한 사용법으로 누구나 쉽게 사용할 수 있습니다." },
            ],
        [product.features]);

    // 기본 스펙 테이블
    const defaultSpecTable: SpecTableItem[] = [
        { title: "제품명", value: currentProductName },
        { title: "제품 유형", value: "B타입 안전장비" },
        { title: "인증", value: currentApprovalNumber },
    ];

    const currentSpecTable = product.specTable && product.specTable.length > 0 ? product.specTable : defaultSpecTable;

    const currentCautions = product.cautions && product.cautions.length > 0 ? product.cautions : [
        "제품 사용 전 반드시 사용 설명서를 숙지하십시오.",
        "정기적인 점검을 통해 제품의 안전 상태를 확인하십시오.",
        "임의로 제품을 개조하거나 변경하지 마십시오.",
    ];

    // A타입 수준의 스크롤 네비게이션 효과
    useEffect(() => {
        const handleScroll = () => {
            if (isScrolling) return;
            const scrollPosition = window.scrollY + 100;
            if (scrollPosition > window.innerHeight * 0.6) {
                setShowNav(true);
            } else {
                setShowNav(false);
            }
            let currentSectionId: SectionId = 'hero';
            for (const sectionId of Object.keys(sectionRefs) as SectionId[]) {
                const ref = sectionRefs[sectionId];
                if (!ref.current) continue;
                const sectionTop = ref.current.offsetTop - 150;
                const sectionBottom = sectionTop + ref.current.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = sectionId;
                    break;
                }
            }
            if (currentSectionId !== activeSection) {
                setActiveSection(currentSectionId);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolling, activeSection, sectionRefs]);

    const scrollToSection = (sectionId: SectionId) => {
        setIsScrolling(true);
        setActiveSection(sectionId);
        const targetSection = sectionRefs[sectionId]?.current;
        if (!targetSection) {
            setIsScrolling(false);
            return;
        }
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - (sectionId === 'hero' ? 0 : headerOffset);
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        setTimeout(() => setIsScrolling(false), 1000);
    };

    return (
        <div className="relative min-h-screen text-white">
            {/* A타입 수준의 전체화면 배경 */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={getImagePath(visualImage || \`/images/products/\${product.id}/main/visual.jpg\`)}
                    alt={\`\${currentProductName} 비주얼 배경\`}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={85}
                />
                <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/20"></div>
            </div>

            {/* A타입 수준의 상단 네비게이션 */}
            {showNav && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800/30 py-2 px-4 transition-all duration-300 shadow-lg animate-fadeIn">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="text-xs text-gray-300 hover:text-white mr-4" aria-label="뒤로 가기">
                                <ArrowLeft className="mr-1 h-3 w-3" />돌아가기
                            </Button>
                            <h3 className="text-sm font-medium text-white truncate" title={currentProductName}>{currentProductName}</h3>
                        </div>
                        <div className="hidden md:flex items-center space-x-1 text-xs">
                            {Object.keys(sectionRefs).map((id) => (
                                id !== 'hero' && (
                                    <button key={id} onClick={() => scrollToSection(id as SectionId)} className={cn("px-3 py-1.5 rounded-full transition-all flex items-center", activeSection === id ? "bg-gradient-to-r from-red-700 to-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/60")}>
                                        {id === 'overview' ? <><Package className="h-3 w-3 mr-1" />개요</> :
                                            id === 'model3d' ? <><Play className="h-3 w-3 mr-1" />3D 모델</> :
                                                id === 'technicalSpecifications' ? <><ListChecks className="h-3 w-3 mr-1" />기술 사양</> :
                                                    id === 'documents' ? <><FileTextIcon className="h-3 w-3 mr-1" />자료실 및 문의</> :
                                                        <><ImageIcon className="h-3 w-3 mr-1" />제품 갤러리</>}
                                    </button>
                                )
                            ))}
                        </div>
                        <Link
                            href={\`/support/contact?product_name=\${encodeURIComponent(currentProductName)}&product_id=\${encodeURIComponent(product.id)}\`}
                            className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium text-xs transition-all duration-300 shadow-md"
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />문의
                        </Link>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                {/* 히어로 섹션 (A타입 스타일) */}
                <section ref={sectionRefs.hero} id="hero" className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
                    <div className="max-w-7xl w-full mx-auto px-6 md:px-8 lg:px-12 pt-24 flex flex-col items-center justify-center h-full relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                                <span className="block relative">{currentProductName}
                                    <div className="h-1 w-32 mt-2 bg-white/40 rounded-full mx-auto"></div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-white/0 via-white/80 to-white/0 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                </span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-2 leading-relaxed max-w-3xl mx-auto">{currentDescription}</p>
                            <p className="text-sm text-amber-400 font-semibold">{currentApprovalNumber}</p>
                        </div>
                    </div>
                    
                    {/* A타입 스타일 스크롤 안내 */}
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <button type="button" onClick={() => scrollToSection('overview')} className="absolute left-1/2 bottom-36 z-30 -translate-x-1/2 flex flex-col items-center group focus:outline-none" aria-label="개요 섹션으로 스크롤">
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/40 border border-white/20 shadow-lg group-hover:bg-black/60 transition-all animate-bounce-slow">
                            <ChevronDown className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                        </span>
                    </button>
                </section>

                {/* 나머지 섹션들 */}
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-b from-black/20 to-transparent z-10" />
                    
                    {/* 개요 섹션 (Cylinder-Type-SafetyAirMat 스타일) */}
                    <section ref={sectionRefs.overview} id="overview" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>제품 상세 소개</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                                <div className="flex flex-col h-full">
                                    {/* 개선된 대표 이미지 카드 (Cylinder-Type-SafetyAirMat 스타일) */}
                                    <div className="relative bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-xl flex-1">
                                        <div className="relative grid grid-cols-1 gap-6 p-6 lg:p-8">
                                            <div className="w-full h-96 relative overflow-hidden rounded-lg border border-white/10">
                                                <Image
                                                    src={activeImage || '/images/placeholder.jpg'}
                                                    alt={currentProductName}
                                                    fill
                                                    className="object-cover"
                                                    onError={() => setActiveImage(visualImage || '/images/placeholder.jpg')}
                                                    sizes="(max-width: 768px) 90vw, 54vw"
                                                />
                                            </div>
                                            {galleryImages.length > 0 && (
                                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                                    {galleryImages.map((img: string, i: number) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setActiveImage(img)}
                                                            className={cn(
                                                                'flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border-2 transition-all duration-200',
                                                                activeImage === img ? 'border-red-400 scale-105' : 'border-white/20 hover:border-white/40'
                                                            )}
                                                        >
                                                            <Image
                                                                src={img}
                                                                alt={\`썸네일 \${i + 1}\`}
                                                                fill
                                                                className="object-cover"
                                                                sizes="80px"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col h-full">
                                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 lg:p-8 shadow-xl flex-1">
                                        <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}><ListChecks className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-red-400 flex-shrink-0" />주요 특장점</h3>
                                        <div className="flex-1">
                                            {displayFeaturesToRender.length > 0 ? <ProductFeaturesComponent features={displayFeaturesToRender} /> : <p className="text-gray-400">주요 특장점 정보가 준비 중입니다.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 주의사항 */}
                            <div className="mt-16">
                                {currentCautions && currentCautions.length > 0 && (
                                    <div className="bg-black/50 backdrop-blur-md border border-amber-400/30 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-amber-400 font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}><AlertTriangle className="h-6 w-6 lg:h-7 lg:w-7 mr-3 flex-shrink-0" />사용 시 주의사항</h3>
                                        <ul className="space-y-3 text-gray-300">
                                            {currentCautions.map((caution, idx) => (<li key={idx} className="flex items-start text-base lg:text-lg leading-relaxed"><ChevronRight className="h-5 w-5 mt-1 mr-2 text-amber-400 flex-shrink-0" /><span>{caution}</span></li>))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 3D 모델 섹션 (B타입 고유 기능) */}
                    <section ref={sectionRefs.model3d} id="model3d" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>3D 모델 뷰어</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">실시간 3D 모델을 통해 제품을 360도로 자세히 살펴보세요.</p>
                            </div>
                            <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden h-[600px] lg:h-[700px] transform hover:scale-[1.005] transition-transform duration-500">
                                <SimpleModelViewer 
                                    modelPath={model3dPath} 
                                    interactive={true} 
                                    productId={product.id}
                                    customSettings={product.model3D}
                                />
                            </div>
                        </div>
                    </section>

                    {/* 기술 사양 섹션 */}
                    <section ref={sectionRefs.technicalSpecifications} id="technicalSpecifications" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>기술 사양</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">제품의 상세한 기술 사양 정보를 확인하세요.</p>
                            </div>
                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                                <div className="p-6 md:p-8 border-b border-white/10">
                                    <h3 className="text-xl lg:text-2xl font-bold text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}><Package className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-sky-400 flex-shrink-0" />제품 상세 규격</h3>
                                </div>
                                <div className="p-2 md:p-0">
                                    {currentSpecTable && Array.isArray(currentSpecTable) && currentSpecTable.length > 0 ? <ModelSpecTable specTable={currentSpecTable} className="w-full bg-transparent" /> : <div className="p-6 md:p-8 text-center text-gray-400"><p>상세 제품 규격 정보가 준비 중입니다.</p></div>}
                                </div>
                                {/* 충격흡수 데이터가 있는 경우 표시 */}
                                {product.impactAbsorptionData && (
                                    <div className="p-6 md:p-8 border-t border-white/10">
                                        <ImpactAbsorptionChart data={product.impactAbsorptionData} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 자료실 및 문의 섹션 */}
                    <section ref={sectionRefs.documents} id="documents" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-20">
                                <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#1f1f22] to-black backdrop-blur-lg border border-white/15 rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden group transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative z-10">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>{currentProductName} 도입 문의</h2>
                                        <p className="text-gray-300 mb-8 text-base lg:text-lg leading-relaxed lg:leading-loose">제품에 대한 견적, 설치 상담, 또는 기타 궁금한 점이 있으시면 언제든지 문의해 주십시오. <br className="hidden sm:block" />전문 상담원이 신속하게 답변해 드리겠습니다.</p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link
                                                href={\`/support/contact?product_name=\${encodeURIComponent(currentProductName)}&product_id=\${encodeURIComponent(product.id)}\`}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-red-500/50 text-white text-base font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
                                            >
                                                <MessageCircle className="mr-2 h-5 w-5" />온라인 문의하기
                                            </Link>
                                            <Button variant="outline" className="px-6 py-3 border-white/30 text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm rounded-md transition-all duration-300 text-base font-medium transform hover:-translate-y-0.5" onClick={() => window.history.back()}>
                                                <ArrowLeft className="mr-2 h-5 w-5" />모든 제품 보기
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>관련 자료실</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">제품 카탈로그, 인증서 등 관련 문서를 다운로드하여 자세한 정보를 확인하실 수 있습니다.</p>
                            </div>
                            <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                                {product.documents && product.documents.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.documents.map((doc: any, idx: number) => (
                                            <Link
                                                key={doc.id || idx}
                                                href={doc.path || doc.url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center p-4 sm:p-5 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 transform hover:shadow-lg"
                                            >
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-black/60 border border-white/20 flex items-center justify-center mr-4 group-hover:scale-105 group-hover:border-red-400/50 transition-all duration-300 flex-shrink-0">
                                                    <FileTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400/80 group-hover:text-red-400 transition-colors" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white truncate group-hover:text-red-300 transition-colors">{doc.nameKo || doc.name}</h4>
                                                    <p className="text-xs sm:text-sm lg:text-base text-gray-400">{(doc.type || '파일').toUpperCase()} 형식{doc.fileSize && <span className="ml-2 text-gray-500">({doc.fileSize})</span>}</p>
                                                </div>
                                                <div className="ml-3 p-2 rounded-full bg-black/30 group-hover:bg-red-600/30 transition-all duration-300 opacity-80 group-hover:opacity-100">
                                                    <Download className="h-4 w-4 sm:h-5 sm:h-5 text-white/70 group-hover:text-white transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="relative w-20 h-20 mx-auto mb-6">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full animate-pulse"></div>
                                            <FileTextIcon className="h-10 w-10 text-gray-600 absolute inset-0 m-auto opacity-70" />
                                        </div>
                                        <p className="text-gray-400 text-lg lg:text-xl">등록된 문서가 없습니다.</p>
                                        <p className="text-gray-500 text-sm lg:text-base mt-2">필요한 자료는 문의해 주시면 신속히 제공해 드리겠습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 갤러리 섹션 (A타입 수준의 고급 갤러리) */}
                    <section ref={sectionRefs.gallery} id="gallery" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>제품 갤러리</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">제품의 다양한 이미지와 작동 영상을 통해 제품을 자세히 살펴보세요.</p>
                                <div className="flex justify-center mt-8 space-x-4">
                                    <Button variant={activeMediaTab === 'images' ? 'default' : 'outline'} onClick={() => setActiveMediaTab('images')} className={cn("min-w-[140px] rounded-lg transition-all duration-300 py-2.5 px-5 text-base font-medium", activeMediaTab === 'images' ? 'bg-red-600 hover:bg-red-700 border-red-500/50 text-white shadow-xl hover:shadow-red-400/40' : 'border-white/30 text-gray-300 hover:text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-sm')}>
                                        <ImageIcon className="mr-2.5 h-5 w-5" /> 이미지 ({imageItems.length})
                                    </Button>
                                    <Button variant={activeMediaTab === 'videos' ? 'default' : 'outline'} onClick={() => setActiveMediaTab('videos')} className={cn("min-w-[140px] rounded-lg transition-all duration-300 py-2.5 px-5 text-base font-medium", activeMediaTab === 'videos' ? 'bg-red-600 hover:bg-red-700 border-red-500/50 text-white shadow-xl hover:shadow-red-400/40' : 'border-white/30 text-gray-300 hover:text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-sm')}>
                                        <Video className="mr-2.5 h-5 w-5" /> 비디오 ({videoItems.length})
                                    </Button>
                                </div>
                            </div>
                            <div className="relative bg-black/60 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center transform hover:scale-[1.005] transition-transform duration-500">
                                <div className="relative z-10">
                                    {activeMediaTab === 'images' && (imageItems.length > 0 ? <div className="animate-fadeIn"><ProductImageGallery items={imageItems} /></div> : <div className="py-24 text-center animate-fadeIn"><ImageIcon className="w-16 h-16 mx-auto mb-6 text-gray-600 opacity-60" /><p className="text-gray-400 text-xl lg:text-2xl">표시할 이미지가 없습니다.</p><p className="text-gray-500 mt-2 text-sm lg:text-base">제품 이미지가 곧 업데이트될 예정입니다.</p></div>)}
                                    {activeMediaTab === 'videos' && (videoItems.length > 0 ? <div className="animate-fadeIn"><ProductImageGallery items={videoItems} /></div> : <div className="py-24 text-center animate-fadeIn"><Video className="w-16 h-16 mx-auto mb-6 text-gray-600 opacity-60" /><p className="text-gray-400 text-xl lg:text-2xl">표시할 비디오가 없습니다.</p><p className="text-gray-500 mt-2 text-sm lg:text-base">제품 관련 영상이 곧 업데이트될 예정입니다.</p></div>)}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;`;
} 