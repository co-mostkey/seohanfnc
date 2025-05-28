"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'
import { cn, getLocalizedString } from '@/lib/utils'

interface RelatedProductsProps {
  products: Product[];
  className?: string;
}

export function RelatedProducts({ products, className }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">관련 제품</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-3">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || getLocalizedString(product.name)}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>
            <h3 className="font-medium text-base group-hover:text-primary transition-colors">
              {getLocalizedString(product.name)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {getLocalizedString(product.description)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts; 