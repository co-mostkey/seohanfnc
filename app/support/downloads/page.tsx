"use client";

import React, { useState, useEffect } from 'react';
import { FiDownload, FiFile, FiFileText, FiCalendar, FiSearch, FiEye, FiFilter } from 'react-icons/fi';
import { GrDocumentPdf, GrDocumentText, GrDocumentExcel } from 'react-icons/gr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// 메타데이터 설정 (클라이언트 컴포넌트에서는 useEffect로 설정)
if (typeof document !== 'undefined') {
  document.title = '일반 자료실 | 고객 지원 | 서한에프앤씨';
}

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

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) {
    return <GrDocumentPdf className="h-8 w-8 text-red-500" />;
  } else if (type.includes('doc') || type.includes('word')) {
    return <GrDocumentText className="h-8 w-8 text-blue-500" />;
  } else if (type.includes('xls') || type.includes('excel') || type.includes('sheet')) {
    return <GrDocumentExcel className="h-8 w-8 text-green-500" />;
  } else {
    return <FiFile className="h-8 w-8 text-gray-500" />;
  }
};

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

export default function DownloadsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // 모든 태그 추출
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    documents.forEach(doc => {
      doc.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [documents]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents?simple=true');
        if (response.ok) {
          const data = await response.json();
          // 일반자료실(general) 카테고리이면서 공개된 문서만 필터링
          const generalDocs = data.filter((doc: Document) =>
            doc.category === 'general' && doc.isPublic
          );
          setDocuments(generalDocs);
          setFilteredDocuments(generalDocs);
        } else {
          throw new Error('문서를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('문서를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = documents;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 태그 필터링
    if (selectedTag !== 'all') {
      filtered = filtered.filter(doc => doc.tags.includes(selectedTag));
    }

    // 정렬
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'size':
        filtered.sort((a, b) => b.fileSize - a.fileSize);
        break;
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedTag, sortBy]);

  const handleDownload = async (document: Document) => {
    try {
      // 다운로드 카운트 증가
      await fetch(`/api/documents/${document.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'download' }),
      });

      // 파일 다운로드
      const link = window.document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      // 로컬 상태 업데이트
      setDocuments(prev => prev.map(doc =>
        doc.id === document.id
          ? { ...doc, downloadCount: doc.downloadCount + 1 }
          : doc
      ));

      toast.success('파일 다운로드가 시작되었습니다.');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('다운로드 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">일반 자료실</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            제품 매뉴얼, 기술 문서, 설치 가이드 등 다양한 자료를 다운로드하실 수 있습니다.
          </p>
        </div>

        {/* 통계 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">전체 자료</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
                </div>
                <FiFile className="h-8 w-8 text-primary-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 다운로드</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {documents.reduce((sum, doc) => sum + doc.downloadCount, 0).toLocaleString()}
                  </p>
                </div>
                <FiDownload className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">태그 수</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{allTags.length}</p>
                </div>
                <FiFilter className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">검색 결과</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredDocuments.length}</p>
                </div>
                <FiSearch className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
              <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="자료 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
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
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">최신순</SelectItem>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="title">제목순</SelectItem>
                    <SelectItem value="size">파일크기순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 자료 목록 */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FiFile className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                자료가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                검색 조건을 변경하거나 나중에 다시 확인해주세요.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(document.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {document.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {document.description}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* 파일 정보 */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <span>{formatFileSize(document.fileSize)}</span>
                          <span className="flex items-center">
                            <FiCalendar className="h-3 w-3 mr-1" />
                            {formatDate(document.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <FiEye className="h-3 w-3 mr-1" />
                            {document.downloadCount.toLocaleString()}
                      </span>
                        </div>
                        {document.version && (
                          <Badge variant="outline" className="text-xs">
                            v{document.version}
                          </Badge>
                        )}
                      </div>

                      {/* 다운로드 버튼 */}
                      <Button
                        onClick={() => handleDownload(document)}
                        className="w-full"
                        size="sm"
                      >
                        <FiDownload className="h-4 w-4 mr-2" />
                        다운로드
                      </Button>
          </div>
        </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 