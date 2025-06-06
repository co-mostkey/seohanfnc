'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from '@/components/admin/FileUpload';
import { Image as ImageIcon } from 'lucide-react';

export const ProductFormPageSettings = () => {
    const { register, setValue, watch } = useFormContext<ProductFormData>();

    const pageBackgroundImage = watch('pageBackgroundImage');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    페이지 설정 (B타입 전용)
                </CardTitle>
                <CardDescription>상세 페이지의 배경 이미지 등 표시 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>페이지 배경 이미지</Label>
                    <FileUpload
                        endpoint="/api/admin/upload"
                        fileType="product-backgrounds"
                        onUploadSuccess={(file) => {
                            setValue('pageBackgroundImage', file.url, { shouldValidate: true });
                        }}
                        currentImageUrl={pageBackgroundImage}
                        accept="image/*"
                        buttonText="배경 이미지 업로드"
                        idSuffix="page-background"
                    />
                    {pageBackgroundImage && (
                        <div className="flex items-center gap-2 mt-2">
                            <Input
                                {...register("pageBackgroundImage")}
                                placeholder="예: /images/products/background.jpg"
                                className="flex-grow"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setValue('pageBackgroundImage', '', { shouldValidate: true })}
                            >
                                경로 삭제
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 