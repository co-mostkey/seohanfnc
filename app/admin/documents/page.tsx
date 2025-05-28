"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
    Search,
    Plus,
    Download,
    Edit,
    Trash2,
    FileText,
    Calendar,
    Tag,
    Eye,
    Filter,
    Upload,
    FolderOpen,
    Award
} from 'lucide-react';
import { ADMIN_UI, ADMIN_FONT_STYLES, ADMIN_HEADING_STYLES, ADMIN_CARD_STYLES } from '@/lib/admin-ui-constants';
import { cn } from '@/lib/utils';

// 문서 타입 정의
interface Document {
    id: string;
    title: string;
    description: string;
    category: 'approval' | 'general';
    tags: string[];
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    version: string;
    isPublic: boolean;
    downloadCount: number;
    createdAt: string;
    updatedAt: string;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export default function DocumentsAdminPage() {
    const [activeTab, setActiveTab] = useState<'approval' | 'general'>('approval');
    const [allDocuments, setAllDocuments] = useState<Document[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // 모든 태그 추출
    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        allDocuments
            .filter(doc => doc.category === activeTab)
            .forEach(doc => {
                doc.tags.forEach(tag => tags.add(tag));
            });
        return Array.from(tags).sort();
    }, [allDocuments, activeTab]);

    // 문서 데이터 로드
    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/documents?simple=true');
            const documents = await response.json();

