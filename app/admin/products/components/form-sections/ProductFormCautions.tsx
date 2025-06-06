'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle } from 'lucide-react';

export const ProductFormCautions = () => {
    const { control, register, formState: { errors } } = useFormContext<ProductFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "cautions",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>주의사항</CardTitle>
                <CardDescription>제품 사용 시 고객에게 안내할 주의사항을 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-800/50">
                        <Input
                            {...register(`cautions.${index}` as const)}
                            placeholder={`주의사항 #${index + 1}`}
                            className="flex-grow"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append('')}
                    className="w-full mt-2"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    주의사항 추가
                </Button>
            </CardContent>
        </Card>
    );
}; 