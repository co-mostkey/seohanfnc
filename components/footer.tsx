'use client';

import Link from 'next/link';
import { Layers, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface FooterProps {
  variant?: 'transparent' | 'default' | 'sticky';
  className?: string;
}

export default function Footer({ variant = 'transparent', className }: FooterProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent;
      if (/iPhone|iPad|iPod|Android|Mobile/i.test(ua)) {
        setIsMobile(true);
      }
    }
  }, []);
  if (isMobile) return null;

  const footerClasses = cn(
    "w-full text-white py-4 md:py-6 z-50 border-t border-white/10",
    {
      // 투명 레이어 스타일 (기본값)
      "bg-black/20 backdrop-blur-md": variant === 'transparent',

      // 일반 스타일
      "bg-gray-900 border-gray-800": variant === 'default',

      // 스티키 스타일 (콘텐츠 하단에 고정) - 제거하고 transparent 사용
      "bg-black/30 backdrop-blur-sm": variant === 'sticky',
    },
    className
  );

  return (
    <footer className={footerClasses}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* 로그인 링크 영역 */}
        <div className="flex justify-center md:justify-start items-center space-x-4 text-xs text-gray-300 mb-2 md:mb-0 order-2 md:order-1">
          <Link
            href="/intranet"
            className="flex items-center hover:text-white transition-colors duration-200"
          >
            <Layers className="h-3 w-3 mr-1" />
            <span>인트라넷</span>
          </Link>
          <span className="text-gray-500">|</span>
          <Link
            href="/login"
            className="flex items-center hover:text-white transition-colors duration-200"
          >
            <LogIn className="h-3 w-3 mr-1" />
            <span>회원 로그인</span>
          </Link>
        </div>

        {/* 저작권 정보 */}
        <div className="text-center text-xs text-gray-300 order-1 md:order-2">
          &copy; {new Date().getFullYear()} 서한에프앤씨. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
