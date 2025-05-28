'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Award, BadgeCheck, Building, Globe, Lightbulb, Trophy, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryEvent {
  year: string;
  month?: string;
  content: string;
  icon?: string;
}

interface YearData {
  year: string;
  events: HistoryEvent[];
}

interface HistoryTimelineProps {
  historyData: YearData[];
}

const getIcon = (content: string): React.ReactNode => {
  if (content.includes('인증') || content.includes('승인') || content.includes('선정')) return <BadgeCheck className="h-5 w-5" />;
  if (content.includes('수출')) return <Globe className="h-5 w-5" />;
  if (content.includes('개발') || content.includes('설립')) return <Lightbulb className="h-5 w-5" />;
  if (content.includes('수상')) return <Trophy className="h-5 w-5" />;
  return <Calendar className="h-5 w-5" />;
};

export function HistoryTimeline({ historyData }: HistoryTimelineProps) {
  const [selectedYear, setSelectedYear] = useState<string>(historyData[0]?.year || '');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability();

      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);

      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [historyData, checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const currentYearEvents = historyData.find(data => data.year === selectedYear)?.events || [];

  return (
    <div>
      <div className="mb-4">
        <div 
          ref={scrollContainerRef} 
          className="overflow-x-auto pb-2 hide-scrollbar"
        >
          <div className="flex flex-nowrap justify-start md:justify-center gap-2 min-w-max px-1">
            {historyData.map(({ year }) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out border whitespace-nowrap", 
                  selectedYear === year
                    ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {year}년
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mb-12">
        <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={cn(
            "p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-md border border-gray-200 dark:border-gray-700",
            "transition-opacity duration-300",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={cn(
            "p-2 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-md border border-gray-200 dark:border-gray-700",
            "transition-opacity duration-300",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      {currentYearEvents.length > 0 ? (
        <div className="max-w-3xl mx-auto relative border-l-2 border-primary/30 dark:border-primary/50 pl-8 md:pl-12 py-4">
          {currentYearEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative mb-8 pl-4 before:content-[''] before:absolute before:left-[-38px] md:before:left-[-54px] before:top-[5px] before:w-4 before:h-4 before:bg-primary before:rounded-full before:border-2 before:border-white dark:before:border-gray-900"
            >
              <div className="flex items-center gap-2 mb-1">
                {event.month && (
                  <span className="text-xs font-semibold text-primary dark:text-primary-400 bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                    {event.month}월
                  </span>
                )}
                <h3 className="font-semibold text-base md:text-lg text-gray-800 dark:text-gray-100">
                  {event.content.replace(/\[.*?\]/g, '').trim()}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">해당 연도의 연혁 정보가 없습니다.</p>
      )}
    </div>
  );
}