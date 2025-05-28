"use client";

import React, { useState, useEffect } from "react";
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
  Clock8
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
  id: number;
  name: string;
  type: string;
  size: string;
  category: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: {
    id: number;
    name: string;
    department: string;
  };
  isStarred: boolean;
  isShared: boolean;
  approvalStatus: string;
  sharedWith: {
    id: number;
    name: string;
    department: string;
  }[];
  description: string;
  path?: string; // 옵셔널로 변경
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState(initialDocuments);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'createdAt' | 'size'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [showSharedOnly, setShowSharedOnly] = useState(false);
  const [showApprovalOnly, setShowApprovalOnly] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("/문서");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

  const currentFolders = folders.filter((folder) => {
    // path가 없는 경우 필터링에서 제외
    if (!folder.path) return false;
    const parentPath = folder.path.substring(0, folder.path.lastIndexOf("/"));
    return parentPath === currentPath;
  });

  const currentDocuments = documents.filter((doc) => {
    // path가 없는 경우 필터링에서 제외
    if (!doc.path) return false;
    const parentPath = doc.path.substring(0, doc.path.lastIndexOf("/"));
    return parentPath === currentPath;
  });

  // 경로 네비게이션을 위한 함수
  const pathSegments = currentPath.split('/').filter(Boolean);

  const navigateToPath = (index: number) => {
    const newPath = '/' + pathSegments.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  return (
    <div className="max-w-full">
      {/* 상단 헤더 영역 */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">문서함</h1>
            <div className="flex flex-wrap items-center text-sm text-gray-200">
              {/* 경로 네비게이션 */}
              <div className="flex items-center mb-2 md:mb-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPath("/문서")}
                  className="hover:bg-gray-800/50 text-orange-300 hover:text-orange-200 p-1 h-auto"
                >
                  <Folder className="h-4 w-4 mr-1" />
                  <span>문서</span>
                </Button>

                {pathSegments.length > 1 && (
                  <>
                    {pathSegments.slice(1).map((segment, index) => (
                      <React.Fragment key={index}>
                        <span className="mx-1 text-gray-400">/</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigateToPath(index + 1)}
                          className="hover:bg-gray-800/50 text-orange-300 hover:text-orange-200 p-1 h-auto"
                        >
                          {segment}
                        </Button>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 문서 통계 */}
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <div className="flex items-center bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-orange-800/30 shadow-md">
              <span className="text-orange-200 text-xs mr-1">전체:</span>
              <span className="text-white font-semibold text-xs">{filteredDocuments.length}개</span>
            </div>
            <div className="flex items-center bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-orange-800/30 shadow-md">
              <span className="text-orange-200 text-xs mr-1">선택됨:</span>
              <span className="text-white font-semibold text-xs">{selectedDocuments.length}개</span>
            </div>
          </div>
        </div>
      </div>

      {/* 작업 툴바 (검색, 필터, 정렬, 보기 모드 등) */}
      <div className="bg-gray-900/80 backdrop-blur-md rounded-xl border border-orange-900/30 p-4 mb-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색 입력 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="파일명, 작성자, 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/70 border-orange-800/30 pl-9 text-white focus-visible:ring-orange-700/30"
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 문서 작업 버튼 그룹 */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-orange-900/20 border-orange-700/30 text-orange-100 hover:bg-orange-800/30 hover:text-white"
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              <span>업로드</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-orange-800/30 text-gray-300 hover:bg-orange-900/20 hover:text-white"
              onClick={() => { }}
              disabled={selectedDocuments.length === 0}
            >
              <Download className="h-4 w-4 mr-1.5" />
              <span>다운로드</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-red-900/20 border-red-500/20 text-red-300 hover:bg-red-800/30 hover:text-white"
              onClick={() => { }}
              disabled={selectedDocuments.length === 0}
            >
              <Trash className="h-4 w-4 mr-1.5" />
              <span>삭제</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-orange-800/30 text-gray-300 hover:bg-orange-900/20 hover:text-white"
              onClick={() => { }}
            >
              <FolderPlus className="h-4 w-4 mr-1.5" />
              <span>폴더 생성</span>
            </Button>
          </div>

          {/* 보기 모드 전환 버튼 */}
          <div className="flex gap-1 items-center">
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode('list')}
              className={`h-8 w-8 ${viewMode === 'list'
                ? 'bg-orange-700 text-white hover:bg-orange-600'
                : 'text-gray-400 hover:text-white hover:bg-orange-900/20'
                }`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`h-8 w-8 ${viewMode === 'grid'
                ? 'bg-orange-700 text-white hover:bg-orange-600'
                : 'text-gray-400 hover:text-white hover:bg-orange-900/20'
                }`}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 필터 및 정렬 옵션 */}
        <div className="mt-3 flex flex-wrap gap-2 items-center border-t border-orange-800/30 pt-3">
          {/* 카테고리 필터 */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-orange-800/30 text-orange-100 hover:text-white"
            >
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              <span>{selectedCategory === 'all' ? '전체 카테고리' : selectedCategory}</span>
              <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
            </Button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-black/80 backdrop-blur-md border border-orange-800/30 rounded-lg shadow-lg p-1.5 hidden group-hover:block z-10">
              <div className="py-1 text-sm">
                <button
                  className={`w-full text-left px-3 py-1.5 rounded-md ${selectedCategory === 'all' ? 'bg-orange-700 text-white' : 'text-gray-300 hover:bg-orange-900/30 hover:text-white'}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  전체 카테고리
                </button>
                {Array.from(new Set(documents.map(doc => doc.category))).map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-3 py-1.5 rounded-md ${selectedCategory === category ? 'bg-orange-700 text-white' : 'text-gray-300 hover:bg-orange-900/30 hover:text-white'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 필터 토글 버튼들 */}
          <Button
            variant="outline"
            size="sm"
            className={`${showStarredOnly
              ? 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300'
              : 'bg-black/50 border-orange-800/30 text-gray-300 hover:bg-orange-900/20'
              }`}
            onClick={() => setShowStarredOnly(!showStarredOnly)}
          >
            {showStarredOnly ? <Star className="h-3.5 w-3.5 mr-1.5" /> : <StarOff className="h-3.5 w-3.5 mr-1.5" />}
            <span>즐겨찾기</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`${showSharedOnly
              ? 'bg-green-900/30 border-green-500/30 text-green-300'
              : 'bg-black/50 border-orange-800/30 text-gray-300 hover:bg-orange-900/20'
              }`}
            onClick={() => setShowSharedOnly(!showSharedOnly)}
          >
            <Share className="h-3.5 w-3.5 mr-1.5" />
            <span>공유 문서</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`${showApprovalOnly
              ? 'bg-purple-900/30 border-purple-500/30 text-purple-300'
              : 'bg-black/50 border-orange-800/30 text-gray-300 hover:bg-orange-900/20'
              }`}
            onClick={() => setShowApprovalOnly(!showApprovalOnly)}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            <span>결재 대기</span>
          </Button>

          <div className="flex-1"></div>

          {/* 정렬 옵션 */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-orange-800/30 text-gray-300 hover:bg-orange-900/20 hover:text-white"
            >
              {sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5 mr-1.5" /> : <ArrowDown className="h-3.5 w-3.5 mr-1.5" />}
              <span>정렬: {
                sortField === 'name' ? '이름' :
                  sortField === 'createdAt' ? '날짜' : '크기'
              }</span>
              <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
            </Button>
            <div className="absolute top-full right-0 mt-1 w-48 bg-black/80 backdrop-blur-md border border-orange-800/30 rounded-lg shadow-lg p-1.5 hidden group-hover:block z-10">
              <div className="py-1 text-sm">
                <button
                  className={`w-full text-left px-3 py-1.5 rounded-md ${sortField === 'name' ? 'bg-orange-700 text-white' : 'text-gray-300 hover:bg-orange-900/30 hover:text-white'}`}
                  onClick={() => {
                    setSortField('name');
                    setSortDirection(sortField === 'name' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>이름순</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </button>
                <button
                  className={`w-full text-left px-3 py-1.5 rounded-md ${sortField === 'createdAt' ? 'bg-orange-700 text-white' : 'text-gray-300 hover:bg-orange-900/30 hover:text-white'}`}
                  onClick={() => {
                    setSortField('createdAt');
                    setSortDirection(sortField === 'createdAt' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>날짜순</span>
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </button>
                <button
                  className={`w-full text-left px-3 py-1.5 rounded-md ${sortField === 'size' ? 'bg-orange-700 text-white' : 'text-gray-300 hover:bg-orange-900/30 hover:text-white'}`}
                  onClick={() => {
                    setSortField('size');
                    setSortDirection(sortField === 'size' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>크기순</span>
                    {sortField === 'size' && (
                      sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 문서 목록 */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl border border-orange-900/30 overflow-hidden mb-6">
        {/* 폴더 영역 */}
        {currentFolders.length > 0 && (
          <div className="p-4 border-b border-orange-800/30">
            <h2 className="font-semibold text-white flex items-center mb-3">
              <Folder className="h-5 w-5 mr-2 text-orange-400" />
              <span>폴더</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {currentFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-black/50 hover:bg-orange-800/50 rounded-lg p-3 cursor-pointer border border-orange-800/30 hover:border-orange-700 transition-colors group"
                  onClick={() => setCurrentPath(folder.path)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-black/50 rounded-md flex items-center justify-center mb-2 group-hover:bg-black/70 transition-all">
                      <Folder className="h-7 w-7 text-orange-300 group-hover:text-orange-200 transition-colors" />
                    </div>
                    <span className="text-white text-sm font-medium break-all line-clamp-1 group-hover:text-orange-200 transition-colors">{folder.name}</span>
                    <span className="text-orange-300/70 text-xs mt-1">{folder.itemCount}개 항목</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 문서 영역 */}
        {viewMode === 'grid' ? (
          <div className="p-4">
            <h2 className="font-semibold text-white flex items-center mb-3">
              <FileText className="h-5 w-5 mr-2 text-orange-400" />
              <span>문서</span>
              <span className="ml-2 text-sm text-orange-300">({filteredDocuments.length})</span>
            </h2>
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-black/50 hover:bg-orange-800/50 rounded-lg p-4 border border-orange-800/30 hover:border-orange-700 transition-colors group relative"
                  >
                    <div className="flex flex-col items-center mb-3">
                      <div className="w-14 h-14 mb-3 flex items-center justify-center">
                        {getFileIcon(doc.type)}
                      </div>
                      <h3 className="text-white text-sm font-medium text-center line-clamp-2 group-hover:text-orange-200 transition-colors">
                        {doc.name}
                      </h3>
                    </div>
                    <div className="flex flex-col text-xs text-orange-400 mt-2">
                      <div className="flex justify-between items-center">
                        <span>카테고리:</span>
                        <span className="text-right text-orange-300">{doc.category}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span>크기:</span>
                        <span className="text-right text-orange-300">{doc.size}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {doc.isStarred && (
                        <span className="text-yellow-400">
                          <Star className="h-4 w-4" />
                        </span>
                      )}
                      {doc.isShared && (
                        <span className="text-green-400">
                          <Share2 className="h-4 w-4" />
                        </span>
                      )}
                      {doc.approvalStatus !== 'none' && (
                        <span className={`${doc.approvalStatus === '승인됨' ? 'text-green-400' :
                          doc.approvalStatus === '검토중' ? 'text-amber-400' :
                            'text-red-400'
                          }`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-800/30 flex justify-between">
                      <button className="text-orange-400 hover:text-orange-300 flex items-center p-1">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">보기</span>
                      </button>
                      <button className="text-orange-400 hover:text-orange-300 flex items-center p-1">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">다운로드</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center mb-4">
                  <File className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-400 mb-1">문서가 없습니다</p>
                <p className="text-gray-500 text-sm">새로운 문서를 업로드하거나 다른 필터를 적용해보세요</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase bg-black/70">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={() => {
                          if (isAllSelected) {
                            setSelectedDocuments([]);
                          } else {
                            setSelectedDocuments(filteredDocuments.map(doc => doc.id));
                          }
                          setIsAllSelected(!isAllSelected);
                        }}
                        className="rounded-sm border-gray-600 bg-black/70 text-orange-500 focus:ring-offset-0 focus:ring-orange-500/30"
                      />
                      <span className="ml-3">파일명</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium">카테고리</th>
                  <th className="px-4 py-3 font-medium">작성일</th>
                  <th className="px-4 py-3 font-medium">작성자</th>
                  <th className="px-4 py-3 font-medium">크기</th>
                  <th className="px-4 py-3 font-medium text-right">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-800/30">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => {
                    const isSelected = selectedDocuments.includes(doc.id);
                    return (
                      <tr
                        key={doc.id}
                        className={`${isSelected ? 'bg-orange-800/50' : 'bg-transparent'
                          } hover:bg-orange-700 transition-colors group`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                                } else {
                                  setSelectedDocuments([...selectedDocuments, doc.id]);
                                }
                              }}
                              className="rounded-sm border-gray-600 bg-black/70 text-orange-500 focus:ring-offset-0 focus:ring-orange-500/30"
                            />
                            <div className="flex items-center ml-3">
                              <span className="text-orange-400 group-hover:text-orange-300 transition-colors">
                                {getFileIcon(doc.type)}
                              </span>
                              <span className="ml-2 text-white group-hover:text-orange-200 transition-colors">
                                {doc.name}
                              </span>
                              {doc.isStarred && (
                                <Star className="h-3.5 w-3.5 text-yellow-400 ml-2 flex-shrink-0" />
                              )}
                              {doc.isShared && (
                                <Share2 className="h-3.5 w-3.5 text-green-400 ml-2 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-black/70 text-orange-300 border border-orange-600/20">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            {doc.createdAt}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center mr-2">
                              <User className="h-3 w-3 text-gray-400" />
                            </div>
                            <span className="text-gray-300 text-sm">{doc.createdBy.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{doc.size}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-orange-400 hover:text-orange-300 hover:bg-orange-800/50 h-8 px-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-orange-400 hover:text-orange-300 hover:bg-orange-800/50 h-8 px-2"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white hover:bg-orange-800/50 h-8 px-2"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 bg-black/30"
                    >
                      <div className="flex flex-col items-center">
                        <File className="h-10 w-10 mb-2 text-gray-600" />
                        <p className="text-gray-400 mb-1">문서가 없습니다</p>
                        <p className="text-gray-500 text-xs">새로운 문서를 업로드하거나 다른 필터를 적용해보세요</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {filteredDocuments.length > 0 && (
          <div className="p-4 flex items-center justify-between border-t border-orange-800/30">
            <div className="text-sm text-gray-400">
              총 <span className="text-white font-medium">{filteredDocuments.length}</span>개 문서
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-orange-800/30 text-gray-400 hover:bg-orange-900/20"
                disabled
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-orange-900/30 border-orange-800/30 text-white"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/50 border-orange-800/30 text-gray-400 hover:bg-orange-900/20"
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 문서 미리보기 다이얼로그 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {previewDocument && getFileIcon(previewDocument.type)}
              <span className="ml-2">{previewDocument?.name}</span>
            </DialogTitle>
            <DialogDescription>문서 상세 정보 및 미리보기</DialogDescription>
          </DialogHeader>

          {previewDocument && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">문서 정보</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-500 mr-1">카테고리:</span>{" "}
                      {previewDocument.category}
                    </li>
                    <li className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-500 mr-1">작성자:</span>{" "}
                      {previewDocument.createdBy.name}
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-500 mr-1">작성일:</span>{" "}
                      {previewDocument.createdAt}
                    </li>
                    <li className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-500 mr-1">
                        파일 크기:
                      </span>{" "}
                      {previewDocument.size}
                    </li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="text-center">
                    <div className="mb-4">
                      {previewDocument.type === "pdf" ? (
                        <FileText className="h-16 w-16 mx-auto text-red-500" />
                      ) : previewDocument.type === "image" ? (
                        <FileImage className="h-16 w-16 mx-auto text-blue-500" />
                      ) : previewDocument.type === "archive" ? (
                        <FileArchive className="h-16 w-16 mx-auto text-amber-500" />
                      ) : (
                        <FileText className="h-16 w-16 mx-auto text-gray-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      이 파일은 미리보기를 지원하지 않습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
            >
              닫기
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
