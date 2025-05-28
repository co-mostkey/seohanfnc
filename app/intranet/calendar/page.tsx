"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Search,
  CalendarDays,
  Calendar as CalendarRange,
  LayoutList,
  Filter,
  Trash2,
  Edit,
  Info,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 캘린더 이벤트 타입 정의 (확장된 버전)
interface ExtendedCalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location: string;
  attendees: Array<{
    id: number;
    name: string;
    position: string;
    avatar: string;
  }>;
  description: string;
  category: string;
  color: string;
}

// 임시 데이터
const TEMP_EVENTS: ExtendedCalendarEvent[] = [
  {
    id: 1,
    title: "월례 보고회",
    start: new Date(2024, 10, 10),
    end: new Date(2024, 10, 10),
    allDay: true,
    location: "마케팅팀 월례 보고회",
    attendees: [],
    description: "마케팅팀 월례 보고회",
    category: "meeting",
    color: "#3B82F6"
  },
  {
    id: 2,
    title: "납품 기한",
    start: new Date(2024, 10, 15),
    end: new Date(2024, 10, 15),
    allDay: true,
    location: "현대건설 XX현장 납품기한",
    attendees: [],
    description: "현대건설 XX현장 납품기한",
    category: "deadline",
    color: "#EF4444"
  },
  {
    id: 3,
    title: "추석",
    start: new Date(2024, 9, 16),
    end: new Date(2024, 9, 16),
    allDay: true,
    location: "",
    attendees: [],
    description: "추석",
    category: "holiday",
    color: "#EF4444"
  },
  {
    id: 4,
    title: "부서 회식",
    start: new Date(2024, 10, 20),
    end: new Date(2024, 10, 20),
    allDay: true,
    location: "영업부 회식",
    attendees: [],
    description: "영업부 회식",
    category: "personal",
    color: "#22C55E"
  },
  {
    id: 5,
    title: "품질 회의",
    start: new Date(2024, 10, 5),
    end: new Date(2024, 10, 5),
    allDay: true,
    location: "품질관리 개선 회의",
    attendees: [],
    description: "품질관리 개선 회의",
    category: "meeting",
    color: "#3B82F6"
  },
];

// 월 이름
const monthNames = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

// 요일 이름
const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

// 이벤트 타입별 색상
const typeColors = {
  meeting: "bg-blue-100 text-blue-800 border-blue-200",
  deadline: "bg-red-100 text-red-800 border-red-200",
  holiday: "bg-purple-100 text-purple-800 border-purple-200",
  personal: "bg-green-100 text-green-800 border-green-200",
};

// 날짜 관련 유틸 함수
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDay();
};

const getDaysOfPrevMonth = (year: number, month: number) => {
  const firstDay = getFirstDayOfMonth(year, month);
  if (firstDay === 0) return []; // 일요일부터 시작하면 이전 달 날짜를 표시할 필요가 없음

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  return Array.from({ length: firstDay }, (_, i) => ({
    day: daysInPrevMonth - firstDay + i + 1,
    month: prevMonth,
    year: prevYear,
    isCurrentMonth: false
  }));
};

const getDaysOfCurrentMonth = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);

  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    month,
    year,
    isCurrentMonth: true
  }));
};

const getDaysOfNextMonth = (year: number, month: number) => {
  const lastDay = getLastDayOfMonth(year, month);
  if (lastDay === 6) return []; // 토요일로 끝나면 다음 달 날짜를 표시할 필요가 없음

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return Array.from({ length: 6 - lastDay }, (_, i) => ({
    day: i + 1,
    month: nextMonth,
    year: nextYear,
    isCurrentMonth: false
  }));
};

