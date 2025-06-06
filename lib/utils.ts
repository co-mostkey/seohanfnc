import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { LocalizedString } from "@/types/product"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 정적 자산(이미지, 비디오 등)의 경로를 basePath와 assetPrefix를 적용하여 반환합니다.
 * @param path - 원본 경로 (예: "/images/logo.png")
 * @returns 환경에 맞게 조정된 경로
 */
export function getAssetPath(path: string): string {
  if (!path) return '';

  // 이미 절대 URL인 경우 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  // 환경변수에서 값 가져오기
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

  // assetPrefix가 있으면 우선 사용 (CDN 경로)
  if (assetPrefix) {
    // assetPrefix 끝에 / 제거
    const prefix = assetPrefix.endsWith('/') ? assetPrefix.slice(0, -1) : assetPrefix;
    // path 시작의 / 확인
    const pathWithSlash = path.startsWith('/') ? path : `/${path}`;
    return `${prefix}${pathWithSlash}`;
  }

  // basePath만 있는 경우
  if (basePath) {
    // basePath 끝에 / 제거
    const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    // path 시작의 / 확인
    const pathWithSlash = path.startsWith('/') ? path : `/${path}`;
    return `${base}${pathWithSlash}`;
  }

  // 둘 다 없으면 원본 경로 반환
  return path;
}

/**
 * 이미지 경로에 대한 특별한 처리
 * Next.js Image 컴포넌트와 함께 사용하기 위한 함수
 */
export function getImagePath(path: string): string {
  return getAssetPath(path);
}

/**
 * 비디오 경로에 대한 특별한 처리
 */
export function getVideoPath(path: string): string {
  return getAssetPath(path);
}

/**
 * public 폴더의 정적 파일 경로 처리
 */
export function getPublicPath(path: string): string {
  return getAssetPath(path);
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

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param bytes 바이트 단위의 파일 크기
 * @returns 포맷팅된 파일 크기 문자열
 */
export function formatFileSize(bytes: number | undefined): string {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
