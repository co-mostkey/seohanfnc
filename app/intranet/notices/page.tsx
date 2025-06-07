'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  Pin,
  ArrowUp,
  ArrowDown,
  User,
  Calendar,
  Tag,
  Eye,
  Clock,
  Menu,
  Megaphone,
  CircleAlert,
  MessageSquare,
  Download
} from 'lucide-react';

// [TRISID] 인트라넷 공지사항 인터페이스
interface IntranetNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    name: string;
    position: string;
    department: string;
    avatar?: string;
  };
  isPinned: boolean;
  isImportant: boolean;
  viewCount: number;
  commentCount: number;
  attachments: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    url?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// 임시 공지사항 데이터 (API 연동 전)
const initialNotices = [
  {
    id: 1,
    title: '인사발령 공지 - 2024년 4월',
    content: '2024년 4월 1일부로 적용되는 인사발령 내역을 공지합니다. 첨부된 파일을 참고하여 주시기 바랍니다.',
    category: '인사',
    createdAt: '2024-03-28T14:30:00',
    author: {
      id: 11,
      name: '장미영',
      position: '부장',
      department: '인사',
      avatar: '/images/avatars/avatar-11.jpg'
    },
    isPinned: true,
    isImportant: true,
    viewCount: 254,
    commentCount: 12,
    attachments: [
      {
        id: 1,
        name: '2024년_4월_인사발령_공지.pdf',
        size: '1.2MB',
        type: 'pdf'
      }
    ]
  },
  {
    id: 2,
    title: '2024년 2분기 경영실적 보고회 안내',
    content: '2024년 2분기 경영실적 보고회가 7월 15일에 개최됩니다. 부서별 발표 자료는 7월 10일까지 경영지원팀으로 제출해 주시기 바랍니다.',
    category: '경영',
    createdAt: '2024-04-01T10:15:00',
    author: {
      id: 18,
      name: '송중기',
      position: '부장',
      department: '재무',
      avatar: '/images/avatars/avatar-18.jpg'
    },
    isPinned: true,
    isImportant: true,
    viewCount: 198,
    commentCount: 5,
    attachments: []
  },
  {
    id: 3,
    title: '전사 품질관리 교육 실시 안내',
    content: '전 직원 대상 품질관리 교육을 4월 20일부터 실시합니다. 부서별 교육 일정은 첨부 파일을 참고하시고, 담당자는 교육 참석 여부를 확인해 주시기 바랍니다.',
    category: '교육',
    createdAt: '2024-04-05T09:30:00',
    author: {
      id: 13,
      name: '권지용',
      position: '부장',
      department: '생산',
      avatar: '/images/avatars/avatar-13.jpg'
    },
    isPinned: false,
    isImportant: true,
    viewCount: 176,
    commentCount: 8,
    attachments: [
      {
        id: 2,
        name: '품질관리_교육일정_및_내용.xlsx',
        size: '0.8MB',
        type: 'xlsx'
      },
      {
        id: 3,
        name: '품질관리_교육자료.pptx',
        size: '2.5MB',
        type: 'ppt'
      }
    ]
  },
  {
    id: 4,
    title: '사내 동호회 활동 지원 안내',
    content: '사내 동호회 활동 지원 계획을 안내드립니다. 각 동호회는 지원 신청서를 작성하여 총무팀으로 제출해 주시기 바랍니다.',
    category: '복지',
    createdAt: '2024-04-08T13:45:00',
    author: {
      id: 5,
      name: '정수민',
      position: '과장',
      department: '마케팅',
      avatar: '/images/avatars/avatar-5.jpg'
    },
    isPinned: false,
    isImportant: false,
    viewCount: 143,
    commentCount: 10,
    attachments: [
      {
        id: 4,
        name: '동호회_지원_신청서.docx',
        size: '0.5MB',
        type: 'docx'
      }
    ]
  },
  {
    id: 5,
    title: '2024년 하계 휴가 사용 안내',
    content: '2024년 하계 휴가 사용에 관한 안내입니다. 부서별 업무 연속성을 위해 휴가 일정을 조율하여 사용해 주시기 바랍니다.',
    category: '인사',
    createdAt: '2024-04-10T11:20:00',
    author: {
      id: 11,
      name: '장미영',
      position: '부장',
      department: '인사',
      avatar: '/images/avatars/avatar-11.jpg'
    },
    isPinned: false,
    isImportant: false,
    viewCount: 132,
    commentCount: 3,
    attachments: []
  },
  {
    id: 6,
    title: '신제품 출시 기념 사내 이벤트 안내',
    content: '신제품 출시를 기념하여 사내 이벤트를 진행합니다. 많은 참여 바랍니다.',
    category: '마케팅',
    createdAt: '2024-04-12T15:30:00',
    author: {
      id: 5,
      name: '정수민',
      position: '과장',
      department: '마케팅',
      avatar: '/images/avatars/avatar-5.jpg'
    },
    isPinned: false,
    isImportant: false,
    viewCount: 98,
    commentCount: 7,
    attachments: [
      {
        id: 5,
        name: '신제품_출시_이벤트_안내.pdf',
        size: '1.1MB',
        type: 'pdf'
      }
    ]
  },
  {
    id: 7,
    title: '정보보안 교육 일정 안내',
    content: '전 직원 대상 정보보안 교육을 실시합니다. 교육 참석은 필수이며, 부서별 일정을 확인하여 참석해 주시기 바랍니다.',
    category: '교육',
    createdAt: '2024-04-15T09:00:00',
    author: {
      id: 9,
      name: '오승환',
      position: '차장',
      department: '개발',
      avatar: '/images/avatars/avatar-9.jpg'
    },
    isPinned: false,
    isImportant: true,
    viewCount: 76,
    commentCount: 2,
    attachments: []
  },
  {
    id: 8,
    title: '제4차 산업혁명 관련 특강 안내',
    content: '제4차 산업혁명 관련 특강을 개최합니다. 관심 있는 직원들의 많은 참여 바랍니다.',
    category: '교육',
    createdAt: '2024-04-16T14:15:00',
    author: {
      id: 8,
      name: '한지민',
      position: '부장',
      department: '개발',
      avatar: '/images/avatars/avatar-8.jpg'
    },
    isPinned: false,
    isImportant: false,
    viewCount: 54,
    commentCount: 1,
    attachments: [
      {
        id: 6,
        name: '제4차_산업혁명_특강_안내.pdf',
        size: '0.9MB',
        type: 'pdf'
      }
    ]
  }
];

