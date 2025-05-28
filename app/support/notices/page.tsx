"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, Calendar, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 10;

// 공지사항 타입 정의
interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author?: string;
  isPinned?: boolean;
  category?: string;
  viewCount?: number;
}

// useSearchParams를 사용하는 컴포넌트를 별도로 분리
function NoticesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotices, setTotalNotices] = useState(0);

  const fetchNotices = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notices?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error('공지사항을 불러오는데 실패했습니다.');
      }
      const data = await response.json();

      if (data.success) {
        setNotices(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalNotices(data.pagination?.totalCount || 0);
      } else {
        throw new Error(data.message || '공지사항을 불러오는데 실패했습니다.');
      }

      // Update URL query param
      const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
      if (page === 1) {
        current.delete('page');
      } else {
        current.set('page', String(page));
      }
      const query = current.toString();
      router.push(`/support/notices${query ? `?${query}` : ''}`);

    } catch (error) {
      console.error(error);
      setNotices([]);
      setTotalPages(1);
      setTotalNotices(0);
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    const pageFromUrl = Number(searchParams?.get('page')) || 1;
    setCurrentPage(pageFromUrl);
    fetchNotices(pageFromUrl);
  }, [searchParams, fetchNotices]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchNotices(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 md:mb-12 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          공지사항
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          서한F&C의 최신 소식과 중요한 정보를 확인하세요.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            등록된 공지사항이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {notices.map(notice => (
            <Link key={notice.id} href={`/support/notices/${notice.id}`} >
              <a className="block p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                  <div className="flex items-center">
                    {notice.isPinned && (
                      <Pin className="h-5 w-5 text-orange-500 mr-2" />
                    )}
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      {notice.title}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    {notice.isPinned && (
                      <Badge className="bg-orange-500 text-white dark:bg-orange-600 dark:text-orange-100 px-2 py-1 text-xs">
                        고정
                      </Badge>
                    )}
                    {notice.category && (
                      <Badge variant="outline" className="px-2 py-1 text-xs">
                        {notice.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                  {notice.author && (
                    <span className="ml-4">
                      작성자: {notice.author}
                    </span>
                  )}
                  {notice.viewCount !== undefined && (
                    <span className="ml-4">
                      조회수: {notice.viewCount}
                    </span>
                  )}
                </div>
                {notice.content && (
                  <p className="text-gray-700 dark:text-gray-300 mt-3 text-base leading-relaxed line-clamp-2">
                    {notice.content.length > 100 ? `${notice.content.substring(0, 100)}...` : notice.content}
                  </p>
                )}
              </a>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && notices.length > 0 && (
        <div className="mt-8 md:mt-12 flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          {[...Array(Math.min(totalPages || 1, 10)).keys()].map(num => (
            <Button
              key={num + 1}
              variant={currentPage === num + 1 ? 'default' : 'outline'}
              size="icon"
              onClick={() => handlePageChange(num + 1)}
              className="h-9 w-9"
            >
              {num + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
      {totalNotices > 0 && !loading && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          총 {totalNotices}개의 공지사항이 있습니다. (페이지 {currentPage}/{totalPages})
        </p>
      )}
    </div>
  );
}

// Loading fallback 컴포넌트
function NoticesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 md:mb-12 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          공지사항
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          서한F&C의 최신 소식과 중요한 정보를 확인하세요.
        </p>
      </header>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function NoticesPage() {
  return (
    <Suspense fallback={<NoticesLoading />}>
      <NoticesContent />
    </Suspense>
  );
} 