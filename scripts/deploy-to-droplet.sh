#!/bin/bash

# [TRISID] 서한F&C 웹사이트 - DigitalOcean Droplet 자동 배포 스크립트 (개선 버전)

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

# SSH 연결 설정
SSH_KEY="~/.ssh/digitalocean_rsa"
SSH_OPTIONS="-i $SSH_KEY -o ConnectTimeout=10 -o StrictHostKeyChecking=no"

echo "🚀 [TRISID] DigitalOcean Droplet 자동 배포"
echo "=========================================="
echo ""

# 배포 옵션 선택
echo "배포 방식을 선택하세요:"
echo "1) 기존 파일 유지 후 업데이트 (빠름, 위험도 중간)"
echo "2) 기존 파일 완전 제거 후 클린 설치 (느림, 안전함) - 권장"
echo "3) 새 디렉토리에 설치 후 교체 (가장 안전함)"
echo ""
read -p "선택 (1/2/3): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        DEPLOY_MODE="update"
        log_info "기존 파일 유지 후 업데이트 모드 선택"
        ;;
    2)
        DEPLOY_MODE="clean"
        log_warning "기존 파일 완전 제거 후 클린 설치 모드 선택"
        ;;
    3)
        DEPLOY_MODE="safe"
        log_info "새 디렉토리 설치 후 교체 모드 선택 (가장 안전)"
        ;;
    *)
        log_error "잘못된 선택입니다. 2번(클린 설치)으로 진행합니다."
        DEPLOY_MODE="clean"
        ;;
esac

echo ""
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

# SSH 연결 테스트
log_info "SSH 연결 테스트 중..."
if ssh $SSH_OPTIONS $DROPLET_USER@$DROPLET_IP "echo 'SSH 연결 성공'" 2>/dev/null; then
    log_success "SSH 연결 확인됨"
else
    log_error "SSH 연결 실패. SSH 키와 서버 상태를 확인하세요."
    exit 1
fi

# SSH 배포 스크립트 생성
cat > /tmp/deploy_script.sh << DEPLOY_SCRIPT
#!/bin/bash

set -e

log_info() {
    echo -e "\033[0;34m[INFO]\033[0m \$1"
}

log_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m \$1"
}

log_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m \$1"
}

log_error() {
    echo -e "\033[0;31m[ERROR]\033[0m \$1"
}

PROJECT_DIR="$PROJECT_DIR"
BACKUP_DIR="/var/backups/seohan-website"
DEPLOY_MODE="$DEPLOY_MODE"

log_info "=== TRISID Droplet 원격 배포 시작 ==="
log_info "배포 모드: \$DEPLOY_MODE"

# 1. 현재 실행 중인 서비스 중지
log_info "기존 서비스 중지 중..."
if command -v pm2 > /dev/null 2>&1; then
    pm2 stop seohanfnc-website 2>/dev/null || log_info "PM2 서비스가 실행되지 않음"
    pm2 delete seohanfnc-website 2>/dev/null || log_info "PM2 프로세스 삭제 완료"
else
    pkill -f "node.*next" 2>/dev/null || log_info "실행 중인 Node.js 프로세스 없음"
    pkill -f "pnpm.*start" 2>/dev/null || log_info "실행 중인 pnpm 프로세스 없음"
fi

# 포트 3000 강제 해제
sudo fuser -k 3000/tcp 2>/dev/null || log_info "포트 3000 정리 완료"

# 2. 배포 모드별 처리
case \$DEPLOY_MODE in
    "update")
        log_info "=== 업데이트 모드 배포 ==="
        if [ ! -d "\$PROJECT_DIR" ]; then
            log_info "프로젝트 디렉토리가 없습니다. 새로 클론합니다..."
            mkdir -p "\$PROJECT_DIR"
            cd "\$PROJECT_DIR"
            git clone $REPO_URL .
        else
            log_info "기존 프로젝트 디렉토리에서 업데이트..."
            cd "\$PROJECT_DIR"
            
            # 백업 생성
            log_info "현재 코드 백업 중..."
            mkdir -p "\$BACKUP_DIR"
            BACKUP_NAME="backup-\$(date +%Y%m%d-%H%M%S)"
            cp -r "\$PROJECT_DIR" "\$BACKUP_DIR/\$BACKUP_NAME" 2>/dev/null || log_info "백업 생성 실패 (계속 진행)"
            
            # Git 업데이트
            git fetch origin
            git reset --hard origin/main
        fi
        ;;
        
    "clean")
        log_warning "=== 클린 설치 모드 배포 ==="
        
        # 기존 디렉토리 백업
        if [ -d "\$PROJECT_DIR" ]; then
            log_info "기존 프로젝트 전체 백업 중..."
            mkdir -p "\$BACKUP_DIR"
            BACKUP_NAME="full-backup-\$(date +%Y%m%d-%H%M%S)"
            mv "\$PROJECT_DIR" "\$BACKUP_DIR/\$BACKUP_NAME" 2>/dev/null || log_warning "백업 이동 실패"
        fi
        
        # 완전히 새로 설치
        log_info "프로젝트 디렉토리 새로 생성 중..."
        mkdir -p "\$PROJECT_DIR"
        cd "\$PROJECT_DIR"
        git clone $REPO_URL .
        ;;
        
    "safe")
        log_info "=== 안전 모드 배포 ==="
        
        # 임시 디렉토리에 설치
        TEMP_DIR="/tmp/seohan-website-new-\$(date +%Y%m%d-%H%M%S)"
        log_info "임시 디렉토리에 설치: \$TEMP_DIR"
        
        mkdir -p "\$TEMP_DIR"
        cd "\$TEMP_DIR"
        git clone $REPO_URL .
        
        # 빌드까지 완료 후 교체
        log_info "임시 디렉토리에서 빌드 테스트 중..."
        ;;
