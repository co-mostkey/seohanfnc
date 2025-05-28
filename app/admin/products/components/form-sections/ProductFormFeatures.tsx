'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, FieldArrayWithId } from 'react-hook-form';
import { ProductFormData, FeatureFormData } from '@/lib/validators/product-validator'; // Assuming FeatureFormData is part of this or defined separately
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from 'lucide-react';

interface ProductFormFeaturesProps {
    control: Control<ProductFormData>;
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
    featureFields: FieldArrayWithId<ProductFormData, "features", "id">[];
    appendFeature: (value: FeatureFormData, options?: { shouldFocus?: boolean }) => void;
    removeFeature: (index?: number | number[] | undefined) => void;
}

export const ProductFormFeatures: React.FC<ProductFormFeaturesProps> = ({
    control,
    register,
    errors,
    setValue,
    watch,
    featureFields,
    appendFeature,
    removeFeature
}) => {
    return (
        <Card className="mb-6 shadow-sm">
            <CardHeader className="bg-gray-900 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <CardTitle>주요 특징</CardTitle>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => appendFeature({ title: '', description: '' })}
                    >
                        <PlusCircle className="h-4 w-4 mr-2" /> 특징 추가
                    </Button>
                </div>
                <CardDescription>제품의 주요 특징과 기능을 기술합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                {featureFields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-700 rounded-md bg-gray-800 space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>특징 #{index + 1}</Label>
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFeature(index)}
                                className="text-red-500 hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Input {...register(`features.${index}.title`)} placeholder="특징 제목" className="bg-gray-900 border-gray-700 text-gray-100" />
                        {errors.features?.[index]?.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.features[index]?.title?.message}</p>
                        )}
                        <Textarea {...register(`features.${index}.description`)} placeholder="특징 설명" rows={2} className="bg-gray-900 border-gray-700 text-gray-100" />
                        {errors.features?.[index]?.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.features[index]?.description?.message}</p>
                        )}
                    </div>
                ))}
                {featureFields.length === 0 && (
                    <p className="text-sm text-gray-500 p-4 text-center bg-gray-800 rounded-md">추가된 특징이 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}; 