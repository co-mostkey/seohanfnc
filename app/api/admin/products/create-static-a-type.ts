/**
 * [TRISID] A타입 자동 생성 시스템 - 절대 수정 금지!
 * 
 * 완성된 Sloping-Rescue-Chute 기반 고급 템플릿
 * 
 * ⚠️  중요: 이 파일은 완전히 최적화된 상태입니다.
 * ⚠️  절대로 수정하지 마십시오!
 * ⚠️  수정 시 모든 A타입 제품 페이지가 손상될 수 있습니다.
 * 
 * 최종 완성: 2024년 12월
 * 기준 샘플: Sloping-Rescue-Chute
 * 적용 기능: 전체화면 배경, 스크롤 네비게이션, 섹션 애니메이션
 */

import * as fs from 'fs';
import * as path from 'path';
import { Product } from '@/types/product';

export async function createStaticATypeProductPage(product: Product): Promise<void> {
    const productId = product.id;
    const productDir = path.join(process.cwd(), 'app', 'products', productId);

    // 디렉토리 생성
    if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
    }

    // page.tsx 파일 내용 (Sloping-Rescue-Chute 기반)
    const pageContent = `import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "${product.nameKo || productId} | 서한에프앤씨",
    description: "${product.descriptionKo || '제품 상세페이지입니다.'}",
};

/**
 * ${product.nameKo || productId} 상세 페이지
 * products/${productId}
 */
export default function ${productId.replace(/[^a-zA-Z0-9]/g, '')}Page() {
    // 제품 데이터 가져오기
    const product = getProductById("${productId}");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="${productId}"
            initialProductName={String(product.nameKo || product.name || "${product.nameKo || productId}")}
            initialDescription={String(product.descriptionKo || product.description || "제품 상세 정보입니다.")}
            mainImage={product.image || "/images/products/${productId}/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber={product.approvalNumber ? \`형식승인번호 : \${product.approvalNumber}\` : "형식승인번호 : -"}
            cautions={product.cautions || []}
        />
    );
}`;

    // client.tsx 파일 내용 (고급 버전 - Sloping-Rescue-Chute 기반)
    const clientContent = `'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Shield, ListChecks, FileText as FileTextIcon, ImageIcon, Package, ArrowLeft, MessageCircle,
    AlertTriangle, ChevronDown, CheckCircle2, ExternalLink, Download, ChevronRight, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDetailClientProps } from '@/types/component-props';
import { cn, getImagePath } from '@/lib/utils';
import ProductFeaturesComponent from '@/components/products/b-type/ProductFeatures';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import ProductImageGallery from '@/components/products/b-type/ProductImageGallery';
import { MediaGalleryItem, SpecTableItem } from '@/types/product';

type SectionId = 'hero' | 'overview' | 'technicalSpecifications' | 'caseStudies' | 'documents' | 'gallery';

const ProductDetail: React.FC<ProductDetailClientProps> = ({
    productId,
    initialProductName,
    galleryImagesData = [],
    videoGalleryData = [],
    mainImage,
    initialDescription,
    features = [],
    documents = [],
    specTable,
    approvalNumber,
    cautions = [],
}) => {
    const sectionRefs = {
        hero: useRef<HTMLDivElement>(null),
        overview: useRef<HTMLDivElement>(null),
        technicalSpecifications: useRef<HTMLDivElement>(null),
        caseStudies: useRef<HTMLDivElement>(null),
        documents: useRef<HTMLDivElement>(null),
        gallery: useRef<HTMLDivElement>(null),
    };

    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showNav, setShowNav] = useState(false);

    const currentProductName = initialProductName || "${product.nameKo || productId}";
    const currentDescription = initialDescription || "제품 상세 정보입니다.";
    const currentApprovalNumber = approvalNumber || "형식승인번호 : -";

    const allMediaItems: MediaGalleryItem[] = useMemo(() => {
        const imagesWithType = galleryImagesData.map(item => ({ ...item, type: 'image' as const, id: item.id || \`img-\${item.src}\` }));
        const videosWithType = videoGalleryData.map(item => ({ ...item, type: 'video' as const, id: item.id || \`vid-\${item.src}\` }));
        return [...imagesWithType, ...videosWithType].sort((a, b) => (a.id && b.id) ? a.id.localeCompare(b.id) : 0);
    }, [galleryImagesData, videoGalleryData]);

    const imageItems = useMemo(() => allMediaItems.filter(item => item.type === 'image'), [allMediaItems]);
    const videoItems = useMemo(() => allMediaItems.filter(item => item.type === 'video'), [allMediaItems]);

    const displayFeaturesToRender = useMemo(() => features && features.length > 0 ? features.map(({ icon, ...rest }) => rest) : [], [features]);

    const currentSpecTable = specTable && specTable.length > 0 ? specTable : [];
    const currentCautions = cautions && cautions.length > 0 ? cautions : [];

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
            <div className="fixed inset-0 z-0">
                <Image
                    src={getImagePath(mainImage || \`/images/products/\${productId}/main/visual.jpg\`)}
                    alt={\`\${currentProductName} 비주얼 배경\`}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={85}
                />
                <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/20"></div>
            </div>

            {/* 상단 네비게이션 */}
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
                                            id === 'technicalSpecifications' ? <><ListChecks className="h-3 w-3 mr-1" />기술 사양</> :
                                                id === 'caseStudies' ? <><Shield className="h-3 w-3 mr-1" />적용 사례</> :
                                                    id === 'documents' ? <><FileTextIcon className="h-3 w-3 mr-1" />자료실 및 문의</> :
                                                        <><ImageIcon className="h-3 w-3 mr-1" />제품 갤러리</>}
                                    </button>
                                )
                            ))}
                        </div>
                        <Link
                            href={\`/support/contact?product_name=\${encodeURIComponent(currentProductName)}&product_id=\${encodeURIComponent(productId)}\`}
                            className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium text-xs transition-all duration-300 shadow-md"
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />문의
                        </Link>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                {/* 히어로 섹션 */}
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
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <button type="button" onClick={() => scrollToSection('overview')} className="absolute left-1/2 bottom-36 z-30 -translate-x-1/2 flex flex-col items-center group focus:outline-none" aria-label="개요 섹션으로 스크롤">
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/40 border border-white/20 shadow-lg group-hover:bg-black/60 transition-all animate-bounce-slow">
                            <ChevronDown className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                        </span>
                    </button>
                </section>

                {/* 나머지 섹션들 (개요, 기술 사양, 적용 사례, 자료실, 갤러리) */}
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-b from-black/20 to-transparent z-10" />
                    
                    {/* 개요 섹션 */}
                    <section ref={sectionRefs.overview} id="overview" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>제품 상세 소개</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                                <div className="flex flex-col h-full">
                                    <div className="relative aspect-[4/3] w-full max-w-xl mx-auto flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40" style={{ minWidth: '220px', minHeight: '180px' }}>
                                        <Image src={mainImage || \`/images/products/\${productId}/thumbnail.jpg\`} alt={\`\${currentProductName} 제품 이미지\`} fill className="object-cover rounded-2xl" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 512px" quality={80} />
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 lg:p-8 shadow-lg mt-6 flex-1 flex items-center">
                                        <div>
                                            <h4 className="text-xl lg:text-2xl font-semibold text-white mb-5 font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}><FileTextIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-sky-400 flex-shrink-0" />제품 설명</h4>
                                            <p className="text-gray-300 text-base md:text-lg leading-relaxed lg:leading-loose tracking-wide whitespace-pre-line">{currentDescription}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col h-full">
                                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 lg:p-8 shadow-xl flex-1 flex flex-col justify-between">
                                        <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}><ListChecks className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-red-400 flex-shrink-0" />주요 특장점</h3>
                                        <div className="flex-1">
                                            {displayFeaturesToRender.length > 0 ? <ProductFeaturesComponent features={displayFeaturesToRender} /> : <p className="text-gray-400">주요 특장점 정보가 준비 중입니다.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 인증 및 주의사항 */}
                            <div className="mt-16 space-y-12">
                                {currentApprovalNumber && currentApprovalNumber !== "형식승인번호 : -" && (
                                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}><Award className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-amber-400 flex-shrink-0" />공식 인증</h3>
                                        <div className="flex items-center p-4 bg-black/30 rounded-lg border border-white/10">
                                            <Award className="h-8 w-8 lg:h-10 lg:w-10 text-amber-300 mr-4 flex-shrink-0" />
                                            <div>
                                                <p className="text-lg lg:text-xl font-semibold text-white">{currentApprovalNumber.includes(":") ? currentApprovalNumber.split(":")[1]?.trim() : currentApprovalNumber}</p>
                                                <p className="text-sm text-gray-400">공식 인증 제품</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
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

                    {/* 나머지 섹션들은 간단하게 처리 */}
                    <section ref={sectionRefs.technicalSpecifications} id="technicalSpecifications" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif">기술 사양</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6"></div>
                            </div>
                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-6 md:p-8">
                                    {currentSpecTable && Array.isArray(currentSpecTable) && currentSpecTable.length > 0 ? 
                                        <ModelSpecTable data={currentSpecTable} title="제품 사양" firstColumnTitle="항목" /> : 
                                        <div className="text-center py-16 text-gray-400"><p>제품 사양 정보가 준비 중입니다.</p></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </section>

                    <section ref={sectionRefs.caseStudies} id="caseStudies" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif">현장 적용 사례</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6"></div>
                            </div>
                            <div className="text-center py-24 text-gray-400">
                                <p className="text-xl">적용 사례 이미지가 준비 중입니다.</p>
                            </div>
                        </div>
                    </section>

                    <section ref={sectionRefs.documents} id="documents" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-20">
                                <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#1f1f22] to-black backdrop-blur-lg border border-white/15 rounded-2xl p-8 md:p-10 shadow-xl">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-white font-serif">{currentProductName} 도입 문의</h2>
                                    <p className="text-gray-300 mb-8 text-base lg:text-lg">제품에 대한 견적, 설치 상담, 또는 기타 궁금한 점이 있으시면 언제든지 문의해 주십시오.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href={\`/support/contact?product_name=\${encodeURIComponent(currentProductName)}&product_id=\${encodeURIComponent(productId)}\`}
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-md transition-all duration-300"
                                        >
                                            <MessageCircle className="mr-2 h-5 w-5" />온라인 문의하기
                                        </Link>
                                        <Button variant="outline" className="px-6 py-3 border-white/30 text-gray-200 hover:text-white hover:bg-white/10" onClick={() => window.history.back()}>
                                            <ArrowLeft className="mr-2 h-5 w-5" />모든 제품 보기
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section ref={sectionRefs.gallery} id="gallery" className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20">
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif">제품 갤러리</h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6"></div>
                                <div className="flex justify-center mt-8 space-x-4">
                                    <Button 
                                        variant={activeMediaTab === 'images' ? 'default' : 'outline'} 
                                        onClick={() => setActiveMediaTab('images')}
                                        className="min-w-[140px] rounded-lg"
                                    >
                                        <ImageIcon className="mr-2.5 h-5 w-5" /> 이미지 ({imageItems.length})
                                    </Button>
                                    <Button 
                                        variant={activeMediaTab === 'videos' ? 'default' : 'outline'} 
                                        onClick={() => setActiveMediaTab('videos')}
                                        className="min-w-[140px] rounded-lg"
                                    >
                                        <ImageIcon className="mr-2.5 h-5 w-5" /> 비디오 ({videoItems.length})
                                    </Button>
                                </div>
                            </div>
                            <div className="relative bg-black/60 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl min-h-[500px] flex flex-col justify-center">
                                {activeMediaTab === 'images' && (
                                    imageItems.length > 0 ? 
                                        <ProductImageGallery items={imageItems} /> : 
                                        <div className="py-24 text-center">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-6 text-gray-600" />
                                            <p className="text-gray-400 text-xl">표시할 이미지가 없습니다.</p>
                                        </div>
                                )}
                                {activeMediaTab === 'videos' && (
                                    videoItems.length > 0 ? 
                                        <ProductImageGallery items={videoItems} /> : 
                                        <div className="py-24 text-center">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-6 text-gray-600" />
                                            <p className="text-gray-400 text-xl">표시할 비디오가 없습니다.</p>
                                        </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;`;

    // UTF-8로 파일 저장
    fs.writeFileSync(path.join(productDir, 'page.tsx'), pageContent, { encoding: 'utf8' });
    fs.writeFileSync(path.join(productDir, 'client.tsx'), clientContent, { encoding: 'utf8' });

    console.log(`[TRISID] A타입 제품 ${productId} 고급 정적 페이지 생성 완료 (Sloping-Rescue-Chute 기반)`);
} 