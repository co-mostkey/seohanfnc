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

                {/* 3D 모델 표시 설정 */}
                <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-lg font-semibold text-white">3D 모델 표시 설정</h4>

                    {/* 스케일 조정 */}
                    <div className="space-y-2">
                        <Label htmlFor="model3D.scale">모델 크기 (Scale)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                {...register("model3D.scale", { valueAsNumber: true })}
                                type="number"
                                step="0.001"
                                min="0.001"
                                max="100"
                                placeholder="0.095"
                                className="w-32"
                            />
                            <span className="text-sm text-gray-400">범위: 0.001 ~ 100</span>
                        </div>
                        <p className="text-xs text-gray-500">기본값: 0.095 (값이 클수록 모델이 커집니다)</p>
                    </div>

                    {/* 위치 조정 */}
                    <div className="space-y-3">
                        <Label>모델 위치 (Position)</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="model3D.position.x" className="text-sm">X축</Label>
                                <Input
                                    {...register("model3D.position.x", { valueAsNumber: true })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="model3D.position.y" className="text-sm">Y축</Label>
                                <Input
                                    {...register("model3D.position.y", { valueAsNumber: true })}
                                    type="number"
                                    step="0.1"
                                    placeholder="-0.5"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="model3D.position.z" className="text-sm">Z축</Label>
                                <Input
                                    {...register("model3D.position.z", { valueAsNumber: true })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">기본값: X=0, Y=-0.5, Z=0</p>
                    </div>

                    {/* 회전 조정 */}
                    <div className="space-y-3">
                        <Label>모델 회전 (Rotation)</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="model3D.rotation.x" className="text-sm">X축 (라디안)</Label>
                                <Input
                                    {...register("model3D.rotation.x", { valueAsNumber: true })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="model3D.rotation.y" className="text-sm">Y축 (라디안)</Label>
                                <Input
                                    {...register("model3D.rotation.y", { valueAsNumber: true })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="model3D.rotation.z" className="text-sm">Z축 (라디안)</Label>
                                <Input
                                    {...register("model3D.rotation.z", { valueAsNumber: true })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0"
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">기본값: X=0, Y=0, Z=0 (1라디안 ≈ 57.3도)</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};