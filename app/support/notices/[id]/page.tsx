"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';
import { ArrowLeft, Calendar, User, Tag, Paperclip, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNoticeById } from '@/data/notices';
import { Metadata } from 'next';

interface NoticePageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helper function to get display title (could be moved to utils)
const getDisplayTitle = (title: Post['title']) => {
    if (typeof title === 'string') return title;
    return title?.ko || title?.en || '제목 없음';
};

// Helper function to get display content
const getDisplayContent = (content: Post['content']) => {
    if (typeof content === 'string') return content;
    return content?.ko || content?.en || '내용 없음';
};

export default function NoticeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPostDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/notices/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('공지사항을 찾을 수 없습니다.');
                }
                throw new Error('공지사항을 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            if (data.success) {
                setPost(data.data);
            } else {
                throw new Error(data.error || '공지사항을 불러오는데 실패했습니다.');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || '알 수 없는 오류가 발생했습니다.');
            setPost(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">오류가 발생했습니다</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
                        <Link href="/support/notices" >
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                공지사항 목록으로 돌아가기
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">공지사항을 찾을 수 없습니다</h1>
                        <Link href="/support/notices" >
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                공지사항 목록으로 돌아가기
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 뒤로가기 버튼 */}
                <div className="mb-6">
                    <Link href="/support/notices" >
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            공지사항 목록
                        </Button>
                    </Link>
                </div>

                {/* 게시글 내용 */}
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* 헤더 */}
                    <header className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                {getDisplayTitle(post.title)}
                            </h1>
                            {post.isNotice && (
                                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                    공지
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{typeof post.author === 'string' ? post.author : post.author?.name || '작성자'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>조회 {post.viewCount || 0}</span>
                            </div>
                        </div>

                        {/* 태그 */}
                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-4">
                                <Tag className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </header>

                    {/* 본문 */}
                    <div className="px-6 py-8">
                        <div className="prose max-w-none dark:prose-invert prose-gray">
                            <div
                                className="whitespace-pre-wrap break-words"
                                dangerouslySetInnerHTML={{
                                    __html: getDisplayContent(post.content).replace(/\n/g, '<br>')
                                }}
                            />
                        </div>
                    </div>

                    {/* 첨부파일 */}
                    {Array.isArray(post.attachments) && post.attachments.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                <Paperclip className="h-4 w-4 mr-2" />
                                첨부파일
                            </h3>
                            <div className="space-y-2">
                                {post.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <a
                                            href={attachment.url}
                                            download={attachment.name}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {attachment.name}
                                        </a>
                                        <span className="text-gray-500 ml-2">
                                            ({(attachment.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 하단 액션 */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="sm">
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    좋아요 {post.likeCount || 0}
                                </Button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {post.updatedAt && post.updatedAt !== post.createdAt && (
                                    <span>수정일: {new Date(post.updatedAt).toLocaleDateString('ko-KR')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                {/* 목록으로 돌아가기 */}
                <div className="mt-8 text-center">
                    <Link href="/support/notices" >
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            공지사항 목록으로 돌아가기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 