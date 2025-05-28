import React from 'react';
import Link from 'next/link';
import { Megaphone, ExternalLink, Pin } from 'lucide-react';
import type { Notice } from '@/data/intranetDashboardData';
import { getRelativeTimeString, getNoticeCategoryStyle } from '@/lib/intranetUtils';

interface NoticeWidgetProps {
    notices: Notice[];
}

export const NoticeWidget: React.FC<NoticeWidgetProps> = ({ notices }) => {
    return (
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl border border-orange-900/30 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-orange-800/30">
                <h3 className="font-semibold text-white flex items-center">
                    <Megaphone className="h-5 w-5 mr-2 text-orange-400" />
                    <span>최근 공지사항</span>
                </h3>
                <Link
                    href="/intranet/notices"
                    className="text-orange-400 hover:text-orange-300 text-sm flex items-center"
                >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span>전체보기</span>
                </Link>
            </div>
            <div className="p-4">
                <ul className="space-y-4">
                    {notices.slice(0, 4).map((notice) => (
                        <li key={notice.id} className="relative group">
                            <Link
                                href={`/intranet/notices/${notice.id}`}
                                className="block p-2 -mx-2 rounded-lg transition-colors hover:bg-orange-950/30"
                            >
                                <div className="flex items-start">
                                    {notice.isPinned && (
                                        <Pin className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mr-1.5 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1.5">
                                            <span className="text-xs text-gray-400">
                                                {getRelativeTimeString(notice.date)}
                                            </span>
                                            <span className="mx-1.5 text-xs text-gray-500">•</span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded-md ${notice.category === '인사' ? 'bg-purple-900/70 text-purple-200' :
                                                notice.category === '교육' ? 'bg-green-900/70 text-green-200' :
                                                    notice.category === '마케팅' ? 'bg-orange-900/70 text-orange-200' :
                                                        notice.category === '경영' ? 'bg-blue-900/70 text-blue-200' :
                                                            notice.category === '복지' ? 'bg-yellow-900/70 text-yellow-200' :
                                                                'bg-gray-800 text-gray-300'
                                                }`}>
                                                {notice.category}
                                            </span>
                                            {notice.isNew && (
                                                <span className="ml-2">
                                                    <span className="text-xs bg-orange-600 text-white px-1.5 py-0.5 rounded-md">NEW</span>
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white text-sm font-medium group-hover:text-orange-200 transition-colors line-clamp-1">
                                            {notice.isImportant && (
                                                <span className="text-red-400 mr-1">[중요]</span>
                                            )}
                                            {notice.title}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {notices.length === 0 && (
                <div className="p-6 text-center text-gray-400">
                    <p>등록된 공지사항이 없습니다.</p>
                </div>
            )}
        </div>
    );
}; 