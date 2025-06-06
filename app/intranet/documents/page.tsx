"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Upload,
  Download,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  Film,
  ChevronDown,
  FolderPlus,
  FilePlus,
  Trash,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  UserCircle,
  Share2,
  Eye,
  ArrowUpDown,
  FileArchive,
  Tag,
  User,
  Filter,
  Folder,
  SlidersHorizontal,
  Grid3X3,
  List,
  Clock,
  ArrowDownAZ,
  ArrowDown,
  X,
  Star,
  StarOff,
  Users,
  Grid,
  ArrowUp,
  Share,
  XCircle,
  RotateCcw,
  ArrowUpCircle,
  Clock8,
  FileIcon,
  Trash2,
  FolderOpen
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import { GlobalNav } from "@/components/ui/GlobalNav";
import Link from 'next/link';
import IntranetLayout from "@/components/intranet/layout";
import { formatFileSize, formatDate } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 파일 확장자별 아이콘 매핑
const getFileIcon = (fileType: string) => {
  const iconProps = { className: "h-6 w-6" };

  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText {...iconProps} className="text-red-500" />;
    case "doc":
    case "docx":
      return <FileText {...iconProps} className="text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet {...iconProps} className="text-green-500" />;
    case "ppt":
    case "pptx":
      return <FileText {...iconProps} className="text-orange-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileImage {...iconProps} className="text-purple-500" />;
    case "mp4":
    case "avi":
    case "mov":
      return <Film {...iconProps} className="text-indigo-500" />;
    case "zip":
      return <FileArchive {...iconProps} className="text-amber-500" />;
    default:
      return <File {...iconProps} className="text-gray-500" />;
  }
};

