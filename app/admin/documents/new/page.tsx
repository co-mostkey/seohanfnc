"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Upload,
    Save,
    FileText,
    Plus,
    X
} from 'lucide-react';
import { ADMIN_UI, ADMIN_FONT_STYLES } from '@/lib/admin-ui-constants';

interface DocumentForm {
    title: string;
    description: string;
    category: string;
    fileType: string;
    fileName: string;
    filePath: string;
    fileSize: string;
    isPublic: boolean;
    tags: string[];
    version: string;
}

export default function NewDocumentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const documentType = searchParams?.get('type') as 'approval' | 'general' || 'approval';

    const [formData, setFormData] = useState<DocumentForm>({
        title: '',
        description: '',
        category: '',
        fileType: 'pdf',
        fileName: '',
        filePath: '',
        fileSize: '',
        isPublic: true,
        tags: [],
        version: '1.0'
    });

    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [uploadedFile, setUploadedFile] = useState<{ url: string; filename: string; originalName?: string; fileSize?: number } | null>(null);

    // 카테고리 로드
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch('/api/documents');
                const result = await response.json();
                if (result.success) {
                    setCategories(result.data.categories[documentType] || []);
                }
            } catch (error) {
                console.error('카테고리 로드 실패:', error);
            }
        };

        loadCategories();
    }, [documentType]);

    // 폼 데이터 업데이트
    const updateFormData = (field: keyof DocumentForm, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 태그 추가
    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            updateFormData('tags', [...formData.tags, newTag.trim()]);
            setNewTag('');
        }
    };

    // 태그 제거
    const removeTag = (tagToRemove: string) => {
        updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    // 파일 업로드 성공 핸들러
    const handleFileUploadSuccess = (uploadedFileInfo: { url: string; filename: string; originalName?: string; fileSize?: number }) => {
        setUploadedFile(uploadedFileInfo);

        // 파일 정보를 formData에 업데이트
        updateFormData('fileName', uploadedFileInfo.filename);
        updateFormData('filePath', uploadedFileInfo.url);

        // 파일 크기를 MB 단위로 변환
        if (uploadedFileInfo.fileSize) {
            const fileSizeMB = (uploadedFileInfo.fileSize / 1024 / 1024).toFixed(1);
            updateFormData('fileSize', `${fileSizeMB}MB`);
        }

        // 파일 타입 추출
        const fileExtension = uploadedFileInfo.filename.split('.').pop()?.toLowerCase() || 'pdf';
        updateFormData('fileType', fileExtension);

        // 제목이 비어있으면 파일명에서 자동 생성
        if (!formData.title && uploadedFileInfo.originalName) {
            const titleFromFile = uploadedFileInfo.originalName.replace(/\.[^/.]+$/, "");
            updateFormData('title', titleFromFile);
        }

        toast.success('파일이 성공적으로 업로드되었습니다.');
    };

    // 파일 업로드 오류 핸들러
    const handleFileUploadError = (error: string) => {
        toast.error(`파일 업로드 실패: ${error}`);
    };

    // 폼 제출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.fileName || !formData.category) {
            toast.error('필수 항목을 모두 입력해주세요.');
            return;
        }

        if (!uploadedFile) {
            toast.error('파일을 업로드해주세요.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: documentType,
                    document: formData
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('문서가 성공적으로 추가되었습니다.');
                router.push('/admin/documents');
            } else {
                toast.error('문서 추가에 실패했습니다: ' + result.error);
            }
        } catch (error) {
            console.error('문서 추가 중 오류:', error);
            toast.error('문서 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${ADMIN_UI.BG_PRIMARY} ${ADMIN_UI.TEXT_PRIMARY}`}>
            <div className="container mx-auto px-4 py-6">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            돌아가기
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white" style={ADMIN_FONT_STYLES.HEADING}>
                                새 문서 추가
                            </h1>
                            <p className="text-gray-400 mt-1" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                {documentType === 'approval' ? '승인서류/카탈로그' : '일반 자료실'}에 새 문서를 추가합니다.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 메인 정보 */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 기본 정보 */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white" style={ADMIN_FONT_STYLES.HEADING}>
                                        기본 정보
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title" className="text-gray-300">
                                            문서 제목 *
                                        </Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => updateFormData('title', e.target.value)}
                                            placeholder="문서 제목을 입력하세요"
                                            className="bg-gray-700 border-gray-600 text-white mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-gray-300">
                                            설명
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => updateFormData('description', e.target.value)}
                                            placeholder="문서에 대한 설명을 입력하세요"
                                            className="bg-gray-700 border-gray-600 text-white mt-1"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category" className="text-gray-300">
                                                카테고리 *
                                            </Label>
                                            <select
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => updateFormData('category', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white mt-1"
                                                required
                                            >
                                                <option value="">카테고리 선택</option>
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="version" className="text-gray-300">
                                                버전
                                            </Label>
                                            <Input
                                                id="version"
                                                value={formData.version}
                                                onChange={(e) => updateFormData('version', e.target.value)}
                                                placeholder="1.0"
                                                className="bg-gray-700 border-gray-600 text-white mt-1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 파일 업로드 */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white" style={ADMIN_FONT_STYLES.HEADING}>
                                        파일 업로드
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="file" className="text-gray-300">
                                            파일 선택 *
                                        </Label>
                                        <div className="mt-1">
                                            <FileUpload
                                                endpoint="/api/admin/upload"
                                                onUploadSuccess={handleFileUploadSuccess}
                                                onUploadError={handleFileUploadError}
                                                fileType={`documents/${documentType}`}
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                                maxSizeMb={50}
                                                buttonText="문서 파일 업로드"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            지원 형식: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (최대 50MB)
                                        </p>
                                    </div>

                                    {formData.fileName && (
                                        <div className="p-4 bg-gray-700 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-8 w-8 text-orange-500" />
                                                <div>
                                                    <p className="text-white font-medium">{formData.fileName}</p>
                                                    <p className="text-gray-400 text-sm">
                                                        {formData.fileSize} • {formData.fileType.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* 태그 */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white" style={ADMIN_FONT_STYLES.HEADING}>
                                        태그
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex space-x-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="태그 입력"
                                            className="bg-gray-700 border-gray-600 text-white"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addTag}
                                            variant="outline"
                                            className="border-gray-600"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-gray-300 border-gray-600 pr-1"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 hover:text-red-400"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* 사이드바 */}
                        <div className="space-y-6">
                            {/* 공개 설정 */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white" style={ADMIN_FONT_STYLES.HEADING}>
                                        공개 설정
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="isPublic" className="text-gray-300">
                                                공개 여부
                                            </Label>
                                            <p className="text-xs text-gray-400 mt-1">
                                                공개 시 모든 사용자가 다운로드 가능
                                            </p>
                                        </div>
                                        <Switch
                                            id="isPublic"
                                            checked={formData.isPublic}
                                            onCheckedChange={(checked) => updateFormData('isPublic', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 문서 정보 */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white" style={ADMIN_FONT_STYLES.HEADING}>
                                        문서 정보
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">타입:</span>
                                        <span className="text-white">
                                            {documentType === 'approval' ? '승인서류' : '일반자료'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">파일 형식:</span>
                                        <span className="text-white">{formData.fileType.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">파일 크기:</span>
                                        <span className="text-white">{formData.fileSize || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">버전:</span>
                                        <span className="text-white">{formData.version}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 액션 버튼 */}
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    {loading ? (
                                        <>로딩 중...</>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            문서 저장
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    취소
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 