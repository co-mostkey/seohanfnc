import React from 'react';
import Link from 'next/link';
import { Plus, Edit, FileQuestion, Settings, ChevronRight, LayoutDashboard, Package, Users, BarChart2 } from 'lucide-react';
import { ADMIN_CARD_STYLES, ADMIN_HEADING_STYLES, ADMIN_UI, ADMIN_FONT_STYLES } from '@/lib/admin-ui-constants';

const quickLinks = [
    {
        id: 1,
        title: '새 제품 등록',
        path: '/admin/products/create',
        icon: Plus,
        color: 'text-orange-700 bg-orange-100 border-orange-300'
    },
    {
        id: 2,
        title: '문의사항 확인',
        path: '/admin/inquiries',
        icon: FileQuestion,
        color: 'text-orange-700 bg-orange-100 border-orange-300',
        badge: '새 문의 5건'
    },
    {
        id: 3,
        title: '게시물 관리',
        path: '/admin/posts',
        icon: Edit,
        color: 'text-amber-700 bg-amber-100 border-amber-300'
    },
    {
        id: 4,
        title: '설정',
        path: '/admin/settings',
        icon: Settings,
        color: 'text-gray-700 bg-gray-100 border-gray-300'
    },
];

// 간편 검색/이동 옵션
const mainNavigationLinks = [
    {
        id: 'dashboard',
        title: '대시보드',
        path: '/admin',
        icon: LayoutDashboard,
    },
    {
        id: 'products',
        title: '제품 관리',
        path: '/admin/products',
        icon: Package,
    },
    {
        id: 'users',
        title: '사용자 관리',
        path: '/admin/users',
        icon: Users,
    },
    {
        id: 'stats',
        title: '통계',
        path: '/admin/statistics',
        icon: BarChart2,
    },
];

export const AdminQuickLinksSection: React.FC = () => {
    return (
        <div className="lg:col-span-1 h-full">
            <div className={`h-full ${ADMIN_CARD_STYLES.DEFAULT} overflow-hidden flex flex-col`}>
                <div className={`p-4 border-b ${ADMIN_UI.BORDER_LIGHT} ${ADMIN_UI.BG_SECONDARY}`}>
                    <h2 className={`${ADMIN_HEADING_STYLES.SECTION_TITLE} ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>바로가기</h2>
                </div>
                <div className="flex-1 overflow-auto">
                    <div className={`p-3 border-b ${ADMIN_UI.BORDER_LIGHT}`}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="관리자 패널 빠른 검색..."
                                className={`w-full px-3 py-2.5 pl-9 ${ADMIN_UI.BORDER_MEDIUM} rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${ADMIN_UI.BG_INPUT} ${ADMIN_UI.TEXT_PRIMARY} placeholder-${ADMIN_UI.TEXT_MUTED} focus:${ADMIN_UI.BG_PRIMARY}`}
                                style={ADMIN_FONT_STYLES.BODY_TEXT}
                            />
                            <svg
                                className={`absolute left-3 top-3 h-4 w-4 ${ADMIN_UI.TEXT_MUTED}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {mainNavigationLinks.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.path}
                                    className={`flex items-center p-2.5 text-sm ${ADMIN_UI.TEXT_SECONDARY} hover:${ADMIN_UI.BG_ACCENT} hover:${ADMIN_UI.TEXT_ACCENT} rounded-md transition-colors font-medium`}
                                    style={ADMIN_FONT_STYLES.MENU_ITEM}
                                >
                                    <link.icon className={`mr-2 h-4 w-4 ${ADMIN_UI.TEXT_MUTED} group-hover:${ADMIN_UI.TEXT_ACCENT}`} />
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <ul className="divide-y">
                        {quickLinks.map((link) => {
                            // 아이콘 및 뱃지 스타일 동적 적용
                            const iconContainerClasses = `${ADMIN_UI.BG_ACCENT} border ${ADMIN_UI.BORDER_ACCENT}`;
                            const iconClasses = ADMIN_UI.TEXT_ACCENT;
                            const badgeClasses = `${ADMIN_UI.BG_ACCENT} ${ADMIN_UI.TEXT_ACCENT} border ${ADMIN_UI.BORDER_ACCENT}`;

                            return (
                                <li key={link.id}>
                                    <Link
                                        href={link.path}
                                        className={`flex items-center p-4 hover:${ADMIN_UI.BG_HOVER} transition-colors group`}
                                    >
                                        <div className={`p-2 mr-3 rounded-full border ${iconContainerClasses}`}>
                                            <link.icon className={`h-5 w-5 ${iconClasses}`} />
                                        </div>
                                        <span className={`flex-1 ${ADMIN_UI.TEXT_PRIMARY} font-medium`} style={ADMIN_FONT_STYLES.BODY_TEXT}>{link.title}</span>
                                        {link.badge && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses} mr-2`} style={ADMIN_FONT_STYLES.BADGE}>
                                                {link.badge}
                                            </span>
                                        )}
                                        <ChevronRight className={`h-4 w-4 ${ADMIN_UI.TEXT_MUTED} group-hover:${ADMIN_UI.TEXT_PRIMARY}`} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className={`p-3 border-t ${ADMIN_UI.BORDER_LIGHT} ${ADMIN_UI.BG_SECONDARY} text-center`}>
                    <a href="https://www.seohanfnc.com" target="_blank" rel="noopener noreferrer" className={`text-xs ${ADMIN_UI.TEXT_MUTED} hover:${ADMIN_UI.TEXT_ACCENT} font-medium`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                        서한에프앤씨 공식 홈페이지 바로가기
                    </a>
                </div>
            </div>
        </div>
    );
}; 