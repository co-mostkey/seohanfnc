'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from '@/components/admin/FileUpload';
import NextImage from 'next/image';
import { Trash2, Plus, Settings, Tag, Link, Eye, EyeOff, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";

const ProductFormSettings = () => {
    const { control, register, errors, setValue, watch } = useFormContext<ProductFormData>();
    const { fields: tagFields, append: appendTag, remove: removeTag } =
        useFieldArray({ control, name: "tags" as any });

    const { fields: relatedProductFields, append: appendRelatedProduct, remove: removeRelatedProduct } =
        useFieldArray({ control, name: "relatedProductIds" as any });

    const { fields: heroSubtitleFields, append: appendHeroSubtitle, remove: removeHeroSubtitle } =
        useFieldArray({ control, name: "pageHeroSubtitles" });

    const watchedShowInProductList = watch('showInProductList');
    const watchedIsSummaryPage = watch('isSummaryPage');
    const watchedPageBackgroundImage = watch('pageBackgroundImage');
    const isPublished = watch('isPublished');

    // SEO 구조화 데이터 자동생성 함수
    const generateStructuredData = () => {
        const formData = watch();

        try {
            // 기본 구조화 데이터
            const structuredData: any = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": formData.nameKo || formData.name || "제품명",
                "description": formData.descriptionKo || formData.description || "제품 설명",
                "image": formData.image || "",
                "brand": {
                    "@type": "Brand",
                    "name": "서한F&C"
                },
                "manufacturer": {
                    "@type": "Organization",
                    "name": "서한F&C",
                    "url": "https://seohanfc.com"
                },
                "category": formData.categoryId || "b-type",
                "productID": formData.id || "",
                "sku": formData.id || "",
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "서한F&C"
                    }
                }
            };

            // 모델 정보 추가
            if (formData.modelName) {
                structuredData.model = formData.modelName;
            }
            if (formData.modelNumber) {
                structuredData.mpn = formData.modelNumber;
            }
            if (formData.series) {
                structuredData.productLine = formData.series;
            }

            // 추가 속성 배열 초기화
            const additionalProperties: any[] = [];

            // 제품 특징 추가
            if (formData.features && formData.features.length > 0) {
                formData.features.forEach(feature => {
                    additionalProperties.push({
                        "@type": "PropertyValue",
                        "name": feature.title,
                        "value": feature.description
                    });
                });
            }

            // B타입 제품의 기술 사양 추가
            if (formData.specifications && formData.specifications.length > 0) {
                formData.specifications.forEach(spec => {
                    additionalProperties.push({
                        "@type": "PropertyValue",
                        "name": spec.key,
                        "value": spec.value
                    });
                });
            }

            // B타입 제품의 인증 및 특징 추가
            if (formData.certificationsAndFeatures && formData.certificationsAndFeatures.length > 0) {
                formData.certificationsAndFeatures.forEach(cert => {
                    additionalProperties.push({
                        "@type": "PropertyValue",
                        "name": cert.title,
                        "value": cert.description
                    });
                });
            }

            // B타입 제품의 승인번호 추가
            if (formData.approvalNumber) {
                additionalProperties.push({
                    "@type": "PropertyValue",
                    "name": "승인번호",
                    "value": formData.approvalNumber
                });
            }

            // B타입 제품의 적용높이 추가
            if (formData.applicableHeight) {
                additionalProperties.push({
                    "@type": "PropertyValue",
                    "name": "적용높이",
                    "value": formData.applicableHeight
                });
            }

            // 추가 속성이 있으면 구조화 데이터에 포함
            if (additionalProperties.length > 0) {
                structuredData.additionalProperty = additionalProperties;
            }

            // 3D 모델 정보 추가 (B타입)
            if (formData.modelFile) {
                structuredData["3dModel"] = {
                    "@type": "3DModel",
                    "contentUrl": formData.modelFile,
                    "encodingFormat": "model/gltf-binary"
                };
            }

            // 갤러리 이미지 추가
            if (formData.gallery_images_data && formData.gallery_images_data.length > 0) {
                const images = [structuredData.image];
                formData.gallery_images_data.forEach(item => {
                    if (item.type === 'image' && item.src) {
                        images.push(item.src);
                    }
                });
                structuredData.image = images;
            }

            // 비디오 추가
            if (formData.videos && formData.videos.length > 0) {
                structuredData.video = formData.videos.map(video => ({
                    "@type": "VideoObject",
                    "contentUrl": video.src,
                    "description": video.description || video.alt,
                    "name": video.alt
                }));
            }

            // 문서 추가
            if (formData.documents && formData.documents.length > 0) {
                structuredData.hasProductReturnPolicy = {
                    "@type": "ProductReturnPolicy",
                    "hasWarrantyPromise": {
                        "@type": "WarrantyPromise",
                        "durationOfWarranty": {
                            "@type": "QuantitativeValue",
                            "value": "1",
                            "unitCode": "ANN"
                        }
                    }
                };
            }

            // 태그 추가
            if (formData.tags && formData.tags.length > 0) {
                structuredData.keywords = formData.tags.join(", ");
            }

            const jsonString = JSON.stringify(structuredData, null, 2);
            setValue('seoStructuredData', jsonString, { shouldValidate: true });
            toast.success('SEO 구조화 데이터가 자동생성되었습니다.');
        } catch (error) {
            console.error('구조화 데이터 생성 오류:', error);
            toast.error('구조화 데이터 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="space-y-6">
            {/* 기본 설정 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-orange-400 flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        기본 설정
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        제품의 표시 설정과 기본 옵션을 구성하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="showInProductList"
                                checked={watchedShowInProductList}
                                onCheckedChange={(checked) => setValue('showInProductList', checked as boolean)}
                            />
                            <Label htmlFor="showInProductList" className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                제품 목록에 표시
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isSummaryPage"
                                checked={watchedIsSummaryPage}
                                onCheckedChange={(checked) => setValue('isSummaryPage', checked as boolean)}
                            />
                            <Label htmlFor="isSummaryPage" className="flex items-center">
                                <EyeOff className="h-4 w-4 mr-2" />
                                요약 페이지
                            </Label>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-900/50 p-2 rounded">
                        <p>• <strong>제품 목록에 표시:</strong> 체크하면 제품 목록 페이지에 이 제품이 표시됩니다.</p>
                        <p>• <strong>요약 페이지:</strong> 체크하면 이 제품은 요약 페이지로 처리됩니다.</p>
                    </div>
                </CardContent>
            </Card>

            {/* 태그 관리 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center">
                        <Tag className="h-5 w-5 mr-2" />
                        태그 관리
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        제품 검색과 분류를 위한 태그를 추가하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">태그 목록</Label>
                        <Button
                            type="button"
                            onClick={() => appendTag('')}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            태그 추가
                        </Button>
                    </div>

                    {tagFields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                            <Input
                                {...register(`tags.${index}` as any)}
                                placeholder="태그 입력"
                                className="bg-gray-700 border-gray-600 text-white flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => removeTag(index)}
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}

                    {tagFields.length === 0 && (
                        <div className="p-4 text-center bg-gray-800 rounded-md border border-gray-700">
                            <p className="text-gray-500 mb-2">추가된 태그가 없습니다.</p>
                            <Button
                                type="button"
                                onClick={() => appendTag('안전장비')}
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                첫 번째 태그 추가
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 관련 제품 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                        <Link className="h-5 w-5 mr-2" />
                        관련 제품
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        이 제품과 관련된 다른 제품의 ID를 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">관련 제품 ID</Label>
                        <Button
                            type="button"
                            onClick={() => appendRelatedProduct('')}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            제품 추가
                        </Button>
                    </div>

                    {relatedProductFields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                            <Input
                                {...register(`relatedProductIds.${index}` as any)}
                                placeholder="제품 ID 입력 (예: Cylinder-Type-SafetyAirMat)"
                                className="bg-gray-700 border-gray-600 text-white flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => removeRelatedProduct(index)}
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}

                    {relatedProductFields.length === 0 && (
                        <div className="p-4 text-center bg-gray-800 rounded-md border border-gray-700">
                            <p className="text-gray-500 mb-2">추가된 관련 제품이 없습니다.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 페이지 히어로 설정 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-purple-400">페이지 히어로 설정</CardTitle>
                    <CardDescription className="text-gray-400">
                        제품 상세 페이지의 히어로 섹션을 커스터마이징하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 배경 이미지 */}
                    <div>
                        <Label htmlFor="pageBackgroundImage">배경 이미지</Label>
                        <div className="space-y-3">
                            <FileUpload
                                endpoint="/api/admin/upload"
                                onUploadSuccess={(file) => setValue('pageBackgroundImage', file.url, { shouldValidate: true })}
                                onUploadError={(err) => console.error('배경 이미지 업로드 실패:', err)}
                                productId="temp-product"
                                fileType="temp/backgrounds"
                                accept="image/*"
                                maxFiles={1}
                            />

                            {watchedPageBackgroundImage && (
                                <div className="relative inline-block">
                                    <div className="relative w-64 h-32 rounded-md overflow-hidden border border-gray-600">
                                        <NextImage
                                            src={watchedPageBackgroundImage}
                                            alt="배경 이미지 미리보기"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => setValue('pageBackgroundImage', '', { shouldValidate: true })}
                                        size="sm"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 히어로 타이틀 */}
                    <div>
                        <Label htmlFor="pageHeroTitle">히어로 타이틀</Label>
                        <Input
                            {...register('pageHeroTitle')}
                            placeholder="페이지 상단에 표시될 타이틀"
                            className="bg-gray-700 border-gray-600 text-white"
                        />
                    </div>

                    {/* 히어로 서브타이틀 */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Label className="text-base font-medium">히어로 서브타이틀</Label>
                            <Button
                                type="button"
                                onClick={() => appendHeroSubtitle({ text: '', color: '', size: 16 })}
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                disabled={heroSubtitleFields.length >= 2}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                서브타이틀 추가
                            </Button>
                        </div>

                        {heroSubtitleFields.map((field, index) => (
                            <div key={field.id} className="p-4 border border-gray-700 rounded-md bg-gray-800 space-y-3 mb-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-300">서브타이틀 #{index + 1}</span>
                                    <Button
                                        type="button"
                                        onClick={() => removeHeroSubtitle(index)}
                                        size="sm"
                                        variant="destructive"
                                        className="h-6 w-6 p-0"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="md:col-span-2">
                                        <Label htmlFor={`subtitle_text_${index}`}>텍스트</Label>
                                        <Input
                                            {...register(`pageHeroSubtitles.${index}.text`)}
                                            placeholder="서브타이틀 텍스트"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`subtitle_color_${index}`}>색상</Label>
                                        <Input
                                            {...register(`pageHeroSubtitles.${index}.color`)}
                                            placeholder="#ffffff"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`subtitle_size_${index}`}>크기 (px)</Label>
                                        <Input
                                            {...register(`pageHeroSubtitles.${index}.size`, { valueAsNumber: true })}
                                            type="number"
                                            min="12"
                                            max="120"
                                            placeholder="16"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {heroSubtitleFields.length === 0 && (
                            <div className="p-4 text-center bg-gray-800 rounded-md border border-gray-700">
                                <p className="text-gray-500 mb-2">추가된 서브타이틀이 없습니다.</p>
                            </div>
                        )}

                        <p className="text-xs text-gray-500">최대 2개의 서브타이틀을 추가할 수 있습니다.</p>
                    </div>
                </CardContent>
            </Card>

            {/* SEO 구조화 데이터 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-yellow-400">SEO 구조화 데이터</CardTitle>
                    <CardDescription className="text-gray-400">
                        검색 엔진 최적화를 위한 구조화 데이터를 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="seoStructuredData">JSON-LD 구조화 데이터</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={generateStructuredData}
                                    className="border-yellow-600 text-yellow-300 hover:bg-yellow-700/20"
                                >
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    자동 생성
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setValue('seoStructuredData', '', { shouldValidate: true })}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    초기화
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            {...register('seoStructuredData')}
                            placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                            className="bg-gray-700 border-gray-600 text-white min-h-[120px] font-mono text-sm"
                        />
                        <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-500">
                                유효한 JSON-LD 형식으로 입력하세요. Schema.org 제품 스키마를 권장합니다.
                            </p>
                            <p className="text-xs text-yellow-400">
                                💡 <strong>자동 생성</strong> 버튼을 클릭하면 입력된 제품 정보를 기반으로 구조화 데이터가 자동으로 생성됩니다.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 게시 설정 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle>게시 설정</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Switch
                            id="isPublished"
                            checked={isPublished}
                            onCheckedChange={(checked) => {
                                control.setValue('isPublished', checked, { shouldValidate: true });
                            }}
                        />
                        <Label htmlFor="isPublished" className="flex flex-col space-y-1">
                            <span>제품 게시</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                이 옵션을 켜면 웹사이트에 제품이 표시됩니다.
                            </span>
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export { ProductFormSettings }; 