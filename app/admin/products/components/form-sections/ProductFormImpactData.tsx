'use client';

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { FileUpload } from '@/components/admin/FileUpload';

export const ProductFormImpactData = () => {
    const { control, register, formState: { errors }, setValue, watch } = useFormContext<ProductFormData>();

    const { fields: testResultFields, append: appendTestResult, remove: removeTestResult } = useFieldArray({
        control,
        name: "impactAbsorptionData.testResults"
    });

    const { fields: analysisFields, append: appendAnalysis, remove: removeAnalysis } = useFieldArray({
        control,
        name: "impactAbsorptionData.analysis"
    });

    const { fields: chartDataFields, append: appendChartData, remove: removeChartData } = useFieldArray({
        control,
        name: "impactAbsorptionData.comparisonChart.data"
    });

    const groundImpactImage = watch("impactAbsorptionData.comparisonChart.comparisonImages.groundImpact");
    const airMatImpactImage = watch("impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact");

    return (
        <Card>
            <CardHeader>
                <CardTitle>B타입 상세 - 충격 흡수 성능 데이터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="impactDataTitle">데이터 제목</Label>
                    <Input id="impactDataTitle" {...register("impactAbsorptionData.title")} />
                    {errors.impactAbsorptionData?.title && <p className="text-red-500 text-sm">{errors.impactAbsorptionData.title.message}</p>}
                </div>
                <div>
                    <Label htmlFor="impactDataSummary">데이터 요약</Label>
                    <Textarea id="impactDataSummary" {...register("impactAbsorptionData.summary")} />
                    {errors.impactAbsorptionData?.summary && <p className="text-red-500 text-sm">{errors.impactAbsorptionData.summary.message}</p>}
                </div>

                {/* Test Results */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">테스트 결과</h4>
                        <Button type="button" onClick={() => appendTestResult({ item: '', value: '', description: '' })}>
                            결과 추가
                        </Button>
                    </div>
                    {testResultFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                            <div className="absolute top-2 right-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeTestResult(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <Label>항목</Label>
                                <Input {...register(`impactAbsorptionData.testResults.${index}.item`)} />
                            </div>
                            <div>
                                <Label>값</Label>
                                <Input {...register(`impactAbsorptionData.testResults.${index}.value`)} />
                            </div>
                            <div>
                                <Label>설명</Label>
                                <Input {...register(`impactAbsorptionData.testResults.${index}.description`)} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Chart Section */}
                <div className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">충격흡수량 비교 차트</h4>
                        <Button type="button" onClick={() => appendChartData({ name: '', percentage: 0, color: 'blue' })}>
                            차트 데이터 추가
                        </Button>
                    </div>
                    <div>
                        <Label>차트 제목</Label>
                        <Input {...register("impactAbsorptionData.comparisonChart.title")} />
                    </div>
                    <div className="space-y-2">
                        <Label>비교 이미지 (지면 충돌)</Label>
                        <FileUpload
                            endpoint="/api/admin/upload"
                            fileType="product-assets"
                            onUploadSuccess={(file) => {
                                setValue('impactAbsorptionData.comparisonChart.comparisonImages.groundImpact', file.url, { shouldValidate: true });
                            }}
                            currentImageUrl={groundImpactImage}
                            accept="image/*"
                            buttonText="이미지 업로드"
                            idSuffix="ground-impact-image"
                        />
                        {groundImpactImage && (
                            <div className="flex items-center gap-2 mt-2">
                                <Input {...register("impactAbsorptionData.comparisonChart.comparisonImages.groundImpact")} />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setValue('impactAbsorptionData.comparisonChart.comparisonImages.groundImpact', '', { shouldValidate: true })}
                                >
                                    경로 삭제
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>비교 이미지 (에어매트 충돌)</Label>
                        <FileUpload
                            endpoint="/api/admin/upload"
                            fileType="product-assets"
                            onUploadSuccess={(file) => {
                                setValue('impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact', file.url, { shouldValidate: true });
                            }}
                            currentImageUrl={airMatImpactImage}
                            accept="image/*"
                            buttonText="이미지 업로드"
                            idSuffix="airmat-impact-image"
                        />
                        {airMatImpactImage && (
                            <div className="flex items-center gap-2 mt-2">
                                <Input {...register("impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact")} />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setValue('impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact', '', { shouldValidate: true })}
                                >
                                    경로 삭제
                                </Button>
                            </div>
                        )}
                    </div>
                    {chartDataFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="flex-1 space-y-2">
                                <div>
                                    <Label>항목명</Label>
                                    <Input {...register(`impactAbsorptionData.comparisonChart.data.${index}.name`)} />
                                </div>
                                <div>
                                    <Label>백분율(%)</Label>
                                    <Input type="number" {...register(`impactAbsorptionData.comparisonChart.data.${index}.percentage`, { valueAsNumber: true })} />
                                </div>
                                <div>
                                    <Label>막대 색상</Label>
                                    <Input {...register(`impactAbsorptionData.comparisonChart.data.${index}.color`)} />
                                </div>
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeChartData(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Analysis */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">성능 분석</h4>
                        <Button type="button" onClick={() => appendAnalysis({ item: '', content: '' })}>
                            분석 추가
                        </Button>
                    </div>
                    {analysisFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                            <div className="absolute top-2 right-2">
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeAnalysis(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <Label>항목</Label>
                                <Input {...register(`impactAbsorptionData.analysis.${index}.item`)} />
                            </div>
                            <div>
                                <Label>내용</Label>
                                <Textarea {...register(`impactAbsorptionData.analysis.${index}.content`)} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}; 