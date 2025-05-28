'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ModelViewer를 동적으로 import (SSR 비활성화)
const ModelViewer = dynamic(() => import('./ModelViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-2 mx-auto"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">3D 모델 로딩 중...</p>
            </div>
        </div>
    ),
});

const SimpleModelViewer = dynamic(() => import('./SimpleModelViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-2 mx-auto"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400">모델 로딩 중...</p>
            </div>
        </div>
    ),
});

const SimplestModelViewer = dynamic(() => import('./SimplestModelViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-1 mx-auto"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400">로딩...</p>
            </div>
        </div>
    ),
});

interface DynamicModelViewerProps {
    modelPath: string;
    productName: string;
    showHotspots?: boolean;
    variant?: 'full' | 'simple' | 'minimal';
    onLoad?: () => void;
    onError?: () => void;
    productId?: string;
}

export default function DynamicModelViewer({
    modelPath,
    productName,
    showHotspots = true,
    variant = 'full',
    onLoad,
    onError,
    productId
}: DynamicModelViewerProps) {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-2 mx-auto"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">3D 뷰어 준비 중...</p>
                </div>
            </div>
        }>
            {variant === 'full' && (
                <ModelViewer
                    modelPath={modelPath}
                    productName={productName}
                    showHotspots={showHotspots}
                    onLoad={onLoad}
                    onError={onError}
                />
            )}
            {variant === 'simple' && (
                <SimpleModelViewer
                    modelPath={modelPath}
                    productName={productName}
                    onLoad={onLoad}
                    onError={onError}
                    productId={productId}
                />
            )}
            {variant === 'minimal' && (
                <SimplestModelViewer
                    modelPath={modelPath}
                    productName={productName}
                    onLoad={onLoad}
                    onError={onError}
                />
            )}
        </Suspense>
    );
} 