const getCalendarDays = (year: number, month: number) => {
  const prevMonthDays = getDaysOfPrevMonth(year, month);
  const currentMonthDays = getDaysOfCurrentMonth(year, month);
  const nextMonthDays = getDaysOfNextMonth(year, month);

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

const getWeekDays = (start: Date) => {
  const result = [];
  const current = new Date(start);

  for (let i = 0; i < 7; i++) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
};

const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// 날짜 포맷팅
const formatDate = (date: Date, format: string = 'long') => {
  if (format === 'short') {
    return date.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    });
  } else if (format === 'time') {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } else if (format === 'year-month') {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// 임시 데이터 - 이벤트 목록
const events: ExtendedCalendarEvent[] = [
  {
    id: 1,
    title: '2분기 경영회의',
    start: new Date(2024, 3, 20, 10, 0),
    end: new Date(2024, 3, 20, 12, 0),
    location: '본사 대회의실',
    attendees: [
      { id: 1, name: '김철수', position: '대표이사', avatar: '/images/avatars/avatar-1.jpg' },
      { id: 2, name: '이영희', position: '이사', avatar: '/images/avatars/avatar-2.jpg' },
      { id: 3, name: '박지성', position: '부장', avatar: '/images/avatars/avatar-3.jpg' }
    ],
    description: '2분기 경영 전략과 실적 검토를 위한 회의',
    category: 'meeting',
    color: '#3B82F6'
  },
  {
    id: 2,
    title: '신제품 출시 기념 행사',
    start: new Date(2024, 3, 25, 14, 0),
    end: new Date(2024, 3, 25, 17, 0),
    location: '본사 대강당',
    attendees: [
      { id: 0, name: '전 직원', position: '', avatar: '' }
    ],
    description: '신제품 출시를 기념하는 전사 행사',
    category: 'event',
    color: '#8B5CF6'
  },
  {
    id: 3,
    title: '개인정보보호 교육',
    start: new Date(2024, 3, 27, 13, 0),
    end: new Date(2024, 3, 27, 15, 0),
    location: '본사 교육장',
    attendees: [
      { id: 0, name: '전 직원', position: '', avatar: '' }
    ],
    description: '법정 필수 개인정보보호 교육',
    category: 'training',
    color: '#22C55E'
  },
  {
    id: 4,
    title: '영업팀 주간 미팅',
    start: new Date(2024, 3, 22, 9, 0),
    end: new Date(2024, 3, 22, 10, 0),
    location: '영업팀 회의실',
    attendees: [
      { id: 2, name: '이영희', position: '이사', avatar: '/images/avatars/avatar-2.jpg' },
      { id: 3, name: '박지성', position: '부장', avatar: '/images/avatars/avatar-3.jpg' },
      { id: 4, name: '최민지', position: '대리', avatar: '/images/avatars/avatar-4.jpg' }
    ],
    description: '영업팀 주간 목표 설정 및 지난주 성과 검토',
    category: 'meeting',
    color: '#3B82F6'
  },
  {
    id: 5,
    title: '마케팅 전략 회의',
    start: new Date(2024, 3, 18, 14, 0),
    end: new Date(2024, 3, 18, 16, 0),
    location: '마케팅팀 회의실',
    attendees: [
      { id: 5, name: '정수민', position: '과장', avatar: '/images/avatars/avatar-5.jpg' },
      { id: 6, name: '강동원', position: '대리', avatar: '/images/avatars/avatar-6.jpg' },
      { id: 7, name: '임지원', position: '사원', avatar: '/images/avatars/avatar-7.jpg' }
    ],
    description: '신제품 출시를 위한 마케팅 전략 수립',
    category: 'meeting',
    color: '#3B82F6'
  },
  {
    id: 6,
    title: '명절 휴무',
    start: new Date(2024, 3, 11, 0, 0),
    end: new Date(2024, 3, 13, 23, 59),
    allDay: true,
    location: '',
    attendees: [],
    description: '회사 명절 휴무',
    category: 'holiday',
    color: '#EF4444'
  }
];

// 이벤트 필터링 함수 - 날짜별
const filterEventsByDate = (events: ExtendedCalendarEvent[], date: Date) => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return events.filter((event: ExtendedCalendarEvent) => {
    const eventStart = new Date(event.start);
    eventStart.setHours(0, 0, 0, 0);

    // 종일 이벤트 처리
    if (event.allDay) {
      const eventEnd = new Date(event.end);
      eventEnd.setHours(0, 0, 0, 0);
      return eventStart <= targetDate && eventEnd >= targetDate;
    }

    return eventStart.getTime() === targetDate.getTime();
  });
};

// 이벤트 필터링 함수 - 기간별
const filterEventsByDateRange = (events: ExtendedCalendarEvent[], startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return events.filter((event: ExtendedCalendarEvent) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    return eventStart <= end && eventEnd >= start;
  });
};

