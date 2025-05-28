"use client";

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 초기 값 설정
    setMatches(media.matches);
    
    // 변경 감지 함수
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // 이벤트 리스너 등록
    media.addEventListener("change", listener);
    
    // 클린업 함수
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);
  
  return matches;
}

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

export const useIsTablet = () => {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
};

export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1025px)');
};

export default useMediaQuery;
