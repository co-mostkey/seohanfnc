"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Building, Users, ArrowRight } from 'lucide-react'
import NoticeBox from './NoticeBox'
import CertPatentBox from './CertPatentBox'
import DeliveryBox from './DeliveryBox'
import Image from 'next/image'
import { type CompanyInfo } from '@/types/company';
import { type DeliveryRecord } from '@/types/promotion';

// Re-introduce basePath for explicit path construction
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Props 타입 정의
interface MainTitleBoxProps {
  wrapperClassName?: string;
  companyData?: CompanyInfo | null;
  isLoading?: boolean;
  playerVideoUrls?: string[] | null;
  deliveryRecords?: DeliveryRecord[] | null;
  deliveryBoxTitle?: string;
  isLoadingPromotions?: boolean;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export default function MainTitleBox({
  wrapperClassName,
  companyData,
  isLoading,
  playerVideoUrls,
  deliveryRecords,
  deliveryBoxTitle,
  isLoadingPromotions,
  showButton,
  buttonText,
  buttonLink
}: MainTitleBoxProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showProductLink, setShowProductLink] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      setCurrentVideoIndex(0);
      setShowProductLink(false);
    }
  }, [playerVideoUrls, isMounted]);

  const handleVideoEnd = () => {
    if (!isMounted) return;

    if (playerVideoUrls && playerVideoUrls.length > 0) {
      const nextIndex = currentVideoIndex + 1;
      if (nextIndex < playerVideoUrls.length) {
        setCurrentVideoIndex(nextIndex);
        setShowProductLink(false);
      } else {
        setShowProductLink(!!showButton);
      }
    } else {
      setShowProductLink(!!showButton);
    }
  };

  let currentVideoSrc: string | undefined = undefined;
  if (playerVideoUrls && playerVideoUrls.length > 0 && currentVideoIndex < playerVideoUrls.length) {
    const videoPath = playerVideoUrls[currentVideoIndex];
    currentVideoSrc = videoPath.startsWith('http') ? videoPath : `${basePath}${videoPath}`;
  } else if (!playerVideoUrls || playerVideoUrls.length === 0) {
    currentVideoSrc = `${basePath}/videos/default_small_promo.mp4`;
  }

  const messageBoxWrapperClass = "w-full h-full flex items-center justify-center p-4 bg-black/30 backdrop-blur-md rounded-xl shadow-lg border border-white/10";

  const motionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div
      className={wrapperClassName ?? "flex flex-col w-full relative z-10"}
      style={{
        // boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)', // 제거됨
      }}
    >
      <div className="w-full">
        <div className="py-2 h-auto w-full flex flex-col gap-3">
          <div className="flex flex-col md:flex-row w-full gap-3 relative z-[2] flex-grow px-4">
            <div className="flex flex-col w-full md:w-1/3 md:pl-0 gap-2 relative z-20">
              <DeliveryBox
                wrapperClassName="w-full h-40 md:h-60 bg-black/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10"
                deliveryData={deliveryRecords ?? null}
                boxTitle={deliveryBoxTitle}
                isLoading={isLoadingPromotions ?? true}
              />
              <div className="flex w-full h-40 md:h-60 gap-2">
                <div className="relative w-1/2 bg-black/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10 aspect-video flex items-center justify-center">
                  {isLoadingPromotions && (!playerVideoUrls || playerVideoUrls.length === 0) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-gray-400">비디오 로딩 중...</p>
                    </div>
                  )}
                  {(!isLoadingPromotions || (playerVideoUrls && playerVideoUrls.length > 0)) && currentVideoSrc && (
                    <video
                      ref={videoRef}
                      key={currentVideoSrc}
                      src={currentVideoSrc}
                      autoPlay
                      muted
                      playsInline
                      onEnded={handleVideoEnd}
                      className={`w-full h-full object-contain transition-opacity duration-500 ${showProductLink ? 'opacity-70' : 'opacity-100'}`}
                    />
                  )}
                  {showProductLink && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center p-2 z-10"
                    >
                      <Button asChild className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                        <Link href={buttonLink || `/products`} >
                          {buttonText || '제품 보러가기'}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
                <NoticeBox wrapperClassName="w-1/2 h-full bg-black/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10" />
              </div>
              <div className="w-full h-40 md:h-60 relative">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading-cert"
                      className={messageBoxWrapperClass}
                      variants={motionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                      <p className="text-gray-400 text-sm">인증/특허 정보 로딩 중...</p>
                    </motion.div>
                  ) : (companyData?.awardsAndCertifications && companyData.awardsAndCertifications.length > 0) ? (
                    <motion.div
                      key="cert-box-content"
                      variants={motionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                      <CertPatentBox
                        awardsData={companyData.awardsAndCertifications}
                        isLoading={false}
                        wrapperClassName="w-full h-full"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-cert-data"
                      className={messageBoxWrapperClass}
                      variants={motionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                      <p className="text-gray-400 text-sm">표시할 인증/특허 정보가 없습니다.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="order-first md:order-none flex-1 flex flex-col justify-center md:justify-end items-center md:items-end space-y-1 md:space-y-2 md:pb-12 pb-4 relative z-[2]">
              <div
                className="absolute inset-0 z-[0] pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 70%)' }}
              />
              <div className="space-y-1 mb-1 md:mb-2 relative z-[2]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-white text-xs">
                  <span className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
                  <span>대한민국 소방 설비 전문기업</span>
                </div>
              </div>

              <h1 className="text-white text-center md:text-right leading-tight md:leading-none drop-shadow-md tracking-tight md:tracking-normal mt-1 md:mt-3 relative z-[2]">
                <span className="inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-3">
                  안전한 세상을 만드는
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                  (주)서한에프앤씨
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white text-center md:text-right mt-2 md:mt-4 mb-2 drop-shadow-md max-w-full break-words md:whitespace-nowrap md:overflow-visible relative z-[2]">
                1992년 설립 이래, 최고의 기술력과 품질로 고객의 안전을 책임지는 소방안전 전문기업입니다.
              </p>
              <div className="flex justify-center md:justify-end items-center gap-2 sm:gap-4 pt-1 relative z-[2]">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                  <span className="text-xs sm:text-sm text-gray-300">설립 1992년</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                  <span className="text-xs sm:text-sm text-gray-300">인증기업</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                  <span className="text-xs sm:text-sm text-gray-300">전문인력 보유</span>
                </div>
              </div>
              <hr className="border-white/20 mt-4 w-full max-w-xs md:hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 