// 카테고리 목록
const categories = [
  { id: 'all', name: '전체' },
  { id: '회사소식', name: '회사소식' },
  { id: '인사', name: '인사' },
  { id: '교육', name: '교육' },
  { id: '사내 활동', name: '사내 활동' },
  { id: '시설', name: '시설' },
];

// 카테고리 색상 매핑
const categoryColors: Record<string, string> = {
  '회사소식': 'bg-blue-900 text-blue-200',
  '인사': 'bg-purple-900 text-purple-200',
  '교육': 'bg-green-900 text-green-200',
  '사내 활동': 'bg-yellow-900 text-yellow-200',
  '시설': 'bg-indigo-900 text-indigo-200',
  'default': 'bg-gray-700 text-gray-300',
};

// 파일 타입별 아이콘 설정
const fileTypeIcons = {
  pdf: <FileText className="text-red-500" />,
  docx: <FileText className="text-blue-500" />,
  xlsx: <FileText className="text-green-500" />,
  ppt: <FileText className="text-orange-500" />,
  jpg: <FileText className="text-purple-500" />,
  png: <FileText className="text-purple-500" />,
  default: <FileText className="text-gray-500" />
};

// 상대적 날짜 계산 함수
const getRelativeTimeString = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 30) {
    return format(date, 'yyyy년 M월 d일', { locale: ko });
  } else if (diffInDays > 0) {
    return `${diffInDays}일 전`;
  } else if (diffInHours > 0) {
    return `${diffInHours}시간 전`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`;
  } else {
    return '방금 전';
  }
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<IntranetNotice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<IntranetNotice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<'createdAt' | 'views'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [showAttachmentsOnly, setShowAttachmentsOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // [TRISID] API에서 공지사항 데이터 로드
  const loadNotices = async () => {
    try {
      setIsLoading(true);
      setError('');

      // 전체 데이터를 가져오기 위해 limit을 크게 설정
      const response = await fetch('/api/intranet/notices?limit=1000');
      const data = await response.json();

      if (data.success && data.notices && Array.isArray(data.notices)) {
        // API 데이터를 적절한 타입으로 변환
        const transformedNotices = data.notices.map((notice: any) => ({
          ...notice,
          // id를 숫자에서 문자열로 변환 (기존 코드와 호환성)
          id: typeof notice.id === 'number' ? notice.id.toString() : notice.id,
          // author 객체의 id도 처리
          author: {
            ...notice.author,
            id: typeof notice.author?.id === 'number' ? notice.author.id.toString() : notice.author?.id || ''
          }
        }));

        setNotices(transformedNotices);
        setFilteredNotices(transformedNotices);
        console.log('[TRISID] 공지사항 로드 성공:', transformedNotices.length, '건');
      } else {
        console.warn('[TRISID] 공지사항 API 응답이 올바르지 않음:', data);
        setError('공지사항을 불러오는데 실패했습니다.');
        // 백업용으로 임시 데이터 사용
        setNotices(initialNotices);
        setFilteredNotices(initialNotices);
      }
    } catch (error) {
      console.error('[TRISID] 공지사항 로드 오류:', error);
      setError('서버 연결에 실패했습니다.');
      // 백업용으로 임시 데이터 사용
      setNotices(initialNotices);
      setFilteredNotices(initialNotices);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadNotices();
  }, []);

  // [TRISID] 새로고침 핸들러 
  const handleRefresh = () => {
    loadNotices();
  };

  // [TRISID] 페이지 포커스시 자동 새로고침
  useEffect(() => {
    const handleFocus = () => {
      loadNotices();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 필터링 및 정렬 적용
  useEffect(() => {
    let result = [...notices];

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      result = result.filter(notice => notice.category === selectedCategory);
    }

    // 중요 공지만 표시
    if (showImportantOnly) {
      result = result.filter(notice => notice.isImportant);
    }

    // 첨부파일 있는 공지만 표시
    if (showAttachmentsOnly) {
      result = result.filter(notice => notice.attachments.length > 0);
    }

    // 검색어 필터링
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        notice =>
          notice.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          notice.content.toLowerCase().includes(lowerCaseSearchTerm) ||
          notice.author.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 고정된 공지사항을 항상 상단에 표시
    const pinnedNotices = result.filter(notice => notice.isPinned);
    const unpinnedNotices = result.filter(notice => !notice.isPinned);

    // 정렬 적용
    const sortNotices = (notices: typeof result) => {
      return [...notices].sort((a, b) => {
        let comparison = 0;

        if (sortField === 'createdAt') {
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortField === 'views') {
          comparison = b.viewCount - a.viewCount;
        }

        return sortDirection === 'asc' ? -comparison : comparison;
      });
    };

    setFilteredNotices([...pinnedNotices, ...sortNotices(unpinnedNotices)]);
  }, [notices, selectedCategory, sortField, sortDirection, searchTerm, showImportantOnly, showAttachmentsOnly]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 useEffect에서 처리됨
  };

  // 정렬 핸들러
  const handleSort = (field: 'createdAt' | 'views') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">공지사항</h1>
          <p className="text-gray-400">
            총 {filteredNotices.length}개의 공지사항이 있습니다
            {error && <span className="text-red-400 ml-2">({error})</span>}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-md transition-colors"
          >
            <Search className="h-4 w-4 mr-1.5" />
            {isLoading ? '새로고침 중...' : '새로고침'}
          </button>
          <Link
            href="/intranet/notices/create"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            공지사항 작성
          </Link>
        </div>
      </div>
      {/* 필터 및 검색 */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-auto flex-grow">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="제목, 내용, 작성자 검색..."
                className="block w-full bg-gray-700 border-gray-600 pl-10 pr-4 py-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowImportantOnly(!showImportantOnly)}
              className={`inline-flex items-center px-3 py-2 rounded-md ${showImportantOnly
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              <CircleAlert className="h-4 w-4 mr-1.5" />
              중요 공지
            </button>

            <button
              onClick={() => setShowAttachmentsOnly(!showAttachmentsOnly)}
              className={`inline-flex items-center px-3 py-2 rounded-md ${showAttachmentsOnly
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              첨부 파일
            </button>
          </div>
        </div>
      </div>
      {/* 공지사항 목록 */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="hidden md:flex bg-gray-750 px-6 py-3 text-gray-300 text-sm">
          <div className="w-8"></div>
          <div className="flex-1">
            <span>제목</span>
          </div>
          <div className="w-24 text-center">카테고리</div>
          <div className="w-24 text-center">작성자</div>
          <div className="w-32 text-center">
            <button
              onClick={() => handleSort('createdAt')}
              className="inline-flex items-center text-gray-300 hover:text-white"
            >
              등록일
              {sortField === 'createdAt' && (
                sortDirection === 'asc'
                  ? <ArrowUp className="h-3 w-3 ml-1 text-blue-400" />
                  : <ArrowDown className="h-3 w-3 ml-1 text-blue-400" />
              )}
            </button>
          </div>
          <div className="w-20 text-center">
            <button
              onClick={() => handleSort('views')}
              className="inline-flex items-center text-gray-300 hover:text-white"
            >
              조회수
              {sortField === 'views' && (
                sortDirection === 'asc'
                  ? <ArrowUp className="h-3 w-3 ml-1 text-blue-400" />
                  : <ArrowDown className="h-3 w-3 ml-1 text-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 정렬 옵션 */}
        <div className="md:hidden bg-gray-750 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-gray-400">정렬:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSort('createdAt')}
              className={`text-xs px-2 py-1 rounded-md flex items-center ${sortField === 'createdAt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
            >
              등록일
              {sortField === 'createdAt' && (
                sortDirection === 'asc'
                  ? <ArrowUp className="h-3 w-3 ml-1" />
                  : <ArrowDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('views')}
              className={`text-xs px-2 py-1 rounded-md flex items-center ${sortField === 'views' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
            >
              조회수
              {sortField === 'views' && (
                sortDirection === 'asc'
                  ? <ArrowUp className="h-3 w-3 ml-1" />
                  : <ArrowDown className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="divide-y divide-gray-700">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <Link
                key={notice.id}
                href={`/intranet/notices/${notice.id}`}
                className={`block hover:bg-gray-750 transition-colors ${notice.isPinned ? 'bg-gray-750/50' : ''
                  }`}
              >
                {/* 데스크톱 뷰 */}
                <div className="hidden md:flex items-center px-6 py-4">
                  <div className="w-8 flex justify-center">
                    {notice.isPinned && (
                      <Pin className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{notice.title}</span>
                      {notice.isImportant && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">
                          중요
                        </span>
                      )}
                      {notice.attachments.length > 0 && (
                        <span className="text-gray-400">
                          {fileTypeIcons[notice.attachments[0].type as keyof typeof fileTypeIcons] || fileTypeIcons.default}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-24 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColors[notice.category] || categoryColors.default
                      }`}>
                      {notice.category}
                    </span>
                  </div>
                  <div className="w-24 text-center text-gray-300 text-sm">{notice.author.name}</div>
                  <div className="w-32 text-center text-gray-400 text-sm">
                    {getRelativeTimeString(notice.createdAt)}
                  </div>
                  <div className="w-20 text-center text-gray-400 text-sm">{notice.viewCount}</div>
                </div>

                {/* 모바일 뷰 */}
                <div className="md:hidden p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start">
                      {notice.isPinned && (
                        <Pin className="h-4 w-4 text-red-400 mt-1 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${categoryColors[notice.category] || categoryColors.default
                            }`}>
                            {notice.category}
                          </span>
                          {notice.isImportant && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">
                              중요
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-medium mt-1.5">{notice.title}</h3>
                      </div>
                    </div>
                    {notice.attachments.length > 0 && (
                      <span className="text-gray-400">
                        {fileTypeIcons[notice.attachments[0].type as keyof typeof fileTypeIcons] || fileTypeIcons.default}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <User className="h-3 w-3 mr-1" />
                    <span>{notice.author.name}</span>
                    <span className="mx-1.5">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{getRelativeTimeString(notice.createdAt)}</span>
                    <span className="mx-1.5">•</span>
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{notice.viewCount}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center">
              <Megaphone className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-500">다른 검색어나 필터 옵션을 시도해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 