"use client";

import React, { useState } from 'react';
import { ProductForm } from '../components/ProductForm';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router
import { toast } from 'sonner';

export default function CreateProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (productData: Product) => {
        setIsSubmitting(true);
        setError(null);
        console.log("Creating new product with API:", productData);

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '제품 생성에 실패했습니다.');
            }
            toast.success('제품이 성공적으로 생성되었습니다.');
            router.push('/admin/products');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
            console.error("Failed to create product via API:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-900 min-h-screen text-white">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">새 제품 추가</h1>
            </header>

            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-md">
                    <p>오류: {error}</p>
                </div>
            )}

            <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
} 