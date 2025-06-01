"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Award, Clock, ChevronUp, Users, Building, Briefcase, Calendar, TrendingUp, Map, Truck, Medal, FileText, Layers, LogIn } from "lucide-react"
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import { GlobalNav } from '@/components/ui/GlobalNav';
import MainTitleBox from "@/components/hero/MainTitleBox"
import NoticeBox from "@/components/hero/NoticeBox"
import CertPatentBox from "@/components/hero/CertPatentBox"
import DeliveryBox from "@/components/hero/DeliveryBox"
import ProductsBox from "@/components/hero/ProductsBox"
import { type CompanyInfo } from '@/types/company';
import { type PromotionItem } from '@/types/promotion';
import { type DeliveryRecord } from '@/types/promotion';

interface HomeClientProps {
    initialCompanyData: CompanyInfo | null;
    initialPromotionsData: PromotionItem[];
    initialDeliveryData: DeliveryRecord[];
}

export default function HomeClient({
    initialCompanyData,
    initialPromotionsData,
    initialDeliveryData
}: HomeClientProps) {
    const [companyData, setCompanyData] = useState<CompanyInfo | null>(initialCompanyData);
    const [promotionsData, setPromotionsData] = useState<PromotionItem[]>(initialPromotionsData);
    const [deliveryData, setDeliveryData] = useState<DeliveryRecord[]>(initialDeliveryData);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoadingDelivery, setIsLoadingDelivery] = useState(true);
    const { scrollY } = useScroll();

    // 컴포넌트가 마운트되었는지 확인
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 스크롤 관련 효과
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            setIsScrolled(scrolled);
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 데이터 페칭
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 회사 정보 가져오기
                if (!companyData) {
                    const companyResponse = await fetch('/api/admin/company');
                    if (companyResponse.ok) {
                        const company = await companyResponse.json();
                        setCompanyData(company);
                    }
                }

                // 프로모션 데이터 가져오기
                if (promotionsData.length === 0) {
                    const promotionsResponse = await fetch('/api/promotions');
                    if (promotionsResponse.ok) {
                        const promotions = await promotionsResponse.json();
                        setPromotionsData(promotions);
                    }
                }

                // 배송 데이터 가져오기
                if (deliveryData.length === 0) {
                    try {
                        setIsLoadingDelivery(true);
                        const deliveryResponse = await fetch('/api/promotions?type=deliveryRecordList');
                        if (deliveryResponse.ok) {
                            const deliveryPromotion = await deliveryResponse.json();
                            if (deliveryPromotion.length > 0 && deliveryPromotion[0].content) {
                                setDeliveryData(deliveryPromotion[0].content);
                            }
                        }
                    } catch (error) {
                        console.error('배송 데이터 가져오기 실패:', error);
                    } finally {
                        setIsLoadingDelivery(false);
                    }
                } else {
                    setIsLoadingDelivery(false);
                }
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };

        if (isMounted) {
            fetchData();
        }
    }, [isMounted, companyData, promotionsData, deliveryData]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 서버 사이드에서는 로딩 상태를 보여줌
    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <GlobalNav />

            {/* 메인 컨텐츠 */}
            <main className="relative">
                {/* 히어로 섹션 */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    {/* 배경 효과 */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                    서한에프앤씨
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300">
                                1992년부터 시작된 신뢰, 최고의 기술력과 전문성으로 고객의 안전을 책임지는 화재안전 전문기업입니다
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg h-auto">
                                    <Link href="/products" className="flex items-center gap-2">
                                        제품 보기 <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="border-gray-300 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg h-auto">
                                    <Link href="/about">회사 소개</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* 스크롤 다운 인디케이터 */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                        </div>
                    </motion.div>
                </section>

                {/* 주요 섹션들 */}
                <div className="relative bg-gray-50 dark:bg-gray-900">
                    {/* 주요 메인 타이틀 박스 */}
                    <MainTitleBox />

                    {/* 공지사항 */}
                    <NoticeBox />

                    {/* 인증 및 특허 */}
                    <CertPatentBox />

                    {/* 배송 정보 */}
                    <DeliveryBox
                        deliveryData={deliveryData}
                        isLoading={isLoadingDelivery}
                    />

                    {/* 제품 소개 */}
                    <ProductsBox />

                    {/* 주요 통계 섹션 */}
                    <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="text-4xl font-bold mb-2">30+</div>
                                    <div className="text-lg">년의 경험</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="text-4xl font-bold mb-2">1000+</div>
                                    <div className="text-lg">설치 사례</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="text-4xl font-bold mb-2">50+</div>
                                    <div className="text-lg">제품 라인업</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="text-4xl font-bold mb-2">24/7</div>
                                    <div className="text-lg">고객 지원</div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* 스크롤 톱 버튼 */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors"
                    >
                        <ChevronUp className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 모바일 하단 네비게이션 */}
            <MobileBottomNav />
        </div>
    );
} 