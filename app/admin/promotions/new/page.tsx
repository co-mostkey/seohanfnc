'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PromotionItem, PromotionType, DeliveryRecord } from '@/types/promotion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Trash2, PlusCircle, AlertTriangle, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// PromotionType의 레이블 정의 (한글)
const promotionTypeLabels: Record<PromotionType, string> = {
    mainHeroVideo: '메인 히어로 비디오',
    video: '일반 비디오',
    image: '이미지',
    document: '문서',
    deliveryRecordList: '납품 실적 목록',
};

export default function NewPromotionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Partial<PromotionItem>>({
        id: uuidv4(), // 새 ID 자동 생성
        title: '',
        type: 'video', // 기본값
        order: 0,
        isVisible: true,
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        imageUrl: '',
        documentUrl: '',
        fileName: '',
        records: [], // deliveryRecordList 타입일 때 사용
    });
    const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseInt(value, 10) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTypeChange = (value: string) => {
        const newType = value as PromotionType;
        setFormData(prev => ({
            ...prev,
            type: newType,
            // 타입 변경 시 관련 없는 필드 초기화 (선택적)
            videoUrl: newType === 'video' || newType === 'mainHeroVideo' ? prev.videoUrl : '',
            thumbnailUrl: newType === 'video' || newType === 'mainHeroVideo' ? prev.thumbnailUrl : '',
            imageUrl: newType === 'image' ? prev.imageUrl : '',
            documentUrl: newType === 'document' ? prev.documentUrl : '',
            fileName: newType === 'document' ? prev.fileName : '',
        }));
        if (newType !== 'deliveryRecordList') {
            setDeliveryRecords([]);
        }
    };

    // 납품 실적 관련 핸들러
    const addDeliveryRecord = () => {
        setDeliveryRecords(prev => [...prev, { id: uuidv4(), company: '', project: '', date: '', isApartment: false }]);
    };

    const handleDeliveryRecordChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const updatedRecords = [...deliveryRecords];
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            updatedRecords[index] = { ...updatedRecords[index], [name]: checked };
        } else {
            updatedRecords[index] = { ...updatedRecords[index], [name]: value };
        }
        setDeliveryRecords(updatedRecords);
    };

    const removeDeliveryRecord = (index: number) => {
        setDeliveryRecords(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!formData.title || !formData.type) {
            setError('제목과 타입은 필수 입력 항목입니다.');
            setIsSubmitting(false);
            return;
        }
        if (!formData.id) {
            setError('ID가 유효하지 않습니다. 페이지를 새로고침하거나 다시 시도해주세요.');
            setIsSubmitting(false);
            return;
        }

        const payload: PromotionItem = {
            id: formData.id!,
            title: formData.title!,
            type: formData.type!,
            order: formData.order || 0,
            isVisible: formData.isVisible === undefined ? true : formData.isVisible,
            description: formData.description || '',
            videoUrl: formData.type === 'video' || formData.type === 'mainHeroVideo' ? formData.videoUrl : undefined,
            thumbnailUrl: formData.type === 'video' || formData.type === 'mainHeroVideo' ? formData.thumbnailUrl : undefined,
            imageUrl: formData.type === 'image' ? formData.imageUrl : undefined,
            documentUrl: formData.type === 'document' ? formData.documentUrl : undefined,
            fileName: formData.type === 'document' ? formData.fileName : undefined,
            records: formData.type === 'deliveryRecordList' ? deliveryRecords : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${basePath}/api/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '홍보 자료 저장에 실패했습니다.');
            }

            alert('새 홍보 자료가 성공적으로 추가되었습니다.');
            router.push('/admin/promotions'); // 목록 페이지로 이동
        } catch (err: any) {
            setError(err.message || '저장 중 알 수 없는 오류가 발생했습니다.');
            console.error('Error saving promotion item:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">새 홍보 자료 추가</CardTitle>
                    <CardDescription>새로운 홍보 콘텐츠를 시스템에 등록합니다.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 py-6">
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">고유 ID (자동 생성)</Label>
                                <Input id="id" name="id" type="text" value={formData.id || ''} onChange={handleChange} readOnly className="bg-gray-100 dark:bg-gray-700" />
                                <p className="text-xs text-gray-500 mt-1">이 ID는 고유해야 하며, 시스템에서 자동으로 생성됩니다.</p>
                            </div>
                            <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">제목 <span className="text-red-500">*</span></Label>
                                <Input id="title" name="title" type="text" value={formData.title || ''} onChange={handleChange} required placeholder="홍보 자료의 제목" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">타입 <span className="text-red-500">*</span></Label>
                            <Select name="type" value={formData.type} onValueChange={handleTypeChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="홍보 자료 유형 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(promotionTypeLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">설명</Label>
                            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} placeholder="홍보 자료에 대한 간략한 설명" rows={3} />
                        </div>

                        {/* 타입별 추가 필드 */}
                        {(formData.type === 'video' || formData.type === 'mainHeroVideo') && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="videoUrl">비디오 URL</Label>
                                    <Input name="videoUrl" id="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} placeholder="/videos/example.mp4 또는 https://..." />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="thumbnailUrl">썸네일 이미지 URL</Label>
                                    <Input name="thumbnailUrl" id="thumbnailUrl" value={formData.thumbnailUrl || ''} onChange={handleChange} placeholder="/images/thumb.jpg 또는 https://..." />
                                </div>
                            </>
                        )}
                        {formData.type === 'image' && (
                            <div className="space-y-1">
                                <Label htmlFor="imageUrl">이미지 URL</Label>
                                <Input name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="/images/example.jpg 또는 https://..." />
                            </div>
                        )}
                        {formData.type === 'document' && (
                            <>
                                <div className="space-y-1">
                                    <Label htmlFor="documentUrl">문서 URL</Label>
                                    <Input name="documentUrl" id="documentUrl" value={formData.documentUrl || ''} onChange={handleChange} placeholder="/docs/doc.pdf 또는 https://..." />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="fileName">파일 이름 (표시용)</Label>
                                    <Input name="fileName" id="fileName" value={formData.fileName || ''} onChange={handleChange} placeholder="예: 회사소개서.pdf" />
                                </div>
                            </>
                        )}

                        {/* 납품 실적 관리 UI (type이 deliveryRecordList일 때) */}
                        {formData.type === 'deliveryRecordList' && (
                            <div className="space-y-4 pt-4 border-t mt-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">납품 실적 목록 관리</h3>
                                {deliveryRecords.length === 0 && (
                                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                        <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p>아직 추가된 납품 실적이 없습니다.</p>
                                        <p className="text-sm">아래 '납품 실적 추가' 버튼을 클릭하여 새 실적을 등록하세요.</p>
                                    </div>
                                )}
                                {deliveryRecords.map((record, index) => (
                                    <Card key={record.id} className="bg-slate-50 dark:bg-slate-800 p-4 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-700/30 h-7 w-7"
                                            onClick={() => removeDeliveryRecord(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label htmlFor={`record-company-${index}`}>회사명</Label>
                                                <Input name="company" id={`record-company-${index}`} value={record.company} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="예: 한국전력공사" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`record-project-${index}`}>프로젝트명</Label>
                                                <Input name="project" id={`record-project-${index}`} value={record.project} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="예: 차세대 전력 시스템" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`record-date-${index}`}>납품일 (YYYY-MM)</Label>
                                                <Input name="date" id={`record-date-${index}`} value={record.date} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="2024-07" />
                                            </div>
                                            <div className="flex items-center pt-6 space-x-2">
                                                <Checkbox name="isApartment" id={`record-isApartment-${index}`} checked={record.isApartment} onCheckedChange={(checked) => handleDeliveryRecordChange(index, { target: { name: 'isApartment', value: checked, type: 'checkbox' } } as any)} />
                                                <Label htmlFor={`record-isApartment-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">아파트 건설</Label>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                <Button type="button" variant="outline" onClick={addDeliveryRecord} className="w-full border-dashed hover:border-solid hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <PlusCircle className="mr-2 h-4 w-4" /> 납품 실적 추가
                                </Button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t mt-4">
                            <div>
                                <Label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">표시 순서</Label>
                                <Input id="order" name="order" type="number" value={formData.order || 0} onChange={handleChange} min={0} />
                                <p className="text-xs text-gray-500 mt-1">숫자가 낮을수록 목록에서 먼저 표시됩니다.</p>
                            </div>
                            <div className="flex items-center pt-7 space-x-2">
                                <Checkbox id="isVisible" name="isVisible" checked={formData.isVisible} onCheckedChange={(checked) => handleChange({ target: { name: 'isVisible', checked, type: 'checkbox' } } as any)} />
                                <Label htmlFor="isVisible" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">사용자에게 공개</Label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-end gap-2 w-full">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-sky-600 hover:bg-sky-700 text-white">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 저장 중...
                                    </>
                                ) : (
                                    '홍보 자료 저장'
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 