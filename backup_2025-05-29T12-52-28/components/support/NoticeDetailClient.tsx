"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Calendar, Eye, Tag, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import HeroOverlay from '@/components/hero/HeroOverlay';
import { notFound } from 'next/navigation';
import { FiCalendar, FiEye, FiArrowLeft, FiTag } from 'react-icons/fi'; // Fi 아이콘도 필요시 가져옴
import { GlobalNav } from '@/components/ui/GlobalNav';

// 공지사항 인터페이스 (여기서도 필요)
interface Notice {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  isPinned: boolean;
  viewCount: number;
}

// 카테고리별 색상 설정 (여기서도 필요)
const categoryColors: Record<string, string> = {
  '일반': 'bg-gray-100 text-gray-800',
  '제품': 'bg-blue-100 text-blue-800',
  '이벤트': 'bg-purple-100 text-purple-800',
  '서비스': 'bg-green-100 text-green-800',
  '안전': 'bg-red-100 text-red-800',
  '채용': 'bg-amber-100 text-amber-800',
  '교육': 'bg-indigo-100 text-indigo-800',
  '인증': 'bg-teal-100 text-teal-800'
};

// 임시 공지사항 데이터 (props로 받거나, 여기서 다시 정의)
const mockNotices: Notice[] = [
  // ... page.tsx 와 동일한 mock 데이터 ...
  {
    id: '1',
    title: '서한에프앤씨 홈페이지가 새롭게 오픈했습니다',
    category: '일반',
    content: `...`,
    date: '2023-12-15',
    isPinned: true,
    viewCount: 342
  },
  // ... 나머지 데이터
];

// 임시 데이터 가져오기 함수 (클라이언트에서 실행됨)
const getNoticeData = (id: string) => {
  console.log(`Fetching notice data for ID (client): ${id}`);
  return mockNotices.find(notice => notice.id === id) || null;
};


interface NoticeDetailClientProps {
  noticeId: string;
}

export function NoticeDetailClient({ noticeId }: NoticeDetailClientProps) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [prevNotice, setPrevNotice] = useState<Notice | null>(null);
  const [nextNotice, setNextNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const noticeData = getNoticeData(noticeId);
    if (!noticeData) {
      // 클라이언트에서는 notFound() 직접 호출 대신 다른 처리 필요
      // 예: 에러 상태 설정 또는 목록 페이지로 리다이렉트
      console.error("Notice not found on client");
      // router.push('/support/notice'); // 필요 시 useRouter 사용
      return;
    }

    setNotice(noticeData);

    const index = mockNotices.findIndex(n => n.id === noticeId);
    setCurrentIndex(index);

    if (index > 0) {
      setPrevNotice(mockNotices[index - 1]);
    } else {
      setPrevNotice(null);
    }

    if (index < mockNotices.length - 1) {
      setNextNotice(mockNotices[index + 1]);
    } else {
      setNextNotice(null);
    }

  }, [noticeId]);

  if (!notice) {
    // 로딩 상태 또는 찾을 수 없음 메시지 표시
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* 로딩 스피너 또는 메시지 */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // --- 여기서부터 JSX 반환 --- 
  // 기존 NoticePage 컴포넌트의 return 문 내부 JSX를 여기에 붙여넣습니다.
  return (
    <div className="relative min-h-screen pb-16">
      {/* 배경 이미지 */}
      <Image
        src="/hero/hero_01.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      <HeroOverlay />
      {/* 네비게이션 메뉴 */}
      <header className="w-full relative z-30">
        <GlobalNav />
      </header>
      {/* 컨텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 브레드크럼 */}
        <div className="mb-6">
          <SimpleBreadcrumb
            items={[
              { href: '/', text: '홈' },
              { href: '/support', text: '고객지원' },
              { href: '/support/notice', text: '공지사항' },
              { href: `/support/notice/${notice.id}`, text: notice.title, active: true },
            ]}
            className="text-white"
          />
        </div>

        {/* 공지사항 상세 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
          {/* 제목 및 메타 정보 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            {/* 카테고리, 중요 배지 */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className={`${categoryColors[notice.category] || 'bg-gray-100 text-gray-800'} border-0`}>
                {notice.category}
              </Badge>
              {notice.isPinned && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400 border-0 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  중요
                </Badge>
              )}
            </div>
            {/* 제목 */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {notice.title}
            </h1>
            {/* 날짜, 조회수, 카테고리 */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <FiCalendar className="mr-1.5 h-4 w-4" />
                {notice.date}
              </div>
              <div className="flex items-center">
                <FiEye className="mr-1.5 h-4 w-4" />
                조회 {notice.viewCount}
              </div>
              <div className="flex items-center">
                <FiTag className="mr-1.5 h-4 w-4" />
                {notice.category}
              </div>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800">
            <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300">
              {/* 본문 렌더링 로직 */}
              {notice.content.split('\n\n').map((paragraph, index) => (
                <React.Fragment key={index}>
                  {paragraph.includes('■') ? (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                      {paragraph.replace('■ ', '')}
                    </h3>
                  ) : paragraph.match(/^\d+\.\s/) ? (
                    <div className="pl-4 mb-3">
                      <p className="text-gray-700 dark:text-gray-300">{paragraph}</p>
                    </div>
                  ) : paragraph.match(/^-\s/) ? (
                    <div className="pl-4 mb-2">
                      <p className="text-gray-700 dark:text-gray-300">{paragraph}</p>
                    </div>
                  ) : (
                    <p className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* 이전/다음 글 네비게이션 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
            {prevNotice && (
              <Link
                href={`/support/notice/${prevNotice.id}`}
                className="p-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <ArrowLeft className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">이전 글</div>
                  <div className="text-gray-900 dark:text-white font-medium line-clamp-1">{prevNotice.title}</div>
                </div>
              </Link>
            )}

            {nextNotice && (
              <Link
                href={`/support/notice/${nextNotice.id}`}
                className="p-4 flex items-center hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <ArrowRight className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">다음 글</div>
                  <div className="text-gray-900 dark:text-white font-medium line-clamp-1">{nextNotice.title}</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* 목록으로 버튼 */}
        <div className="flex justify-center mt-8">
          <Link href="/support/notice" >
            <Button variant="outline" className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <FiArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoticeDetailClient; // 기본 내보내기 추가 