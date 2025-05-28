import React from 'react';
import { Specification } from '@/types/product';

interface ProductSpecificationsProps {
  specifications: Specification[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">제품 사양</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {specifications.map((spec, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h4 className="font-semibold text-sm text-gray-500 dark:text-gray-400">{spec.name}</h4>
            <p className="mt-1 font-medium">{spec.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 