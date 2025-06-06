'use client';

import { AlertTriangle } from 'lucide-react';

interface ProductCautionsProps {
  cautions?: string[];
}

/**
 * 제품 사용시 주의사항을 표시하는 컴포넌트
 */
const ProductCautions = ({ cautions }: ProductCautionsProps) => {
  if (!cautions || cautions.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-950/30 border border-amber-500/20 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        주의사항
      </h3>
      <ul className="space-y-3 text-gray-300">
        {cautions.map((caution, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-amber-500 mr-2">•</span>
            <span>{caution}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCautions;
