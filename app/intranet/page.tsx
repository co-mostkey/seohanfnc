"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  // Activity, Bell, BellRing, Briefcase, CheckCircle2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight,
  // Eye, FileBarChart, FileSpreadsheet, Folder, FolderOpen, HandCoins, Hexagon, Info, LineChart,
  // Loader2, Lock, LucideIcon, LucideProps, Mail, MapPin, Megaphone, MessageCircle, MessageSquare,
  // MoreHorizontal, PenLine, PieChart, Pin, Plus, Search, Settings, TrendingUp, Unlock, User, Users
  // 위 아이콘들은 대부분 하위 컴포넌트에서 개별적으로 import 하거나 더 이상 직접 사용하지 않음.
  // Calendar, Clock, ExternalLink, // DashboardHeader 등에서 사용하나 page.tsx에서 직접 불필요
} from 'lucide-react';
// import { motion } from "framer-motion"; // 현재 사용 안함

// 문제가 되는 import {} from "@/components/ui"; 형태를 포함한 블록이 있다면 삭제됩니다.
// 이 아래부터 Dialog import 이전까지 "@/components/ui"를 import하는 라인은 삭제됩니다.

import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger // DialogTrigger는 현재 이 파일에서 직접 사용 안 함
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // DialogFooter에서 사용

// 데이터 임포트
import {
  noticesData,
  recentDocumentsData,
  schedulesData,
  // salesDataInfo, // 사용 안 함
  // todoListData, // TodoWidget으로 전달되지만, page.tsx에서 직접 사용 안 함 (tasksData로 이름 변경되어 전달)
  // upcomingEventsData, // 사용 안 함
  teamMembersData,
  // projectStatsData, // 사용 안 함
  quickLinksData,
  eventsData,
  tasksData,
  type Task
} from '@/data/intranetDashboardData';

// 유틸리티 함수 임포트 (모두 하위 컴포넌트에서 사용, page.tsx에서 직접 호출 X)
// import {
//   fileTypeIcons, categoryColors, formatDate, getRelativeTimeString, getRemainingDays,
//   getStatusStyle, getEventTypeBorderStyle, getNoticeCategoryStyle
// } from '@/lib/intranetUtils';

// 컴포넌트 임포트
import { DashboardHeader } from './components/DashboardHeader';
import { QuickMenuWidget } from './components/QuickMenuWidget';
import { NoticeWidget } from './components/NoticeWidget';
import { ScheduleWidget } from './components/ScheduleWidget';
import { TodoWidget } from './components/TodoWidget';
import { TeamWidget } from './components/TeamWidget';
import { DocumentWidget } from './components/DocumentWidget';

export default function IntranetDashboard() {
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // 현재 사용 안함
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMembers, setActiveMembers] = useState(0);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // 오늘 스케줄 필터링 (schedulesData는 컴포넌트로 전달되나, todaySchedules는 현재 사용 안함)
  // const todaySchedules = schedulesData.filter(schedule => {
  //   const scheduleDate = new Date(schedule.date);
  //   const today = new Date();
  //   return (
  //     scheduleDate.getDate() === today.getDate() &&
  //     scheduleDate.getMonth() === today.getMonth() &&
  //     scheduleDate.getFullYear() === today.getFullYear()
  //   );
  // });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const onlineMembers = teamMembersData.filter(member => member.status === 'online').length;
    setActiveMembers(onlineMembers);
  }, [teamMembersData]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);
  
  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const openTaskDialog = useCallback((task: Task | null = null) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  }, []);
  
  const handleToggleTask = useCallback((taskId: string) => {
    // TODO: API를 통해 실제 태스크 상태 변경 로직 구현
    console.log("Toggle task:", taskId);
    // 예: tasksData 상태 업데이트 로직 (실제로는 API 호출 후 상태 반영)
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <DashboardHeader
        currentTime={currentTime}
        activeMembers={activeMembers}
        totalMembers={teamMembersData.length}
      />

      <QuickMenuWidget links={quickLinksData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <NoticeWidget notices={noticesData} />

        <ScheduleWidget
          events={eventsData}
          currentDisplayMonthDate={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <TodoWidget
          tasks={tasksData}
          onToggleTask={handleToggleTask}
          onOpenTaskDialog={openTaskDialog}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TeamWidget members={teamMembersData} />

        <DocumentWidget documents={recentDocumentsData} />
        </div>
        
      {/* 태스크 상세/편집 다이얼로그 (페이지 레벨에 유지 또는 별도 컴포넌트로 분리 가능) */}
      {isTaskDialogOpen && (
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>{selectedTask ? '할 일 수정' : '새 할 일 추가'}</DialogTitle>
              {selectedTask && <DialogDescription>{selectedTask.title}</DialogDescription>}
            </DialogHeader>
            <div className="py-4">
              {/* 여기에 태스크 입력 폼 구현 */}
              <p>{selectedTask ? `ID: ${selectedTask.id}` : '새 태스크 입력 폼'}</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)} className="text-gray-300 hover:text-white border-gray-600 hover:border-gray-500">
                취소
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {selectedTask ? '저장' : '추가'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
