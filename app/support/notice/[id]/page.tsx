"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, CalendarDays, Tag, User, Eye, AlertCircle, Loader2 } from 'lucide-react';
import HeroOverlay from '@/components/hero/HeroOverlay';

interface NoticeDetail {
    id: string;
    title: string;
    content: string;
    author?: string;
    category?: string;
    createdAt: string;
    updatedAt?: string;
    viewCount?: number;
    isPinned?: boolean;
}

interface NavigationNotice {
    id: string;
    title: string;
}

// interface Attachment {
//   id: string;
//   fileName: string;
//   fileUrl: string;
//   fileType: string;
//   fileSize: number;
// }

// 간단한 마크다운 파서
function parseMarkdown(text: string): string {
    if (!text) return '';

    // HTML 이스케이프
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 줄바꿈을 <br>로 변환
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // 굵게
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 기울임 (언더스코어와 단일 별표 둘 다 지원)
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 밑줄
    html = html.replace(/<u>([^<]+)<\/u>/g, '<u>$1</u>');

    // 링크
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-500 hover:text-orange-400 underline">$1</a>');

    // 이미지
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4">');

    // 테이블
    html = html.replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        if (cells.every((cell: string) => cell.match(/^-+$/))) {
            return ''; // 구분선은 무시
        }
        const cellTags = cells.map((cell: string) => `<td class="border border-gray-700 px-4 py-2">${cell}</td>`).join('');
        return `<tr>${cellTags}</tr>`;
    });

    // 테이블을 감싸는 태그 추가
    if (html.includes('<tr>')) {
        html = html.replace(/(<tr>.*<\/tr>)/s, '<table class="w-full border-collapse border border-gray-700 my-4">$1</table>');
    }

    // 문단 태그로 감싸기
    html = `<p>${html}</p>`;

    return html;
}

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

