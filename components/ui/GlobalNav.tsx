import React from 'react';
import Link from 'next/link';
import { Home, Briefcase, Building, Users, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HEADER_HEIGHT_CLASS } from '@/lib/layoutConstants';

// 데스크톱 전용 메뉴 아이템
const navItems = [
  { href: '/', label: 'HOME', icon: Home },
  { href: '/products', label: '제품소개', icon: Briefcase },
  { href: '/about', label: '회사소개', icon: Building },
  { href: '/promotions', label: '홍보자료', icon: FileText },
  { href: '/support', label: '고객지원', icon: Users },
  { href: '/research', label: '연구개발', icon: Shield },
];

// GlobalNav Props 정의
interface GlobalNavProps {
  variant?: 'mainSticky' | 'legacyStatic' | 'fixedDefault';
}

export function GlobalNav({ variant = 'fixedDefault' }: GlobalNavProps) {
  // variant에 따른 스타일 정의
  const navClasses = cn(
    "relative z-[30] hidden md:grid w-full grid-cols-6 text-white",
    {
      // 메인 페이지 (스티키 헤더) - 푸터와 유사한 비주얼로 변경
      "sticky top-0 bg-neutral-900/70 backdrop-blur-md border-b border-neutral-700/50": variant === 'mainSticky',
      [HEADER_HEIGHT_CLASS]: variant === 'legacyStatic' || variant === 'fixedDefault',
      // 레거시 페이지 (정적 헤더) - 다크 테마, 불투명 배경
      "bg-gray-900 border-b border-gray-700": variant === 'legacyStatic',
      "fixed top-0 left-0 right-0 bg-neutral-900/70 backdrop-blur-md border-b border-neutral-700/50": variant === 'fixedDefault',
    }
  );

  return (
    <nav className={navClasses}>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center justify-center py-4 hover:bg-white/10 text-base font-semibold transition-colors duration-150 ease-in-out"
        >
          <Icon className="h-5 w-5 mr-2" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}