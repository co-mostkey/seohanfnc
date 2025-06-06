'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from '@/components/admin/FileUpload';
import { Trash2, PlusCircle, Video } from 'lucide-react';

export const ProductFormVideos = () => {
    const { control, setValue, watch, register } = useFormContext<ProductFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "videos",
    });

    const videos = watch('videos');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    제품 동영상
                </CardTitle>
                <CardDescription>제품 상세 페이지에 표시될 동영상을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-3 border rounded-lg bg-gray-800/50 space-y-3">
                        <Label>동영상 #{index + 1}</Label>
                        <div className="flex items-start gap-2">
                             <div className="flex-grow space-y-2">
                                <FileUpload
                                    endpoint="/api/admin/upload"
                                    fileType="product-videos"
                                    onUploadSuccess={(file) => {
                                        setValue(`videos.${index}`, file.url, { shouldValidate: true });
                                    }}
                                    currentImageUrl={videos?.[index] ?? ''}
                                    accept="video/*"
                                    buttonText="동영상 업로드"
                                    idSuffix={`video-${index}`}
                                />
                                <div className="flex items-center gap-2">
                                    <Input
                                        {...register(`videos.${index}` as const)}
                                        placeholder="예: /videos/product-video.mp4"
                                        className="flex-grow"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setValue(`videos.${index}`, '', { shouldValidate: true })}
                                    >
                                        경로 삭제
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                                className="mt-8"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append('')}
                    className="w-full mt-2"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    동영상 추가
                </Button>
            </CardContent>
        </Card>
    );
}; 