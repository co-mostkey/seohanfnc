'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export const ProductFormSpecifications = () => {
    const { control, register } = useFormContext<ProductFormData>();

    const { fields: specificationFields, append: appendSpecification, remove: removeSpecification } = useFieldArray({
        control,
        name: "specifications"
    });

    const { fields: detailedSpecTableFields, append: appendDetailedSpecTable, remove: removeDetailedSpecTable } = useFieldArray({
        control,
        name: "detailedSpecTable"
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>상세 사양</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Simple Key-Value Specifications */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">기본 사양</h4>
                        <Button type="button" onClick={() => appendSpecification({ key: '', value: '' })}>
                            기본 사양 추가
                        </Button>
                    </div>
                    {specificationFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            <div className="absolute top-2 right-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeSpecification(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <Label>항목 (Key)</Label>
                                <Input {...register(`specifications.${index}.key`)} />
                            </div>
                            <div>
                                <Label>값 (Value)</Label>
                                <Input {...register(`specifications.${index}.value`)} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Spec Table */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">상세 사양표</h4>
                        <Button type="button" onClick={() => appendDetailedSpecTable({ specName: '', details: '' })}>
                            상세 사양표 추가
                        </Button>
                    </div>
                    {detailedSpecTableFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                            <div className="absolute top-2 right-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeDetailedSpecTable(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <Label>사양명</Label>
                                <Input {...register(`detailedSpecTable.${index}.specName`)} />
                            </div>
                            <div>
                                <Label>상세 내용</Label>
                                <Textarea {...register(`detailedSpecTable.${index}.details`)} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}; 