'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Shield, ListChecks, FileText as FileTextIcon, ImageIcon, Package, ArrowLeft, MessageCircle,
    AlertTriangle, ChevronDown, CheckCircle2, ExternalLink, Download, ChevronRight, Award, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDetailClientProps } from '@/types/component-props';
import { cn } from '@/lib/utils';
import ProductFeaturesComponent from '@/components/products/safety-equipment/ProductFeatures';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import ProductImageGallery from '@/components/products/safety-equipment/ProductImageGallery';
import { MediaGalleryItem } from '@/types/product';

// 섹션 ID 정의
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
    const [sideNavOffset, setSideNavOffset] = useState(0); // 사용되지 않지만, 에어슬라이드와 동일하게 유지
    const [windowHeight, setWindowHeight] = useState(0); // 사용되지 않지만, 에어슬라이드와 동일하게 유지

    const currentProductName = initialProductName;
    const currentDescription = initialDescription || '간편한 1회용 완강기로 긴급 상황 시 빠르게 탈출하기 위한 직관적인 사용법과 컴팩트한 디자인의 피난 기구입니다.'; // 기본 설명

    const allMediaItems: MediaGalleryItem[] = useMemo(() => {
        const imagesWithType = galleryImagesData.map(item => ({ ...item, type: 'image' as const, id: item.id || `img-${item.src}` }));
        const videosWithType = videoGalleryData.map(item => ({ ...item, type: 'video' as const, id: item.id || `vid-${item.src}` }));
        return [...imagesWithType, ...videosWithType].sort((a, b) => (a.id && b.id) ? a.id.localeCompare(b.id) : 0);
    }, [galleryImagesData, videoGalleryData]);

    const imageItems = useMemo(() => allMediaItems.filter(item => item.type === 'image'), [allMediaItems]);
    const videoItems = useMemo(() => allMediaItems.filter(item => item.type === 'video'), [allMediaItems]);

    const displayFeaturesToRender = useMemo(() =>
        features && features.length > 0 ? features.map(({ icon, ...rest }) => rest) : [],
        [features]);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isScrolling) return;
            const scrollPosition = window.scrollY + 100;
            if (scrollPosition > window.innerHeight * 0.6) {
                setShowNav(true);
            } else {
                setShowNav(false);
            }
            let currentActiveSection: SectionId = 'hero';
            Object.entries(sectionRefs).forEach(([id, ref]) => {
                if (ref.current) {
                    const sectionTop = ref.current.offsetTop - 150;
                    const sectionHeight = ref.current.offsetHeight;
                    const sectionBottom = sectionTop + sectionHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentActiveSection = id as SectionId;
                    }
                }
            });
            if (currentActiveSection !== activeSection) {
                setActiveSection(currentActiveSection);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolling, activeSection]);

    const scrollToSection = (sectionId: SectionId) => {
        setIsScrolling(true);
        setActiveSection(sectionId);
        const targetSection = sectionRefs[sectionId]?.current;
        if (!targetSection) {
            setIsScrolling(false);
            return;
        }
        const targetPosition = targetSection.offsetTop;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime: number | null = null;
        function animation(currentTime: number) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - (startTime as number);
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            window.scrollTo(0, startPosition + distance * ease);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                setIsScrolling(false);
            }
        }
        requestAnimationFrame(animation);
    };

    return (
        <div className="relative min-h-screen text-white">
            {/* 페이지 전체 배경 */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={"/images/products/Handy-Descending-Life-Line/main/visual.jpg"} // 간이완강기 메인 비주얼 경로 (실제 경로로 수정 필요)
                    alt={`${currentProductName} 비주얼`}
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/20"></div>
            </div>
            {/* 스크롤 시 나타나는 부동 내비게이션 */}
            {showNav && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800/30 py-2 px-4 transition-all duration-300 shadow-lg animate-fadeIn">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="text-xs text-gray-300 hover:text-white mr-4">
                                <ArrowLeft className="mr-1 h-3 w-3" />돌아가기
                            </Button>
                            <h3 className="text-sm font-medium text-white">{currentProductName}</h3>
                        </div>
                        <div className="hidden md:flex items-center space-x-1 text-xs">
                            {Object.entries(sectionRefs).map(([id, _]) => (
                                id !== 'hero' && (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id as SectionId)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full transition-all flex items-center",
                                            activeSection === id ? "bg-gradient-to-r from-red-700 to-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                                        )}
                                    >
                                        {id === 'overview' && <><Package className="h-3 w-3 mr-1" />개요</>}
                                        {id === 'technicalSpecifications' && <><ListChecks className="h-3 w-3 mr-1" />기술 사양</>}
                                        {id === 'caseStudies' && <><Users className="h-3 w-3 mr-1" />설치 및 사용법</>}
                                        {id === 'documents' && <><FileTextIcon className="h-3 w-3 mr-1" />자료실 및 문의</>}
                                        {id === 'gallery' && <><ImageIcon className="h-3 w-3 mr-1" />제품 갤러리</>}
                                    </button>
                                )
                            ))}
                        </div>
                        <Link
                            href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
                            className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium text-xs transition-all duration-300 shadow-md"
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />문의
                        </Link>
                    </div>
                </div>
            )}
            {/* 메인 컨텐츠 컨테이너 */}
            <div className="relative z-10">
                {/* 히어로 섹션 */}
                <section
                    ref={sectionRefs.hero}
                    className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden"
                >
                    <div className="max-w-7xl w-full mx-auto px-6 md:px-8 lg:px-12 pt-24 flex flex-col items-center justify-center h-full relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif tracking-tight text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                                <span className="block relative">
                                    {currentProductName}
                                    <div className="h-1 w-32 mt-2 bg-white/40 rounded-full mx-auto"></div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-white/0 via-white/80 to-white/0 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                </span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-2 leading-relaxed">
                                {currentDescription.split(' ').slice(0, 10).join(' ') + '...'}
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <button
                        type="button"
                        onClick={() => { setTimeout(() => scrollToSection('overview'), 10); }}
                        className="absolute left-1/2 bottom-36 z-30 -translate-x-1/2 flex flex-col items-center group focus:outline-none"
                        aria-label="아래로 스크롤"
                    >
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/40 border border-white/20 shadow-lg group-hover:bg-black/60 transition-all animate-bounce-slow">
                            <ChevronDown className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                        </span>
                    </button>
                </section>

                {/* 히어로 이후 모든 콘텐츠 섹션을 감싸는 단일 배경 컨테이너 */}
                <div className="relative bg-gradient-to-b from-black/[.70] via-black/50 to-transparent">
                    {/* 제품 개요 섹션 */}
                    <section
                        ref={sectionRefs.overview}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    {currentProductName} 상세 소개
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                                <div className="flex flex-col h-full">
                                    <div className="relative aspect-[4/3] w-full max-w-xl mx-auto flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40" style={{ minWidth: '220px', minHeight: '180px' }}>
                                        <Image
                                            src={mainImage || "/images/products/Handy-Descending-Life-Line/thumbnail.jpg"}
                                            alt={`${currentProductName} 제품 이미지`}
                                            fill
                                            className="object-cover rounded-2xl"
                                            priority
                                        />
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 lg:p-8 shadow-lg mt-6 flex-1 flex items-center">
                                        <div>
                                            <h4 className="text-xl lg:text-2xl font-semibold text-white mb-5 font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                <FileTextIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-sky-400 flex-shrink-0" />
                                                제품 설명
                                            </h4>
                                            <p className="text-gray-300 text-base md:text-lg leading-relaxed lg:leading-loose tracking-wide">
                                                {currentDescription}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col h-full">
                                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 lg:p-8 shadow-xl flex-1 flex flex-col justify-between">
                                        <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <ListChecks className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-red-400 flex-shrink-0" />
                                            주요 특장점
                                        </h3>
                                        <div className="flex-1">
                                            {displayFeaturesToRender.length > 0 ? (
                                                <ProductFeaturesComponent features={displayFeaturesToRender} />
                                            ) : (
                                                <p className="text-gray-400">주요 특장점 정보가 준비 중입니다.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 space-y-12">
                                {approvalNumber && (
                                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <Award className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-amber-400 flex-shrink-0" />
                                            공식 인증
                                        </h3>
                                        <div className="flex items-center p-4 bg-black/30 rounded-lg border border-white/10">
                                            <Award className="h-8 w-8 lg:h-10 lg:w-10 text-amber-300 mr-4 flex-shrink-0" />
                                            <div>
                                                <p className="text-lg lg:text-xl font-semibold text-white">{approvalNumber}</p>
                                                <p className="text-sm text-gray-400">한국소방산업기술원 형식승인품</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {cautions && cautions.length > 0 && (
                                    <div className="bg-black/50 backdrop-blur-md border border-amber-400/30 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-amber-400 font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <AlertTriangle className="h-6 w-6 lg:h-7 lg:w-7 mr-3 flex-shrink-0" />
                                            사용 시 주의사항
                                        </h3>
                                        <ul className="space-y-3 text-gray-300">
                                            {cautions.map((caution, idx) => (
                                                <li key={idx} className="flex items-start text-base lg:text-lg leading-relaxed">
                                                    <ChevronRight className="h-5 w-5 mt-1 mr-2 text-amber-400 flex-shrink-0" />
                                                    <span>{caution}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 기술 사양 섹션 */}
                    <section
                        ref={sectionRefs.technicalSpecifications}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    기술 사양
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    {currentProductName}의 상세한 기술 사양 및 재질 정보를 확인하세요.
                                </p>
                            </div>
                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                                <div className="p-6 md:p-8 border-b border-white/10">
                                    <h3 className="text-xl lg:text-2xl font-bold text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        <Package className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-sky-400 flex-shrink-0" />
                                        제품 상세 규격
                                    </h3>
                                </div>
                                <div className="p-2 md:p-0">
                                    {specTable && Array.isArray(specTable) && specTable.length > 0 ? (
                                        <ModelSpecTable specTable={specTable} className="w-full bg-transparent" />
                                    ) : (
                                        <div className="p-6 md:p-8 text-center text-gray-400">
                                            <p>상세 제품 규격 정보가 준비 중입니다.</p>
                                            <div className="mt-6 max-w-md mx-auto text-left">
                                                <table className="w-full text-sm">
                                                    <tbody className="divide-y divide-white/10">
                                                        {[
                                                            { label: "사용 구분", value: "1회용 (재사용 불가)" },
                                                            { label: "로프 길이", value: "설치 높이에 따라 선택 (예: 15m, 20m, 25m 등)" },
                                                            { label: "최대 사용 하중", value: "150kg" },
                                                            { label: "보관 방법", value: "전용 보관함 또는 벽면 거치" },
                                                        ].map(item => (
                                                            <tr key={item.label} className="hover:bg-white/5">
                                                                <td className="py-3 px-4 font-medium text-white/90">{item.label}</td>
                                                                <td className="py-3 px-4 text-gray-300">{item.value}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {approvalNumber && (
                                    <div className="p-4 md:p-6 bg-black/40 border-t border-white/10 flex items-center justify-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full">
                                            <Award className="h-4 w-4 text-amber-400" />
                                            <p className="text-sm text-gray-300">{approvalNumber}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 설치 및 사용법 섹션 (CaseStudies 대체) */}
                    <section
                        ref={sectionRefs.caseStudies}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    설치 및 사용법
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    {currentProductName}의 간편한 설치 방법과 비상 시 사용 절차를 확인하세요.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {[
                                    { imgSrc: "/images/products/Handy-Descending-Life-Line/usage/step1.jpg", title: "1. 보관함 개방 및 확인", description: "비상시 보관함을 열고 완강기 상태를 확인합니다." },
                                    { imgSrc: "/images/products/Handy-Descending-Life-Line/usage/step2.jpg", title: "2. 지지대에 고정", description: "창틀 또는 지정된 지지대에 완강기를 단단히 고정합니다." },
                                    { imgSrc: "/images/products/Handy-Descending-Life-Line/usage/step3.jpg", title: "3. 로프 투하 및 벨트 착용", description: "로프를 창밖으로 투하하고 안전벨트를 착용합니다." },
                                    { imgSrc: "/images/products/Handy-Descending-Life-Line/usage/step4.jpg", title: "4. 창밖으로 안전하게 하강", description: "창틀을 넘어 천천히 안전하게 하강합니다." },
                                ].map((item, index) => (
                                    <div key={index} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/15 bg-black/50 backdrop-blur-md shadow-xl transform hover:scale-105 transition-transform duration-300">
                                        <Image src={item.imgSrc} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                        <div className="absolute bottom-0 left-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 w-full">
                                            <h3 className="text-white font-semibold text-lg lg:text-xl mb-1">{item.title}</h3>
                                            <p className="text-gray-300 text-sm lg:text-base leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-red-600/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm z-20 shadow-md">단계 {index + 1}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center mt-10 text-gray-500 text-sm">* 위 이미지는 이해를 돕기 위한 예시이며, 실제 제품 및 설치 환경에 따라 사용법이 다를 수 있습니다. (실제 간이완강기 이미지 및 사용법으로 교체 필요)</p>
                        </div>
                    </section>

                    {/* CTA 섹션과 문서 섹션 통합 */}
                    <section
                        className="min-h-screen flex flex-col justify-center relative py-20"
                        ref={sectionRefs.documents}
                    >
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-20">
                                <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#1f1f22] to-black backdrop-blur-lg border border-white/15 rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden group transform hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none opacity-70"></div>
                                    <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tl from-white/10 via-white/5 to-transparent rounded-full pointer-events-none transform transition-transform duration-700 group-hover:scale-125 opacity-50"></div>
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                                    <div className="relative z-10">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            {currentProductName} 도입 문의
                                        </h2>
                                        <p className="text-gray-300 mb-8 text-base lg:text-lg leading-relaxed lg:leading-loose">
                                            제품에 대한 견적, 설치 상담, 또는 기타 궁금한 점이 있으시면 언제든지 문의해 주십시오. <br className="hidden sm:block" />전문 상담원이 신속하게 답변해 드리겠습니다.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link
                                                href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
                                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-red-500/50 text-white text-base font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
                                            >
                                                <MessageCircle className="mr-2 h-5 w-5" />
                                                온라인 문의하기
                                            </Link>
                                            <Button
                                                variant="outline"
                                                className="px-6 py-3 border-white/30 text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm rounded-md transition-all duration-300 text-base font-medium transform hover:-translate-y-0.5"
                                                onClick={() => window.history.back()}
                                            >
                                                <ArrowLeft className="mr-2 h-5 w-5" />
                                                모든 제품 보기
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    관련 자료실
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    제품 카탈로그, 인증서 등 관련 문서를 다운로드하여 자세한 정보를 확인하실 수 있습니다.
                                </p>
                            </div>
                            <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                                {documents && documents.length > 0 ? (
                                    <div className="space-y-4">
                                        {documents.map((doc, idx) => (
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
                                                    <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white truncate group-hover:text-red-300 transition-colors">
                                                        {doc.nameKo || doc.name}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm lg:text-base text-gray-400">
                                                        {(doc.type || '파일').toUpperCase()} 형식
                                                        {doc.fileSize && <span className="ml-2 text-gray-500">({doc.fileSize})</span>}
                                                    </p>
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
                                            <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                            <FileTextIcon className="h-10 w-10 text-gray-600 absolute inset-0 m-auto opacity-70" />
                                        </div>
                                        <p className="text-gray-400 text-lg lg:text-xl">등록된 문서가 없습니다.</p>
                                        <p className="text-gray-500 text-sm lg:text-base mt-2">필요한 자료는 문의해 주시면 신속히 제공해 드리겠습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 갤러리 섹션 */}
                    <section
                        ref={sectionRefs.gallery}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    제품 갤러리
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    {currentProductName}의 다양한 이미지와 작동 영상을 통해 제품을 자세히 살펴보세요.
                                </p>
                                <div className="flex justify-center mt-8 space-x-4">
                                    <Button
                                        variant={activeMediaTab === 'images' ? 'default' : 'outline'}
                                        onClick={() => setActiveMediaTab('images')}
                                        className={cn(
                                            "min-w-[140px] rounded-lg transition-all duration-300 py-2.5 px-5 text-base font-medium",
                                            activeMediaTab === 'images'
                                                ? 'bg-red-600 hover:bg-red-700 border-red-500/50 text-white shadow-xl hover:shadow-red-400/40'
                                                : 'border-white/30 text-gray-300 hover:text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-sm'
                                        )}
                                    >
                                        <ImageIcon className="mr-2.5 h-5 w-5" />
                                        이미지 ({imageItems.length})
                                    </Button>
                                    <Button
                                        variant={activeMediaTab === 'videos' ? 'default' : 'outline'}
                                        onClick={() => setActiveMediaTab('videos')}
                                        className={cn(
                                            "min-w-[140px] rounded-lg transition-all duration-300 py-2.5 px-5 text-base font-medium",
                                            activeMediaTab === 'videos'
                                                ? 'bg-red-600 hover:bg-red-700 border-red-500/50 text-white shadow-xl hover:shadow-red-400/40'
                                                : 'border-white/30 text-gray-300 hover:text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-sm'
                                        )}
                                    >
                                        <ImageIcon className="mr-2.5 h-5 w-5" />
                                        비디오 ({videoItems.length})
                                    </Button>
                                </div>
                            </div>
                            <div className="relative bg-black/60 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center transform hover:scale-[1.005] transition-transform duration-500">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
                                <div className="relative z-10">
                                    {activeMediaTab === 'images' && (
                                        imageItems.length > 0 ? (
                                            <div className="animate-fadeIn"><ProductImageGallery items={imageItems} /></div>
                                        ) : (
                                            <div className="py-24 text-center animate-fadeIn">
                                                <ImageIcon className="w-16 h-16 mx-auto mb-6 text-gray-600 opacity-60" />
                                                <p className="text-gray-400 text-xl lg:text-2xl">표시할 이미지가 없습니다.</p>
                                                <p className="text-gray-500 mt-2 text-sm lg:text-base">제품 이미지가 곧 업데이트될 예정입니다.</p>
                                            </div>
                                        )
                                    )}
                                    {activeMediaTab === 'videos' && (
                                        videoItems.length > 0 ? (
                                            <div className="animate-fadeIn"><ProductImageGallery items={videoItems} /></div>
                                        ) : (
                                            <div className="py-24 text-center animate-fadeIn">
                                                <ImageIcon className="w-16 h-16 mx-auto mb-6 text-gray-600 opacity-60" />
                                                <p className="text-gray-400 text-xl lg:text-2xl">표시할 비디오가 없습니다.</p>
                                                <p className="text-gray-500 mt-2 text-sm lg:text-base">제품 관련 영상이 곧 업데이트될 예정입니다.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* AI 검색 최적화용 JSON-LD 데이터 섹션 */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": initialProductName,
                            "image": mainImage ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${mainImage}` : undefined,
                            "description": initialDescription,
                            "sku": productId,
                            "brand": {
                                "@type": "Brand",
                                "name": "서한에프앤씨"
                            },
                            ...(features && features.length > 0 && {
                                "additionalProperty": features.map(feature => ({
                                    "@type": "PropertyValue",
                                    "name": feature.title,
                                    "value": feature.description
                                }))
                            }),
                        })
                    }}
                />
            </div>
        </div>
    );
};

export default ProductDetail;