            if (Array.isArray(documents)) {
                setAllDocuments(documents);
            } else {
                console.error('문서 로드 실패: 잘못된 응답 형식');
                toast.error('문서를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('문서 로드 중 오류:', error);
            toast.error('문서 로드 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 문서 필터링
    useEffect(() => {
        let filtered = allDocuments.filter(doc => doc.category === activeTab);

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(doc =>
                doc.title.toLowerCase().includes(searchLower) ||
                doc.description.toLowerCase().includes(searchLower) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        if (selectedTag && selectedTag !== 'all') {
            filtered = filtered.filter(doc => doc.tags.includes(selectedTag));
        }

        setFilteredDocuments(filtered);
        setCurrentPage(1);
    }, [allDocuments, activeTab, searchTerm, selectedTag]);

    // 초기 로드
    useEffect(() => {
        loadDocuments();
    }, []);

    // 문서 삭제
    const handleDelete = async (documentId: string) => {
        if (!confirm('정말로 이 문서를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                toast.success('문서가 성공적으로 삭제되었습니다.');
                loadDocuments();
            } else {
                toast.error('문서 삭제에 실패했습니다: ' + result.error);
            }
        } catch (error) {
            console.error('문서 삭제 중 오류:', error);
            toast.error('문서 삭제 중 오류가 발생했습니다.');
        }
    };

    // 파일 다운로드
    const handleDownload = async (documentId: string, fileName: string) => {
        try {
            const response = await fetch(`/api/documents/${documentId}/download`);

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`다운로드 실패: ${errorData.error || '알 수 없는 오류'}`);
                return;
            }

            // 파일 다운로드 처리
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement('a');
            link.href = url;
            link.download = fileName;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('파일 다운로드가 시작되었습니다.');

            // 문서 목록 새로고침 (다운로드 카운트 업데이트)
            loadDocuments();
        } catch (error) {
            console.error('파일 다운로드 중 오류:', error);
            toast.error('파일 다운로드 중 오류가 발생했습니다.');
        }
    };

    // 공개/비공개 토글
    const togglePublic = async (documentId: string, isPublic: boolean) => {
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPublic: !isPublic }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success(`문서가 ${!isPublic ? '공개' : '비공개'}로 변경되었습니다.`);
                loadDocuments();
            } else {
                toast.error('문서 상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('문서 상태 변경 중 오류:', error);
            toast.error('문서 상태 변경 중 오류가 발생했습니다.');
        }
    };

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

    // 파일 타입에 따른 아이콘 반환
    const getFileIcon = (fileType: string) => {
        switch (fileType.toLowerCase()) {
            case 'pdf':
                return <FileText className="h-6 w-6 text-red-500" />;
            default:
                return <FileText className="h-6 w-6 text-gray-500" />;
        }
    };

    // 문서 카드 컴포넌트
    const DocumentCard = ({ document }: { document: Document }) => (
        <Card className={cn(ADMIN_CARD_STYLES.DEFAULT, "hover:border-orange-500/50 transition-all duration-200")}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        {getFileIcon(document.fileType)}
                        <div className="flex-1 min-w-0">
                            <CardTitle className={cn(ADMIN_HEADING_STYLES.CARD_TITLE, "text-lg line-clamp-2")}>
                                {document.title}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1 line-clamp-2">
                                {document.description}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <Badge
                            variant={document.isPublic ? "default" : "secondary"}
                            className="text-xs cursor-pointer"
                            onClick={() => togglePublic(document.id, document.isPublic)}
                        >
                            {document.isPublic ? '공개' : '비공개'}
                        </Badge>
                        {document.version && (
                            <Badge variant="outline" className="text-xs">
                                v{document.version}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* 문서 정보 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(document.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Download className="h-4 w-4 mr-2" />
                            <span>{document.downloadCount}회</span>
                        </div>
                        <div className="flex items-center text-gray-400 col-span-2">
                            <span className="text-xs">{formatFileSize(document.fileSize)}</span>
                        </div>
                    </div>

                    {/* 태그 */}
                    {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {document.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-600">
                                    {tag}
                                </Badge>
                            ))}
                            {document.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{document.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-300 border-gray-600 hover:bg-gray-700"
                                onClick={() => handleDownload(document.id, document.fileName)}
                            >
                                <Download className="h-4 w-4 mr-1" />
                                다운로드
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-400 border-blue-600 hover:bg-blue-900/30"
                                onClick={() => {
                                    window.location.href = `/admin/documents/${document.id}/edit`;
                                }}
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                편집
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(document.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-900 min-h-screen text-gray-100">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <h1 className={cn(ADMIN_HEADING_STYLES.PAGE_TITLE, ADMIN_UI.TEXT_PRIMARY)}>
                    자료실 관리
                </h1>
                <Button
                    className={ADMIN_UI.BUTTON_PRIMARY}
                    onClick={() => window.location.href = '/admin/documents/new'}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    새 문서 추가
                </Button>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">승인서류</p>
                                <p className="text-2xl font-bold text-white">
                                    {allDocuments.filter(doc => doc.category === 'approval').length}
                                </p>
                            </div>
                            <Award className="h-8 w-8 text-primary-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">일반자료</p>
                                <p className="text-2xl font-bold text-white">
                                    {allDocuments.filter(doc => doc.category === 'general').length}
                                </p>
                            </div>
                            <FolderOpen className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">총 다운로드</p>
                                <p className="text-2xl font-bold text-white">
                                    {allDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0).toLocaleString()}
                                </p>
                            </div>
                            <Download className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">공개 문서</p>
                                <p className="text-2xl font-bold text-white">
                                    {allDocuments.filter(doc => doc.isPublic).length}
                                </p>
                            </div>
                            <Eye className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 탭과 필터 */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'approval' | 'general')}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <TabsList className="bg-gray-800 w-fit">
                        <TabsTrigger value="approval" className="data-[state=active]:bg-primary-600">
                            <Award className="mr-2 h-4 w-4" />
                            승인서류 / 카탈로그
                        </TabsTrigger>
                        <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">
                            <FolderOpen className="mr-2 h-4 w-4" />
                            일반 자료실
                        </TabsTrigger>
                    </TabsList>

                    {/* 검색 및 필터 */}
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="문서 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64 bg-gray-800 border-gray-700"
                            />
                        </div>
                        <Select value={selectedTag} onValueChange={setSelectedTag}>
                            <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                                <SelectValue placeholder="태그 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 태그</SelectItem>
                                {allTags.map(tag => (
                                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TabsContent value="approval">
                    {currentDocuments.length === 0 ? (
                        <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                            <CardContent className="p-12 text-center">
                                <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    승인서류가 없습니다
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    새로운 승인서류를 추가해보세요.
                                </p>
                                <Button
                                    className={ADMIN_UI.BUTTON_PRIMARY}
                                    onClick={() => window.location.href = '/admin/documents/new'}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    첫 승인서류 추가
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {currentDocuments.map((document) => (
                                <DocumentCard key={document.id} document={document} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="general">
                    {currentDocuments.length === 0 ? (
                        <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                            <CardContent className="p-12 text-center">
                                <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    일반 자료가 없습니다
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    새로운 일반 자료를 추가해보세요.
                                </p>
                                <Button
                                    className={ADMIN_UI.BUTTON_PRIMARY}
                                    onClick={() => window.location.href = '/admin/documents/new'}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    첫 일반자료 추가
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {currentDocuments.map((document) => (
                                <DocumentCard key={document.id} document={document} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-800 border-gray-700"
                        >
                            이전
                        </Button>
                        <span className="text-sm text-gray-400">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-800 border-gray-700"
                        >
                            다음
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 