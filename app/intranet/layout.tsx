'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Calendar,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
  LogOut,
  User,
  Search,
  BarChart3,
  FileBarChart,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle2,
  Shield,
  UserCog
} from 'lucide-react';

// 인트라넷 레이아웃 컴포넌트
export default function IntranetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 사용자 정보 가져오기 (실제로는 API 호출)
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/intranet/user/current');
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.user);
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const isActive = (path: string) => {
    // 홈(대시보드)의 경우 정확히 '/intranet' 경로일 때만 활성화
    if (path === '/intranet') {
      return pathname === '/intranet';
    }
    // 다른 메뉴는 현재 경로가 해당 경로로 시작할 때 활성화
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const isAdmin = userInfo?.role === '인트라넷관리자';

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white overflow-x-hidden">
      {/* 상단 내비게이션 바 */}
      <header className="bg-black/70 backdrop-blur-md border-b border-orange-900/30 py-3 px-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-4 text-gray-300 hover:text-orange-300 focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/intranet"
              className="text-xl font-bold text-white flex items-center"
            >
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">서한에프앤씨</span>
              <span className="ml-2 text-orange-100">인트라넷</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="text-gray-300 hover:text-orange-300 p-1.5 rounded-full hover:bg-orange-800/20 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-red-500 rounded-full h-2 w-2"></span>
              </button>
              <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 border border-orange-900/30 rounded-lg shadow-lg p-3 hidden group-hover:block backdrop-blur-md z-50">
                <h4 className="font-medium text-sm mb-2 pb-2 border-b border-orange-800/30 text-orange-100">최근 알림</h4>
                <div className="text-xs text-gray-300">
                  <div className="py-2 border-b border-orange-800/20">
                    <p className="font-medium text-white">2분기 경영성과 보고서 배포</p>
                    <p className="text-gray-400 mt-1">30분 전</p>
                  </div>
                  <div className="py-2">
                    <p className="font-medium text-white">주간 개발 미팅 일정 변경</p>
                    <p className="text-gray-400 mt-1">1시간 전</p>
                  </div>
                </div>
                <Link href="/intranet/notifications" className="text-orange-400 hover:text-orange-300 text-xs block mt-2 text-right">
                  모든 알림 보기
                </Link>
              </div>
            </div>
            <div className="group relative">
              <button className="flex items-center gap-2 text-gray-200 hover:text-orange-200">
                <div className="rounded-full bg-orange-800/30 border border-orange-700/30 p-1">
                  <User className="h-5 w-5 text-orange-300" />
                </div>
                <span className="text-sm hidden sm:inline">{userInfo?.name || '사용자'}</span>
                {isAdmin && (
                  <Shield className="h-4 w-4 text-orange-400 ml-1" />
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 border border-orange-900/30 rounded-lg shadow-lg p-3 hidden group-hover:block backdrop-blur-md z-50">
                <div className="border-b border-orange-800/30 pb-2 mb-2">
                  <p className="font-medium text-sm text-white">{userInfo?.name || '사용자'}</p>
                  <p className="text-xs text-gray-400">{userInfo?.department || '부서'}</p>
                  {isAdmin && (
                    <span className="text-xs text-orange-400 flex items-center mt-1">
                      <Shield className="h-3 w-3 mr-1" />
                      인트라넷 관리자
                    </span>
                  )}
                </div>
                <ul className="text-sm">
                  <li className="py-1 hover:text-orange-400">
                    <Link href="/intranet/profile" className="block">내 프로필</Link>
                  </li>
                  <li className="py-1 hover:text-orange-400">
                    <Link href="/intranet/settings" className="block">설정</Link>
                  </li>
                  <li className="pt-1 mt-1 border-t border-orange-800/30">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-gray-400 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* 사이드바 */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed z-40 inset-y-0 left-0 w-64 bg-gray-900/95 border-r border-orange-900/30 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 backdrop-blur-md`}
        >
          <div className="p-4 border-b border-orange-800/30 flex justify-between items-center lg:hidden">
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">메뉴</h2>
            <button
              type="button"
              className="text-gray-300 hover:text-orange-300"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 mt-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="w-full bg-gray-800/70 border border-orange-800/30 rounded-md py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-orange-700/50 focus:ring-1 focus:ring-orange-700/30"
              />
            </div>
          </div>
          <nav className="px-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/intranet"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet') && !pathname?.includes('/intranet/')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <Home className={`h-5 w-5 mr-3 ${isActive('/intranet') && !pathname?.includes('/intranet/') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>대시보드</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/notices"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/notices')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <Bell className={`h-5 w-5 mr-3 ${isActive('/intranet/notices') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>공지사항</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/documents"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/documents')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <FileText className={`h-5 w-5 mr-3 ${isActive('/intranet/documents') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>문서함</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/calendar"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/calendar')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <Calendar className={`h-5 w-5 mr-3 ${isActive('/intranet/calendar') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>일정</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/messages"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/messages')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <MessageSquare className={`h-5 w-5 mr-3 ${isActive('/intranet/messages') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>메시지</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/members"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/members')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <Users className={`h-5 w-5 mr-3 ${isActive('/intranet/members') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>직원목록</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/projects"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/projects')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <FileBarChart className={`h-5 w-5 mr-3 ${isActive('/intranet/projects') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>프로젝트</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/intranet/settings"
                  className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/settings')
                    ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    } transition-all duration-200`}
                >
                  <Settings className={`h-5 w-5 mr-3 ${isActive('/intranet/settings') ? 'text-orange-300' : 'text-gray-400'}`} />
                  <span>설정</span>
                </Link>
              </li>
            </ul>

            {/* 관리자 메뉴 */}
            {isAdmin && (
              <>
                <div className="mt-8 pt-4 border-t border-orange-800/30">
                  <div className="px-3 pb-2">
                    <h4 className="text-xs uppercase text-orange-500 font-semibold tracking-wider flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      관리자 메뉴
                    </h4>
                  </div>
                  <ul className="space-y-1 mt-2">
                    <li>
                      <Link
                        href="/intranet/admin/users"
                        className={`flex items-center py-2.5 px-3 rounded-md ${isActive('/intranet/admin/users')
                          ? 'bg-orange-800/30 border border-orange-700/30 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          } transition-all duration-200`}
                      >
                        <UserCog className={`h-5 w-5 mr-3 ${isActive('/intranet/admin/users') ? 'text-orange-300' : 'text-gray-400'}`} />
                        <span>사용자 관리</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* 추가 정보 */}
            <div className="mt-10 pt-4 border-t border-orange-800/30">
              <div className="px-3 pb-2">
                <h4 className="text-xs uppercase text-orange-500 font-semibold tracking-wider">주요 통계</h4>
              </div>
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-800/30 rounded-md cursor-pointer group">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-orange-500 group-hover:text-orange-400" />
                    <span className="text-gray-300 group-hover:text-white">프로젝트 진행률</span>
                  </div>
                  <span className="text-orange-400 group-hover:text-orange-300">68%</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-800/30 rounded-md cursor-pointer group">
                  <div className="flex items-center">
                    <PieChart className="h-4 w-4 mr-2 text-orange-500 group-hover:text-orange-400" />
                    <span className="text-gray-300 group-hover:text-white">월간 달성률</span>
                  </div>
                  <span className="text-orange-400 group-hover:text-orange-300">75%</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-800/30 rounded-md cursor-pointer group">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-orange-500 group-hover:text-orange-400" />
                    <span className="text-gray-300 group-hover:text-white">업무 처리량</span>
                  </div>
                  <span className="text-orange-400 group-hover:text-orange-300">+12%</span>
                </div>
              </div>
            </div>

            {/* 처리해야 할 작업 */}
            <div className="mt-6 pt-4 border-t border-orange-800/30">
              <div className="px-3 pb-2 flex justify-between items-center">
                <h4 className="text-xs uppercase text-orange-500 font-semibold tracking-wider">오늘 일정</h4>
                <Link href="/intranet/tasks" className="text-xs text-orange-400 hover:text-orange-300">모두 보기</Link>
              </div>
              <div className="space-y-2 mt-2">
                <div className="px-3 py-2 hover:bg-gray-800/30 rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-sm text-white">주간 회의</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span>오후 2:00</span>
                    <span className="mx-2">•</span>
                    <span>회의실 A</span>
                  </div>
                </div>
                <div className="px-3 py-2 hover:bg-gray-800/30 rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm text-white">보고서 제출</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span>오후 5:00</span>
                    <span className="mx-2">•</span>
                    <span>마감임박</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* 푸터 정보 */}
          <div className="mt-auto p-4 border-t border-orange-800/30 text-gray-400 text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>시스템 정상 작동 중</span>
            </div>
            <Link href="/intranet/help" className="mt-2 hover:text-orange-400 block">도움말 및 문의</Link>
            <p className="mt-1">© 2024 서한에프앤씨</p>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
      {/* 모바일용 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
