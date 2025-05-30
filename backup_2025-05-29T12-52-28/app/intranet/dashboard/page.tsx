'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Star,
  Users,
  Briefcase,
  CircleAlert,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

// 임시 사용자 데이터
const currentUser = {
  id: 1,
  name: '김철수',
  position: '대표이사',
  department: '경영지원',
  email: 'ceo@seohanfnc.com',
  avatar: '/images/avatars/avatar-1.jpg',
  isOnline: true
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function DashboardPage() {
  // 오늘 날짜
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // 인사말 생성
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) {
      return '좋은 아침입니다';
    } else if (hour < 18) {
      return '안녕하세요';
    } else {
      return '좋은 저녁입니다';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h2 className="text-lg font-normal text-gray-400">{todayFormatted}</h2>
        <h1 className="text-3xl font-semibold text-white mb-2">
          {getGreeting()}, {currentUser.name} {currentUser.position}님
        </h1>
        <p className="text-gray-400">개인 대시보드에서 업무와 일정을 확인하세요.</p>
      </div>
      {/* 퀵 액션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/intranet/messages"
          className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
        >
          <MessageSquare className="h-8 w-8 text-blue-500 mb-3" />
          <span className="text-white font-medium">메시지</span>
          <span className="text-sm text-gray-400 mt-1">3개 읽지 않음</span>
        </Link>

        <Link
          href="/intranet/projects"
          className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
        >
          <Briefcase className="h-8 w-8 text-purple-500 mb-3" />
          <span className="text-white font-medium">프로젝트</span>
          <span className="text-sm text-gray-400 mt-1">4개 진행 중</span>
        </Link>

        <Link
          href="/intranet/calendar"
          className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
        >
          <Calendar className="h-8 w-8 text-green-500 mb-3" />
          <span className="text-white font-medium">일정</span>
          <span className="text-sm text-gray-400 mt-1">오늘 2개 일정</span>
        </Link>

        <Link
          href="/intranet/notices"
          className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
        >
          <Bell className="h-8 w-8 text-yellow-500 mb-3" />
          <span className="text-white font-medium">공지사항</span>
          <span className="text-sm text-gray-400 mt-1">새 공지 1개</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* 오늘 일정 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">오늘 일정</h2>
              <Link
                href="/intranet/calendar"
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
              >
                <span>전체 일정 보기</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex justify-between">
                  <h3 className="text-white font-medium">경영전략 회의</h3>
                  <div className="flex items-center text-gray-400 space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">09:30 - 11:00</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">대회의실</p>
                <div className="flex items-center mt-3">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="flex -space-x-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-1.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-2.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-3.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border-2 border-gray-750">
                      +4
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-750 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex justify-between">
                  <h3 className="text-white font-medium">신제품 개발 미팅</h3>
                  <div className="flex items-center text-gray-400 space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">14:00 - 15:30</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-1">화상회의</p>
                <div className="flex items-center mt-3">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="flex -space-x-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-5.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-8.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-9.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 flex items-center justify-center text-sm text-blue-500 hover:bg-gray-750 rounded-md">
              <Plus className="h-4 w-4 mr-1" />
              일정 추가
            </button>
          </div>

          {/* 나의 프로젝트 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">나의 프로젝트</h2>
              <Link
                href="/intranet/projects"
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
              >
                <span>모든 프로젝트</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-750 rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 mr-2">
                        진행 중
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        제품개발
                      </span>
                    </div>
                    <h3 className="text-white font-medium">신제품 개발 프로젝트</h3>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-xs">2024년 7월 31일</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">진행률</span>
                  <span className="text-sm font-medium text-white">65%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: '65%' }}
                  ></div>
                </div>

                <div className="flex justify-between mt-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-400">16/24 태스크</span>
                  </div>

                  <div className="flex -space-x-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-8.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-9.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-10.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-750 rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 mr-2">
                        보류 중
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        사업확장
                      </span>
                    </div>
                    <h3 className="text-white font-medium">해외 시장 진출 전략</h3>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-xs">2024년 10월 31일</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">진행률</span>
                  <span className="text-sm font-medium text-white">10%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: '10%' }}
                  ></div>
                </div>

                <div className="flex justify-between mt-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-400">1/15 태스크</span>
                  </div>

                  <div className="flex -space-x-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-1.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-2.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-750">
                      <Image
                        src="/images/avatars/avatar-18.jpg"
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 flex items-center justify-center text-sm text-blue-500 hover:bg-gray-750 rounded-md">
              <Plus className="h-4 w-4 mr-1" />
              새 프로젝트
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 최근 공지사항 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">공지사항</h2>
              <Link
                href="/intranet/notices"
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
              >
                <span>모든 공지</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-start bg-gray-750 rounded-lg p-4">
                <CircleAlert className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">
                    인사발령 공지 - 2024년 4월
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    2024년 4월 1일부로 적용되는 인사발령 내역을 공지합니다.
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span>인사팀</span>
                    <span className="mx-2">•</span>
                    <span>2024년 3월 28일</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start bg-gray-750 rounded-lg p-4">
                <CircleAlert className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">
                    2분기 경영실적 보고회 안내
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    2024년 2분기 경영실적 보고회가 7월 15일에 개최됩니다.
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span>경영지원팀</span>
                    <span className="mx-2">•</span>
                    <span>2024년 4월 1일</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start bg-gray-750 rounded-lg p-4">
                <CircleAlert className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium">
                    전사 품질관리 교육 실시 안내
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    전 직원 대상 품질관리 교육을 4월 20일부터 실시합니다.
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span>품질관리팀</span>
                    <span className="mx-2">•</span>
                    <span>2024년 4월 5일</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 내 할일 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">나의 할일</h2>
              <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span>새 할일</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-6">
                  <input
                    id="task-1"
                    type="checkbox"
                    className="h-4 w-4 border-2 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                </div>
                <label htmlFor="task-1" className="ml-3 block">
                  <span className="text-white">분기별 사업계획 검토</span>
                  <p className="text-sm text-gray-400">마감일: 2024년 4월 20일</p>
                </label>
                <div className="ml-auto">
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-6">
                  <input
                    id="task-2"
                    type="checkbox"
                    className="h-4 w-4 border-2 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                </div>
                <label htmlFor="task-2" className="ml-3 block">
                  <span className="text-white">해외 파트너십 미팅 준비</span>
                  <p className="text-sm text-gray-400">마감일: 2024년 4월 25일</p>
                </label>
                <div className="ml-auto">
                  <ArrowUpRight className="h-4 w-4 text-red-500 rotate-45" />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-6">
                  <input
                    id="task-3"
                    type="checkbox"
                    className="h-4 w-4 border-2 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                </div>
                <label htmlFor="task-3" className="ml-3 block">
                  <span className="text-white">인사평가 결과 검토</span>
                  <p className="text-sm text-gray-400">마감일: 2024년 5월 5일</p>
                </label>
                <div className="ml-auto">
                  <ArrowUpRight className="h-4 w-4 text-yellow-500 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">최근 활동</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src="/images/avatars/avatar-3.jpg"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-medium">박지성</span>님이 <span className="text-blue-400">프로젝트 일정</span>을 수정했습니다.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">30분 전</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src="/images/avatars/avatar-11.jpg"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-medium">장미영</span>님이 <span className="text-blue-400">신입사원 교육 일정</span>을 등록했습니다.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">2시간 전</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src="/images/avatars/avatar-5.jpg"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-medium">정수민</span>님이 <span className="text-blue-400">마케팅 캠페인 보고서</span>를 공유했습니다.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">어제</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 