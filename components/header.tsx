"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, X, Home, Briefcase, Building, Users, FileText, Shield, Layers, LogIn, BookOpen } from 'lucide-react'
import { cn } from '../lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 사이드 메뉴 컴포넌트 정의
export const SideMenu = ({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean
  toggleMenu: () => void
}) => {
  const pathname = usePathname()

  // 메뉴 항목을 MobileBottomNav와 동일하게 수정
  const menuItems = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/products', label: '제품소개', icon: Briefcase },
    { href: '/about', label: '회사소개', icon: Building },
    { href: '/support', label: '고객지원', icon: Users },
    { href: '/promotions', label: '홍보자료', icon: FileText },
    { href: '/digital-catalog', label: '디지털 카다로그', icon: BookOpen },
    { href: '/intranet', label: '인트라넷', icon: Layers },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 배경 */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[60] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />

          {/* 사이드 메뉴 패널 */}
          <motion.div
            className="fixed top-0 right-0 z-[70] h-screen w-[280px] bg-white/95 dark:bg-gray-900/85 shadow-xl overflow-y-auto backdrop-blur-lg ios-scroll-fix"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            aria-label="사이드 메뉴"
            style={{
              paddingTop: 'var(--safe-area-inset-top)',
              paddingRight: 'var(--safe-area-inset-right)',
              paddingBottom: 'var(--safe-area-inset-bottom)'
            }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">메뉴</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="메뉴 닫기"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 touch-manipulation"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === `${basePath}${item.href}` ||
                    (item.href !== '/' && pathname?.startsWith(`${basePath}${item.href}`));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center py-2.5 px-4 rounded-md text-base transition-colors duration-150 touch-manipulation",
                          isActive ?
                            "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-300 font-medium" :
                            "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={() => toggleMenu()}
                      >
                        <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary dark:text-primary-300" : "text-gray-500 dark:text-gray-400")} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 헤더 컴포넌트
const Header = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}) => {
  // 상단 네비게이션바 제거
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" >
          <div className="text-xl font-bold">서한에프앤씨</div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 w-9 items-center justify-center md:hidden text-slate-700 dark:text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">메뉴 토글</span>
            <div className="h-5 w-5"><div className="h-0.5 w-5 bg-gray-800 dark:bg-gray-200 rounded-full mb-1"></div>
              <div className="h-0.5 w-5 bg-gray-800 dark:bg-gray-200 rounded-full mb-1"></div>
              <div className="h-0.5 w-5 bg-gray-800 dark:bg-gray-200 rounded-full"></div></div>
          </button>

          <SideMenu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </div>
    </header>
  );
}

export default Header
