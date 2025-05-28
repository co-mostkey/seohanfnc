"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductDetailImage } from '@/components/products/ProductDetailImage';
import { SpecTable } from '@/components/products/SpecTable';
import { Product } from '@/types/product';
import { ChevronLeft, Award, CheckCircle } from 'lucide-react';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import ProductDetailFrameLayout from '@/components/layouts/ProductDetailFrameLayout';

type ProductDetailClientProps = {
    productId: string;
};

// 간단한 제품 상세 페이지 클라이언트 컴포넌트
export function ProductDetailClientSimple({ productId }: ProductDetailClientProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    // 문자열 값을 안전하게 가져오는 헬퍼 함수
    const getSafeString = (value: any, fallback: string = ''): string => {
        if (!value) return fallback;
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value.ko) return value.ko;
        return String(value) || fallback;
    };

    // 제품 데이터 로드
    useEffect(() => {
        async function loadProductData() {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    setLoading(false);
                    return;
                }

                const productData = await response.json();
                if (!productData) {
                    setLoading(false);
                    return;
                }

                setProduct(productData);
                setCategoryName(productData.category || '기타');

            } catch (error) {
                console.error('제품 데이터 로드 오류:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProductData();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">제품 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">제품을 찾을 수 없습니다</h1>
                    <p className="text-gray-600 mb-8">요청하신 제품이 존재하지 않거나 삭제되었습니다.</p>
                    <Link href="/products" className="text-blue-600 hover:text-blue-800 underline">
                        제품 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ProductDetailFrameLayout>
            <div className="min-h-screen bg-gray-50">
                {/* 헤더 */}
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <SimpleBreadcrumb
                            items={[
                                { label: '홈', href: '/' },
                                { label: '제품', href: '/products' },
                                { label: categoryName, href: `/products/category/${product.category}` },
                                { label: getSafeString(product.name), href: '#' }
                            ]}
                        />
                    </div>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">

                        {/* 제품 기본 정보 */}
                        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* 제품 이미지 */}
                                <div>
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <ProductDetailImage
                                            src={product.image || `/images/products/${productId}.jpg`}
                                            alt={getSafeString(product.name)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* 제품 정보 */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                            {getSafeString(product.name)}
                                        </h1>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {getSafeString(product.description)}
                                        </p>
                                    </div>

                                    {/* 제품 특징 */}
                                    {product.features && product.features.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">주요 특징</h3>
                                            <div className="space-y-2">
                                                {product.features.map((feature: any, index: number) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{getSafeString(feature)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 승인번호 */}
                                    {product.approvalNumber && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-5 h-5 text-blue-600" />
                                                <span className="font-semibold text-blue-900">형식승인번호</span>
                                            </div>
                                            <p className="text-blue-800 mt-1">{product.approvalNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 제품 사양 */}
                        {product.specTable && product.specTable.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">제품 사양</h2>
                                <SpecTable data={product.specTable} />
                            </div>
                        )}

                        {/* B타입 전용 섹션들 */}
                        {product.productStyle === 'B' && (
                            <>
                                {/* 규격별 상세 사양 */}
                                {product.detailedSpecTable && product.detailedSpecTable.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">규격별 상세 사양</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-blue-50">
                                                        {product.detailedSpecTable[0]?.map((header: string, index: number) => (
                                                            <th key={index} className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.detailedSpecTable.slice(1).map((row: string[], rowIndex: number) => (
                                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                            {row.map((cell: string, cellIndex: number) => (
                                                                <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-gray-700">
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* 충격흡수 비교 데이터 */}
                                {product.impactAbsorptionData && product.impactAbsorptionData.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">충격흡수 비교 데이터</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-green-50">
                                                        {product.impactAbsorptionData[0]?.map((header: string, index: number) => (
                                                            <th key={index} className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.impactAbsorptionData.slice(1).map((row: string[], rowIndex: number) => (
                                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                            {row.map((cell: string, cellIndex: number) => (
                                                                <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-gray-700">
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* 뒤로가기 버튼 */}
                        <div className="text-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                제품 목록으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProductDetailFrameLayout>
    );
} 