"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, AlertCircle } from 'lucide-react'

// 공지사항 타입 정의
interface Notice {
  id: string | number;
  title: string;
  category: string;
  date: string;
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

export default function NoticeBox({ wrapperClassName }: { wrapperClassName?: string }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 상태 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  // 공지사항 데이터 가져오기 (마운트된 후에만 실행)
  useEffect(() => {
    if (!mounted) return;

    const fetchNotices = async (retryCount = 0) => {
      const maxRetries = 3;

      try {
        // AbortController로 요청 타임아웃 설정
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8초 타임아웃

        // API에서 공지사항 가져오기 (최근 5개)
        const res = await fetch('/api/notices?limit=5', {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          console.warn('Notices API response not ok:', res.status);
          throw new Error(`HTTP ${res.status}: 공지사항을 가져오는데 실패했습니다`);
        }

        const data = await res.json();

        if (data && data.success && Array.isArray(data.data)) {
          // 공지사항 데이터 변환
          const formattedNotices: Notice[] = data.data.map((notice: any) => ({
            id: notice.id,
            title: notice.title,
            category: notice.category || '일반',
            date: new Date(notice.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\. /g, '.').replace(/\.$/, ''),
            important: notice.isPinned
          }));
          setNotices(formattedNotices);
          console.log('Notices loaded successfully');
        } else {
          // API가 구현되지 않았거나 응답이 올바르지 않을 경우 임시 데이터 사용
          console.warn('API 응답 형식이 올바르지 않아 임시 데이터를 사용합니다.');
          setNotices(getSampleNotices());
        }

        setLoading(false);
        setError(null); // 성공 시 에러 상태 클리어
      } catch (err) {
        console.warn(`공지사항을 가져오는 중 오류 발생 (attempt ${retryCount + 1}/${maxRetries + 1}):`, err);

        // 다양한 에러 타입에 따른 처리
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.warn('Notices fetch timed out');
            if (retryCount < maxRetries) {
              console.log(`Retrying notices in ${(retryCount + 1) * 2} seconds...`);
              setTimeout(() => {
                fetchNotices(retryCount + 1);
              }, (retryCount + 1) * 2000);
              return;
            }
            setError('요청 시간이 초과되었습니다.');
          } else if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
            console.warn('Network error: Development server may not be running.');

            // 네트워크 에러의 경우 재시도
            if (retryCount < maxRetries) {
              console.log(`Retrying notices in ${(retryCount + 1) * 2} seconds...`);
              setTimeout(() => {
                fetchNotices(retryCount + 1);
              }, (retryCount + 1) * 2000);
              return;
            } else {
              // 최대 재시도 횟수 도달 시 임시 데이터로 대체
              console.warn('Max retries reached. Using sample data.');
              setNotices(getSampleNotices());
              setLoading(false);
              return;
            }
          } else {
            setError('공지사항을 불러오지 못했습니다.');
          }
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }

        setLoading(false);
      }
    };

    // 초기 지연을 줄임
    setTimeout(() => {
      fetchNotices();
    }, 100); // 500ms에서 100ms로 변경
  }, [mounted]);

  // 임시 데이터 생성 함수
  const getSampleNotices = (): Notice[] => [
    {
      id: 1,
      title: '서한에프앤씨 홈페이지가 새롭게 오픈했습니다',
      category: '일반',
      date: '2023-12-15',
      important: true
    },
    {
      id: 2,
      title: '2024년 소방 설비 신제품 출시 안내',
      category: '제품',
      date: '2023-12-10',
      important: false
    },
    {
      id: 3,
      title: '연말 휴무 안내 (12/30~1/2)',
      category: '일반',
      date: '2023-12-05',
      important: false
    },
    {
      id: 4,
      title: '신규 협력업체 모집 공고',
      category: '채용/협력',
      date: '2023-11-20',
      important: false
    },
    {
      id: 5,
      title: '품질관리 시스템 개선 완료 공지',
      category: '회사소식',
      date: '2023-11-15',
      important: false
    }
  ];

  // 카테고리에 따른 배경색 설정
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case '일반':
        return 'bg-red-500/20 text-red-300';
      case '제품':
        return 'bg-blue-500/20 text-blue-300';
      case '회사소식':
        return 'bg-green-500/20 text-green-300';
      case '채용/협력':
        return 'bg-amber-500/20 text-amber-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div
      className={`${wrapperClassName ?? "bg-black/40 backdrop-blur-md rounded-xl shadow-lg p-3 md:p-4 border border-white/10 flex flex-col h-full overflow-hidden"} relative z-40`}
    >
      <div className="flex justify-between items-center mb-2 p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold text-white">최근 공지사항</h3>
        <Link
          href="/support/notice"
          className="text-xs md:text-sm text-white/70 hover:text-white hover:bg-white/10 flex items-center py-1 px-2 rounded-md relative z-10 transition-colors duration-150 ease-in-out"
        >
          더보기
          <ArrowRight className="ml-1 h-3 w-3 md:h-3.5 md:w-3.5" />
        </Link>
      </div>
      <div className="flex-1 rounded-lg p-2 relative z-5 overflow-y-auto hide-scrollbar ios-scroll-fix">
        {!mounted || loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-xs text-red-300">
            <AlertCircle className="h-4 w-4 mr-1.5" />
            {error}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-gray-300">
            공지사항이 없습니다
          </div>
        ) : (
          <div className="divide-y divide-white/20">
            {notices.map((notice, index) => (
              <Link
                key={notice.id}
                href={`/support/notice/${notice.id}`}
                className="block py-1.5 md:py-2 hover:bg-white/10 rounded-lg px-2 transition-colors touch-manipulation"
              >
                <p className="text-xs md:text-sm font-medium text-white line-clamp-2">{notice.title}</p>
                <div className="flex items-center mt-1 gap-1.5">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] md:text-xs font-medium ${getCategoryBgColor(notice.category)}`}>
                    {notice.category}
                  </span>
                  <p className="text-[10px] md:text-xs text-gray-300">{notice.date}</p>
                  {notice.important && (
                    <span className="inline-flex items-center rounded-full bg-red-500/30 px-1.5 py-0.5 text-[10px] md:text-xs font-medium text-red-300">
                      중요
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 