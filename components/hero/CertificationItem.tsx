"use client"

import React from 'react'
import NextImage from 'next/image'

export interface CertificationItemProps {
  image: string
  title: string
  number?: string
  year?: string
}

export default function CertificationItem({ image, title, number, year }: CertificationItemProps) {
  return (
    <div className="shrink-0 w-32 md:w-36 flex flex-col items-center bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-white/20 transition-colors group overflow-hidden">
      <div className="relative w-24 h-24 md:w-28 md:h-28 bg-white/90 dark:bg-gray-900/90 p-2 rounded-lg mb-1 overflow-hidden">
        <NextImage
          src={image}
          alt={title}
          fill
          className="object-contain p-1"
        />
      </div>
      <div className="text-center">
        <p className="text-[10px] text-blue-200 font-medium truncate w-full">{title}</p>
        {(number || year) && (
          <p className="text-[8px] text-gray-300 mt-0.5">
            {number && <span>{number}</span>}
            {number && year && <span className="mx-1">·</span>}
            {year && <span>{year}</span>}
          </p>
        )}
      </div>
    </div>
  )
}
