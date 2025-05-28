"use client";

import React, { useState, useEffect } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ExternalLink,
    User,
    ChevronDown,
    Menu,
    Home,
    Package,
    FileText,
    Settings,
    Users,
    Mail,
    BarChart2,
    Layers,
    Info,
    Search,
    Database,
    List,
    FolderOpen,
    LogOut,
    FileImage
} from "lucide-react";
import { ADMIN_UI, ADMIN_FONT_STYLES } from "@/lib/admin-ui-constants";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 폰트 설정 - 메인 홈페이지와 일치
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

// 관리자 사이드바 및 상단 메뉴 아이템
const mainNavItems = [
    { id: 'dashboard', name: '대시보드', icon: Home, path: '/admin' },
    { id: 'products', name: '제품 관리', icon: Package, path: '/admin/products' },
    { id: 'promotional-materials', name: '홍보자료 관리', icon: FileImage, path: '/admin/promotional-materials' },
    { id: 'documents', name: '자료실', icon: FolderOpen, path: '/admin/documents' },
    { id: 'notices', name: '공지사항', icon: FileText, path: '/admin/notices' },
    { id: 'inquiries', name: '문의', icon: Mail, path: '/admin/inquiries', badge: 5 },
    { id: 'users', name: '사용자', icon: Users, path: '/admin/users' },
    { id: 'statistics', name: '통계', icon: BarChart2, path: '/admin/statistics' },
];

const settingsSubMenuItems = [
    { id: 'company', name: '회사 정보', icon: Info, path: '/admin/company' },
    { id: 'menus', name: '메뉴 관리', icon: Layers, path: '/admin/menus' },
    { id: 'research_settings', name: '연구개발 설정', icon: FileText, path: '/admin/research' },
    { id: 'terms', name: '약관 관리', icon: FileText, path: '/admin/terms' },
    { id: 'design', name: '디자인 관리', icon: Settings, path: '/admin/design' },
    { id: 'settings_general', name: '일반 설정', icon: Settings, path: '/admin/settings', badge: 1 },
    { id: 'backups', name: '백업 관리', icon: Database, path: '/admin/backups' },
    { id: 'logs', name: '로그 관리', icon: List, path: '/admin/logs' }
];

