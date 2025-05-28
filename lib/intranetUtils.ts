import React from 'react';
import { FileText, CheckCircle2, Clock, User as UserIcon, LucideIcon } from 'lucide-react';

// 파일 타입별 아이콘 및 색상
export const fileTypeIcons: Record<string, { icon: LucideIcon; color: string }> = {
    'pdf': { icon: FileText, color: 'text-red-400' },
    'docx': { icon: FileText, color: 'text-blue-400' },
    'xlsx': { icon: FileText, color: 'text-green-400' },
    'pptx': { icon: FileText, color: 'text-orange-400' },
    'default': { icon: FileText, color: 'text-gray-400' },
};

// 카테고리 뱃지 색상
export const categoryColors: Record<string, string> = {
    '회사소식': 'bg-blue-900 text-blue-200',
    '인사': 'bg-purple-900 text-purple-200',
    '교육': 'bg-green-900 text-green-200',
    '사내 활동': 'bg-yellow-900 text-yellow-200',
    '경영지원': 'bg-indigo-900 text-indigo-200',
    '마케팅': 'bg-pink-900 text-pink-200',
    '영업': 'bg-cyan-900 text-cyan-200',
    '개발': 'bg-emerald-900 text-emerald-200',
    '시설': 'bg-orange-900 text-orange-200', // 추가 (getNoticeCategoryColor 함수 내용 참고)
    'default': 'bg-gray-700 text-gray-300',
};

// 우선순위 색상
export const priorityColors: Record<string, string> = {
    'high': 'text-red-400',
    'medium': 'text-yellow-400',
    'low': 'text-blue-400',
};

// 날짜 포맷 함수
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    });
};

// 상대적인 날짜 표시 함수
export const getRelativeTimeString = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays > 1 && diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays >= 7 && diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;

    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

// 남은 일수 계산 함수
export const getRemainingDays = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// 상태별 색상 및 아이콘 반환 함수 (lucide-react 아이콘 직접 반환하도록 수정)
export const getStatusStyle = (status: string): { color: string; bgColor: string; icon: LucideIcon; iconClassName: string; } => {
    switch (status) {
        case 'online':
            return {
                color: 'text-green-400',
                bgColor: 'bg-green-400',
                icon: CheckCircle2,
                iconClassName: "h-3 w-3 text-green-400"
            };
        case 'away':
            return {
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-400',
                icon: Clock,
                iconClassName: "h-3 w-3 text-yellow-400"
            };
        case 'offline':
        default:
            return {
                color: 'text-gray-400',
                bgColor: 'bg-gray-400',
                icon: UserIcon,
                iconClassName: "h-3 w-3 text-gray-400"
            };
    }
};

// 이벤트 타입별 색상 반환 함수
export const getEventTypeBorderStyle = (type: string): string => {
    switch (type) {
        case 'meeting':
            return 'border-blue-500';
        case 'event':
            return 'border-purple-500';
        case 'training':
            return 'border-green-500';
        default:
            return 'border-gray-500';
    }
};

// 공지사항 카테고리별 색상 반환 함수 (categoryColors 객체 사용하도록 단순화 가능)
export const getNoticeCategoryStyle = (category: string): string => {
    return categoryColors[category] || categoryColors.default;
}; 