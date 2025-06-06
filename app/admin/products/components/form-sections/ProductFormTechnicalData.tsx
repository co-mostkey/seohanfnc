'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Settings, Database, Award } from 'lucide-react';

export const ProductFormTechnicalData = () => {
    const { control, register, formState: { errors } } = useFormContext<ProductFormData>();

    const { fields: technicalDataFields, append: appendTechnicalData, remove: removeTechnicalData } = useFieldArray({
        control,
        name: "technicalData",
    });

    const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
        control,
        name: "certifications",
    });

    return (
        <div className="space-y-6">
            {/* 기술 사양 섹션 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 mr-2" />
                        기술 데이터 (B타입 전용)
                    </CardTitle>
                    <CardDescription>
                        B타입 제품의 기술 사양과 인증 정보를 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">기술 사양 항목</Label>
                        <Button
                            type="button"
                            onClick={() => appendTechnicalData({ key: '', value: '' })}
                            size="sm"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            사양 추가
                        </Button>
                    </div>

                    {technicalDataFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md bg-gray-800/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">사양 #{index + 1}</span>
                                <Button
                                    type="button"
                                    onClick={() => removeTechnicalData(index)}
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label>항목명</Label>
                                    <Input
                                        {...register(`technicalData.${index}.key`)}
                                        placeholder="예: 재질, 크기, 중량 등"
                                    />
                                    {errors.technicalData?.[index]?.key && (
                                        <p className="text-red-500 text-xs mt-1">{errors.technicalData[index]?.key?.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>값</Label>
                                    <Input
                                        {...register(`technicalData.${index}.value`)}
                                        placeholder="해당 항목의 값"
                                    />
                                    {errors.technicalData?.[index]?.value && (
                                        <p className="text-red-500 text-xs mt-1">{errors.technicalData[index]?.value?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* 인증 및 특징 섹션 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        인증 및 특징 (B타입 전용)
                    </CardTitle>
                    <CardDescription>
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
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            항목 추가
                        </Button>
                    </div>

                    {certificationFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md bg-gray-800/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">인증/특징 #{index + 1}</span>
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
                                    <Label>제목</Label>
                                    <Input
                                        {...register(`certifications.${index}.title`)}
                                        placeholder="예: KC 인증, 방염 처리, 내구성 등"
                                    />
                                    {errors.certifications?.[index]?.title && (
                                        <p className="text-red-500 text-xs mt-1">{errors.certifications[index]?.title?.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>설명</Label>
                                    <Textarea
                                        {...register(`certifications.${index}.description`)}
                                        placeholder="해당 인증이나 특징에 대한 상세 설명"
                                        className="min-h-[80px]"
                                    />
                                    {errors.certifications?.[index]?.description && (
                                        <p className="text-red-500 text-xs mt-1">{errors.certifications[index]?.description?.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>아이콘 (선택사항)</Label>
                                    <Input
                                        {...register(`certifications.${index}.icon`)}
                                        placeholder="예: shield, award, check-circle 등"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Lucide React 아이콘 이름을 입력하세요.</p>
                                </div>
                            </div>
                        </div>
                    ))}
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