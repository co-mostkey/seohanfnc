'use client';

import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리를 사용하여 화면 크기 변화에 따른 상태를 관리하는 Hook
 * @param query 미디어 쿼리 문자열 (예: '(min-width: 768px)')
 * @returns 미디어 쿼리 일치 여부 (boolean)
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 서버 사이드에서는 실행하지 않음
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);

    // 초기 상태 설정
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // 이벤트 리스너 콜백 함수
    const listener = () => {
      setMatches(media.matches);
    };

    // 이벤트 리스너 등록
    media.addEventListener('change', listener);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
}

// 자주 사용하는 미디어 쿼리 프리셋
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

export default useMediaQuery;