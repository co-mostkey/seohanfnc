import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Feature } from '@/types/product';

interface ProductFeaturesProps {
  features: Feature[];
}

export function ProductFeatures({ features }: ProductFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">주요 특징</h3>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
            <div>
              <h4 className="font-semibold">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 