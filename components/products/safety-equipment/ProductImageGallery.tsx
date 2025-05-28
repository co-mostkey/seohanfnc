import React from 'react';
import Image from 'next/image';
import { MediaGalleryItem } from '@/types/product'; // MediaGalleryItem 타입 사용

// interface ProductImage { // 기존 ProductImage 인터페이스는 MediaGalleryItem으로 대체
//   src: string;
//   alt: string;
// }

interface ProductMediaGalleryProps { // 인터페이스 이름 변경 및 prop 이름 변경 (items)
  items: MediaGalleryItem[];
  className?: string; // 선택적 className prop 추가
}

/**
 * 제품 이미지 및 비디오 갤러리 컴포넌트
 * 그리드 레이아웃과 스크롤 기능을 제공합니다.
 */
const ProductImageGallery: React.FC<ProductMediaGalleryProps> = ({ items, className = "" }) => {
  if (!items || items.length === 0) {
    // 이 메시지는 product-detail-client.tsx에서 이미 처리하므로, 여기서는 null을 반환하거나 최소한의 UI만 제공 가능
    return null;
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 p-1 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          // 각 아이템을 flex-col로 변경하여 이미지/비디오와 설명을 수직 배치
          className="relative aspect-square rounded-sm overflow-hidden border border-gray-700/50 shadow-sm group bg-gray-900 flex flex-col items-center justify-center"
        // style={{ zIndex: 999 }} // z-index는 일단 제거 (필요시 다시 추가)
        >
          {/* 미디어 컨테이너 (이미지 또는 비디오) - 기존 aspect-square 유지 */}
          <div className="relative w-full aspect-square">
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={item.alt || `갤러리 미디어 ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200 ease-in-out"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // 필요시 부모 div에 에러 상태 표시
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<p class="text-xs text-red-400 p-2">이미지 로드 실패</p>';
                  }
                }}
              />
            ) : item.type === 'video' ? (
              <video
                src={item.src}
                controls
                className="object-contain w-full h-full"
                onError={(e) => {
                  console.error("Video failed to load:", item.src);
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<p class="text-xs text-red-400 p-2">비디오 로드 실패</p>';
                  }
                }}
              >
                お使いのブラウザはビデオタグをサポートしていません。
              </video>
            ) : (
              <p className="text-xs text-gray-400 p-2">알 수 없는 미디어 타입</p>
            )}
          </div>
          {/* 설명 표시 영역 - item.description이 있을 경우에만 표시 */}
          {item.description && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs truncate">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductImageGallery;
