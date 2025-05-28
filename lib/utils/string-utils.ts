/**
 * 다양한 타입의 입력 값에서 안전하게 문자열을 추출합니다.
 * - null 또는 undefined인 경우 fallback 문자열을 반환합니다.
 * - 문자열인 경우 그대로 반환합니다.
 * - 객체이고 'ko' 속성을 가질 경우 해당 'ko' 속성 값을 반환합니다 (다국어 지원 가정).
 * - 그 외의 경우 문자열로 변환하여 반환합니다.
 * @param value 추출할 값
 * @param fallback 값이 유효하지 않을 경우 반환할 기본 문자열 (기본값: 빈 문자열)
 * @returns 추출된 문자열 또는 fallback 문자열
 */
export const getSafeString = (value: any, fallback: string = ''): string => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    // @ts-ignore - 동적 value 객체에 대한 접근을 허용 (더 엄격한 타입 체크 가능)
    if (typeof value === 'object' && value.ko && typeof value.ko === 'string') return value.ko;
    const stringified = String(value);
    return stringified === '[object Object]' ? fallback : stringified || fallback;
}; 