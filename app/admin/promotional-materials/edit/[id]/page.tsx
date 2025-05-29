"use client";
// 홍보자료 수정 페이지

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PromotionItem, PromotionType, DeliveryRecord } from '@/types/promotion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, PlusCircleIcon, Save, Trash2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const promotionTypes: PromotionType[] = [
    'deliveryRecordList',
    'video',
    'image',
    'document',
    'mainTitleBoxMultiVideo',
    'customContent',
    'gallery',
    'news',
    'timeline'
];

const EditPromotionalMaterialPage = () => {
    const router = useRouter();
    const params = useParams();

    let id: string | undefined;
    if (params && typeof params.id === 'string') {
        id = params.id;
    } else if (params && Array.isArray(params.id) && params.id.length > 0 && typeof params.id[0] === 'string') {
        id = params.id[0];
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<PromotionItem>>({});

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (!id) {
            setError('잘못된 접근입니다: 홍보자료 ID가 없습니다.');
            setIsLoadingData(false);
            return;
        }
        const fetchPromotionItem = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const response = await fetch(`/api/promotions/${id}`, { cache: 'no-store' });
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('해당 ID의 홍보 자료를 찾을 수 없습니다.');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const itemToEdit: PromotionItem = await response.json();

                if (itemToEdit) {
                    const normalizedItem = {
                        ...itemToEdit,
                        videoUrls: itemToEdit.videoUrls || [],
                        records: itemToEdit.records || [],
                        galleryImages: itemToEdit.galleryImages || [],
                        contentType: itemToEdit.contentType || 'html',
                    };
                    setFormData(normalizedItem);
                } else {
                    setError('해당 ID의 홍보 자료를 찾을 수 없습니다.');
                }
            } catch (e: any) {
                setError(e.message || '홍보 자료를 불러오는 중 오류가 발생했습니다.');
                console.error("Error fetching promotion item for edit:", e);
            }
            setIsLoadingData(false);
        };
        fetchPromotionItem();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => {
            const newRecords = (value === 'deliveryRecordList') ?
                (prev.records && prev.records.length > 0 ? prev.records : [{ id: uuidv4(), company: '', project: '', date: '' }])
                : undefined;

            const newVideoUrls = (value === 'mainTitleBoxMultiVideo') ?
                (prev.videoUrls && prev.videoUrls.length > 0 ? prev.videoUrls : [''])
                : undefined;

            return {
                ...prev,
                type: value as PromotionType,
                videoUrl: (value === 'video') ? (prev.videoUrl || '') : undefined,
                videoUrls: newVideoUrls,
                imageUrl: (value === 'image') ? (prev.imageUrl || '') : undefined,
                documentUrl: (value === 'document') ? (prev.documentUrl || '') : undefined,
                fileName: (value === 'document') ? (prev.fileName || '') : undefined,
                records: newRecords,
                thumbnailUrl: (value === 'video') ? (prev.thumbnailUrl || '') : undefined,
            };
        });
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

    const handleRecordChange = (index: number, field: keyof DeliveryRecord, value: string) => {
        setFormData(prev => {
            const newRecords = prev.records ? [...prev.records] : [];
            if (newRecords[index]) {
                (newRecords[index] as any)[field] = value;
            }
            return { ...prev, records: newRecords };
        });
    };

    const addRecordField = () => {
        setFormData(prev => ({
            ...prev,
            records: [...(prev.records || []), { id: uuidv4(), company: '', project: '', date: '' }]
        }));
    };

    const removeRecordField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            records: (prev.records || []).filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'videoUrl' | 'imageUrl' | 'documentUrl', originalFileNameField?: 'fileName') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const currentType = formData.type;
        if (!currentType || (currentType !== 'video' && currentType !== 'image' && currentType !== 'document')) {
            setUploadError('파일 업로드는 "일반 비디오", "이미지", "문서" 타입에서만 가능합니다.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', currentType);

        try {
            setUploadProgress(50);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '파일 업로드 실패');
            }

            const result = await response.json();
            setFormData(prev => ({
                ...prev,
                [fieldName]: result.url,
                ...(originalFileNameField && result.fileName && { [originalFileNameField]: result.fileName }),
            }));
            e.target.value = '';

        } catch (err: any) {
            setUploadError(err.message || '파일 업로드 중 오류 발생');
            console.error("File upload error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleGalleryImageChange = (index: number, field: 'url' | 'caption', value: string) => {
        setFormData(prev => {
            const newImages = [...(prev.galleryImages || [])];
            if (newImages[index]) {
                newImages[index] = { ...newImages[index], [field]: value };
            }
            return { ...prev, galleryImages: newImages };
        });
    };

    const addGalleryImage = () => {
        setFormData(prev => ({
            ...prev,
            galleryImages: [...(prev.galleryImages || []), { id: uuidv4(), url: '', caption: '', order: (prev.galleryImages?.length || 0) }]
        }));
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index)
        }));
    };

    const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadError(null);

        const uploadedImages: { id: string; url: string; caption: string; order: number }[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                uploadFormData.append('type', 'image');

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!response.ok) {
                    throw new Error(`파일 ${file.name} 업로드 실패`);
                }

                const result = await response.json();
                uploadedImages.push({
                    id: uuidv4(),
                    url: result.url,
                    caption: '',
                    order: (formData.galleryImages?.length || 0) + i
                });
            }

            setFormData(prev => ({
                ...prev,
                galleryImages: [...(prev.galleryImages || []), ...uploadedImages]
            }));

            e.target.value = '';

        } catch (err: any) {
            setUploadError(err.message || '파일 업로드 중 오류 발생');
            console.error("Gallery upload error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!formData.title || !formData.type) {
            setError("제목, 타입은 필수 입력 항목입니다.");
            setIsSubmitting(false);
            return;
        }

        const payload: PromotionItem = {
            ...(formData as PromotionItem),
            id: id!,
            title: formData.title!,
            type: formData.type!,
            order: typeof formData.order === 'number' ? formData.order : 0,
            updatedAt: new Date().toISOString(),
        };

        const finalPayload: Partial<PromotionItem> = {
            id: payload.id,
            title: payload.title,
            type: payload.type,
            description: payload.description || '',
            boxTitle: payload.type === 'deliveryRecordList' ? (formData.boxTitle || '') : undefined,
            order: payload.order,
            isVisible: payload.isVisible === undefined ? true : payload.isVisible,
            createdAt: payload.createdAt || new Date().toISOString(),
            updatedAt: payload.updatedAt,
        };

        if (payload.type === 'video') {
            finalPayload.videoUrl = formData.videoUrl;
            finalPayload.thumbnailUrl = formData.thumbnailUrl;
        } else if (payload.type === 'mainTitleBoxMultiVideo') {
            finalPayload.videoUrls = formData.videoUrls;
            finalPayload.showButton = formData.showButton;
            finalPayload.buttonText = formData.buttonText;
            finalPayload.buttonLink = formData.buttonLink;
        } else if (payload.type === 'image') {
            finalPayload.imageUrl = formData.imageUrl;
        } else if (payload.type === 'document') {
            finalPayload.documentUrl = formData.documentUrl;
            finalPayload.fileName = formData.fileName;
        } else if (payload.type === 'deliveryRecordList') {
            finalPayload.records = formData.records;
        } else if (payload.type === 'news') {
            finalPayload.newsLink = formData.newsLink;
            finalPayload.newsDescription = formData.newsDescription;
            finalPayload.newsDate = formData.newsDate;
            finalPayload.newsSource = formData.newsSource;
        } else if (payload.type === 'gallery') {
            finalPayload.galleryImages = formData.galleryImages;
        } else if (payload.type === 'customContent') {
            finalPayload.contentType = formData.contentType;
            if (formData.contentType === 'html') {
                finalPayload.customHtml = formData.customHtml;
            } else {
                finalPayload.markdownContent = formData.markdownContent;
            }
        }

        try {
            const response = await fetch(`/api/promotions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload as PromotionItem),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            router.push('/admin/promotional-materials');
        } catch (err: any) {
            setError(err.message || '홍보 자료 수정 중 오류가 발생했습니다.');
            console.error("Error updating promotion:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAdditionalFields = () => {
        if (!formData.type) return null;

        const FileUploadField = ({
            label,
            fieldName,
            currentUrl,
            originalFileNameField,
            originalFileName
        }: {
            label: string,
            fieldName: 'videoUrl' | 'imageUrl' | 'documentUrl',
            currentUrl?: string,
            originalFileNameField?: 'fileName',
            originalFileName?: string
        }) => (
            <div className="space-y-2">
                <Label htmlFor={fieldName} className="text-gray-200">{label}</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id={fieldName}
                        name={fieldName}
                        value={currentUrl || ''}
                        onChange={handleChange}
                        placeholder={`${label} URL 또는 파일 업로드`}
                        className="flex-grow bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                        disabled={isUploading}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById(`file-upload-${fieldName}`)?.click()} disabled={isUploading} title="파일 업로드" className="border-gray-600 hover:bg-gray-700">
                        <UploadCloud className="h-5 w-5" />
                    </Button>
                    <input
                        type="file"
                        id={`file-upload-${fieldName}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, fieldName, originalFileNameField)}
                        disabled={isUploading}
                        accept={formData.type === 'image' ? 'image/*' : formData.type === 'video' ? 'video/*' : formData.type === 'document' ? '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt' : ''}
                    />
                </div>
                {isUploading && <p className="text-xs text-blue-400">업로드 중... {uploadProgress}%</p>}
                {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                {currentUrl && <p className="text-xs text-gray-400 mt-1">현재 파일: <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="underline text-orange-400 hover:text-orange-300">{originalFileNameField && originalFileName ? originalFileName : currentUrl}</a></p>}
                {originalFileNameField === 'fileName' && (
                    <div className="mt-2 space-y-1">
                        <Label htmlFor="fileName" className="text-xs text-gray-400">문서 표시 이름 (선택)</Label>
                        <Input
                            id="fileName"
                            name="fileName"
                            value={formData.fileName || ''}
                            onChange={handleChange}
                            placeholder="예: 회사소개서.pdf"
                            disabled={isUploading}
                            className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                        />
                    </div>
                )}
            </div>
        );

        switch (formData.type) {
            case 'video':
                return (
                    <>
                        <FileUploadField label="비디오 파일 또는 URL" fieldName="videoUrl" currentUrl={formData.videoUrl} />
                        <div className="space-y-2 mt-4">
                            <Label htmlFor="thumbnailUrl" className="text-gray-200">썸네일 URL (선택)</Label>
                            <Input id="thumbnailUrl" name="thumbnailUrl" value={formData.thumbnailUrl || ''} onChange={handleChange} placeholder="예: /images/promo_thumb.jpg" className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500" />
                        </div>
                    </>
                );
            case 'mainTitleBoxMultiVideo':
                return (
                    <div className="space-y-4">
                        <Label className="font-semibold text-gray-200">메인 타이틀 다중 비디오 URL들</Label>
                        {(formData.videoUrls || []).map((url, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    name={`videoUrl-${index}`}
                                    value={url}
                                    onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                                    placeholder={`비디오 URL #${index + 1}`}
                                    className="flex-grow bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeVideoUrlField(index)} disabled={(formData.videoUrls?.length ?? 0) <= 1 && index === 0} className="hover:bg-gray-700">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addVideoUrlField} className="mt-2 border-gray-600 hover:bg-gray-700">
                            <PlusCircleIcon className="mr-2 h-4 w-4" />
                            비디오 URL 추가
                        </Button>
                        {(formData.videoUrls || []).length === 0 && (
                            <p className="text-xs text-gray-500">첫번째 URL을 추가해주세요.</p>
                        )}

                        {/* 버튼 설정 섹션 */}
                        <div className="mt-6 p-4 border border-gray-600 rounded-lg bg-gray-900/50 space-y-4">
                            <h4 className="font-semibold text-gray-200">버튼 설정 (선택사항)</h4>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="showButton"
                                    name="showButton"
                                    checked={!!formData.showButton}
                                    onCheckedChange={(checkedState) => setFormData(prev => ({ ...prev, showButton: Boolean(checkedState) }))}
                                    className="border-gray-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                />
                                <Label htmlFor="showButton" className="font-medium text-sm text-gray-200">비디오 재생 후 버튼 표시</Label>
                            </div>

                            {formData.showButton && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="buttonText" className="text-sm text-gray-300">버튼 텍스트</Label>
                                        <Input
                                            id="buttonText"
                                            name="buttonText"
                                            value={formData.buttonText || ''}
                                            onChange={handleChange}
                                            placeholder="예: 제품 보러가기"
                                            className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="buttonLink" className="text-sm text-gray-300">버튼 링크</Label>
                                        <Input
                                            id="buttonLink"
                                            name="buttonLink"
                                            value={formData.buttonLink || ''}
                                            onChange={handleChange}
                                            placeholder="예: /products 또는 https://example.com"
                                            className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                        />
                                        <p className="text-xs text-gray-400">내부 링크는 /로 시작, 외부 링크는 http://나 https://로 시작</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <FileUploadField label="이미지 파일 또는 URL" fieldName="imageUrl" currentUrl={formData.imageUrl} />
                );
            case 'document':
                return (
                    <FileUploadField
                        label="문서 파일 또는 URL"
                        fieldName="documentUrl"
                        currentUrl={formData.documentUrl}
                        originalFileNameField="fileName"
                        originalFileName={formData.fileName}
                    />
                );
            case 'deliveryRecordList':
                return (
                    <div className="space-y-4">
                        <Label className="font-semibold text-gray-200">납품 실적 목록</Label>
                        {(formData.records || []).map((record, index) => (
                            <div key={index} className="p-4 border border-gray-700 rounded-md space-y-3 bg-gray-900">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm text-gray-200">항목 #{index + 1}</p>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRecordField(index)} disabled={(formData.records?.length ?? 0) <= 1 && index === 0} className="hover:bg-gray-700">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <Label htmlFor={`record-company-${index}`} className="text-xs text-gray-400">고객명</Label>
                                        <Input
                                            id={`record-company-${index}`}
                                            name={`record-company-${index}`}
                                            value={record.company}
                                            onChange={(e) => handleRecordChange(index, 'company', e.target.value)}
                                            placeholder="고객사명"
                                            className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`record-project-${index}`} className="text-xs text-gray-400">프로젝트명</Label>
                                        <Input
                                            id={`record-project-${index}`}
                                            name={`record-project-${index}`}
                                            value={record.project}
                                            onChange={(e) => handleRecordChange(index, 'project', e.target.value)}
                                            placeholder="진행 프로젝트명"
                                            className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`record-date-${index}`} className="text-xs text-gray-400">납품(완료)일</Label>
                                        <Input
                                            id={`record-date-${index}`}
                                            name={`record-date-${index}`}
                                            type="date"
                                            value={record.date}
                                            onChange={(e) => handleRecordChange(index, 'date', e.target.value)}
                                            className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addRecordField} className="mt-2 border-gray-600 hover:bg-gray-700">
                            <PlusCircleIcon className="mr-2 h-4 w-4" />
                            납품 실적 추가
                        </Button>
                        {(formData.records || []).length === 0 && (
                            <p className="text-xs text-gray-500">첫번째 납품 실적을 추가해주세요.</p>
                        )}
                    </div>
                );
            case 'news':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                            <p className="text-sm text-blue-400">뉴스/소식은 외부 링크로 연결되는 콘텐츠입니다. 링크와 설명을 입력해주세요.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newsLink" className="font-semibold text-gray-200">뉴스 링크 <span className="text-red-500">*</span></Label>
                            <Input
                                id="newsLink"
                                name="newsLink"
                                value={formData.newsLink || ''}
                                onChange={handleChange}
                                placeholder="https://news.example.com/article/12345"
                                className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                            />
                            <p className="text-xs text-gray-400">뉴스 기사나 보도자료의 외부 링크를 입력하세요.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newsDescription" className="font-semibold text-gray-200">뉴스 설명</Label>
                            <Textarea
                                id="newsDescription"
                                name="newsDescription"
                                value={formData.newsDescription || ''}
                                onChange={handleChange}
                                placeholder="뉴스 내용에 대한 간략한 설명을 입력하세요."
                                rows={3}
                                className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="newsDate" className="font-semibold text-gray-200">뉴스 날짜</Label>
                                <Input
                                    id="newsDate"
                                    name="newsDate"
                                    type="date"
                                    value={formData.newsDate || ''}
                                    onChange={handleChange}
                                    className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newsSource" className="font-semibold text-gray-200">뉴스 출처</Label>
                                <Input
                                    id="newsSource"
                                    name="newsSource"
                                    value={formData.newsSource || ''}
                                    onChange={handleChange}
                                    placeholder="예: 중앙일보, 연합뉴스"
                                    className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'gallery':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                            <p className="text-sm text-green-400">이미지 갤러리는 여러 이미지를 업로드하여 갤러리 형태로 표시하는 타입입니다.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold text-gray-200">갤러리 이미지 업로드</Label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('gallery-upload')?.click()}
                                    disabled={isUploading}
                                    className="w-full border-gray-600 hover:bg-gray-700"
                                >
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    {isUploading ? '업로드 중...' : '이미지 파일 선택 (여러 개 가능)'}
                                </Button>
                                <input
                                    type="file"
                                    id="gallery-upload"
                                    className="hidden"
                                    onChange={handleGalleryFileUpload}
                                    disabled={isUploading}
                                    accept="image/*"
                                    multiple
                                />
                            </div>
                            {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                        </div>
                        {(formData.galleryImages || []).length > 0 && (
                            <div className="space-y-3">
                                <Label className="font-semibold text-gray-200">업로드된 이미지</Label>
                                {formData.galleryImages?.map((image, index) => (
                                    <div key={image.id} className="p-3 border border-gray-700 rounded-md space-y-2 bg-gray-900">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <Label htmlFor={`gallery-url-${index}`} className="text-xs text-gray-400">이미지 URL</Label>
                                                    <Input
                                                        id={`gallery-url-${index}`}
                                                        value={image.url}
                                                        onChange={(e) => handleGalleryImageChange(index, 'url', e.target.value)}
                                                        placeholder="이미지 URL"
                                                        className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`gallery-caption-${index}`} className="text-xs text-gray-400">캡션 (선택)</Label>
                                                    <Input
                                                        id={`gallery-caption-${index}`}
                                                        value={image.caption || ''}
                                                        onChange={(e) => handleGalleryImageChange(index, 'caption', e.target.value)}
                                                        placeholder="이미지 설명"
                                                        className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeGalleryImage(index)}
                                                className="ml-2 hover:bg-gray-700"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                        {image.url && (
                                            <div className="mt-2">
                                                <img
                                                    src={image.url}
                                                    alt={image.caption || '갤러리 이미지'}
                                                    className="h-20 w-auto rounded border border-gray-600"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addGalleryImage} className="mt-2 border-gray-600 hover:bg-gray-700">
                                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                                    이미지 URL 직접 추가
                                </Button>
                            </div>
                        )}
                    </div>
                );
            case 'customContent':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                            <p className="text-sm text-purple-400">커스텀 콘텐츠는 HTML 또는 마크다운으로 자유롭게 콘텐츠를 작성할 수 있습니다.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold text-gray-200">콘텐츠 타입</Label>
                            <RadioGroup
                                value={formData.contentType || 'html'}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value as 'html' | 'markdown' }))}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="html" id="content-html" className="border-gray-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600" />
                                    <Label htmlFor="content-html" className="font-normal">HTML</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="markdown" id="content-markdown" className="border-gray-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600" />
                                    <Label htmlFor="content-markdown" className="font-normal">Markdown</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {formData.contentType === 'html' ? (
                            <div className="space-y-2">
                                <Label htmlFor="customHtml" className="font-semibold text-gray-200">HTML 콘텐츠</Label>
                                <Textarea
                                    id="customHtml"
                                    name="customHtml"
                                    value={formData.customHtml || ''}
                                    onChange={handleChange}
                                    placeholder="<div><h2>제목</h2><p>내용을 입력하세요...</p></div>"
                                    rows={10}
                                    className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500 font-mono text-sm"
                                />
                                <p className="text-xs text-gray-400">HTML 태그를 사용하여 자유롭게 콘텐츠를 작성할 수 있습니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="markdownContent" className="font-semibold text-gray-200">Markdown 콘텐츠</Label>
                                <Textarea
                                    id="markdownContent"
                                    name="markdownContent"
                                    value={formData.markdownContent || ''}
                                    onChange={handleChange}
                                    placeholder="## 제목\n\n내용을 입력하세요...\n\n- 목록 항목 1\n- 목록 항목 2"
                                    rows={10}
                                    className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500 font-mono text-sm"
                                />
                                <p className="text-xs text-gray-400">마크다운 문법을 사용하여 콘텐츠를 작성할 수 있습니다.</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (isLoadingData) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <p className="ml-3 text-lg text-gray-300">홍보 자료 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-2xl">
            <div className="flex items-center mb-6">
                <Button variant="outline" size="icon" asChild className="mr-4 border-gray-600 hover:bg-gray-700">
                    <Link href="/admin/promotional-materials">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">뒤로 가기</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-gray-100">홍보자료 수정 (ID: {id})</h1>
            </div>

            {error && <p className="mb-4 text-sm text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800">{error}</p>}

            {Object.keys(formData).length === 0 && !isLoadingData && !error && (
                <p className="text-center text-gray-400 py-10">홍보 자료를 찾을 수 없거나 불러오는 데 실패했습니다.</p>
            )}

            {Object.keys(formData).length > 0 && (
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg border border-gray-700">
                    <div className="space-y-2">
                        <Label htmlFor="id" className="font-semibold text-gray-200">고유 ID</Label>
                        <Input id="id" name="id" value={formData.id || ''} readOnly disabled className="bg-gray-900 border-gray-600 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title" className="font-semibold text-gray-200">제목 <span className="text-red-500">*</span></Label>
                        <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} placeholder="홍보자료의 제목" required className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="font-semibold text-gray-200">설명</Label>
                        <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} placeholder="홍보자료에 대한 간략한 설명 (선택 사항)" rows={3} className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500" />
                    </div>
                    {formData.type === 'deliveryRecordList' && (
                        <div className="space-y-2">
                            <Label htmlFor="boxTitle" className="font-semibold text-gray-200">박스 타이틀</Label>
                            <Input
                                id="boxTitle"
                                name="boxTitle"
                                value={formData.boxTitle || ''}
                                onChange={handleChange}
                                placeholder="예: 2024년 주요 납품실적"
                                className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500"
                            />
                            <p className="text-xs text-gray-400">메인 페이지에 표시될 컨테이너 타이틀입니다.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="font-semibold text-gray-200">타입 <span className="text-red-500">*</span></Label>
                            <Select name="type" onValueChange={handleTypeChange} value={formData.type}>
                                <SelectTrigger id="type" className="bg-gray-900 border-gray-600 text-gray-100 focus:border-orange-500">
                                    <SelectValue placeholder="홍보자료 타입을 선택하세요" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {promotionTypes.map(typeVal => (
                                        <SelectItem key={typeVal} value={typeVal} className="text-gray-200 hover:bg-gray-700">
                                            {typeVal === 'deliveryRecordList' && '납품 실적 목록'}
                                            {typeVal === 'video' && '일반 비디오'}
                                            {typeVal === 'image' && '이미지'}
                                            {typeVal === 'document' && '문서'}
                                            {typeVal === 'mainTitleBoxMultiVideo' && '메인 다중 비디오'}
                                            {typeVal === 'customContent' && '커스텀 콘텐츠'}
                                            {typeVal === 'gallery' && '이미지 갤러리'}
                                            {typeVal === 'news' && '뉴스/소식'}
                                            {typeVal === 'timeline' && '연혁/타임라인'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order" className="font-semibold text-gray-200">표시 순서</Label>
                            <Input id="order" name="order" type="number" value={formData.order || 0} onChange={handleChange} placeholder="숫자가 작을수록 먼저 표시" className="bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-orange-500" />
                        </div>
                    </div>
                    {formData.type && renderAdditionalFields()}
                    <div className="flex items-center space-x-3 pt-4">
                        <Checkbox
                            id="isVisible"
                            name="isVisible"
                            checked={!!formData.isVisible}
                            onCheckedChange={(checkedState) => setFormData(prev => ({ ...prev, isVisible: Boolean(checkedState) }))}
                            className="border-gray-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                        />
                        <Label htmlFor="isVisible" className="font-semibold text-sm text-gray-200">공개 여부 (체크 시 사용자에게 공개)</Label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700 mt-6">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="border-gray-600 hover:bg-gray-700">
                            취소
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isLoadingData} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 animate-spin" /> 변경사항 저장 중...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> 변경사항 저장</>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditPromotionalMaterialPage; 