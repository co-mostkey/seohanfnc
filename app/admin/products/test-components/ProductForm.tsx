'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from '@/components/admin/FileUpload';
import NextImage from 'next/image';
import { PlusCircle, Trash2, ImagePlus, FilePlus, FileScan } from 'lucide-react';
import { toast } from 'sonner';
import { Product, MediaGalleryItem, Document as ProductDocument } from '@/types/product';

interface ProductFormProps {
    initialData?: Product | null;
    onSubmit: (data: Product) => void;
    isSubmitting?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting = false
}) => {
    // Product를 ProductFormData로 변환하는 함수
    const transformToFormData = (product: Product | null | undefined): Partial<ProductFormData> => {
        if (!product) {
            return {
                id: '',
                nameKo: '',
                name: '',
                descriptionKo: '',
                description: '',
                categoryId: '',
                image: '',
                gallery_images_data: [],
                documents: [],
                features: [],
                showInProductList: false,
                isSummaryPage: false
            };
        }

        return {
            id: product.id,
            nameKo: product.nameKo || '',
            name: typeof product.name === 'string' ? product.name : (product.name as any)?.en || '',
            descriptionKo: product.descriptionKo || '',
            description: typeof product.description === 'string' ? product.description : (product.description as any)?.en || '',
            categoryId: product.categoryId || product.productCategoryId || '',
            image: product.image,
            gallery_images_data: product.gallery_images_data || [],
            documents: product.documents || [],
            features: product.features || [],
            showInProductList: product.showInProductList ?? true,
            isSummaryPage: product.isSummaryPage ?? false
        };
    };

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: transformToFormData(initialData)
    });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } =
        useFieldArray({ control, name: "features" });

    const { fields: galleryImageFields, append: appendGalleryImage, remove: removeGalleryImage } =
        useFieldArray({ control, name: "gallery_images_data" });

    const { fields: documentFields, append: appendDocument, remove: removeDocument } =
        useFieldArray({ control, name: "documents" });

    const watchedImage = watch('image');
    const watchedGalleryImages = watch('gallery_images_data');
    const watchedDocuments = watch('documents');

    const onFormSubmit = (data: ProductFormData) => {
        console.log('Form data submitted:', data);
        onSubmit(data as unknown as Product);
    };

    const handleFileDelete = async (
        filePathToDelete: string,
        fieldName: keyof ProductFormData,
        listIndex?: number,
        subFieldName?: 'src' | 'path'
    ) => {
        if (!filePathToDelete) {
            toast.error("삭제할 파일 경로가 없습니다.");
            return;
        }

        if (!confirm(`정말로 이 파일을 서버에서 삭제하시겠습니까?\n경로: ${filePathToDelete}\n이 작업은 되돌릴 수 없습니다.`)) return;

        try {
            const response = await fetch(`/api/admin/upload?fileUrl=${encodeURIComponent(filePathToDelete)}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('파일이 성공적으로 서버에서 삭제되었습니다.');

                if (listIndex !== undefined && subFieldName) {
                    // 배열 내 객체의 파일 경로 필드 업데이트 (예: gallery_images_data[0].src = '')
                    setValue(`${fieldName}.${listIndex}.${subFieldName}` as any, '', { shouldValidate: true });
                } else {
                    // 단일 파일 경로 필드 업데이트 (예: image = '')
                    setValue(fieldName as any, '', { shouldValidate: true });
                }
            } else {
                toast.error(`서버 파일 삭제 실패: ${result.message || '알 수 없는 오류'}`);
            }
        } catch (err: any) {
            toast.error(`파일 삭제 중 클라이언트 오류 발생: ${err.message}`);
            console.error("File delete error:", err);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>기본 정보</CardTitle>
                        <CardDescription>제품의 기본적인 정보를 입력합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="id">제품 ID</Label>
                            <Input id="id" {...register('id')} disabled={!!initialData} />
                            {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="categoryId">카테고리 ID</Label>
                            <Input id="categoryId" {...register('categoryId')} />
                            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="nameKo">제품명 (한글)</Label>
                            <Input id="nameKo" {...register('nameKo')} />
                            {errors.nameKo && <p className="text-red-500 text-xs mt-1">{errors.nameKo.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="name">제품명 (영문)</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="descriptionKo">제품 설명 (한글)</Label>
                            <Textarea id="descriptionKo" {...register('descriptionKo')} rows={3} />
                            {errors.descriptionKo && <p className="text-red-500 text-xs mt-1">{errors.descriptionKo.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="description">제품 설명 (영문)</Label>
                            <Textarea id="description" {...register('description')} rows={3} />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="image">대표 이미지</Label>
                            {watchedImage && (
                                <div className="mt-2 space-y-2 p-2 border rounded-md bg-gray-700/30">
                                    <NextImage
                                        src={watchedImage}
                                        alt="대표 이미지 미리보기"
                                        width={120}
                                        height={120}
                                        className="rounded-md object-cover border border-gray-600"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <p className="text-xs text-gray-400 truncate" title={watchedImage}>
                                        현재 경로: {watchedImage}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const newPath = prompt("새로운 이미지 경로를 입력하세요:", watchedImage || '');
                                                if (newPath !== null) setValue("image", newPath);
                                            }}
                                            className="text-xs"
                                        >
                                            경로 수정
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="xs"
                                            onClick={() => handleFileDelete(watchedImage, 'image')}
                                            className="text-xs"
                                        >
                                            서버 파일 삭제
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="mt-2">
                                <FileUpload
                                    endpoint="/api/admin/upload"
                                    onUploadSuccess={(file) => setValue("image", file.url)}
                                    onUploadError={(err) => toast.error(`대표 이미지 업로드 실패: ${err}`)}
                                    productId="temp-product-id"
                                    fileType="products/temp/thumbnails"
                                    accept="image/*"
                                    multiple={false}
                                    maxFiles={1}
                                />
                            </div>
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* 문서 자료 */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>문서/자료</CardTitle>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => appendDocument({ id: crypto.randomUUID(), name: '', path: '', type: 'pdf' } as ProductDocument)}
                            >
                                <FilePlus className="h-4 w-4 mr-2" /> 새 문서 추가
                            </Button>
                        </div>
                        <CardDescription>제품 관련 문서(PDF, DOC 등)를 관리합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {documentFields.map((field, index) => (
                            <div key={field.id} className="p-3 border rounded-md bg-gray-800 space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base">문서 #{index + 1}</Label>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeDocument(index)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Input {...register(`documents.${index}.name`)} placeholder="문서 표시 이름" />
                                {errors.documents?.[index]?.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.documents[index]?.name?.message}</p>
                                )}
                                <div>
                                    <Label htmlFor={`doc_type_${index}`}>문서 타입</Label>
                                    <select
                                        {...register(`documents.${index}.type`)}
                                        className="w-full p-2 mt-1 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="docx">DOCX</option>
                                        <option value="xlsx">XLSX</option>
                                        <option value="pptx">PPTX</option>
                                        <option value="zip">ZIP</option>
                                        <option value="hwp">HWP</option>
                                        <option value="txt">TXT</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>문서 파일</Label>
                                    {watchedDocuments?.[index]?.path && (
                                        <div className="mt-1 space-y-2 p-2 border rounded-md bg-gray-700/50">
                                            <div className="flex items-center space-x-2">
                                                <FileScan className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                                <a
                                                    href={watchedDocuments[index].path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-300 hover:underline truncate"
                                                    title={watchedDocuments[index].path}
                                                >
                                                    다운로드: {watchedDocuments[index].path.split('/').pop()}
                                                </a>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => {
                                                        const newPath = prompt("새로운 파일 경로를 입력하세요:", watchedDocuments[index].path || '');
                                                        if (newPath !== null) {
                                                            setValue(`documents.${index}.path`, newPath);
                                                        }
                                                    }}
                                                >
                                                    경로 수정
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="xs"
                                                    onClick={() => handleFileDelete(watchedDocuments[index].path, 'documents', index, 'path')}
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
                                                setValue(`documents.${index}.path`, file.url);
                                            }}
                                            onUploadError={(err) => toast.error(`문서 파일 업로드 실패: ${err}`)}
                                            productId={initialData?.id || 'temp-product-id'}
                                            fileType={initialData?.id ? `products/${initialData.id}/documents` : 'temp/documents'}
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.hwp,.txt"
                                            maxFiles={1}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {watchedDocuments?.[index]?.path
                                            ? '다른 파일을 업로드하여 교체할 수 있습니다.'
                                            : '새 파일을 업로드하거나 위 필드에 직접 경로를 입력하세요.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {documentFields.length === 0 && (
                            <p className="text-sm text-gray-500">추가된 문서가 없습니다.</p>
                        )}
                    </CardContent>
                </Card>

                {/* 갤러리 이미지 */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>갤러리 이미지</CardTitle>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => appendGalleryImage({ id: crypto.randomUUID(), src: '', alt: '', type: 'image' } as MediaGalleryItem)}
                            >
                                <ImagePlus className="h-4 w-4 mr-2" /> 이미지 추가
                            </Button>
                        </div>
                        <CardDescription>제품 상세 페이지의 이미지 갤러리에 표시될 이미지들입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {galleryImageFields.map((field, index) => (
                            <div key={field.id} className="p-3 border rounded-md bg-gray-800 space-y-3">
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
                                />
                                {errors.gallery_images_data?.[index]?.alt && (
                                    <p className="text-red-500 text-xs mt-1">{errors.gallery_images_data[index]?.alt?.message}</p>
                                )}
                                <Textarea
                                    {...register(`gallery_images_data.${index}.description`)}
                                    placeholder="이미지 상세 설명"
                                    rows={2}
                                />
                                <div>
                                    <Label>이미지 파일</Label>
                                    {watchedGalleryImages?.[index]?.src && (
                                        <div className="mt-1 space-y-2 p-2 border rounded-md bg-gray-700/50">
                                            <NextImage
                                                src={watchedGalleryImages[index].src}
                                                alt={watchedGalleryImages[index].alt || `갤러리 이미지 ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="rounded-md object-cover border border-gray-600"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            <p className="text-xs text-gray-400 truncate" title={watchedGalleryImages[index].src}>
                                                현재 경로: {watchedGalleryImages[index].src}
                                            </p>
                                            <div className="flex space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => {
                                                        const newPath = prompt("새 경로:", watchedGalleryImages[index].src);
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
                                                        watchedGalleryImages[index].src,
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
                                                setValue(`gallery_images_data.${index}.src`, file.url);
                                            }}
                                            onUploadError={(err) => toast.error(`갤러리 이미지 업로드 실패: ${err}`)}
                                            productId={initialData?.id || 'temp-product-id'}
                                            fileType={initialData?.id ? `products/${initialData.id}/gallery/images` : 'temp/gallery/images'}
                                            accept="image/*"
                                            maxFiles={1}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {watchedGalleryImages?.[index]?.src
                                            ? '다른 파일을 업로드하여 교체하세요.'
                                            : '새 파일을 업로드하세요.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {galleryImageFields.length === 0 && (
                            <p className="text-sm text-gray-500">추가된 갤러리 이미지가 없습니다.</p>
                        )}
                    </CardContent>
                </Card>

                {/* 주요 특징 */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>주요 특징</CardTitle>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => appendFeature({ title: '', description: '' })}
                            >
                                <PlusCircle className="h-4 w-4 mr-2" /> 특징 추가
                            </Button>
                        </div>
                        <CardDescription>제품의 주요 특징과 기능을 기술합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {featureFields.map((field, index) => (
                            <div key={field.id} className="p-3 border rounded-md bg-gray-800 space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>특징 #{index + 1}</Label>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeFeature(index)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Input {...register(`features.${index}.title`)} placeholder="특징 제목" />
                                {errors.features?.[index]?.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.features[index]?.title?.message}</p>
                                )}
                                <Textarea {...register(`features.${index}.description`)} placeholder="특징 설명" rows={2} />
                                {errors.features?.[index]?.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.features[index]?.description?.message}</p>
                                )}
                            </div>
                        ))}
                        {featureFields.length === 0 && (
                            <p className="text-sm text-gray-500">추가된 특징이 없습니다.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={isSubmitting}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '저장 중...' : (initialData ? '제품 수정' : '제품 추가')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm; 