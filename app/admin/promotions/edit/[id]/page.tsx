'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Viewport } from 'next';
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
import { Trash2, PlusCircle, AlertTriangle, Info, Loader2, Save, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const promotionTypeLabels: Record<PromotionType, string> = {
    video: '일반 비디오',
    image: '이미지',
    document: '문서',
    deliveryRecordList: '납품 실적 목록',
    mainTitleBoxMultiVideo: '메인 다중 비디오'
};

export const viewport: Viewport = {
    themeColor: 'black',
};

export default function EditPromotionPage() {
    const router = useRouter();
    const params = useParams();
    const promotionId = params?.id as string;

    const [promotionData, setPromotionData] = useState<PromotionItem | null>(null);
    const [formData, setFormData] = useState<Partial<PromotionItem>>({});
    const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialError, setInitialError] = useState<string | null>(null);

    useEffect(() => {
        if (promotionId) {
            const fetchPromotionData = async () => {
                setIsLoading(true);
                setInitialError(null);
                try {
                    const response = await fetch(`${basePath}/api/promotions/${promotionId}`);
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error('해당 ID의 홍보 자료를 찾을 수 없습니다.');
                        }
                        throw new Error('홍보 자료를 불러오는데 실패했습니다.');
                    }
                    const data: PromotionItem = await response.json();
                    setPromotionData(data);
                    setFormData(data);
                    if (data.type === 'deliveryRecordList' && data.records) {
                        setDeliveryRecords(data.records);
                    } else {
                        setDeliveryRecords([]);
                    }
                } catch (err: any) {
                    setInitialError(err.message || '데이터 로딩 중 알 수 없는 오류가 발생했습니다.');
                    console.error('Error fetching promotion data:', err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPromotionData();
        } else {
            setInitialError('홍보 자료 ID가 제공되지 않았습니다.');
            setIsLoading(false);
        }
    }, [promotionId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setError(null);
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
        setError(null);
        setFormData(prev => {
            const newState: Partial<PromotionItem> = {
                ...prev,
                type: newType,
            };
            newState.videoUrl = newType === 'video' ? prev.videoUrl : undefined;
            newState.thumbnailUrl = newType === 'video' ? prev.thumbnailUrl : undefined;
            newState.videoUrls = newType === 'mainTitleBoxMultiVideo' ? (prev.videoUrls || ['']) : undefined;
            newState.imageUrl = newType === 'image' ? prev.imageUrl : undefined;
            newState.documentUrl = newType === 'document' ? prev.documentUrl : undefined;
            newState.fileName = newType === 'document' ? prev.fileName : undefined;

            if (newType !== 'deliveryRecordList') {
                newState.records = [];
                setDeliveryRecords([]);
            } else {
                setDeliveryRecords(prev.records || []);
            }
            return newState;
        });
    };

    const addDeliveryRecord = () => {
        setError(null);
        setDeliveryRecords(prev => [...prev, { id: uuidv4(), company: '', project: '', date: '', isApartment: false }]);
    };

    const handleDeliveryRecordChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setError(null);
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
        setError(null);
        setDeliveryRecords(prev => prev.filter((_, i) => i !== index));
    };

    const handleVideoUrlChange = (index: number, value: string) => {
        setFormData(prev => {
            const newVideoUrls = [...(prev.videoUrls || [])];
            newVideoUrls[index] = value;
            return { ...prev, videoUrls: newVideoUrls };
        });
    };

    const addVideoUrlField = () => {
        setFormData(prev => ({
            ...prev,
            videoUrls: [...(prev.videoUrls || []), '']
        }));
    };

    const removeVideoUrlField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            videoUrls: (prev.videoUrls || []).filter((_, i) => i !== index)
        }));
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
        if (!promotionId || !formData.id || !promotionData) {
            setError('홍보 자료 ID 또는 원본 데이터가 유효하지 않습니다. 페이지를 새로고침해주세요.');
            setIsSubmitting(false);
            return;
        }

        const payload: PromotionItem = {
            id: promotionId,
            title: formData.title!,
            type: formData.type!,
            order: formData.order || 0,
            isVisible: formData.isVisible === undefined ? true : formData.isVisible,
            description: formData.description || '',
            videoUrl: formData.type === 'video' ? formData.videoUrl : undefined,
            thumbnailUrl: formData.type === 'video' ? formData.thumbnailUrl : undefined,
            videoUrls: formData.type === 'mainTitleBoxMultiVideo' ? formData.videoUrls : undefined,
            imageUrl: formData.type === 'image' ? formData.imageUrl : undefined,
            documentUrl: formData.type === 'document' ? formData.documentUrl : undefined,
            fileName: formData.type === 'document' ? formData.fileName : undefined,
            records: formData.type === 'deliveryRecordList' ? deliveryRecords : undefined,
            createdAt: promotionData.createdAt,
            updatedAt: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${basePath}/api/promotions/${promotionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '홍보 자료 수정에 실패했습니다.');
            }

            router.push('/admin/promotions');
            router.refresh();
        } catch (err: any) {
            setError(err.message || '수정 중 알 수 없는 오류가 발생했습니다.');
            console.error('Error updating promotion item:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
                <p className="ml-4 text-lg">데이터를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (initialError) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 text-center">
                <Card className="max-w-md mx-auto p-6 md:p-8">
                    <CardHeader className="items-center">
                        <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                        <CardTitle className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-3">오류 발생</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{initialError}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push('/admin/promotions')} className="w-full max-w-xs bg-sky-600 hover:bg-sky-700 text-white">
                            홍보 자료 목록으로 돌아가기
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="outline" size="icon" asChild className="mr-4">
                            <Link href="/admin/promotions">
                                <ArrowLeft className="h-5 w-5" />
                                <span className="sr-only">뒤로 가기</span>
                            </Link>
                        </Button>
                        <div>
                            <CardTitle className="text-2xl font-bold">홍보 자료 수정</CardTitle>
                            <CardDescription>ID: {promotionId}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 py-6">
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700 rounded-md flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="title" className="font-semibold">제목 <span className="text-red-500">*</span></Label>
                                <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} placeholder="홍보 자료 제목" required />
                            </div>
                            <div>
                                <Label htmlFor="type" className="font-semibold">타입 <span className="text-red-500">*</span></Label>
                                <Select name="type" value={formData.type} onValueChange={handleTypeChange}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="타입 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(promotionTypeLabels).map(([typeVal, label]) => (
                                            <SelectItem key={typeVal} value={typeVal}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className="font-semibold">설명</Label>
                            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} placeholder="홍보 자료 설명 (선택 사항)" rows={3} />
                        </div>

                        {formData.type === 'video' && (
                            <>
                                <div>
                                    <Label htmlFor="videoUrl" className="font-semibold">비디오 URL</Label>
                                    <Input id="videoUrl" name="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} placeholder="예: /videos/promo.mp4 또는 YouTube URL" />
                                </div>
                                <div>
                                    <Label htmlFor="thumbnailUrl" className="font-semibold">썸네일 URL (선택)</Label>
                                    <Input id="thumbnailUrl" name="thumbnailUrl" value={formData.thumbnailUrl || ''} onChange={handleChange} placeholder="예: /images/promo_thumb.jpg" />
                                </div>
                            </>
                        )}

                        {formData.type === 'mainTitleBoxMultiVideo' && (
                            <div className="space-y-4">
                                <Label className="font-semibold">메인 타이틀 다중 비디오 URL들</Label>
                                {(formData.videoUrls || []).map((url, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Input
                                            name={`videoUrl-${index}`}
                                            value={url}
                                            onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                                            placeholder={`비디오 URL #${index + 1}`}
                                            className="flex-grow"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVideoUrlField(index)} disabled={(formData.videoUrls?.length ?? 0) <= 1 && index === 0}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addVideoUrlField} className="mt-2">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    비디오 URL 추가
                                </Button>
                                {(formData.videoUrls || []).length === 0 && (
                                    <p className="text-xs text-gray-500">첫번째 URL을 추가해주세요.</p>
                                )}
                            </div>
                        )}

                        {formData.type === 'image' && (
                            <div>
                                <Label htmlFor="imageUrl" className="font-semibold">이미지 URL</Label>
                                <Input id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="예: /images/promo_banner.jpg" />
                            </div>
                        )}

                        {formData.type === 'document' && (
                            <>
                                <div>
                                    <Label htmlFor="documentUrl" className="font-semibold">문서 URL</Label>
                                    <Input id="documentUrl" name="documentUrl" value={formData.documentUrl || ''} onChange={handleChange} placeholder="예: /docs/introduction.pdf" />
                                </div>
                                <div>
                                    <Label htmlFor="fileName" className="font-semibold">파일 표시 이름 (선택)</Label>
                                    <Input id="fileName" name="fileName" value={formData.fileName || ''} onChange={handleChange} placeholder="예: 회사소개서.pdf" />
                                </div>
                            </>
                        )}

                        {formData.type === 'deliveryRecordList' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">납품 실적 관리</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addDeliveryRecord}>
                                        <PlusCircle className="mr-2 h-4 w-4" />실적 추가
                                    </Button>
                                </div>
                                {deliveryRecords.length === 0 && <p className="text-sm text-gray-500">납품 실적이 없습니다. 추가 버튼을 눌러 입력하세요.</p>}
                                {deliveryRecords.map((record, index) => (
                                    <div key={record.id || index} className="p-4 border rounded-md space-y-3 bg-gray-50 dark:bg-slate-700/50">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-sm">항목 #{index + 1}</p>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeDeliveryRecord(index)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <Label htmlFor={`record-company-${index}`} className="text-xs">고객명</Label>
                                                <Input id={`record-company-${index}`} name="company" value={record.company} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="고객사명" />
                                            </div>
                                            <div>
                                                <Label htmlFor={`record-project-${index}`} className="text-xs">프로젝트명</Label>
                                                <Input id={`record-project-${index}`} name="project" value={record.project} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="프로젝트명" />
                                            </div>
                                            <div>
                                                <Label htmlFor={`record-date-${index}`} className="text-xs">납품(완료)일</Label>
                                                <Input id={`record-date-${index}`} name="date" type="text" value={record.date} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="YYYY-MM-DD 또는 YYYY-MM" />
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`record-isApartment-${index}`}
                                                name="isApartment"
                                                checked={record.isApartment}
                                                onCheckedChange={(checked) => {
                                                    const event = { target: { name: "isApartment", value: String(checked), type: "checkbox", checked: Boolean(checked) } } as unknown as React.ChangeEvent<HTMLInputElement>;
                                                    handleDeliveryRecordChange(index, event);
                                                }}
                                            />
                                            <Label htmlFor={`record-isApartment-${index}`} className="text-xs font-normal">아파트/건설사 프로젝트</Label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-4">
                            <div>
                                <Label htmlFor="order" className="font-semibold">표시 순서</Label>
                                <Input id="order" name="order" type="number" value={formData.order || 0} onChange={handleChange} />
                            </div>
                            <div className="flex items-center space-x-3 pt-5">
                                <Checkbox id="isVisible" name="isVisible" checked={!!formData.isVisible} onCheckedChange={(checkedState) => setFormData(prev => ({ ...prev, isVisible: Boolean(checkedState) }))} />
                                <Label htmlFor="isVisible" className="font-semibold text-sm">공개 여부 (체크 시 사용자에게 공개)</Label>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-end space-x-3 border-t pt-6">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                            취소
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isLoading} className="bg-sky-600 hover:bg-sky-700 text-white">
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 저장 중...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> 변경사항 저장</>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 