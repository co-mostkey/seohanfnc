import React from 'react';
import Link from 'next/link';
import { Settings, MoreHorizontal, LucideIcon } from 'lucide-react';
import type { QuickLink } from '@/data/intranetDashboardData'; // QuickLink 타입 import

interface QuickMenuWidgetProps {
    links: QuickLink[];
}

const defaultIconBaseClassName = "h-6 w-6";

// 아이콘 타이틀별 색상 매핑 (quickLinksData의 원래 스타일 참고)
const iconColorMap: Record<string, string> = {
    '공지사항': 'text-gray-300',
    '임직원 목록': 'text-gray-300',
    '문서함': 'text-gray-300',
    '일정 관리': 'text-gray-300',
    '프로젝트': 'text-gray-300',
    '메시지': 'text-gray-300',
};
const defaultIconColor = 'text-gray-400'; // 매핑에 없는 아이콘의 기본 색상

export const QuickMenuWidget: React.FC<QuickMenuWidgetProps> = ({ links }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                    <MoreHorizontal className="h-5 w-5 mr-2 text-gray-300" />
                    <span>퀵 메뉴</span>
                </h2>
                <Link
                    href="/intranet/settings"
                    className="text-gray-300 hover:text-white text-sm flex items-center"
                >
                    <Settings className="h-4 w-4 mr-1" />
                    <span>메뉴 설정</span>
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {links.map((link, index) => {
                    const IconComponent = link.icon as LucideIcon;
                    const iconColor = iconColorMap[link.title] || defaultIconColor;
                    const finalIconClassName = `${defaultIconBaseClassName} ${iconColor}`;
                    return (
                        <Link
                            href={link.url}
                            key={`quick-link-${index}`}
                            className="group relative flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30 border border-white/10 hover:border-white/20"
                        >
                            <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center mb-3 group-hover:bg-black/70 transition-all duration-300 border border-white/10 group-hover:border-white/30">
                                <span className="transform group-hover:scale-110 transition-transform duration-300">
                                    {IconComponent && React.createElement(IconComponent, { className: finalIconClassName })}
                                </span>
                            </div>
                            <span className="text-white text-sm font-medium mb-1 group-hover:text-white transition-colors">{link.title}</span>
                            <span className="text-gray-400 text-xs text-center transition-colors group-hover:text-gray-200 opacity-0 group-hover:opacity-100">{link.description}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}; 