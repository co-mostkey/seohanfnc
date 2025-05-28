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

// Re-introduce basePath for explicit path construction
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Props 타입 정의
interface MainTitleBoxProps {
  wrapperClassName?: string;
  companyData?: CompanyInfo | null;
  isLoading?: boolean;
}

export default function MainTitleBox({ wrapperClassName, companyData, isLoading }: MainTitleBoxProps) {
  // Restore state variables if they were commented out
  const [firstVideoEnded, setFirstVideoEnded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 컴포넌트 언마운트 시 상태 업데이트
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Restore video end handler
  const handleVideoEnd = () => {
    if (!isMounted) return;

    if (!firstVideoEnded) {
      setFirstVideoEnded(true);
    } else {
      setVideoEnded(true);
    }
  };

  // Restore effect for switching video source, ensuring basePath is used
  useEffect(() => {
    if (!isMounted || !firstVideoEnded) return;

    const videoElement = videoRef.current;
    if (videoElement && videoElement.parentNode) {
      try {
        videoElement.src = `${basePath}/videos/hero01.mp4`;
        videoElement.load();

        // DOM에서 제거되지 않았는지 다시 한번 확인
        if (videoElement.parentNode && isMounted) {
          videoElement.play().catch(error => {
            // 비디오가 DOM에서 제거되었거나 재생할 수 없는 경우 무시
            if ((error as Error).name !== 'AbortError' && (error as Error).name !== 'NotAllowedError') {
              console.error("Second video autoplay failed:", error);
            }
          });
        }
      } catch (error) {
        // DOM 조작 중 오류 발생 시 무시
        console.warn("Video element manipulation failed:", error);
      }
    }
  }, [firstVideoEnded, isMounted]);

  // Add basePath back to the initial video source
  const initialVideoSrc = `${basePath}/videos/hero00.mp4`;

  // CertPatentBox를 렌더링할 때 사용할 wrapper 클래스 (로딩/에러 메시지용)
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
            {/* Left Column: Delivery, Video, Notice, CertPatent - Increased z-index */}
            <div className="flex flex-col w-full md:w-1/3 md:pl-0 gap-2 relative z-20">
              <DeliveryBox wrapperClassName="w-full h-40 md:h-60 bg-black/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10" />
              {/* Video and Notice side by side */}
              <div className="flex w-full h-40 md:h-60 gap-2">
                {/* Video Container (사용자가 지정한 영역) */}
                <div className="relative w-1/2 bg-black/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10 aspect-video flex items-center justify-center">
                  {/* Restore video tag with key and onEnded */}
                  <video
                    ref={videoRef}
                    key={firstVideoEnded ? 'hero01' : 'hero00'} // Restore key
                    src={initialVideoSrc} // Use initialVideoSrc with basePath
                    autoPlay muted playsInline
                    onEnded={handleVideoEnd} // Restore onEnded
                    className={`w-full h-full object-contain transition-opacity duration-500 ${videoEnded ? 'opacity-70' : 'opacity-100'}`}
                  />
                  {/* Restore button overlay logic */}
                  {videoEnded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center p-2 z-10"
                    >
                      <Button asChild className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                        <Link href={`/products`} >
                          제품 보러가기
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </div>
                {/* Notice: half width */}
                <NoticeBox wrapperClassName="w-1/2 h-full bg-black/30 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/10" />
              </div>
              {/* === CertPatentBox 또는 관련 메시지 렌더링 (AnimatePresence 적용) === */}
              {/* 이 div가 AnimatePresence 내부 요소들의 레이아웃 기준이 됨 */}
              <div className="w-full h-40 md:h-60 relative">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading-cert"
                      className={messageBoxWrapperClass} // 메시지용 스타일 적용
                      variants={motionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      // AnimatePresence 내부 요소들이 동일 공간을 차지하도록 절대 위치 설정
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    >
                      <p className="text-gray-400 text-sm">인증/특허 정보 로딩 중...</p>
                    </motion.div>
                  ) : (companyData?.awardsAndCertifications && Array.isArray(companyData.awardsAndCertifications) && companyData.awardsAndCertifications.length > 0) ? (
                    <motion.div
                      key="cert-box-content" // key 변경
                      variants={motionVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    // CertPatentBox가 이 div의 크기를 완전히 채우도록 wrapperClassName 전달
                    // CertPatentBox 자체의 스타일은 내부에서 관리
                    >
                      <CertPatentBox
                        awardsData={companyData.awardsAndCertifications}
                        isLoading={false}
                        wrapperClassName="w-full h-full" // CertPatentBox가 부모 motion.div를 채우도록
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-cert-data" // key 변경
                      className={messageBoxWrapperClass} // 메시지용 스타일 적용
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
              {/* === CertPatentBox 렌더링 로직 끝 === */}
            </div>
            {/* Right Column: Main Title fills full right area */}
            <div className="order-first md:order-none flex-1 flex flex-col justify-center md:justify-end items-center md:items-end space-y-1 md:space-y-2 md:pb-12 pb-4 relative z-[2]">
              {/* Background overlay */}
              <div
                className="absolute inset-0 z-[0] pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 70%)' }}
              />
              {/* Highlight badge */}
              <div className="space-y-1 mb-1 md:mb-2 relative z-[2]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-white text-xs">
                  <span className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
                  <span>대한민국 소방 설비 전문기업</span>
                </div>
              </div>

              {/* Main title */}
              <h1 className="text-white text-center md:text-right leading-tight md:leading-none drop-shadow-md tracking-tight md:tracking-normal mt-1 md:mt-3 relative z-[2]">
                <span className="inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-3">
                  안전한 세상을 만드는
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                  (주)서한에프앤씨
                </span>
              </h1>

              {/* Subtitle paragraph */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white text-center md:text-right mt-2 md:mt-4 mb-2 drop-shadow-md max-w-full break-words md:whitespace-nowrap md:overflow-visible relative z-[2]">
                1992년 설립 이래, 최고의 기술력과 품질로 고객의 안전을 책임지는 소방안전 전문기업입니다.
              </p>
              {/* Sub-stats: align below subtitle */}
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
              {/* 모바일용 구분선 추가 */}
              <hr className="border-white/20 mt-4 w-full max-w-xs md:hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 