'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, FileText } from 'lucide-react';

interface ProductFormSpecificationsProps {
    control: Control<ProductFormData>;
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
}

const ProductFormSpecifications: React.FC<ProductFormSpecificationsProps> = ({
    control,
    register,
    errors,
    setValue,
    watch
}) => {
    const { fields: specTableFields, append: appendSpecTable, remove: removeSpecTable } =
        useFieldArray({ control, name: "specTable" });

    const { fields: detailedSpecTableFields, append: appendDetailedSpecTable, remove: removeDetailedSpecTable } =
        useFieldArray({ control, name: "detailedSpecTable" });

    const { fields: impactTestResultFields, append: appendImpactTestResult, remove: removeImpactTestResult } =
        useFieldArray({ control, name: "impactAbsorptionData.testResults" });

    const { fields: comparisonChartFields, append: appendComparisonChart, remove: removeComparisonChart } =
        useFieldArray({ control, name: "impactAbsorptionData.comparisonChart.data" });

    const { fields: analysisFields, append: appendAnalysis, remove: removeAnalysis } =
        useFieldArray({ control, name: "impactAbsorptionData.analysis" });

    return (
        <>
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        상세 사양표 (B타입 전용)
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        B타입 제품의 모델별 상세 사양을 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">사양표 항목</Label>
                        <Button
                            type="button"
                            onClick={() => appendSpecTable({ title: '' })}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            사양 항목 추가
                        </Button>
                    </div>

                    {specTableFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md bg-gray-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">사양 항목 #{index + 1}</span>
                                <Button
                                    type="button"
                                    onClick={() => removeSpecTable(index)}
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor={`spec_title_${index}`}>항목명 (구분)</Label>
                                <Input
                                    {...register(`specTable.${index}.title`)}
                                    placeholder="예: 제품규격(m), 제품중량(kg), 설치시간(sec.) 등"
                                />
                                {errors.specTable?.[index]?.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.specTable[index]?.title?.message}</p>
                                )}
                            </div>

                            {/* 동적 모델별 값 입력 필드들 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div>
                                    <Label htmlFor={`spec_5F_A_${index}`}>5F A형</Label>
                                    <Input
                                        {...register(`specTable.${index}.5F_A` as any)}
                                        placeholder="5F A형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`spec_5F_B_${index}`}>5F B형</Label>
                                    <Input
                                        {...register(`specTable.${index}.5F_B` as any)}
                                        placeholder="5F B형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`spec_10F_${index}`}>10F형</Label>
                                    <Input
                                        {...register(`specTable.${index}.10F` as any)}
                                        placeholder="10F형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`spec_15F_${index}`}>15F형</Label>
                                    <Input
                                        {...register(`specTable.${index}.15F` as any)}
                                        placeholder="15F형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`spec_20F_${index}`}>20F형</Label>
                                    <Input
                                        {...register(`specTable.${index}.20F` as any)}
                                        placeholder="20F형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`spec_value_${index}`}>일반 값</Label>
                                    <Input
                                        {...register(`specTable.${index}.value` as any)}
                                        placeholder="단일 모델 값"
                                    />
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 bg-gray-900/50 p-2 rounded">
                                <p>💡 <strong>팁:</strong> 모델별로 다른 값이 있는 경우 해당 모델 필드에 입력하고, 모든 모델이 동일한 값인 경우 '일반 값' 필드에 입력하세요.</p>
                            </div>
                        </div>
                    ))}

                    {specTableFields.length === 0 && (
                        <div className="p-8 text-center bg-gray-800 rounded-md border border-gray-700">
                            <p className="text-gray-500 mb-4">추가된 사양 항목이 없습니다.</p>
                            <Button
                                type="button"
                                onClick={() => appendSpecTable({ title: '제품규격(m)' })}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                첫 번째 사양 항목 추가
                            </Button>
                        </div>
                    )}

                    {/* 사양표 미리보기 */}
                    {specTableFields.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-900/50 rounded-md border border-gray-700">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">사양표 미리보기</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-600">
                                            <th className="text-left p-2 text-gray-400">구분</th>
                                            <th className="text-left p-2 text-gray-400">5F A형</th>
                                            <th className="text-left p-2 text-gray-400">5F B형</th>
                                            <th className="text-left p-2 text-gray-400">10F형</th>
                                            <th className="text-left p-2 text-gray-400">15F형</th>
                                            <th className="text-left p-2 text-gray-400">20F형</th>
                                            <th className="text-left p-2 text-gray-400">일반</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specTableFields.map((field, index) => {
                                            const watchedTitle = watch(`specTable.${index}.title`);
                                            const watched5FA = watch(`specTable.${index}.5F_A` as any);
                                            const watched5FB = watch(`specTable.${index}.5F_B` as any);
                                            const watched10F = watch(`specTable.${index}.10F` as any);
                                            const watched15F = watch(`specTable.${index}.15F` as any);
                                            const watched20F = watch(`specTable.${index}.20F` as any);
                                            const watchedValue = watch(`specTable.${index}.value` as any);

                                            return (
                                                <tr key={field.id} className="border-b border-gray-700">
                                                    <td className="p-2 text-gray-300">{watchedTitle || '항목명'}</td>
                                                    <td className="p-2 text-gray-400">{watched5FA || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched5FB || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched10F || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched15F || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched20F || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watchedValue || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 규격별 상세 사양 섹션 */}
            <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        규격별 상세 사양 (B타입 전용)
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        B타입 제품의 주요특징 섹션에 표시될 규격별 상세 사양을 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-base font-medium">상세 사양 항목</Label>
                        <Button
                            type="button"
                            onClick={() => appendDetailedSpecTable({ title: '' })}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            상세 사양 항목 추가
                        </Button>
                    </div>

                    {detailedSpecTableFields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-gray-700 rounded-md bg-gray-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">상세 사양 항목 #{index + 1}</span>
                                <Button
                                    type="button"
                                    onClick={() => removeDetailedSpecTable(index)}
                                    size="sm"
                                    variant="destructive"
                                    className="h-6 w-6 p-0"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor={`detailed_spec_title_${index}`}>항목명 (구분)</Label>
                                <Input
                                    {...register(`detailedSpecTable.${index}.title`)}
                                    placeholder="예: 제품 규격 (m), 제품 중량 (kg), 설치 시간 (초) 등"
                                />
                                {errors.detailedSpecTable?.[index]?.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.detailedSpecTable[index]?.title?.message}</p>
                                )}
                            </div>

                            {/* 규격별 값 입력 필드들 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                    <Label htmlFor={`detailed_spec_5F_A_${index}`}>5F A 형</Label>
                                    <Input
                                        {...register(`detailedSpecTable.${index}.5F_A` as any)}
                                        placeholder="5F A 형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`detailed_spec_5F_B_${index}`}>5F B 형</Label>
                                    <Input
                                        {...register(`detailedSpecTable.${index}.5F_B` as any)}
                                        placeholder="5F B 형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`detailed_spec_10F_${index}`}>10F 형</Label>
                                    <Input
                                        {...register(`detailedSpecTable.${index}.10F` as any)}
                                        placeholder="10F 형 값"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`detailed_spec_15F_${index}`}>15F 형</Label>
                                    <Input
                                        {...register(`detailedSpecTable.${index}.15F` as any)}
                                        placeholder="15F 형 값"
                                    />
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 bg-gray-900/50 p-2 rounded">
                                <p>💡 <strong>팁:</strong> 이 표는 B타입 제품의 주요특징 섹션 하단에 "규격별 상세 사양"으로 표시됩니다.</p>
                            </div>
                        </div>
                    ))}

                    {detailedSpecTableFields.length === 0 && (
                        <div className="p-8 text-center bg-gray-800 rounded-md border border-gray-700">
                            <p className="text-gray-500 mb-4">추가된 상세 사양 항목이 없습니다.</p>
                            <Button
                                type="button"
                                onClick={() => appendDetailedSpecTable({ title: '제품 규격 (m)' })}
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                첫 번째 상세 사양 항목 추가
                            </Button>
                        </div>
                    )}

                    {/* 상세 사양표 미리보기 */}
                    {detailedSpecTableFields.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-900/50 rounded-md border border-gray-700">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">규격별 상세 사양 미리보기</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-600">
                                            <th className="text-left p-2 text-gray-400">구분</th>
                                            <th className="text-left p-2 text-gray-400">5F A 형</th>
                                            <th className="text-left p-2 text-gray-400">5F B 형</th>
                                            <th className="text-left p-2 text-gray-400">10F 형</th>
                                            <th className="text-left p-2 text-gray-400">15F 형</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailedSpecTableFields.map((field, index) => {
                                            const watchedTitle = watch(`detailedSpecTable.${index}.title`);
                                            const watched5FA = watch(`detailedSpecTable.${index}.5F_A` as any);
                                            const watched5FB = watch(`detailedSpecTable.${index}.5F_B` as any);
                                            const watched10F = watch(`detailedSpecTable.${index}.10F` as any);
                                            const watched15F = watch(`detailedSpecTable.${index}.15F` as any);

                                            return (
                                                <tr key={field.id} className="border-b border-gray-700">
                                                    <td className="p-2 text-gray-300">{watchedTitle || '항목명'}</td>
                                                    <td className="p-2 text-gray-400">{watched5FA || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched5FB || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched10F || '-'}</td>
                                                    <td className="p-2 text-gray-400">{watched15F || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 충격흡수 비교 데이터 섹션 */}
            <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        충격흡수 비교 데이터 (B타입 전용)
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        B타입 제품의 DIN-14151-3 충격흡수 테스트 데이터를 입력하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="impactAbsorptionData.title">제목</Label>
                            <Input
                                id="impactAbsorptionData.title"
                                {...register("impactAbsorptionData.title")}
                                placeholder="피난안전장비 충격흡수 비교 데이터"
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="impactAbsorptionData.subtitle">부제목</Label>
                            <Input
                                id="impactAbsorptionData.subtitle"
                                {...register("impactAbsorptionData.subtitle")}
                                placeholder="충격흡수 비교 데이터 (DIN-14151-3)"
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                    </div>

                    {/* 테스트 정보 */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">테스트 정보</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.standard">관련근거</Label>
                                <Input
                                    id="impactAbsorptionData.testInfo.standard"
                                    {...register("impactAbsorptionData.testInfo.standard")}
                                    placeholder="독일 구조용 에어매트 기준 (DIN-14151-3)"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.testDate">시험일자</Label>
                                <Input
                                    id="impactAbsorptionData.testInfo.testDate"
                                    {...register("impactAbsorptionData.testInfo.testDate")}
                                    placeholder="2017년 5월 18일"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.testSubject">시험비교대상</Label>
                                <Input
                                    id="impactAbsorptionData.testInfo.testSubject"
                                    {...register("impactAbsorptionData.testInfo.testSubject")}
                                    placeholder="공기안전매트(5층형)"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.testDummy">사용더미</Label>
                                <Input
                                    id="impactAbsorptionData.testInfo.testDummy"
                                    {...register("impactAbsorptionData.testInfo.testDummy")}
                                    placeholder="75kg (DIN 14151-3 기준)"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.testHeight">시험높이</Label>
                                <Input
                                    id="impactAbsorptionData.testInfo.testHeight"
                                    {...register("impactAbsorptionData.testInfo.testHeight")}
                                    placeholder="16 (m) 시험법 (DIN 14151-3 기준)"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.note">테스트 설명</Label>
                                <Textarea
                                    id="impactAbsorptionData.testInfo.note"
                                    {...register("impactAbsorptionData.testInfo.note")}
                                    placeholder="본 시험은 독일 DIN 14151-3의 기준에 의한 낙하 충격흡수량..."
                                    className="bg-gray-700 border-gray-600 text-white"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.reference">참고사항</Label>
                                <Textarea
                                    id="impactAbsorptionData.testInfo.reference"
                                    {...register("impactAbsorptionData.testInfo.reference")}
                                    placeholder="1g : 9.81 m/s² 기준으로서 시험하였으며..."
                                    className="bg-gray-700 border-gray-600 text-white"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.testInfo.conversion">환산 정보</Label>
                                <Input
                                    id="impactAbsorptionData.testInfo.conversion"
                                    {...register("impactAbsorptionData.testInfo.conversion")}
                                    placeholder="충격흡수량 환산 : 0.01 (V)=1 (g) [사용센서 : SAE-J211준용 센서]"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 테스트 결과 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-white">테스트 결과</h4>
                            <Button
                                type="button"
                                onClick={() => appendImpactTestResult({ name: "", voltage: "", gForce: "", percentage: 0, chartImage: "" })}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                결과 추가
                            </Button>
                        </div>
                        {impactTestResultFields.map((field, index) => (
                            <div key={field.id} className="border border-gray-600 rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-md font-medium text-gray-300">테스트 결과 {index + 1}</h5>
                                    <Button
                                        type="button"
                                        onClick={() => removeImpactTestResult(index)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        삭제
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.testResults.${index}.name`}>테스트명</Label>
                                        <Input
                                            id={`impactAbsorptionData.testResults.${index}.name`}
                                            {...register(`impactAbsorptionData.testResults.${index}.name`)}
                                            placeholder="지면 충돌시"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.testResults.${index}.voltage`}>전압</Label>
                                        <Input
                                            id={`impactAbsorptionData.testResults.${index}.voltage`}
                                            {...register(`impactAbsorptionData.testResults.${index}.voltage`)}
                                            placeholder="33.620 (V)"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.testResults.${index}.gForce`}>G-Force</Label>
                                        <Input
                                            id={`impactAbsorptionData.testResults.${index}.gForce`}
                                            {...register(`impactAbsorptionData.testResults.${index}.gForce`)}
                                            placeholder="3,362 (g)"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.testResults.${index}.percentage`}>백분율</Label>
                                        <Input
                                            id={`impactAbsorptionData.testResults.${index}.percentage`}
                                            {...register(`impactAbsorptionData.testResults.${index}.percentage`, { valueAsNumber: true })}
                                            type="number"
                                            step="0.1"
                                            placeholder="100"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor={`impactAbsorptionData.testResults.${index}.chartImage`}>차트 이미지 경로</Label>
                                        <Input
                                            id={`impactAbsorptionData.testResults.${index}.chartImage`}
                                            {...register(`impactAbsorptionData.testResults.${index}.chartImage`)}
                                            placeholder="/images/products/Cylinder-Type-SafetyAirMat/impact-test/ground-impact-chart.jpg"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 비교 차트 제목 */}
                    <div>
                        <Label htmlFor="impactAbsorptionData.comparisonChart.title">비교 차트 제목</Label>
                        <Input
                            id="impactAbsorptionData.comparisonChart.title"
                            {...register("impactAbsorptionData.comparisonChart.title")}
                            placeholder="충격흡수량 비교 그래프"
                            className="bg-gray-700 border-gray-600 text-white"
                        />
                    </div>

                    {/* 비교 차트 데이터 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-white">비교 차트 데이터</h4>
                            <Button
                                type="button"
                                onClick={() => appendComparisonChart({ name: "", percentage: 0, color: "#ef4444" })}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                데이터 추가
                            </Button>
                        </div>
                        {comparisonChartFields.map((field, index) => (
                            <div key={field.id} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-md font-medium text-gray-300">차트 데이터 {index + 1}</h5>
                                    <Button
                                        type="button"
                                        onClick={() => removeComparisonChart(index)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        삭제
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.comparisonChart.data.${index}.name`}>항목명</Label>
                                        <Input
                                            id={`impactAbsorptionData.comparisonChart.data.${index}.name`}
                                            {...register(`impactAbsorptionData.comparisonChart.data.${index}.name`)}
                                            placeholder="지면"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.comparisonChart.data.${index}.percentage`}>백분율</Label>
                                        <Input
                                            id={`impactAbsorptionData.comparisonChart.data.${index}.percentage`}
                                            {...register(`impactAbsorptionData.comparisonChart.data.${index}.percentage`, { valueAsNumber: true })}
                                            type="number"
                                            step="0.1"
                                            placeholder="100.0"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`impactAbsorptionData.comparisonChart.data.${index}.color`}>색상 (HEX)</Label>
                                        <Input
                                            id={`impactAbsorptionData.comparisonChart.data.${index}.color`}
                                            {...register(`impactAbsorptionData.comparisonChart.data.${index}.color`)}
                                            placeholder="#ef4444"
                                            className="bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 비교 이미지 */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">비교 이미지</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="impactAbsorptionData.comparisonChart.comparisonImages.groundImpact">지면 충돌 이미지 경로</Label>
                                <Input
                                    id="impactAbsorptionData.comparisonChart.comparisonImages.groundImpact"
                                    {...register("impactAbsorptionData.comparisonChart.comparisonImages.groundImpact")}
                                    placeholder="/images/products/cylinder-type-safety-air-mat/impact-data/ground-impact.jpg"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                                <p className="text-xs text-gray-400 mt-1">지면 충돌시 충격 데이터 이미지</p>
                            </div>
                            <div>
                                <Label htmlFor="impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact">공기안전매트 이미지 경로</Label>
                                <Input
                                    id="impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact"
                                    {...register("impactAbsorptionData.comparisonChart.comparisonImages.airMatImpact")}
                                    placeholder="/images/products/cylinder-type-safety-air-mat/impact-data/air-mat-impact.jpg"
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                                <p className="text-xs text-gray-400 mt-1">공기안전매트 충격 데이터 이미지</p>
                            </div>
                        </div>
                    </div>

                    {/* 분석 결과 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-white">분석 결과</h4>
                            <Button
                                type="button"
                                onClick={() => appendAnalysis("")}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                분석 추가
                            </Button>
                        </div>
                        {analysisFields.map((field, index) => (
                            <div key={field.id} className="border border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-md font-medium text-gray-300">분석 {index + 1}</h5>
                                    <Button
                                        type="button"
                                        onClick={() => removeAnalysis(index)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        삭제
                                    </Button>
                                </div>
                                <Textarea
                                    {...register(`impactAbsorptionData.analysis.${index}`)}
                                    placeholder="공기안전매트는 여러 종류의 안전장비 중 최저의 충격흡수량을 보이고 있습니다."
                                    className="bg-gray-700 border-gray-600 text-white"
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export { ProductFormSpecifications }; 