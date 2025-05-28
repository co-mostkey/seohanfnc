#!/bin/bash

# 서한F&C 웹사이트 샘플 자동 실행 스크립트

echo "=== 서한F&C 웹사이트 샘플 시작 ==="

# sample 디렉토리로 이동
cd /home/$(whoami)/public_html/sample

# 또는 다른 경로인 경우 (호스팅에 따라 수정 필요)
# cd /var/www/html/sample

echo "현재 디렉토리: $(pwd)"

# Node.js 버전 확인
echo "Node.js 버전:"
node --version

# pnpm 설치 확인 (없으면 npm 사용)
if command -v pnpm &> /dev/null; then
    echo "pnpm 사용"
    pnpm install
    echo "의존성 설치 완료"
    
    # 백그라운드에서 실행
    nohup pnpm start > server.log 2>&1 &
    echo "서버가 백그라운드에서 시작되었습니다."
    echo "로그 확인: tail -f server.log"
else
    echo "npm 사용 (pnpm 없음)"
    npm install
    echo "의존성 설치 완료"
    
    # 백그라운드에서 실행
    nohup npm start > server.log 2>&1 &
    echo "서버가 백그라운드에서 시작되었습니다."
    echo "로그 확인: tail -f server.log"
fi

# 프로세스 확인
echo "실행 중인 Node.js 프로세스:"
ps aux | grep node | grep -v grep

echo "=== 스크립트 완료 ==="
echo "웹사이트 접속: http://yourdomain.com:3000"
echo "로그 확인: tail -f /home/$(whoami)/public_html/sample/server.log" 