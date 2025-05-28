'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
    File,
    FileText,
    Download,
    Clock,
    User,
    Calendar,
    Share2,
    Lock,
    Eye,
    History,
    Star,
    Pencil,
    Trash2,
    ArrowLeft,
    FileQuestion
} from 'lucide-react';

interface DocumentDetailProps {
    initialDocument?: any;
    documentId: string;
}

// 파일 타입별 아이콘
const fileIcons: Record<string, React.ReactNode> = {
    'pdf': <FileText className="h-10 w-10 text-red-400" />,
    'docx': <FileText className="h-10 w-10 text-blue-400" />,
    'xlsx': <FileText className="h-10 w-10 text-green-400" />,
    'pptx': <FileText className="h-10 w-10 text-orange-400" />,
    'default': <File className="h-10 w-10 text-gray-400" />,
};

// 파일 확장자를 기반으로 아이콘 가져오기
const getFileIcon = (fileType: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
    };

    const IconComponent = () => {
        if (fileType === 'pdf') return <FileText className={`${sizeClasses[size]} text-red-400`} />;
        if (fileType === 'docx') return <FileText className={`${sizeClasses[size]} text-blue-400`} />;
        if (fileType === 'xlsx') return <FileText className={`${sizeClasses[size]} text-green-400`} />;
        if (fileType === 'pptx') return <FileText className={`${sizeClasses[size]} text-orange-400`} />;
        return <File className={`${sizeClasses[size]} text-gray-400`} />;
    };

    return IconComponent();
};

// 상대적인 시간 표시 함수
const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;
    return `${Math.floor(diffInDays / 365)}년 전`;
};

// 임시 문서 데이터 (실제 구현 시에는 API에서 가져옴)
const documentsData: Record<string, any> = {
    'doc-1': {
        id: 'doc-1',
        type: 'file',
        name: '2024년 상반기 사업계획.pdf',
        fileType: 'pdf',
        size: '2.5MB',
        sizeBytes: 2621440,
        updatedAt: '2024-06-23',
        createdAt: '2024-06-10',
        owner: '김대표',
        department: '경영지원팀',
        path: '/2024년 상반기 사업계획.pdf',
        description: '2024년 상반기 서한에프앤씨 사업 계획 및 목표 문서',
        viewCount: 42,
        downloadCount: 18,
        version: '1.2',
        isPublic: false,
        tags: ['사업계획', '경영지원', '2024'],
        preview: '/images/document-previews/business-plan-preview.jpg',
    },
    'doc-2': {
        id: 'doc-2',
        type: 'file',
        name: '서한에프앤씨 회사소개서.pptx',
        fileType: 'pptx',
        size: '4.8MB',
        sizeBytes: 5033164,
        updatedAt: '2024-06-20',
        createdAt: '2024-05-15',
        owner: '마케팅팀',
        department: '마케팅',
        path: '/서한에프앤씨 회사소개서.pptx',
        description: '서한에프앤씨 회사 및 제품 소개 프레젠테이션',
        viewCount: 87,
        downloadCount: 35,
        version: '2.0',
        isPublic: true,
        tags: ['회사소개', '마케팅', '프레젠테이션'],
        preview: '/images/document-previews/company-profile-preview.jpg',
    },
    'doc-3': {
        id: 'doc-3',
        type: 'file',
        name: '제품 카탈로그 v2.0.pdf',
        fileType: 'pdf',
        size: '8.1MB',
        sizeBytes: 8492031,
        updatedAt: '2024-06-18',
        createdAt: '2024-04-25',
        owner: '마케팅팀',
        department: '마케팅',
        path: '/제품 카탈로그 v2.0.pdf',
        description: '최신 제품 라인업 및 사양 정보가 포함된 카탈로그',
        viewCount: 124,
        downloadCount: 76,
        version: '2.0',
        isPublic: true,
        tags: ['제품', '카탈로그', '마케팅'],
        preview: '/images/document-previews/product-catalog-preview.jpg',
    },
    'doc-4': {
        id: 'doc-4',
        type: 'file',
        name: '인사규정.docx',
        fileType: 'docx',
        size: '1.2MB',
        sizeBytes: 1258291,
        updatedAt: '2024-06-15',
        createdAt: '2024-01-05',
        owner: '인사팀',
        department: '인사',
        path: '/인사규정.docx',
        description: '서한에프앤씨 인사 관련 규정 및 절차 안내',
        viewCount: 56,
        downloadCount: 23,
        version: '3.1',
        isPublic: false,
        tags: ['인사', '규정', '내부문서'],
        preview: '/images/document-previews/hr-policy-preview.jpg',
    },
    'doc-5': {
        id: 'doc-5',
        type: 'file',
        name: '휴가신청서 양식.xlsx',
        fileType: 'xlsx',
        size: '350KB',
        sizeBytes: 358400,
        updatedAt: '2024-06-14',
        createdAt: '2024-03-22',
        owner: '인사팀',
        department: '인사',
        path: '/휴가신청서 양식.xlsx',
        description: '직원 휴가 신청을 위한 공식 양식',
        viewCount: 98,
        downloadCount: 64,
        version: '1.0',
        isPublic: false,
        tags: ['인사', '양식', '휴가'],
        preview: '/images/document-previews/vacation-form-preview.jpg',
    },
};

