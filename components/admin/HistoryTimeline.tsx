'use client';

import React, { useMemo } from 'react';
import { Calendar, Award, Building, Globe, Rocket, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryEvent {
    year: number;
    month?: number;
    day?: number;
    title: string;
    details: string[];
    isHighlighted: boolean;
    eventType: 'award' | 'establishment' | 'export' | 'development' | 'general';
}

interface HistoryYear {
    year: number;
    events: HistoryEvent[];
}

interface HistoryTimelineProps {
    historyText: string;
    customStyles?: {
        colorScheme: string;
        timelineStyle: string;
        showIcons: boolean;
        showDates: boolean;
        compactMode: boolean;
    };
}

// 이벤트 유형을 자동으로 감지하는 함수
const detectEventType = (text: string): HistoryEvent['eventType'] => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('인증') || lowerText.includes('수상') || lowerText.includes('상') || lowerText.includes('선정')) {
        return 'award';
    }
    if (lowerText.includes('설립') || lowerText.includes('창립') || lowerText.includes('법인') || lowerText.includes('전환')) {
        return 'establishment';
    }
    if (lowerText.includes('수출') || lowerText.includes('계약') || lowerText.includes('협약') || lowerText.includes('체결')) {
        return 'export';
    }
    if (lowerText.includes('개발') || lowerText.includes('출시') || lowerText.includes('완료') || lowerText.includes('취득')) {
        return 'development';
    }

    return 'general';
};

// 이벤트 유형별 아이콘을 반환하는 함수
const getEventIcon = (eventType: HistoryEvent['eventType']) => {
    switch (eventType) {
        case 'award':
            return Award;
        case 'establishment':
            return Building;
        case 'export':
            return Globe;
        case 'development':
            return Rocket;
        default:
            return Calendar;
    }
};

// 연도별 색상을 반환하는 함수
const getYearColor = (year: number, allYears: number[]) => {
    const sortedYears = [...allYears].sort((a, b) => b - a); // 내림차순 정렬
    const index = sortedYears.indexOf(year);
    const total = sortedYears.length;

    if (index < total * 0.3) {
        return 'text-blue-400 border-blue-400'; // 최신 30%
    } else if (index < total * 0.7) {
        return 'text-green-400 border-green-400'; // 중간 40%
    } else {
        return 'text-gray-400 border-gray-400'; // 과거 30%
    }
};

