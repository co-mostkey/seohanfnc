'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Users, FileText, Shield, Briefcase, BarChart3, Image as ImageIcon, Video, Megaphone } from 'lucide-react'; // Megaphone 아이콘 추가
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin', label: '대시보드', icon: Home },
        { href: '/admin/settings', label: '사이트 설정', icon: Settings },
        { href: '/admin/users', label: '사용자 관리', icon: Users },
        { href: '/admin/posts', label: '게시물 관리', icon: FileText },
        { href: '/admin/products', label: '제품 관리', icon: Briefcase },
        { href: '/admin/notices', label: '공지사항 관리', icon: BarChart3 },
        // 새로운 홍보자료 관리 메뉴 추가
        {
            href: '/admin/promotions',
            label: '홍보자료 관리',
            icon: Megaphone, // Megaphone 아이콘 사용
        },
        // 기존 인트라넷 메뉴 (필요시 경로 및 아이콘 수정)
        { href: '/admin/intranet', label: '인트라넷 관리', icon: Shield },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 p-4 space-y-4 shadow-lg flex flex-col">
            <div className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 py-4 border-b dark:border-gray-700">
                서한 F&C 관리자
            </div>
            <nav className="flex-grow">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                                    pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto pt-4 border-t dark:border-gray-700">
                <Link href="/" passHref legacyBehavior>
                    <a className="block text-center text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                        메인 페이지로 돌아가기
                    </a>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar; 