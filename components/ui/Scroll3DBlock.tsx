"use client"

import React, { useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Scroll3DBlockProps {
  children: React.ReactNode
  width?: string
  height?: string
}

export default function Scroll3DBlock({ children, width = '300px', height = '200px' }: Scroll3DBlockProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start({ rotateY: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } })
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial={{ rotateY: -90, opacity: 0 }}
      animate={controls}
      style={{
        width,
        height,
        perspective: 800,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
        position: 'relative',
        zIndex: 20,
        overflow: 'visible',
        margin: '0 auto',
      }}
    >
      <div style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
        {children}
      </div>
    </motion.div>
  )
}