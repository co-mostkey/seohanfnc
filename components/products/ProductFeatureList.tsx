import React from 'react';
import { Check } from 'lucide-react';
import { Feature } from '@/types/product';

interface ProductFeatureListProps {
  features: Feature[];
}

export function ProductFeatureList({ features }: ProductFeatureListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="flex items-start"
        >
          <div className="flex-shrink-0 mt-1">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {feature.title}
            </p>
            {feature.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 