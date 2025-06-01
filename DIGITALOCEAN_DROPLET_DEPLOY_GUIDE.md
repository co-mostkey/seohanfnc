# [TRISID] 서한F&C 웹사이트 - DigitalOcean Droplet 재배포 가이드

## 🚀 기존 TRISID Droplet 재배포

### 📋 현재 서버 정보
- **서버명**: TRISID
- **IP**: 157.230.38.118
- **스펙**: 2GB Memory / 25GB Disk / SGP1
- **OS**: Ubuntu 22.04 (LTS) x64
- **상태**: 활성화됨

---

## 🔧 1단계: 서버 접속 및 환경 확인

### SSH 접속
```bash
# SSH로 droplet 접속
ssh root@157.230.38.118

# 또는 사용자 계정이 있는 경우
ssh username@157.230.38.118
```

### 현재 환경 확인
```bash
# Node.js 버전 확인
node --version

# pnpm 확인
pnpm --version

# 기존 프로젝트 확인
ls -la
ps aux | grep node
```

---

## 🛠️ 2단계: 기존 서비스 중지

### 실행 중인 Node.js 프로세스 확인 및 중지
```bash
# 실행 중인 Node.js 프로세스 확인
ps aux | grep node
ps aux | grep next

# PM2로 관리되는 경우
pm2 list
pm2 stop all

# 직접 실행된 경우 프로세스 종료
pkill -f node
pkill -f next
```

### 포트 3000 사용 확인
```bash
# 포트 3000 사용 중인 프로세스 확인
netstat -tlnp | grep :3000
lsof -i :3000

# 필요시 강제 종료
sudo fuser -k 3000/tcp
```

---

## 📦 3단계: 코드 업데이트

### 기존 프로젝트 디렉토리로 이동
```bash
# 기존 프로젝트 위치 확인 (일반적인 위치들)
cd /var/www/seohan-website
# 또는
cd /home/ubuntu/seohan-website
# 또는
cd ~/seohan-website

# 현재 디렉토리 확인
pwd
ls -la
```

### Git으로 최신 코드 가져오기
```bash
# 기존 코드 백업
cp -r . ../backup-$(date +%Y%m%d-%H%M%S)

# Git 상태 확인
git status
git remote -v

# 최신 코드 가져오기
git fetch origin
git checkout main
git pull origin main

# 또는 새로 클론하는 경우
cd ..
git clone https://github.com/co-mostkey/seohanfnc.git new-seohan-website
cd new-seohan-website
```

---

## 🔨 4단계: 의존성 설치 및 빌드

### 환경 준비
```bash
# Node.js 20.x 설치 (필요한 경우)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm 설치/업데이트
npm install -g pnpm@latest

# pnpm 버전 확인
pnpm --version
```

### 프로젝트 빌드
```bash
# node_modules 삭제 (깔끔한 설치)
rm -rf node_modules
rm -f pnpm-lock.yaml

# 의존성 설치
pnpm install

# 프로덕션 빌드
pnpm build

# 빌드 결과 확인
ls -la .next/
```

---

## 🌍 5단계: 환경변수 설정

### .env.production 파일 생성
```bash
# 환경변수 파일 생성
nano .env.production
```

```env
# .env.production 내용
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# 보안 관련
JWT_SECRET=your-32-character-secret-key-here
ADMIN_DEFAULT_PASSWORD=your-strong-admin-password

# 이메일 설정
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@seohanfnc.com

# 카카오 맵
KAKAO_MAP_API_KEY=your-kakao-api-key

# 도메인 설정
NEXT_PUBLIC_DOMAIN=http://157.230.38.118:3000
NEXT_PUBLIC_BASE_URL=http://157.230.38.118:3000
```

---

## 🚀 6단계: 서비스 시작

### PM2로 프로덕션 서비스 관리 (권장)
```bash
# PM2 설치
npm install -g pm2

# PM2 설정 파일 생성
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'seohanfnc-website',
    script: 'pnpm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# 로그 디렉토리 생성
mkdir -p logs

# PM2로 서비스 시작
pm2 start ecosystem.config.js

# PM2 상태 확인
pm2 status
pm2 logs

# 시스템 재부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

### 직접 실행 (대안)
```bash
# 백그라운드에서 실행
nohup pnpm start > server.log 2>&1 &

# 프로세스 확인
ps aux | grep node
```

---

## 🔍 7단계: 배포 확인

### 서비스 상태 확인
```bash
# 포트 3000 리스닝 확인
netstat -tlnp | grep :3000

# 헬스체크
curl http://localhost:3000/api/health
curl http://157.230.38.118:3000/api/health

# 홈페이지 확인
curl -I http://157.230.38.118:3000/
```

### 브라우저에서 확인
- **홈페이지**: http://157.230.38.118:3000/
- **관리자**: http://157.230.38.118:3000/admin
- **인트라넷**: http://157.230.38.118:3000/intranet
- **헬스체크**: http://157.230.38.118:3000/api/health

---

## 🛡️ 8단계: 보안 및 최적화 (선택사항)

### Nginx 리버스 프록시 설정
```bash
# Nginx 설치
sudo apt update
sudo apt install nginx

# Nginx 설정
sudo nano /etc/nginx/sites-available/seohanfnc

# 설정 내용
server {
    listen 80;
    server_name 157.230.38.118;

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
}

# 설정 활성화
sudo ln -s /etc/nginx/sites-available/seohanfnc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 방화벽 설정
```bash
# UFW 방화벽 설정
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw enable

# 방화벽 상태 확인
sudo ufw status
```

---

## 🔄 9단계: 모니터링 및 로그

### PM2 모니터링
```bash
# PM2 상태 확인
pm2 status
pm2 monit

# 로그 확인
pm2 logs seohanfnc-website
pm2 logs --lines 100

# 메모리/CPU 사용량 확인
pm2 show seohanfnc-website
```

### 시스템 리소스 확인
```bash
# 메모리 사용량
free -h

# 디스크 사용량
df -h

# CPU 사용률
top
htop
```

---

## 🚨 문제 해결

### 일반적인 문제들

#### 1. 포트 3000이 이미 사용 중
```bash
sudo fuser -k 3000/tcp
pm2 restart all
```

#### 2. 메모리 부족
```bash
# 메모리 확인
free -h

# PM2 재시작
pm2 restart seohanfnc-website
```

#### 3. 빌드 실패
```bash
# node_modules 재설치
rm -rf node_modules .next
pnpm install
pnpm build
```

#### 4. 권한 문제
```bash
# 프로젝트 디렉토리 권한 설정
sudo chown -R $USER:$USER .
chmod -R 755 .
```

---

## 📋 배포 체크리스트

- [ ] SSH 접속 성공
- [ ] 기존 서비스 중지
- [ ] 최신 코드 업데이트
- [ ] 의존성 설치 완료
- [ ] 프로덕션 빌드 성공
- [ ] 환경변수 설정
- [ ] PM2 서비스 시작
- [ ] 포트 3000 리스닝 확인
- [ ] 헬스체크 통과
- [ ] 홈페이지 접근 가능
- [ ] 관리자페이지 접근 가능
- [ ] 인트라넷 접근 가능

---

**🎯 배포 완료! 서비스가 http://157.230.38.118:3000/ 에서 실행 중입니다.** 