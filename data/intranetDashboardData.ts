import { LucideIcon, BellRing, Users, FileText, Calendar, Briefcase, MessageSquare, User } from 'lucide-react';
import React from 'react';

// 타입 정의
export interface Notice {
    id: string;
    title: string;
    category: string;
    author: string;
    date: string;
    isNew: boolean;
    isPinned: boolean;
    isImportant: boolean;
}

export interface Document {
    id: string;
    title: string;
    category: string;
    author: string;
    date: string;
    fileType: string;
}

export interface Schedule {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    type: string;
    participants: string[];
}

export interface SalesData {
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
    target: number;
    targetCompletion: number;
}

export interface TodoItem {
    id: string;
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    isCompleted: boolean;
}

export interface TeamMember {
    id: number;
    name: string;
    position: string;
    department: string;
    avatar: string | null;
    status: 'online' | 'away' | 'offline';
    lastActive: string | null;
}

export interface ProjectStat {
    name: string;
    count: number;
    percentage: number;
    color: string;
}

export interface QuickLink {
    title: string;
    icon: LucideIcon;
    url: string;
    description: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    month: string;
    day: string;
    time: string;
    location?: string;
    type: 'meeting' | 'deadline' | 'reminder' | 'event';
}

export interface Assignee {
    name: string;
    avatar: string | null;
}

export interface Task {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    assignees: Assignee[];
}

// 데이터
export const noticesData: Notice[] = [
    {
        id: 'notice-1',
        title: '2024년 하반기 경영계획 발표회 안내',
        category: '회사소식',
        author: '경영지원팀',
        date: '2024-06-25',
        isNew: true,
        isPinned: true,
        isImportant: true
    },
    {
        id: 'notice-2',
        title: '여름 휴가 신청 안내',
        category: '인사',
        author: '인사팀',
        date: '2024-06-22',
        isNew: true,
        isPinned: false,
        isImportant: true
    },
    {
        id: 'notice-3',
        title: '신규 제품 교육 일정 안내',
        category: '교육',
        author: '영업팀',
        date: '2024-06-20',
        isNew: false,
        isPinned: false,
        isImportant: false
    },
    {
        id: 'notice-4',
        title: '사내 동호회 모집 공고',
        category: '사내 활동',
        author: '복지팀',
        date: '2024-06-18',
        isNew: false,
        isPinned: false,
        isImportant: false
    },
];

export const recentDocumentsData: Document[] = [
    {
        id: 'doc-1',
        title: '2024년 상반기 사업계획.pdf',
        category: '경영지원',
        author: '김대표',
        date: '2024-06-23',
        fileType: 'pdf',
    },
    {
        id: 'doc-2',
        title: '서한에프앤씨 회사소개서.pptx',
        category: '마케팅',
        author: '마케팅팀',
        date: '2024-06-20',
        fileType: 'pptx',
    },
    {
        id: 'doc-3',
        title: '제품 카탈로그 v2.0.pdf',
        category: '마케팅',
        author: '마케팅팀',
        date: '2024-06-18',
        fileType: 'pdf',
    },
];

export const schedulesData: Schedule[] = [
    {
        id: 'sched-1',
        title: '경영계획 발표회',
        date: '2024-07-05',
        startTime: '10:00',
        endTime: '12:00',
        location: '본사 대회의실',
        type: '회의',
        participants: ['김대표', '이사장', '부장들'],
    },
    {
        id: 'sched-2',
        title: '신규 제품 교육',
        date: '2024-07-07',
        startTime: '14:00',
        endTime: '16:00',
        location: '교육장',
        type: '교육',
        participants: ['영업팀', '마케팅팀'],
    },
    {
        id: 'sched-3',
        title: '부서별 미팅',
        date: '2024-07-10',
        startTime: '09:30',
        endTime: '10:30',
        location: '각 부서 회의실',
        type: '회의',
        participants: ['전직원'],
    },
];

export const salesDataInfo: SalesData = {
    currentMonth: 8700,
    previousMonth: 7500,
    percentageChange: 16,
    target: 10000,
    targetCompletion: 87,
};

export const todoListData: TodoItem[] = [
    {
        id: 'todo-1',
        title: '하반기 마케팅 계획 작성',
        dueDate: '2024-06-30',
        priority: 'high',
        isCompleted: false,
    },
    {
        id: 'todo-2',
        title: '신규 직원 온보딩 자료 검토',
        dueDate: '2024-06-28',
        priority: 'medium',
        isCompleted: false,
    },
    {
        id: 'todo-3',
        title: '월간 부서 보고서 제출',
        dueDate: '2024-06-27',
        priority: 'high',
        isCompleted: true,
    },
    {
        id: 'todo-4',
        title: '거래처 미팅 일정 확인',
        dueDate: '2024-06-26',
        priority: 'low',
        isCompleted: true,
    },
];