// 임시 문서 데이터
const initialDocuments = [
  {
    id: 1,
    name: '2024년 사업계획서.pdf',
    type: 'pdf',
    size: '2.4MB',
    category: '경영',
    createdAt: '2024-04-15T14:30:00',
    modifiedAt: '2024-04-16T09:15:00',
    createdBy: {
      id: 1,
      name: '김철수',
      department: '경영지원'
    },
    isStarred: true,
    isShared: true,
    approvalStatus: 'approved', // approved, pending, rejected, none
    sharedWith: [
      { id: 2, name: '이영희', department: '영업' },
      { id: 3, name: '박지성', department: '영업' },
      { id: 8, name: '한지민', department: '개발' }
    ],
    description: '2024년도 사업 전략 및 목표에 대한 계획서',
    path: "/문서/경영/2024년 사업계획서.pdf"
  },
  {
    id: 2,
    name: '제품 매뉴얼_v1.2.docx',
    type: 'docx',
    size: '3.8MB',
    category: '제품',
    createdAt: '2024-04-10T11:20:00',
    modifiedAt: '2024-04-10T11:20:00',
    createdBy: {
      id: 5,
      name: '정수민',
      department: '마케팅'
    },
    isStarred: false,
    isShared: true,
    approvalStatus: 'none',
    sharedWith: [
      { id: 9, name: '오승환', department: '개발' },
      { id: 10, name: '윤서연', department: '개발' }
    ],
    description: '신제품 사용자 매뉴얼',
    path: "/문서/제품/제품 매뉴얼_v1.2.docx"
  },
  {
    id: 3,
    name: '마케팅 캠페인 결과 보고서.pptx',
    type: 'ppt',
    size: '5.2MB',
    category: '마케팅',
    createdAt: '2024-04-08T16:45:00',
    modifiedAt: '2024-04-09T10:30:00',
    createdBy: {
      id: 5,
      name: '정수민',
      department: '마케팅'
    },
    isStarred: true,
    isShared: false,
    approvalStatus: 'none',
    sharedWith: [],
    description: '2024년 1분기 마케팅 캠페인 결과 분석',
    path: "/문서/마케팅/마케팅 캠페인 결과 보고서.pptx"
  },
  {
    id: 4,
    name: '인사평가 양식.xlsx',
    type: 'xlsx',
    size: '1.2MB',
    category: '인사',
    createdAt: '2024-04-05T09:15:00',
    modifiedAt: '2024-04-05T09:15:00',
    createdBy: {
      id: 11,
      name: '장미영',
      department: '인사'
    },
    isStarred: false,
    isShared: true,
    approvalStatus: 'pending',
    sharedWith: [
      { id: 1, name: '김철수', department: '경영지원' },
      { id: 2, name: '이영희', department: '영업' },
      { id: 8, name: '한지민', department: '개발' },
      { id: 13, name: '권지용', department: '생산' }
    ],
    description: '2024년 상반기 인사평가 양식',
    path: "/문서/인사/인사평가 양식.xlsx"
  },
  {
    id: 5,
    name: '프로젝트 일정표.xlsx',
    type: 'xlsx',
    size: '0.8MB',
    category: '프로젝트',
    createdAt: '2024-04-02T13:40:00',
    modifiedAt: '2024-04-14T15:20:00',
    createdBy: {
      id: 8,
      name: '한지민',
      department: '개발'
    },
    isStarred: false,
    isShared: true,
    approvalStatus: 'none',
    sharedWith: [
      { id: 9, name: '오승환', department: '개발' },
      { id: 10, name: '윤서연', department: '개발' }
    ],
    description: '신제품 개발 프로젝트 일정표',
    path: "/문서/프로젝트/프로젝트 일정표.xlsx"
  },
  {
    id: 6,
    name: '거래처 연락처.xlsx',
    type: 'xlsx',
    size: '1.5MB',
    category: '영업',
    createdAt: '2024-03-28T10:10:00',
    modifiedAt: '2024-04-12T11:45:00',
    createdBy: {
      id: 3,
      name: '박지성',
      department: '영업'
    },
    isStarred: true,
    isShared: true,
    approvalStatus: 'none',
    sharedWith: [
      { id: 2, name: '이영희', department: '영업' }
    ],
    description: '주요 거래처 연락처 및 담당자 정보',
    path: "/문서/영업/거래처 연락처.xlsx"
  },
  {
    id: 7,
    name: '제품 디자인 시안.psd',
    type: 'psd',
    size: '8.6MB',
    category: '디자인',
    createdAt: '2024-03-25T14:30:00',
    modifiedAt: '2024-03-25T14:30:00',
    createdBy: {
      id: 10,
      name: '윤서연',
      department: '개발'
    },
    isStarred: false,
    isShared: true,
    approvalStatus: 'rejected',
    sharedWith: [
      { id: 8, name: '한지민', department: '개발' },
      { id: 5, name: '정수민', department: '마케팅' }
    ],
    description: '신제품 패키지 디자인 시안',
    path: "/문서/디자인/제품 디자인 시안.psd"
  },
  {
    id: 8,
    name: '2024년 예산안.xlsx',
    type: 'xlsx',
    size: '1.8MB',
    category: '재무',
    createdAt: '2024-03-20T11:15:00',
    modifiedAt: '2024-03-20T11:15:00',
    createdBy: {
      id: 18,
      name: '송중기',
      department: '재무'
    },
    isStarred: false,
    isShared: false,
    approvalStatus: 'approved',
    sharedWith: [],
    description: '2024년도 부서별 예산 계획',
    path: "/문서/재무/2024년 예산안.xlsx"
  }
];

// 폴더 데이터
const folders = [
  { id: 1, name: "경영", itemCount: 15, path: "/문서/경영" },
  { id: 2, name: "제품개발", itemCount: 23, path: "/문서/제품개발" },
  { id: 3, name: "마케팅", itemCount: 18, path: "/문서/마케팅" },
  { id: 4, name: "고객관리", itemCount: 12, path: "/문서/고객관리" },
  { id: 5, name: "총무", itemCount: 9, path: "/문서/총무" },
  { id: 6, name: "인사", itemCount: 7, path: "/문서/인사" },
  { id: 7, name: "프로젝트", itemCount: 21, path: "/문서/프로젝트" },
  { id: 8, name: "재고", itemCount: 14, path: "/문서/재고" },
  { id: 9, name: "영업", itemCount: 11, path: "/문서/영업" },
];

