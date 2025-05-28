<?php
// 서버 환경 테스트 파일
echo "<h1>서버 환경 테스트</h1>";

// PHP 정보
echo "<h2>PHP 정보</h2>";
echo "PHP 버전: " . phpversion() . "<br>";
echo "현재 시간: " . date('Y-m-d H:i:s') . "<br>";
echo "현재 디렉토리: " . getcwd() . "<br>";

// shell_exec 함수 테스트
echo "<h2>shell_exec 함수 테스트</h2>";
if (function_exists('shell_exec')) {
    echo "shell_exec 함수: 사용 가능<br>";
    
    // 간단한 명령어 테스트
    $whoami = shell_exec('whoami 2>&1');
    echo "사용자: " . htmlspecialchars(trim($whoami)) . "<br>";
    
    $pwd = shell_exec('pwd 2>&1');
    echo "현재 경로: " . htmlspecialchars(trim($pwd)) . "<br>";
    
    $ls = shell_exec('ls -la 2>&1');
    echo "파일 목록:<br><pre>" . htmlspecialchars($ls) . "</pre>";
    
} else {
    echo "shell_exec 함수: 사용 불가 (보안상 비활성화됨)<br>";
}

// Node.js 확인
echo "<h2>Node.js 확인</h2>";
$nodeCheck = shell_exec('which node 2>&1');
if (trim($nodeCheck)) {
    echo "Node.js 경로: " . htmlspecialchars(trim($nodeCheck)) . "<br>";
    $nodeVersion = shell_exec('node --version 2>&1');
    echo "Node.js 버전: " . htmlspecialchars(trim($nodeVersion)) . "<br>";
} else {
    echo "Node.js: 설치되지 않음 또는 PATH에 없음<br>";
}

// pnpm 확인
echo "<h2>pnpm 확인</h2>";
$pnpmCheck = shell_exec('which pnpm 2>&1');
if (trim($pnpmCheck)) {
    echo "pnpm 경로: " . htmlspecialchars(trim($pnpmCheck)) . "<br>";
    $pnpmVersion = shell_exec('pnpm --version 2>&1');
    echo "pnpm 버전: " . htmlspecialchars(trim($pnpmVersion)) . "<br>";
} else {
    echo "pnpm: 설치되지 않음 또는 PATH에 없음<br>";
}

// 파일 권한 확인
echo "<h2>파일 권한 확인</h2>";
$files = ['package.json', 'next.config.js', '.next'];
foreach ($files as $file) {
    if (file_exists($file)) {
        $perms = fileperms($file);
        echo "$file: 존재함 (권한: " . substr(sprintf('%o', $perms), -4) . ")<br>";
    } else {
        echo "$file: 존재하지 않음<br>";
    }
}

echo "<h2>환경 변수</h2>";
echo "PATH: " . htmlspecialchars($_SERVER['PATH'] ?? 'Not set') . "<br>";

echo "<h2>테스트 완료</h2>";
echo "이 페이지가 정상적으로 표시되면 PHP는 작동합니다.";
?> 