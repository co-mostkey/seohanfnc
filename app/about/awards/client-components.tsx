'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface AwardsGalleryProps {
  items: GalleryItem[];
}

export function AwardsGallery({ items }: AwardsGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={cn(
              "aspect-[3/4] relative rounded-lg overflow-hidden cursor-pointer group",
              "border border-gray-200 dark:border-gray-700/50",
              "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
              "transition-all duration-300 ease-in-out",
              "hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 hover:scale-[1.03]"
            )}
            onClick={() => setSelectedImage(index)}
            title={`${item.alt} (${item.category})`}
          >
            <div className="w-full h-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800/50 dark:to-zinc-900/50">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className={cn(
                "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "text-center"
              )}>
                <span className="text-xs font-medium text-white drop-shadow truncate w-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] shadow-xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[selectedImage].src}
              alt={items[selectedImage].alt}
              width={1000}
              height={1414}
              className="object-contain rounded-lg max-w-full max-h-[85vh]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close image viewer"
              className="absolute -top-3 -right-3 bg-white dark:bg-gray-700 rounded-full p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-110 transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="mt-3 text-center text-white text-sm font-medium drop-shadow">
              {items[selectedImage].alt} ({items[selectedImage].category})
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
} 