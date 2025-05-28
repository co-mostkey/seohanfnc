import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import DocumentDetailClient from './client-component';

// 정적 생성을 위한 함수
export function generateStaticParams() {
  // 정적으로 생성할 문서 ID 목록
  return [
    { id: 'doc-1' },
    { id: 'doc-2' },
    { id: 'doc-3' },
    { id: 'doc-4' },
    { id: 'doc-5' }
  ];
}

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

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 서버에서 문서 데이터 가져오기 (여기서는 정적 데이터 사용)
  const { id: documentId } = await params;
  const documentData = documentsData[documentId];

  // 클라이언트 컴포넌트에 데이터 전달
  return <DocumentDetailClient documentId={documentId} initialDocument={documentData} />;
} 