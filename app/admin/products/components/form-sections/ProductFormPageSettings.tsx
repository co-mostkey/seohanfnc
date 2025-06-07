'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from '@/components/admin/FileUpload';
import { Checkbox } from "@/components/ui/checkbox";
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';

export const ProductFormPageSettings = () => {
    const { register, setValue, watch, control } = useFormContext<ProductFormData>();

    const pageBackgroundImage = watch('pageBackgroundImage');
    const useTransparentBackground = watch('useTransparentBackground');

    const { fields: subtitleFields, append: appendSubtitle, remove: removeSubtitle } = useFieldArray({
        control,
        name: 'pageHeroSubtitles',
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    페이지 설정 (B타입 전용)
                </CardTitle>
                <CardDescription>상세 페이지의 배경 이미지 등 표시 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* 투명 배경 설정 */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="useTransparentBackground"
                        checked={useTransparentBackground}
                        onCheckedChange={(checked) =>
                            setValue('useTransparentBackground', checked as boolean, { shouldValidate: true })
                        }
                    />
                    <Label htmlFor="useTransparentBackground">투명 배경 사용</Label>
                </div>

                {/* 배경 이미지 (투명 배경이 아닐 때만) */}
                {!useTransparentBackground && (
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
                )}

                {/* 페이지 히어로 제목 */}
                <div className="space-y-2">
                    <Label htmlFor="pageHeroTitle">페이지 히어로 제목</Label>
                    <Input
                        {...register("pageHeroTitle")}
                        placeholder="페이지 상단에 표시될 대제목"
                        className="w-full"
                    />
                </div>

                {/* 페이지 히어로 서브타이틀 */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>페이지 히어로 서브타이틀 (최대 2개)</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendSubtitle({ text: '', color: '#ffffff', size: 18 })}
                            disabled={subtitleFields.length >= 2}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            서브타이틀 추가
                        </Button>
                    </div>

                    {subtitleFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                            <div className="flex-grow space-y-2">
                                <Input
                                    {...register(`pageHeroSubtitles.${index}.text`)}
                                    placeholder="서브타이틀 텍스트"
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        {...register(`pageHeroSubtitles.${index}.color`)}
                                        type="color"
                                        className="w-20"
                                        placeholder="#ffffff"
                                    />
                                    <Input
                                        {...register(`pageHeroSubtitles.${index}.size`, { valueAsNumber: true })}
                                        type="number"
                                        min="12"
                                        max="120"
                                        placeholder="폰트 크기"
                                        className="w-32"
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSubtitle(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}; 