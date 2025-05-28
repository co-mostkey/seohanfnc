<?php
// 서한F&C 웹사이트 샘플 제어판 (안전 버전)
// 에러 처리 강화

// 에러 리포팅 활성화 (디버깅용)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 안전한 함수 실행
function safe_shell_exec($command) {
    if (!function_exists('shell_exec')) {
        return "shell_exec 함수가 비활성화되어 있습니다.";
    }
    
    try {
        $output = shell_exec($command . ' 2>&1');
        return $output !== null ? $output : "명령어 실행 실패";
    } catch (Exception $e) {
        return "오류: " . $e->getMessage();
    }
}

// 액션 처리
$action = $_GET['action'] ?? '';
$message = '';
$status = '';

if ($action) {
    try {
        switch ($action) {
            case 'start':
                $message = "서버 시작 중...";
                if (function_exists('shell_exec')) {
                    $output = safe_shell_exec("nohup npm start > server.log 2>&1 & echo $!");
                    $status = "서버 시작 시도됨. 출력: " . trim($output);
                } else {
                    $status = "shell_exec 함수가 비활성화되어 있어 서버를 시작할 수 없습니다.";
                }
                break;
                
            case 'stop':
                $message = "서버 중지 중...";
                if (function_exists('shell_exec')) {
                    safe_shell_exec("pkill -f 'node.*next'");
                    $status = "서버 중지 명령이 실행되었습니다.";
                } else {
                    $status = "shell_exec 함수가 비활성화되어 있어 서버를 중지할 수 없습니다.";
                }
                break;
                
            case 'install':
                $message = "의존성 설치 중...";
                if (function_exists('shell_exec')) {
                    $output = safe_shell_exec("npm install");
                    $status = "설치 시도됨. 출력: " . substr($output, -200);
                } else {
                    $status = "shell_exec 함수가 비활성화되어 있어 설치할 수 없습니다.";
                }
                break;
        }
    } catch (Exception $e) {
        $status = "오류 발생: " . $e->getMessage();
    }
}

// 현재 서버 상태 확인
$processStatus = '';
$isRunning = false;

try {
    if (function_exists('shell_exec')) {
        $processStatus = safe_shell_exec("ps aux | grep 'node.*next' | grep -v grep");
        $isRunning = !empty(trim($processStatus));
    }
} catch (Exception $e) {
    $processStatus = "상태 확인 오류: " . $e->getMessage();
}

// 로그 파일 읽기
$logContent = '';
try {
    if (file_exists('server.log')) {
        $logContent = file_get_contents('server.log');
        $logContent = substr($logContent, -2000); // 마지막 2000자만
    }
} catch (Exception $e) {
    $logContent = "로그 읽기 오류: " . $e->getMessage();
}

// 시스템 정보
$nodeVersion = safe_shell_exec('node --version');
$npmVersion = safe_shell_exec('npm --version');
$currentDir = getcwd();
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서한F&C 샘플 서버 제어판 (안전 버전)</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 1000px; 
            margin: 20px auto; 
            padding: 20px; 
            background: #f5f5f5;
        }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            margin: 8px; 
            background: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            font-size: 14px;
        }
        .button:hover { background: #0056b3; }
        .button.success { background: #28a745; }
        .button.danger { background: #dc3545; }
        .status { 
            background: #e9ecef; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #007bff;
        }
        .status.running { border-left-color: #28a745; background: #d4edda; }
        .status.stopped { border-left-color: #dc3545; background: #f8d7da; }
        .log { 
            background: #1e1e1e; 
            color: #00ff00; 
            padding: 20px; 
            border-radius: 8px; 
            font-family: monospace; 
            white-space: pre-wrap; 
            max-height: 300px;
            overflow-y: auto;
            font-size: 12px;
        }
        .message { 
            padding: 15px; 
            margin: 15px 0; 
            border-radius: 6px; 
            background: #d1ecf1; 
            border: 1px solid #bee5eb; 
            color: #0c5460;
        }
        .error { 
            background: #f8d7da; 
            border: 1px solid #f5c6cb; 
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 서한F&C 웹사이트 샘플 제어판 (안전 버전)</h1>
        
        <?php if ($message): ?>
        <div class="message <?= strpos($status, '오류') !== false ? 'error' : '' ?>">
            <strong><?= htmlspecialchars($message) ?></strong><br>
            <?= htmlspecialchars($status) ?>
        </div>
        <?php endif; ?>

        <div class="status <?= $isRunning ? 'running' : 'stopped' ?>">
            <h3>📊 시스템 정보</h3>
            <p><strong>PHP 버전:</strong> <?= phpversion() ?></p>
            <p><strong>현재 디렉토리:</strong> <?= htmlspecialchars($currentDir) ?></p>
            <p><strong>shell_exec 함수:</strong> <?= function_exists('shell_exec') ? '사용 가능' : '비활성화됨' ?></p>
            <p><strong>Node.js:</strong> <?= htmlspecialchars(trim($nodeVersion)) ?></p>
            <p><strong>npm:</strong> <?= htmlspecialchars(trim($npmVersion)) ?></p>
            <p><strong>서버 상태:</strong> <?= $isRunning ? '🟢 실행 중' : '🔴 중지됨' ?></p>
            <p><strong>현재 시간:</strong> <?= date('Y-m-d H:i:s') ?></p>
        </div>

        <h3>🎮 서버 제어</h3>
        <div>
            <?php if (function_exists('shell_exec')): ?>
                <a href="?action=start" class="button success">🚀 서버 시작 (npm)</a>
                <a href="?action=stop" class="button danger">⏹️ 서버 중지</a>
                <a href="?action=install" class="button">📦 의존성 설치 (npm)</a>
            <?php else: ?>
                <p style="color: red;">⚠️ shell_exec 함수가 비활성화되어 있어 서버 제어가 불가능합니다.</p>
                <p>호스팅 업체에 문의하여 shell_exec 함수를 활성화하거나 SSH 접속을 요청하세요.</p>
            <?php endif; ?>
            
            <a href="?" class="button">🔄 새로고침</a>
        </div>

        <h3>🌐 웹사이트 링크</h3>
        <div>
            <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/" class="button" target="_blank">홈페이지</a>
            <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/admin/login" class="button" target="_blank">관리자</a>
            <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/intranet/login" class="button" target="_blank">인트라넷</a>
        </div>

        <?php if ($isRunning && $processStatus): ?>
        <h3>⚙️ 실행 중인 프로세스</h3>
        <div class="log"><?= htmlspecialchars($processStatus) ?></div>
        <?php endif; ?>

        <?php if ($logContent): ?>
        <h3>📋 서버 로그</h3>
        <div class="log"><?= htmlspecialchars($logContent) ?></div>
        <?php endif; ?>

        <h3>🔑 로그인 정보</h3>
        <div class="status">
            <p><strong>인트라넷 관리자:</strong></p>
            <p>ID: <code>intranet_admin</code></p>
            <p>PW: <code>admin123!@#</code></p>
        </div>

        <h3>📖 문제 해결</h3>
        <ol>
            <li>먼저 <a href="test.php" target="_blank">test.php</a>를 실행하여 서버 환경을 확인하세요</li>
            <li>shell_exec 함수가 비활성화된 경우 호스팅 업체에 문의하세요</li>
            <li>Node.js가 설치되지 않은 경우 호스팅 업체에 설치를 요청하세요</li>
            <li>SSH 접속이 가능한 경우 직접 명령어를 실행하세요</li>
        </ol>
    </div>
</body>
</html> 