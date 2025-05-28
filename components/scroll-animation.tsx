"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollAnimationProps {
  children: React.ReactNode
  delay?: number
}

export function FadeIn({ children, delay = 0 }: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, delay = 0 }: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0 }: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  )
}