// 연혁 텍스트를 파싱하는 함수
const parseHistoryText = (text: string): HistoryYear[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const years: HistoryYear[] = [];
    let currentYear: HistoryYear | null = null;
    let currentEvent: HistoryEvent | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // 연도 패턴 매칭 (예: "2018년", "2017년 3월")
        const yearMatch = trimmedLine.match(/^(\d{4})년(?:\s*(\d{1,2})월)?/);
        if (yearMatch) {
            const year = parseInt(yearMatch[1]);
            const month = yearMatch[2] ? parseInt(yearMatch[2]) : undefined;

            currentYear = {
                year,
                events: []
            };
            years.push(currentYear);
            currentEvent = null;
            continue;
        }

        // 월/일 이벤트 패턴 매칭 (예: "01월:", "03월 15일:")
        const eventMatch = trimmedLine.match(/^(\d{1,2})월(?:\s*(\d{1,2})일)?:\s*(.+)$/);
        if (eventMatch && currentYear) {
            const month = parseInt(eventMatch[1]);
            const day = eventMatch[2] ? parseInt(eventMatch[2]) : undefined;
            const title = eventMatch[3];

            const isHighlighted = title.includes('[') && title.includes(']');
            const eventType = detectEventType(title);

            currentEvent = {
                year: currentYear.year,
                month,
                day,
                title,
                details: [],
                isHighlighted,
                eventType
            };

            currentYear.events.push(currentEvent);
            continue;
        }

        // 들여쓰기된 세부 내용 (예: "    - 소방청 형식승인 완료")
        if (line.startsWith('    ') || line.startsWith('\t')) {
            if (currentEvent) {
                currentEvent.details.push(trimmedLine.replace(/^[-•]\s*/, ''));
            }
            continue;
        }

        // 기타 내용 (연도 없이 시작하는 경우)
        if (currentYear && !eventMatch) {
            const isHighlighted = trimmedLine.includes('[') && trimmedLine.includes(']');
            const eventType = detectEventType(trimmedLine);

            currentEvent = {
                year: currentYear.year,
                title: trimmedLine,
                details: [],
                isHighlighted,
                eventType
            };

            currentYear.events.push(currentEvent);
        }
    }

    return years.sort((a, b) => b.year - a.year); // 최신 연도부터 정렬
};

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ historyText, customStyles }) => {
    const historyData = useMemo(() => parseHistoryText(historyText), [historyText]);
    const allYears = useMemo(() => historyData.map(item => item.year), [historyData]);

    // 기본 스타일 설정
    const styles = {
        colorScheme: 'default',
        timelineStyle: 'modern',
        showIcons: true,
        showDates: true,
        compactMode: false,
        ...customStyles
    };

    // 색상 스키마에 따른 색상 설정
    const getColorScheme = () => {
        switch (styles.colorScheme) {
            case 'blue':
                return {
                    primary: 'text-blue-400 border-blue-400',
                    secondary: 'text-blue-300 border-blue-300',
                    tertiary: 'text-blue-200 border-blue-200'
                };
            case 'green':
                return {
                    primary: 'text-green-400 border-green-400',
                    secondary: 'text-green-300 border-green-300',
                    tertiary: 'text-green-200 border-green-200'
                };
            case 'purple':
                return {
                    primary: 'text-purple-400 border-purple-400',
                    secondary: 'text-purple-300 border-purple-300',
                    tertiary: 'text-purple-200 border-purple-200'
                };
            case 'orange':
                return {
                    primary: 'text-orange-400 border-orange-400',
                    secondary: 'text-orange-300 border-orange-300',
                    tertiary: 'text-orange-200 border-orange-200'
                };
            default:
                return {
                    primary: 'text-blue-400 border-blue-400',
                    secondary: 'text-green-400 border-green-400',
                    tertiary: 'text-gray-400 border-gray-400'
                };
        }
    };

    const colorScheme = getColorScheme();

    if (!historyData.length) {
        return (
            <div className="text-center py-8 text-gray-400">
                <Calendar className="mx-auto h-12 w-12 mb-2" />
                <p>연혁 데이터를 입력하면 자동으로 타임라인이 생성됩니다.</p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-8", styles.compactMode && "space-y-4")}>
            {historyData.map((yearData, yearIndex) => {
                // 연도별 색상 결정
                let yearColor;
                if (styles.colorScheme === 'default') {
                    yearColor = getYearColor(yearData.year, allYears);
                } else {
                    const index = allYears.indexOf(yearData.year);
                    const total = allYears.length;
                    if (index < total * 0.3) {
                        yearColor = colorScheme.primary;
                    } else if (index < total * 0.7) {
                        yearColor = colorScheme.secondary;
                    } else {
                        yearColor = colorScheme.tertiary;
                    }
                }

                return (
                    <div key={yearData.year} className="relative">
                        {/* 연도 헤더 */}
                        <div className={cn(
                            "flex items-center pb-2 border-b-2",
                            styles.compactMode ? "mb-2" : "mb-4",
                            yearColor
                        )}>
                            <div className={cn(
                                "font-bold mr-3 px-3 py-1 rounded-lg border-2",
                                styles.compactMode ? "text-xl" : "text-2xl",
                                yearColor.replace('border-', 'bg-').replace('-400', '-400/20'),
                                yearColor
                            )}>
                                {yearData.year}년
                            </div>
                            <div className="text-sm opacity-75">
                                {yearData.events.length}개 이벤트
                            </div>
                        </div>

                        {/* 이벤트 목록 */}
                        <div className={cn(
                            "space-y-4 ml-4",
                            styles.compactMode && "space-y-2",
                            styles.timelineStyle === 'minimal' && "ml-0"
                        )}>
                            {yearData.events.map((event, eventIndex) => {
                                const IconComponent = getEventIcon(event.eventType);

                                return (
                                    <div key={eventIndex} className={cn(
                                        "relative flex items-start space-x-3",
                                        styles.timelineStyle === 'classic' && "bg-gray-800/30 p-3 rounded-lg",
                                        styles.timelineStyle === 'minimal' && "border-l-2 border-gray-600 pl-4"
                                    )}>
                                        {/* 타임라인 라인 */}
                                        {eventIndex < yearData.events.length - 1 && styles.timelineStyle === 'modern' && (
                                            <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-600"></div>
                                        )}

                                        {/* 이벤트 아이콘 */}
                                        {styles.showIcons && (
                                            <div className={cn(
                                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-gray-900",
                                                styles.compactMode && "w-6 h-6",
                                                event.eventType === 'award' ? 'border-yellow-400 text-yellow-400' :
                                                    event.eventType === 'establishment' ? 'border-blue-400 text-blue-400' :
                                                        event.eventType === 'export' ? 'border-green-400 text-green-400' :
                                                            event.eventType === 'development' ? 'border-purple-400 text-purple-400' :
                                                                'border-gray-400 text-gray-400'
                                            )}>
                                                <IconComponent className={cn("w-4 h-4", styles.compactMode && "w-3 h-3")} />
                                            </div>
                                        )}

                                        {/* 이벤트 내용 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {styles.showDates && (event.month || event.day) && (
                                                    <span className={cn(
                                                        "text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded",
                                                        styles.compactMode && "text-xs px-1.5 py-0.5"
                                                    )}>
                                                        {event.month && `${event.month}월`}
                                                        {event.day && ` ${event.day}일`}
                                                    </span>
                                                )}
                                                {event.isHighlighted && (
                                                    <span className={cn(
                                                        "text-xs text-orange-400 bg-orange-400/20 px-2 py-1 rounded",
                                                        styles.compactMode && "text-xs px-1.5 py-0.5"
                                                    )}>
                                                        중요
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className={cn(
                                                "font-medium leading-relaxed",
                                                styles.compactMode ? "text-sm" : "text-sm",
                                                event.isHighlighted ? 'text-orange-300' : 'text-gray-200'
                                            )}>
                                                {event.title.replace(/\[([^\]]+)\]/g, '[$1]')}
                                            </h4>

                                            {event.details.length > 0 && (
                                                <ul className={cn(
                                                    "mt-2 space-y-1 text-xs text-gray-400 ml-4",
                                                    styles.compactMode && "mt-1 space-y-0.5"
                                                )}>
                                                    {event.details.map((detail, detailIndex) => (
                                                        <li key={detailIndex} className="flex items-start">
                                                            <CheckCircle className={cn(
                                                                "w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0",
                                                                styles.compactMode && "w-2.5 h-2.5"
                                                            )} />
                                                            {detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HistoryTimeline; 