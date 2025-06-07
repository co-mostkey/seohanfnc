'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Shield, ListChecks, FileText as FileTextIcon, ImageIcon, Package, ArrowLeft, MessageCircle,
    AlertTriangle, ChevronDown, CheckCircle2, ExternalLink, Download, ChevronRight, Award, Flame, Zap, Building
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

// additionalSections 타입 정의 추가
interface AdditionalSection {
    title: string;
    content: string;
}

// ProductDetailClientProps 타입에 additionalSections 추가 (추가 섹션 지원 위함)
type ExtendedProductDetailClientProps = ProductDetailClientProps & {
    additionalSections?: AdditionalSection[];
};

// 섹션 ID 정의 (새 섹션 추가)
type SectionId = 'hero' | 'overview' | 'extinctionPrinciple' | 'technicalSpecifications' | 'applicationAreas' | 'caseStudies' | 'documents' | 'gallery';

const ProductDetail: React.FC<ExtendedProductDetailClientProps> = ({
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
    additionalSections = [],
}) => {
    // 섹션 참조 확장 (새 섹션 추가)
    const sectionRefs = {
        hero: useRef<HTMLDivElement>(null),
        overview: useRef<HTMLDivElement>(null),
        extinctionPrinciple: useRef<HTMLDivElement>(null),
        technicalSpecifications: useRef<HTMLDivElement>(null),
        applicationAreas: useRef<HTMLDivElement>(null),
        caseStudies: useRef<HTMLDivElement>(null),
        documents: useRef<HTMLDivElement>(null),
        gallery: useRef<HTMLDivElement>(null),
    };

    // 상태 관리
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showNav, setShowNav] = useState(false);

    // 제품 기본 정보
    const currentProductName = initialProductName || "고체 에어로졸 소화기";
    const currentDescription = initialDescription || "SAFE-g는 세계 최초의 기계식 무화약 점화 장치를 이용한 고체 에어로졸 소화기로 무인 상태에서도 화재를 자동으로 감지하여 소화 시킴으로써, 화재의 확산을 막고, 화학반응을 통한 소화 원리로 화재 진압으로 인한 중요설비, 기록물, 문화재 등의 2차 훼손없는 보존을 위한 제품입니다.";
    const currentApprovalNumber = approvalNumber || "형식승인번호 : 소공 13-1";

    // 미디어 아이템 처리
    const allMediaItems: MediaGalleryItem[] = useMemo(() => {
        const imagesWithType = galleryImagesData.map(item => ({ ...item, type: 'image' as const, id: item.id || `img-${item.src}` }));
        const videosWithType = videoGalleryData.map(item => ({ ...item, type: 'video' as const, id: item.id || `vid-${item.src}` }));
        return [...imagesWithType, ...videosWithType].sort((a, b) => (a.id && b.id) ? a.id.localeCompare(b.id) : 0);
    }, [galleryImagesData, videoGalleryData]);

    const imageItems = useMemo(() => allMediaItems.filter(item => item.type === 'image'), [allMediaItems]);
    const videoItems = useMemo(() => allMediaItems.filter(item => item.type === 'video'), [allMediaItems]);

    // 특장점 처리
    const displayFeaturesToRender = useMemo(() =>
        features && features.length > 0 ? features.map(({ icon, ...rest }) => rest) :
            [
                { title: "안전성", description: "인체에 무해하고 전자,전기장비에 영향을 주지 않으므로 안전합니다." },
                { title: "우수성", description: "기존 할론계 소화 장비의 성능에 비해 5배 이상의 소화 성능을 보유합니다." },
                { title: "경제성", description: "별도의 추가장치 필요 없으며 한번 설치로 10년이상 유지되므로 비용이 절감 됩니다." },
                { title: "편리성", description: "간단하게 설치하므로 설치 시간이 짧으며 누구든지 쉽게 취급할 수 있습니다." },
                { title: "친환경", description: "지구온난화지수(GWP)와 오존층파괴지수(ODP)가 '0'으로 환경 친화적 제품 입니다." },
            ],
        [features]);

    // 추가 섹션 처리
    const extinctionPrincipleSection = useMemo(() => {
        return additionalSections.find(section => section.title === "소화원리") || {
            title: "소화원리",
            content: "첫째, 화재가 발생하면 불안정한 O(산소), H(수소) 및 OH(수산화)물질등이 공기중의 산소(O2)와 결합하며 활성화 됩니다.\n\n둘째, 화재를 감지한 SAFE-g가 화염속에 소화약재중의 성분 K(칼륨)을 방사합니다.\n\n셋째, 방사된 K(칼륨)은 O(산소), H(수소) 및 OH(수산화)물질 등과 융합하여 화염의 연쇄 반응을 끊어냄으로써 화재를 종식 시킵니다."
        };
    }, [additionalSections]);

    const applicationAreasSection = useMemo(() => {
        return additionalSections.find(section => section.title === "적용분야") || {
            title: "적용분야",
            content: "발전소/전기실 : 변전, 변압실, 케이블실, 배전함, 전산실, 교환실, 관제실, 방송실등\n\n자동차/선박/항공 : 기관실, 보일러실, 화물실, 엔진실, 펌프실\n\n생산설비 : 케미컬, 가스생산, 공급시설, 반도체, 석유화학시설등\n\n문화재/보관소 : 박물관, 미술관, 문화재, 도서관, 액세스 자료 보관소\n\n군용장비 : 전투기, 헬리콥터, 전차, 장갑차, 자주포, 군함정등 중요시설"
        };
    }, [additionalSections]);

    // 스펙 테이블 처리
    const currentSpecTable = specTable && specTable.length > 0 ? specTable : [
        { title: "구분", "SAFE_g_600": "SAFE-g 600", "SAFE_g_900": "SAFE-g 900", "SAFE_g_1800": "SAFE-g 1,800", "SAFE_g_2750": "SAFE-g 2,750", "SAFE_g_3700": "SAFE-g 3,700" },
        { title: "소화약재질량", "SAFE_g_600": "600g", "SAFE_g_900": "900g", "SAFE_g_1800": "1,900g", "SAFE_g_2750": "2,900g", "SAFE_g_3700": "3,900g" },
        { title: "방호체적 유류화재", "SAFE_g_600": "5.9㎥", "SAFE_g_900": "8.86㎥", "SAFE_g_1800": "17.72㎥", "SAFE_g_2750": "26.58㎥", "SAFE_g_3700": "35.44㎥" },
        { title: "방호체적 중합화재", "SAFE_g_600": "5.9㎥", "SAFE_g_900": "8.86㎥", "SAFE_g_1800": "17.72㎥", "SAFE_g_2750": "26.58㎥", "SAFE_g_3700": "35.44㎥" },
        { title: "이격거리 인체", "SAFE_g_600": "1.0m", "SAFE_g_900": "1.5m", "SAFE_g_1800": "2.0m", "SAFE_g_2750": "2.0m", "SAFE_g_3700": "2.0m" },
        { title: "이격거리 대상물", "SAFE_g_600": "0.8m", "SAFE_g_900": "1.0m", "SAFE_g_1800": "1.3m", "SAFE_g_2750": "1.4m", "SAFE_g_3700": "1.5m" },
        { title: "방출시간(sec)", "SAFE_g_600": "6초", "SAFE_g_900": "9.8초", "SAFE_g_1800": "15초", "SAFE_g_2750": "17초", "SAFE_g_3700": "19초" },
        { title: "사용온도(℃)", "SAFE_g_600": "-30 ~ 60℃", "SAFE_g_900": "-30 ~ 61℃", "SAFE_g_1800": "-30 ~ 62℃", "SAFE_g_2750": "-30 ~ 63℃", "SAFE_g_3700": "-30 ~ 64℃" },
    ];

    // 주의사항 (필요한 경우만)
    const currentCautions = cautions && cautions.length > 0 ? cautions : [
        "본 제품은 관계법에 의한 강제설치 대상이 아닌 소화장비입니다.",
        "소화약재와 인체가 직접 접촉되지 않도록 하십시오.",
    ];

    // 스크롤 이벤트 처리
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
        handleScroll(); // 초기 로드 시 실행
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolling]); // [TRISID] activeSection, sectionRefs 의존성 제거하여 무한 리렌더링 방지

    const scrollToSection = (sectionId: SectionId) => {
        setIsScrolling(true);
        setActiveSection(sectionId);
        const targetSection = sectionRefs[sectionId]?.current;
        if (!targetSection) {
            setIsScrolling(false);
            return;
        }
        // 헤더 높이 등 고려한 오프셋 (80px 정도)
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - (sectionId === 'hero' ? 0 : headerOffset);

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        // behavior:smooth 사용 시, 스크롤 완료 시점 파악이 어려워 바로 false로 설정
        setTimeout(() => setIsScrolling(false), 1000); // 부드러운 스크롤 시간 고려
    };

    return (
        <div className="relative min-h-screen text-white">
            <div className="fixed inset-0 z-0">
                <Image
                    src={getImagePath('/images/products/Solid-Aerosol-Extinguisher/main/visual.jpg')}
                    alt={`${currentProductName} 비주얼 배경`}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={85}
                />
                <div className="fixed inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/20"></div>
            </div>
            {showNav && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800/30 py-2 px-4 transition-all duration-300 shadow-lg animate-fadeIn">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="text-xs text-gray-300 hover:text-white mr-4"
                                aria-label="뒤로 가기"
                            >
                                <ArrowLeft className="mr-1 h-3 w-3" />돌아가기
                            </Button>
                            <h3 className="text-sm font-medium text-white truncate" title={currentProductName}>{currentProductName}</h3>
                        </div>
                        <div className="hidden md:flex items-center space-x-1 text-xs">
                            {Object.keys(sectionRefs).map((id) => (
                                id !== 'hero' && (
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
                                        {id === 'overview' ? <><Package className="h-3 w-3 mr-1" />개요</> :
                                            id === 'extinctionPrinciple' ? <><Flame className="h-3 w-3 mr-1" />소화원리</> :
                                                id === 'technicalSpecifications' ? <><ListChecks className="h-3 w-3 mr-1" />기술 사양</> :
                                                    id === 'applicationAreas' ? <><Building className="h-3 w-3 mr-1" />적용 분야</> :
                                                        id === 'caseStudies' ? <><Shield className="h-3 w-3 mr-1" />적용 사례</> :
                                                            id === 'documents' ? <><FileTextIcon className="h-3 w-3 mr-1" />자료실 및 문의</> :
                                                                <><ImageIcon className="h-3 w-3 mr-1" />제품 갤러리</>}
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
            <div className="relative z-10">
                <section
                    ref={sectionRefs.hero}
                    id="hero"
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
                            <p className="text-lg text-gray-300 mb-2 leading-relaxed max-w-3xl mx-auto">
                                {currentDescription}
                            </p>
                            <p className="text-sm text-amber-400 font-semibold">{currentApprovalNumber}</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <button
                        type="button"
                        onClick={() => scrollToSection('overview')}
                        className="absolute left-1/2 bottom-36 z-30 -translate-x-1/2 flex flex-col items-center group focus:outline-none"
                        aria-label="개요 섹션으로 스크롤"
                    >
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/40 border border-white/20 shadow-lg group-hover:bg-black/60 transition-all animate-bounce-slow">
                            <ChevronDown className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                        </span>
                    </button>
                </section>

                <div className="relative bg-gradient-to-b from-black/[.70] via-black/50 to-transparent">
                    <section
                        ref={sectionRefs.overview}
                        id="overview"
                        className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                    >
                        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    제품 상세 소개
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
                                <div className="flex flex-col h-full">
                                    <div className="relative aspect-[4/3] w-full max-w-xl mx-auto flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                                        style={{ minWidth: '220px', minHeight: '180px' }}
                                    >
                                        <Image
                                            src={mainImage || "/images/products/Solid-Aerosol-Extinguisher/thumbnail.jpg"}
                                            alt={`${currentProductName} 제품 이미지`}
                                            fill
                                            className="object-cover rounded-2xl"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 512px"
                                            quality={80}
                                        />
                                    </div>
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 lg:p-8 shadow-lg mt-6 flex-1 flex items-center">
                                        <div>
                                            <h4 className="text-xl lg:text-2xl font-semibold text-white mb-5 font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                                <FileTextIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-sky-400 flex-shrink-0" />
                                                제품 설명
                                            </h4>
                                            <p className="text-gray-300 text-base md:text-lg leading-relaxed lg:leading-loose tracking-wide whitespace-pre-line">
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
                                {currentApprovalNumber && (
                                    <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <Award className="h-6 w-6 lg:h-7 lg:w-7 mr-3 text-amber-400 flex-shrink-0" />
                                            공식 인증
                                        </h3>
                                        <div className="flex items-center p-4 bg-black/30 rounded-lg border border-white/10">
                                            <Award className="h-8 w-8 lg:h-10 lg:w-10 text-amber-300 mr-4 flex-shrink-0" />
                                            <div>
                                                <p className="text-lg lg:text-xl font-semibold text-white">{currentApprovalNumber.replace("형식승인번호 : ", "")}</p>
                                                <p className="text-sm text-gray-400">한국소방산업기술원 형식승인품</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {currentCautions && currentCautions.length > 0 && (
                                    <div className="bg-black/50 backdrop-blur-md border border-amber-400/30 rounded-xl p-6 md:p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-amber-400 font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <AlertTriangle className="h-6 w-6 lg:h-7 lg:w-7 mr-3 flex-shrink-0" />
                                            사용 시 주의사항
                                        </h3>
                                        <ul className="space-y-3 text-gray-300">
                                            {currentCautions.map((caution, idx) => (
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
                </div>

                <section
                    ref={sectionRefs.extinctionPrinciple}
                    id="extinctionPrinciple"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                소화 원리
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                {currentProductName}가 화재를 소화시키는 과학적 작용 원리를 확인하세요.
                            </p>
                        </div>

                        <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="p-6 md:p-10 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/10 to-transparent rounded-full -mt-32 -mr-32 pointer-events-none"></div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mt-8">
                                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20 hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mt-16 -mr-16 pointer-events-none"></div>
                                        <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-xl flex items-center justify-center mb-4">
                                            <Flame className="h-8 w-8 text-red-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">화재 발생</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            화재가 발생하면 불안정한 O(산소), H(수소) 및 OH(수산화)물질등이 공기중의 산소(O2)와 결합하며 활성화 됩니다.
                                        </p>
                                    </div>

                                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20 hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mt-16 -mr-16 pointer-events-none"></div>
                                        <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-xl flex items-center justify-center mb-4">
                                            <Zap className="h-8 w-8 text-yellow-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">소화약재 방사</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            화재를 감지한 SAFE-g가 화염속에 소화약재중의 성분 K(칼륨)을 방사합니다.
                                        </p>
                                    </div>

                                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20 hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mt-16 -mr-16 pointer-events-none"></div>
                                        <div className="w-16 h-16 bg-red-900/30 border border-red-500/30 rounded-xl flex items-center justify-center mb-4">
                                            <Shield className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">화재 소화</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            방사된 K(칼륨)은 O(산소), H(수소) 및 OH(수산화)물질 등과 융합하여 화염의 연쇄 반응을 끊어냄으로써 화재를 종식 시킵니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 p-6 bg-black/30 rounded-xl border border-white/5">
                                    <p className="text-white/70 text-sm text-center">
                                        고체 에어로졸 소화기는 화학적 반응을 통해 화재의 연쇄 반응을 차단하는 방식으로 소화하기 때문에, 물이나 가스처럼 냉각이나 산소 차단이 아닌 화학적 반응을 이용해 2차 훼손 없이 효과적으로 화재를 진압합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.technicalSpecifications}
                    id="technicalSpecifications"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                기술 사양
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                {currentProductName}의 상세한 기술 사양 정보를 확인하세요.
                            </p>
                        </div>
                        <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="p-6 md:p-8 border-b border-white/10">
                                <h3 className="text-xl lg:text-2xl font-bold text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    <Package className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-sky-400 flex-shrink-0" />
                                    제품 상세 규격
                                </h3>
                            </div>
                            <div className="p-2 md:p-0 overflow-x-auto">
                                {currentSpecTable && Array.isArray(currentSpecTable) && currentSpecTable.length > 0 ? (
                                    <div className="relative overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-300">
                                            <thead className="text-xs uppercase bg-black/30 text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">구분</th>
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">SAFE-g 600</th>
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">SAFE-g 900</th>
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">SAFE-g 1,800</th>
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">SAFE-g 2,750</th>
                                                    <th scope="col" className="px-4 py-3 border-b border-gray-700">SAFE-g 3,700</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentSpecTable.filter(row => row.title !== "구분").map((row, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}>
                                                        <th scope="row" className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-700">{row.title}</th>
                                                        <td className="px-4 py-3 border-r border-gray-700">{row.SAFE_g_600}</td>
                                                        <td className="px-4 py-3 border-r border-gray-700">{row.SAFE_g_900}</td>
                                                        <td className="px-4 py-3 border-r border-gray-700">{row.SAFE_g_1800}</td>
                                                        <td className="px-4 py-3 border-r border-gray-700">{row.SAFE_g_2750}</td>
                                                        <td className="px-4 py-3">{row.SAFE_g_3700}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-6 md:p-8 text-center text-gray-400">
                                        <p>상세 제품 규격 정보가 준비 중입니다.</p>
                                    </div>
                                )}
                            </div>
                            {currentApprovalNumber && (
                                <div className="p-4 md:p-6 bg-black/40 border-t border-white/10 flex items-center justify-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full">
                                        <Award className="h-4 w-4 text-amber-400" />
                                        <p className="text-sm text-gray-300">{currentApprovalNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.applicationAreas}
                    id="applicationAreas"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                적용 분야
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                다양한 환경과 시설에서 활용 가능한 {currentProductName}의 적용 분야를 확인하세요.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg overflow-hidden transform hover:scale-[1.03] transition-all duration-300">
                                <div className="w-14 h-14 bg-red-900/20 border border-red-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                        <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0z"></path>
                                        <circle cx="12" cy="8" r="2"></circle>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white text-center mb-3">발전소/전기실</h3>
                                <p className="text-gray-300 text-sm text-center">
                                    변전, 변압실, 케이블실, 배전함, 전산실, 교환실, 관제실, 방송실등
                                </p>
                            </div>

                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg overflow-hidden transform hover:scale-[1.03] transition-all duration-300">
                                <div className="w-14 h-14 bg-blue-900/20 border border-blue-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                                        <path d="M4 11a9 9 0 0 1 9 9"></path>
                                        <path d="M4 4a16 16 0 0 1 16 16"></path>
                                        <circle cx="5" cy="19" r="2"></circle>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white text-center mb-3">자동차/선박/항공</h3>
                                <p className="text-gray-300 text-sm text-center">
                                    기관실, 보일러실, 화물실, 엔진실, 펌프실
                                </p>
                            </div>

                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg overflow-hidden transform hover:scale-[1.03] transition-all duration-300">
                                <div className="w-14 h-14 bg-gray-900/20 border border-gray-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                                        <path d="M17 18h1"></path>
                                        <path d="M12 18h1"></path>
                                        <path d="M7 18h1"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white text-center mb-3">생산설비</h3>
                                <p className="text-gray-300 text-sm text-center">
                                    케미컬, 가스생산, 공급시설, 반도체, 석유화학시설등
                                </p>
                            </div>

                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg overflow-hidden transform hover:scale-[1.03] transition-all duration-300">
                                <div className="w-14 h-14 bg-yellow-900/20 border border-yellow-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="15" x2="12" y2="21"></line>
                                        <path d="M17 3a2 2 0 0 1 2 2"></path>
                                        <path d="M14 5a2 2 0 0 1 2-2"></path>
                                        <path d="M7 3a2 2 0 0 0-2 2"></path>
                                        <path d="M10 5a2 2 0 0 0-2-2"></path>
                                        <path d="M17.8 11.8c.8-2.8 2.7-5 4.2-5.7-2.3-1.2-6.8-2.2-11-2-4.2.2-8.7 1.2-11 2.5 1.5.7 3.4 2.8 4.2 5.6M12 12l1 10"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white text-center mb-3">문화재/보관소</h3>
                                <p className="text-gray-300 text-sm text-center">
                                    박물관, 미술관, 문화재, 도서관, 액세스 자료 보관소
                                </p>
                            </div>

                            <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg overflow-hidden transform hover:scale-[1.03] transition-all duration-300">
                                <div className="w-14 h-14 bg-green-900/20 border border-green-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white text-center mb-3">군용장비</h3>
                                <p className="text-gray-300 text-sm text-center">
                                    전투기, 헬리콥터, 전차, 장갑차, 자주포, 군함정등 중요시설
                                </p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
                                <p className="text-center text-gray-400 text-sm md:text-base">
                                    본 제품은 위와 같은 다양한 시설 및 장비에 적용 가능하여, 중요 시설 및 장비의 화재로부터 보호와 안전에 기여합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.caseStudies}
                    id="caseStudies"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                적용 사례
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                다양한 현장에 설치되어 활용되는 {currentProductName}의 실제 적용 사례를 확인하세요.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {
                                imageItems.length > 1 ? (
                                    [
                                        {
                                            imgSrc: imageItems[0]?.src || "/images/products/Solid-Aerosol-Extinguisher/gallery/sample1.jpg",
                                            title: "전기 설비 보호용 설치 사례",
                                            description: "전기실 내부에 설치된 SAFE-g 소화기의 실제 설치 모습입니다."
                                        },
                                        {
                                            imgSrc: imageItems[1]?.src || "/images/products/Solid-Aerosol-Extinguisher/gallery/sample2.jpg",
                                            title: "서버실 보호용 설치 사례",
                                            description: "중요 서버 랙에 설치된 SAFE-g 소화기의 실제 설치 모습입니다."
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/15 bg-black/50 backdrop-blur-md shadow-xl transform hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src={item.imgSrc}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                quality={75}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                            <div className="absolute bottom-0 left-0 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 w-full">
                                                <h3 className="text-white font-semibold text-lg lg:text-xl mb-1">{item.title}</h3>
                                                <p className="text-gray-300 text-sm lg:text-base leading-relaxed">{item.description}</p>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-red-600/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm z-20 shadow-md">
                                                사례 {index + 1}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-400">적용 사례 이미지가 준비 중입니다. 갤러리 탭에서 더 많은 이미지를 확인하실 수 있습니다.</p>
                                )
                            }
                        </div>
                        <p className="text-center mt-10 text-gray-500 text-sm">
                            * 위 이미지는 이해를 돕기 위한 예시이며, 실제 설치 환경에 따라 달라질 수 있습니다.
                        </p>
                    </div>
                </section>

                <section
                    ref={sectionRefs.documents}
                    id="documents"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
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
                                <div className="text-center py-10">
                                    <FileTextIcon className="mx-auto h-12 w-12 text-gray-600/50 mb-4" />
                                    <h3 className="text-xl font-medium mb-2 text-gray-400">자료 준비 중</h3>
                                    <p className="text-gray-500 text-sm max-w-lg mx-auto">
                                        현재 다운로드 가능한 문서가 준비 중입니다. 필요한 자료는 문의하기를 통해 요청해 주세요.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.gallery}
                    id="gallery"
                    className="min-h-screen flex flex-col justify-center relative py-20 pb-32 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                제품 갤러리
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                {currentProductName}의 다양한 이미지와 영상을 확인하세요.
                            </p>
                        </div>

                        {(imageItems.length > 0 || videoItems.length > 0) && (
                            <div className="flex flex-col">
                                {videoItems.length > 0 && (
                                    <div className="flex justify-center mb-6">
                                        <div className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/15 p-1">
                                            <button
                                                onClick={() => setActiveMediaTab('images')}
                                                className={cn(
                                                    "px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center",
                                                    activeMediaTab === 'images'
                                                        ? "bg-gradient-to-r from-red-700 to-red-600 text-white"
                                                        : "text-gray-400 hover:text-white"
                                                )}
                                            >
                                                <ImageIcon className="h-4 w-4 mr-2" />이미지
                                            </button>
                                            <button
                                                onClick={() => setActiveMediaTab('videos')}
                                                className={cn(
                                                    "px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center",
                                                    activeMediaTab === 'videos'
                                                        ? "bg-gradient-to-r from-red-700 to-red-600 text-white"
                                                        : "text-gray-400 hover:text-white"
                                                )}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                </svg>
                                                영상
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-2">
                                    <div className="border border-white/15 rounded-xl bg-black/40 backdrop-blur-md shadow-2xl overflow-hidden">
                                        {activeMediaTab === 'images' ? (
                                            imageItems.length > 0 ? (
                                                <ProductImageGallery
                                                    items={imageItems}
                                                    className="p-4 lg:p-6"
                                                />
                                            ) : (
                                                <div className="p-10 text-center">
                                                    <ImageIcon className="h-16 w-16 mx-auto text-gray-700 mb-4" />
                                                    <p className="text-gray-400">이미지 갤러리가 준비 중입니다.</p>
                                                </div>
                                            )
                                        ) : (
                                            videoItems.length > 0 ? (
                                                <ProductImageGallery
                                                    items={videoItems}
                                                    className="p-4 lg:p-6"
                                                />
                                            ) : (
                                                <div className="p-10 text-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-700 mb-4">
                                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                    </svg>
                                                    <p className="text-gray-400">영상 갤러리가 준비 중입니다.</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {imageItems.length === 0 && videoItems.length === 0 && (
                            <div className="border border-white/15 rounded-xl bg-black/40 backdrop-blur-md p-12 text-center">
                                <ImageIcon className="h-16 w-16 mx-auto text-gray-700 mb-4" />
                                <h3 className="text-xl font-medium mb-2 text-gray-300">갤러리 준비 중</h3>
                                <p className="text-gray-400 max-w-xl mx-auto mb-8">
                                    현재 갤러리 이미지와 영상이 준비 중입니다. 빠른 시일 내에 다양한 제품 이미지를 제공하겠습니다.
                                </p>
                                <Link
                                    href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
                                    className="inline-flex items-center px-4 py-2 bg-black/60 border border-white/20 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    제품 관련 문의하기
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProductDetail; 