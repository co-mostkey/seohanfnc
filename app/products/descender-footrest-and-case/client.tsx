'use client';

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
    pageBackgroundImage,
}) => {
    // 섹션 레퍼런스 및 활성 섹션 추적
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
    const [sideNavOffset, setSideNavOffset] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const currentProductName = initialProductName;
    const currentDescription = initialDescription || '';

    // 미디어 아이템 처리
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

    // 윈도우 높이 설정
    useEffect(() => {
        // 초기 윈도우 높이 설정 (vh 단위 계산용)
        setWindowHeight(window.innerHeight);

        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 스크롤 감지 및 활성 섹션 업데이트
    useEffect(() => {
        const handleScroll = () => {
            if (isScrolling) return;

            const scrollPosition = window.scrollY + 100; // 여백 추가
            const maxScroll = window.document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollPosition / maxScroll) * 100;

            // 스크롤에 따라 사이드바 위치 조정 (10% ~ 40% 범위에서 움직임)
            const sidebarOffset = Math.min(Math.max(scrollPercent - 10, 0), 30);
            setSideNavOffset(sidebarOffset);

            // 히어로 섹션을 지나면 내비게이션 표시
            if (scrollPosition > window.innerHeight * 0.6) {
                setShowNav(true);
            } else {
                setShowNav(false);
            }

            // 각 섹션의 위치를 확인하고 활성 섹션 설정
            let currentSection: SectionId = 'hero';

            Object.entries(sectionRefs).forEach(([id, ref]) => {
                if (!ref.current) return;

                const sectionTop = ref.current.offsetTop - 150; // 여유 공간 추가
                const sectionHeight = ref.current.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = id as SectionId;
                }
            });

            if (currentSection !== activeSection) {
                setActiveSection(currentSection);
            }
        };

        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);

        // 초기 로드 시 섹션 확인
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolling, activeSection]);

    // 특정 섹션으로 스크롤
    const scrollToSection = (sectionId: SectionId) => {
        setIsScrolling(true);
        setActiveSection(sectionId);

        // 섹션의 위치 계산 (헤더 높이 등을 고려)
        const targetSection = sectionRefs[sectionId]?.current;
        if (!targetSection) {
            setIsScrolling(false);
            return;
        }

        // 오프셋 계산 (헤더 높이 고려)
        let offset = 0;
        if (sectionId !== 'hero') {
            offset = 0; // 필요한 경우 오프셋 조정
        }

        const targetPosition = targetSection.offsetTop - offset;

        // 스크롤 이전 상태 저장
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;

        // 애니메이션 시간 설정 (더 빠른 스크롤을 위해 조정)
        const duration = 800; // 밀리초
        let startTime: number;

        // 부드러운 스크롤 애니메이션 실행
        function animation(currentTime: number) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // 이징 함수 적용 (easeInOutQuad)
            const ease = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // 스크롤 완료 후 isScrolling 상태 초기화
                setIsScrolling(false);
            }
        }

        requestAnimationFrame(animation);
    };

    return (
        <div className="relative min-h-screen text-white">
            {/* 히어로 이미지를 페이지 전체 배경으로 설정 - 오버레이 밝기 조정 */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={getImagePath('/images/products/descender-footrest-and-case/main/visual.jpg')}
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="text-xs text-gray-300 hover:text-white mr-4"
                            >
                                <ArrowLeft className="mr-1 h-3 w-3" />돌아가기
                            </Button>
                            <h3 className="text-sm font-medium text-white">{currentProductName}</h3>
                        </div>

                        <div className="hidden md:flex items-center space-x-1 text-xs">
                            {Object.entries(sectionRefs).map(([id, _]) => (
                                id !== 'hero' && id !== 'technicalSpecifications' && (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id as SectionId)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full transition-all flex items-center",
                                            activeSection === id
                                                ? "bg-gradient-to-r from-red-700 to-red-600 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                                        )}
                                    >
                                        {id === 'overview' ? (
                                            <>
                                                <Package className="h-3 w-3 mr-1" />개요
                                            </>
                                        ) : id === 'caseStudies' ? (
                                            <>
                                                <Shield className="h-3 w-3 mr-1" />적용 사례
                                            </>
                                        ) : id === 'documents' ? (
                                            <>
                                                <FileTextIcon className="h-3 w-3 mr-1" />자료실 및 문의
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="h-3 w-3 mr-1" />제품 갤러리
                                            </>
                                        )}
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
                {/* 히어로 섹션 - 간결화 및 내부 중복 배경 제거 */}
                <section
                    ref={sectionRefs.hero}
                    className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden"
                >
                    {/* 히어로 컨텐츠 - 타이틀/서브타이틀/아이콘만 (제품 이미지/공식인증 카드 제거) */}
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
                                완강기를 효과적으로 활용하기 위한 전용 발판 및 보관 케이스로, 비상 시 신속한 피난을 지원합니다.
                            </p>
                        </div>
                    </div>
                    {/* 히어로 하단에 자연스러운 페이드 효과 추가 */}
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />

                    {/* 중앙 하단에 스크롤 유도 아이콘 (글씨 제거, 위치 위로 조정, 아이콘만) */}
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
                    {/* 제품 개요 섹션 - 개별 배경 제거 */}
                    <section
                        ref={sectionRefs.overview}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    완강기 발판 및 케이스 상세 소개
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            </div>

                            {/* 제품 개요: 좌(제품 이미지+설명) + 우(주요특장점) 2단 레이아웃, 높이 일치 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                                {/* 왼쪽: 제품 메인 이미지 + 설명 (세로 정렬, 카드화) */}
                                <div className="flex flex-col h-full">
                                    <div className="relative aspect-[4/3] w-full max-w-xl mx-auto flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                                        style={{ minWidth: '220px', minHeight: '180px' }}
                                    >
                                        <Image
                                            src={mainImage || "/images/products/descender-footrest-and-case/thumbnail.jpg"}
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
                                                {currentDescription || "완강기 발판 및 케이스는 화재나 재난 상황 발생 시 완강기를 사용하여 안전하게 피난할 수 있도록 지원하는 필수 부속품입니다. 완강기 발판은 사용자가 창밖으로 안전하게 위치할 수 있도록 설계되었으며, 케이스는 완강기의 안전한 보관과 즉각적인 사용을 가능하게 합니다. 한국소방산업기술원의 승인을 받은 제품으로 신뢰성과 안전성이 검증되었습니다."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* 오른쪽: 주요 특장점 - 좌측과 높이 맞춤 */}
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
                                                <ul className="space-y-4">
                                                    <li className="flex items-start text-gray-200">
                                                        <CheckCircle2 className="h-5 w-5 mt-1 mr-3 text-green-400 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-white mb-1">안정적인 설치 구조</h4>
                                                            <p className="text-gray-300">창문과 벽면에 단단히 고정되어 완강기 사용 시 안정성 확보</p>
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start text-gray-200">
                                                        <CheckCircle2 className="h-5 w-5 mt-1 mr-3 text-green-400 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-white mb-1">내구성 있는 소재</h4>
                                                            <p className="text-gray-300">고강도 스틸 재질로 제작되어 하중에 대한 내구성 우수</p>
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start text-gray-200">
                                                        <CheckCircle2 className="h-5 w-5 mt-1 mr-3 text-green-400 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-white mb-1">효율적인 보관 시스템</h4>
                                                            <p className="text-gray-300">완강기를 안전하게 보관하고 신속하게 접근할 수 있는 케이스 설계</p>
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start text-gray-200">
                                                        <CheckCircle2 className="h-5 w-5 mt-1 mr-3 text-green-400 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-white mb-1">빠른 설치 가능</h4>
                                                            <p className="text-gray-300">비상 상황에서 신속하게 설치할 수 있는 직관적인 디자인</p>
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start text-gray-200">
                                                        <CheckCircle2 className="h-5 w-5 mt-1 mr-3 text-green-400 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium text-white mb-1">표준 규격 준수</h4>
                                                            <p className="text-gray-300">한국소방산업기술원 형식승인을 받은 안전 기준 충족 제품</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>

                                        {/* 제품 문의 버튼 */}
                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <Link
                                                href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
                                                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium rounded-md shadow-lg transition-all"
                                            >
                                                <MessageCircle className="h-5 w-5 mr-2" />
                                                제품 문의하기
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 제품 상세 정보 - 두 가지 제품 비교 */}
                            <div className="mt-16 space-y-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl lg:text-3xl font-bold text-white font-serif flex items-center justify-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        <Package className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-blue-400 flex-shrink-0" />
                                        제품 상세 규격
                                    </h3>
                                    <div className="w-24 h-1 mx-auto bg-white/30 rounded-full my-4"></div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* 제품 1: 설치형 발판 - 단독벽부형 */}
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/15 rounded-xl overflow-hidden shadow-lg">
                                        <div className="p-5 border-b border-white/10">
                                            <h3 className="text-xl font-bold text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                설치형 발판, 단독벽부형
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
                                            <div className="md:col-span-1">
                                                <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/10">
                                                    <Image
                                                        src={getImagePath('/images/products/descender-footrest-and-case/main00.jpg')}
                                                        alt="설치형 발판: 단독벽부형"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-white/10">
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90 w-1/3">제품</td>
                                                            <td className="py-2 px-3 text-gray-300">설치형 발판, 단독벽부형</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90">규격</td>
                                                            <td className="py-2 px-3 text-gray-300">300×200×10 mm</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90">재질</td>
                                                            <td className="py-2 px-3 text-gray-300">SS275</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90">설치방식</td>
                                                            <td className="py-2 px-3 text-gray-300">단독벽부형</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 제품 2: 설치형 발판 - 탈착식 발판, 완강기 케이스 결합형 */}
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/15 rounded-xl overflow-hidden shadow-lg">
                                        <div className="p-5 border-b border-white/10">
                                            <h3 className="text-xl font-bold text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                탈착식 발판, 완강기 케이스 결합형
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
                                            <div className="md:col-span-1">
                                                <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/10">
                                                    <Image
                                                        src={getImagePath('/images/products/descender-footrest-and-case/hero_placeholder-2.jpg')}
                                                        alt="설치형 발판: 탈착식 발판, 완강기 케이스 결합형"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <table className="w-full">
                                                    <tbody className="divide-y divide-white/10">
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90 w-1/3">제품</td>
                                                            <td className="py-2 px-3 text-gray-300">탈착식 발판, 완강기 케이스 결합형</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90">규격</td>
                                                            <td className="py-2 px-3 text-gray-300">260×230×330 mm</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90">재질</td>
                                                            <td className="py-2 px-3 text-gray-300">ABS</td>
                                                        </tr>
                                                        <tr className="hover:bg-white/5">
                                                            <td className="py-2 px-3 font-medium text-white/90">설치방식</td>
                                                            <td className="py-2 px-3 text-gray-300">탈착식 발판, 케이스 결합형</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 기술 사양 정보 - 인증서 및 시험결과 */}
                            <div className="mt-16 bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-6 md:p-8 border-b border-white/10">
                                    <h3 className="text-xl lg:text-2xl font-bold text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        <Award className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-amber-400 flex-shrink-0" />
                                        기술 사양
                                    </h3>
                                </div>
                                <div className="p-6 md:p-8">
                                    {/* 인증서 이미지 */}
                                    <div className="flex justify-center mb-8">
                                        <div className="relative w-full h-auto overflow-hidden rounded-lg border border-white/10 bg-black/30">
                                            <Image
                                                src={getImagePath('/images/products/descender-footrest-and-case/main.jpg')}
                                                alt="완강기 발판 및 케이스 인증서"
                                                width={800}
                                                height={1100}
                                                className="w-full h-auto object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* 발판시험성적서 시험결과 테이블 */}
                                    <div className="mt-8">
                                        <h4 className="text-lg font-semibold text-white mb-4 text-center">발판시험성적서 시험결과</h4>
                                        <h5 className="text-base font-medium text-gray-300 mb-4 text-center">완강기 케이스 발판</h5>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse">
                                                <thead>
                                                    <tr className="bg-black/40 border-b border-white/10">
                                                        <th className="py-3 px-4 text-left font-semibold text-white">시험항목</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-white">단위</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-white">시험방법</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-white">시험결과</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-white">시험환경</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b border-white/5 hover:bg-white/5">
                                                        <td className="py-3 px-4 text-gray-300">압축하중</td>
                                                        <td className="py-3 px-4 text-gray-300">N</td>
                                                        <td className="py-3 px-4 text-gray-300">(1)</td>
                                                        <td className="py-3 px-4 text-gray-300 font-medium">15380</td>
                                                        <td className="py-3 px-4 text-gray-300">(23 ± 1)℃, (50 ± 2) % R, H.</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-3">※ 압축하중 : 10mm/min의 속도로 압축하였을때 최대 하중</p>
                                    </div>
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

                    {/* 문서 다운로드 섹션 */}
                    <section
                        ref={sectionRefs.documents}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    자료실
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    완강기 발판 및 케이스에 대한 상세 자료와 인증서를 다운로드할 수 있습니다.
                                </p>
                            </div>

                            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
                                <h3 className="text-xl lg:text-2xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    <FileTextIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-400 flex-shrink-0" />
                                    다운로드 가능 자료
                                </h3>

                                {documents && documents.length > 0 ? (
                                    <div className="space-y-4">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/50 transition-colors"
                                            >
                                                <div className="flex items-center mb-3 md:mb-0">
                                                    <div className="mr-4 p-2 bg-white/10 rounded-md">
                                                        {doc.type === 'pdf' ? (
                                                            <FileTextIcon className="h-6 w-6 text-red-400" />
                                                        ) : doc.type === 'doc' ? (
                                                            <FileTextIcon className="h-6 w-6 text-blue-400" />
                                                        ) : (
                                                            <FileTextIcon className="h-6 w-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">
                                                            {doc.nameKo || doc.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-400">
                                                            {doc.fileType || doc.type?.toUpperCase() || "문서"}
                                                            {doc.fileSize && ` • ${doc.fileSize}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={doc.url || doc.path}
                                                    download={doc.filename || true}
                                                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-medium rounded-md shadow-md transition-all"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    다운로드
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {[
                                            { id: 'footrest-manual', name: '완강기 발판 사용설명서', type: 'pdf', size: '3.2MB' },
                                            { id: 'case-spec', name: '완강기 케이스 규격서', type: 'pdf', size: '2.8MB' },
                                            { id: 'certification', name: '제품 인증서', type: 'pdf', size: '1.5MB' },
                                            { id: 'installation-guide', name: '설치 가이드', type: 'pdf', size: '4.1MB' }
                                        ].map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/50 transition-colors"
                                            >
                                                <div className="flex items-center mb-3 md:mb-0">
                                                    <div className="mr-4 p-2 bg-white/10 rounded-md">
                                                        <FileTextIcon className="h-6 w-6 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{doc.name}</h4>
                                                        <p className="text-xs text-gray-400">{doc.type.toUpperCase()} • {doc.size}</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&inquiry=documentation`}
                                                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-medium rounded-md shadow-md transition-all"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    문의하기
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                                    <p className="text-sm text-gray-400 mb-4">
                                        필요한 문서가 목록에 없으신가요? 아래 버튼을 통해 문의해 주세요.
                                    </p>
                                    <Link
                                        href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}&inquiry=documentation`}
                                        className="inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-medium rounded-md shadow-md transition-all"
                                    >
                                        <FileTextIcon className="h-4 w-4 mr-2" />
                                        추가 문서 요청하기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 제품 갤러리 섹션 */}
                    <section
                        ref={sectionRefs.gallery}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    제품 갤러리
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    완강기 발판 및 케이스의 다양한 각도와 사용 환경에서의 이미지를 확인하세요.
                                </p>
                            </div>

                            {/* 미디어 탭 선택기 */}
                            {(imageItems.length > 0 || videoItems.length > 0) && (
                                <div className="flex justify-center mb-8">
                                    <div className="inline-flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10 shadow-lg">
                                        <button
                                            onClick={() => setActiveMediaTab('images')}
                                            className={cn(
                                                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                                activeMediaTab === 'images'
                                                    ? "bg-gradient-to-r from-red-700 to-red-600 text-white shadow"
                                                    : "text-gray-400 hover:text-white"
                                            )}
                                        >
                                            <span className="flex items-center">
                                                <ImageIcon className="h-4 w-4 mr-2" />
                                                이미지 ({imageItems.length})
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setActiveMediaTab('videos')}
                                            className={cn(
                                                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                                activeMediaTab === 'videos'
                                                    ? "bg-gradient-to-r from-red-700 to-red-600 text-white shadow"
                                                    : "text-gray-400 hover:text-white"
                                            )}
                                        >
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                </svg>
                                                비디오 ({videoItems.length})
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 이미지/비디오 갤러리 */}
                            {allMediaItems.length > 0 ? (
                                <ProductImageGallery
                                    items={activeMediaTab === 'images' ? imageItems : videoItems}
                                />
                            ) : (
                                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                                    <ImageIcon className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                                    <p className="text-gray-400 mb-6">갤러리 이미지가 준비 중입니다.</p>
                                    <p className="text-sm text-gray-500">갤러리 이미지를 보려면 제품 문의를 통해 요청해 주세요.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;