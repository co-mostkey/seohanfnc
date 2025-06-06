"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { findProductById, getCategoryName } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import { ProductDetailImage } from '@/components/products/ProductDetailImage';
import { ProductVideoSection } from '@/components/products/ProductVideoSection';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { AlertTriangle, ChevronLeft, Shield } from 'lucide-react';

type ProductDetailClientProps = {
  productId: string;
};

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [productImages, setProductImages] = useState<any[]>([]);
  const [productVideos, setProductVideos] = useState<any[]>([]);

  useEffect(() => {
    const loadProductData = () => {
      const productData = findProductById(productId);

      if (!productData) {
        setLoading(false);
        return;
      }

      setProduct(productData);
      setCategoryName(productData.category ? getCategoryName(productData.category) : '기타');

      // 미디어 분리
      const images: any[] = [];
      const videos: any[] = [];

      const isVideo = (src: string) => {
        return ['.mp4', '.webm', '.mov'].some(ext =>
          src.toLowerCase().endsWith(ext)
        );
      };

      // 기본 이미지 처리
      if (productData.image) {
        if (isVideo(productData.image)) {
          videos.push({ src: productData.image, alt: "제품 비디오", type: "video" });
        } else {
          images.push({ src: productData.image, alt: "제품 이미지", type: "image" });
        }
      }

      // 추가 이미지 처리
      if (productData.images && Array.isArray(productData.images)) {
        productData.images.forEach((item: any) => {
          const src = typeof item === 'string' ? item : (item?.path || item?.url || '');
          if (src) {
            if (isVideo(src)) {
              videos.push({ src, alt: "제품 비디오", type: "video" });
            } else {
              images.push({ src, alt: "제품 이미지", type: "image" });
            }
          }
        });
      }

      setProductImages(images);
      setProductVideos(videos);
      setLoading(false);
    };

    loadProductData();
  }, [productId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!product) {
    return (
      <div className="p-4">
        <h1>제품을 찾을 수 없습니다</h1>
        <Link href="/products">제품 목록으로 돌아가기</Link>
      </div>
    );
  }

  const productName = typeof product.name === 'string' ? product.name : '제품명 없음';

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{productName}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* 제품 이미지 */}
        <div>
          {productImages.length > 0 && (
            <ProductDetailImage images={productImages} />
          )}
        </div>

        {/* 제품 사양 */}
        <div>
          <h2 className="text-xl font-bold mb-4">제품 사양</h2>
          {product.specTable && (
            <ModelSpecTable specTable={product.specTable} />
          )}

          <Link
            href="/products"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            <ChevronLeft className="inline-block mr-2" size={16} />
            제품 목록
          </Link>
        </div>
      </div>
      {/* 제품 비디오 */}
      {productVideos.length > 0 && (
        <div className="mt-8">
          <ProductVideoSection videos={productVideos} title="제품 비디오" />
        </div>
      )}
    </div>
  );
}
