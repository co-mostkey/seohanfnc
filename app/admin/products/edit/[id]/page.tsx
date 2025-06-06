"use client";

import React, { useState, useEffect } from 'react';
import { ProductForm } from '../../components/ProductForm';
import { Product } from '@/types/product';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string | undefined;

    const [initialData, setInitialData] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/admin/products/${productId}`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '해당 ID의 제품을 찾을 수 없습니다.');
                    }
                    const product = await response.json();
                    setInitialData(product as Product);
                } catch (err: any) {
                    setError(err.message);
                    console.error("Failed to fetch product for editing from API:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        } else {
            setError('잘못된 접근입니다. 제품 ID가 필요합니다.');
            setLoading(false);
        }
    }, [productId]);

    const handleSubmit = async (productData: Product) => {
        console.log('=== Edit Page handleSubmit Called ===');
        console.log('Product ID:', productId);
        console.log('Product Data:', productData);

        if (!productId) {
            console.error('No productId found!');
            toast.error('제품 ID가 없습니다.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        console.log(`Updating product ${productId} with API:`, productData);

        try {
            // categoryId가 있는지 확인
            if (!productData.categoryId && productData.productCategoryId) {
                productData.categoryId = productData.productCategoryId;
            }

            console.log('Sending PUT request to:', `/api/admin/products/${productId}`);
            console.log('Request body:', JSON.stringify(productData));

            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || '제품 수정에 실패했습니다.');
            }

            toast.success('제품이 성공적으로 수정되었습니다.');
            router.push('/admin/products');
        } catch (err: any) {
            console.error('Error in handleSubmit:', err);
            setError(err.message);
            toast.error(`제품 수정 실패: ${err.message}`);
            console.error("Failed to update product via API:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-400">제품 정보 로딩 중...</p>
            </div>
        );
    }

    if (error && !initialData) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">제품 수정</h1>
                <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-md">
                    <p>오류: {error}</p>
                </div>
                <Button onClick={() => router.push('/admin/products')} className="mt-4">목록으로 돌아가기</Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-900 min-h-screen text-white">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">제품 수정: {
                    initialData?.nameKo ||
                    (typeof initialData?.name === 'string' ? initialData.name : (initialData?.name as any)?.ko) ||
                    productId
                }</h1>
            </header>

            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-md">
                    <p>오류: {error}</p>
                </div>
            )}

            {initialData ? (
                <ProductForm initialData={initialData} onSubmitAction={handleSubmit} isSubmitting={isSubmitting} />
            ) : (
                !loading && !error && <p className="text-gray-400">제품 데이터를 불러올 수 없습니다. ID를 확인해주세요.</p>
            )}
        </div>
    );
} 