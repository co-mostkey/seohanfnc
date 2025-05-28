# 🚀 서한F&C 웹사이트 배포 가이드

## 📋 배포 전 체크리스트

### ✅ **필수 확인사항**
- [x] TypeScript 컴파일 오류: **0개** ✨
- [x] 프로덕션 빌드 성공: **완료** ✨
- [x] 모든 제품 데이터 로딩: **50+ 제품** ✨
- [x] 파일 시스템 기반 안정성: **확보** ✨
- [x] 헬스체크 API: **구현완료** ✨

---

## 🏗️ **NHN 클라우드 배포 단계**

### **1단계: 환경 준비**

#### **서버 요구사항 (고급 보안 강화)**- **OS**: Ubuntu 22.04 LTS 이상 (보안 업데이트 적용)- **Node.js**: 22.x LTS 이상 (최신 보안 패치 적용)- **메모리**: 최소 2GB, 권장 4GB- **디스크**: 최소 10GB, 권장 20GB- **포트**: 3000 (또는 환경에 맞게 조정)- **Docker**: 최신 버전 (컨테이너 배포 시)

#### **필수 패키지 설치**
```bash
# Node.js 22 LTS 설치curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -sudo apt-get install -y nodejs

# pnpm 설치
npm install -g pnpm

# PM2 설치 (프로세스 관리)
npm install -g pm2
```

### **2단계: 소스코드 배포**

#### **방법 1: Git 클론 (권장)**
```bash
# 프로젝트 클론
git clone <repository-url> /var/www/seohanfnc
cd /var/www/seohanfnc

# 의존성 설치
pnpm install --frozen-lockfile

# 프로덕션 빌드
pnpm build
```

#### **방법 2: 파일 업로드**
```bash
# 압축 해제 후
cd /var/www/seohanfnc
pnpm install --production
pnpm build
```

### **3단계: 환경 설정**

#### **환경 변수 파일 생성**
```bash
# .env.production 파일 생성
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_DOMAIN=https://your-domain.com
DATA_DIR=./content/data
LOG_LEVEL=info
BACKUP_ENABLED=true
EOF
```

#### **디렉토리 권한 설정**
```bash
# 소유권 설정
sudo chown -R www-data:www-data /var/www/seohanfnc

# 권한 설정
sudo chmod -R 755 /var/www/seohanfnc
sudo chmod -R 766 /var/www/seohanfnc/content/data
sudo chmod -R 766 /var/www/seohanfnc/public/uploads
sudo chmod -R 766 /var/www/seohanfnc/logs
```

### **4단계: PM2로 프로세스 관리**

#### **PM2 설정 파일 생성**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'seohanfnc-website',
    script: 'server.js',
    cwd: '/var/www/seohanfnc',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
```

#### **PM2 시작**
```bash
# PM2로 애플리케이션 시작
pm2 start ecosystem.config.js

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status
pm2 logs seohanfnc-website
```

### **5단계: Nginx 리버스 프록시 설정**

#### **Nginx 설치 및 설정**
```bash
# Nginx 설치
sudo apt update
sudo apt install nginx

# 설정 파일 생성
sudo nano /etc/nginx/sites-available/seohanfnc
```

#### **Nginx 설정 예시**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # SSL 리디렉션 (HTTPS 설정 시)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 인증서 설정 (실제 경로로 변경)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # 정적 파일 캐싱
    location /_next/static/ {
        alias /var/www/seohanfnc/.next/static/;
        expires 1y;
        access_log off;
    }

    location /images/ {
        alias /var/www/seohanfnc/public/images/;
        expires 30d;
        access_log off;
    }

    # Next.js 프록시
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 헬스체크
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
```

#### **Nginx 활성화**
```bash
# 사이트 활성화
sudo ln -s /etc/nginx/sites-available/seohanfnc /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔧 **운영 관리**

### **모니터링**
```bash
# 애플리케이션 상태 확인
pm2 status
pm2 monit

# 로그 확인
pm2 logs seohanfnc-website --lines 100

# 헬스체크
curl -f http://localhost:3000/api/health
```

### **백업**
```bash
# 데이터 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "/backup/seohanfnc_${DATE}.tar.gz" /var/www/seohanfnc/content/data
```

### **업데이트**
```bash
# 코드 업데이트
cd /var/www/seohanfnc
git pull origin main

# 빌드 및 재시작
pnpm install
pnpm build
pm2 restart seohanfnc-website
```

---

## 🚨 **트러블슈팅**

### **일반적인 문제**

#### **1. 빌드 실패**
```bash
# 캐시 정리 후 재빌드
pnpm clean
pnpm install
pnpm build
```

#### **2. 파일 권한 오류**
```bash
# 권한 재설정
sudo chown -R www-data:www-data /var/www/seohanfnc
sudo chmod -R 755 /var/www/seohanfnc
```

#### **3. 메모리 부족**
```bash
# PM2 인스턴스 수 조정
pm2 scale seohanfnc-website 2
```

### **로그 위치**
- **애플리케이션 로그**: `/var/www/seohanfnc/logs/`
- **PM2 로그**: `~/.pm2/logs/`
- **Nginx 로그**: `/var/log/nginx/`

---

## 📞 **지원 연락처**

배포 중 문제가 발생하면 다음 정보를 포함하여 문의하세요:
- 오류 메시지
- 로그 파일 내용
- 시스템 환경 정보
- 수행한 단계

---

## 🎯 **배포 완료 확인**

✅ **최종 확인사항:**
1. 웹사이트 접속 확인: `https://your-domain.com`
2. 헬스체크 응답: `https://your-domain.com/api/health`
3. 제품 페이지 로딩: `https://your-domain.com/products`
4. 관리자 페이지 접근: `https://your-domain.com/admin`
5. SSL 인증서 적용 확인
6. 모든 주요 기능 테스트

**🎉 배포 완료! 서한F&C 웹사이트가 성공적으로 운영 중입니다.** 