import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LocalizedString } from "@/types/product"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * LocalizedString 또는 string을 string으로 변환하는 헬퍼 함수
 * @param text - 변환할 텍스트 (string | LocalizedString | undefined)
 * @param locale - 사용할 언어 (기본값: 'ko')
 * @returns string
 */
export function getLocalizedString(
  text: string | LocalizedString | undefined,
  locale: 'ko' | 'en' | 'cn' = 'ko'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;

  // LocalizedString인 경우 우선순위: 요청 언어 -> 한국어 -> 영어 -> 첫 번째 값
  return text[locale] || text.ko || text.en || Object.values(text)[0] || '';
}

/**
 * 날짜 문자열을 포맷팅합니다.
 * @param dateString ISO 날짜 문자열 또는 Date 객체가 변환 가능한 날짜 문자열
 * @param format 포맷 형식 ('short', 'medium', 'long')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(dateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '날짜 없음';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    // 1일 이내는 상대적 시간으로 표시
    if (diffDay < 1) {
      if (diffMin < 1) return '방금 전';
      if (diffHour < 1) return `${diffMin}분 전`;
      return `${diffHour}시간 전`;
    }

    // 포맷에 따라 날짜 반환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'short') {
      return `${month}/${day}`;
    } else if (format === 'medium') {
      return `${year}.${month}.${day}`;
    } else {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return '날짜 오류';
  }
}
