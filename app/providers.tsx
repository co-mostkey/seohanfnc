'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { I18nProvider, SupportedLocale } from '@/hooks/app/i18n/client/use-translation';

// 프로바이더 컴포넌트 Props 타입
interface ProvidersProps {
  children: ReactNode;
}

/**
 * 애플리케이션의 모든 프로바이더를 포함하는 컴포넌트
 * - 테마 프로바이더
 * - 다국어 처리 프로바이더
 */
export function Providers({ children }: ProvidersProps) {
  // 클라이언트 사이드 렌더링을 확인하기 위한 상태
  const [isMounted, setIsMounted] = useState(false);
  
  // 더미 번역 데이터 (실제로는 API나 정적 import를 통해 가져와야 함)
  const translations = {
    ko: {
      common: {
        home: "홈",
        about: "소개",
        services: "서비스",
        products: "제품",
        contact: "연락처",
        login: "로그인",
        signup: "회원가입",
        search: "검색",
        menu: "메뉴",
        close: "닫기",
        language: "언어",
        korean: "한국어",
        english: "영어"
      }
    },
    en: {
      common: {
        home: "Home",
        about: "About",
        services: "Services",
        products: "Products",
        contact: "Contact",
        login: "Login",
        signup: "Sign Up",
        search: "Search",
        menu: "Menu",
        close: "Close",
        language: "Language",
        korean: "Korean",
        english: "English"
      }
    }
  } as Record<SupportedLocale, any>;
  
  // 컴포넌트가 마운트되었음을 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 children만 반환 (hydration 오류 방지)
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <I18nProvider 
        defaultLocale="ko" 
        translations={translations}
      >
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
