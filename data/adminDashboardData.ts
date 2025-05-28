import { Package, Users, FileText, Settings, Mail, BarChart2, Layers, Grid, Calendar, Info, LucideIcon } from 'lucide-react';

export interface ActivityItem {
    id: number;
    action: string;
    description: string;
    timestamp: string;
    user: string;
    status: string;
    type?: 'product' | 'post' | 'inquiry' | 'user' | 'system' | 'other';
    related?: {
        id?: string;
        title?: string;
        url?: string;
    };
    actionUrl?: string;
}

export interface StatItem {
    id: number;
    title: string;
    count: number;
    icon: LucideIcon;
    color: string;
    path: string;
}

export interface AdminMenuItem {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    path: string;
    color: string;
    badgeCount?: number;
    badgeColor?: string;
}

export const recentActivities: ActivityItem[] = [
    {
        id: 1,
        action: '제품 추가',
        description: 'EVOLT S80 - 고전압 테스터 제품이 추가되었습니다.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10분 전
        user: '관리자',
        status: 'success',
        type: 'product',
        related: {
            id: 'EVOLT-S80',
            title: 'EVOLT S80 - 고전압 테스터',
            url: '/admin/products/edit/EVOLT-S80'
        }
    },
    {
        id: 2,
        action: '제품 수정',
        description: 'VoltMaster 5000 - 제품 정보가 수정되었습니다.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
        user: '관리자',
        status: 'success',
        type: 'product',
        related: {
            id: 'VoltMaster-5000',
            title: 'VoltMaster 5000',
            url: '/admin/products/edit/VoltMaster-5000'
        }
    },
    {
        id: 3,
        action: '문의 접수',
        description: '신규 제품 문의가 접수되었습니다.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        user: '김철수',
        status: 'pending',
        type: 'inquiry',
        related: {
            id: 'inq-20250523-001',
            title: '신규 제품 문의',
            url: '/admin/inquiries/inq-20250523-001'
        },
        actionUrl: '/admin/inquiries'
    },
    {
        id: 4,
        action: '공지사항 추가',
        description: '신제품 출시 안내 공지사항이 게시되었습니다.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
        user: '관리자',
        status: 'success',
        type: 'other',
        related: {
            id: 'notice-20250523-001',
            title: '신제품 출시 안내',
            url: '/admin/notices'
        }
    },
    {
        id: 5,
        action: '시스템 알림',
        description: '백업이 성공적으로 완료되었습니다.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
        user: '시스템',
        status: 'success',
        type: 'system'
    },
    {
        id: 6,
        action: '문의 접수',
        description: '제품 견적 요청이 접수되었습니다.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
        user: '박지민',
        status: 'pending',
        type: 'inquiry',
        related: {
            id: 'inq-20250523-002',
            title: '제품 견적 요청',
            url: '/admin/inquiries/inq-20250523-002'
        },
        actionUrl: '/admin/inquiries'
    },
    {
        id: 7,
        action: '회원 가입',
        description: '새로운 회원이 가입했습니다.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
        user: '홍길동',
        status: 'info',
        type: 'user',
        related: {
            id: 'user-2025052301',
            title: '홍길동',
            url: '/admin/users/user-2025052301'
        }
    }
];

export const statsData: StatItem[] = [
    { id: 1, title: '제품', count: 15, icon: Package, color: 'bg-orange-500', path: '/admin/products' },
    { id: 2, title: '공지사항', count: 4, icon: FileText, color: 'bg-amber-500', path: '/admin/notices' },
    { id: 3, title: '문의', count: 3, icon: Mail, color: 'bg-orange-500', path: '/admin/inquiries' },
    { id: 4, title: '회원', count: 3, icon: Users, color: 'bg-amber-500', path: '/admin/users' }
];

export const adminMenus: AdminMenuItem[] = [
    { id: 1, title: '제품 관리', description: '제품 정보 등록 및 관리', icon: Package, path: '/admin/products', color: 'bg-orange-500' },
    { id: 2, title: '공지사항 관리', description: '사이트 공지사항 작성 및 관리', icon: FileText, path: '/admin/notices', color: 'bg-amber-500' },
    { id: 3, title: '문의 관리', description: '고객 문의 확인 및 응답', icon: Mail, path: '/admin/inquiries', color: 'bg-orange-500', badgeCount: 5, badgeColor: 'bg-orange-500' },
    { id: 4, title: '통계', description: '방문자 통계 및 분석', icon: BarChart2, path: '/admin/statistics', color: 'bg-amber-500' },
    { id: 5, title: '회사 정보', description: '회사 정보 및 연락처 관리', icon: Info, path: '/admin/company', color: 'bg-orange-500' },
    { id: 6, title: '메뉴 관리', description: '사이트 메뉴 구조 관리', icon: Layers, path: '/admin/menus', color: 'bg-amber-500' },
    { id: 7, title: '디자인 관리', description: '사이트 디자인 및 레이아웃 관리', icon: Grid, path: '/admin/design', color: 'bg-orange-500' },
    { id: 8, title: '시스템 설정', description: '시스템 환경 설정', icon: Settings, path: '/admin/settings', color: 'bg-gray-500', badgeCount: 1, badgeColor: 'bg-amber-500' }
]; 