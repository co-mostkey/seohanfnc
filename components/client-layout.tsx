'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
// import { useMobile } from '@/hooks/use-mobile' // 로그인 페이지 특별 처리 시 사용 안 함
import MobileBottomNav from '@/components/ui/MobileBottomNav'
import Footer from '@/components/footer'
import { GlobalNav } from '@/components/ui/GlobalNav'
import {
  HEADER_HEIGHT_CLASS, // 로그인 페이지에서 사용 안 할 수 있음
  FOOTER_HEIGHT_CLASS,
  MOBILE_NAV_HEIGHT_CLASS,
  MAIN_CONTENT_PT_CLASS,
  MAIN_CONTENT_PB_DESKTOP_CLASS,
  MAIN_CONTENT_PB_MOBILE_CLASS
} from '@/lib/layoutConstants';

// ContentContainer는 로그인 페이지에서는 직접 사용하지 않을 수 있음
interface ContentContainerProps {
  children: React.ReactNode;
  isHero?: boolean;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children, isHero = false, className }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login'; // 이 컴포넌트 내에서도 필요할 수 있음

  return (
    <div className={cn(
      "w-full",
      // 로그인 페이지만 flex-grow 유지
      isLoginPage ? "flex flex-col flex-grow h-full" : "",
      className
    )}>
      {children}
    </div>
  );
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname === '/gate') {
    // 게이트(쿠키 동의) 페이지에서는 글로벌 UI(네비, 푸터, 모바일 네비 등) 렌더링 X
    return <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center">{children}</div>;
  }

  const isAdminPath = pathname?.startsWith('/admin');
  const isIntranetPath = pathname?.startsWith('/intranet');
  const isAdminLoginPage = pathname === '/admin/login';
  const hideGlobalUI = isIntranetPath || (isAdminPath && !isAdminLoginPage);

  const legacyLayoutExactPaths = [
    '/', '/home', '/products', '/company', '/support', '/resources', '/research'
  ];
  const isLegacyLayoutPage = pathname && legacyLayoutExactPaths.includes(pathname);

  if (isIntranetPath) {
    return <>{children}</>;
  }

  // 관리자 로그인 페이지 특별 처리
  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  if (hideGlobalUI) {
    // 이 경우는 ContentContainer가 h-screen 또는 h-full을 가져야 함
    // LoginPage에서 자체적으로 h-full flex-grow를 가지므로 ContentContainer는 기본 props만 전달
    return <ContentContainer className="h-full flex-grow flex flex-col">{children}</ContentContainer>;
  }

  // 로그인 페이지 특별 처리 (여기만 flex-grow 유지)
  if (isLoginPage) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent text-foreground">
        <GlobalNav variant="fixedDefault" />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <Footer variant="transparent" className="hidden md:block" />
        <div className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", MOBILE_NAV_HEIGHT_CLASS, "bg-transparent border-t border-border")}>
          <MobileBottomNav />
        </div>
      </div>
    );
  }

  // 레거시 레이아웃 페이지 - 메인페이지 푸터 중복 제거
  if (isLegacyLayoutPage) {
    if (pathname === '/' || pathname === '/home') {
      return (
        <div className="min-h-screen">
          {React.Children.toArray(children)[0]}
          <ContentContainer>
            {React.Children.map(React.Children.toArray(children).slice(1), child => child)}
          </ContentContainer>
          {/* 메인페이지는 children에 이미 푸터가 포함되어 있으므로 제거 */}
          <div className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", MOBILE_NAV_HEIGHT_CLASS, "bg-transparent border-t border-border")}>
            <MobileBottomNav />
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen text-foreground">
        <GlobalNav variant="mainSticky" />
        <main className="min-h-[calc(100vh-theme(spacing.16))]">
          <ContentContainer>
            {children}
          </ContentContainer>
        </main>
        <Footer variant="transparent" className="hidden md:block" />
        <div className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", MOBILE_NAV_HEIGHT_CLASS, "bg-transparent border-t border-border")}>
          <MobileBottomNav />
        </div>
      </div>
    );
  }

  // [TRISID] 에어매트 4종 상세페이지에서만 투명 배경 및 패딩 제거 적용
  const isAirMatDetailPage = pathname?.startsWith('/products/Cylinder-Type-SafetyAirMat') || pathname?.startsWith('/products/에어매트제품ID'); // 필요시 4종 모두 추가

  const mainClassName = isAirMatDetailPage
    ? 'min-h-[calc(100vh-56px)]' // 패딩 없이 Hero가 네비게이션까지 채워지도록
    : cn(
      "min-h-[calc(100vh-56px)]",
      MAIN_CONTENT_PT_CLASS,
      `${MAIN_CONTENT_PB_MOBILE_CLASS} ${MAIN_CONTENT_PB_DESKTOP_CLASS}`
    );

  return (
    <div className={isAirMatDetailPage ? "min-h-screen bg-transparent text-foreground" : "min-h-screen bg-transparent text-foreground"}>
      <GlobalNav variant="fixedDefault" />
      <main className={mainClassName}>
        <ContentContainer>
          {children}
        </ContentContainer>
      </main>
      <Footer variant="transparent" className="hidden md:block" />
      <div className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", MOBILE_NAV_HEIGHT_CLASS, "bg-transparent border-t border-border")}>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default ClientLayout;
