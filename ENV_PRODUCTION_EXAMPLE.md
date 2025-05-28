# 프로덕션 환경 변수 설정 가이드

## .env.production 파일 생성

프로젝트 루트에 `.env.production` 파일을 생성하고 아래 내용을 복사하여 실제 값으로 변경하세요.

```env
# ===== 기본 설정 =====
NODE_ENV=production
PORT=3000

# ===== 도메인 설정 =====
# 실제 도메인으로 변경 필요
NEXT_PUBLIC_DOMAIN=https://seohanfnc.com
NEXT_PUBLIC_BASE_URL=https://seohanfnc.com

# ===== 데이터 디렉토리 =====
DATA_DIR=./content/data
UPLOAD_DIR=./public/uploads

# ===== 로그 설정 =====
LOG_LEVEL=info
LOG_DIR=./logs

# ===== 백업 설정 =====
BACKUP_ENABLED=true
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30

# ===== 보안 설정 (반드시 변경!) =====
JWT_SECRET=your-super-secret-jwt-key-change-this-immediately
ADMIN_DEFAULT_PASSWORD=change-this-admin-password-immediately

# ===== 이메일 설정 =====
# Gmail 사용 시 앱 비밀번호 필요
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=noreply@seohanfnc.com

# ===== 카카오 맵 API =====
# https://developers.kakao.com/ 에서 발급
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your-kakao-map-api-key-here

# ===== Google Analytics (선택사항) =====
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ===== 서버 설정 =====
SERVER_NAME=seohanfnc-web
MAX_UPLOAD_SIZE=50MB
REQUEST_TIMEOUT=30000

# ===== 캐시 설정 =====
CACHE_TTL=3600
STATIC_CACHE_TTL=86400
```

## 중요 보안 사항

### 1. JWT_SECRET
- 최소 32자 이상의 랜덤 문자열 사용
- 생성 방법: `openssl rand -base64 32`

### 2. ADMIN_DEFAULT_PASSWORD
- 복잡한 비밀번호 사용 (대소문자, 숫자, 특수문자 포함)
- 첫 로그인 후 즉시 변경

### 3. SMTP 설정
- Gmail 사용 시: 2단계 인증 활성화 후 앱 비밀번호 생성
- 다른 SMTP 서비스 사용 가능

### 4. 카카오 맵 API
- 도메인 등록 필요
- 일일 할당량 확인

## NHN 클라우드 배포 시 추가 설정

### 1. 환경 변수 설정
```bash
# NHN 클라우드 인스턴스에서
sudo nano /etc/environment

# 또는 systemd 서비스 파일에 추가
sudo nano /etc/systemd/system/seohanfnc.service
```

### 2. PM2 ecosystem 파일에 환경 변수 추가
```javascript
module.exports = {
  apps: [{
    name: 'seohanfnc-website',
    script: './node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // 여기에 모든 환경 변수 추가
    }
  }]
}
```

### 3. Docker 사용 시
```dockerfile
# Dockerfile에서
ENV NODE_ENV=production
ENV PORT=3000
# ... 기타 환경 변수

# 또는 docker-compose.yml에서
environment:
  - NODE_ENV=production
  - PORT=3000
  # ... 기타 환경 변수
```

## 환경 변수 확인

배포 후 환경 변수가 제대로 설정되었는지 확인:

```bash
# 헬스체크 API 호출
curl https://your-domain.com/api/health

# PM2 환경 변수 확인
pm2 env 0

# 프로세스 환경 변수 확인
ps eww -o command <PID>
``` 