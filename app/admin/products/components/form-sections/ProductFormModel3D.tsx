'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from '@/components/admin/FileUpload';
import { Product } from '@/types/product';
import NextImage from 'next/image';
import { Trash2, Box, Eye, Upload, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormModel3DProps {
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
    initialData?: Product | null;
}

// 3D 모델 스타일 프리셋
const MODEL_STYLE_PRESETS = [
    { value: 'default', label: '기본 스타일', description: '표준 조명과 환경' },
    { value: 'industrial', label: '산업용 스타일', description: '강한 조명, 메탈릭 환경' },
    { value: 'clean', label: '클린 스타일', description: '밝은 조명, 깔끔한 배경' },
    { value: 'dramatic', label: '드라마틱 스타일', description: '강조된 그림자와 조명' },
    { value: 'minimal', label: '미니멀 스타일', description: '단순한 조명, 투명 배경' },
];

const ProductFormModel3D: React.FC<ProductFormModel3DProps> = ({
    control,
    register,
    errors,
    setValue,
    watch,
    handleFileDelete,
    initialData
}) => {
    const watchedModelImage = watch('modelImage');
    const watchedModelFile = watch('modelFile');
    const watchedModelStyle = watch('modelStyle');

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-purple-400 flex items-center">
                    <Box className="h-5 w-5 mr-2" />
                    3D 모델 및 모델 정보 (B타입 전용)
                </CardTitle>
                <CardDescription className="text-gray-400">
                    B타입 제품의 3D 모델 정보와 모델 이미지를 설정하세요.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* 모델명 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="modelName">모델명</Label>
                        <Input
                            {...register('modelName')}
                            placeholder="예: SH-5F-A"
                            className="bg-gray-700 border-gray-600 text-white"
                        />
                        {errors.modelName && (
                            <p className="text-red-500 text-xs mt-1">{errors.modelName.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="modelNumber">모델 번호</Label>
                        <Input
                            {...register('modelNumber')}
                            placeholder="예: SH-AM-001"
                            className="bg-gray-700 border-gray-600 text-white"
                        />
                        {errors.modelNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.modelNumber.message}</p>
                        )}
                    </div>
                </div>

                {/* 시리즈 */}
                <div>
                    <Label htmlFor="series">제품 시리즈</Label>
                    <Input
                        {...register('series')}
                        placeholder="예: 공기안전매트 시리즈"
                        className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.series && (
                        <p className="text-red-500 text-xs mt-1">{errors.series.message}</p>
                    )}
                </div>

                {/* 3D 모델 파일 업로드 */}
                <div>
                    <Label htmlFor="modelFile" className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        3D 모델 파일 (.glb)
                    </Label>
                    <div className="space-y-3">
                        <FileUpload
                            endpoint="/api/admin/upload"
                            onUploadSuccess={(file) => setValue('modelFile', file.url, { shouldValidate: true })}
                            onUploadError={(err) => toast.error(`3D 모델 파일 업로드 실패: ${err}`)}
                            productId={initialData?.id || 'temp-product'}
                            fileType={initialData?.id ? `products/${initialData.id}/models` : 'temp/models'}
                            accept=".glb,.gltf"
                            maxFiles={1}
                        />

                        {watchedModelFile && (
                            <div className="p-3 bg-gray-700 rounded-md border border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Box className="h-4 w-4 text-purple-400" />
                                        <span className="text-sm text-gray-300">
                                            {watchedModelFile.split('/').pop() || '3D 모델 파일'}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => handleFileDelete(watchedModelFile, 'modelFile')}
                                        size="sm"
                                        variant="destructive"
                                        className="h-6 w-6 p-0"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    파일 경로: {watchedModelFile}
                                </p>
                            </div>
                        )}

                        {errors.modelFile && (
                            <p className="text-red-500 text-xs">{errors.modelFile.message}</p>
                        )}
                    </div>
                </div>

                {/* 3D 모델 스타일 선택 */}
                <div>
                    <Label htmlFor="modelStyle" className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        3D 모델 스타일
                    </Label>
                    <div className="mt-2">
                        <select
                            {...register('modelStyle')}
                            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:border-purple-500 outline-none"
                        >
                            <option value="">스타일 선택 (기본값 사용)</option>
                            {MODEL_STYLE_PRESETS.map((preset) => (
                                <option key={preset.value} value={preset.value}>
                                    {preset.label} - {preset.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.modelStyle && (
                        <p className="text-red-500 text-xs mt-1">{errors.modelStyle.message}</p>
                    )}

                    {/* 선택된 스타일 미리보기 */}
                    {watchedModelStyle && (
                        <div className="mt-2 p-3 bg-purple-900/20 border border-purple-700/50 rounded-md">
                            <div className="flex items-start space-x-2">
                                <Palette className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-purple-300">
                                        {MODEL_STYLE_PRESETS.find(p => p.value === watchedModelStyle)?.label}
                                    </p>
                                    <p className="text-purple-400 text-xs">
                                        {MODEL_STYLE_PRESETS.find(p => p.value === watchedModelStyle)?.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 모델 이미지 업로드 */}
                <div>
                    <Label htmlFor="modelImage">모델 이미지 (대체 이미지)</Label>
                    <div className="space-y-3">
                        <FileUpload
                            endpoint="/api/admin/upload"
                            onUploadSuccess={(file) => setValue('modelImage', file.url, { shouldValidate: true })}
                            onUploadError={(err) => toast.error(`모델 이미지 업로드 실패: ${err}`)}
                            productId={initialData?.id || 'temp-product'}
                            fileType={initialData?.id ? `products/${initialData.id}/models` : 'temp/models'}
                            accept="image/*"
                            maxFiles={1}
                        />

                        {watchedModelImage && (
                            <div className="relative inline-block">
                                <div className="relative w-48 h-32 rounded-md overflow-hidden border border-gray-600">
                                    <NextImage
                                        src={watchedModelImage}
                                        alt="모델 이미지 미리보기"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => handleFileDelete(watchedModelImage, 'modelImage')}
                                    size="sm"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        )}

                        {errors.modelImage && (
                            <p className="text-red-500 text-xs">{errors.modelImage.message}</p>
                        )}
                    </div>
                </div>

                {/* 승인번호 */}
                <div>
                    <Label htmlFor="approvalNumber">승인번호</Label>
                    <Input
                        {...register('approvalNumber')}
                        placeholder="예: 제2021-000호"
                        className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.approvalNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.approvalNumber.message}</p>
                    )}
                </div>

                {/* 적용 높이 */}
                <div>
                    <Label htmlFor="applicableHeight">적용 높이</Label>
                    <Input
                        {...register('applicableHeight')}
                        placeholder="예: 5층 이하 건물"
                        className="bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.applicableHeight && (
                        <p className="text-red-500 text-xs mt-1">{errors.applicableHeight.message}</p>
                    )}
                </div>

                {/* 기타 옵션 */}
                <div>
                    <Label htmlFor="otherOptions">기타 옵션</Label>
                    <Textarea
                        {...register('otherOptions')}
                        placeholder="추가 옵션이나 특별 사양에 대한 설명을 입력하세요."
                        className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    />
                    {errors.otherOptions && (
                        <p className="text-red-500 text-xs mt-1">{errors.otherOptions.message}</p>
                    )}
                </div>

                {/* 정보 박스 */}
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-md p-4">
                    <div className="flex items-start space-x-3">
                        <Eye className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-200">
                            <p className="font-medium mb-2">3D 모델 표시 안내</p>
                            <ul className="space-y-1 text-xs text-blue-300">
                                <li>• <strong>3D 모델 파일:</strong> .glb 또는 .gltf 형식의 3D 모델을 업로드하세요.</li>
                                <li>• <strong>모델 이미지:</strong> 3D 모델 로딩 실패 시 대체 이미지로 표시됩니다.</li>
                                <li>• <strong>모델 스타일:</strong> 3D 뷰어의 조명과 환경을 설정합니다.</li>
                                <li>• <strong>모델명과 모델번호:</strong> 제품 식별에 사용됩니다.</li>
                                <li>• <strong>승인번호:</strong> 인증 정보로 표시됩니다.</li>
                                <li>• <strong>적용 높이:</strong> 사용 가능한 건물 층수를 나타냅니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export { ProductFormModel3D }; 