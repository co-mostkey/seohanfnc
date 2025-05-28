import { motion, useViewportScroll, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from "react"

export interface HeroCubeProps {
  faces: React.ReactNode[]   // 4개의 면에 들어갈 요소들
  width?: number | string    // 큐브 너비(px or CSS units)
  height?: number | string   // 큐브 높이(px or CSS units)
}

export default function HeroCube({ faces, width = 600, height = 300 }: HeroCubeProps) {
  // Compute half of width for translateZ, supporting px and vw units
  const half = typeof width === 'number'
    ? `${width / 2}px`
    : typeof width === 'string' && width.endsWith('vw')
      ? `${parseFloat(width) / 2}vw`
      : width;
  // 스크롤 위치에 따라 회전각 계산 (0->-360deg)
  const { scrollYProgress } = useViewportScroll()
  const scrollRot = useTransform(scrollYProgress, [0, 1], [0, -360])
  const springRot = useSpring(scrollRot, { stiffness: 100, damping: 20 })
  // 뒤쪽으로 살짝 기울인 3D 회전
  const rotateTransform = useTransform(springRot, y => `rotateX(-15deg) rotateY(${y}deg)`)

  return (
    <div
      style={{
        width: width,
        height: height,
        perspective: 600,            // 더 강한 원근감 적용
        perspectiveOrigin: '50% 50%',
        margin: "0 auto",
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          transform: rotateTransform,
        }}
      >
        {faces.map((face, i) => {
          const rot = i * 90;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: `rotateY(${rot}deg) translateZ(${half})`,
              }}
            >
              {face}
            </div>
          );
        })}
      </motion.div>
    </div>
  )
} 