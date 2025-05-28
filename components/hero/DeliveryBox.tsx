"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectReference from '@/components/hero/ProjectReference'
import { type DeliveryRecord } from '@/types/promotion'

interface DeliveryBoxProps {
  wrapperClassName?: string
  deliveryData: DeliveryRecord[] | null
  isLoading: boolean
}

export default function DeliveryBox({ wrapperClassName, deliveryData, isLoading }: DeliveryBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!scrollRef.current) return
    const scrollContainer = scrollRef.current
    let animationId: number
    let startTime: number | null = null
    let pausedAt = 0
    let scrollPosition = 0
    const scrollSpeed = 0.008

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      if (isPaused) {
        pausedAt = scrollPosition
        animationId = requestAnimationFrame(animate)
        return
      }
      const totalHeight = scrollContainer.scrollHeight
      const visibleHeight = scrollContainer.clientHeight
      if (totalHeight > visibleHeight) {
        scrollPosition = pausedAt + (timestamp - startTime) * scrollSpeed
        if (scrollPosition >= totalHeight - visibleHeight) {
          scrollPosition = 0
          startTime = timestamp
          pausedAt = 0
        }
        scrollContainer.scrollTop = scrollPosition
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isPaused, deliveryData])

  return (
    <div
      className={`${wrapperClassName ?? "bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 md:p-5 text-white flex flex-col relative overflow-hidden mb-0 pb-0 shadow-xl"}`}
      style={{ minHeight: '200px' }}
    >
      <div className="h-full w-full">
        <div className="pt-4 px-4 overflow-auto h-full w-full">
          <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2 flex items-center relative z-10 text-white">
            2024년 주요 납품실적
            <span className="ml-2 text-xs px-1.5 py-0.5 bg-white/20 text-white rounded-full">Premium References</span>
          </h3>

          <div className="bg-gray-900/20 rounded-lg p-3 border border-white/20 flex flex-col" style={{ height: 'calc(100% - 40px)' }}>
            <div
              ref={scrollRef}
              className="relative z-20 flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar auto-scroll-container"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-300"></div>
                  <p className="ml-2 text-sm text-gray-300">납품 실적 로딩 중...</p>
                </div>
              ) : deliveryData && deliveryData.length > 0 ? (
                <div className="space-y-0.5">
                  {deliveryData.slice().reverse().map((d, index) => (
                    <ProjectReference
                      key={d.id || `delivery-${index}`}
                      company={d.company}
                      project={d.project}
                      date={d.date}
                      isApartment={d.isApartment}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">표시할 납품 실적이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 