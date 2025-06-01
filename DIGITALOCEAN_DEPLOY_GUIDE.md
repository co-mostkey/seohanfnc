# [TRISID] 서한F&C 웹사이트 - DigitalOcean 배포 가이드

## 🚀 DigitalOcean App Platform 배포

### 📋 사전 준비사항

1. **GitHub 리포지토리 준비**
   - 코드가 GitHub에 push되어 있어야 함
   - main 브랜치 사용 권장

2. **환경변수 준비**
   - JWT_SECRET: 32자 이상 랜덤 문자열
   - ADMIN_DEFAULT_PASSWORD: 강력한 관리자 비밀번호
   - SMTP 설정: 이메일 발송용
   - KAKAO_MAP_API_KEY: 카카오 맵 API 키

### 🛠️ 배포 방법 1: GitHub 연동 (권장)

#### 1단계: DigitalOcean App Platform 접속
```
https://cloud.digitalocean.com/apps
```

#### 2단계: 새 앱 생성
1. "Create App" 클릭
2. GitHub 연결 및 리포지토리 선택
3. 브랜치: `main` 선택
4. Auto-deploy 활성화

#### 3단계: 앱 설정
```yaml
# 앱 이름: seohanfnc-website
# 리전: NYC (또는 SGP for Asia)
# Plan: Basic ($5/month)
```

#### 4단계: 빌드 설정
```bash
# Build Command
pnpm build

# Run Command  
pnpm start

# Port: 3000
```

#### 5단계: 환경변수 설정
```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
JWT_SECRET=[32자 랜덤 문자열]
ADMIN_DEFAULT_PASSWORD=[강력한 비밀번호]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[Gmail 주소]
SMTP_PASS=[Gmail 앱 비밀번호]
EMAIL_FROM=noreply@seohanfnc.com
KAKAO_MAP_API_KEY=[카카오 API 키]
```

#### 6단계: 헬스체크 설정
```
HTTP Path: /api/health
Port: 3000
Initial Delay: 10초
Period: 10초
Timeout: 5초
```

### 🐳 배포 방법 2: Docker 컨테이너

#### 1단계: Docker 이미지 빌드
```bash
# 로컬에서 이미지 빌드
docker build -t seohanfnc-website .

# 이미지 태그
docker tag seohanfnc-website registry.digitalocean.com/your-registry/seohanfnc-website:latest
```

#### 2단계: DigitalOcean Container Registry 설정
```bash
# doctl 설치 및 인증
doctl auth init

# 레지스트리 생성
doctl registry create seohanfnc-registry

# Docker 인증
doctl registry login

# 이미지 푸시
docker push registry.digitalocean.com/seohanfnc-registry/seohanfnc-website:latest
```

#### 3단계: App Platform에서 컨테이너 배포
1. "Create App" → "Docker Hub or Container Registry"
2. DigitalOcean Registry 선택
3. 이미지 선택: `seohanfnc-website:latest`

### 🔧 배포 후 설정

#### 1. 도메인 연결
```bash
# 커스텀 도메인 연결 (선택사항)
# App Platform → Settings → Domains
# 도메인: seohanfnc.com
# CNAME: your-app.ondigitalocean.app
```

#### 2. HTTPS 인증서
- Let's Encrypt 자동 적용
- 커스텀 도메인 시 자동 발급

#### 3. 모니터링 설정
- 기본 메트릭스 활성화
- 알림 설정 (CPU, 메모리, 응답시간)

### 📊 배포 확인

#### 1. 헬스체크 확인
```bash
curl https://your-app.ondigitalocean.app/api/health
```

#### 2. 주요 페이지 테스트
```bash
# 홈페이지
curl https://your-app.ondigitalocean.app/

# 관리자페이지  
curl https://your-app.ondigitalocean.app/admin

# 인트라넷
curl https://your-app.ondigitalocean.app/intranet
```

#### 3. 로그 모니터링
```bash
# DigitalOcean Console에서 실시간 로그 확인
# App → Runtime Logs
```

### 💰 비용 추정

#### Basic Plan ($5/month)
- 512MB RAM
- 1 vCPU
- 충분한 트래픽 처리

#### Pro Plan ($12/month) - 권장
- 1GB RAM  
- 1 vCPU
- 더 안정적인 성능

### 🔄 자동 배포 설정

#### GitHub Actions (선택사항)
```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to DigitalOcean
        uses: digitalocean/app_action@main
        with:
          app_name: seohanfnc-website
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
```

### 🛡️ 보안 설정

1. **환경변수 암호화**
   - 모든 SECRET 타입으로 설정
   - 정기적인 비밀번호 변경

2. **방화벽 설정**
   - App Platform 기본 보안 적용
   - HTTPS 강제 적용

3. **백업 설정**
   - 코드: GitHub 자동 백업
   - 데이터: 정기적 백업 스크립트

### 📞 배포 지원

- **개발팀**: TRISID
- **플랫폼**: DigitalOcean App Platform  
- **예상 비용**: $5-12/month
- **배포 시간**: 5-10분

---

**🎯 배포 완료 후 확인사항**:
1. ✅ 헬스체크 통과
2. ✅ 홈페이지 정상 로딩
3. ✅ 관리자페이지 접근 가능
4. ✅ 인트라넷 기능 정상
5. ✅ 이메일 발송 테스트
6. ✅ 카카오 맵 정상 작동 