import { ProductVisualExceptions } from '@/types/config';

/**
 * 제품의 비주얼 이미지 경로를 결정합니다.
 * 우선순위: 예외 목록 -> 기본 동적 경로 규칙
 * @param productId 제품 ID
 * @param exceptions 제품 ID별 예외 이미지 경로 맵. 기본값은 빈 객체입니다.
 * @returns 최종 이미지 경로 문자열
 */
export const getProductVisualImage = (
    productId: string,
    exceptions: ProductVisualExceptions = {}
): string => {
    // 1. 예외 목록 확인
    if (exceptions && exceptions[productId]) {
        return exceptions[productId];
    }

    // 2. 기본 동적 경로 규칙 (우선순위 순서)
    //    클라이언트 측에서는 파일 존재 여부를 직접 확인할 수 없으므로,
    //    가장 우선순위가 높은 경로를 반환합니다.
    //    실제 이미지를 표시하는 Image 컴포넌트의 onError 핸들러에서 다음 우선순위 경로를 시도하거나
    //    기본 이미지를 표시하도록 처리합니다.
    const possiblePaths = [
        `/images/products/${productId}/main/visual.jpg`,    // 기본 경로 (Sloping 스타일)
        `/images/products/${productId}/main/visual.png`,    // PNG 지원
        `/images/products/${productId}/main/visual.webp`,   // WebP 지원
        `/images/products/${productId}/product-hero.jpg`,   // 예외 제품들이 사용하던 다른 일반적인 경로
        `/images/products/visuals/${productId}-visual.jpg`, // 또 다른 예외 경로 패턴
    ];

    // 디버깅 및 개발 환경 알림용 로그 (실제 파일 존재 여부 체크는 아님)
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[getProductVisualImage] 제품 ID: ${productId}. 예외 없음. 적용된 기본 검색 경로: ${possiblePaths[0]}`);
    }

    // 기본적으로 가장 우선순위 높은 경로 반환
    return possiblePaths[0];
}; 