// 카테고리 목록
const categories = [
  { id: 'all', name: '전체' },
  { id: '경영', name: '경영' },
  { id: '인사', name: '인사' },
  { id: '영업', name: '영업' },
  { id: '마케팅', name: '마케팅' },
  { id: '제품', name: '제품' },
  { id: '프로젝트', name: '프로젝트' },
  { id: '디자인', name: '디자인' },
  { id: '재무', name: '재무' }
];

// 상태 목록
const statuses = ["전체", "승인됨", "검토중", "반려됨"];

// 문서 타입 정의
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
    name: string;
  description: string;
}

export default function IntranetDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'general',
    file: null as File | null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 문서 목록 가져오기
  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/intranet/documents?${params}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.documents);
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('문서 목록 로드 실패:', error);
      setError('문서 목록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, searchQuery]);

  // 파일 업로드 처리
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // 1. 파일 업로드
      const formData = new FormData();
      formData.append('file', uploadData.file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('파일 업로드 실패');
      }

      const uploadResult = await uploadResponse.json();

      // 2. 문서 정보 저장
      const response = await fetch('/api/intranet/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: uploadData.title || uploadData.file.name,
          description: uploadData.description,
          category: uploadData.category,
          fileName: uploadData.file.name,
          fileSize: uploadData.file.size,
          fileUrl: uploadResult.url,
          uploadedBy: 'current-user' // TODO: 실제 사용자 정보 사용
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('문서가 성공적으로 업로드되었습니다.');
        setShowUploadModal(false);
        setUploadData({ title: '', description: '', category: 'general', file: null });
        fetchDocuments();
      }
    } catch (error) {
      console.error('문서 업로드 실패:', error);
      setError('문서 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 문서 삭제 처리
  const handleDelete = async (documentId: string) => {
    if (!confirm('정말로 이 문서를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/intranet/documents?id=${documentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('문서가 삭제되었습니다.');
        fetchDocuments();
      }
    } catch (error) {
      console.error('문서 삭제 실패:', error);
      setError('문서 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">자료실</h1>
        <p className="text-gray-400">업무에 필요한 문서와 자료를 관리합니다.</p>
      </div>

      {/* 툴바 */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="문서 검색..."
                className="pl-10 bg-gray-700 border-gray-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
                    </div>
                  </div>
          <div className="flex gap-2">
            <select
              className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">모든 카테고리</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              문서 업로드
            </Button>
                      </div>
                    </div>
                      </div>

      {/* 알림 메시지 */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4 bg-green-900/20 border-green-600">
          <AlertDescription className="text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {/* 문서 목록 */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">등록된 문서가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    문서명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    크기
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    업로드 날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                        {getFileIcon(doc.fileName)}
                        <div className="ml-3">
                          <p className="text-white font-medium">{doc.title}</p>
                          {doc.description && (
                            <p className="text-gray-400 text-sm">{doc.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                        {categories.find(c => c.id === doc.category)?.name || doc.category}
                          </span>
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {formatFileSize(doc.fileSize)}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {formatDate(doc.createdAt)}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.fileUrl}
                          download={doc.fileName}
                          className="text-blue-400 hover:text-blue-300"
                            >
                              <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                          </div>
                        </td>
                      </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
            </div>

      {/* 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">문서 업로드</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFileUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    파일 선택
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                    className="w-full text-gray-300"
                    required
                  />
          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    문서 제목
                  </label>
                  <Input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="문서 제목을 입력하세요"
                  />
      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    설명
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                    rows={3}
                    placeholder="문서에 대한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    카테고리
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                    </div>

              <div className="flex justify-end gap-3 mt-6">
            <Button
                  type="button"
              variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
                  취소
            </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      업로드
                    </>
                  )}
            </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
