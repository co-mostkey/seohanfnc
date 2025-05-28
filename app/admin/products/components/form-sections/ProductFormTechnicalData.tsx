'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from '@/types/product';
import { Trash2, Plus, Settings, Database, Award } from 'lucide-react';

interface ProductFormTechnicalDataProps {
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

const ProductFormTechnicalData: React.FC<ProductFormTechnicalDataProps> = ({
    control,
    register,
    errors,
    setValue,
    watch,
    handleFileDelete,
    initialData
}) => {
    const { fields: specificationFields, append: appendSpecification, remove: removeSpecification } =
        useFieldArray({ control, name: "specifications" });

    const { fields: certificationFields, append: appendCertification, remove: removeCertification } =
        useFieldArray({ control, name: "certificationsAndFeatures" });

    return (
        <div className="space-y-6">
            {/* 기술 사양 섹션 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                        <Database className="h-5 w-5 mr-2" />
                        기술 데이터 (B타입 전용)
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        B타입 제품의 기술 사양과 인증 정보를 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">기술 사양 항목</Label>
                        <Button
                            type="button"
                            onClick={() => appendSpecification({ key: '', value: '' })}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            사양 추가
                        </Button>
                    </div>

                    {specificationFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md bg-gray-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">사양 #{index + 1}</span>
                                <Button
                                    type="button"
                                    onClick={() => removeSpecification(index)}
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor={`spec_key_${index}`}>항목명</Label>
                                    <Input
                                        {...register(`specifications.${index}.key`)}
                                        placeholder="예: 재질, 크기, 중량 등"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    {errors.specifications?.[index]?.key && (
                                        <p className="text-red-500 text-xs mt-1">{errors.specifications[index]?.key?.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor={`spec_value_${index}`}>값</Label>
                                    <Input
                                        {...register(`specifications.${index}.value`)}
                                        placeholder="해당 항목의 값"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    {errors.specifications?.[index]?.value && (
                                        <p className="text-red-500 text-xs mt-1">{errors.specifications[index]?.value?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {specificationFields.length === 0 && (
                        <div className="p-8 text-center bg-gray-800 rounded-md border border-gray-700">
                            <p className="text-gray-500 mb-4">추가된 기술 사양이 없습니다.</p>
                            <Button
                                type="button"
                                onClick={() => appendSpecification({ key: '재질', value: '' })}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                첫 번째 사양 추가
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 인증 및 특징 섹션 */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-yellow-400 flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        인증 및 특징 (B타입 전용)
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        B타입 제품의 인증 정보와 주요 특징을 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">인증 및 특징 항목</Label>
                        <Button
                            type="button"
                            onClick={() => appendCertification({ title: '', description: '', icon: '' })}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            항목 추가
                        </Button>
                    </div>

                    {certificationFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md bg-gray-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">인증/특징 #{index + 1}</span>
                                <Button
                                    type="button"
                                    onClick={() => removeCertification(index)}
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label htmlFor={`cert_title_${index}`}>제목</Label>
                                    <Input
                                        {...register(`certificationsAndFeatures.${index}.title`)}
                                        placeholder="예: KC 인증, 방염 처리, 내구성 등"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    {errors.certificationsAndFeatures?.[index]?.title && (
                                        <p className="text-red-500 text-xs mt-1">{errors.certificationsAndFeatures[index]?.title?.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor={`cert_description_${index}`}>설명</Label>
                                    <Textarea
                                        {...register(`certificationsAndFeatures.${index}.description`)}
                                        placeholder="해당 인증이나 특징에 대한 상세 설명"
                                        className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                                    />
                                    {errors.certificationsAndFeatures?.[index]?.description && (
                                        <p className="text-red-500 text-xs mt-1">{errors.certificationsAndFeatures[index]?.description?.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor={`cert_icon_${index}`}>아이콘 (선택사항)</Label>
                                    <Input
                                        {...register(`certificationsAndFeatures.${index}.icon`)}
                                        placeholder="예: shield, award, check-circle 등"
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Lucide React 아이콘 이름을 입력하세요.</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {certificationFields.length === 0 && (
                        <div className="p-8 text-center bg-gray-800 rounded-md border border-gray-700">
                            <p className="text-gray-500 mb-4">추가된 인증/특징이 없습니다.</p>
                            <Button
                                type="button"
                                onClick={() => appendCertification({ title: 'KC 인증', description: '', icon: 'shield' })}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                첫 번째 항목 추가
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 정보 박스 */}
            <div className="bg-green-900/20 border border-green-700/50 rounded-md p-4">
                <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-200">
                        <p className="font-medium mb-2">기술 데이터 입력 가이드</p>
                        <ul className="space-y-1 text-xs text-green-300">
                            <li>• <strong>기술 사양:</strong> 제품의 물리적 특성, 성능 지표 등을 입력하세요.</li>
                            <li>• <strong>인증 및 특징:</strong> 제품이 받은 인증이나 주요 특징을 강조하세요.</li>
                            <li>• <strong>아이콘:</strong> 시각적 효과를 위해 적절한 아이콘을 선택하세요.</li>
                            <li>• <strong>설명:</strong> 고객이 이해하기 쉽도록 명확하게 작성하세요.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ProductFormTechnicalData }; 