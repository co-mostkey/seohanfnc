import React from 'react'
import Link from 'next/link'
import { Home, Briefcase, Building, Users, FileText, Shield, Layers } from 'lucide-react'

// 모바일 하단 네비게이션 아이템 정의
const navItems = [
  { href: '/', label: 'HOME', icon: Home },
  { href: '/products', label: '제품소개', icon: Briefcase },
  { href: '/about', label: '회사소개', icon: Building },
  { href: '/support', label: '고객지원', icon: Users },
  { href: '/promotions', label: '홍보자료', icon: FileText },
  { href: '/intranet', label: '인트라넷', icon: Layers },
]

export default function MobileBottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full backdrop-blur-xl bg-black/30 border-t border-white/20 shadow-xl z-50 grid grid-cols-6 md:hidden ios-safe-bottom"
      style={{
        paddingBottom: 'max(1rem, var(--safe-area-inset-bottom))',
        paddingLeft: 'var(--safe-area-inset-left)',
        paddingRight: 'var(--safe-area-inset-right)'
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center justify-center py-3 text-white hover:bg-white/10 dark:hover:bg-white/10 transition-colors text-xs touch-manipulation"
        >
          <Icon className="h-5 w-5 mb-1" />
          <span className="leading-tight">{label}</span>
        </Link>
      ))}
    </nav>
  );
}