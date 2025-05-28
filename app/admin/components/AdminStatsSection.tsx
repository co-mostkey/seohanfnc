import React from 'react';
import { Package, Users, FileText, Mail, LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { StatItem } from '@/data/adminDashboardData';
import { ADMIN_HEADING_STYLES, ADMIN_UI, ADMIN_FONT_STYLES, ADMIN_CARD_STYLES } from '@/lib/admin-ui-constants';

// 아이콘 컴포넌트들을 명시적으로 매핑
const iconComponents: { [key: string]: LucideIcon } = {
    Package,
    Users,
    FileText,
    Mail,
};

interface AdminStatsSectionProps {
    stats: StatItem[];
}

// 임의의 추세 데이터 생성 (실제로는 API에서 가져와야 함)
const generateTrendData = () => {
    return Math.random() > 0.5
        ? { isUp: true, percentage: Math.floor(Math.random() * 30) + 1 }
        : { isUp: false, percentage: Math.floor(Math.random() * 20) + 1 };
};

export const AdminStatsSection: React.FC<AdminStatsSectionProps> = ({ stats }) => {
    return (
        <div className="mb-8">
            <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>통계 개요</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const IconComponent = typeof stat.icon === 'string' ? iconComponents[stat.icon as string] : stat.icon;

                    // 임의의 추세 데이터
                    const trend = generateTrendData();

                    // 다크 테마에 맞춘 오렌지/앰버 계열 색상
                    const colorMap: Record<string, { bg: string, text: string, iconBg: string }> = {
                        'bg-blue-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, iconBg: 'bg-orange-900/50' },
                        'bg-green-500': { bg: 'bg-amber-950/30', text: 'text-amber-400', iconBg: 'bg-amber-900/50' },
                        'bg-yellow-500': { bg: 'bg-amber-950/40', text: 'text-amber-300', iconBg: 'bg-amber-900/60' },
                        'bg-purple-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, iconBg: 'bg-orange-900/50' },
                        'bg-orange-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, iconBg: 'bg-orange-900/50' },
                        'bg-amber-500': { bg: 'bg-amber-950/30', text: 'text-amber-400', iconBg: 'bg-amber-900/50' },
                    };

                    const colors = colorMap[stat.color] || { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, iconBg: 'bg-orange-900/50' };

                    return (
                        <Link
                            href={stat.path}
                            key={stat.id}
                            className={`${ADMIN_CARD_STYLES.DEFAULT} ${ADMIN_CARD_STYLES.HOVER} flex flex-col p-5 transition-colors`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`flex-shrink-0 p-3 rounded-full ${colors.iconBg} border border-orange-800/60`}>
                                    {IconComponent && React.createElement(IconComponent, { className: `h-6 w-6 ${colors.text}` })}
                                </div>
                                <div className={`flex items-center text-xs font-medium rounded px-2 py-1 ${trend.isUp
                                    ? 'bg-green-900/30 text-green-400 border border-green-800'
                                    : 'bg-red-900/30 text-red-400 border border-red-800'}`}
                                    style={ADMIN_FONT_STYLES.BADGE}>
                                    {trend.isUp ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                                    {trend.percentage}%
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className={ADMIN_UI.TEXT_SECONDARY} style={ADMIN_FONT_STYLES.BODY_TEXT}>{stat.title}</h3>
                                <p className={`text-2xl font-bold ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>{stat.count.toLocaleString()}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <p className={`text-xs font-medium ${ADMIN_UI.TEXT_MUTED}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                    지난달 대비 {trend.isUp ? '증가' : '감소'}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}; 