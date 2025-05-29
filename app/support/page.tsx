'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ClipboardList,
  Calculator,
  Download,
  FileArchive,
  LifeBuoy,
  HelpCircle,
  Phone,
  Mail,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

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

const supportItems = [
  { id: 'notice', title: '공지사항', description: '서한에프앤씨의 새로운 소식과 정보를 확인하세요.', icon: ClipboardList, href: '/support/notice' },
  { id: 'quote', title: '온라인 견적', description: '필요한 제품의 견적을 간편하게 요청하세요.', icon: Calculator, href: '/support/quotation' },
  { id: 'downloads', title: '자료실', description: '제품 카탈로그, 사용 설명서 등 자료를 다운로드하세요.', icon: Download, href: '/support/downloads' },
  { id: 'certificates', title: '승인서류/카탈로그', description: '제품 관련 인증서 및 승인 서류를 확인하세요.', icon: FileArchive, href: '/support/resources' },
  { id: 'contact', title: '문의', description: '제품이나 서비스에 대한 문의를 남겨주세요.', icon: LifeBuoy, href: '/contact' },
  { id: 'faq', title: '자주 묻는 질문', description: '궁금한 점을 빠르게 해결할 수 있도록 도와드립니다.', icon: HelpCircle, href: '/support/faq' },
];

function SupportCategoryCard({
  title,
  description,
  icon: Icon,
  href,
  className = ""
}: {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
        "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
          <Icon className="h-6 w-6 text-primary dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}

function RecentNoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNotices = async () => {
      try {
        const response = await fetch('/api/notices?limit=4&page=1', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setNotices(data.data);
          } else {
            console.warn('API 응답 형식이 올바르지 않습니다.');
            setNotices([]);
          }
        } else {
          console.error('공지사항을 불러오는 중 오류 발생:', response.status);
          setNotices([]);
        }
      } catch (error) {
        console.error('공지사항을 불러오는 중 오류 발생:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNotices();
  }, []);

  if (loading) {
    return (
      <section className="lg:col-span-7">
        <div className={cn(
          "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
          "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm h-full"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">최근 공지사항</h2>
          </div>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">로딩 중...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-7">
      <div className={cn(
        "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
        "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm h-full"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">최근 공지사항</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/support/notices`}
              className="text-sm text-primary dark:text-primary-400"
            >
              더보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          {notices.length > 0 ? notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/support/notices/${notice.id}`}
              className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      중요
                    </span>
                  )}
                  <span className="text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                    {notice.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                  {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </Link>
          )) : (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">최근 공지사항이 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SupportPage() {
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '고객지원', href: `${basePath}/support`, active: true }
  ];

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
      <div className="w-full">
        {/* Breadcrumb & Page Heading */}
        <div className="mb-6">
          <SimpleBreadcrumb items={breadcrumbItems} />
        </div>
        <div className="mb-12 md:mb-16">
          <PageHeading
            title="고객지원"
            subtitle="궁금한 점이 있으신가요? 무엇이든 도와드리겠습니다."
          />
        </div>

        {/* Support Sections Grid */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-gray-200">고객지원 안내</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {supportItems.map((item) => (
              <SupportCategoryCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </section>

        {/* Recent Notices & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Recent Notices Section */}
          <RecentNoticesSection />

          {/* Contact Info Section */}
          <section className="lg:col-span-5">
            <div className={cn(
              "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
              "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm h-full"
            )}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">고객센터 연락처</h2>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-full mt-1">
                    <Phone className="h-5 w-5 text-primary dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">전화 문의</h4>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-100">02-1234-5678</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-full mt-1">
                    <Mail className="h-5 w-5 text-primary dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">이메일 문의</h4>
                    <a href="mailto:shfnc@hanmail.net" className="text-base text-gray-700 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400 underline">shfnc@hanmail.net</a>
                    <p className="text-xs text-gray-500 dark:text-gray-400">24시간 접수 가능</p>
                  </div>
                </div>
                {/* FAX */}
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-full mt-1">
                    <Printer className="h-5 w-5 text-primary dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">FAX</h4>
                    <p className="text-base text-gray-700 dark:text-gray-100">02-1234-5679</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">24시간 접수 가능</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 하단 여백 */}
        <div className="pb-24 md:pb-32"></div>

      </div>
    </div>
  );
} 