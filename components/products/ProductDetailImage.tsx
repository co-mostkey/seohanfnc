"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { GalleryImageItem } from '@/types/product'

interface ProductDetailImageProps {
  images: GalleryImageItem[];
  className?: string;
  onSelectImage?: (index: number) => void;
}

export function ProductDetailImage({ images, className, onSelectImage }: ProductDetailImageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative aspect-square w-full bg-gray-100 dark:bg-gray-800", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">이미지 없음</p>
        </div>
      </div>
    )
  }

  const currentItem = images[selectedImageIndex];

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
    if (onSelectImage) {
      onSelectImage(index);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 메인 이미지 */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-red-700/30 bg-gray-900/50 shadow-lg">
        <Image
          key={currentItem.src}
          src={currentItem.src}
          alt={currentItem.alt || '제품 이미지'}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedImageIndex === 0}
        />
      </div>

      {/* 썸네일 갤러리 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((item, index) => (
            <button
              key={item.src + index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border",
                selectedImageIndex === index
                  ? "border-red-500 ring-2 ring-red-500/20"
                  : "border-gray-700 hover:border-red-400/50",
                "bg-gray-900/50 transition-all duration-200 group"
              )}
              onClick={() => handleSelectImage(index)}
            >
              <Image
                src={item.src}
                alt={item.alt || '이미지 썸네일'}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}