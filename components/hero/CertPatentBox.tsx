"use client"

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { type AwardItem } from '@/types/company'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

interface CertificationItemProps extends AwardItem {
  // AwardItem의 모든 필드를 포함
}

// 개별 인증/특허 아이템을 표시하는 내부 컴포넌트
function CertificationDisplayItem(props: CertificationItemProps & { imageSrc?: string; issuer?: string; isMobile?: boolean }) {
  // imageUrl, imageSrc 모두 지원 (imageUrl 우선)
  const rawImage = props.imageUrl || props.imageSrc;
  const imagePath = rawImage
    ? (rawImage.startsWith('/uploads/')
      ? rawImage
      : (rawImage.startsWith('/') || rawImage.startsWith('http')
        ? rawImage
        : `${basePath}/${rawImage}`))
    : `${basePath}/images/placeholder-a4.png`;

  const displayTitle = props.title || '';
  const isMobile = props.isMobile;

  return (
    <div
      className={isMobile
        ? "shrink-0 w-24 h-full max-h-full bg-transparent hover:bg-gray-800/20 border border-gray-700/10 hover:border-gray-600/30 rounded-lg overflow-hidden flex flex-col transition-all duration-300"
        : "shrink-0 w-14 sm:w-16 md:w-20 lg:w-24 h-full max-h-full bg-transparent hover:bg-gray-800/20 border border-gray-700/10 hover:border-gray-600/30 rounded-lg overflow-hidden flex flex-col transition-all duration-300"
      }
      title={displayTitle}
      style={{ aspectRatio: '210/297' }}
    >
      <div className={isMobile ? "relative w-full h-0 pb-[135%] bg-gray-800/10" : "relative w-full h-0 pb-[110%] bg-gray-800/10"}>
        <Image
          src={imagePath}
          alt={displayTitle}
          fill
          className={isMobile ? "object-contain p-3" : "object-contain p-1 sm:p-1.5"}
          unoptimized={imagePath.startsWith('http')}
          onError={(e) => { e.currentTarget.src = `${basePath}/images/placeholder-image.png`; }}
        />
      </div>
      <div className={isMobile ? "w-full text-center text-[15px] truncate px-1 py-1 text-gray-300" : "w-full text-center text-[8px] sm:text-[9px] md:text-[10px] truncate px-0.5 py-1 text-gray-300"}>{displayTitle}</div>
    </div>
  )
}

interface CertPatentBoxProps {
  wrapperClassName?: string
  awardsData?: AwardItem[] // API로부터 받은 데이터
  isLoading?: boolean
}

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android|Mobile/i.test(window.navigator.userAgent);
}

export default function CertPatentBox({ wrapperClassName, awardsData, isLoading: isLoadingProp }: CertPatentBoxProps) {
  const isLoading = isLoadingProp === undefined ? true : isLoadingProp;
  const certScrollRef = useRef<HTMLDivElement>(null)
  const [isCertPaused, setIsCertPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [translateX, setTranslateX] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsMobile(isMobileDevice());
    }
  }, [])

  // 무한 슬라이드 애니메이션
  useEffect(() => {
    if (!mounted || isLoading || !awardsData || !Array.isArray(awardsData) || awardsData.length === 0) return;
    let frame: number;
    const speed = isMobile ? 0.2 : 0.2; // 모바일에서 더 느리게
    const getTotalWidth = () => certScrollRef.current?.scrollWidth || 1;
    const animate = () => {
      if (!isCertPaused) {
        setTranslateX(prev => {
          const totalWidth = getTotalWidth();
          return prev <= -totalWidth / 2 ? 0 : prev - speed;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isCertPaused, mounted, isLoading, awardsData, isMobile]);

  // 이미지 URL과 제목이 있는 항목만 필터링 (제한 없음)
  const displayItems = awardsData?.filter(item => item.imageUrl && item.title) || []
  console.log('[CertPatentBox] displayItems:', displayItems);

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className={cn(
        isMobile
          ? "w-full h-full min-h-[120px] max-h-[180px] flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-xl p-2 sm:p-4 sm:shadow-md sm:rounded-lg"
          : "w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-xl p-2 md:p-4 sm:shadow-md sm:rounded-lg",
        wrapperClassName
      )}>
        <p className="text-gray-400 text-sm">인증/특허 정보 로딩 중...</p>
      </div>
    )
  }

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className={cn(
        isMobile
          ? "w-full h-full min-h-[120px] max-h-[180px] flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-xl p-2 sm:p-4 sm:shadow-md sm:rounded-lg"
          : "w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-xl p-2 md:p-4 sm:shadow-md sm:rounded-lg",
        wrapperClassName
      )}>
        <p className="text-gray-400 text-sm">표시할 인증/특허 정보가 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        isMobile
          ? "w-full min-h-[140px] max-h-[220px] sm:min-h-[160px] sm:max-h-[260px] sm:p-4 flex flex-col justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-xl p-3 sm:shadow-md sm:rounded-lg"
          : "w-full min-h-[120px] md:min-h-[140px] h-full max-h-[220px] md:max-h-[220px] flex flex-col justify-center bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-xl p-2 md:p-4 sm:shadow-md sm:rounded-lg",
        wrapperClassName
      )}
    >
      <div className="flex flex-col h-full w-full flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-1 mb-1">
          <h3 className={isMobile ? "text-lg font-semibold text-white" : "text-sm md:text-base font-semibold text-white"}>
            주요 인증 및 특허
          </h3>
          <span className={isMobile ? "text-base px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full font-medium border border-gray-700/30" : "text-xs px-1 py-1 bg-gray-800/50 text-gray-300 rounded-full font-medium border border-gray-700/30"}>{displayItems.length} 건</span>
        </div>
        <div className="relative flex-1 overflow-hidden flex items-end">
          <div
            ref={certScrollRef}
            className={isMobile ? "flex flex-row gap-3 items-end px-2 py-2 h-full" : "flex flex-row gap-1 sm:gap-1 items-end px-1 py-1 h-full"}
            style={{
              willChange: 'transform',
              transform: `translateX(${translateX}px)`
            }}
            onMouseEnter={() => setIsCertPaused(true)}
            onMouseLeave={() => setIsCertPaused(false)}
            onTouchStart={() => setIsCertPaused(true)}
            onTouchEnd={() => setIsCertPaused(false)}
          >
            {[...displayItems, ...displayItems].map((item, idx) => (
              <CertificationDisplayItem key={item.id + '-' + idx} {...item} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 