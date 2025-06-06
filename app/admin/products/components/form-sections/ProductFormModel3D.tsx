'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from '@/components/admin/FileUpload'; // FileUpload import
import { Button } from '@/components/ui/button';

export const ProductFormModel3D = () => {
    const { register, formState: { errors }, setValue, watch } = useFormContext<ProductFormData>();

    const modelImage = watch('model3D.modelImage');
    const glbFile = watch('model3D.glbFile');

    return (
        <Card>
            <CardHeader>
                <CardTitle>3D 모델 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="modelName">모델명</Label>
                        <Input {...register("model3D.modelName")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="modelNumber">모델 번호</Label>
                        <Input {...register("model3D.modelNumber")} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>모델 이미지</Label>
                        <FileUpload
                            endpoint="/api/admin/upload"
                            fileType="product-assets"
                            onUploadSuccess={(file) => {
                                setValue('model3D.modelImage', file.url, { shouldValidate: true });
                            }}
                            currentImageUrl={modelImage}
                            accept="image/*"
                            buttonText="이미지 업로드"
                            idSuffix="model-image"
                        />
                        {modelImage && (
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                    {...register("model3D.modelImage")}
                                    placeholder="/path/to/model_image.jpg"
                                    className="flex-grow"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setValue('model3D.modelImage', '', { shouldValidate: true })}
                                >
                                    경로 삭제
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>GLB 파일</Label>
                        <FileUpload
                            endpoint="/api/admin/upload"
                            fileType="product-assets"
                            onUploadSuccess={(file) => {
                                setValue('model3D.glbFile', file.url, { shouldValidate: true });
                            }}
                            currentImageUrl={glbFile}
                            accept=".glb"
                            buttonText="GLB 파일 업로드"
                            idSuffix="glb-file"
                        />
                        {glbFile && (
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                    {...register("model3D.glbFile")}
                                    placeholder="/path/to/model.glb"
                                    className="flex-grow"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setValue('model3D.glbFile', '', { shouldValidate: true })}
                                >
                                    경로 삭제
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};