export default function DocumentDetailClient({ documentId, initialDocument }: DocumentDetailProps) {
    const params = useParams();
    const router = useRouter();
    const [document, setDocument] = useState<any>(initialDocument || null);
    const [loading, setLoading] = useState(!initialDocument);
    const [error, setError] = useState<string | null>(null);
    const [isStarred, setIsStarred] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'history'>('preview');

    // 문서 데이터 가져오기 (실제로는 API 호출)
    useEffect(() => {
        if (initialDocument) {
            setDocument(initialDocument);
            setLoading(false);
            return;
        }

        try {
            // 실제 구현에서는 API 호출
            const docId = documentId || (params?.id as string);

            if (!documentsData[docId]) {
                setError('문서를 찾을 수 없습니다.');
                setLoading(false);
                return;
            }

            setDocument(documentsData[docId]);
            setLoading(false);
        } catch (err) {
            setError('문서를 불러오는 중 오류가 발생했습니다.');
            setLoading(false);
        }
    }, [documentId, params.id, initialDocument]);

    // 문서 다운로드 처리
    const handleDownload = () => {
        alert(`${document.name} 다운로드를 시작합니다...`);
        // 실제 구현에서는 다운로드 API 호출
    };

    // 문서 즐겨찾기 토글
    const handleToggleStar = () => {
        setIsStarred(!isStarred);
        // 실제 구현에서는 API 호출로 즐겨찾기 상태 업데이트
    };

    // 문서 삭제 처리
    const handleDelete = () => {
        if (confirm('정말로 이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            alert('문서가 삭제되었습니다.');
            router.push('/intranet/documents');
            // 실제 구현에서는 API 호출로 문서 삭제
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 w-48 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                <div className="flex flex-col items-center text-center">
                    <FileQuestion className="h-24 w-24 text-gray-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-white mb-3">{error}</h2>
                    <p className="text-gray-400 mb-6">요청하신 문서를 찾을 수 없거나 액세스 권한이 없습니다.</p>
                    <Link
                        href="/intranet/documents"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                    >
                        문서함으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            {/* 상단 헤더 */}
            <div className="mb-6">
                <Link
                    href="/intranet/documents"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    문서함으로 돌아가기
                </Link>

                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div className="flex items-center">
                        {getFileIcon(document.fileType, 'lg')}
                        <div className="ml-4">
                            <h1 className="text-2xl font-semibold text-white">{document.name}</h1>
                            <div className="flex items-center text-gray-400 text-sm mt-1">
                                <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    수정일: {document.updatedAt} ({getRelativeTime(document.updatedAt)})
                                </span>
                                <span className="mx-2">•</span>
                                <span>{document.size}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleToggleStar}
                            className={`p-2 rounded-full transition-colors ${isStarred ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            title={isStarred ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
                        >
                            <Star className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center transition-colors"
                        >
                            <Download className="h-4 w-4 mr-1.5" />
                            다운로드
                        </button>
                        <div className="flex">
                            <button
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-l-md text-gray-300 transition-colors"
                                title="수정"
                            >
                                <Pencil className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 bg-gray-700 hover:bg-red-700 rounded-r-md text-gray-300 hover:text-white transition-colors"
                                title="삭제"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 탭 메뉴 */}
            <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            }`}
                    >
                        미리보기
                    </button>
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            }`}
                    >
                        문서 정보
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            }`}
                    >
                        버전 기록
                    </button>
                </nav>
            </div>
            {/* 미리보기 탭 */}
            {activeTab === 'preview' && (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video relative max-h-[600px] flex items-center justify-center">
                        {document.preview ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={document.preview}
                                    alt={`${document.name} 미리보기`}
                                    className="object-contain"
                                    fill
                                />
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                {getFileIcon(document.fileType, 'lg')}
                                <p className="text-gray-400 mt-4">미리보기를 사용할 수 없습니다</p>
                                <button
                                    onClick={handleDownload}
                                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white inline-flex items-center"
                                >
                                    <Download className="h-4 w-4 mr-1.5" />
                                    다운로드하여 보기
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex justify-between items-center border-t border-gray-700">
                        <div className="flex items-center text-gray-400 text-sm">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{document.viewCount}회 조회</span>
                            <span className="mx-2">•</span>
                            <Download className="h-4 w-4 mr-1" />
                            <span>{document.downloadCount}회 다운로드</span>
                        </div>

                        <div className="flex items-center text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${document.isPublic
                                ? 'bg-green-900 text-green-300'
                                : 'bg-red-900 text-red-300'
                                }`}>
                                {document.isPublic
                                    ? <><Share2 className="h-3 w-3 mr-1" /> 공개 문서</>
                                    : <><Lock className="h-3 w-3 mr-1" /> 비공개 문서</>
                                }
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {/* 문서 정보 탭 */}
            {activeTab === 'details' && (
                <div className="bg-gray-800 rounded-lg overflow-hidden p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-400">문서 이름</dt>
                            <dd className="mt-1 text-sm text-white">{document.name}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">파일 유형</dt>
                            <dd className="mt-1 text-sm text-white flex items-center">
                                {getFileIcon(document.fileType, 'sm')}
                                <span className="ml-2">{document.fileType.toUpperCase()} 파일</span>
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">설명</dt>
                            <dd className="mt-1 text-sm text-white">{document.description || '설명 없음'}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">파일 크기</dt>
                            <dd className="mt-1 text-sm text-white">{document.size}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">생성일</dt>
                            <dd className="mt-1 text-sm text-white">{document.createdAt}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">최종 수정일</dt>
                            <dd className="mt-1 text-sm text-white">{document.updatedAt}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">소유자</dt>
                            <dd className="mt-1 text-sm text-white">{document.owner}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">부서</dt>
                            <dd className="mt-1 text-sm text-white">{document.department}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">버전</dt>
                            <dd className="mt-1 text-sm text-white">v{document.version}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-400">태그</dt>
                            <dd className="mt-1 flex flex-wrap gap-2">
                                {document.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </dd>
                        </div>
                    </dl>
                </div>
            )}
            {/* 버전 기록 탭 */}
            {activeTab === 'history' && (
                <div className="bg-gray-800 rounded-lg overflow-hidden p-6">
                    <ul className="space-y-6">
                        {/* 실제 구현에서는 API에서 버전 기록을 가져옴 */}
                        <li className="relative pb-6">
                            <div className="relative flex items-start space-x-3">
                                <div className="relative">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center ring-8 ring-gray-800">
                                        <History className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-1 rounded-full bg-gray-800 p-0.5">
                                        <span className="block h-3 w-3 rounded-full bg-green-400"></span>
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div>
                                        <div className="text-sm">
                                            <span className="font-medium text-blue-400">v{document.version}</span>
                                            <span className="ml-2 text-gray-400">현재 버전</span>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-400">
                                            {document.updatedAt} ({getRelativeTime(document.updatedAt)})
                                        </p>
                                    </div>
                                    <div className="mt-2 text-sm text-white">
                                        <p>내용 업데이트 및 오류 수정</p>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex space-x-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                                                {document.owner}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 self-center">
                                    <button className="text-blue-400 hover:text-blue-300 flex items-center">
                                        <Download className="h-4 w-4 mr-1" />
                                        <span className="text-sm">다운로드</span>
                                    </button>
                                </div>
                            </div>
                            <span className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-700" aria-hidden="true"></span>
                        </li>

                        <li className="relative pb-6">
                            <div className="relative flex items-start space-x-3">
                                <div>
                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center ring-8 ring-gray-800">
                                        <History className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div>
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-300">v1.1</span>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-400">
                                            2024-05-15 (1개월 전)
                                        </p>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-300">
                                        <p>초기 문서 수정</p>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex space-x-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                                {document.owner}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 self-center">
                                    <button className="text-blue-400 hover:text-blue-300 flex items-center">
                                        <Download className="h-4 w-4 mr-1" />
                                        <span className="text-sm">다운로드</span>
                                    </button>
                                </div>
                            </div>
                            <span className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-700" aria-hidden="true"></span>
                        </li>

                        <li className="relative">
                            <div className="relative flex items-start space-x-3">
                                <div>
                                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center ring-8 ring-gray-800">
                                        <History className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div>
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-300">v1.0</span>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-400">
                                            {document.createdAt} (초기 버전)
                                        </p>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-300">
                                        <p>문서 최초 업로드</p>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex space-x-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                                {document.owner}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 self-center">
                                    <button className="text-blue-400 hover:text-blue-300 flex items-center">
                                        <Download className="h-4 w-4 mr-1" />
                                        <span className="text-sm">다운로드</span>
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
} 