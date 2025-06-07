"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    FileText,
    Calendar,
    Users,
    MessageSquare,
    Briefcase,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User,
    ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// 네비게이션 아이템
const navItems = [
    { id: 'dashboard', name: '대시보드', icon: Home, path: '/intranet/dashboard' },
    { id: 'notices', name: '공지사항', icon: Bell, path: '/intranet/notices' },
    { id: 'documents', name: '자료실', icon: FileText, path: '/intranet/documents' },
    { id: 'calendar', name: '일정관리', icon: Calendar, path: '/intranet/calendar' },
    { id: 'projects', name: '프로젝트', icon: Briefcase, path: '/intranet/projects' },
    { id: 'approvals', name: '결재', icon: ClipboardCheck, path: '/intranet/approvals' },
    { id: 'messages', name: '메시지', icon: MessageSquare, path: '/intranet/messages' },
    { id: 'employees', name: '직원목록', icon: Users, path: '/intranet/employees' },
];

export default function IntranetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 로그인/등록 페이지인지 확인
    const isAuthPage = pathname === '/intranet/login' || pathname === '/intranet/register';

    // 인증 체크
    useEffect(() => {
        // 로그인/등록 페이지에서는 인증 체크 건너뛰기
        if (isAuthPage) {
            setIsLoading(false);
            return;
        }

        const verifySession = async () => {
            try {
                const response = await fetch('/api/auth/intranet-verify', {
                    method: 'POST',
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.success && result.user) {
                    setIsAuthenticated(true);
                    setUserInfo(result.user);
                } else {
                    router.replace('/intranet/login');
                }
            } catch (error) {
                console.error('인트라넷 인증 확인 오류:', error);
                router.replace('/intranet/login');
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [router, isAuthPage, pathname]);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/intranet-logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                router.replace('/intranet/login');
            }
        } catch (error) {
            console.error('로그아웃 오류:', error);
            router.replace('/intranet/login');
        }
    };

    const isActive = (path: string) => {
        if (path === '/intranet/dashboard' && pathname === '/intranet') {
            return true;
        }
        return pathname === path || pathname.startsWith(path + '/');
    };

    // 로그인/등록 페이지는 레이아웃 없이 children만 렌더링
    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-gray-900">
                <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
                <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
                <div className="relative">
                    {children}
                </div>
            </div>
        );
    }

    // 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400">인트라넷 로딩 중...</p>
                </div>
            </div>
        );
    }

    // 인증되지 않은 경우
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* 배경 그라데이션 */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
            <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

            {/* 헤더 */}
            <header className="relative bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* 로고 & 타이틀 */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                            >
                                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                            <Link href="/intranet" className="flex items-center space-x-3">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
                                    alt="서한F&C"
                                    width={100}
                                    height={30}
                                    className="h-8 w-auto"
                                />
                                <span className="text-lg font-semibold text-blue-400">인트라넷</span>
                            </Link>
                        </div>

                        {/* 데스크톱 네비게이션 */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.path}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* 사용자 메뉴 */}
                        <div className="flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline">{userInfo?.name || userInfo?.username}</span>
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                                    <DropdownMenuLabel className="text-gray-400">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium text-white">{userInfo?.name}</p>
                                            <p className="text-xs text-gray-400">{userInfo?.department} · {userInfo?.position}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem asChild>
                                        <Link href="/intranet/profile" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                                            <User className="h-4 w-4" />
                                            <span>프로필</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/intranet/settings" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                                            <Settings className="h-4 w-4" />
                                            <span>설정</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-red-400 hover:text-red-300"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>로그아웃</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* 모바일 사이드바 */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)} />
                    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 shadow-xl">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">메뉴</h2>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* 메인 콘텐츠 */}
            <main className="relative container mx-auto px-4 py-6 min-h-[calc(100vh-4rem)]">
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
} 