esac

# 3. Node.js 및 pnpm 환경 확인
log_info "Node.js 환경 확인..."
if ! command -v node > /dev/null 2>&1; then
    log_error "Node.js가 설치되지 않았습니다"
    exit 1
fi

node_version=\$(node --version)
log_info "Node.js 버전: \$node_version"

if ! command -v pnpm > /dev/null 2>&1; then
    log_info "pnpm 설치 중..."
    npm install -g pnpm
fi

pnpm_version=\$(pnpm --version)
log_info "pnpm 버전: \$pnpm_version"

# 4. 의존성 설치 및 빌드
log_info "기존 빌드 파일 정리..."
rm -rf node_modules .next pnpm-lock.yaml 2>/dev/null || true

log_info "의존성 설치 중..."
pnpm install

log_info "프로덕션 빌드 중..."
pnpm build

# 빌드 성공 확인
if [ ! -d ".next" ]; then
    log_error "빌드 실패: .next 디렉토리가 생성되지 않았습니다"
    exit 1
fi

log_success "빌드 성공!"

# 5. 안전 모드의 경우 파일 교체
if [ "\$DEPLOY_MODE" = "safe" ]; then
    log_info "빌드 성공 확인됨. 기존 디렉토리와 교체 중..."
    
    # 기존 디렉토리 백업
    if [ -d "\$PROJECT_DIR" ]; then
        mkdir -p "\$BACKUP_DIR"
        BACKUP_NAME="replaced-backup-\$(date +%Y%m%d-%H%M%S)"
        mv "\$PROJECT_DIR" "\$BACKUP_DIR/\$BACKUP_NAME"
    fi
    
    # 새 디렉토리로 교체
    mv "\$TEMP_DIR" "\$PROJECT_DIR"
    cd "\$PROJECT_DIR"
    
    log_success "안전 모드 교체 완료!"
fi

# 6. 환경변수 확인
if [ ! -f ".env.production" ]; then
    log_warning ".env.production 파일이 없습니다."
    log_info "기본 환경변수 파일을 생성합니다..."
    
cat > .env.production << 'ENV_FILE'
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# 보안 관련 (실제 값으로 변경 필요)
JWT_SECRET=your-32-character-secret-key-here-change-this
ADMIN_DEFAULT_PASSWORD=your-strong-admin-password-change-this

# 이메일 설정 (실제 값으로 변경 필요)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@seohanfnc.com

# 카카오 맵 (실제 값으로 변경 필요)
KAKAO_MAP_API_KEY=your-kakao-api-key

# 도메인 설정
NEXT_PUBLIC_DOMAIN=http://157.230.38.118:3000
NEXT_PUBLIC_BASE_URL=http://157.230.38.118:3000
ENV_FILE

    log_warning "⚠️  .env.production 파일을 수정하여 실제 값을 입력해주세요!"
fi

# 7. PM2로 서비스 시작
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

# 8. 서비스 상태 확인
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
        log_warning "헬스체크 시도 \$i/5 실패, 5초 후 재시도..."
        sleep 5
    fi
done

# 최종 헬스체크
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    log_success "=== 배포 완료! ==="
    log_success "웹사이트: http://157.230.38.118:3000/"
    log_success "관리자: http://157.230.38.118:3000/admin"
    log_success "인트라넷: http://157.230.38.118:3000/intranet"
    log_success "헬스체크: http://157.230.38.118:3000/api/health"
else
    log_error "헬스체크 최종 실패"
    log_error "로그를 확인하세요:"
    pm2 logs seohanfnc-website --lines 20
    exit 1
fi

# 10. PM2 자동 시작 설정
log_info "시스템 재부팅 시 자동 시작 설정..."
pm2 startup ubuntu -u \$USER --hp \$HOME > /dev/null 2>&1 || true
pm2 save > /dev/null 2>&1 || true

log_success "=== 모든 배포 작업 완료! ==="

DEPLOY_SCRIPT

# 원격 서버에서 스크립트 실행
log_info "원격 서버에서 배포 스크립트 실행 중..."
scp -i $SSH_KEY /tmp/deploy_script.sh $DROPLET_USER@$DROPLET_IP:/tmp/deploy_script.sh
ssh $SSH_OPTIONS $DROPLET_USER@$DROPLET_IP "chmod +x /tmp/deploy_script.sh && /tmp/deploy_script.sh"

# 임시 파일 정리
rm -f /tmp/deploy_script.sh

echo ""
echo "🎉 [TRISID] 서한F&C 웹사이트 배포가 성공적으로 완료되었습니다!"
echo ""
log_success "배포 완료!"
log_info "웹사이트: http://$DROPLET_IP:3000/"
log_info "헬스체크: http://$DROPLET_IP:3000/api/health"
echo ""
echo "📝 배포 후 확인사항:"
echo "   ✓ 웹사이트 정상 접근"
echo "   ✓ 관리자페이지 로그인"  
echo "   ✓ 인트라넷 기능 테스트"
echo "   ✓ 이메일 발송 테스트"
echo "   ⚠️  .env.production 파일 실제 값 확인"
echo "" 