export default function NoticeDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [prevNotice, setPrevNotice] = useState<NavigationNotice | null>(null);
    const [nextNotice, setNextNotice] = useState<NavigationNotice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchNoticeDetail = async () => {
                setLoading(true);
                setError(null);
                try {
                    // 현재 공지사항 가져오기
                    const res = await fetch(`/api/notices/${id}`, {
                        cache: 'no-store',
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    });

                    if (!res.ok) {
                        if (res.status === 404) {
                            throw new Error('공지사항을 찾을 수 없습니다.');
                        }
                        throw new Error('공지사항 데이터를 가져오는데 실패했습니다.');
                    }

                    const data = await res.json();
                    console.log('Fetched notice data:', data);

                    if (data && data.success && data.data) {
                        setNotice(data.data as NoticeDetail);
                    } else {
                        throw new Error('잘못된 형식의 공지사항 데이터입니다.');
                    }

                    // 전체 공지사항 목록 가져오기 (이전/다음 글 정보)
                    const listRes = await fetch('/api/notices?limit=100');
                    if (listRes.ok) {
                        const listData = await listRes.json();
                        if (listData.success && listData.data) {
                            const notices = listData.data;
                            const currentIndex = notices.findIndex((n: any) => n.id === id);

                            if (currentIndex > 0) {
                                setPrevNotice({
                                    id: notices[currentIndex - 1].id,
                                    title: notices[currentIndex - 1].title
                                });
                            }

                            if (currentIndex < notices.length - 1 && currentIndex !== -1) {
                                setNextNotice({
                                    id: notices[currentIndex + 1].id,
                                    title: notices[currentIndex + 1].title
                                });
                            }
                        }
                    }

                } catch (err) {
                    console.error('공지사항 상세 정보 로드 중 오류:', err);
                    setError(err instanceof Error ? err.message : '공지사항을 불러올 수 없습니다.');
                } finally {
                    setLoading(false);
                }
            };
            fetchNoticeDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="relative min-h-screen">
                <Image
                    src="/hero/hero_01.png"
                    alt="Background"
                    fill
                    className="absolute inset-0 object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
                <HeroOverlay />
                <div className="relative z-10 flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
                        <p className="mt-3 text-lg text-gray-300">공지사항을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !notice) {
        return (
            <div className="relative min-h-screen">
                <Image
                    src="/hero/hero_01.png"
                    alt="Background"
                    fill
                    className="absolute inset-0 object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
                <HeroOverlay />
                <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                    <p className="text-2xl font-semibold text-white mb-2">오류 발생</p>
                    <p className="text-gray-300 mb-8">{error || '공지사항을 찾을 수 없습니다.'}</p>
                    <Link
                        href="/support/notice"
                        className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

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

            {/* 컨텐츠 */}
            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* 뒤로가기 버튼 */}
                    <div className="mb-8">
                        <Link
                            href="/support/notice"
                            className="inline-flex items-center text-gray-300 hover:text-orange-400 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            목록으로 돌아가기
                        </Link>
                    </div>

                    {/* 공지사항 본문 */}
                    <article className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50">
                        <header className="p-8 border-b border-gray-700/50">
                            {/* 카테고리 및 중요 표시 */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium text-white ${getCategoryColor(notice.category || '일반')}`}>
                                    {notice.category || '일반'}
                                </span>
                                {notice.isPinned && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                        중요 공지
                                    </span>
                                )}
                            </div>

                            {/* 제목 */}
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                                {notice.title}
                            </h1>

                            {/* 메타 정보 */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    <span>{notice.author || '관리자'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>게시일: {new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                                {notice.updatedAt && new Date(notice.updatedAt).getTime() !== new Date(notice.createdAt).getTime() && (
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays className="h-4 w-4 text-blue-400" />
                                        <span>수정일: {new Date(notice.updatedAt).toLocaleDateString('ko-KR')}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4" />
                                    <span>조회수: {notice.viewCount || 0}</span>
                                </div>
                            </div>
                        </header>

                        {/* 내용 */}
                        <div className="p-8">
                            <div
                                className="prose prose-invert prose-lg max-w-none
                                prose-headings:text-gray-100 prose-headings:font-bold
                                prose-p:text-gray-300 prose-p:leading-relaxed
                                prose-strong:text-white prose-strong:font-semibold
                                prose-em:text-gray-200 prose-em:italic
                                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-400
                                prose-img:rounded-lg prose-img:shadow-xl prose-img:mx-auto
                                prose-table:border-collapse prose-table:w-full
                                prose-td:border prose-td:border-gray-700 prose-td:px-4 prose-td:py-2 prose-td:text-gray-300
                                prose-th:border prose-th:border-gray-700 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-800 prose-th:text-white"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(notice.content) }}
                            />
                        </div>
                    </article>

                    {/* 이전/다음 글 네비게이션 */}
                    <div className="mt-8 space-y-2">
                        {prevNotice && (
                            <Link
                                href={`/support/notice/${prevNotice.id}`}
                                className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:bg-gray-800/70 hover:border-orange-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-orange-400" />
                                    <div>
                                        <span className="text-sm text-gray-500">이전 글</span>
                                        <p className="text-white group-hover:text-orange-400 transition-colors mt-1">{prevNotice.title}</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                        {nextNotice && (
                            <Link
                                href={`/support/notice/${nextNotice.id}`}
                                className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:bg-gray-800/70 hover:border-orange-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-3 ml-auto text-right">
                                    <div>
                                        <span className="text-sm text-gray-500">다음 글</span>
                                        <p className="text-white group-hover:text-orange-400 transition-colors mt-1">{nextNotice.title}</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-400" />
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* 목록으로 버튼 */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/support/notice"
                            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            목록으로 돌아가기
                        </Link>
                    </div>
                </div>

                {/* 푸터 */}
                <footer className="w-full py-8 text-center mt-16">
                    <span className="text-sm text-gray-400">© {new Date().getFullYear()} SEOHAN FNC All Rights Reserved.</span>
                </footer>
            </div>
        </div>
    );
} 