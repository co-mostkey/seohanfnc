"use client";

import React from 'react';
import { cn } from "@/lib/utils";

/**
 * 모든 페이지에 공통으로 적용할 여백 및 스타일 유틸리티
 * 사이트 전체의 디자인 통일성을 위해 사용합니다.
 */

// 여백 클래스
export const containerPadding = "px-4 sm:px-6 lg:px-8";
export const containerWidth = "max-w-7xl mx-auto";
export const sectionPadding = "py-12 md:py-16 lg:py-20";
export const sectionMargin = "my-8 md:my-12 lg:my-16";

// 배경 및 색상 클래스
export const lightBackground = "bg-white dark:bg-gray-950";
export const darkBackground = "bg-gray-950 text-white";
export const gradientBackground = "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900";

// 그리드 레이아웃 클래스
export const gridCols2 = "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8";
export const gridCols3 = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
export const gridCols4 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8";

// 섹션 헤더 스타일
export const sectionHeader = "mb-8 md:mb-12";
export const sectionTitle = "text-3xl md:text-4xl font-bold tracking-tight";
export const sectionDescription = "mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl";

// 카드 스타일
export const cardStyles = "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow";

/**
 * 공통 스타일 유틸리티 컴포넌트
 * 여러 페이지에서 재사용할 수 있는 스타일 클래스들을 포함합니다.
 */
export function getCommonStyles() {
  return {
    // 컨테이너 스타일
    container: cn(containerWidth, containerPadding),
    
    // 섹션 스타일
    section: cn(sectionPadding),
    sectionWithBg: cn(sectionPadding, "bg-gray-50 dark:bg-gray-900 rounded-lg"),
    
    // 헤더 스타일
    pageHeader: cn("mb-8 md:mb-12"),
    pageTitle: cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"),
    pageSubtitle: cn("mt-4 text-xl text-gray-600 dark:text-gray-400"),
    
    // 카드 컨테이너 스타일
    cardGrid: cn(gridCols3),
    card: cn(cardStyles, "p-6"),
    
    // 버튼 컨테이너 스타일
    buttonContainer: cn("flex flex-wrap gap-4 mt-6"),
  };
}

/**
 * 페이지 기본 애니메이션
 * 페이지 전환 효과를 위한 애니메이션 클래스
 */
export const pageAnimation = "opacity-0 animate-in fade-in-50 slide-in-from-bottom-8 duration-500 ease-out";

/**
 * 섹션 애니메이션
 * 스크롤 시 섹션 애니메이션을 위한 클래스
 */
export const sectionAnimation = "opacity-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-300 ease-out delay-100";
