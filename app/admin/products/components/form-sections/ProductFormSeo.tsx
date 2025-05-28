'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormSeoProps {
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    watch: UseFormWatch<ProductFormData>; // watch is needed for generateStructuredData
    generateStructuredData: () => void;
}

export const ProductFormSeo: React.FC<ProductFormSeoProps> = ({
    register,
    errors,
    setValue,
    watch, // Destructure watch here
    generateStructuredData,
}) => {
    return (
        <Card className="mb-6 shadow-sm">
            <CardHeader className="bg-gray-900 border-b border-gray-700">
                <CardTitle>SEO / LLM 최적화</CardTitle>
                <CardDescription>검색 엔진 및 LLM이 제품 정보를 더 잘 이해하도록 구조화 데이터를 제공합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-base">JSON-LD 데이터</Label>
                    <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={generateStructuredData}>자동 생성</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setValue('seoStructuredData', '')}>초기화</Button>
                    </div>
                </div>
                <Textarea
                    rows={8}
                    {...register('seoStructuredData')}
                    placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "제품명...",\n  ...\n}'}
                    className="bg-gray-900 border-gray-700 text-gray-100 font-mono text-xs"
                />
                {errors.seoStructuredData && <p className="text-red-500 text-xs mt-1">{errors.seoStructuredData.message}</p>}
                <p className="text-xs text-gray-500">구조화 데이터를 입력하면 페이지 head에 JSON-LD <code className="bg-gray-800 px-1 rounded">&lt;script&gt;</code> 태그로 삽입되어 검색 최적화에 활용됩니다.</p>
            </CardContent>
        </Card>
    );
}; 