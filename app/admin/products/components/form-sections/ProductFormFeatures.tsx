'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from 'lucide-react';

export const ProductFormFeatures = () => {
    const { control, register } = useFormContext<ProductFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "features"
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>주요 특징</CardTitle>
                    <Button
                        type="button"
                        onClick={() => append({ title: '', description: '', icon: '' })}
                    >
                        특징 추가
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                        <div className="absolute top-2 right-2">
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Label>특징 제목</Label>
                            <Input {...register(`features.${index}.title`)} />
                        </div>
                        <div>
                            <Label>특징 설명</Label>
                            <Textarea {...register(`features.${index}.description`)} />
                        </div>
                        <div>
                            <Label>아이콘 (Lucide Icon Name)</Label>
                            <Input {...register(`features.${index}.icon`)} placeholder="e.g., CheckCircle" />
                        </div>
                    </div>
                ))}
                {fields.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground">추가된 특징이 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}; 