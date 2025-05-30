"use client"
import React from 'react'
import { motion } from 'framer-motion'

export default function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[-1]">
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-red-500 to-yellow-500 opacity-10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-10 rounded-full blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
    </div>
  )
} 