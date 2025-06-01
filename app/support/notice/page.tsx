"use client";

import React, { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiChevronLeft, FiChevronRight, FiCalendar, FiEye, FiTag } from 'react-icons/fi';
import HeroOverlay from '@/components/hero/HeroOverlay';
import { Skeleton } from '@/components/ui/skeleton';

// 공지사항 타입 정의
interface Notice {
  id: string | number;
  title: string;
  category: string;
  date: string;
  views?: number;
  important?: boolean;
  content?: string;
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

  // 마크다운 제거 함수
  const stripMarkdown = (text: string): string => {
    if (!text) return '';

    return text
      // 굵게
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // 기울임
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // 밑줄
      .replace(/<u>([^<]+)<\/u>/g, '$1')
      // 링크
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 이미지
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      // 헤더
      .replace(/#{1,6}\s+(.+)/g, '$1')
      // 테이블 구분선
      .replace(/\|/g, ' ')
      .replace(/-{3,}/g, '')
      // 여러 공백을 하나로
      .replace(/\s+/g, ' ')
      .trim();
  };

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
            important: notice.isPinned,
            content: notice.content
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
              content: '추석 연휴 기간 동안 고객센터 운영을 휴무합니다. 양해 부탁드립니다.'
            },
            {
              id: 2,
              title: '서한에프앤씨 새로운 제품 라인업 출시 안내',
              category: '제품',
              date: '2023-08-15',
              views: 312,
              important: true,
              content: '새로운 제품 라인업이 출시되었습니다. 더 많은 정보를 확인하세요.'
            },
            {
              id: 3,
              title: '환경경영 시스템 ISO 14001 인증 획득',
              category: '회사소식',
              date: '2023-07-21',
              views: 178,
              important: false,
              content: '환경경영 시스템 ISO 14001 인증을 획득했습니다. 더 나은 환경을 위한 노력을 이어가겠습니다.'
            },
            {
              id: 4,
              title: '홈페이지 리뉴얼 오픈 안내',
              category: '홈페이지',
              date: '2023-06-05',
              views: 201,
              important: false,
              content: '홈페이지가 새롭게 리뉴얼되었습니다. 더 나은 서비스를 제공하겠습니다.'
            },
            {
              id: 5,
              title: '2023년 하계 휴가 기간 안내',
              category: '고객센터',
              date: '2023-05-30',
              views: 156,
              important: false,
              content: '2023년 하계 휴가 기간을 안내합니다. 휴가 기간 중에는 고객센터 운영을 중단합니다.'
            },
            {
              id: 6,
              title: '서한에프앤씨 제품 적용 성공 사례 안내',
              category: '제품',
              date: '2023-05-15',
              views: 188,
              important: false,
              content: '제품 적용 성공 사례를 안내합니다. 더 나은 제품을 제공하겠습니다.'
            },
            {
              id: 7,
              title: '품질관리 시스템 개선 완료 공지',
              category: '회사소식',
              date: '2023-04-28',
              views: 134,
              important: false,
              content: '품질관리 시스템을 개선하여 더 나은 품질을 제공하겠습니다.'
            },
            {
              id: 8,
              title: '신규 협력업체 모집 공고',
              category: '채용/협력',
              date: '2023-04-12',
              views: 220,
              important: false,
              content: '신규 협력업체를 모집하는 공고입니다. 더 나은 협력을 찾겠습니다.'
            },
            {
              id: 9,
              title: '상반기 신제품 설명회 개최 안내',
              category: '제품',
              date: '2023-03-25',
              views: 195,
              important: false,
              content: '상반기 신제품 설명회를 개최하는 안내입니다. 더 나은 제품을 소개하겠습니다.'
            },
            {
              id: 10,
              title: '서한에프앤씨 창립 20주년 기념 이벤트',
              category: '회사소식',
              date: '2023-03-10',
              views: 276,
              important: true,
              content: '서한에프앤씨 창립 20주년을 기념하는 이벤트를 진행합니다. 더 나은 서비스를 제공하겠습니다.'
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

  // 카테고리별 색상 맵핑
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '일반': 'bg-gray-500',
      '중요': 'bg-red-500',
      '제품': 'bg-blue-500',
      '회사소식': 'bg-green-500',
      '채용/협력': 'bg-purple-500',
      '고객센터': 'bg-orange-500',
      '홈페이지': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="relative min-h-screen">
      {/* 배경 이미지 */}
      <Image
        src={getImagePath('/hero/hero_01.png')}
        alt="Background"
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      <HeroOverlay />

      {/* 컨텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">공지사항</h1>
              <p className="text-gray-200">서한에프앤씨의 중요 소식과 업데이트를 확인하세요.</p>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <form onSubmit={handleSearch} className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full p-4 pl-12 text-sm text-gray-900 dark:text-gray-100 border border-gray-600/50 rounded-lg bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
          </div>

          {/* 공지사항 목록 */}
          <div className="space-y-4">
            {loading ? (
              // 로딩 상태
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                    <Skeleton className="h-6 w-3/4 bg-gray-700/50 mb-3" />
                    <Skeleton className="h-4 w-full bg-gray-700/50 mb-2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20 bg-gray-700/50" />
                      <Skeleton className="h-4 w-24 bg-gray-700/50" />
                      <Skeleton className="h-4 w-16 bg-gray-700/50" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notices.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-12 text-center border border-gray-700/50">
                <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
              </div>
            ) : (
              notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/support/notice/${notice.id}`}
                  className="block group"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 hover:bg-gray-800/70 hover:border-orange-500/50 transition-all duration-300">
                    {/* 중요 공지사항 표시 */}
                    {notice.important && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                          중요 공지
                        </span>
                      </div>
                    )}

                    {/* 제목 */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {notice.title}
                    </h3>

                    {/* 내용 미리보기 */}
                    {notice.content && (
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {stripMarkdown(notice.content).substring(0, 150)}...
                      </p>
                    )}

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FiTag className="w-4 h-4" />
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4" />
                        <span>{notice.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiEye className="w-4 h-4" />
                        <span>{notice.views || 0}회</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {notices.length > 0 && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <nav className="flex items-center gap-2" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:bg-gray-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    const isCurrentPage = pageNumber === pagination.page;
                    const isNearCurrentPage = Math.abs(pageNumber - pagination.page) <= 2;
                    const isFirstOrLast = pageNumber === 1 || pageNumber === pagination.totalPages;

                    if (!isNearCurrentPage && !isFirstOrLast) {
                      if (pageNumber === 2 || pageNumber === pagination.totalPages - 1) {
                        return (
                          <span key={pageNumber} className="px-3 py-2 text-gray-500">...</span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${isCurrentPage
                          ? "bg-orange-500 text-white"
                          : "border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:bg-gray-700/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <footer className="w-full py-8 text-center mt-16">
          <span className="text-sm text-gray-400">© {new Date().getFullYear()} SEOHAN FNC All Rights Reserved.</span>
        </footer>
      </div>
    </div>
  );
} 