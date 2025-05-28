<?php
// 서한F&C 웹사이트 샘플 실행 스크립트
// 브라우저에서 http://yourdomain.com/sample/start-server.php 접속하여 실행

header('Content-Type: text/plain; charset=utf-8');

echo "=== 서한F&C 웹사이트 샘플 시작 ===\n\n";

// 현재 디렉토리 확인
$currentDir = getcwd();
echo "현재 디렉토리: $currentDir\n";

// sample 디렉토리로 이동
$sampleDir = dirname(__FILE__);
chdir($sampleDir);
echo "작업 디렉토리: " . getcwd() . "\n\n";

// Node.js 버전 확인
echo "Node.js 버전 확인:\n";
$nodeVersion = shell_exec('node --version 2>&1');
echo $nodeVersion . "\n";

// pnpm 확인
echo "패키지 매니저 확인:\n";
$pnpmCheck = shell_exec('which pnpm 2>&1');
if (trim($pnpmCheck)) {
    echo "pnpm 사용 가능: $pnpmCheck\n";
    $packageManager = 'pnpm';
} else {
    echo "pnpm 없음, npm 사용\n";
    $packageManager = 'npm';
}

// 의존성 설치
echo "\n의존성 설치 중...\n";
$installOutput = shell_exec("$packageManager install 2>&1");
echo $installOutput . "\n";

// 기존 프로세스 확인 및 종료
echo "기존 Node.js 프로세스 확인:\n";
$existingProcess = shell_exec("ps aux | grep 'node.*next' | grep -v grep 2>&1");
if (trim($existingProcess)) {
    echo "기존 프로세스 발견:\n$existingProcess\n";
    echo "기존 프로세스 종료 중...\n";
    shell_exec("pkill -f 'node.*next' 2>&1");
}

// 서버 시작
echo "\n서버 시작 중...\n";
$startCommand = "nohup $packageManager start > server.log 2>&1 & echo $!";
$pid = shell_exec($startCommand);
echo "서버 PID: " . trim($pid) . "\n";

// 잠시 대기 후 상태 확인
sleep(3);

echo "\n프로세스 상태 확인:\n";
$processStatus = shell_exec("ps aux | grep 'node.*next' | grep -v grep 2>&1");
echo $processStatus ? $processStatus : "프로세스를 찾을 수 없습니다.\n";

// 로그 파일 확인
if (file_exists('server.log')) {
    echo "\n서버 로그 (최근 10줄):\n";
    echo shell_exec("tail -10 server.log 2>&1");
}

echo "\n=== 완료 ===\n";
echo "웹사이트 접속: http://" . $_SERVER['HTTP_HOST'] . ":3000\n";
echo "로그 확인: http://" . $_SERVER['HTTP_HOST'] . "/sample/server.log\n";
echo "이 페이지 새로고침하여 상태 재확인 가능\n";
?> 