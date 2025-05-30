'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    ListChecks, FileText as FileTextIcon, ImageIcon, Package, ArrowLeft, MessageCircle,
    ChevronDown, Award, Users, CheckCircle, Info, AlertTriangle, ExternalLink, ZoomIn, X, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDetailClientProps } from '@/types/component-props';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product'; // Product 타입 import
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // ScrollArea 추가
import { ModelSpecTable } from '@/components/products/ModelSpecTable'; // ModelSpecTable import 추가
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tabs 추가
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

// 섹션 ID 정의 (요약 페이지에 맞게 간소화)
type SectionId = 'hero' | 'hangerList' | 'contact'; // 'documents'는 contact에 포함될 수 있음

// ProductSpecificProps에 allProducts 추가 (실제 타입 정의 필요)
interface DescenderHangerSummaryProps extends ProductDetailClientProps {
    allProducts?: Product[];
}

// SheetContent를 위한 별도 내부 컴포넌트 정의 (상태 관리를 위해)
interface HangerSheetContentProps {
    hanger: Product;
}

// 형식승인번호 추출 헬퍼 함수 수정
const extractApprovalNumber = (description: string | undefined): string | null => {
    if (!description) return null;
    // "형식승인번호 : " 다음에 오는 모든 문자열을 추출 (줄바꿈 전까지 또는 문자열 끝까지)
    // 좀 더 정확히는, "형식승인번호 : " 다음에 오는, 괄호를 포함할 수 있는 문자열을 추출합니다.
    const match = description.match(/형식승인번호\s*:\s*([^\n]+)/); // 콜론 뒤부터 줄바꿈 전까지 추출
    // 만약 descriptionKo에 형식승인번호 외 다른 내용이 이어서 나온다면, 
    // 더 정교한 패턴 (예: 특정 구분자 전까지) 또는 JSON에 별도 필드 권장
    return match ? match[1].trim() : null;
};

