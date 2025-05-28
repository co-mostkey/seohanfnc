import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
    ArrowRight,
    Package,
    FileText,
    Mail,
    User,
    ServerCrash,
} from 'lucide-react';
import { ActivityItem } from '@/data/adminDashboardData';
import {
    ADMIN_CARD_STYLES,
    ADMIN_HEADING_STYLES,
    ADMIN_UI,
    ADMIN_FONT_STYLES,
} from '@/lib/admin-ui-constants';
import Link from 'next/link';

interface AdminRecentActivitySectionProps {
    activities: ActivityItem[];
}

export const AdminRecentActivitySection: React.FC<AdminRecentActivitySectionProps> = ({ activities }) => {
    const getStatusIcon = (status: string, type?: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-600" />;
            case 'pending':
                return <AlertTriangle className="h-5 w-5 text-amber-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-amber-600" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                // 기본 유형별 아이콘
                if (type === 'product') return <Package className="h-5 w-5 text-orange-600" />;
                if (type === 'post') return <FileText className="h-5 w-5 text-amber-600" />;
                if (type === 'inquiry') return <Mail className="h-5 w-5 text-blue-600" />;
                if (type === 'user') return <User className="h-5 w-5 text-purple-600" />;
                if (type === 'system') return <ServerCrash className="h-5 w-5 text-gray-600" />;

                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getTimeAgo = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: ko });
        } catch (error) {
            return '알 수 없음';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900 text-green-300 border border-green-800">
                        완료
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-900 text-amber-300 border border-amber-800">
                        대기 중
                    </span>
                );
            case 'info':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-300 border border-blue-800">
                        정보
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-900 text-amber-300 border border-amber-800">
                        주의
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-300 border border-red-800">
                        오류
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="lg:col-span-2 h-full">
            <div className={`h-full ${ADMIN_CARD_STYLES.DEFAULT} overflow-hidden`}>
                <div className={`p-4 border-b ${ADMIN_UI.BORDER_LIGHT} ${ADMIN_UI.BG_SECONDARY}`}>
                    <h2
                        className={`${ADMIN_HEADING_STYLES.SECTION_TITLE} ${ADMIN_UI.TEXT_PRIMARY}`}
                        style={ADMIN_FONT_STYLES.SECTION_TITLE}
                    >
                        최근 활동
                    </h2>
                </div>
                <div>
                    {activities.length === 0 ? (
                        <div className={`p-6 text-center ${ADMIN_UI.TEXT_MUTED} font-medium`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            활동 내역이 없습니다.
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {activities.map((activity) => (
                                <li key={activity.id} className={`p-4 ${ADMIN_UI.BG_HOVER} transition-colors`}>
                                    <div className="flex items-start">
                                        <div className="mr-3 mt-0.5">
                                            {getStatusIcon(activity.status, activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-sm font-medium ${ADMIN_UI.TEXT_PRIMARY} truncate`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                        {activity.action}
                                                    </p>
                                                    {getStatusBadge(activity.status)}
                                                </div>
                                                <span className={`text-xs font-medium ${ADMIN_UI.TEXT_MUTED} whitespace-nowrap ml-2`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                    {getTimeAgo(activity.timestamp)}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${ADMIN_UI.TEXT_SECONDARY} mt-1`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className={`text-xs ${ADMIN_UI.TEXT_SECONDARY} font-medium`} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                    {activity.user}
                                                </p>
                                                {activity.related?.url && (
                                                    <Link
                                                        href={activity.related.url}
                                                        className={`inline-flex items-center text-xs ${ADMIN_UI.TEXT_LINK} font-medium ${ADMIN_UI.BG_ACCENT} ${ADMIN_UI.BG_HOVER} px-2 py-1 rounded-md transition-colors`}
                                                    >
                                                        상세보기
                                                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                                {activity.actionUrl && !activity.related?.url && (
                                                    <Link
                                                        href={activity.actionUrl}
                                                        className={`inline-flex items-center text-xs ${ADMIN_UI.TEXT_LINK} font-medium ${ADMIN_UI.BG_ACCENT} ${ADMIN_UI.BG_HOVER} px-2 py-1 rounded-md transition-colors`}
                                                    >
                                                        {activity.status === 'pending' ? '처리하기' : '확인하기'}
                                                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={`p-3 border-t ${ADMIN_UI.BORDER_LIGHT} ${ADMIN_UI.BG_SECONDARY} flex justify-center`}>
                    <Link
                        href="/admin/activities"
                        className={`${ADMIN_UI.TEXT_LINK} text-sm font-medium flex items-center`}
                        style={ADMIN_FONT_STYLES.BUTTON}
                    >
                        모든 활동 보기
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}; 