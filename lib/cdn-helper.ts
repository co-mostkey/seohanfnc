/**
 * CDN URL 변환 헬퍼 함수
 * [TRISID] 2024-12-19: 파일시스템 기반 CDN 지원 기능
 */

// CDN 설정 타입
interface CDNConfig {
    enabled: boolean;
    domain?: string;
    paths?: string[];
}

/**
 * CDN URL로 변환
 * @param originalUrl 원본 URL
 * @param cdnEnabled CDN 활성화 여부
 * @returns 변환된 URL
 */
export function getCDNUrl(originalUrl: string, cdnEnabled: boolean = false): string {
    // CDN이 비활성화되어 있으면 원본 URL 반환
    if (!cdnEnabled) {
        return originalUrl;
    }

    // 환경 변수에서 CDN 도메인 가져오기
    const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN || process.env.CDN_DOMAIN;

    if (!cdnDomain) {
        console.warn('CDN이 활성화되어 있지만 CDN_DOMAIN 환경 변수가 설정되지 않았습니다.');
        return originalUrl;
    }

    // 로컬 정적 파일 경로만 CDN으로 변환
    const staticPaths = ['/uploads/', '/imgs/', '/images/', '/public/'];

    const shouldUseCDN = staticPaths.some(path => originalUrl.startsWith(path));

    if (shouldUseCDN) {
        // CDN 도메인으로 변환
        const cdnUrl = `${cdnDomain.replace(/\/$/, '')}${originalUrl}`;
        console.log(`CDN 변환: ${originalUrl} -> ${cdnUrl}`);
        return cdnUrl;
    }

    return originalUrl;
}

/**
 * 이미지 URL 최적화 (CDN + 최적화 파라미터)
 * @param imageUrl 이미지 URL
 * @param options 최적화 옵션
 * @returns 최적화된 URL
 */
export function getOptimizedImageUrl(
    imageUrl: string,
    options: {
        cdnEnabled?: boolean;
        width?: number;
        height?: number;
        quality?: number;
        format?: 'webp' | 'jpg' | 'png';
    } = {}
): string {
    let optimizedUrl = getCDNUrl(imageUrl, options.cdnEnabled);

    // CDN을 사용하는 경우에만 최적화 파라미터 추가
    if (options.cdnEnabled && optimizedUrl !== imageUrl) {
        const params = new URLSearchParams();

        if (options.width) params.append('w', options.width.toString());
        if (options.height) params.append('h', options.height.toString());
        if (options.quality) params.append('q', options.quality.toString());
        if (options.format) params.append('f', options.format);

        if (params.toString()) {
            optimizedUrl += `?${params.toString()}`;
        }
    }

    return optimizedUrl;
}

/**
 * 설정 파일에서 CDN 상태 확인
 * @returns CDN 활성화 여부
 */
export async function isCDNEnabled(): Promise<boolean> {
    if (typeof window !== 'undefined') {
        // 클라이언트 사이드에서는 API 호출
        try {
            const response = await fetch('/api/admin/settings');
            const result = await response.json();
            return result.success && result.settings?.performance?.cdnEnabled || false;
        } catch {
            return false;
        }
    } else {
        // 서버 사이드에서는 직접 파일 읽기
        try {
            const fs = await import('fs/promises');
            const path = await import('path');

            const settingsPath = path.join(process.cwd(), 'data/settings.json');
            const content = await fs.readFile(settingsPath, 'utf8');
            const settings = JSON.parse(content);

            return settings.performance?.cdnEnabled || false;
        } catch {
            return false;
        }
    }
}

/**
 * 여러 URL을 일괄 CDN 변환
 * @param urls URL 배열
 * @param cdnEnabled CDN 활성화 여부
 * @returns 변환된 URL 배열
 */
export function batchCDNTransform(urls: string[], cdnEnabled: boolean = false): string[] {
    return urls.map(url => getCDNUrl(url, cdnEnabled));
}

/**
 * 안전한 CDN URL 변환 (에러 발생 시 원본 반환)
 * @param originalUrl 원본 URL
 * @param cdnEnabled CDN 활성화 여부
 * @returns 변환된 URL 또는 원본 URL
 */
export function safeCDNTransform(originalUrl: string, cdnEnabled: boolean = false): string {
    try {
        return getCDNUrl(originalUrl, cdnEnabled);
    } catch (error) {
        console.error('CDN 변환 중 오류 발생:', error);
        return originalUrl; // 에러 발생 시 원본 URL 반환
    }
} 