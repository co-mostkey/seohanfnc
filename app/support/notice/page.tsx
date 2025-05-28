"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Metadata 임포트 제거
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import HeroOverlay from '@/components/hero/HeroOverlay';
import { Skeleton } from '@/components/ui/skeleton';

// metadata 내보내기 제거 (Layout 파일에서 처리하도록 함)

// 공지사항 타입 정의
interface Notice {
  id: string | number;
  title: string;
  category: string;
  date: string;
  views?: number;
  important?: boolean;
}

// API 응답 타입 정의
interface NoticeResponse {
  notices: Notice[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [searchTerm, setSearchTerm] = useState('');

  // 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNotices = async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        let url = `/api/notices?page=${page}&limit=${limit}`;

        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error('공지사항을 가져오는데 실패했습니다');
        }

        const data = await res.json();

        if (data && data.success && Array.isArray(data.data)) {
          // 공지사항 데이터 변환
          const formattedNotices = data.data.map((notice: any) => ({
            id: notice.id,
            title: notice.title,
            category: notice.category || '일반',
            date: new Date(notice.createdAt).toLocaleDateString('ko-KR'),
            views: notice.viewCount || 0,
            important: notice.isPinned
          }));

          setNotices(formattedNotices);
          setPagination({
            total: data.pagination.totalCount || 0,
            page: data.pagination.page || 1,
            pageSize: data.pagination.limit || 10,
            totalPages: data.pagination.totalPages || 1
          });
        } else {
          // API가 구현되지 않았거나 응답이 올바르지 않을 경우 임시 데이터 사용
          const sampleNotices: Notice[] = [
            {
              id: 1,
              title: '2023년 추석 연휴 고객센터 휴무 안내',
              category: '고객센터',
              date: '2023-09-20',
              views: 245,
              important: true,
            },
            {
              id: 2,
              title: '서한에프앤씨 새로운 제품 라인업 출시 안내',
              category: '제품',
              date: '2023-08-15',
              views: 312,
              important: true,
            },
            {
              id: 3,
              title: '환경경영 시스템 ISO 14001 인증 획득',
              category: '회사소식',
              date: '2023-07-21',
              views: 178,
              important: false,
            },
            {
              id: 4,
              title: '홈페이지 리뉴얼 오픈 안내',
              category: '홈페이지',
              date: '2023-06-05',
              views: 201,
              important: false,
            },
            {
              id: 5,
              title: '2023년 하계 휴가 기간 안내',
              category: '고객센터',
              date: '2023-05-30',
              views: 156,
              important: false,
            },
            {
              id: 6,
              title: '서한에프앤씨 제품 적용 성공 사례 안내',
              category: '제품',
              date: '2023-05-15',
              views: 188,
              important: false,
            },
            {
              id: 7,
              title: '품질관리 시스템 개선 완료 공지',
              category: '회사소식',
              date: '2023-04-28',
              views: 134,
              important: false,
            },
            {
              id: 8,
              title: '신규 협력업체 모집 공고',
              category: '채용/협력',
              date: '2023-04-12',
              views: 220,
              important: false,
            },
            {
              id: 9,
              title: '상반기 신제품 설명회 개최 안내',
              category: '제품',
              date: '2023-03-25',
              views: 195,
              important: false,
            },
            {
              id: 10,
              title: '서한에프앤씨 창립 20주년 기념 이벤트',
              category: '회사소식',
              date: '2023-03-10',
              views: 276,
              important: true,
            },
          ];

          console.warn('API 응답 형식이 올바르지 않아 임시 데이터를 사용합니다.');
          setNotices(sampleNotices);
          setPagination({
            total: sampleNotices.length,
            page: 1,
            pageSize: 10,
            totalPages: Math.ceil(sampleNotices.length / 10)
          });
        }
      } catch (err) {
        console.error('공지사항을 가져오는 중 오류 발생:', err);
        setError('공지사항을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices(pagination.page, pagination.pageSize);
  }, [pagination.page, searchTerm]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page }));
  };

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // 검색 시 첫 페이지로 이동
  };

  return (
    <div className="relative min-h-screen">
      {/* 배경 이미지 */}
      <Image
        src="/hero/hero_01.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      <HeroOverlay />
      {/* 네비게이션 메뉴 */}
      <header className="w-full relative z-30">
        {/* GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 사용 제거 */}
      </header>
      {/* 컨텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">공지사항</h1>
            <p className="text-gray-200">서한에프앤씨의 중요 소식과 업데이트를 확인하세요.</p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full p-3 pl-10 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
          {loading ? (
            // 로딩 상태
            (<div className="p-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="py-3 space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-gray-300/20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16 bg-gray-300/20" />
                    <Skeleton className="h-4 w-24 bg-gray-300/20" />
                  </div>
                </div>
              ))}
            </div>)
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800/90">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-16">번호</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">제목</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-24 hidden md:table-cell">분류</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-28 hidden sm:table-cell">작성일</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-20 hidden md:table-cell">조회수</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {notices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        공지사항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    notices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {notice.important ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400">
                              중요
                            </span>
                          ) : (
                            notice.id
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/support/notice/${notice.id}`}
                            className="text-gray-900 dark:text-white text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {notice.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          {notice.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                          {notice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          {notice.views || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {notices.length > 0 && (
          <div className="flex items-center justify-center mt-8">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">이전</span>
                <FiChevronLeft className="h-5 w-5" />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                // 현재 페이지 기준으로 앞뒤로 2페이지씩만 표시 (1, 2, ..., current-2, current-1, current, current+1, current+2, ..., last-1, last)
                const pageNumber = i + 1;
                const isCurrentPage = pageNumber === pagination.page;
                const isFirstPage = pageNumber === 1;
                const isLastPage = pageNumber === pagination.totalPages;
                const isNearCurrentPage =
                  Math.abs(pageNumber - pagination.page) <= 2 ||
                  isFirstPage ||
                  isLastPage;

                if (!isNearCurrentPage) {
                  // 현재 페이지에서 멀리 떨어진 페이지는 "..." 표시
                  if (pageNumber === 2 || pageNumber === pagination.totalPages - 1) {
                    return (
                      <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    aria-current={isCurrentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${isCurrentPage
                      ? "z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20 dark:border-primary-500 dark:text-primary-400"
                      : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-750"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">다음</span>
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}

        {/* 푸터 */}
        <footer className="w-full py-3 text-center mt-8">
          <span className="text-sm text-white">© {new Date().getFullYear()} SEOHAN FNC All Rights Reserved.</span>
        </footer>
      </div>
    </div>
  );
} 