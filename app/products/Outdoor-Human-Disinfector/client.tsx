'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Shield, ListChecks, FileText as FileTextIcon, ImageIcon, Package, ArrowLeft, MessageCircle,
    AlertTriangle, ChevronDown, CheckCircle2, ExternalLink, Download, ChevronRight, Award, Zap, Building, Droplet, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDetailClientProps } from '@/types/component-props';
import { cn, getImagePath } from '@/lib/utils';
import ProductFeaturesComponent from '@/components/products/b-type/ProductFeatures';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import ProductImageGallery from '@/components/products/b-type/ProductImageGallery';
import { MediaGalleryItem } from '@/types/product';

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
type SectionId = 'hero' | 'overview' | 'applicationAreas' | 'technicalSpecifications' | 'documents' | 'gallery';

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
    cautions = [],
    additionalSections = [],
}) => {
    // 섹션 참조 확장 (새 섹션 추가)
    const sectionRefs = {
        hero: useRef<HTMLDivElement>(null),
        overview: useRef<HTMLDivElement>(null),
        applicationAreas: useRef<HTMLDivElement>(null),
        technicalSpecifications: useRef<HTMLDivElement>(null),
        documents: useRef<HTMLDivElement>(null),
        gallery: useRef<HTMLDivElement>(null),
    };

    // 상태 관리
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showNav, setShowNav] = useState(false);

    // 제품 기본 정보
    const currentProductName = initialProductName || "대인소독기 실외형";
    const currentDescription = initialDescription || "코로나19 바이러스 등 세균 감염 예방을 위한 실외형 대인소독기로, 인체에 해롭지 않은 친환경 소독액을 미세 안개 분사하여 바이러스를 제거합니다. 약제 소독 → 출입 → 자동 손소독의 3단계 보안 프로세스를 제공합니다.";

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
        features && features.length > 0 ? features.map(({ icon, ...rest }) => rest) : [
            { title: "친환경 소독", description: "인체에 무해한 친환경 소독약을 사용하며, 미세 안개 분사 방식으로 효과적인 살균력을 제공합니다." },
            { title: "3단계 방역 시스템", description: "약제 소독, 출입, 자동 손소독의 3단계 보안 프로세스로 완벽한 방역 시스템을 구축합니다." },
            { title: "실외 환경 최적화", description: "다양한 실외 환경에 적합하게 설계되어 있으며, 내구성이 뛰어나 장기간 사용이 가능합니다." },
            { title: "자동 센서 시스템", description: "통과하는 사람을 감지하는 자동 센서 시스템으로 효율적인 소독이 가능합니다." },
            { title: "유지관리 용이성", description: "간편한 약제 충전 및 필터 교체로 유지관리가 용이합니다." },
        ],
        [features]);

    // 추가 섹션 처리
    const applicationAreasSection = useMemo(() => {
        return additionalSections?.find(section => section.title === "적용현장") || {
            title: "적용현장",
            content: "공장 출입구 : 대형 공장, 물류창고, 식품가공시설 등 다수 인원이 출입하는 산업시설\n\n상업시설 : 백화점, 대형마트, 쇼핑몰, 영화관 등 다중이용시설\n\n교육시설 : 학교, 유치원, 학원 등 교육관련 시설\n\n의료시설 : 병원, 요양원, 의원, 약국 등 보건의료시설\n\n공공시설 : 관공서, 도서관, 박물관 등 공공이용시설"
        };
    }, [additionalSections]);

    // 스펙 테이블 처리
    const currentSpecTable = specTable && specTable.length > 0 ? specTable : [
        { title: "구분", "HTS_OD_A": "HTS-OD-A", "HTS_OD_B": "HTS-OD-B", "HTS_OD_C": "HTS-OD-C" },
        { title: "크기 (mm)", "HTS_OD_A": "1,200 × 1,500 × 2,300", "HTS_OD_B": "1,200 × 1,300 × 2,300", "HTS_OD_C": "1,200 × 1,100 × 2,300" },
        { title: "소비전력", "HTS_OD_A": "1.5kW", "HTS_OD_B": "1.2kW", "HTS_OD_C": "1.0kW" },
        { title: "노즐 개수", "HTS_OD_A": "18개", "HTS_OD_B": "16개", "HTS_OD_C": "12개" },
        { title: "타이머", "HTS_OD_A": "자동/수동", "HTS_OD_B": "자동/수동", "HTS_OD_C": "자동/수동" },
        { title: "약제 탱크 용량", "HTS_OD_A": "20L", "HTS_OD_B": "15L", "HTS_OD_C": "10L" },
        { title: "시간당 사용량", "HTS_OD_A": "2L", "HTS_OD_B": "1.5L", "HTS_OD_C": "1L" },
        { title: "특징", "HTS_OD_A": "대형 출입구용", "HTS_OD_B": "중형 출입구용", "HTS_OD_C": "소형 출입구용" },
    ];

    // 주의사항 (필요한 경우만)
    const currentCautions = cautions && cautions.length > 0 ? cautions : [
        "소독액 교체 시 반드시 전원을 차단하고 작업해야 합니다.",
        "센서 작동 범위 내에서 장시간 머무르지 않도록 주의해야 합니다.",
        "겨울철 영하의 온도에서는 내부 액체가 얼 수 있으므로 히터 기능을 작동시켜야 합니다.",
        "정기적인 필터 교체 및 노즐 청소가 필요합니다."
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
                    src={getImagePath('/images/products/Outdoor-Human-Disinfector/main/visual.jpg')}
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
                                                ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                                        )}
                                    >
                                        {id === 'overview' ? <><Package className="h-3 w-3 mr-1" />개요</> :
                                            id === 'applicationAreas' ? <><Building className="h-3 w-3 mr-1" />적용 분야</> :
                                                id === 'technicalSpecifications' ? <><ListChecks className="h-3 w-3 mr-1" />기술 사양</> :
                                                    id === 'documents' ? <><FileTextIcon className="h-3 w-3 mr-1" />자료실 및 문의</> :
                                                        <><ImageIcon className="h-3 w-3 mr-1" />제품 갤러리</>}
                                    </button>
                                )
                            ))}
                        </div>
                        <Link
                            href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
                            className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-medium text-xs transition-all duration-300 shadow-md"
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
                                            src={mainImage || "/images/products/Outdoor-Human-Disinfector/main/thumbnail.jpg"}
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
                                            <ListChecks className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-400 flex-shrink-0" />
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
                    ref={sectionRefs.applicationAreas}
                    id="applicationAreas"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                적용 현장
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                {currentProductName}가 적용 가능한 다양한 시설과 환경을 확인하세요.
                            </p>
                        </div>

                        <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="p-6 md:p-10 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -mt-32 -mr-32 pointer-events-none"></div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mt-8">
                                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mt-16 -mr-16 pointer-events-none"></div>
                                        <div className="w-16 h-16 bg-blue-900/30 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4">
                                            <Building className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">산업시설</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            대형 공장, 물류창고, 식품가공시설 등 다수 인원이 출입하는 산업시설에 적합합니다.
                                        </p>
                                    </div>

                                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mt-16 -mr-16 pointer-events-none"></div>
                                        <div className="w-16 h-16 bg-blue-900/30 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4">
                                            <Users className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">다중이용시설</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            백화점, 대형마트, 쇼핑몰, 영화관 등 다중이용시설의 출입구에 설치하여 효과적인 방역이 가능합니다.
                                        </p>
                                    </div>

                                    <div className="bg-black/50 border border-white/10 rounded-xl p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mt-16 -mr-16 pointer-events-none"></div>
                                        <div className="w-16 h-16 bg-blue-900/30 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4">
                                            <Shield className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">공공시설</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            관공서, 도서관, 박물관, 학교, 병원 등 공공이용시설에 적용하여 감염병 예방에 효과적입니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 p-6 bg-black/30 rounded-xl border border-white/5">
                                    <p className="text-white/70 text-sm text-center">
                                        대인소독기 실외형은 실외 환경에 맞게 설계되어 다양한 기후 조건에서도 안정적으로 작동하며, 대규모 인원의 출입이 빈번한 곳에 특히 효과적입니다.
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
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">HTS-OD-A</th>
                                                    <th scope="col" className="px-4 py-3 border-r border-b border-gray-700">HTS-OD-B</th>
                                                    <th scope="col" className="px-4 py-3 border-b border-gray-700">HTS-OD-C</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentSpecTable.filter(row => row.title !== "구분").map((row, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}>
                                                        <th scope="row" className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-700">{row.title}</th>
                                                        <td className="px-4 py-3 border-r border-gray-700">{row.HTS_OD_A}</td>
                                                        <td className="px-4 py-3 border-r border-gray-700">{row.HTS_OD_B}</td>
                                                        <td className="px-4 py-3">{row.HTS_OD_C}</td>
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
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.documents}
                    id="documents"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                자료실 및 제품 문의
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                {currentProductName}에 대한 자세한 정보 및 문의가 필요하시면 아래 자료를 다운로드하거나 문의하기 버튼을 눌러주세요.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl h-full">
                                    <div className="p-6 md:p-8 border-b border-white/10">
                                        <h3 className="text-xl lg:text-2xl font-bold text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <FileTextIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-400 flex-shrink-0" />
                                            문서 자료
                                        </h3>
                                    </div>
                                    <div className="p-6 md:p-8">
                                        {documents && documents.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {documents.map((doc, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={doc.path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-black/50 hover:border-blue-500/30 transition-all group"
                                                    >
                                                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-800/50 transition-colors">
                                                            {doc.type === 'pdf' ? (
                                                                <FileTextIcon className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                                                            ) : doc.type === 'doc' ? (
                                                                <FileTextIcon className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                                                            ) : (
                                                                <FileTextIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {doc.nameKo || doc.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400 truncate">
                                                                {doc.type === 'pdf' ? 'PDF 문서' : doc.type === 'doc' ? 'Word 문서' : '문서 파일'}
                                                            </p>
                                                        </div>
                                                        <div className="ml-2">
                                                            <Download className="h-4 w-4 text-gray-400 group-hover:text-white" />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-8">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/30 border border-white/10 mb-4">
                                                    <FileTextIcon className="h-8 w-8 text-gray-500" />
                                                </div>
                                                <p className="text-gray-400 mb-2">현재 등록된 문서 자료가 없습니다.</p>
                                                <p className="text-sm text-gray-500">문서 자료는 추후 업데이트 예정입니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl h-full">
                                    <div className="p-6 md:p-8 border-b border-white/10">
                                        <h3 className="text-xl lg:text-2xl font-bold text-white font-serif flex items-center" style={{ fontFamily: 'var(--font-playfair)' }}>
                                            <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 mr-3 text-blue-400 flex-shrink-0" />
                                            제품 문의
                                        </h3>
                                    </div>
                                    <div className="p-6 md:p-8 text-center flex flex-col items-center">
                                        <div className="mb-6 p-6 bg-blue-600/20 rounded-full inline-flex">
                                            <MessageCircle className="h-12 w-12 text-blue-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">더 자세한 정보가 필요하신가요?</h4>
                                        <p className="text-gray-400 mb-8">전문 상담원에게 제품에 대한 자세한 정보 및 견적을 문의해보세요.</p>
                                        <Link
                                            href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
                                            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-medium text-sm transition-all duration-300 shadow-md hover:shadow-xl"
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            문의하기
                                        </Link>
                                        <div className="mt-8 p-4 bg-black/30 rounded-lg border border-white/10">
                                            <p className="text-sm text-gray-400">전화 문의: 041-555-6789</p>
                                            <p className="text-sm text-gray-400">이메일: info@seohanfnc.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.gallery}
                    id="gallery"
                    className="min-h-screen flex flex-col justify-center relative py-20 scroll-mt-20"
                >
                    <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                제품 갤러리
                            </h2>
                            <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                            <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg mb-8">
                                {currentProductName}의 다양한 이미지와 영상을 확인하세요.
                            </p>

                            {(imageItems.length > 0 || videoItems.length > 0) && (
                                <div className="flex justify-center gap-4 mb-12">
                                    <Button
                                        variant={activeMediaTab === 'images' ? "default" : "outline"}
                                        onClick={() => setActiveMediaTab('images')}
                                        className={cn(
                                            "rounded-full px-5",
                                            activeMediaTab === 'images' && "bg-blue-600 hover:bg-blue-700"
                                        )}
                                    >
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        이미지
                                    </Button>
                                    <Button
                                        variant={activeMediaTab === 'videos' ? "default" : "outline"}
                                        onClick={() => setActiveMediaTab('videos')}
                                        className={cn(
                                            "rounded-full px-5",
                                            activeMediaTab === 'videos' && "bg-blue-600 hover:bg-blue-700"
                                        )}
                                    >
                                        <Zap className="w-4 h-4 mr-2" />
                                        영상
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300 min-h-[300px]">
                            <div className="p-6 md:p-8">
                                {activeMediaTab === 'images' && imageItems.length > 0 && (
                                    <ProductImageGallery items={imageItems} />
                                )}
                                {activeMediaTab === 'videos' && videoItems.length > 0 && (
                                    <ProductImageGallery items={videoItems} />
                                )}
                                {activeMediaTab === 'images' && imageItems.length === 0 && (
                                    <div className="text-center p-16">
                                        <ImageIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                        <p className="text-gray-400">현재 갤러리 이미지가 준비 중입니다.</p>
                                    </div>
                                )}
                                {activeMediaTab === 'videos' && videoItems.length === 0 && (
                                    <div className="text-center p-16">
                                        <Zap className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                        <p className="text-gray-400">현재 비디오 자료가 준비 중입니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;