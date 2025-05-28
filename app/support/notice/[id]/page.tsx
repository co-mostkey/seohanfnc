"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Tag, User, Eye, AlertCircle, Loader2 } from 'lucide-react';

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

// interface Attachment {
//   id: string;
//   fileName: string;
//   fileUrl: string;
//   fileType: string;
//   fileSize: number;
// }

export default function NoticeDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchNoticeDetail = async () => {
                setLoading(true);
                setError(null);
                try {
                    // 새로 생성한 /api/notices/[id] 엔드포인트 사용
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

                    // API 응답이 직접 Notice 객체를 반환
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        setNotice(data as NoticeDetail);
                    } else {
                        throw new Error('잘못된 형식의 공지사항 데이터입니다.');
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
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                <p className="ml-3 text-lg text-gray-300">공지사항을 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-red-400">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="text-xl font-semibold">오류 발생</p>
                <p>{error}</p>
                <Link href="/support/notices" className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition-colors">
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    if (!notice) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-gray-400">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="text-xl">공지사항을 찾을 수 없습니다.</p>
                <Link href="/support/notices" className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition-colors">
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/support/notices"
                        className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        목록으로 돌아가기
                    </Link>
                </div>

                <article className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <header className="p-6 md:p-8 border-b border-gray-700">
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                            <Tag className="h-4 w-4 mr-1.5 text-orange-500" />
                            <span>{notice.category || '일반'}</span>
                            {notice.isPinned && (
                                <span className="ml-3 inline-flex items-center rounded-full bg-red-600/80 px-2.5 py-0.5 text-xs font-semibold text-white">
                                    중요
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                            {notice.title}
                        </h1>
                        <div className="mt-4 flex flex-wrap items-center text-xs md:text-sm text-gray-500 gap-x-4 gap-y-2">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1.5" />
                                <span>{notice.author || '관리자'}</span>
                            </div>
                            <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1.5" />
                                <span>게시일: {new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            {notice.updatedAt && new Date(notice.updatedAt).getTime() !== new Date(notice.createdAt).getTime() && (
                                <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 mr-1.5 text-blue-400" />
                                    <span>수정일: {new Date(notice.updatedAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1.5" />
                                <span>조회수: {notice.viewCount || 0}</span>
                            </div>
                        </div>
                    </header>

                    {/* 여기서는 HTML 내용을 안전하게 렌더링한다고 가정합니다. 실제 프로덕션에서는 XSS 방지를 위해 DOMPurify 등을 사용해야 합니다. */}
                    <div
                        className="prose prose-invert prose-sm md:prose-base max-w-none p-6 md:p-8"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                    />

                    {/* 첨부파일 섹션 (필요시 구현) */}
                    {/* {notice.attachments && notice.attachments.length > 0 && (
            <section className="p-6 md:p-8 border-t border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-3">첨부파일</h2>
              <ul className="space-y-2">
                {notice.attachments.map(file => (
                  <li key={file.id}>
                    <a 
                      href={file.fileUrl} 
                      download 
                      className="text-orange-500 hover:text-orange-400 hover:underline flex items-center"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      {file.fileName} ({ (file.fileSize / (1024*1024)).toFixed(2) } MB)
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )} */}
                </article>

                <div className="mt-8 text-center">
                    <Link
                        href="/support/notices"
                        className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-md transition-colors shadow-lg"
                    >
                        다른 공지사항 보기
                    </Link>
                </div>
            </div>
        </div>
    );
} 