import React from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Event } from '@/data/intranetDashboardData';
import { getEventTypeBorderStyle } from '@/lib/intranetUtils';

interface ScheduleWidgetProps {
    events: Event[];
    currentDisplayMonthDate: Date; // 현재 달력을 표시하는 기준이 되는 Date 객체
    onPrevMonth: () => void;
    onNextMonth: () => void;
    // onAddEvent: () => void; // 필요시 일정 추가 함수 prop 추가
}

export const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({
    events,
    currentDisplayMonthDate,
    onPrevMonth,
    onNextMonth
}) => {
    // 표시할 이벤트 (해당 월에 맞는 이벤트만 필터링)
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentDisplayMonthDate.getMonth() &&
            eventDate.getFullYear() === currentDisplayMonthDate.getFullYear();
    }).slice(0, 4); // 최대 4개 표시

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-400" />
                    <span>다가오는 일정</span>
                </h3>
                <Link
                    href="/intranet/calendar"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span>캘린더보기</span>
                </Link>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm text-gray-300">
                        {currentDisplayMonthDate.toLocaleDateString('ko-KR', { month: 'long' })} 일정
                    </h4>
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/20 mr-1"
                            onClick={onPrevMonth}
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                            onClick={onNextMonth}
                        >
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-3 mt-2">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id} // eventsData에 id가 있으므로 event.id 사용
                            className="flex items-center p-2 rounded-lg hover:bg-white/5 transition-colors group border border-white/5 hover:border-white/10"
                        >
                            <div className="w-10 h-10 rounded-lg bg-black/50 text-center flex flex-col justify-center items-center mr-3 border border-white/10">
                                <span className="text-xs text-blue-300">{event.month}</span>
                                <span className="text-sm font-semibold text-white">{event.day}</span>
                            </div>
                            <div className="flex-1">
                                <h5 className="text-sm font-medium text-white group-hover:text-blue-200 line-clamp-1">{event.title}</h5>
                                <div className="flex items-center text-xs text-gray-400 mt-0.5">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{event.time}</span>
                                    {event.location && (
                                        <>
                                            <span className="mx-1">•</span>
                                            <span>{event.location}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getEventTypeBorderStyle(event.type)}`}></div>
                        </div>
                    ))}
                </div>
                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <Calendar className="h-12 w-12 text-gray-600 mb-2" />
                        <p className="text-gray-400">이번 달 일정이 없습니다</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 bg-black/50 border-white/10 text-blue-400 hover:text-blue-300 hover:bg-black/70"
                        // onClick={onAddEvent} // 필요시 추가
                        >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            일정 추가
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}; 