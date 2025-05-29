"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, ChevronDown, Eye, Edit, Trash2, ArrowUp, ArrowDown, Pin, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// 공지사항 목록 인터페이스
interface Notice {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  isPinned?: boolean;
  viewCount?: number;
  author?: string;
}

// 임시 공지사항 데이터
const NOTICES_PER_PAGE = 10;

// 표기 정보
const categoryInfo: { [key: string]: { name: string; color: string } } = {
  '일반': { name: '일반', color: 'bg-gray-500' },
  '중요': { name: '중요', color: 'bg-red-500' },
  '제품': { name: '제품', color: 'bg-blue-500' },
  '회사소식': { name: '회사소식', color: 'bg-green-500' },
  '채용/협력': { name: '채용/협력', color: 'bg-purple-500' }
};

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [totalNotices, setTotalNotices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 공지사항 데이터 로드
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', NOTICES_PER_PAGE.toString());
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const response = await fetch(`/api/notices?${params.toString()}`);
        if (!response.ok) {
          throw new Error('공지사항을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        if (data.success) {
          setNotices(data.data || []);
          setTotalNotices(data.pagination?.totalCount || 0);
          setTotalPages(data.pagination?.totalPages || 1);
        } else {
          throw new Error(data.message || '공지사항을 불러오는데 실패했습니다.');
        }
      } catch (err: any) {
        console.error('공지사항 로드 실패:', err);
        setError(err.message);
        setNotices([]);
        setTotalNotices(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage, selectedCategory, searchTerm]);

  // 검색 제출
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // 표기 필터
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 개별 선택
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(notices.map(notice => notice.id));
    }
    setSelectAll(!selectAll);
  };

  // 삭제 API 호출
  const handleDeleteApiCall = async (idsToDelete: string[]) => {
    try {
      const deletePromises = idsToDelete.map(id =>
        fetch(`/api/notices/${id}`, { method: 'DELETE' })
      );

      const responses = await Promise.all(deletePromises);
      const results = await Promise.all(responses.map(res => res.json()));

      const failedDeletes = results.filter(result => !result.success);
      if (failedDeletes.length > 0) {
        throw new Error(`${failedDeletes.length}개 항목 삭제 실패`);
      }

      toast.success(`${idsToDelete.length}개 공지사항이 삭제되었습니다.`);

      // 목록 새로고침
      setSelectedItems([]);
      setSelectAll(false);

      // 현재 페이지에 데이터가 없으면 이전 페이지로
      const remainingItems = totalNotices - idsToDelete.length;
      const maxPage = Math.ceil(remainingItems / NOTICES_PER_PAGE);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      } else {
        // 페이지 새로고침을 위해 searchTerm을 트리거로 사용
        // 임시로 빈 문자열을 설정했다가 다시 원래 값으로 복원
        const currentSearch = searchTerm;
        setSearchTerm(currentSearch + ' ');
        setTimeout(() => setSearchTerm(currentSearch), 0);
      }
    } catch (error: any) {
      console.error('삭제 실패:', error);
      toast.error(error.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  // 선택된 항목 삭제
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;

    if (confirm(`선택된 ${selectedItems.length}개 공지사항을 삭제하시겠습니까?`)) {
      handleDeleteApiCall(selectedItems);
    }
  };

  // 개별 항목 삭제
  const handleDeleteItem = (id: string) => {
    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
      handleDeleteApiCall([id]);
    }
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '오늘';
    } else if (diffDays === 2) {
      return '어제';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 정렬된 공지사항
  const sortedNotices = [...notices].sort((a, b) => {
    // 고정 공지는 항상 최상단
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    let aValue: any = a[sortField as keyof Notice];
    let bValue: any = b[sortField as keyof Notice];

    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // ID에서 번호 추출하는 함수
  const getNoticeNumber = (id: string): number => {
    const match = id.match(/^notice_(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">공지사항 관리</h1>
          <p className="text-gray-400 mt-1">총 {totalNotices}개의 공지사항</p>
        </div>
        <Link href="/admin/notices/new" >
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            새 공지사항
          </button>
        </Link>
      </div>
      {/* 검색 및 필터 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="제목 또는 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </form>

          {/* 표기 필터 */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              {selectedCategory || '모든 표기'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {showFilterMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    handleCategoryFilter('');
                    setShowFilterMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 first:rounded-t-lg"
                >
                  모든 표기
                </button>
                {Object.keys(categoryInfo).map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryFilter(category);
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 last:rounded-b-lg"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 일괄 작업 */}
      {selectedItems.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedItems.length}개 항목 선택됨
            </span>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              선택 삭제
            </button>
          </div>
        </div>
      )}
      {/* 공지사항 목록 */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="bg-gray-700 px-6 py-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-4 h-4 w-4 text-orange-600 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
            />
            <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
              <div className="col-span-1">고정</div>
              <div className="col-span-4">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center hover:text-white"
                >
                  제목
                  {sortField === 'title' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              <div className="col-span-2">표기</div>
              <div className="col-span-2">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center hover:text-white"
                >
                  작성일
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
              <div className="col-span-1">조회수</div>
              <div className="col-span-2">작업</div>
            </div>
          </div>
        </div>

        {/* 테이블 내용 */}
        <div className="divide-y divide-gray-700">
          {sortedNotices.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">공지사항이 없습니다.</p>
            </div>
          ) : (
            sortedNotices.map((notice) => (
              <div key={notice.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(notice.id)}
                    onChange={() => handleSelectItem(notice.id)}
                    className="mr-4 h-4 w-4 text-orange-600 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      {notice.isPinned && (
                        <Pin className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="col-span-4">
                      <h3 className="text-white font-medium truncate">
                        {notice.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate mt-1">
                        {notice.content.substring(0, 50)}...
                      </p>
                    </div>
                    <div className="col-span-2">
                      {notice.category && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${categoryInfo[notice.category]?.color || 'bg-gray-500'
                          }`}>
                          {notice.category}
                        </span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(notice.createdAt)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {notice.viewCount || 0}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Link href={`/support/notice/${notice.id}`} >
                          <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/notices/edit/${notice.id}`} >
                          <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(notice.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            이전
          </button>

          {[...Array(Math.min(totalPages, 10))].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === pageNum
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
} 