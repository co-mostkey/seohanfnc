"use client";

import React, { useState } from 'react';
import { ProductForm } from '../components/ProductForm';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (productData: Product) => {
        console.log('[TRISID] CREATE PAGE: handleSubmit 시작');
        console.log('[TRISID] CREATE PAGE: 받은 제품 데이터:', productData);

        setIsSubmitting(true);
        setError(null);

        try {
            console.log('[TRISID] CREATE PAGE: API 요청 시작');
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            console.log('[TRISID] CREATE PAGE: API 응답 받음, status:', response.status);
            const responseData = await response.json();
            console.log('[TRISID] CREATE PAGE: 응답 데이터:', responseData);

            if (!response.ok) {
                if (responseData.errors) {
                    console.error('[TRISID] CREATE PAGE: 서버 검증 오류:', responseData.errors);
                    console.error('[TRISID] CREATE PAGE: 실패한 필드들:', responseData.failedFields);
                }
                const errorMessage = responseData.failedFields ?
                    `검증 실패: ${responseData.failedFields.join(', ')}` :
                    (responseData.message || '제품 생성에 실패했습니다.');
                throw new Error(errorMessage);
            }

            console.log('[TRISID] CREATE PAGE: 성공, 리다이렉트 진행');
            toast.success('제품이 성공적으로 생성되었습니다.');
            router.push('/admin/products');

        } catch (err: any) {
            console.error('[TRISID] CREATE PAGE: 에러 발생:', err);
            setError(err.message);
            toast.error(`제품 생성 오류: ${err.message}`);
            console.error("Failed to create product via API:", err);
        } finally {
            console.log('[TRISID] CREATE PAGE: handleSubmit 완료');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative z-40 p-4 md:p-6 bg-gray-900 min-h-screen text-white">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">새 제품 추가</h1>
            </header>

            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-md">
                    <p>오류: {error}</p>
                </div>
            )}

            <div className="relative z-40">
                <ProductForm
                    initialData={null}
                    onSubmitAction={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
} 