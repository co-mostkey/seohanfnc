import React from 'react';
import { Calendar, Clock, LucideIcon } from 'lucide-react';
import { getStatusStyle } from '@/lib/intranetUtils'; // 스타일 유틸리티 import

interface DashboardHeaderProps {
    currentTime: Date;
    activeMembers: number;
    totalMembers: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    currentTime,
    activeMembers,
    totalMembers
}) => {
    const onlineStatusMeta = getStatusStyle('online');
    const IconComponent = onlineStatusMeta.icon as LucideIcon;

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                        인트라넷 대시보드
                    </h1>
                    <p className="text-gray-200 flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1.5 text-orange-400" />
                        {currentTime.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                        })}
                        <span className="mx-2 text-gray-400">•</span>
                        <Clock className="h-4 w-4 mr-1.5 text-orange-400" />
                        {currentTime.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-800/30 shadow-md">
                    <span className="text-orange-200 text-sm mr-2">활성 멤버:</span>
                    <span className="text-white font-semibold">{activeMembers}</span>
                    <span className="text-orange-200 text-sm mx-1">/</span>
                    <span className="text-white font-semibold">{totalMembers}</span>
                    <span className="ml-2 flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                        {IconComponent && React.createElement(IconComponent, { className: "hidden" })}
                        <span className="text-green-400 text-xs">온라인</span>
                    </span>
                </div>
            </div>

            {/* 추가된 경로 네비게이션 */}
            <div className="mt-4 py-2 px-4 bg-gray-900/50 rounded-md border border-orange-900/20 flex items-center text-sm text-gray-300">
                <span className="text-orange-400 hover:text-orange-300">홈</span>
                <span className="mx-2">/</span>
                <span className="text-white">대시보드</span>
            </div>
        </div>
    );
}; 