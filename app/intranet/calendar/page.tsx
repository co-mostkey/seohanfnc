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
import { Button } from "@/components/ui/button";

// [TRISID] 인트라넷 캘린더 인터페이스 정의
interface IntranetEvent {
  id: string;
  title: string;
  date: string;
  month: string;
  day: string;
  time: string;
  location: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 월 이름
const monthNames = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월"
];

// 요일 이름
const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

// 이벤트 타입별 색상
const typeColors = {
  meeting: "bg-blue-100 text-blue-800 border-blue-200",
  deadline: "bg-red-100 text-red-800 border-red-200",
  holiday: "bg-purple-100 text-purple-800 border-purple-200",
  personal: "bg-green-100 text-green-800 border-green-200",
  event: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

// 날짜 관련 유틸 함수들
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date, format: string = 'long') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (format) {
    case 'short':
      return `${month}/${day}`;
    case 'medium':
      return `${month}월 ${day}일`;
    case 'long':
      return `${year}년 ${month}월 ${day}일`;
    case 'iso':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    default:
      return `${year}년 ${month}월 ${day}일`;
  }
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const isSameDate = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<IntranetEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IntranetEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IntranetEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 새 이벤트 폼 데이터
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: formatDate(new Date(), 'iso'),
    time: '',
    location: '',
    type: 'meeting',
    description: ''
  });

  // [TRISID] 이벤트 데이터 로드
  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/intranet/events?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        setFilteredEvents(data.events);
      } else {
        setError('일정을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('이벤트 로드 오류:', error);
      setError('서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.type === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date, 'iso');
    return filteredEvents.filter(event => event.date === dateStr);
  };

  // 월 네비게이션
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 이벤트 추가
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/intranet/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      const data = await response.json();

      if (data.success) {
        setIsAddEventOpen(false);
        setNewEvent({
          title: '',
          date: formatDate(new Date(), 'iso'),
          time: '',
          location: '',
          type: 'meeting',
          description: ''
        });
        await loadEvents(); // 이벤트 목록 새로고침
      } else {
        setError(data.error || '일정 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('이벤트 추가 오류:', error);
      setError('일정 추가 중 오류가 발생했습니다.');
    }
  };

  // 이벤트 수정
  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setError('');

    try {
      const response = await fetch('/api/intranet/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedEvent.id,
          ...newEvent
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditEventOpen(false);
        setSelectedEvent(null);
        await loadEvents(); // 이벤트 목록 새로고침
      } else {
        setError(data.error || '일정 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('이벤트 수정 오류:', error);
      setError('일정 수정 중 오류가 발생했습니다.');
    }
  };

  // 이벤트 삭제
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) return;

    setError('');

    try {
      const response = await fetch(`/api/intranet/events?id=${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await loadEvents(); // 이벤트 목록 새로고침
      } else {
        setError(data.error || '일정 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('이벤트 삭제 오류:', error);
      setError('일정 삭제 중 오류가 발생했습니다.');
    }
  };

  // 이벤트 수정 다이얼로그 열기
  const openEditDialog = (event: IntranetEvent) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description
    });
    setIsEditEventOpen(true);
  };

  // 캘린더 그리드 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // 이전 달의 마지막 날들
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const day = getDaysInMonth(prevYear, prevMonth) - i;
      days.push({
        date: new Date(prevYear, prevMonth, day),
        isCurrentMonth: false
      });
    }

    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }

    // 다음 달의 첫 날들 (6주 완성)
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        date: new Date(nextYear, nextMonth, day),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">일정관리</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">팀 일정과 개인 업무를 효율적으로 관리하세요</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={handleToday} variant="outline">
              오늘
            </Button>
            <Button
              onClick={() => setIsAddEventOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              일정 추가
            </Button>
          </div>
        </div>

        {/* 컨트롤 바 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[120px] text-center">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="일정 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="meeting">회의</SelectItem>
                  <SelectItem value="deadline">마감일</SelectItem>
                  <SelectItem value="holiday">휴일</SelectItem>
                  <SelectItem value="personal">개인</SelectItem>
                  <SelectItem value="event">행사</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 캘린더 그리드 */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">
                  일정을 불러오는 중...
                </div>
              </div>
            ) : (
              <>
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-px mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="h-10 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 캘린더 날짜 */}
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day.date);
                    const isCurrentMonthDay = day.isCurrentMonth;
                    const isTodayDate = isToday(day.date);

                    return (
                      <div
                        key={index}
                        className={`
                      min-h-[120px] bg-white dark:bg-gray-800 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                      ${!isCurrentMonthDay ? 'opacity-50' : ''}
                      ${isTodayDate ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className={`
                      text-sm font-medium mb-1
                      ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
                      ${!isCurrentMonthDay ? 'text-gray-400 dark:text-gray-600' : ''}
                    `}>
                          {day.date.getDate()}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`
                            text-xs px-2 py-1 rounded border text-center cursor-pointer
                            ${typeColors[event.type as keyof typeof typeColors] || typeColors.meeting}
                          `}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(event);
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              +{dayEvents.length - 2}개 더
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 일정 추가 다이얼로그 */}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 일정 추가</DialogTitle>
              <DialogDescription>
                새로운 일정을 추가하세요.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvent}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">시간</Label>
                    <Input
                      id="time"
                      placeholder="예: 14:00 - 15:00"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">장소</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">유형</Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">회의</SelectItem>
                      <SelectItem value="deadline">마감일</SelectItem>
                      <SelectItem value="holiday">휴일</SelectItem>
                      <SelectItem value="personal">개인</SelectItem>
                      <SelectItem value="event">행사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  취소
                </Button>
                <Button type="submit">추가</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 일정 수정 다이얼로그 */}
        <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>일정 수정</DialogTitle>
              <DialogDescription>
                일정 정보를 수정하세요.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditEvent}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="edit-title">제목</Label>
                  <Input
                    id="edit-title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-date">날짜</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-time">시간</Label>
                    <Input
                      id="edit-time"
                      placeholder="예: 14:00 - 15:00"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-location">장소</Label>
                  <Input
                    id="edit-location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">유형</Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">회의</SelectItem>
                      <SelectItem value="deadline">마감일</SelectItem>
                      <SelectItem value="holiday">휴일</SelectItem>
                      <SelectItem value="personal">개인</SelectItem>
                      <SelectItem value="event">행사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-description">설명</Label>
                  <Textarea
                    id="edit-description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
                >
                  삭제
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditEventOpen(false)}>
                  취소
                </Button>
                <Button type="submit">수정</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

