"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SafetyEquipment } from '@/types/safety-equipment'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface SafetyEquipmentRelatedProductsProps {
  products: SafetyEquipment[];
  className?: string;
}

/**
 * 안전장비 관련 제품 컴포넌트
 * 
 * 현재 보고 있는 제품과 관련된 다른 안전장비 제품을 표시합니다.
 */
export function SafetyEquipmentRelatedProducts({ products, className }: SafetyEquipmentRelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8", className)}>
      <h2 className="text-2xl font-bold mb-6 text-white">관련 안전장비</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/safety-equipment/${product.id}`}
            className="group block"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-800/50 border border-gray-700/50 mb-3">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.nameKo}
                  fill
                  className="object-cover transition-transform group-hover:scale-105 p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/fallback-image.jpg';
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}

              {/* 제품 태그 표시 (최대 2개) */}
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-red-900/80 hover:bg-red-800 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <h3 className="font-medium text-base group-hover:text-red-400 transition-colors text-white">
              {product.nameKo}
            </h3>

            <p className="text-sm text-gray-400 line-clamp-2 mt-1">
              {product.nameEn}
            </p>

            <p className="text-sm text-gray-400 line-clamp-2 mt-2">
              {product.description.length > 100
                ? `${product.description.substring(0, 100)}...`
                : product.description
              }
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SafetyEquipmentRelatedProducts;
