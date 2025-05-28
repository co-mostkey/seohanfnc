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
function CertificationDisplayItem({ id, title, description, year, imageUrl, link, issuingOrganization }: CertificationItemProps) {
  const imagePath = imageUrl
    ? (imageUrl.startsWith('/') || imageUrl.startsWith('http') ? imageUrl : `${basePath}/${imageUrl}`)
    : `${basePath}/images/placeholder-a4.png` // A4 비율 placeholder

  const displayTitle = title || '제목 없음'

  return (
    <div
      className="shrink-0 w-[100px] md:w-[120px] flex flex-col items-center bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-primary-500/20 transition-all duration-200 group shadow-md hover:shadow-primary-500/30"
      title={displayTitle}
    >
      <div className="relative w-full aspect-[210/297] bg-gray-700/50 rounded-md mb-1.5 shadow-inner overflow-hidden">
        <Image
          src={imagePath.startsWith('http') ? imagePath : (imagePath.startsWith('/') ? imagePath : `${basePath}${imagePath}`)}
          alt={displayTitle}
          fill
          className="object-contain p-1 group-hover:scale-105 transition-transform duration-300 ease-in-out"
          unoptimized={imagePath.startsWith('http')} // 외부 URL은 unoptimized
          onError={(e) => { e.currentTarget.src = `${basePath}/images/placeholder-image.png`; }} // 이미지 로드 실패 시 플레이스홀더 변경
        />
      </div>
      <div className="text-center w-full">
        <p className="text-[11px] font-semibold text-primary-300 dark:text-primary-300 truncate w-full leading-snug" title={displayTitle}>{displayTitle}</p>
        {year && <p className="text-[9px] text-gray-300 dark:text-gray-400 mt-0.5 leading-tight" title={year}>{year}</p>}
        {issuingOrganization && <p className="text-[9px] text-gray-400 dark:text-gray-500 truncate w-full leading-tight" title={issuingOrganization}>{issuingOrganization}</p>}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-blue-400 hover:text-blue-300 hover:underline mt-0.5 inline-flex items-center transition-colors leading-tight"
            onClick={(e) => e.stopPropagation()}
          >
            자세히 보기 <ExternalLink className="w-2 h-2 ml-0.5" />
          </a>
        )}
      </div>
    </div>
  )
}

interface CertPatentBoxProps {
  wrapperClassName?: string
  awardsData?: AwardItem[] // API로부터 받은 데이터
  isLoading?: boolean
}

export default function CertPatentBox({ wrapperClassName, awardsData, isLoading: isLoadingProp }: CertPatentBoxProps) {
  // isLoadingProp이 undefined이면 true로, 아니면 해당 값으로 isLoading 상태 결정
  const isLoading = isLoadingProp === undefined ? true : isLoadingProp;
  // console.log('[CertPatentBox] Received isLoadingProp:', isLoadingProp, 'Processed isLoading:', isLoading);
  // console.log('[CertPatentBox] Received awardsData:', awardsData);
  const certScrollRef = useRef<HTMLDivElement>(null)
  const [isCertPaused, setIsCertPaused] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!certScrollRef.current || !mounted || isLoading || !awardsData || !Array.isArray(awardsData) || awardsData.length === 0) return

    const scrollContainer = certScrollRef.current; // 스크롤 될 아이템들을 직접 감싸는 div
    if (!scrollContainer.firstChild) return; // 자식 노드가 없으면 중단

    const itemsWrapper = scrollContainer.firstChild as HTMLDivElement; // 실제 아이템들을 담고 있는 div

    let animationId: number;
    const scrollSpeed = 15; // px per second
    let lastTimestamp = 0;
    let currentTranslateX = 0;

    const animate = (timestamp: number) => {
      const 나오늘DeltaTime = (timestamp - lastTimestamp) / 1000; // seconds
      lastTimestamp = timestamp; // isCertPaused 여부와 관계없이 항상 lastTimestamp를 업데이트합니다.

      if (isCertPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // isCertPaused가 false인 경우에만 애니메이션 로직 실행
      const totalContentWidth = itemsWrapper.scrollWidth / 2; // 원본 콘텐츠의 전체 너비 (복제본 제외)
      const visibleWidth = scrollContainer.clientWidth;

      if (totalContentWidth > visibleWidth) {
        currentTranslateX -= scrollSpeed * 나오늘DeltaTime; // 여기서 deltaTime 대신 새로 계산한 deltaTime 사용

        if (Math.abs(currentTranslateX) >= totalContentWidth) {
          currentTranslateX = 0; // 루프
        }
        itemsWrapper.style.transform = `translateX(${currentTranslateX}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    // 초기화 시 lastTimestamp를 현재 시간으로 설정
    lastTimestamp = performance.now();
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      lastTimestamp = 0;
      currentTranslateX = 0; // 컴포넌트 언마운트 시 리셋
      if (itemsWrapper) {
        itemsWrapper.style.transform = `translateX(0px)`; // 스타일 초기화
      }
    };
  }, [isCertPaused, mounted, awardsData, isLoading]);

  // 이미지 URL과 제목이 있는 항목만 필터링 (제한 없음)
  const displayItems = awardsData?.filter(item => item.imageUrl && item.title) || []
  // console.log('[CertPatentBox] Generated displayItems:', displayItems);

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className={cn("bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 text-white shadow-lg relative overflow-hidden flex items-center justify-center min-h-[220px]", wrapperClassName)}>
        <p className="text-gray-400 text-sm">인증/특허 정보 로딩 중...</p>
      </div>
    )
  }

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className={cn("bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 text-white shadow-lg relative overflow-hidden flex items-center justify-center min-h-[220px]", wrapperClassName)}>
        <p className="text-gray-400 text-sm">표시할 인증/특허 정보가 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      className={cn("bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 text-white shadow-xl relative overflow-hidden", wrapperClassName)}
      onMouseEnter={() => setIsCertPaused(true)}
      onMouseLeave={() => setIsCertPaused(false)}
      style={{ minHeight: '220px' }} // 최소 높이 보장
    >
      <div className="h-full w-full">
        <div className="overflow-hidden h-full w-full">
          <div className="flex items-center justify-between mb-2 md:mb-3 relative z-10 px-1">
            <h3 className="text-sm md:text-base font-semibold text-white">
              주요 인증 및 특허
            </h3>
            <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full font-medium">{displayItems.length} 건</span>
          </div>
          <div
            ref={certScrollRef}
            className="overflow-hidden hide-scrollbar relative z-10 select-none cursor-grab active:cursor-grabbing flex-grow" // overflow-x-auto 제거, overflow-hidden으로 변경
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-3 py-2 min-w-max h-full items-stretch"> {/* 이 div가 translateX로 움직임 */}
              {displayItems.map((item) => (
                <CertificationDisplayItem key={item.id} {...item} />
              ))}
              {displayItems.length > 0 && displayItems.map((item) => (
                <CertificationDisplayItem key={`clone-${item.id}`} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 