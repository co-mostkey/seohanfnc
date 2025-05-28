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
import CompanyIntro from "@/components/hero/CompanyIntro"
import { SectionWrapper } from "@/components/ui/SectionWrapper"
import HeroOverlay from '@/components/hero/HeroOverlay'
import { type CompanyInfo } from '@/types/company';
import { type PromotionItem, type DeliveryRecord } from '@/types/promotion';
import ErrorBoundary from '@/components/error/ErrorBoundary'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 프로젝트 참조 컴포넌트는 DeliveryBox 내부로 옮기거나, DeliveryBox가 ProjectReference를 직접 사용하도록 유지합니다.
// 여기서는 DeliveryBox가 ProjectReference를 내부적으로 사용한다고 가정하고 ProjectReference 정의는 DeliveryBox.tsx에 있다고 간주합니다.

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'products' | 'company' | 'support' | 'promo' | 'cert'>('home');
  const heroRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  // scrollRef, isPaused, scrollHeight, containerHeight 는 DeliveryBox 내부에서 관리되므로 여기서는 제거합니다.
  const certScrollRef = useRef<HTMLDivElement>(null);
  const [isCertPaused, setIsCertPaused] = useState(false);
  const [isVideoBg, setIsVideoBg] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(true);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [deliveryRecordsData, setDeliveryRecordsData] = useState<DeliveryRecord[] | null>(null);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchCompanyData = async (retryCount = 0) => {
      const maxRetries = 3;
      setIsLoadingCompanyData(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch('/api/admin/company', {
          signal: controller.signal,
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          const errorText = await response.text();
          console.warn('Company API response not ok:', response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data: CompanyInfo = await response.json();
        setCompanyData(data);
        console.log('Company data loaded successfully');
      } catch (error) {
        console.warn(`Error fetching company data (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
        if (error instanceof Error) {
          if ((error as Error).name === 'AbortError') {
            console.warn('Company data fetch timed out');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
            console.warn('Network error: Development server may not be running');
            if (retryCount < maxRetries) {
              console.log(`Retrying in ${(retryCount + 1) * 2} seconds...`);
              setTimeout(() => { fetchCompanyData(retryCount + 1); }, (retryCount + 1) * 2000);
              return;
            }
          }
        }
        setCompanyData(null);
      } finally {
        if (retryCount === 0) {
          setIsLoadingCompanyData(false);
        }
      }
    };
    setTimeout(() => { fetchCompanyData(); }, 1000);

    const fetchPromotionsData = async () => {
      setIsLoadingPromotions(true);
      try {
        const response = await fetch('/api/promotions', { cache: 'no-store' });
        if (!response.ok) {
          console.warn('Promotions API response not ok:', response.status);
          throw new Error('Failed to fetch promotions data');
        }
        const promotions: PromotionItem[] = await response.json();
        const mainVideo = promotions.find(p => p.type === 'mainHeroVideo' && p.isVisible);
        if (mainVideo && mainVideo.videoUrl) {
          setHeroVideoUrl(mainVideo.videoUrl);
        }
        const deliveryData = promotions.find(p => p.type === 'deliveryRecordList' && p.isVisible);
        if (deliveryData && deliveryData.records) {
          setDeliveryRecordsData(deliveryData.records);
        }
        console.log('Promotions data for main page loaded successfully');
      } catch (error) {
        console.warn('Error fetching promotions data for main page:', error);
      } finally {
        setIsLoadingPromotions(false);
      }
    };
    setTimeout(() => { fetchPromotionsData(); }, 1200);

  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIsVideoBg(prev => !prev), 5000);
    return () => clearInterval(interval);
  }, []);

  // CertScrollRef 관련 useEffect는 CertPatentBox 내부 또는 해당 컴포넌트와 함께 관리되는 것이 적절할 수 있습니다.
  // 여기서는 우선 유지하되, 추후 CertPatentBox 구현 시 이동을 고려합니다.
  useEffect(() => {
    if (!certScrollRef.current) return;
    const scrollContainer = certScrollRef.current;
    let animationId: number;
    let startTime: number | null = null;
    let pausedAt: number = 0;
    let scrollPosition = 0;
    const scrollSpeed = 0.009;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (isCertPaused) {
        pausedAt = scrollPosition;
        animationId = requestAnimationFrame(animate);
        return;
      }
      const totalWidth = scrollContainer.scrollWidth;
      const visibleWidth = scrollContainer.clientWidth;
      if (totalWidth > visibleWidth) {
        scrollPosition = pausedAt + (timestamp - startTime) * scrollSpeed;
        if (scrollPosition >= (totalWidth - visibleWidth)) {
          scrollPosition = 0;
          startTime = timestamp;
          pausedAt = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isCertPaused, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main
      className="relative ios-viewport-height w-full overflow-hidden bg-black text-white flex flex-col ios-scroll-container"
    >
      <GlobalNav variant="mainSticky" />
      <section ref={heroRef} className={cn(
        "relative flex-grow flex flex-col items-center justify-center isolate ios-scroll-fix",
        "-mt-[4rem]",
        "pt-[calc(4rem + var(--safe-area-inset-top))]",
        "pb-[var(--safe-area-inset-bottom)]"
      )}>
        <motion.div
          key="bg-image-crossfade"
          className="absolute inset-0 z-[-3]"
          initial={false}
          animate={{ opacity: isVideoBg ? 0 : 1 }}
          transition={{ duration: 5.0, ease: "linear" }}
        >
          <Image
            src={`${basePath}/hero/hero_01.png`}
            alt="Hero Background"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            style={{ objectPosition: 'center center', transform: 'translateZ(0)' }}
          />
        </motion.div>

        <motion.video
          key="bg-video-crossfade"
          src={heroVideoUrl ? `${basePath}${heroVideoUrl}` : `${basePath}/hero/hero_mv.mp4`}
          muted
          autoPlay
          playsInline
          loop
          webkit-playsinline="true"
          className="absolute inset-0 w-full h-full object-cover z-[-2]"
          initial={false}
          animate={{ opacity: isVideoBg ? 1 : 0 }}
          transition={{ duration: 5.0, ease: "linear" }}
          style={{ objectPosition: 'center center', transform: 'translateZ(0)' }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/25 to-black/50 z-[10]" />

        <motion.div
          ref={perspectiveRef}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
          }}
          className={cn(
            "absolute inset-0 z-[35] flex flex-col justify-between preserve-3d",
            "p-4 md:p-8",
            "safe-area-padding"
          )}
          style={{
            width: '100%',
            maxWidth: '1920px',
            height: '100%',
            margin: '0 auto',
            left: '0',
            right: '0',
            paddingTop: 'max(60px, calc(60px + var(--safe-area-inset-top)))',
            paddingBottom: 'calc(var(--footer-height,60px) + var(--cert-box-spacing,1rem) + var(--safe-area-inset-bottom))',
            paddingLeft: 'max(1rem, var(--safe-area-inset-left))',
            paddingRight: 'max(1rem, var(--safe-area-inset-right))'
          }}
        >
          <div className="flex-grow flex items-center justify-center">
            {activeSection === 'home' && <MainTitleBox companyData={companyData} isLoading={isLoadingCompanyData} />}
            {activeSection === 'products' && <ProductsBox />}
            {activeSection === 'company' && <CompanyIntro companyData={companyData} isLoading={isLoadingCompanyData} />}
            {activeSection === 'support' && (
              <ErrorBoundary fallback={<div className="flex items-center justify-center min-h-[220px] w-full max-w-4xl mx-auto text-white bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 shadow-lg"><p className="text-gray-400 text-sm">공지사항을 불러올 수 없습니다.</p></div>}>
                <NoticeBox />
              </ErrorBoundary>
            )}
            {/* DeliveryBox에 props 전달 */}
            {activeSection === 'promo' && <DeliveryBox deliveryData={deliveryRecordsData} isLoading={isLoadingPromotions} />}

            {/* CertPatentBox 관련 로직 (추후 CertPatentBox 구현 시 데이터 전달 방식 확정) */}
            {/* {activeSection === 'cert' && mounted && (
              isLoadingCompanyData || isLoadingPromotions ? (
                <div className="flex items-center justify-center min-h-[220px] w-full max-w-4xl mx-auto text-white bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 shadow-lg">
                  <p className="text-gray-400 text-sm">정보 로딩 중...</p>
                </div>
              ) : companyData && companyData.awardsAndCertifications && companyData.awardsAndCertifications.length > 0 ? (
                <CertPatentBox
                  awardsData={companyData.awardsAndCertifications} // companyData에서 awards 정보 전달
                  isLoading={false}
                  wrapperClassName="w-full max-w-4xl mx-auto h-auto min-h-[220px]"
                  certScrollRef={certScrollRef} // ref 전달
                  setIsCertPaused={setIsCertPaused} // setter 함수 전달
                />
              ) : (
                <div className="flex items-center justify-center min-h-[220px] w-full max-w-4xl mx-auto text-white bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 shadow-lg">
                  <p className="text-gray-400 text-sm">표시할 인증/특허 정보가 없습니다.</p>
                </div>
              )
            )} */}
          </div>
        </motion.div>

        <HeroOverlay />

        <div className="absolute bottom-0 left-0 w-full z-50" style={{ height: 'var(--footer-height, 60px)' }}>
          <footer className="w-full h-full bg-black/30 backdrop-blur-sm border-t border-white/10 py-3 z-50 flex items-center">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
              <div className="flex justify-center md:justify-start items-center space-x-4 text-xs text-gray-300 mb-2 md:mb-0 order-2 md:order-1">
                <Link href="/intranet" className="flex items-center hover:text-white transition-colors">
                  <Layers className="h-3 w-3 mr-1" />
                  <span>인트라넷</span>
                </Link>
                <span className="text-gray-500">|</span>
                <Link href="/login" className="flex items-center hover:text-white transition-colors">
                  <LogIn className="h-3 w-3 mr-1" />
                  <span>회원 로그인</span>
                </Link>
              </div>
              <div className="text-center text-xs text-gray-300 order-1 md:order-2">
                &copy; {new Date().getFullYear()} 서한에프앤씨
              </div>
            </div>
          </footer>
        </div>
      </section>
      <MobileBottomNav />
    </main>
  );
}
