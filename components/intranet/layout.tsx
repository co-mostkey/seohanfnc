"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  User,
  Users,
  X,
  Clock
} from "lucide-react";

/**
 * 네비게이션 항목 타입 정의
 */
interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// 네비게이션 항목 정의
const navItems: NavItem[] = [
  {
    title: "대시보드",
    href: "/intranet",
    icon: <Home className="h-5 w-5 mr-3" />,
  },
  {
    title: "공지사항",
    href: "/intranet/notices",
    icon: <Bell className="h-5 w-5 mr-3" />,
  },
  {
    title: "문서함",
    href: "/intranet/documents",
    icon: <FileText className="h-5 w-5 mr-3" />,
  },
  {
    title: "일정",
    href: "/intranet/calendar",
    icon: <Calendar className="h-5 w-5 mr-3" />,
  },
  {
    title: "메시지",
    href: "/intranet/messages",
    icon: <MessageSquare className="h-5 w-5 mr-3" />,
  },
  {
    title: "직원목록",
    href: "/intranet/members",
    icon: <Users className="h-5 w-5 mr-3" />,
  },
  {
    title: "설정",
    href: "/intranet/settings",
    icon: <Settings className="h-5 w-5 mr-3" />,
  },
];

interface IntranetLayoutProps {
  children: React.ReactNode;
}

export default function IntranetLayout({ children }: IntranetLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white overflow-x-hidden">
      {/* 상단 헤더 */}
      <header className="bg-black/60 backdrop-blur-md border-b border-white/10 py-4 px-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-4 text-gray-300 hover:text-white focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              className="text-xl font-bold text-white flex items-center"
              href="/intranet/"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">서한에프앤씨</span>
              <span className="ml-2 text-gray-200">인트라넷</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* 알림 버튼 */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
              </button>

              {/* 알림 드롭다운 */}
              <div className="absolute right-0 mt-2 w-80 bg-black/80 border border-white/10 rounded-lg shadow-lg p-3 hidden group-hover:block backdrop-blur-md z-50">
                <h4 className="font-medium text-sm mb-2 pb-2 border-b border-white/10">최근 알림</h4>
                <div className="text-xs text-gray-300">
                  <div className="py-2 border-b border-white/10">
                    <p className="font-medium">2분기 경영성과 보고서 배포</p>
                    <p className="text-gray-400 mt-1">30분 전</p>
                  </div>
                  <div className="py-2">
                    <p className="font-medium">주간 개발 미팅 일정 변경</p>
                    <p className="text-gray-400 mt-1">1시간 전</p>
                  </div>
                </div>
                <a className="text-blue-400 text-xs block mt-2 text-right" href="/intranet/notifications/">모든 알림 보기</a>
              </div>
            </div>

            {/* 프로필 드롭다운 */}
            <div className="group relative">
              <button className="flex items-center gap-2 text-gray-200 hover:text-white">
                <div className="rounded-full bg-black/50 border border-white/20 p-1">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm hidden sm:inline">김직원</span>
              </button>

              {/* 프로필 드롭다운 */}
              <div className="absolute right-0 mt-2 w-48 bg-black/80 border border-white/10 rounded-lg shadow-lg p-3 hidden group-hover:block backdrop-blur-md z-50">
                <div className="border-b border-white/10 pb-2 mb-2">
                  <p className="font-medium text-sm">김직원</p>
                  <p className="text-xs text-gray-400">마케팅팀</p>
                </div>
                <ul className="text-sm">
                  <li className="py-1 hover:text-blue-400"><a className="block" href="/intranet/profile/">내 프로필</a></li>
                  <li className="py-1 hover:text-blue-400"><a className="block" href="/intranet/settings/">설정</a></li>
                  <li className="pt-1 mt-1 border-t border-white/10">
                    <a className="flex items-center gap-2 text-gray-400 hover:text-red-400" href="/">
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* 사이드바 */}
        <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-black/60 border-r border-white/10 transition-transform duration-300 ease-in-out backdrop-blur-md ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center lg:hidden">
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">메뉴</h2>
            <button
              type="button"
              className="text-gray-300 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 mt-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                placeholder="검색..."
                className="w-full bg-black/50 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30"
                type="text"
              />
            </div>
          </div>

          <nav className="px-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className={`flex items-center py-2.5 px-3 rounded-md text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 ${pathname === item.href ? 'bg-white/10 text-white' : ''}`}
                    href={item.href}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-4 border-t border-white/10">
              <div className="px-3 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">최근 알림</h3>
              </div>
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-md p-3 text-xs mb-2">
                <div className="flex items-center mb-1 text-blue-300">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>30분 전</span>
                </div>
                <p className="text-white">2분기 경영성과 보고서가 배포되었습니다.</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen relative overflow-x-hidden">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
