#!/bin/bash

# [TRISID] 서한F&C 웹사이트 - DigitalOcean Droplet 자동 배포 스크립트

set -e  # 오류 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
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
DROPLET_USER="root"  # 또는 실제 사용자명
PROJECT_DIR="/var/www/seohan-website"  # 서버의 프로젝트 경로
REPO_URL="https://github.com/co-mostkey/seohanfnc.git"

log_info "TRISID Droplet 배포 시작..."

# 1. 로컬에서 최신 코드 push 확인
log_info "로컬 Git 상태 확인..."
if git diff --exit-code > /dev/null 2>&1; then
    log_success "로컬 변경사항 없음"
else
    log_warning "커밋되지 않은 변경사항이 있습니다"
    echo "계속하시겠습니까? (y/N)"
    read -r response
    if [[ "$response" != "y" && "$response" != "Y" ]]; then
        log_error "배포 중단됨"
        exit 1
    fi
fi

# 2. SSH를 통한 원격 배포
log_info "SSH를 통해 원격 서버에 연결 중..."

# SSH 배포 스크립트 생성
cat > /tmp/deploy_script.sh << 'DEPLOY_SCRIPT'
#!/bin/bash

set -e

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

PROJECT_DIR="/var/www/seohan-website"
BACKUP_DIR="/var/backups/seohan-website"

log_info "=== TRISID Droplet 원격 배포 시작 ==="

# 현재 실행 중인 서비스 중지
log_info "기존 서비스 중지 중..."
if command -v pm2 > /dev/null 2>&1; then
    pm2 stop seohanfnc-website 2>/dev/null || log_info "PM2 서비스가 실행되지 않음"
else
    pkill -f "node.*next" 2>/dev/null || log_info "실행 중인 Node.js 프로세스 없음"
fi

# 프로젝트 디렉토리로 이동
if [ ! -d "$PROJECT_DIR" ]; then
    log_info "프로젝트 디렉토리가 없습니다. 새로 클론합니다..."
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    git clone https://github.com/co-mostkey/seohanfnc.git .
else
    log_info "기존 프로젝트 디렉토리로 이동..."
    cd "$PROJECT_DIR"
fi

# 백업 생성
log_info "현재 코드 백업 중..."
mkdir -p "$BACKUP_DIR"
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
cp -r "$PROJECT_DIR" "$BACKUP_DIR/$BACKUP_NAME" 2>/dev/null || log_info "백업 생성 실패 (계속 진행)"

# Git 업데이트
log_info "최신 코드 가져오는 중..."
git fetch origin
git reset --hard origin/main

# Node.js 및 pnpm 확인
log_info "Node.js 환경 확인..."
if ! command -v node > /dev/null 2>&1; then
    log_error "Node.js가 설치되지 않았습니다"
    exit 1
fi

if ! command -v pnpm > /dev/null 2>&1; then
    log_info "pnpm 설치 중..."
    npm install -g pnpm
fi

# 의존성 설치 및 빌드
log_info "의존성 설치 중..."
rm -rf node_modules .next
pnpm install

log_info "프로덕션 빌드 중..."
pnpm build

# 환경변수 확인
if [ ! -f ".env.production" ]; then
    log_warning ".env.production 파일이 없습니다. 수동으로 생성해주세요."
fi

# PM2로 서비스 시작
log_info "서비스 시작 중..."
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
pm2 start ecosystem.config.js 2>/dev/null || pm2 restart seohanfnc-website

# 서비스 상태 확인
sleep 5
pm2 status

# 헬스체크
log_info "헬스체크 확인 중..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log_success "헬스체크 통과!"
else
    log_error "헬스체크 실패"
    pm2 logs seohanfnc-website --lines 20
    exit 1
fi

log_success "=== 배포 완료! ==="
log_success "웹사이트: http://157.230.38.118:3000/"
log_success "관리자: http://157.230.38.118:3000/admin"
log_success "인트라넷: http://157.230.38.118:3000/intranet"

DEPLOY_SCRIPT

# 원격 서버에서 스크립트 실행
log_info "원격 서버에서 배포 스크립트 실행 중..."
scp /tmp/deploy_script.sh $DROPLET_USER@$DROPLET_IP:/tmp/deploy_script.sh
ssh $DROPLET_USER@$DROPLET_IP "chmod +x /tmp/deploy_script.sh && /tmp/deploy_script.sh"

# 임시 파일 정리
rm -f /tmp/deploy_script.sh

log_success "배포 완료!"
log_info "웹사이트: http://$DROPLET_IP:3000/"
log_info "헬스체크: http://$DROPLET_IP:3000/api/health"

echo ""
echo "🎉 [TRISID] 서한F&C 웹사이트 배포가 성공적으로 완료되었습니다!"
echo ""
echo "📝 배포 후 확인사항:"
echo "   ✓ 웹사이트 정상 접근"
echo "   ✓ 관리자페이지 로그인"
echo "   ✓ 인트라넷 기능 테스트"
echo "   ✓ 이메일 발송 테스트"
echo "" 