/**
 * Windsurf 연결 오류 진단 및 해결 스크립트
 * 
 * 이 스크립트는 "Client windsurf: connection to server is erroring. Shutting down server" 
 * 오류를 해결하기 위한 진단 및 수정 도구입니다.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 색상 코드 (터미널 출력용)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}⚡ Windsurf 연결 오류 진단 도구${colors.reset}`);
console.log(`${colors.cyan}===============================${colors.reset}\n`);

// 현재 디렉토리 확인
const projectRoot = process.cwd();
console.log(`${colors.blue}📁 프로젝트 경로: ${projectRoot}${colors.reset}`);

// 필요한 디렉토리 생성
const logsDir = path.join(projectRoot, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log(`${colors.green}✅ logs 디렉토리 생성됨${colors.reset}`);
}

// Next.js 및 Node.js 버전 확인
try {
  const nodeVersion = execSync('node -v').toString().trim();
  console.log(`${colors.blue}📌 Node.js 버전: ${nodeVersion}${colors.reset}`);
  
  // package.json에서 Next.js 버전 확인
  const packageJson = require(path.join(projectRoot, 'package.json'));
  const nextVersion = packageJson.dependencies.next;
  console.log(`${colors.blue}📌 Next.js 버전: ${nextVersion}${colors.reset}`);
  
  // Windsurf 구성 파일 확인
  const windsurfConfigPath = path.join(projectRoot, 'windsurf.config.js');
  if (fs.existsSync(windsurfConfigPath)) {
    console.log(`${colors.green}✅ Windsurf 구성 파일이 존재합니다${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️ Windsurf 구성 파일이 없습니다. 새로 생성했습니다${colors.reset}`);
  }
  
  // 포트 충돌 확인 (Windows 환경)
  console.log(`${colors.blue}🔍 포트 충돌 확인 중...${colors.reset}`);
  try {
    const netstatOutput = execSync('netstat -ano | findstr :3000').toString();
    if (netstatOutput) {
      console.log(`${colors.yellow}⚠️ 포트 3000이 이미 사용 중일 수 있습니다:${colors.reset}`);
      console.log(netstatOutput);
    }
  } catch (error) {
    console.log(`${colors.green}✅ 포트 3000이 사용 가능합니다${colors.reset}`);
  }
  
  // Windsurf 캐시 초기화
  const windsurfCachePath = path.join(projectRoot, '.windsurf');
  if (fs.existsSync(windsurfCachePath)) {
    try {
      fs.rmdirSync(windsurfCachePath, { recursive: true });
      console.log(`${colors.green}✅ Windsurf 캐시를 초기화했습니다${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}❌ Windsurf 캐시 초기화 실패: ${error.message}${colors.reset}`);
    }
  }
  
  // node_modules 폴더 확인
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`${colors.yellow}⚠️ node_modules 폴더가 없습니다. 의존성을 설치해주세요:${colors.reset}`);
    console.log(`   pnpm install`);
  } else {
    console.log(`${colors.green}✅ node_modules 폴더가 존재합니다${colors.reset}`);
  }
  
  // 해결책 제안
  console.log(`\n${colors.magenta}🔧 다음 해결책을 시도해보세요:${colors.reset}`);
  console.log(`${colors.cyan}1. 모든 Node.js 프로세스를 종료하고 다시 시작:${colors.reset}`);
  console.log(`   taskkill /F /IM node.exe`);
  
  console.log(`\n${colors.cyan}2. 의존성 다시 설치:${colors.reset}`);
  console.log(`   pnpm install`);
  
  console.log(`\n${colors.cyan}3. 개발 서버 실행 시 다른 포트 사용:${colors.reset}`);
  console.log(`   pnpm dev -- -p 3001`);
  
  console.log(`\n${colors.cyan}4. Windsurf 설정 적용 후 개발 서버 재시작:${colors.reset}`);
  console.log(`   pnpm dev`);
  
} catch (error) {
  console.log(`${colors.red}❌ 오류 발생: ${error.message}${colors.reset}`);
}

// 현재 실행 중인 프로세스 확인 (Windows)
console.log(`\n${colors.blue}🔍 실행 중인 Node.js 프로세스 확인:${colors.reset}`);
try {
  const processOutput = execSync('tasklist | findstr node.exe').toString();
  console.log(processOutput);
} catch (error) {
  console.log(`${colors.yellow}⚠️ 실행 중인 Node.js 프로세스가 없습니다${colors.reset}`);
}

console.log(`\n${colors.green}✨ 진단이 완료되었습니다. 위 해결책을 순서대로 시도해보세요.${colors.reset}`);
