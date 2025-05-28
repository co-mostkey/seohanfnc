"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 페이지 레이아웃 타입 정의
export type PageVariant = "default" | "wide" | "narrow" | "full";
export type PageBackground = "light" | "dark" | "gradient" | "transparent";

interface PageLayoutProps {
  variant?: PageVariant;
  background?: PageBackground;
  className?: string;
  children: ReactNode;
  withAnimation?: boolean;
  headerPadding?: boolean; // 상단 헤더 여백 추가 옵션
}

/**
 * 페이지 레이아웃 컴포넌트
 * 모든 페이지에 일관된 여백과 스타일을 적용합니다.
 * 홈페이지와 하위 페이지 간의 디자인 통일성을 유지합니다.
 */
export function PageLayout({
  variant = "default",
  background = "light",
  className = "",
  children,
  withAnimation = false,
  headerPadding = true,
}: PageLayoutProps) {
  // 레이아웃 너비 설정
  const containerWidth = {
    default: "max-w-7xl", // 기본 너비 (1280px)
    wide: "max-w-8xl", // 넓은 너비 (1440px)
    narrow: "max-w-5xl", // 좁은 너비 (1024px)
    full: "w-full", // 전체 너비
  }[variant];

  // 배경 스타일 설정
  const bgStyles = {
    light: "bg-white dark:bg-gray-950",
    dark: "bg-gray-950 text-white",
    gradient: "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900",
    transparent: "bg-transparent",
  }[background];

  // 애니메이션 설정
  const animation = withAnimation
    ? "opacity-0 animate-in fade-in-50 slide-in-from-bottom-10 duration-500 ease-out"
    : "";

  return (
    <div 
      className={cn(
        bgStyles,
        "w-full",
        headerPadding ? "pt-20 lg:pt-24" : "", // 헤더 높이에 맞는 상단 패딩
        className
      )}
    >
      <div 
        className={cn(
          containerWidth,
          "mx-auto px-4 sm:px-6 lg:px-8 py-8",
          animation
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * 섹션 레이아웃 컴포넌트
 * 페이지 내 섹션에 일관된 스타일을 적용합니다.
 */
export function SectionLayout({
  className = "",
  children,
  withBackground = false,
  withPadding = true,
  withMargin = true,
  variant = "default",
}: {
  className?: string;
  children: ReactNode;
  withBackground?: boolean;
  withPadding?: boolean;
  withMargin?: boolean;
  variant?: "default" | "primary" | "secondary" | "accent";
}) {
  // 섹션 배경 스타일
  const bgStyle = withBackground
    ? {
        default: "bg-gray-50 dark:bg-gray-900",
        primary: "bg-primary/5 dark:bg-primary/10",
        secondary: "bg-secondary/5 dark:bg-secondary/10",
        accent: "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20",
      }[variant]
    : "";

  // 섹션 패딩 및 마진 스타일
  const paddingStyle = withPadding ? "py-12 px-4 sm:px-6 lg:px-8" : "";
  const marginStyle = withMargin ? "my-8" : "";

  return (
    <section
      className={cn(
        bgStyle,
        paddingStyle,
        marginStyle,
        "rounded-lg",
        withBackground ? "shadow-sm" : "",
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * 콘텐츠 컨테이너 컴포넌트
 * 섹션 내 콘텐츠를 일관된 너비와 여백으로 정렬합니다.
 */
export function ContentContainer({
  className = "",
  children,
  size = "default",
}: {
  className?: string;
  children: ReactNode;
  size?: "default" | "narrow" | "wide" | "full";
}) {
  // 컨텐츠 너비 설정
  const containerWidth = {
    default: "max-w-4xl",
    narrow: "max-w-2xl",
    wide: "max-w-6xl",
    full: "w-full",
  }[size];

  return (
    <div className={cn(containerWidth, "mx-auto", className)}>
      {children}
    </div>
  );
}
