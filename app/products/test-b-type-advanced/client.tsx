'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Package, Play, ArrowLeft, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { cn, getImagePath } from '@/lib/utils';
import dynamic from 'next/dynamic';

const SimpleModelViewer = dynamic(() => import('@/components/products/SimpleModelViewer'), { ssr: false });

interface ProductDetailClientProps {
    product: Product;
}

const ProductDetail: React.FC<ProductDetailClientProps> = ({ product }) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const [showNav, setShowNav] = useState(false);

    const currentProductName = product.nameKo || product.name || "B타입 고급 제품";
    const currentDescription = product.descriptionKo || product.description || "A타입 수준 디자인과 3D 모델링이 통합된 고급 B타입 제품입니다.";

    // 3D 모델 관련 설정 (B타입 고유 기능)
    const model3dPath = product.model3D?.glbFile || `/models/products/${product.id}/${product.id}.glb`;
    const visualImage = product.pageBackgroundImage || `/images/products/${product.id}/main/visual.jpg`;

    // 인증 정보
    const certifications = product.certifications || [];
    const certificationSubtitle = certifications.map((c: any) => c.description).join(' / ');
    const currentApprovalNumber = certificationSubtitle || "테스트-승인-2024-001";

    // A타입 수준의 스크롤 네비게이션 효과
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            if (scrollPosition > window.innerHeight * 0.6) {
                setShowNav(true);
            } else {
                setShowNav(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
        if (sectionRef.current) {
            const elementPosition = sectionRef.current.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-screen text-white">
            {/* A타입 수준의 전체화면 배경 */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={getImagePath('/images/placeholder.jpg')}
                    alt={`${currentProductName} 비주얼 배경`}
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
                            <button onClick={() => scrollToSection(heroRef)} className="px-3 py-1.5 rounded-full transition-all flex items-center text-gray-400 hover:text-white hover:bg-gray-800/60">
                                <Package className="h-3 w-3 mr-1" />히어로
                            </button>
                            <button onClick={() => scrollToSection(successRef)} className="px-3 py-1.5 rounded-full transition-all flex items-center text-gray-400 hover:text-white hover:bg-gray-800/60">
                                <CheckCircle2 className="h-3 w-3 mr-1" />성공 확인
                            </button>
                        </div>
                        <Link
                            href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(product.id)}`}
                            className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium text-xs transition-all duration-300 shadow-md"
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />문의
                        </Link>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                {/* 히어로 섹션 (A타입 스타일) */}
                <section ref={heroRef} className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
                    <div className="max-w-7xl w-full mx-auto px-6 md:px-8 lg:px-12 pt-24 flex flex-col items-center justify-center h-full relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif tracking-tight text-white drop-shadow-lg">
                                <span className="block relative">{currentProductName}
                                    <div className="h-1 w-32 mt-2 bg-white/40 rounded-full mx-auto"></div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-white/0 via-white/80 to-white/0 animate-pulse" style={{ animationDuration: '3s' }}></div>
                                </span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-2 leading-relaxed max-w-3xl mx-auto">{currentDescription}</p>
                            <p className="text-sm text-amber-400 font-semibold">{currentApprovalNumber}</p>
                        </div>

                        {/* 3D 모델 뷰어 미리보기 (B타입 고유) */}
                        <div className="w-full max-w-2xl h-64 bg-black/60 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden mb-8">
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Play className="w-16 h-16 text-white/60 mx-auto mb-4" />
                                    <p className="text-white/80">3D 모델 뷰어</p>
                                    <p className="text-sm text-white/60">B타입 고유 기능</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* A타입 스타일 스크롤 안내 */}
                    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)' }} />
                    <button type="button" onClick={() => scrollToSection(successRef)} className="absolute left-1/2 bottom-36 z-30 -translate-x-1/2 flex flex-col items-center group focus:outline-none" aria-label="성공 섹션으로 스크롤">
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-black/40 border border-white/20 shadow-lg group-hover:bg-black/60 transition-all animate-bounce-slow">
                            <ChevronDown className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-200" />
                        </span>
                    </button>
                </section>

                {/* 성공 확인 섹션 */}
                <section ref={successRef} className="min-h-screen flex flex-col justify-center items-center relative py-20">
                    <div className="relative z-10 text-center">
                        <div className="mb-8">
                            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
                            <h2 className="text-4xl font-bold text-white mb-4">🎉 B타입 고급 템플릿 성공!</h2>
                            <p className="text-xl text-gray-300 mb-2">A타입 수준의 디자인 + B타입 3D 모델링 통합 완료</p>
                            <p className="text-green-400 font-semibold">✅ 스크롤 네비게이션, 전체화면 배경, 고급 애니메이션 모두 적용됨</p>
                        </div>

                        <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl p-8 max-w-2xl mx-auto mb-8">
                            <h3 className="text-2xl font-bold text-white mb-6">통합된 기능들</h3>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="flex items-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span>A타입 디자인 시스템</span>
                                </div>
                                <div className="flex items-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span>B타입 3D 모델링</span>
                                </div>
                                <div className="flex items-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span>스크롤 기반 네비게이션</span>
                                </div>
                                <div className="flex items-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span>고급 갤러리 시스템</span>
                                </div>
                                <div className="flex items-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span>전체화면 배경</span>
                                </div>
                                <div className="flex items-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    <span>섹션별 애니메이션</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-x-4">
                            <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-md transition-all duration-300 shadow-lg">
                                <Package className="mr-2 h-5 w-5" />
                                모든 제품 보기
                            </Link>
                            <button onClick={() => scrollToSection(heroRef)} className="inline-flex items-center px-6 py-3 border border-white/30 text-white hover:bg-white/10 rounded-md transition-all duration-300">
                                <Play className="mr-2 h-5 w-5" />
                                다시 시작
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail; 