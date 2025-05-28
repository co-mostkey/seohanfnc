import React from 'react';
import { cn } from '@/lib/utils';

interface SafetyEquipmentLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 안전장비 상세페이지를 위한 레이아웃 컴포넌트
 * 
 * 기존 사이트 레이아웃을 활용하여 배경 중첩 문제를 해결합니다.
 */
export default function SafetyEquipmentLayout({ children, className }: SafetyEquipmentLayoutProps) {
  // 레이아웃 간소화 - data-component-name 속성과 min-h-screen 제거
  return (
    <>{children}</>
  );
}
