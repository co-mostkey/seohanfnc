'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from '@/components/admin/FileUpload';
import NextImage from 'next/image';
import { Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/product'; // Product 타입이 필요할 수 있으므로 추가

interface ProductFormBasicInfoProps {
    control: Control<ProductFormData>;
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
    handleFileDelete: (
        filePathToDelete: string,
        fieldName: keyof ProductFormData,
        listIndex?: number,
        subFieldName?: 'src' | 'path'
    ) => Promise<void>;
    initialData?: Product | null; // productId, fileType 경로 생성에 사용
}

const ProductFormBasicInfo: React.FC<ProductFormBasicInfoProps> = ({
    control,
    register,
    errors,
    setValue,
    watch,
    handleFileDelete,
    initialData
}) => {
    const productIdForPaths = initialData?.id || 'temp-product';
    const watchedImage = watch('image');
    const watchedPageBackgroundImage = watch('pageBackgroundImage');
    const watchedProductStyle = watch('productStyle');

    // 페이지 히어로 서브타이틀 필드 배열 관리
    const { fields: pageHeroSubtitleFields, append: appendPageHeroSubtitle, remove: removePageHeroSubtitle } =
        useFieldArray({ control, name: "pageHeroSubtitles" });

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-orange-400">기본 정보</CardTitle>
                <CardDescription className="text-gray-400">
                    제품의 기본 정보를 입력하세요.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="id">제품 ID *</Label>
                        <Input id="id" {...register('id')} placeholder="product-id-example" />
                        {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="categoryId">카테고리 ID *</Label>
                        <Input id="categoryId" {...register('categoryId')} placeholder="safety-equipment" />
                        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                    </div>
                </div>

                {/* 제품 스타일 선택 */}
                <div>
                    <Label htmlFor="productStyle">제품 스타일 *</Label>
                    <div className="mt-2">
                        <select
                            {...register('productStyle')}
                            className="w-full p-2 rounded-md bg-gray-900 border border-gray-700 text-gray-100 focus:border-orange-500 outline-none"
                        >
                            <option value="A">A타입 - 기본 업로드 스타일</option>
                            <option value="B">B타입 - 확장 스타일 (상세 사양표, 3D 모델, 기술 데이터 등)</option>
                        </select>
                    </div>
                    {errors.productStyle && <p className="text-red-500 text-xs mt-1">{errors.productStyle.message}</p>}

                    {/* 스타일 설명 */}
                    <div className="mt-2 p-3 bg-gray-900/50 rounded-md border border-gray-700/50">
                        <div className="flex items-start space-x-2">
                            <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-gray-400">
                                {watchedProductStyle === 'B' ? (
                                    <div>
                                        <p className="font-medium text-blue-400 mb-1">B타입 - 확장 스타일</p>
                                        <p>• 상세 규격별 사양표 (모델별 비교)</p>
                                        <p>• 3D 모델 정보 및 이미지</p>
                                        <p>• 기술 데이터 및 인증 정보</p>
                                        <p>• 전문적인 제품 문서 레이아웃</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-medium text-green-400 mb-1">A타입 - 기본 업로드 스타일</p>
                                        <p>• 표준 제품 정보 레이아웃</p>
                                        <p>• 기본 갤러리 및 문서 표시</p>
                                        <p>• 일반적인 제품 소개 형식</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="nameKo">한글 제품명 *</Label>
                        <Input id="nameKo" {...register('nameKo')} placeholder="실린더형 공기안전매트" />
                        {errors.nameKo && <p className="text-red-500 text-xs mt-1">{errors.nameKo.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="nameEn">영문 제품명</Label>
                        <Input id="nameEn" {...register('nameEn')} placeholder="Cylinder Type Safety Air Mat" />
                        {errors.nameEn && <p className="text-red-500 text-xs mt-1">{errors.nameEn.message}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="descriptionKo">한글 제품 설명 *</Label>
                    <Textarea
                        id="descriptionKo"
                        {...register('descriptionKo')}
                        placeholder="제품에 대한 상세한 설명을 입력하세요..."
                        rows={4}
                    />
                    {errors.descriptionKo && <p className="text-red-500 text-xs mt-1">{errors.descriptionKo.message}</p>}
                </div>

                <div>
                    <Label htmlFor="descriptionEn">영문 제품 설명</Label>
                    <Textarea
                        id="descriptionEn"
                        {...register('descriptionEn')}
                        placeholder="Enter detailed product description in English..."
                        rows={4}
                    />
                    {errors.descriptionEn && <p className="text-red-500 text-xs mt-1">{errors.descriptionEn.message}</p>}
                </div>

                {/* 대표 이미지 */}
                <div>
                    <Label htmlFor="image">대표 이미지 *</Label>
                    {watchedImage && (
                        <div className="mt-2 relative w-32 h-32 border border-gray-600 rounded-md overflow-hidden">
                            <NextImage
                                src={watchedImage}
                                alt="대표 이미지 미리보기"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleFileDelete(watchedImage, 'image')}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    <div className="mt-2">
                        <FileUpload
                            endpoint="/api/admin/upload"
                            onUploadSuccess={(file) => setValue("image", file.url, { shouldValidate: true })}
                            onUploadError={(err) => toast.error(`대표 이미지 업로드 실패: ${err}`)}
                            productId={productIdForPaths}
                            fileType={initialData?.id ? `products/${initialData.id}/thumbnails` : 'temp/thumbnails'}
                            accept="image/*"
                            multiple={false}
                            maxFiles={1}
                        />
                    </div>
                    {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                </div>

                {/* 페이지 배경 이미지 */}
                <div>
                    <Label htmlFor="pageBackgroundImage">페이지 배경 이미지 (옵션)</Label>
                    {watchedPageBackgroundImage && (
                        <div className="mt-2 relative w-32 h-20 border border-gray-600 rounded-md overflow-hidden">
                            <NextImage
                                src={watchedPageBackgroundImage}
                                alt="배경 이미지 미리보기"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleFileDelete(watchedPageBackgroundImage, 'pageBackgroundImage')}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    <div className="mt-2">
                        <FileUpload
                            endpoint="/api/admin/upload"
                            onUploadSuccess={(file) => setValue('pageBackgroundImage', file.url, { shouldValidate: true })}
                            onUploadError={(err) => toast.error(`배경 이미지 업로드 실패: ${err}`)}
                            productId={productIdForPaths}
                            fileType={initialData?.id ? `products/${initialData.id}/background` : 'temp/background'}
                            accept="image/*"
                            multiple={false}
                            maxFiles={1}
                        />
                    </div>
                    {errors.pageBackgroundImage && <p className="text-red-500 text-xs mt-1">{errors.pageBackgroundImage.message}</p>}
                </div>
                <div>
                    <Label htmlFor="pageHeroTitle">페이지 히어로 타이틀 (옵션)</Label>
                    <Input id="pageHeroTitle" {...register('pageHeroTitle')} placeholder="제품 상세 소개" />
                    {errors.pageHeroTitle && <p className="text-red-500 text-xs mt-1">{errors.pageHeroTitle.message}</p>}
                </div>

                {/* 서브타이틀 설정 */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label>페이지 히어로 서브타이틀 (옵션)</Label>
                        <Button
                            type="button"
                            onClick={() => appendPageHeroSubtitle({ text: '', color: '#ffffff', size: 16 })}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            서브타이틀 추가
                        </Button>
                    </div>
                    {pageHeroSubtitleFields.map((field, index) => (
                        <div key={field.id} className="p-3 border border-gray-700 rounded-md bg-gray-800 space-y-3 mb-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">서브타이틀 #{index + 1}</span>
                                <Button
                                    type="button"
                                    onClick={() => removePageHeroSubtitle(index)}
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                            <div>
                                <Label htmlFor={`subtitle_text_${index}`}>텍스트</Label>
                                <Input
                                    {...register(`pageHeroSubtitles.${index}.text`)}
                                    placeholder="서브타이틀 텍스트"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`subtitle_color_${index}`}>색상</Label>
                                    <Input
                                        {...register(`pageHeroSubtitles.${index}.color`)}
                                        type="color"
                                        defaultValue="#ffffff"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`subtitle_size_${index}`}>크기 (px)</Label>
                                    <Input
                                        {...register(`pageHeroSubtitles.${index}.size`, { valueAsNumber: true })}
                                        type="number"
                                        min="10"
                                        max="48"
                                        defaultValue={16}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {pageHeroSubtitleFields.length === 0 && (
                        <p className="text-sm text-gray-500 p-4 text-center bg-gray-800 rounded-md">추가된 서브타이틀이 없습니다.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export { ProductFormBasicInfo }; 