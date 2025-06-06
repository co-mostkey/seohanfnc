'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { FileUpload } from '@/components/admin/FileUpload'; // FileUpload might be needed

export const ProductFormModel3D = () => {
    const { register, formState: { errors } } = useFormContext<ProductFormData>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>3D 모델 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="modelName">모델명</Label>
                    <Input {...register("model3D.modelName")} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="modelNumber">모델 번호</Label>
                    <Input {...register("model3D.modelNumber")} />
                </div>
                <div className="space-y-2">
                    <Label>모델 이미지 경로</Label>
                    <Input {...register("model3D.modelImage")} placeholder="/path/to/model_image.jpg" />
                    {/* Ideally, use FileUpload component here */}
                </div>
                <div className="space-y-2">
                    <Label>GLB 파일 경로</Label>
                    <Input {...register("model3D.glbFile")} placeholder="/path/to/model.glb" />
                    {/* Ideally, use FileUpload component here */}
                </div>
            </CardContent>
        </Card>
    );
};