'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle, Award } from 'lucide-react';

export const ProductFormCertifications = () => {
    const { control, register, formState: { errors } } = useFormContext<ProductFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "certifications",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    인증 및 특허
                </CardTitle>
                <CardDescription>제품이 받은 인증, 특허, 수상 내역 등을 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-lg bg-gray-800/50 relative">
                        <div className="space-y-1">
                            <Label>인증명</Label>
                            <Input
                                {...register(`certifications.${index}.title` as const)}
                                placeholder="예: KFI 인정"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>인증번호 또는 설명</Label>
                            <Input
                                {...register(`certifications.${index}.description` as const)}
                                placeholder="예: 제 20-21호"
                            />
                        </div>
                        <div className="absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ title: '', description: '' })}
                    className="w-full mt-2"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    인증 추가
                </Button>
            </CardContent>
        </Card>
    );
}; 