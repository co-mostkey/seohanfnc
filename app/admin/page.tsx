"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ArrowUpRight, Plus, LineChart, Check
} from 'lucide-react';
import { AdminStatsSection } from './components/AdminStatsSection';
import { AdminRecentActivitySection } from './components/AdminRecentActivitySection';
import { AdminQuickLinksSection } from './components/AdminQuickLinksSection';
import { AdminMenuSection } from './components/AdminMenuSection';
import { recentActivities, statsData, adminMenus } from '@/data/adminDashboardData';
import { ADMIN_HEADING_STYLES, ADMIN_CARD_STYLES, ADMIN_UI, ADMIN_FONT_STYLES, ADMIN_BUTTON_SIZES } from '@/lib/admin-ui-constants';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-300 font-medium" style={ADMIN_FONT_STYLES.BODY_TEXT}>관리자 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  // 최근 활동 목록에서 처리되지 않은 문의 갯수 계산
  const pendingInquiries = recentActivities.filter(activity =>
    activity.type === 'inquiry' && activity.status === 'pending'
  ).length;

  // 오늘 날짜를 한국어로 표시 (예: 2025년 5월 23일 금요일)
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today);

  return (
    <div className="space-y-6">
      {/* 상단 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>관리자 대시보드</h1>
          <p className={ADMIN_UI.TEXT_MUTED} style={ADMIN_FONT_STYLES.BODY_TEXT}>{formattedDate}</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/admin/statistics" >
            <button className={`${ADMIN_UI.BUTTON_SECONDARY} ${ADMIN_BUTTON_SIZES.DEFAULT} flex items-center`} style={ADMIN_FONT_STYLES.BUTTON}>
              <LineChart className="h-4 w-4 mr-2" />
              통계 보기
            </button>
          </Link>
          <Link href="/admin/products/create" >
            <button className={`${ADMIN_UI.BUTTON_PRIMARY} ${ADMIN_BUTTON_SIZES.DEFAULT} flex items-center`} style={ADMIN_FONT_STYLES.BUTTON}>
              <Plus className="h-4 w-4 mr-2" />
              새 제품 추가
            </button>
          </Link>
        </div>
      </div>
      {/* 주요 알림 섹션 */}
      {pendingInquiries > 0 && (
        <div className={`${ADMIN_CARD_STYLES.ACCENT} p-4 mb-6 shadow-sm`}>
          <div className="flex items-center">
            <div className="bg-orange-900 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-orange-200" style={ADMIN_FONT_STYLES.CARD_TITLE}>처리가 필요한 문의가 있습니다</h3>
              <p className="text-sm text-orange-300 mt-0.5" style={ADMIN_FONT_STYLES.BODY_TEXT}>답변 대기 중인 문의 {pendingInquiries}건이 있습니다.</p>
            </div>
            <Link href="/admin/inquiries" >
              <button className={`${ADMIN_UI.BG_SECONDARY} border border-orange-700 text-orange-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors`} style={ADMIN_FONT_STYLES.BUTTON}>
                확인하기
              </button>
            </Link>
          </div>
        </div>
      )}
      <AdminStatsSection stats={statsData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AdminRecentActivitySection activities={recentActivities} />
        <AdminQuickLinksSection />
      </div>
      <AdminMenuSection menus={adminMenus} />
      {/* 할일 체크리스트 */}
      <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-5 mb-6`}>
        <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>관리자 체크리스트</h2>
        <div className="space-y-3 mt-3">
          <div className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${ADMIN_UI.BORDER_LIGHT} transition-colors`}>
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-2 border-orange-600 rounded-full mr-3 bg-orange-900">
              <Check className="h-3.5 w-3.5 text-orange-400" />
            </div>
            <span className={`${ADMIN_UI.TEXT_PRIMARY} font-medium flex-1`} style={ADMIN_FONT_STYLES.BODY_TEXT}>새로운 제품 정보 업데이트</span>
            <button className={`text-xs bg-orange-900 hover:bg-orange-800 text-orange-300 py-1 px-2 rounded font-medium transition-colors`} style={ADMIN_FONT_STYLES.BUTTON}>완료 표시</button>
          </div>
          <div className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${ADMIN_UI.BORDER_LIGHT} transition-colors`}>
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-2 border-gray-600 rounded-full mr-3">
              <Check className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <span className={`flex-1 font-medium ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>문의사항 답변 작성</span>
            <button className={`text-xs bg-orange-900 hover:bg-orange-800 text-orange-300 py-1 px-2 rounded font-medium transition-colors`} style={ADMIN_FONT_STYLES.BUTTON}>완료 표시</button>
          </div>
          <div className={`flex items-center p-3 rounded-md hover:bg-gray-700 ${ADMIN_UI.BORDER_LIGHT} transition-colors`}>
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-2 border-gray-600 rounded-full mr-3">
              <Check className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <span className={`flex-1 font-medium ${ADMIN_UI.TEXT_SECONDARY}`} style={ADMIN_FONT_STYLES.BODY_TEXT}>주간 통계 보고서 검토</span>
            <button className={`text-xs bg-orange-900 hover:bg-orange-800 text-orange-300 py-1 px-2 rounded font-medium transition-colors`} style={ADMIN_FONT_STYLES.BUTTON}>완료 표시</button>
          </div>
        </div>
      </div>
    </div>
  );
} 