// 이벤트 카테고리별 색상 및 라벨
const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'meeting':
      return { color: 'bg-blue-500', label: '회의' };
    case 'event':
      return { color: 'bg-purple-500', label: '행사' };
    case 'training':
      return { color: 'bg-green-500', label: '교육' };
    case 'holiday':
      return { color: 'bg-red-500', label: '휴일' };
    default:
      return { color: 'bg-gray-500', label: '기타' };
  }
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // 월별 캘린더 데이터 계산
  const calendarDays = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

  // 주별 캘린더 데이터 계산
  const getWeekStartDate = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const weekStartDate = getWeekStartDate(new Date(selectedDate));
  const weekDays = getWeekDays(weekStartDate);

  // 검색 및 필터링된 이벤트
  const getFilteredEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(event => event.category === filterCategory);
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // 날짜별 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    return filterEventsByDate(filteredEvents, date);
  };

  // 날짜 변경 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handlePrevWeek = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (date: { day: number; month: number; year: number }) => {
    const selectedDate = new Date(date.year, date.month, date.day);
    setSelectedDate(selectedDate);
    if (view !== 'day') setView('day');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 상태 변경으로 자동 적용됨
  };

  // 시간 슬롯 생성
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">일정 관리</h1>
          <p className="text-gray-400">
            {view === 'month'
              ? formatDate(currentDate, 'year-month')
              : view === 'week'
                ? `${formatDate(weekDays[0], 'short')} - ${formatDate(weekDays[6], 'short')}`
                : formatDate(selectedDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <div className="flex items-center rounded-md overflow-hidden">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              오늘
            </button>
            <button
              onClick={view === 'month' ? handlePrevMonth : view === 'week' ? handlePrevWeek : handlePrevDay}
              className="px-3 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={view === 'month' ? handleNextMonth : view === 'week' ? handleNextWeek : handleNextDay}
              className="px-3 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center rounded-md overflow-hidden">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition-colors`}
            >
              <CalendarRange className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition-colors`}
            >
              <CalendarDays className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition-colors`}
            >
              <LayoutList className="h-5 w-5" />
            </button>
          </div>

          <Link
            href="/intranet/calendar/create"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors ml-2"
          >
            <Plus className="h-5 w-5 mr-1" />
            일정 추가
          </Link>
        </div>
      </div>
      {/* 검색 및 필터 */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-auto flex-grow">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="일정 검색..."
                className="block w-full bg-gray-700 border-gray-600 pl-10 pr-4 py-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory(filterCategory === 'meeting' ? null : 'meeting')}
              className={`inline-flex items-center px-3 py-2 rounded-md ${filterCategory === 'meeting'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              회의
            </button>
            <button
              onClick={() => setFilterCategory(filterCategory === 'event' ? null : 'event')}
              className={`inline-flex items-center px-3 py-2 rounded-md ${filterCategory === 'event'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
              행사
            </button>
            <button
              onClick={() => setFilterCategory(filterCategory === 'training' ? null : 'training')}
              className={`inline-flex items-center px-3 py-2 rounded-md ${filterCategory === 'training'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              교육
            </button>
            <button
              onClick={() => setFilterCategory(filterCategory === 'holiday' ? null : 'holiday')}
              className={`inline-flex items-center px-3 py-2 rounded-md ${filterCategory === 'holiday'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
            >
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              휴일
            </button>
          </div>
        </div>
      </div>
      {/* 월별 보기 */}
      {view === 'month' && (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 text-center py-3 border-b border-gray-700">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div
                key={day}
                className={`text-sm font-medium ${index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-300'}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((date, index) => {
              const dateObj = new Date(date.year, date.month, date.day);
              const dateEvents = getEventsForDate(dateObj);
              const isCurrentDay = isToday(dateObj);
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

              return (
                <div
                  key={`${date.year}-${date.month}-${date.day}`}
                  className={`min-h-[100px] p-2 border-r border-b border-gray-700 relative ${!date.isCurrentMonth ? 'bg-gray-750' :
                    isWeekend ? 'bg-gray-800' : 'bg-gray-800'
                    } ${isCurrentDay ? 'ring-2 ring-blue-500 z-10' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full ${!date.isCurrentMonth
                        ? 'text-gray-500'
                        : isCurrentDay
                          ? 'bg-blue-500 text-white'
                          : dateObj.getDay() === 0
                            ? 'text-red-400'
                            : dateObj.getDay() === 6
                              ? 'text-blue-400'
                              : 'text-white'
                        }`}
                    >
                      {date.day}
                    </div>
                  </div>

                  {/* 날짜별 이벤트 */}
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[85px]">
                    {dateEvents.map((event: ExtendedCalendarEvent) => (
                      <div
                        key={event.id}
                        className={`px-2 py-1 rounded-sm text-xs text-white truncate`}
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEventDetails(event.id);
                        }}
                      >
                        {event.allDay ? '종일' : `${formatDate(event.start, 'time')}`} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* 주간 보기 */}
      {view === 'week' && (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-8 border-b border-gray-700">
            <div className="p-3 border-r border-gray-700"></div>
            {weekDays.map((day, i) => {
              const isCurrentDay = isToday(day);
              return (
                <div
                  key={i}
                  className={`p-3 text-center border-r border-gray-700 ${isCurrentDay ? 'bg-blue-900 bg-opacity-30' : ''
                    }`}
                  onClick={() => {
                    setSelectedDate(day);
                    setView('day');
                  }}
                >
                  <div className="text-sm font-medium text-gray-300">{['일', '월', '화', '수', '목', '금', '토'][day.getDay()]}</div>
                  <div className={`text-lg font-semibold ${isCurrentDay ? 'text-blue-400' : 'text-white'}`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 시간별 그리드 */}
          <div className="overflow-y-auto max-h-[700px]">
            {timeSlots.map((time, i) => {
              const [hour] = time.split(':').map(Number);

              return (
                <div key={time} className="grid grid-cols-8 border-b border-gray-700">
                  <div className="p-2 text-right text-sm text-gray-400 border-r border-gray-700">
                    {hour === 12 ? '오후 12:00' : hour > 12 ? `오후 ${hour - 12}:00` : `오전 ${hour}:00`}
                  </div>

                  {weekDays.map((day, j) => {
                    const isCurrentDay = isToday(day);
                    const currentDateTime = new Date(day);
                    currentDateTime.setHours(hour, 0, 0, 0);

                    // 해당 시간에 시작하는 이벤트 찾기
                    const eventsAtTime = filteredEvents.filter(event => {
                      const eventStart = new Date(event.start);
                      return eventStart.getDate() === day.getDate() &&
                        eventStart.getMonth() === day.getMonth() &&
                        eventStart.getFullYear() === day.getFullYear() &&
                        eventStart.getHours() === hour;
                    });

                    return (
                      <div
                        key={j}
                        className={`p-1 border-r border-gray-700 min-h-[60px] ${isCurrentDay ? 'bg-blue-900 bg-opacity-10' : ''
                          }`}
                      >
                        {eventsAtTime.map((event: ExtendedCalendarEvent) => (
                          <div
                            key={event.id}
                            className="p-1 rounded-sm text-xs text-white mb-1 cursor-pointer"
                            style={{ backgroundColor: event.color }}
                            onClick={() => setShowEventDetails(event.id)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div>{formatDate(event.start, 'time')} - {formatDate(event.end, 'time')}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* 일간 보기 */}
      {view === 'day' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {formatDate(selectedDate)}
              </h2>
            </div>

            <div className="overflow-y-auto max-h-[700px]">
              {timeSlots.map((time, i) => {
                const [hour] = time.split(':').map(Number);
                const currentDateTime = new Date(selectedDate);
                currentDateTime.setHours(hour, 0, 0, 0);

                // 해당 시간에 시작하는 이벤트 찾기
                const eventsAtTime = filteredEvents.filter(event => {
                  const eventStart = new Date(event.start);
                  return eventStart.getDate() === selectedDate.getDate() &&
                    eventStart.getMonth() === selectedDate.getMonth() &&
                    eventStart.getFullYear() === selectedDate.getFullYear() &&
                    eventStart.getHours() === hour;
                });

                const currentHour = new Date().getHours();
                const isCurrentHour = isToday(selectedDate) && hour === currentHour;

                return (
                  <div
                    key={time}
                    className={`flex border-b border-gray-700 ${isCurrentHour ? 'bg-blue-900 bg-opacity-20' : ''}`}
                  >
                    <div className="w-24 p-3 text-right text-sm text-gray-400 border-r border-gray-700 flex-shrink-0">
                      {hour === 12 ? '오후 12:00' : hour > 12 ? `오후 ${hour - 12}:00` : `오전 ${hour}:00`}
                    </div>

                    <div className="flex-1 p-2 min-h-[80px]">
                      {eventsAtTime.map((event: ExtendedCalendarEvent) => (
                        <div
                          key={event.id}
                          className="p-2 rounded-sm text-white mb-2 cursor-pointer"
                          style={{ backgroundColor: event.color }}
                          onClick={() => setShowEventDetails(event.id)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm mt-1 flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {formatDate(event.start, 'time')} - {formatDate(event.end, 'time')}
                          </div>
                          {event.location && (
                            <div className="text-sm mt-1 flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 일정 목록 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-blue-400" />
                일정 목록
              </h2>
            </div>

            <div className="divide-y divide-gray-700 max-h-[700px] overflow-y-auto">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event: ExtendedCalendarEvent) => {
                  const category = getCategoryInfo(event.category);

                  return (
                    <div
                      key={event.id}
                      className="p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                      onClick={() => setShowEventDetails(event.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{event.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${category.color}`}>
                          {category.label}
                        </span>
                      </div>

                      <div className="text-sm text-gray-300 flex items-center mb-1.5">
                        <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                        {event.allDay
                          ? '종일'
                          : `${formatDate(event.start, 'time')} - ${formatDate(event.end, 'time')}`}
                      </div>

                      {event.location && (
                        <div className="text-sm text-gray-300 flex items-center mb-1.5">
                          <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                          {event.location}
                        </div>
                      )}

                      {event.attendees.length > 0 && (
                        <div className="text-sm text-gray-300 flex items-start mb-1.5">
                          <Users className="h-4 w-4 mr-1.5 text-gray-400 mt-0.5" />
                          <div>
                            {event.attendees[0].id === 0 ? (
                              <span>{event.attendees[0].name}</span>
                            ) : (
                              <div className="flex -space-x-2 overflow-hidden">
                                {event.attendees.slice(0, 3).map((attendee: { id: number; name: string; position: string; avatar: string }, i: number) => (
                                  <div key={i} className="relative">
                                    {attendee.avatar ? (
                                      <Image
                                        src={attendee.avatar}
                                        alt={attendee.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full border border-gray-700"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                        {attendee.name[0]}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                        {event.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-1">일정이 없습니다</p>
                  <p className="text-sm text-gray-500">새 일정을 추가해보세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 이벤트 상세 정보 모달 */}
      {showEventDetails !== null && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            {(() => {
              const event = events.find(e => e.id === showEventDetails);
              if (!event) return null;

              const category = getCategoryInfo(event.category);

              return (
                <>
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${category.color}`}>
                            {category.label}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">
                          {formatDate(event.start)} {!event.allDay && `${formatDate(event.start, 'time')} - ${formatDate(event.end, 'time')}`}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowEventDetails(null)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {event.location && (
                      <div className="flex items-start mb-4">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-300">장소</div>
                          <div className="text-white">{event.location}</div>
                        </div>
                      </div>
                    )}

                    {event.description && (
                      <div className="flex items-start mb-4">
                        <Info className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-300">설명</div>
                          <div className="text-white">{event.description}</div>
                        </div>
                      </div>
                    )}

                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-start mb-4">
                        <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-300">참석자</div>
                          {event.attendees[0].id === 0 ? (
                            <div className="text-white">{event.attendees[0].name}</div>
                          ) : (
                            <div className="mt-2 space-y-2">
                              {event.attendees.map((attendee: { id: number; name: string; position: string; avatar: string }, i: number) => (
                                <div key={i} className="flex items-center">
                                  <div className="relative h-8 w-8 mr-3">
                                    {attendee.avatar ? (
                                      <Image
                                        src={attendee.avatar}
                                        alt={attendee.name}
                                        fill
                                        className="rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center text-white">
                                        {attendee.name[0]}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-white">{attendee.name}</div>
                                    <div className="text-xs text-gray-400">{attendee.position}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
                    <Link
                      href={`/intranet/calendar/edit/${event.id}`}
                      className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      편집
                    </Link>
                    <button
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      삭제
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

