import fs from 'fs';
import path from 'path';

// 지원하는 언어 목록
export type SupportedLocale = 'ko' | 'en' | 'ja' | 'zh';

// 번역 타입 정의
export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

/**
 * 특정 언어의 번역 파일을 로드하는 함수
 * @param locale 언어 코드 (ko, en)
 * @param namespace 네임스페이스 (common, home 등)
 * @returns 로드된 번역 객체
 */
export const loadTranslation = (
  locale: SupportedLocale,
  namespace: string
): TranslationDictionary => {
  try {
    // 파일 경로 생성
    const filePath = path.join(
      process.cwd(),
      'i18n',
      'locales',
      locale,
      `${namespace}.json`
    );
    
    // 파일 읽기
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // JSON 파싱
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`[i18n] 번역 파일 로드 실패: ${locale}/${namespace}`, error);
    return {};
  }
};

/**
 * 모든 네임스페이스의 번역을 로드하는 함수
 * @param locale 언어 코드 (ko, en)
 * @param namespaces 네임스페이스 배열
 * @returns 모든 네임스페이스가 병합된 번역 객체
 */
export const loadTranslations = (
  locale: SupportedLocale,
  namespaces: string[] = ['common']
): TranslationDictionary => {
  return namespaces.reduce((acc, namespace) => {
    const translations = loadTranslation(locale, namespace);
    return { ...acc, ...translations };
  }, {});
};

/**
 * 모든 지원 언어의 번역을 로드하는 함수
 * @param namespaces 네임스페이스 배열
 * @returns 모든 언어와 네임스페이스가 포함된 번역 객체
 */
export const loadAllTranslations = (
  namespaces: string[] = ['common']
): Record<SupportedLocale, TranslationDictionary> => {
  const locales: SupportedLocale[] = ['ko', 'en'];
  
  return locales.reduce(
    (acc, locale) => ({
      ...acc,
      [locale]: loadTranslations(locale, namespaces),
    }),
    {} as Record<SupportedLocale, TranslationDictionary>
  );
};

/**
 * 중첩된 객체에서 키 값을 가져오는 함수
 * @param obj 번역 객체
 * @param path 경로 (예: 'common.home')
 * @returns 번역 문자열 또는, 키를 찾을 수 없을 경우 원래 경로
 */
export const getNestedValue = (obj: TranslationDictionary, path: string): string => {
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
