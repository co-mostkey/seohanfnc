"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { Notice } from '@/app/api/notices/route';
import { formatDate } from '@/lib/utils';

interface NoticesListProps {
    limit?: number;
    showViewMore?: boolean;
    className?: string;
}

export default function NoticesList({ limit = 5, showViewMore = true, className = '' }: NoticesListProps) {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/notices?limit=${limit}`);

                if (!response.ok) {
                    throw new Error('공지사항을 불러오는데 실패했습니다.');
                }

                const data = await response.json();
                setNotices(data.data || []);
            } catch (err: any) {
                console.error('Failed to fetch notices:', err);
                setError(err.message || '공지사항을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, [limit]);

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                {[...Array(limit)].map((_, index) => (
                    <div key={index} className="py-2 border-b border-gray-700/20">
                        <div className="h-4 bg-gray-700/20 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-700/10 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 bg-red-900/10 border border-red-800/20 rounded-md flex items-center text-red-400 ${className}`}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
            </div>
        );
    }

    if (notices.length === 0) {
        return (
            <div className={`p-4 text-center text-gray-500 italic ${className}`}>
                공지사항이 없습니다.
            </div>
        );
    }

    return (
        <div className={className}>
            <ul className="space-y-2">
                {notices.map((notice) => (
                    <li key={notice.id} className="py-2 border-b border-gray-700/20 last:border-0">
                        <Link
                            href={`/notices/${notice.id}`}
                            className="flex justify-between items-start hover:text-orange-500 group transition-colors"
                        >
                            <div>
                                <div className="flex items-center">
                                    {notice.isPinned && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs bg-orange-600/20 text-orange-500 mr-2">
                                            공지
                                        </span>
                                    )}
                                    <h3 className="font-medium group-hover:text-orange-500 transition-colors truncate">{notice.title}</h3>
                                </div>
                                <span className="text-xs text-gray-500 mt-1 block">
                                    {formatDate(notice.createdAt)} · {notice.category || '일반'}
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                        </Link>
                    </li>
                ))}
            </ul>
            {showViewMore && notices.length > 0 && (
                <div className="mt-4 text-center">
                    <Link
                        href="/notices"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-orange-500"
                    >
                        공지사항 더보기
                        <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                </div>
            )}
        </div>
    );
} 