'use client';

import { cn } from '@/lib/utils';

interface ProductHeaderProps {
  productName: string;
  description: string;
}

/**
 * 제품 상세 페이지의 헤더 컴포넌트
 * 제품명과 간단한 설명을 표시합니다.
 */
const ProductHeader = ({ productName, description }: ProductHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
        {productName}
      </h1>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default ProductHeader;
