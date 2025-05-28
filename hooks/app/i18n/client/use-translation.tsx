'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 번역 타입 정의
type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

// 지원하는 언어 목록
export type SupportedLocale = 'ko' | 'en';

// 컨텍스트 타입 정의
type I18nContextType = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translations: TranslationDictionary;
};

// 기본 컨텍스트 값
const defaultContext: I18nContextType = {
  locale: 'ko',
  setLocale: () => {},
  t: (key) => key,
  translations: {},
};

// 컨텍스트 생성
const I18nContext = createContext<I18nContextType>(defaultContext);

// 변수를 문자열로 변환하여 번역에 적용하는 함수
const interpolate = (text: string, params?: Record<string, string>): string => {
  if (!params) return text;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    return result.replace(regex, value);
  }, text);
};

// 중첩된 객체에서 키를 사용하여 값을 가져오는 함수
const getNestedValue = (obj: TranslationDictionary, path: string): string => {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // 번역 키를 찾지 못한 경우 원래 키 반환
    }
  }
  
  return typeof current === 'string' ? current : path;
};

// 프로바이더 컴포넌트 Props 타입
type I18nProviderProps = {
  children: ReactNode;
  defaultLocale?: SupportedLocale;
  translations: {
    [locale in SupportedLocale]?: TranslationDictionary;
  };
};

// 프로바이더 컴포넌트
export const I18nProvider = ({
  children,
  defaultLocale = 'ko',
  translations,
}: I18nProviderProps) => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);
  
  // 브라우저의 로컬 스토리지에서 언어 설정 불러오기
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as SupportedLocale | null;
    if (savedLocale && (savedLocale === 'ko' || savedLocale === 'en')) {
      setLocale(savedLocale);
    }
  }, []);
  
  // 언어 변경 시 로컬 스토리지에 저장
  const handleSetLocale = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };
  
  // 번역 함수
  const t = (key: string, params?: Record<string, string>): string => {
    const currentTranslations = translations[locale] || {};
    const translatedText = getNestedValue(currentTranslations, key);
    return interpolate(translatedText, params);
  };
  
  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        t,
        translations: translations[locale] || {},
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

// 커스텀 훅
export const useTranslation = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  
  return context;
};
