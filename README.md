# 서한에프앤씨 웹사이트

서한에프앤씨 기업 웹사이트 프로젝트입니다.

## 콘텐츠 이관 가이드

이 프로젝트는 `C:\Users\comos\seohan-website`에서 콘텐츠를 이관하는 기능을 포함하고 있습니다.

### 1. 콘텐츠 이관 방법

아래 명령을 사용하여 자동으로 콘텐츠를 이관할 수 있습니다:

```bash
# 콘텐츠 이관 스크립트 실행
npm run migrate
```

이 스크립트는 다음 작업을 수행합니다:

1. 제품 데이터 JSON 이관 (products.json)
2. 제품 문서 데이터 이관 (documents.json)
3. 제품 문서 파일 복사 (PDF 등)
4. 제품 이미지 복사
5. 각 제품에 대한 정적 페이지 생성

### 2. 이관된 콘텐츠 확인

이관 후 다음 위치에서 콘텐츠를 확인하세요:

- 제품 데이터: `content/data/products/products.json`
- 제품 이미지: `public/assets/images/products/`
- 제품 문서: `public/assets/documents/`
- 제품 페이지: `app/products/[product-id]/page.tsx`

### 3. 메뉴 구조

메뉴는 `components/header.tsx`에 정의되어 있으며, 다음 항목을 포함하고 있습니다:

```
- 회사소개
  - CEO 인사말
  - 연혁
  - 오시는 길
- 제품소개
  - 소방설비
  - 안전장비
- 연구개발
  - 기술연구소
  - 특허 및 인증
- 고객지원
  - 공지사항
  - 문의하기
```

새로운 카테고리가 필요한 경우 `header.tsx`의 `menuItems` 배열을 수정하세요.

### 4. 다국어 지원

제품 데이터는 한국어(Ko), 영어(En), 중국어(Cn) 필드를 포함하고 있습니다. 제품 상세 페이지 및 목록 페이지는 이 필드를 활용하여 구현되었습니다.

### 5. 개발 및 배포

#### 개발 서버 실행

```bash
npm run dev
```

#### 빌드 및 배포

```bash
# 빌드만 실행
npm run build

# 빌드 후 FTP 배포
npm run deploy
```

## 프로젝트 구조

- `app/`: Next.js 애플리케이션 페이지
- `components/`: 공통 컴포넌트
- `content/`: 이관된 콘텐츠 데이터
- `public/`: 정적 파일 (이미지, 문서 등)
- `scripts/`: 유틸리티 스크립트 (이관, 배포 등)
- `styles/`: 스타일 관련 파일
- `types/`: TypeScript 타입 정의

## 사전 준비사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- FTP 서버 접근 정보

## 2. 콘텐츠 확인 및 수정

콘텐츠가 이관된 후에는 다음 사항을 확인하세요:

- `/data` 디렉토리에 제품 정보가 올바르게 복사되었는지 확인
- `/content` 디렉토리에 페이지별 콘텐츠가 올바르게 복사되었는지 확인
- `/public/assets` 디렉토리에 이미지가 올바르게 복사되었는지 확인

## 6. 문제 해결

배포 과정에서 문제가 발생하면:

1. 콘솔 로그를 확인하여 오류 메시지 확인
2. `.next` 및 `node_modules` 디렉토리를 삭제하고 `npm install`로 의존성 재설치
3. `npm run build`로 다시 빌드 시도

## 연락처

문제가 지속되거나 추가 지원이 필요한 경우 관리자에게 문의하세요. 