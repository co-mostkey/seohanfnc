'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Trash2, PlusCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const promotionTypeLabels: Record<PromotionType, string> = {
    mainHeroVideo: '메인 히어로 비디오',
    video: '일반 비디오',
    image: '이미지',
    document: '문서',
    deliveryRecordList: '납품 실적 목록',
};

export default function EditPromotionPage() {
    const router = useRouter();
    const params = useParams();
    const promotionId = params?.id as string;

    const [formData, setFormData] = useState<Partial<PromotionItem>>({
        title: '',
        type: 'video',
        order: 0,
        isVisible: true,
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        imageUrl: '',
        documentUrl: '',
        fileName: '',
        records: [],
    });
    const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialError, setInitialError] = useState<string | null>(null); // 데이터 로딩 전용 에러 상태

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
                    setFormData(data); // API에서 받은 전체 데이터로 formData 설정
                    if (data.type === 'deliveryRecordList' && data.records) {
                        setDeliveryRecords(data.records);
                    } else {
                        setDeliveryRecords([]); // 다른 타입이거나 records가 없으면 초기화
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
        setError(null); // 입력 시 기존 제출 오류 메시지 제거
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
        setError(null); // 입력 시 기존 제출 오류 메시지 제거
        setFormData(prev => {
            const newState: Partial<PromotionItem> = {
                ...prev,
                type: newType,
            };
            // 타입 변경 시 관련 필드만 유지하고 나머지는 초기화 또는 undefined로 설정
            newState.videoUrl = (newType === 'video' || newType === 'mainHeroVideo') ? prev.videoUrl : '';
            newState.thumbnailUrl = (newType === 'video' || newType === 'mainHeroVideo') ? prev.thumbnailUrl : '';
            newState.imageUrl = newType === 'image' ? prev.imageUrl : '';
            newState.documentUrl = newType === 'document' ? prev.documentUrl : '';
            newState.fileName = newType === 'document' ? prev.fileName : '';

            if (newType !== 'deliveryRecordList') {
                newState.records = []; // deliveryRecordList가 아니면 records 초기화
                setDeliveryRecords([]);
            } else {
                // deliveryRecordList로 변경 시, 기존 deliveryRecords 상태를 유지하거나, formData.records를 사용
                // 여기서는 deliveryRecords 상태가 이미 관리되고 있으므로 별도 조치 필요 없음
                // 단, 최초 로딩 시 deliveryRecordList 였다가 다른 타입으로 변경 후 다시 deliveryRecordList로 돌아올 때를 대비
                setDeliveryRecords(prev.records || []);
            }
            return newState;
        });
    };

    const addDeliveryRecord = () => {
        setError(null);
        setDeliveryRecords(prev => [...prev, { id: uuidv4(), company: '', project: '', date: '', isApartment: false }]);
    };

    const handleDeliveryRecordChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!formData.title || !formData.type) {
            setError('제목과 타입은 필수 입력 항목입니다.');
            setIsSubmitting(false);
            return;
        }
        if (!promotionId || !formData.id) {
            setError('홍보 자료 ID가 유효하지 않습니다. 페이지를 새로고침해주세요.');
            setIsSubmitting(false);
            return;
        }

        const payload: PromotionItem = {
            ...formData, // 기존 formData를 기본으로 사용
            id: promotionId, // URL에서 가져온 ID를 사용 (formData.id와 동일해야 함)
            title: formData.title!,
            type: formData.type!,
            order: formData.order || 0,
            isVisible: formData.isVisible === undefined ? true : formData.isVisible,
            description: formData.description || '',
            videoUrl: (formData.type === 'video' || formData.type === 'mainHeroVideo') ? formData.videoUrl : undefined,
            thumbnailUrl: (formData.type === 'video' || formData.type === 'mainHeroVideo') ? formData.thumbnailUrl : undefined,
            imageUrl: formData.type === 'image' ? formData.imageUrl : undefined,
            documentUrl: formData.type === 'document' ? formData.documentUrl : undefined,
            fileName: formData.type === 'document' ? formData.fileName : undefined,
            records: formData.type === 'deliveryRecordList' ? deliveryRecords : [],
            // createdAt은 API에서 관리하므로 payload에서 제거하거나, 기존 값 그대로 전달
            // createdAt: formData.createdAt, 
            updatedAt: new Date().toISOString(),
        };
        // API에 전달하지 않을 필드가 formData에 있다면 여기서 제거
        delete payload.createdAt; // createdAt은 PUT 요청 시 보내지 않음 (API가 자동 관리)

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

            alert('홍보 자료가 성공적으로 수정되었습니다.');
            router.push('/admin/promotions');
            router.refresh(); // 목록 페이지 데이터 갱신
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
                <div className="max-w-md mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8">
                    <AlertTriangle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-3">오류 발생</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{initialError}</p>
                    <Button onClick={() => router.push('/admin/promotions')} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                        홍보 자료 목록으로 돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">홍보 자료 수정</CardTitle>
                    <CardDescription>ID: {promotionId} - 기존 홍보 콘텐츠의 내용을 수정합니다.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 py-6">
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700 rounded-md flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">고유 ID</Label>
                                <Input id="id" name="id" type="text" value={formData.id || ''} readOnly className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">이 ID는 변경할 수 없습니다.</p>
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
                                    <Card key={record.id || index} className="bg-slate-50 dark:bg-slate-800 p-4 relative"> {/* key에 index 추가 */}
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
                                                <Label htmlFor={`record-company-${record.id || index}`}>회사명</Label>
                                                <Input name="company" id={`record-company-${record.id || index}`} value={record.company} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="예: 한국전력공사" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`record-project-${record.id || index}`}>프로젝트명</Label>
                                                <Input name="project" id={`record-project-${record.id || index}`} value={record.project} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="예: 차세대 전력 시스템" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`record-date-${record.id || index}`}>납품일 (YYYY-MM)</Label>
                                                <Input name="date" id={`record-date-${record.id || index}`} value={record.date} onChange={(e) => handleDeliveryRecordChange(index, e)} placeholder="2024-07" />
                                            </div>
                                            <div className="flex items-center pt-6 space-x-2">
                                                <Checkbox name="isApartment" id={`record-isApartment-${record.id || index}`} checked={record.isApartment} onCheckedChange={(checked) => handleDeliveryRecordChange(index, { target: { name: 'isApartment', value: String(checked), type: 'checkbox' } } as any)} />
                                                <Label htmlFor={`record-isApartment-${record.id || index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">아파트 건설</Label>
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
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">숫자가 낮을수록 목록에서 먼저 표시됩니다.</p>
                            </div>
                            <div className="flex items-center pt-7 space-x-2">
                                <Checkbox id="isVisible" name="isVisible" checked={!!formData.isVisible} onCheckedChange={(checked) => handleChange({ target: { name: 'isVisible', checked, type: 'checkbox' } } as any)} />
                                <Label htmlFor="isVisible" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">사용자에게 공개</Label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-end gap-2 w-full">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isSubmitting || isLoading} className="bg-sky-600 hover:bg-sky-700 text-white">
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