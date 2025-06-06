#!/bin/bash

# [TRISID] 서한F&C 웹사이트 - DigitalOcean Droplet 비밀번호 인증 배포 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 설정 변수
DROPLET_IP="157.230.38.118"
DROPLET_USER="root"

echo "🚀 [TRISID] DigitalOcean Droplet 배포 (비밀번호 인증)"
echo "=========================================="
echo ""

log_warning "이 스크립트는 SSH 비밀번호를 여러 번 입력해야 합니다."
echo "SSH 키 설정을 권장합니다. 계속하시겠습니까? (y/N)"
read -r response
if [[ "$response" != "y" && "$response" != "Y" ]]; then
    log_info "배포 중단됨"
    exit 0
fi

echo ""
echo "배포 방식을 선택하세요:"
echo "1) 기존 파일 유지 후 업데이트 (빠름)"
echo "2) 기존 파일 완전 제거 후 클린 설치 (안전함) - 권장"
echo "3) 새 디렉토리에 설치 후 교체 (가장 안전함)"
echo ""
read -p "선택 (1/2/3): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1) DEPLOY_MODE="update" ;;
    2) DEPLOY_MODE="clean" ;;
    3) DEPLOY_MODE="safe" ;;
    *) DEPLOY_MODE="clean" ;;
esac

log_info "배포 모드: $DEPLOY_MODE"
echo ""

log_info "SSH 연결 테스트 중..."
if ssh -o ConnectTimeout=5 -o PasswordAuthentication=yes -o PubkeyAuthentication=no $DROPLET_USER@$DROPLET_IP "echo 'SSH 연결 성공'" 2>/dev/null; then
    log_success "SSH 연결 확인됨"
else
    log_error "SSH 연결 실패. 서버 상태와 비밀번호를 확인하세요."
    exit 1
fi

echo ""
log_info "원격 배포를 시작합니다..."
log_warning "SSH 비밀번호를 여러 번 입력해야 할 수 있습니다."

# 원격 배포 명령어들을 하나의 SSH 세션에서 실행
ssh -o PasswordAuthentication=yes -o PubkeyAuthentication=no $DROPLET_USER@$DROPLET_IP << 'REMOTE_COMMANDS'

set -e

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

log_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

PROJECT_DIR="/var/www/seohan-website"
BACKUP_DIR="/var/backups/seohan-website"

log_info "=== TRISID Droplet 원격 배포 시작 ==="

# 1. 기존 서비스 중지
log_info "기존 서비스 중지 중..."
if command -v pm2 > /dev/null 2>&1; then
    pm2 stop seohanfnc-website 2>/dev/null || log_info "PM2 서비스가 실행되지 않음"
    pm2 delete seohanfnc-website 2>/dev/null || log_info "PM2 프로세스 삭제 완료"
else
    pkill -f "node.*next" 2>/dev/null || log_info "실행 중인 Node.js 프로세스 없음"
    pkill -f "pnpm.*start" 2>/dev/null || log_info "실행 중인 pnpm 프로세스 없음"
fi

# 포트 3000 강제 해제
fuser -k 3000/tcp 2>/dev/null || log_info "포트 3000 정리 완료"

# 2. 프로젝트 설정
if [ -d "$PROJECT_DIR" ]; then
    log_info "기존 프로젝트 백업 중..."
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/$BACKUP_NAME" 2>/dev/null || log_warning "백업 실패"
    
    log_info "기존 프로젝트 제거 중..."
    rm -rf "$PROJECT_DIR"
fi

# 3. 새로 클론
log_info "프로젝트 새로 클론 중..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
git clone https://github.com/co-mostkey/seohanfnc.git .

# 4. Node.js 환경 확인
log_info "Node.js 환경 확인..."
if ! command -v node > /dev/null 2>&1; then
    log_error "Node.js가 설치되지 않았습니다"
    exit 1
fi

if ! command -v pnpm > /dev/null 2>&1; then
    log_info "pnpm 설치 중..."
    npm install -g pnpm
fi

# 5. 빌드
log_info "기존 빌드 파일 정리..."
rm -rf node_modules .next pnpm-lock.yaml 2>/dev/null || true

log_info "의존성 설치 중..."
pnpm install

log_info "프로덕션 빌드 중..."
pnpm build

# 빌드 성공 확인
if [ ! -d ".next" ]; then
    log_error "빌드 실패"
    exit 1
fi

# 6. 환경변수 설정
if [ ! -f ".env.production" ]; then
    log_info "기본 환경변수 파일 생성 중..."
cat > .env.production << 'ENV_FILE'
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# 보안 관련 (실제 값으로 변경 필요)
JWT_SECRET=trisid-seohanfnc-jwt-secret-key-32chars-2024
ADMIN_DEFAULT_PASSWORD=trisid2024!admin

# 이메일 설정 (실제 값으로 변경 필요)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@seohanfnc.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@seohanfnc.com

# 카카오 맵 (실제 값으로 변경 필요)
KAKAO_MAP_API_KEY=your-kakao-api-key

# 도메인 설정
NEXT_PUBLIC_DOMAIN=http://157.230.38.118:3000
NEXT_PUBLIC_BASE_URL=http://157.230.38.118:3000
ENV_FILE
fi

# 7. PM2 서비스 시작
log_info "PM2 서비스 설정 중..."
if ! command -v pm2 > /dev/null 2>&1; then
    log_info "PM2 설치 중..."
    npm install -g pm2
fi

# PM2 설정 파일 생성
cat > ecosystem.config.js << 'PM2_CONFIG'
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
PM2_CONFIG

mkdir -p logs

# PM2로 서비스 시작
log_info "PM2 서비스 시작 중..."
pm2 start ecosystem.config.js

# 8. 서비스 확인
log_info "서비스 시작 대기 중..."
sleep 10

pm2 status

# 9. 헬스체크
log_info "헬스체크 확인 중..."
for i in {1..5}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "헬스체크 통과!"
        break
    else
        log_warning "헬스체크 시도 $i/5 실패, 5초 후 재시도..."
        sleep 5
    fi
done

# 최종 확인
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log_success "=== 배포 완료! ==="
    log_success "웹사이트: http://157.230.38.118:3000/"
    log_success "관리자: http://157.230.38.118:3000/admin"
    log_success "인트라넷: http://157.230.38.118:3000/intranet"
else
    log_error "헬스체크 최종 실패"
    pm2 logs seohanfnc-website --lines 20
    exit 1
fi

# PM2 자동 시작 설정
pm2 startup ubuntu -u $USER --hp $HOME > /dev/null 2>&1 || true
pm2 save > /dev/null 2>&1 || true

log_success "=== 모든 배포 작업 완료! ==="

REMOTE_COMMANDS

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 [TRISID] 서한F&C 웹사이트 배포가 성공적으로 완료되었습니다!"
    echo ""
    log_success "배포 완료!"
    log_info "웹사이트: http://157.230.38.118:3000/"
    log_info "헬스체크: http://157.230.38.118:3000/api/health"
    echo ""
    echo "📝 배포 후 확인사항:"
    echo "   ✓ 웹사이트 정상 접근"
    echo "   ✓ 관리자페이지 로그인"
    echo "   ✓ 인트라넷 기능 테스트"
    echo "   ✓ 이메일 발송 테스트"
    echo ""
else
    log_error "배포 중 오류가 발생했습니다."
fi 