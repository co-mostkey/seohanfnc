"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 제품 표시용 이미지 경로 처리 함수
 * 업데이트: 2025-05-11 - JSON 데이터와 새 폴더 구조 호환성 개선
 */
const getProductThumbnailPath = (productId: string, imagePath?: string): string => {
  // 1. 상대 URL 또는 절대 URL이 있는 경우 - 직접 반환
  if (imagePath && (imagePath.startsWith('/') || imagePath.startsWith('http'))) {
    // JSON에서 바로 제품ID.jpg 형태로 정의된 경우 처리
    if (imagePath.includes(`/${productId}.jpg`) || imagePath.includes(`/${productId}.png`)) {
      // 새 경로 구조로 전환 시도
      return `/images/products/${productId}/thumbnail.jpg`;
    }
    return imagePath;
  }

  // 2. 새로운 폴더 구조 이미지 경로 (최우선)
  const thumbnailPath = `/images/products/${productId}/thumbnail.jpg`;

  // 3. 파라미터로 전달된 이미지 경로 처리
  if (imagePath && imagePath !== productId && !imagePath.includes('/')) {
    const possibleExtensions = ['.jpg', '.png', '.jpeg', '.webp'];
    const defaultExtension = '.jpg';

    // 파라미터 경로에 확장자가 있는지 확인
    const hasExtension = possibleExtensions.some(ext => imagePath.toLowerCase().endsWith(ext));

    if (hasExtension) {
      // 확장자가 있는 경우
      return `/images/products/${productId}/${imagePath}`;
    } else {
      // 확장자가 없는 경우 .jpg 추가
      return `/images/products/${productId}/${imagePath}${defaultExtension}`;
    }
  }

  // 4. JSON 데이터와 실제 폴더 구조 호환성 위한 대체 경로 목록
  // 이미지 로딩 실패 시 onError 함수에서 순차적으로 시도할 경로들
  const fallbackPaths = [
    thumbnailPath, // 1차: /[productId]/thumbnail.jpg
    `/images/products/${productId}/main.jpg`, // 2차: /[productId]/main.jpg
    `/images/products/${productId}/${productId}.jpg`, // 3차: /[productId]/[productId].jpg 
    `/images/products/${productId}.jpg`, // 4차: /[productId].jpg (JSON 경로와 호환)
    `/images/products/default-product.jpg` // 5차: 기본 이미지
  ];

  // 5. 우선적으로 새 폴더 구조 경로 반환
  return thumbnailPath;
}

interface ProductCardProps {
  id: string
  name: string
  description?: string
  image?: string
  category?: string
  inquiryOnly?: boolean
  approvalNumber?: string
  productStyle?: string
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 제품 링크 경로 생성 함수
const getProductLinkPath = (id: string, category?: string): string => {
  // 모든 제품들은 직접 /products/ 경로 사용
  return `/products/${id}`;
};

export default function ProductCard({
  id,
  name,
  description,
  image,
  category,
  inquiryOnly,
  approvalNumber,
  productStyle
}: ProductCardProps) {

  const CardContent = (
    <div
      className={cn(
        "group block h-full rounded-lg overflow-hidden border",
        "bg-card/80 backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/50 hover:-translate-y-1"
      )}
    >
      <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 overflow-hidden shadow-inner">
        {image ? (
          <Image
            src={getProductThumbnailPath(id, image)}
            alt={name || '제품 이미지'}
            fill
            className="object-contain p-4 transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
            onError={(e) => {
              console.log('이미지 로드 오류:', id, image);
              // 이미지 로드 실패 시 대체 이미지 순서로 시도
              const img = e.target as HTMLImageElement;

              // 순차적으로 이미지 로드 시도를 관리하기 위한 패스 인덱스
              const retryCount = parseInt(img.dataset.retryCount || '0', 10);
              const fallbackPaths = [
                `/images/products/${id}/main.jpg`,                  // 두 번째 시도 - main.jpg
                `/images/products/${id}/${id}.jpg`,                // 세 번째 시도 - 기존 규칙
                `/images/products/${id}/product-image.jpg`,        // 네 번째 시도
                `/images/products/default-product.jpg`             // 마지막 시도 - 전역 기본 이미지
              ];

              if (retryCount < fallbackPaths.length) {
                // 다음 경로로 재시도
                img.dataset.retryCount = (retryCount + 1).toString();
                img.src = fallbackPaths[retryCount];
                img.srcset = ''; // srcset 초기화
                console.log(`이미지 로드 재시도 (${retryCount + 1}/${fallbackPaths.length}):`, fallbackPaths[retryCount]);
              } else {
                // 모든 재시도 실패 시 표시 개선
                console.warn('모든 이미지 로드 시도 실패:', id);
                img.style.opacity = '0.5';
                img.style.filter = 'grayscale(40%)';

                // 이미지 실패 시 제품명 표시
                const container = img.parentElement;
                if (container) {
                  // 이미지 표시에 사용할 z-index가 높은 요소 추가
                  const textDiv = window.document.createElement('div');
                  textDiv.className = 'absolute inset-0 z-20 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium';
                  const productName = name || id.split('-').join(' ');
                  textDiv.innerHTML = `<div class="bg-gray-800/80 px-4 py-2 rounded-md shadow-sm text-white border border-gray-700">${productName}</div>`;
                  container.appendChild(textDiv);
                }
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            (이미지 없음)
          </div>
        )}
        {inquiryOnly && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 z-10 shadow"
          >
            별도 문의
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors mb-1 flex-grow line-clamp-2">
          {name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1 min-h-[1.2em]">
          {approvalNumber ? approvalNumber : '\u00A0'}
        </p>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        <div className="mt-auto pt-2">
          {!inquiryOnly ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full group/button border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
              asChild
            >
              <Link
                href={getProductLinkPath(id, category)}
                className="flex items-center justify-center"
              >
                <span>상세 보기</span>
                <ArrowRight className="ml-1 h-4 w-4 opacity-70 group-hover/button:opacity-100 transition-all duration-200" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100 dark:hover:bg-amber-600 border border-amber-200 dark:border-amber-500 shadow-sm"
              asChild
            >
              <Link
                href={`/support/contact`}
                className="flex items-center justify-center"
              >
                <Phone className="mr-2 h-4 w-4" />
                <span>문의하기</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return CardContent;
} 