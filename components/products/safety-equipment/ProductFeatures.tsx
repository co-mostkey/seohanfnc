'use client';

import { Check } from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
}

interface ProductFeaturesProps {
  features: FeatureItem[];
}

/**
 * 제품의 주요 특징을 표시하는 컴포넌트
 */
const ProductFeatures = ({ features }: ProductFeaturesProps) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {features.map((feature, idx) => (
        <div key={idx} className="p-1">
          <h4 className="text-lg font-semibold font-sans text-white mb-1">{feature.title}</h4>
          <p className="text-sm text-gray-300 font-sans">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductFeatures;
