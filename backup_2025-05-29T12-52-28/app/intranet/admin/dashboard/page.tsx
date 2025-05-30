'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  FileText,
  Settings,
  Calendar,
  BarChart3,
  Shield,
  Bell,
  MessageSquare,
  Menu,
  ChevronRight,
  Activity,
  UserPlus,
  FileUp,
  Key,
  Database,
  Cloud,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

// 대시보드 카드 컴포넌트
const StatCard = ({ title, value, icon, change, color }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: { value: number; label: string; };
  color: string
}) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold text-white mt-1">{value}</h3>
        <div className={`flex items-center mt-2 text-sm ${change.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span className="flex items-center">
            {change.value >= 0 ?
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg> :
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            }
            {Math.abs(change.value)}% {change.label}
          </span>
        </div>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // 관리자 메뉴 항목
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'users', label: '사용자 관리', icon: <Users className="h-5 w-5" /> },
    { id: 'documents', label: '문서 관리', icon: <FileText className="h-5 w-5" /> },
    { id: 'notifications', label: '알림 관리', icon: <Bell className="h-5 w-5" /> },
    { id: 'api', label: 'API 설정', icon: <Cloud className="h-5 w-5" /> },
    { id: 'security', label: '보안 설정', icon: <Shield className="h-5 w-5" /> },
    { id: 'system', label: '시스템 설정', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* 사이드바 */}
      <div className="hidden md:flex w-64 flex-col bg-gray-800">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">관리자 콘솔</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-3 py-2.5 text-left rounded-md ${activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/intranet/dashboard"
            className="flex items-center text-red-400 hover:text-red-300"
          >
            <span className="mr-2">←</span>
            인트라넷으로 돌아가기
          </Link>
        </div>
      </div>
      {/* 모바일 메뉴 */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-10 bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">관리자 콘솔</h2>
          <Menu className="h-6 w-6 text-gray-300" />
        </div>
      </div>
      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 md:ml-64 mt-14 md:mt-0">
        {/* 대시보드 */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-white">대시보드</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">최종 업데이트: 2분 전</span>
                <button className="p-2 rounded-md hover:bg-gray-800">
                  <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="활성 사용자"
                value="168"
                icon={<Users className="h-6 w-6 text-white" />}
                change={{ value: 12, label: "증가" }}
                color="bg-blue-600/20"
              />
              <StatCard
                title="문서 생성"
                value="856"
                icon={<FileText className="h-6 w-6 text-white" />}
                change={{ value: 8, label: "증가" }}
                color="bg-green-600/20"
              />
              <StatCard
                title="일정 등록"
                value="93"
                icon={<Calendar className="h-6 w-6 text-white" />}
                change={{ value: -2, label: "감소" }}
                color="bg-purple-600/20"
              />
              <StatCard
                title="시스템 알림"
                value="24"
                icon={<Bell className="h-6 w-6 text-white" />}
                change={{ value: 5, label: "증가" }}
                color="bg-red-600/20"
              />
            </div>

            {/* 활동 차트 및 최근 활동 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-white">시스템 사용 분석</h2>

                  <select className="bg-gray-700 border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-1.5">
                    <option>최근 7일</option>
                    <option>최근 30일</option>
                    <option>최근 90일</option>
                  </select>
                </div>

                {/* 차트 대신 샘플 UI */}
                <div className="h-64 flex flex-col justify-center items-center">
                  <Activity className="h-12 w-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm">
                    차트 라이브러리를 통해 실제 사용 데이터 시각화가 표시됩니다.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">로그인</p>
                    <p className="text-xl font-medium text-white">218</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">문서 조회</p>
                    <p className="text-xl font-medium text-white">1,432</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">검색</p>
                    <p className="text-xl font-medium text-white">652</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">파일 업로드</p>
                    <p className="text-xl font-medium text-white">124</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-medium text-white mb-6">최근 활동</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-blue-600/20 p-2 mr-3">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">새 사용자 등록</p>
                      <p className="text-sm text-gray-400">김지훈님이 새로 등록되었습니다.</p>
                      <p className="text-xs text-gray-500 mt-1">12분 전</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-green-600/20 p-2 mr-3">
                      <FileUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">문서 업로드</p>
                      <p className="text-sm text-gray-400">경영지원팀에서 새 문서를 업로드했습니다.</p>
                      <p className="text-xs text-gray-500 mt-1">45분 전</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-yellow-600/20 p-2 mr-3">
                      <Cloud className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">API 키 생성</p>
                      <p className="text-sm text-gray-400">Google 캘린더 연동을 위한 API 키가 생성되었습니다.</p>
                      <p className="text-xs text-gray-500 mt-1">1시간 전</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-red-600/20 p-2 mr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">시스템 경고</p>
                      <p className="text-sm text-gray-400">스토리지 사용량이 80%를 초과했습니다.</p>
                      <p className="text-xs text-gray-500 mt-1">3시간 전</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API 설정 */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-white">API 설정</h1>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                새 API 키 생성
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-medium text-white mb-4">외부 서비스 연동</h2>
                <p className="text-gray-400 mb-6">
                  외부 서비스와 인트라넷을 연동하여 데이터를 주고받을 수 있습니다.
                </p>

                {/* 구글 캘린더 연동 */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Image
                          src="/images/logos/google-calendar.svg"
                          alt="Google Calendar"
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Google 캘린더</h3>
                        <p className="text-sm text-gray-400">사내 일정과 개인 Google 캘린더를 동기화합니다</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                        활성화됨
                      </span>
                      <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm">
                        설정
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-750 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        클라이언트 ID
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value="123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
                          className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-l-md px-3 py-2"
                          readOnly
                        />
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-r-md">
                          복사
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        클라이언트 시크릿
                      </label>
                      <div className="flex">
                        <input
                          type="password"
                          value="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-l-md px-3 py-2"
                          readOnly
                        />
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-r-md">
                          복사
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        리디렉션 URI
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value="https://seohanfnc.com/api/auth/callback/google"
                          className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-l-md px-3 py-2"
                          readOnly
                        />
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-r-md">
                          복사
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
                          checked
                        />
                        <span className="ml-2 text-sm text-gray-300">양방향 동기화 (사내 일정 ↔ Google 캘린더)</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button className="px-3 py-1.5 border border-gray-600 text-gray-300 hover:text-white rounded-md text-sm">
                        연결 재설정
                      </button>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                        변경사항 저장
                      </button>
                    </div>
                  </div>
                </div>

                {/* 다른 API 연동 (접힌 상태) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between py-4 cursor-pointer">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Image
                          src="/images/logos/microsoft-365.svg"
                          alt="Microsoft 365"
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Microsoft 365</h3>
                        <p className="text-sm text-gray-400">Microsoft Teams, Outlook과 연동</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                        비활성화
                      </span>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between py-4 cursor-pointer">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Image
                          src="/images/logos/slack.svg"
                          alt="Slack"
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Slack</h3>
                        <p className="text-sm text-gray-400">Slack 메시지와 알림 연동</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                        비활성화
                      </span>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-medium text-white mb-4">API 키 관리</h2>
                <p className="text-gray-400 mb-6">
                  서한에프앤씨 API에 접근하기 위한 키를 관리합니다.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">이름</th>
                        <th scope="col" className="px-6 py-3">API 키</th>
                        <th scope="col" className="px-6 py-3">생성일</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                        <th scope="col" className="px-6 py-3">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">프론트엔드 앱</td>
                        <td className="px-6 py-4 text-gray-300">sk_live_*************K8c2</td>
                        <td className="px-6 py-4 text-gray-300">2024-05-10</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            활성화
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white">
                            <Key className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">모바일 앱</td>
                        <td className="px-6 py-4 text-gray-300">sk_live_*************F3p7</td>
                        <td className="px-6 py-4 text-gray-300">2024-03-22</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            활성화
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white">
                            <Key className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-white">테스트 환경</td>
                        <td className="px-6 py-4 text-gray-300">sk_test_************Xz9b</td>
                        <td className="px-6 py-4 text-gray-300">2024-01-15</td>
                        <td className="px-6 py-4">
                          <span className="bg-yellow-900 text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            테스트
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white">
                            <Key className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 사용자 관리 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-white">사용자 관리</h1>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                사용자 추가
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-white mb-4 sm:mb-0">
                    사용자 목록
                  </h2>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="search"
                        placeholder="이름 또는 이메일 검색..."
                        className="block w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <select className="bg-gray-700 border-gray-600 text-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">부서 필터</option>
                      <option value="all">전체 부서</option>
                      <option value="management">경영지원</option>
                      <option value="sales">영업</option>
                      <option value="development">개발</option>
                      <option value="marketing">마케팅</option>
                    </select>

                    <select className="bg-gray-700 border-gray-600 text-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">역할 필터</option>
                      <option value="all">전체 역할</option>
                      <option value="admin">관리자</option>
                      <option value="user">일반 사용자</option>
                      <option value="guest">게스트</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">이름</th>
                        <th scope="col" className="px-6 py-3">이메일</th>
                        <th scope="col" className="px-6 py-3">부서</th>
                        <th scope="col" className="px-6 py-3">직책</th>
                        <th scope="col" className="px-6 py-3">역할</th>
                        <th scope="col" className="px-6 py-3">상태</th>
                        <th scope="col" className="px-6 py-3">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">
                          <div className="flex items-center">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                              <Image
                                src="/images/avatars/avatar-1.jpg"
                                alt="김철수"
                                fill
                                className="object-cover"
                              />
                            </div>
                            김철수
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">ceo@seohanfnc.com</td>
                        <td className="px-6 py-4 text-gray-300">경영지원</td>
                        <td className="px-6 py-4 text-gray-300">대표이사</td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-900 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            관리자
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            활성화
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white mr-2">
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="px-6 py-4 font-medium text-white">
                          <div className="flex items-center">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                              <Image
                                src="/images/avatars/avatar-2.jpg"
                                alt="이영희"
                                fill
                                className="object-cover"
                              />
                            </div>
                            이영희
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">yhlee@seohanfnc.com</td>
                        <td className="px-6 py-4 text-gray-300">영업</td>
                        <td className="px-6 py-4 text-gray-300">이사</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-900 text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            부관리자
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            활성화
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white mr-2">
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-white">
                          <div className="flex items-center">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                              <Image
                                src="/images/avatars/avatar-3.jpg"
                                alt="박지성"
                                fill
                                className="object-cover"
                              />
                            </div>
                            박지성
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">jspark@seohanfnc.com</td>
                        <td className="px-6 py-4 text-gray-300">영업</td>
                        <td className="px-6 py-4 text-gray-300">부장</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            일반사용자
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            활성화
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-white mr-2">
                            <Settings className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-400">
                    총 168명 중 1-10 표시
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md">이전</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md">2</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md">3</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md">다음</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 다른 탭들은 필요에 따라 구현 */}
        {activeTab !== 'dashboard' && activeTab !== 'api' && activeTab !== 'users' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Settings className="h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">{menuItems.find(item => item.id === activeTab)?.label}</h2>
            <p className="text-gray-400 text-center max-w-md">
              이 기능은 현재 개발 중입니다. 곧 사용하실 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 