// 모바일 사이드바용 전체 메뉴
const allSidebarMenuItems = [
    ...mainNavItems,
    ...settingsSubMenuItems
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    // 세션 검증
    useEffect(() => {
        const validateSession = async () => {
            try {
                console.log('[AdminLayout] 세션 검증 시작');

                const response = await fetch('/api/auth/validate', {
                    method: 'POST',
                    credentials: 'include',
                });

                const result = await response.json();
                console.log('[AdminLayout] 세션 검증 결과:', result);

                if (result.success && result.user) {
                    setIsAuthenticated(true);
                    setUserInfo(result.user);
                    console.log('[AdminLayout] 인증 성공, 관리자 페이지 로드');
                } else {
                    console.log('[AdminLayout] 인증 실패, 관리자 로그인 페이지로 리다이렉트');
                    router.replace('/admin/login');
                    return;
                }
            } catch (error) {
                console.error('[AdminLayout] 세션 검증 오류:', error);
                router.replace('/admin/login');
                return;
            } finally {
                setIsLoading(false);
            }
        };

        validateSession();
    }, [router]);

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            console.log('[AdminLayout] 로그아웃 시작');

            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('[AdminLayout] 로그아웃 성공');
                // localStorage 정리
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('userRole');
                }
                // 관리자 로그인 페이지로 리다이렉트
                router.replace('/admin/login');
            } else {
                console.error('[AdminLayout] 로그아웃 실패');
                // 실패해도 관리자 로그인 페이지로 이동
                router.replace('/admin/login');
            }
        } catch (error) {
            console.error('[AdminLayout] 로그아웃 오류:', error);
            // 오류 발생해도 관리자 로그인 페이지로 이동
            router.replace('/admin/login');
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const isActive = (path: string) => {
        // 대시보드의 경우 정확히 '/admin' 경로일 때만 활성화
        if (path === '/admin') {
            return currentPath === '/admin';
        }
        // 다른 메뉴는 현재 경로가 해당 경로로 시작할 때 활성화
        return currentPath === path || currentPath.startsWith(path + '/');
    };

    // 로딩 중일 때 표시할 컴포넌트
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-gray-600 dark:text-gray-400">관리자 페이지 로딩 중...</p>
                </div>
            </div>
        );
    }

    // 인증되지 않은 경우 빈 화면 (리다이렉트 처리 중)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={`dark min-h-screen flex flex-col ${ADMIN_UI.BG_PRIMARY} ${ADMIN_UI.TEXT_PRIMARY} ${inter.variable} ${playfair.variable} font-sans`}
            style={{ fontFamily: 'var(--font-inter)' }}>
            <header className="bg-gray-900 border-b border-gray-800 shadow-lg sticky top-0 z-20">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button onClick={toggleSidebar} className="mr-3 md:hidden p-1.5 rounded-md hover:bg-orange-800/20 text-gray-300">
                                <Menu className="h-5 w-5 text-orange-300" />
                            </button>
                            <Link href="/admin" className="mr-6 flex items-center" >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
                                    alt="서한에프앤씨"
                                    width={120}
                                    height={30}
                                    className="h-8 w-auto"
                                />
                            </Link>

                            <div className="hidden md:flex items-center space-x-2">
                                {mainNavItems.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.path}
                                            className={cn(
                                                "px-3 py-2 text-sm rounded-md transition-all flex items-center whitespace-nowrap",
                                                active
                                                    ? "bg-orange-800/30 text-orange-200 font-medium shadow-sm border-b-2 border-orange-500"
                                                    : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                                            )}
                                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                                        >
                                            <item.icon className={`mr-2 h-4 w-4 flex-shrink-0 ${active ? 'text-orange-300' : 'text-gray-400'}`} />
                                            <span>{item.name}</span>
                                            {item.badge && (
                                                <span className={`ml-1.5 py-0.5 px-1.5 text-xs font-medium rounded-full ${active ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="px-3 py-2 text-sm rounded-md flex items-center whitespace-nowrap text-gray-300 hover:text-white hover:bg-gray-800/70"
                                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                                        >
                                            <Settings className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                            <span>추가 설정</span>
                                            <ChevronDown className="ml-1 h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700 shadow-lg rounded-md overflow-hidden min-w-[220px]">
                                        <DropdownMenuLabel className="text-gray-400 text-xs px-3 py-2 border-b border-gray-700" style={ADMIN_FONT_STYLES.MENU_ITEM}>사이트 설정</DropdownMenuLabel>
                                        {settingsSubMenuItems.map((subItem) => {
                                            const active = isActive(subItem.path);
                                            return (
                                                <DropdownMenuItem key={subItem.id} asChild className={cn(
                                                    "px-3 py-2.5 transition-colors",
                                                    active
                                                        ? "bg-orange-800/30 text-orange-200"
                                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                                )} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                                                    <Link href={subItem.path} className="flex items-center w-full" >
                                                        <subItem.icon className={`mr-2 h-4 w-4 ${active ? 'text-orange-300' : 'text-gray-400'}`} />
                                                        {subItem.name}
                                                        {subItem.badge && (
                                                            <span className={`ml-auto py-0.5 px-1.5 text-xs font-medium rounded-full ${active ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                                {subItem.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/admin/search"
                                className="p-2 rounded-md text-gray-400 hover:text-orange-300 hover:bg-orange-800/20 transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/"
                                className="px-3 py-1.5 border border-orange-600 bg-orange-800/30 hover:bg-orange-700 rounded-md text-sm font-medium transition-colors flex items-center text-orange-200"
                                target="_blank"
                                style={ADMIN_FONT_STYLES.BUTTON}
                            >
                                사이트 보기
                                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                            </Link>
                            <div className="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center text-sm font-medium bg-orange-800/20 hover:bg-orange-800/40 text-orange-200 rounded-full p-1.5 px-3 transition-colors"
                                            style={ADMIN_FONT_STYLES.BUTTON}>
                                            <User className="h-4 w-4 mr-1.5 text-orange-300" />
                                            <span className="mr-1">{userInfo?.name || userInfo?.username || '관리자'}</span>
                                            <ChevronDown className="h-3.5 w-3.5 text-orange-400" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700 shadow-lg rounded-md overflow-hidden min-w-[180px]">
                                        <DropdownMenuLabel className="text-gray-400 text-xs px-3 py-2 border-b border-gray-700" style={ADMIN_FONT_STYLES.MENU_ITEM}>계정</DropdownMenuLabel>
                                        <DropdownMenuItem asChild className="px-3 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" style={ADMIN_FONT_STYLES.MENU_ITEM}>
                                            <Link
                                                href="/admin/settings/profile"
                                                className="flex items-center w-full"
                                            >
                                                <User className="mr-2 h-4 w-4 text-gray-400" /> 프로필 설정
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout} className="px-3 py-2.5 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors" style={ADMIN_FONT_STYLES.MENU_ITEM}>
                                            <LogOut className="mr-2 h-4 w-4 text-red-400" /> 로그아웃
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside
                    className={`bg-gray-900 border-r border-gray-800 w-64 flex-shrink-0 fixed md:hidden top-0 h-full z-10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out mt-14`}
                >
                    <div className="p-3">
                        <nav className="space-y-1">
                            {allSidebarMenuItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        className={cn(
                                            "flex items-center px-3 py-2.5 text-sm rounded-md transition-all",
                                            active
                                                ? "bg-orange-800/30 text-orange-200 font-medium shadow-sm border-l-2 border-orange-500"
                                                : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                                        )}
                                        style={ADMIN_FONT_STYLES.MENU_ITEM}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className={`mr-3 h-5 w-5 ${active ? 'text-orange-300' : 'text-gray-400'}`} />
                                        <span>{item.name}</span>
                                        {item.badge && (
                                            <span className={`ml-auto py-0.5 px-2 text-xs font-medium rounded-full ${active ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                <main className="flex-1 container mx-auto px-4 py-6 overflow-auto">
                    {children}
                </main>
            </div>
            <footer className="bg-gray-900 border-t border-gray-800 py-4 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                    © {new Date().getFullYear()} 서한에프앤씨 관리자 시스템
                </div>
            </footer>
        </div>
    );
}