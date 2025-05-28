'use client';

import { Shield } from 'lucide-react';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';

interface ProductSpecificationsProps {
  specifications: Record<string, string>;
  specTable?: any;
}

/**
 * 제품 사양 정보를 표시하는 컴포넌트
 * 기본 사양 및 상세 규격 테이블을 표시합니다.
 */
const ProductSpecifications = ({ specifications, specTable }: ProductSpecificationsProps) => {
  return (
    <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30" id="specificationSection">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-red-400" />
        제품 사양 상세
      </h3>
      
      {/* 사양 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {Object.entries(specifications).slice(0, Math.ceil(Object.entries(specifications).length / 2)).map(([key, value], idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-gray-700/30 pb-2 last:border-0"
            >
              <span className="text-gray-400">{key}</span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {Object.entries(specifications).slice(Math.ceil(Object.entries(specifications).length / 2)).map(([key, value], idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-gray-700/30 pb-2 last:border-0"
            >
              <span className="text-gray-400">{key}</span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 규격 테이블 (있는 경우) */}
      {specTable && specTable.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-red-400">규격별 상세 사양</h3>
          <ModelSpecTable specTable={specTable} className="bg-gray-800/30" />
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
