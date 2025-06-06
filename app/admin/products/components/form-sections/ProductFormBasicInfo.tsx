'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormData } from '@/lib/validators/product-validator';

// Define CATEGORIES directly in the file to remove external dependency
const CATEGORIES = [
    { label: '안전보호구', value: 'safety-protection' },
    { label: '소방안전용품', value: 'fire-safety' },
    { label: '교통안전용품', value: 'traffic-safety' },
    { label: '계절용품', value: 'seasonal-items' },
    { label: '기타', value: 'etc' },
];

export const ProductFormBasicInfo = () => {
    const { register, formState: { errors }, control } = useFormContext<ProductFormData>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Style Selector */}
                <div className="space-y-2">
                    <Label htmlFor="productStyle">제품 스타일</Label>
                    <Select
                        defaultValue={control._defaultValues.productStyle || 'A'}
                        onValueChange={(value) => control.setValue('productStyle', value as 'A' | 'B')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="스타일 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">A타입 (기본)</SelectItem>
                            <SelectItem value="B">B타입 (확장/에어매트)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">B타입 선택 시 3D모델, 상세사양 등 추가 입력폼이 나타납니다.</p>
                </div>

                {/* Product ID */}
                <div className="space-y-2">
                    <Label htmlFor="id">제품 ID</Label>
                    <Input id="id" {...register("id")} placeholder="예: Cylinder-Type-SafetyAirMat" />
                    {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
                </div>

                {/* Product Name (Korean) */}
                <div className="space-y-2">
                    <Label htmlFor="nameKo">제품명 (한글)</Label>
                    <Input id="nameKo" {...register("nameKo")} placeholder="예: 실린더형 공기안전매트" />
                    {errors.nameKo && <p className="text-red-500 text-sm">{errors.nameKo.message}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="categoryId">카테고리</Label>
                    <Select
                        defaultValue={control._defaultValues.categoryId}
                        onValueChange={(value) => control.setValue('categoryId', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                </div>

                {/* Description (Korean) */}
                <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="descriptionKo">제품 설명 (한글)</Label>
                    <Textarea id="descriptionKo" {...register("descriptionKo")} placeholder="제품에 대한 설명을 입력하세요." />
                </div>
            </CardContent>
        </Card>
    );
}; 