const HangerSheetContent: React.FC<HangerSheetContentProps> = ({ hanger }) => {
    const [activeSheetTab, setActiveSheetTab] = useState("spec");
    const initialImageSrc = (hanger.gallery_images_data && hanger.gallery_images_data.length > 0
        ? hanger.gallery_images_data[0].src
        : hanger.image) || "/images/placeholder.png";
    const [selectedImageUrlInSheet, setSelectedImageUrlInSheet] = useState<string>(initialImageSrc);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const approvalNo = extractApprovalNumber(hanger.descriptionKo);

    useEffect(() => {
        const newInitialImage = (hanger.gallery_images_data && hanger.gallery_images_data.length > 0
            ? hanger.gallery_images_data[0].src
            : hanger.image) || "/images/placeholder.png";
        setSelectedImageUrlInSheet(newInitialImage);
        setActiveSheetTab("spec");
        setLightboxImage(null);
    }, [hanger]);

    const imageVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeInOut" } },
    };
    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeInOut" } },
    };

    return (
        <>
            <SheetHeader className="p-6 pb-4 border-b border-gray-700">
                <SheetTitle className="text-2xl font-serif text-red-400" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {hanger.nameKo || hanger.nameEn}
                </SheetTitle>
                {approvalNo && (
                    <p className="text-sm text-amber-400 mt-1 font-semibold">형식승인: {approvalNo}</p>
                )}
            </SheetHeader>
            <Tabs defaultValue="spec" value={activeSheetTab} onValueChange={setActiveSheetTab} className="flex-grow flex flex-col">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 rounded-none border-b border-gray-700 sticky top-0 z-10">
                    <TabsTrigger value="spec" className="py-3 text-xs sm:text-sm data-[state=active]:bg-red-700/30 data-[state=active]:text-red-300">상세 사양</TabsTrigger>
                    <TabsTrigger value="gallery" className="py-3 text-xs sm:text-sm data-[state=active]:bg-red-700/30 data-[state=active]:text-red-300">추가 이미지</TabsTrigger>
                    <TabsTrigger value="documents" className="py-3 text-xs sm:text-sm data-[state=active]:bg-red-700/30 data-[state=active]:text-red-300">관련 문서</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-grow focus:outline-none" tabIndex={-1}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSheetTab}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <TabsContent value="spec" className="p-6 outline-none focus:outline-none">
                                {hanger.specTable && hanger.specTable.length > 0 ? (
                                    <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                                        <h4 className="text-lg font-semibold mb-4 text-sky-400 flex items-center"><ListChecks className="w-5 h-5 mr-2" />상세 사양</h4>
                                        {approvalNo && (
                                            <div className="mb-3 pb-3 border-b border-gray-700">
                                                <p className="text-sm font-medium text-gray-300">형식승인번호: <span className="text-amber-400 font-semibold">{approvalNo}</span></p>
                                            </div>
                                        )}
                                        <ModelSpecTable specTable={hanger.specTable} className="w-full text-sm bg-transparent spec-table-custom" />
                                    </div>
                                ) : <p className="text-center text-gray-500 py-8">상세 사양 정보가 없습니다.</p>}
                            </TabsContent>

                            <TabsContent value="gallery" className="p-6 outline-none focus:outline-none">
                                {(hanger.gallery_images_data && hanger.gallery_images_data.length > 0) || hanger.image ? (
                                    <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                                        <h4 className="text-lg font-semibold mb-3 text-green-400 flex items-center"><ImageIcon className="w-5 h-5 mr-2" />이미지 갤러리</h4>
                                        <motion.div
                                            key={selectedImageUrlInSheet}
                                            variants={imageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="relative aspect-video w-full bg-black/10 rounded border border-gray-600 mb-3 overflow-hidden group cursor-pointer"
                                            onClick={() => setLightboxImage(selectedImageUrlInSheet)}
                                        >
                                            <Image src={selectedImageUrlInSheet} alt={hanger.nameKo || '제품 이미지'} fill className="object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                                <ZoomIn className="w-10 h-10 text-white" />
                                            </div>
                                        </motion.div>
                                        {((hanger.gallery_images_data && hanger.gallery_images_data.length > 0) || hanger.image) && (
                                            <ScrollArea className="w-full whitespace-nowrap rounded-md mt-3">
                                                <div className="flex space-x-2 pb-2">
                                                    {hanger.image && (
                                                        <motion.button
                                                            key={`thumb-main-${hanger.id}`}
                                                            className={`relative aspect-square h-20 w-20 rounded overflow-hidden border-2 hover:border-red-500 focus:border-red-500 transition outline-none shadow-md hover:shadow-lg 
                                                                ${selectedImageUrlInSheet === hanger.image ? 'border-red-600 ring-2 ring-red-500 ring-offset-2 ring-offset-gray-800' : 'border-gray-600'}`}
                                                            onClick={() => setSelectedImageUrlInSheet(hanger.image!)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Image src={hanger.image} alt={hanger.nameKo || '대표 이미지'} fill className="object-cover" />
                                                        </motion.button>
                                                    )}
                                                    {hanger.gallery_images_data?.map((img, idx) => (
                                                        <motion.button
                                                            key={img.id || idx}
                                                            className={`relative aspect-square h-20 w-20 rounded overflow-hidden border-2 hover:border-red-500 focus:border-red-500 transition outline-none shadow-md hover:shadow-lg 
                                                                ${selectedImageUrlInSheet === img.src ? 'border-red-600 ring-2 ring-red-500 ring-offset-2 ring-offset-gray-800' : 'border-gray-600'}`}
                                                            onClick={() => setSelectedImageUrlInSheet(img.src)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Image src={img.src} alt={img.alt || `이미지 ${idx + 1}`} fill className="object-cover" />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        )}
                                    </div>
                                ) : <p className="text-center text-gray-500 py-8">표시할 이미지가 없습니다.</p>}
                            </TabsContent>

                            <TabsContent value="documents" className="p-6 outline-none focus:outline-none">
                                {hanger.documents && hanger.documents.length > 0 ? (
                                    <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                                        <h4 className="text-lg font-semibold mb-3 text-purple-400 flex items-center"><FileTextIcon className="w-5 h-5 mr-2" />관련 문서</h4>
                                        <ul className="space-y-2">
                                            {hanger.documents.map(doc => (
                                                <li key={doc.id || doc.nameKo}>
                                                    <Link
                                                        href={doc.path || doc.url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2.5 rounded-md bg-gray-700/30 hover:bg-gray-600/50 transition-colors group"
                                                    >
                                                        <div className="flex items-center min-w-0">
                                                            <FileTextIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-300 transition-colors flex-shrink-0" />
                                                            <span className="text-sm text-gray-200 group-hover:text-white transition-colors truncate">{doc.nameKo || doc.nameEn || '문서 보기'}</span>
                                                            {doc.type && <span className="ml-2 text-xs text-gray-500 bg-gray-600/50 px-1.5 py-0.5 rounded flex-shrink-0">{String(doc.type).toUpperCase()}</span>}
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-red-300 transition-colors flex-shrink-0 ml-2" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : <p className="text-center text-gray-500 py-8">관련 문서가 없습니다.</p>}
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </ScrollArea>
            </Tabs>
            <SheetFooter className="p-6 border-t border-gray-700 sm:justify-start sticky bottom-0 bg-gray-900/95 z-10">
                <SheetClose asChild><Button type="button" variant="outline" className="border-red-500/70 text-red-400 hover:bg-red-700/20 hover:text-red-300 w-full sm:w-auto">닫기</Button></SheetClose>
            </SheetFooter>
            {lightboxImage && (
                <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
                    <DialogContent className="p-0 max-w-4xl max-h-[90vh] bg-black/80 border-none backdrop-blur-sm flex items-center justify-center">
                        <Image src={lightboxImage} alt="확대 이미지" width={1200} height={800} className="object-contain max-w-full max-h-[85vh] rounded-lg" />
                        <DialogClose className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                            <X className="h-5 w-5" />
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

const ProductDetail: React.FC<DescenderHangerSummaryProps> = ({
    productId,
    initialProductName,
    initialDescription,
    mainImage, // 요약 페이지의 대표 배경 이미지 또는 히어로 이미지
    allProducts = [], // page.tsx에서 전달받는 모든 제품 목록
    // approvalNumber, cautions 등 요약 정보에 필요시 추가
}) => {
    const sectionRefs = {
        hero: useRef<HTMLDivElement>(null),
        hangerList: useRef<HTMLDivElement>(null),
        contact: useRef<HTMLDivElement>(null),
    };

    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showNav, setShowNav] = useState(false);

    const currentProductName = initialProductName || "완강기 지지대";
    const currentDescription = initialDescription || "설치 환경과 필요에 맞는 다양한 완강기 지지대를 확인하세요.";

    // console.log 추가
    console.log('[Client State] Initial allProducts prop:', JSON.parse(JSON.stringify(allProducts)));

    const hangerProducts = useMemo(() => {
        const filtered = allProducts.filter(p =>
            p.category === 'descender-hangers' &&
            p.id !== 'descender-hanger-summary' &&
            p.id?.startsWith('G-prodigious_') // 실제 지지대 제품 ID 패턴 확인
        );
        console.log('[Client State] Filtered hangerProducts:', JSON.parse(JSON.stringify(filtered)));
        return filtered;
    }, [allProducts]);

    // 제품 타입 기반 탭 생성 로직
    const productTypes = useMemo(() => {
        const types = new Set<string>();
        console.log('[Client State] hangerProducts for tab generation:', JSON.parse(JSON.stringify(hangerProducts)));
        hangerProducts.forEach(p => {
            const typeSpec = p.specTable?.find(spec => spec.title === '제품타입');
            if (typeSpec && typeSpec.value) {
                types.add(typeSpec.value);
            } else {
                console.warn('[Client State] Product missing typeSpec or value for tab:', p.id, p.specTable);
            }
        });
        const allGeneratedTypes = ['전체', ...Array.from(types)];
        console.log('[Client State] Generated Product Types for Tabs:', allGeneratedTypes);
        return allGeneratedTypes;
    }, [hangerProducts]);

    const [activeProductTypeTab, setActiveProductTypeTab] = useState<string>('전체');

    const filteredHangerProducts = useMemo(() => {
        console.log(`[Client State] Current activeProductTypeTab: ${activeProductTypeTab}`);
        if (activeProductTypeTab === '전체') {
            console.log('[Client State] Displaying All Hangers (filtered):', JSON.parse(JSON.stringify(hangerProducts)));
            return hangerProducts;
        }
        const filteredByType = hangerProducts.filter(p => {
            const typeSpec = p.specTable?.find(spec => spec.title === '제품타입');
            return typeSpec?.value === activeProductTypeTab;
        });
        console.log(`[Client State] Displaying Hangers for Tab "${activeProductTypeTab}" (filtered):`, JSON.parse(JSON.stringify(filteredByType)));
        return filteredByType;
    }, [hangerProducts, activeProductTypeTab]);

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

    const cardListVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // 더 빠른 stagger
                delayChildren: 0.2, // 약간의 딜레이 후 시작
            },
        },
    };

    const cardItemVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 14 },
        },
    };

    return (
        <div className="relative min-h-screen text-white">
            {/* 페이지 전체 배경 */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={"/images/products/Descending-Life-line-Hanger/main/visual.jpg"} // 요청된 히어로 배경
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
                                        {id === 'hangerList' && <><ListChecks className="h-3 w-3 mr-1" />지지대 목록</>}
                                        {id === 'contact' && <><MessageCircle className="h-3 w-3 mr-1" />문의하기</>}
                                    </button>
                                )
                            ))}
                        </div>
                        <Link
                            href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId || 'descender-hanger-summary')}`}
                            className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium text-xs transition-all duration-300 shadow-md"
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />제품 문의
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
                                {currentDescription}
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <button
                        type="button"
                        onClick={() => { setTimeout(() => scrollToSection('hangerList'), 10); }}
                        className="absolute left-1/2 bottom-36 z-30 -translate-x-1/2 flex flex-col items-center group focus:outline-none"
                        aria-label="지지대 목록 보기"
                    >
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/40 border border-white/20 shadow-lg group-hover:bg-black/60 transition-all animate-bounce-slow">
                            <ChevronDown className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                        </span>
                    </button>
                </section>

                {/* 히어로 이후 모든 콘텐츠 섹션을 감싸는 단일 배경 컨테이너 */}
                <div className="relative bg-gradient-to-b from-black/[.70] via-black/50 to-transparent">
                    {/* 완강기 지지대 목록 섹션 - 탭 UI 추가 */}
                    <section
                        ref={sectionRefs.hangerList}
                        className="min-h-screen flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    완강기 지지대 라인업
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <div className="max-w-3xl mx-auto mb-10">
                                    <Image
                                        src="/images/products/Descending-Life-line-Hanger/thumbnail.jpg"
                                        alt="완강기 지지대 대표 이미지"
                                        width={800}
                                        height={450}
                                        className="rounded-xl shadow-2xl object-cover mx-auto border border-white/10"
                                    />
                                </div>
                                <p className="text-gray-300 max-w-2xl mx-auto text-base lg:text-lg mb-10">
                                    다양한 설치 환경에 최적화된 완강기 지지대 모델들을 소개합니다. 각 모델의 상세 사양을 확인하고 현장에 가장 적합한 제품을 선택하세요.
                                </p>
                                {/* 제품 타입 탭 버튼들 - 스타일 미세 조정 */}
                                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
                                    {productTypes.map(type => (
                                        <Button
                                            key={type}
                                            variant={activeProductTypeTab === type ? 'default' : 'outline'}
                                            onClick={() => setActiveProductTypeTab(type)}
                                            className={cn(
                                                "min-w-[90px] md:min-w-[110px] max-w-[200px] rounded-lg transition-all duration-300 py-2 md:py-2.5 px-3 md:px-4 text-xs md:text-sm font-medium truncate", // max-w, truncate 추가, 패딩 미세조정
                                                activeProductTypeTab === type
                                                    ? 'bg-red-600 hover:bg-red-700 border-red-500/50 text-white shadow-xl hover:shadow-red-400/40'
                                                    : 'border-white/30 text-gray-300 hover:text-white hover:border-white/50 hover:bg-white/10 backdrop-blur-sm'
                                            )}
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* 제품 카드 목록에 AnimatePresence 및 motion.div 적용 */}
                            <AnimatePresence mode="wait">
                                {filteredHangerProducts.length > 0 ? (
                                    <motion.div
                                        key={activeProductTypeTab}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                                        variants={cardListVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        {filteredHangerProducts.map((hanger, index) => {
                                            const modelSpec = hanger.specTable?.find(s => s.title === '모델명')?.value;
                                            const typeSpec = hanger.specTable?.find(s => s.title === '제품타입')?.value;
                                            const designLoadSpec = hanger.specTable?.find(s => s.title === '설계하중')?.value;
                                            const allowableLoadSpec = hanger.specTable?.find(s => s.title === '허용하중')?.value;
                                            const approvalNoFromDesc = extractApprovalNumber(hanger.descriptionKo);

                                            return (
                                                <Sheet key={hanger.id || index}>
                                                    <motion.div
                                                        variants={cardItemVariants}
                                                        className="h-full"
                                                    >
                                                        <SheetTrigger asChild>
                                                            <div className="group relative flex flex-col h-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-red-500/30 hover:border-red-400/50 cursor-pointer active:scale-95">
                                                                <div className="relative aspect-video w-full overflow-hidden bg-gray-800/30">
                                                                    <Image
                                                                        src={hanger.image || "/images/placeholder.png"}
                                                                        alt={hanger.nameKo || '완강기 지지대'}
                                                                        fill
                                                                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                                                                    />
                                                                    <div className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                        <ZoomIn className="w-4 h-4 text-white/80" />
                                                                    </div>
                                                                </div>
                                                                <div className="p-4 flex flex-col flex-grow bg-black/40">
                                                                    <h3 className="text-white font-semibold text-md lg:text-lg mb-2 font-serif truncate group-hover:text-red-300 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>{hanger.nameKo || hanger.nameEn}</h3>
                                                                    <div className="space-y-1 text-xs mb-3 text-gray-400 min-h-[72px]">
                                                                        {modelSpec && <p className="flex items-center"><Package className="w-3.5 h-3.5 mr-1.5 text-sky-500 flex-shrink-0" />모델: {modelSpec}</p>}
                                                                        {typeSpec && <p className="flex items-center"><Users className="w-3.5 h-3.5 mr-1.5 text-sky-500 flex-shrink-0" />타입: {typeSpec}</p>}
                                                                        {designLoadSpec && <p className="flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-orange-400 flex-shrink-0" />설계: {designLoadSpec}</p>}
                                                                        {allowableLoadSpec && <p className="flex items-center"><Shield className="w-3.5 h-3.5 mr-1.5 text-amber-500 flex-shrink-0" />허용: {allowableLoadSpec}</p>}
                                                                        {approvalNoFromDesc && (
                                                                            <p className="flex items-center text-amber-400"><CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-500 flex-shrink-0" />승인: {approvalNoFromDesc}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SheetTrigger>
                                                        <SheetContent side="right" className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-gray-900/95 text-white border-l border-gray-700 backdrop-blur-md p-0 flex flex-col">
                                                            <HangerSheetContent hanger={hanger} />
                                                        </SheetContent>
                                                    </motion.div>
                                                </Sheet>
                                            );
                                        })}
                                    </motion.div>
                                ) : (
                                    <motion.div key="no-products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
                                        <ListChecks className="w-16 h-16 mx-auto mb-6 text-gray-600 opacity-60" />
                                        <p className="text-gray-400 text-xl lg:text-2xl">선택하신 타입의 지지대 제품이 없습니다.</p>
                                        <p className="text-gray-500 mt-2 text-sm lg:text-base">다른 제품 타입을 확인해주세요.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* 문의 섹션 (CTA + 에어슬라이드의 Documents 섹션 스타일 일부 차용) */}
                    <section
                        ref={sectionRefs.contact}
                        className="min-h-[70vh] flex flex-col justify-center relative py-20"
                    >
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    제품 문의 및 기술 지원
                                </h2>
                                <div className="w-24 h-1 mx-auto bg-white/50 rounded-full mb-6 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                <p className="text-gray-400 max-w-2xl mx-auto text-base lg:text-lg">
                                    완강기 지지대 선택에 도움이 필요하시거나 기술적인 문의사항이 있으시면 언제든지 연락 주십시오. 전문 상담원이 신속하게 답변해 드립니다.
                                </p>
                            </div>

                            <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#1f1f22]/80 to-black/90 backdrop-blur-lg border border-white/15 rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden group transform hover:scale-105 transition-transform duration-300">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-gradient-to-tl from-white/10 via-white/5 to-transparent rounded-full pointer-events-none transform transition-transform duration-700 group-hover:scale-125 opacity-50"></div>
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse"></div>
                                <div className="relative z-10 text-center">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
                                        지금 바로 문의하세요!
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href={`/support/contact?product_category=descender-hangers`}
                                            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-red-500/50 text-white text-base font-semibold rounded-lg transition-all duration-300 shadow-xl hover:shadow-red-500/40 transform hover:-translate-y-0.5"
                                        >
                                            <MessageCircle className="mr-2.5 h-5 w-5" />
                                            온라인 문의하기
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="px-8 py-3.5 border-white/30 text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm rounded-lg transition-all duration-300 text-base font-medium transform hover:-translate-y-0.5"
                                            onClick={() => window.history.back()} // 또는 특정 카테고리 페이지로 이동
                                        >
                                            <ArrowLeft className="mr-2.5 h-5 w-5" />
                                            다른 제품 보기
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-8">
                                        (주)서한에프앤씨는 항상 고객님의 안전을 최우선으로 생각합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* AI 검색 최적화용 JSON-LD 데이터 섹션 (ProductGroup 또는 CollectionPage 고려) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CollectionPage", // 또는 ProductGroup
                            "name": initialProductName || "완강기 지지대",
                            "description": initialDescription || "다양한 완강기 지지대 제품들을 확인해보세요.",
                            "image": mainImage ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${mainImage}` : undefined,
                            "url": typeof window !== 'undefined' ? window.location.href : undefined,
                            "mainEntity": {
                                "@type": "ItemList",
                                "itemListElement": filteredHangerProducts.map((hanger, index) => ({
                                    "@type": "Product",
                                    "position": index + 1,
                                    "name": hanger.nameKo || hanger.nameEn,
                                    "image": hanger.image ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${hanger.image}` : undefined,
                                    "description": hanger.descriptionKo || hanger.descriptionEn,
                                    "sku": hanger.id,
                                    "brand": { "@type": "Brand", "name": "서한에프앤씨" },
                                }))
                            }
                        })
                    }}
                />
            </div>
        </div>
    );
};

export default ProductDetail; 