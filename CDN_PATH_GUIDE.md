# CDN 및 서브디렉토리 배포 가이드

## 개요
이 프로젝트는 CDN 사용이나 서브디렉토리 배포를 지원하기 위한 설정이 준비되어 있습니다.

## 환경 변수 설정

### 1. 서브디렉토리 배포
예: `https://example.com/myapp`에 배포하는 경우

```bash
# .env.production
NEXT_PUBLIC_BASE_PATH=/myapp
```

### 2. CDN 사용
예: CloudFront나 다른 CDN을 통해 정적 자산을 서빙하는 경우

```bash
# .env.production
NEXT_PUBLIC_ASSET_PREFIX=https://cdn.example.com
```

### 3. 서브디렉토리 + CDN 함께 사용
```bash
# .env.production
NEXT_PUBLIC_BASE_PATH=/myapp
NEXT_PUBLIC_ASSET_PREFIX=https://cdn.example.com/myapp
```

## 코드에서 사용하기

### 기존 코드 (수정 필요)
```tsx
// ❌ 하드코딩된 절대 경로
<Image src="/images/logo.png" alt="Logo" />
<video src="/videos/intro.mp4" />
```

### 권장 코드
```tsx
import { getImagePath, getVideoPath } from '@/lib/utils';

// ✅ 유틸리티 함수 사용
<Image src={getImagePath('/images/logo.png')} alt="Logo" />
<video src={getVideoPath('/videos/intro.mp4')} />
```

### CSS에서 사용
```css
/* ❌ 기존 */
.hero {
  background-image: url('/images/hero-bg.jpg');
}

/* ✅ CSS 변수 활용 (JavaScript에서 주입) */
.hero {
  background-image: var(--hero-bg-url);
}
```

## 점진적 마이그레이션 전략

1. **Phase 1**: 유틸리티 함수 추가 (완료)
   - `getAssetPath()`, `getImagePath()`, `getVideoPath()` 함수 생성

2. **Phase 2**: 중요 페이지부터 적용
   - 홈페이지, 제품 페이지 등 주요 페이지부터 시작
   - 한 번에 몇 개의 파일씩 점진적으로 변경

3. **Phase 3**: 전체 적용
   - 모든 정적 자산 경로를 유틸리티 함수로 변경
   - 테스트 환경에서 충분히 검증

## 주의사항

1. **Next.js Image 컴포넌트**
   - `next/image`는 자동으로 basePath를 처리하지만, CDN 사용 시에는 유틸리티 함수 필요

2. **API 경로**
   - API 경로는 basePath가 자동 적용되므로 수정 불필요

3. **외부 리소스**
   - 이미 절대 URL인 경우 (`http://`, `https://`로 시작) 변경 불필요

## 테스트 방법

### 로컬에서 서브디렉토리 테스트
```bash
# .env.local
NEXT_PUBLIC_BASE_PATH=/test-path

# 빌드 및 실행
pnpm build
pnpm start

# 브라우저에서 확인
http://localhost:3000/test-path
```

### CDN 시뮬레이션 테스트
1. 정적 파일을 별도 서버에 호스팅
2. `NEXT_PUBLIC_ASSET_PREFIX` 설정
3. 네트워크 탭에서 리소스 URL 확인

## Railway 배포 시

Railway 환경 변수에 추가:
- `NEXT_PUBLIC_BASE_PATH`: 필요한 경우만 설정
- `NEXT_PUBLIC_ASSET_PREFIX`: CDN 사용 시 설정

## 문제 해결

### 이미지가 로드되지 않는 경우
1. 브라우저 개발자 도구 > Network 탭 확인
2. 실제 요청 URL과 예상 URL 비교
3. 환경 변수가 제대로 설정되었는지 확인

### 스타일이 깨지는 경우
1. CSS 내 하드코딩된 경로 확인
2. public 폴더 구조 확인
3. 빌드 로그에서 경고 메시지 확인 