// [TRISID] 실제 서비스 데이터만 남기고, 더미/샘플/임시 데이터는 모두 제거하였습니다.

export const teamMembersData: TeamMember[] = [
    {
        id: 1,
        name: '김철수',
        position: '대표이사',
        department: '경영지원',
        avatar: '/images/avatars/avatar-1.jpg',
        status: 'online',
        lastActive: null
    },
    // ... (나머지 teamMembers 데이터) ...
    {
        id: 2,
        name: '이영희',
        position: '이사',
        department: '영업',
        avatar: '/images/avatars/avatar-2.jpg',
        status: 'online',
        lastActive: null
    },
    {
        id: 5,
        name: '정수민',
        position: '과장',
        department: '마케팅',
        avatar: '/images/avatars/avatar-5.jpg',
        status: 'away',
        lastActive: '5분 전'
    },
    {
        id: 8,
        name: '한지민',
        position: '부장',
        department: '개발',
        avatar: '/images/avatars/avatar-8.jpg',
        status: 'offline',
        lastActive: '1시간 전'
    },
    {
        id: 11,
        name: '장미영',
        position: '부장',
        department: '인사',
        avatar: '/images/avatars/avatar-11.jpg',
        status: 'online',
        lastActive: null
    }
];

// [TRISID] 실제 서비스 프로젝트 통계 데이터 (컬러도 gray 계열로 통일)
export const projectStatsData: ProjectStat[] = [
    {
        name: '진행 중',
        count: 12,
        percentage: 60,
        color: 'bg-gray-700'
    },
    {
        name: '완료',
        count: 5,
        percentage: 25,
        color: 'bg-gray-500'
    },
    {
        name: '보류',
        count: 2,
        percentage: 10,
        color: 'bg-gray-400'
    },
    {
        name: '지연',
        count: 1,
        percentage: 5,
        color: 'bg-gray-600'
    },
];

export const quickLinksData: QuickLink[] = [
    {
        title: '공지사항',
        icon: BellRing,
        url: '/intranet/notices',
        description: '회사 공지 및 소식',
    },
    {
        title: '임직원 목록',
        icon: Users,
        url: '/intranet/members',
        description: '직원 정보 및 연락처',
    },
    {
        title: '문서함',
        icon: FileText,
        url: '/intranet/documents',
        description: '사내 공유 문서 보관함',
    },
    {
        title: '일정 관리',
        icon: Calendar,
        url: '/intranet/calendar',
        description: '회의 및 일정 관리',
    },
    {
        title: '프로젝트',
        icon: Briefcase,
        url: '/intranet/projects',
        description: '프로젝트 현황 및 관리',
    },
    {
        title: '메시지',
        icon: MessageSquare,
        url: '/intranet/messages',
        description: '직원 간 메시지 교환',
    },
];

export const eventsData: Event[] = [
    {
        id: '1',
        title: '경영 전략 회의',
        date: '2025-05-10',
        month: '5월',
        day: '10',
        time: '14:00 - 16:00',
        location: '대회의실',
        type: 'meeting'
    },
    // ... (나머지 events 데이터) ...
    {
        id: '2',
        title: '2분기 성과 보고 마감',
        date: '2025-05-15',
        month: '5월',
        day: '15',
        time: '18:00',
        type: 'deadline'
    },
    {
        id: '3',
        title: '신제품 개발팀 미팅',
        date: '2025-05-17',
        month: '5월',
        day: '17',
        time: '10:30 - 12:00',
        location: '소회의실 2',
        type: 'meeting'
    },
    {
        id: '4',
        title: '고객사 방문 - 현대기업',
        date: '2025-05-22',
        month: '5월',
        day: '22',
        time: '15:00 - 17:00',
        location: '외부',
        type: 'meeting'
    }
];

export const tasksData: Task[] = [
    {
        id: '1',
        title: '2분기 제품 판매 계획 작성',
        dueDate: '2025-05-15',
        completed: false,
        priority: 'high',
        assignees: [
            { name: '김직원', avatar: null },
            { name: '이과장', avatar: null }
        ]
    },
    // ... (나머지 tasks 데이터) ...
    {
        id: '2',
        title: '클라이언트 미팅 자료 준비',
        dueDate: '2025-05-09',
        completed: true,
        priority: 'medium',
        assignees: [
            { name: '김직원', avatar: null }
        ]
    },
    {
        id: '3',
        title: '신규 프로젝트 일정 수립',
        dueDate: '2025-05-12',
        completed: false,
        priority: 'medium',
        assignees: [
            { name: '박부장', avatar: null },
            { name: '김직원', avatar: null }
        ]
    },
    {
        id: '4',
        title: '품질관리 보고서 검토',
        dueDate: '2025-05-20',
        completed: false,
        priority: 'low',
        assignees: [
            { name: '김직원', avatar: null }
        ]
    }
]; 