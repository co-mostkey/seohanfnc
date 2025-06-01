# [TRISID] 서한F&C 웹사이트 배포 가이드

## 📋 프로젝트 현황 (2024년 최신)

### 🔧 기술 스택
- **프레임워크**: Next.js 15.3.3 (App Router)
- **런타임**: Node.js 20.x LTS
- **패키지 매니저**: pnpm 10.x
- **언어**: TypeScript 5.8.3, JavaScript (혼용)
- **스타일링**: Tailwind CSS 3.4.17
- **UI 컴포넌트**: Shadcn UI, Lucide React 0.454.0
- **애니메이션**: Framer Motion 12.15.0
- **상태관리**: React Hooks, Context API
- **데이터 저장**: 파일시스템 기반 (JSON)

### 🏗️ 아키텍처
- **홈페이지**: 일반 사용자용 공개 웹사이트
- **관리자페이지**: 콘텐츠 관리 시스템 (CMS)
- **인트라넷**: 내부 직원용 시스템
- **API**: RESTful API (Next.js API Routes)
- **배포**: DigitalOcean Cloud (Linux 서버)

## 🚀 배포 전 체크리스트

### ✅ 필수 검증 항목

1. **환경 설정**
   - [ ] Node.js 20.x 설치 확인
   - [ ] pnpm 최신 버전 설치
   - [ ] 환경변수 설정 (.env.production)

2. **코드 품질**
   - [x] TypeScript 컴파일 (경고 허용)
   - [x] 보안 취약점 검사 (pnpm audit)
   - [x] 빌드 성공 확인
   - [x] 린트 검사 (eslint)

3. **설정 파일**
   - [x] next.config.js (standalone 모드)
   - [x] middleware.ts (experimental-edge runtime)
   - [x] tsconfig.json
   - [x] tailwind.config.js

4. **데이터 무결성**
   - [x] data/ 폴더 구조 확인
   - [x] JSON 파일 유효성 검증
   - [x] 이미지 파일 경로 확인

## 🔧 배포 명령어

### 로컬 테스트
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 배포 전 검증
node scripts/pre-deploy-check.js
```

### 프로덕션 배포
```bash
# 1. 코드 정리
pnpm clean

# 2. 의존성 재설치
pnpm install --frozen-lockfile

# 3. 프로덕션 빌드
NODE_ENV=production pnpm build

# 4. 서버 시작
NODE_ENV=production pnpm start
```

## 🛡️ 보안 설정

### 환경변수 (.env.production)
```bash
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# 관리자 인증
ADMIN_SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# 파일 업로드
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/uploads

# 이메일 설정
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

### 서버 설정
- **포트**: 3000 (기본값)
- **프로세스 관리**: PM2 권장
- **리버스 프록시**: Nginx
- **SSL**: Let's Encrypt 또는 CloudFlare

## 📁 파일 구조

```
/
├── app/                 # Next.js App Router
│   ├── admin/          # 관리자페이지
│   ├── intranet/       # 인트라넷
│   ├── api/            # API 라우트
│   └── ...             # 홈페이지 페이지
├── components/         # 재사용 컴포넌트
├── data/              # 파일시스템 데이터
│   ├── db/            # 실제 데이터
│   └── backups/       # 백업 파일
├── lib/               # 유틸리티 함수
├── types/             # TypeScript 타입 정의
├── public/            # 정적 파일
└── scripts/           # 배포/관리 스크립트
```

## 🔍 문제 해결

### 흰 화면 오류 방지
1. **Middleware 설정**: experimental-edge runtime 사용
2. **빌드 설정**: standalone 모드 활성화
3. **환경변수**: 프로덕션 환경에서 올바른 값 설정
4. **파일 권한**: 업로드 디렉토리 쓰기 권한 확인

### 일반적인 오류
- **Module not found**: pnpm install 재실행
- **Build failed**: .next 폴더 삭제 후 재빌드
- **Port in use**: 다른 포트 사용 또는 프로세스 종료
- **Permission denied**: 파일 권한 확인

## 📊 성능 최적화

### 빌드 최적화
- [x] 이미지 최적화 비활성화 (호환성)
- [x] Standalone 모드 (Docker 친화적)
- [x] Tree shaking 활성화
- [x] 코드 분할 자동화

### 런타임 최적화
- [x] Static Generation (SSG) 활용
- [x] API 라우트 최적화
- [x] 이미지 lazy loading
- [x] 번들 크기 최소화

## 🔄 CI/CD (향후 계획)

### GitHub Actions
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - name: Deploy to DigitalOcean
        # 배포 스크립트 실행
```

## 📞 지원 및 문의

- **개발팀**: TRISID
- **프로젝트**: 서한F&C 웹사이트
- **버전**: 0.1.0
- **최종 업데이트**: 2024년

---

**⚠️ 중요**: 배포 전 반드시 `node scripts/pre-deploy-check.js`를 실행하여 모든 검증을 통과했는지 확인하세요. 