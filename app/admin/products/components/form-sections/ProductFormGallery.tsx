'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, FieldArrayWithId } from 'react-hook-form';
import { ProductFormData, MediaGalleryItemFormData } from '@/lib/validators/product-validator'; // Assuming MediaGalleryItemFormData is part of this
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from '@/components/admin/FileUpload';
import NextImage from 'next/image';
import { ImagePlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { MediaGalleryItem, Product } from '@/types/product';

interface ProductFormGalleryProps {
    control: Control<ProductFormData>;
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    handleFileDelete: (
        filePathToDelete: string,
        fieldName: keyof ProductFormData,
        listIndex?: number,
        subFieldName?: 'src' | 'path'
    ) => Promise<void>;
    galleryImageFields: FieldArrayWithId<ProductFormData, "gallery_images_data", "id">[];
    appendGalleryImage: (value: MediaGalleryItemFormData, options?: { shouldFocus?: boolean }) => void;
    removeGalleryImage: (index?: number | number[] | undefined) => void;
    initialData?: Product | null; // For productId for FileUpload path
}

export const ProductFormGallery: React.FC<ProductFormGalleryProps> = ({
    control,
    register,
    errors,
    watch,
    setValue,
    handleFileDelete,
    galleryImageFields,
    appendGalleryImage,
    removeGalleryImage,
    initialData
}) => {
    const productIdForPaths = initialData?.id || 'temp-product-id';

    return (
        <Card className="mb-6 shadow-sm">
            <CardHeader className="bg-gray-900 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <CardTitle>갤러리 이미지</CardTitle>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => appendGalleryImage({
                            id: crypto.randomUUID(),
                            src: '',
                            alt: '',
                            type: 'image'
                        })}
                    >
                        <ImagePlus className="h-4 w-4 mr-2" /> 이미지 추가
                    </Button>
                </div>
                <CardDescription>제품 상세 페이지의 이미지 갤러리에 표시될 이미지들입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                {galleryImageFields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-700 rounded-md bg-gray-800 space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-base">이미지 #{index + 1}</Label>
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeGalleryImage(index)}
                                className="text-red-500 hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Input
                            {...register(`gallery_images_data.${index}.alt`)}
                            placeholder="대체 텍스트 (alt)"
                            className="bg-gray-900 border-gray-700 text-gray-100"
                        />
                        {errors.gallery_images_data?.[index]?.alt && (
                            <p className="text-red-500 text-xs mt-1">{errors.gallery_images_data[index]?.alt?.message}</p>
                        )}
                        <Textarea
                            {...register(`gallery_images_data.${index}.description`)}
                            placeholder="이미지 상세 설명"
                            rows={2}
                            className="bg-gray-900 border-gray-700 text-gray-100"
                        />
                        <div>
                            <Label>이미지 파일</Label>
                            {watch(`gallery_images_data.${index}.src`) && (
                                <div className="mt-1 space-y-2 p-2 border rounded-md bg-gray-800">
                                    <NextImage
                                        src={watch(`gallery_images_data.${index}.src`)!}
                                        alt={watch(`gallery_images_data.${index}.alt`) || `갤러리 이미지 ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover border border-gray-200"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <p className="text-xs text-gray-500 truncate" title={watch(`gallery_images_data.${index}.src`)!}>
                                        현재 경로: {watch(`gallery_images_data.${index}.src`)!}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="xs"
                                            onClick={() => {
                                                const newPath = prompt("새 경로:", watch(`gallery_images_data.${index}.src`));
                                                if (newPath) {
                                                    setValue(`gallery_images_data.${index}.src`, newPath);
                                                }
                                            }}
                                        >
                                            경로 수정
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="xs"
                                            onClick={() => handleFileDelete(
                                                watch(`gallery_images_data.${index}.src`)!,
                                                'gallery_images_data',
                                                index,
                                                'src'
                                            )}
                                        >
                                            서버 파일 삭제
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="mt-2">
                                <FileUpload
                                    endpoint="/api/admin/upload"
                                    onUploadSuccess={(file) => {
                                        setValue(`gallery_images_data.${index}.src`, file.url, { shouldValidate: true });
                                        const altText = file.originalName?.split('.').slice(0, -1).join('.') || file.filename?.split('.').slice(0, -1).join('.') || 'Uploaded image';
                                        setValue(`gallery_images_data.${index}.alt`, altText);
                                    }}
                                    onUploadError={(err) => toast.error(`갤러리 이미지 업로드 실패: ${err}`)}
                                    productId={productIdForPaths}
                                    fileType={initialData?.id ? `products/${initialData.id}/gallery` : 'temp/gallery'}
                                    accept="image/*"
                                    maxFiles={1}
                                    idSuffix={`gallery-${index}`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {watch(`gallery_images_data.${index}.src`)
                                    ? '다른 파일을 업로드하여 교체하세요.'
                                    : '새 파일을 업로드하세요.'}
                            </p>
                        </div>
                    </div>
                ))}
                {galleryImageFields.length === 0 && (
                    <p className="text-sm text-gray-500 p-4 text-center bg-gray-800 rounded-md">추가된 갤러리 이미지가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}; 