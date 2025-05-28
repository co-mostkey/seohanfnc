import React from 'react';
import Link from 'next/link';
import { LucideIcon, ChevronRight, Package, FileText, Mail, BarChart2, Info, Layers, Grid, Settings } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ADMIN_HEADING_STYLES, ADMIN_UI, ADMIN_FONT_STYLES, ADMIN_CARD_STYLES } from '@/lib/admin-ui-constants';

interface AdminMenuItem {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    path: string;
    color: string;
    badgeCount?: number; // 알림 뱃지 카운트 (옵션)
    badgeColor?: string; // 뱃지 색상 (옵션)
}

interface AdminMenuSectionProps {
    menus: AdminMenuItem[];
}

// 아이콘 컴포넌트들을 명시적으로 매핑
const iconComponents: { [key: string]: LucideIcon } = {
    Package,
    FileText,
    Mail,
    BarChart2,
    Info,
    Layers,
    Grid,
    Settings,
};

export const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ menus }) => {
    const getColorClasses = (color: string) => {
        // 오렌지 계열로 통일된 색상 스키마
        const colorMap: Record<string, { bg: string, text: string, border: string, icon: string }> = {
            'bg-blue-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, border: 'border-orange-800', icon: 'text-orange-400' },
            'bg-green-500': { bg: 'bg-amber-950/30', text: 'text-amber-400', border: 'border-amber-800', icon: 'text-amber-400' },
            'bg-yellow-500': { bg: 'bg-amber-950/40', text: 'text-amber-300', border: 'border-amber-700', icon: 'text-amber-300' },
            'bg-purple-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, border: 'border-orange-800', icon: 'text-orange-400' },
            'bg-orange-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, border: 'border-orange-800', icon: 'text-orange-400' },
            'bg-pink-500': { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-800', icon: 'text-red-400' },
            'bg-indigo-500': { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, border: 'border-orange-800', icon: 'text-orange-400' },
            'bg-red-500': { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-800', icon: 'text-red-400' },
            'bg-gray-500': { bg: 'bg-gray-900', text: 'text-gray-300', border: 'border-gray-700', icon: 'text-gray-400' },
            'bg-amber-500': { bg: 'bg-amber-950/30', text: 'text-amber-400', border: 'border-amber-800', icon: 'text-amber-400' },
        };

        return colorMap[color] || { bg: ADMIN_UI.BG_ACCENT, text: ADMIN_UI.TEXT_ACCENT, border: 'border-orange-800', icon: 'text-orange-400' };
    };

    return (
        <div className="mb-8">
            <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>관리 메뉴</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {menus.map((menu) => {
                    const IconComponent = typeof menu.icon === 'string' ? iconComponents[menu.icon as string] : menu.icon;
                    const colors = getColorClasses(menu.color);

                    return (
                        <Link
                            href={menu.path}
                            key={menu.id}
                            className={`${ADMIN_CARD_STYLES.DEFAULT} ${ADMIN_CARD_STYLES.HOVER} p-5 transition-all group`}
                        >
                            <div className="flex items-center mb-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colors.bg} ${colors.border} border`}>
                                    {IconComponent && React.createElement(IconComponent, { className: `h-5 w-5 ${colors.icon}` })}
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <h3 className={`font-medium ${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.CARD_TITLE}>{menu.title}</h3>
                                    {menu.badgeCount !== undefined && menu.badgeCount > 0 && (
                                        <Badge className={`${menu.badgeColor || 'bg-orange-600 hover:bg-orange-700'}`} style={ADMIN_FONT_STYLES.BADGE}>
                                            {menu.badgeCount > 99 ? '99+' : menu.badgeCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <p className={`${ADMIN_UI.TEXT_SECONDARY} text-sm mb-3`} style={ADMIN_FONT_STYLES.BODY_TEXT}>{menu.description}</p>
                            <div className={`${ADMIN_UI.TEXT_ACCENT} text-sm flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                바로가기
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}; 