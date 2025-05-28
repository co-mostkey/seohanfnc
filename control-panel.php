<?php
// 서한F&C 웹사이트 샘플 제어판
// 브라우저에서 http://yourdomain.com/sample/control-panel.php 접속

// 액션 처리
$action = $_GET['action'] ?? '';
$message = '';
$status = '';

if ($action) {
    switch ($action) {
        case 'start':
            $message = "서버 시작 중...";
            $output = shell_exec("nohup pnpm start > server.log 2>&1 & echo $!");
            $status = "서버가 시작되었습니다. PID: " . trim($output);
            break;
            
        case 'stop':
            $message = "서버 중지 중...";
            shell_exec("pkill -f 'node.*next' 2>&1");
            $status = "서버가 중지되었습니다.";
            break;
            
        case 'restart':
            $message = "서버 재시작 중...";
            shell_exec("pkill -f 'node.*next' 2>&1");
            sleep(2);
            $output = shell_exec("nohup pnpm start > server.log 2>&1 & echo $!");
            $status = "서버가 재시작되었습니다. PID: " . trim($output);
            break;
            
        case 'install':
            $message = "의존성 설치 중...";
            $output = shell_exec("pnpm install 2>&1");
            $status = "설치 완료: " . substr($output, -200);
            break;
    }
}

// 현재 서버 상태 확인
$processStatus = shell_exec("ps aux | grep 'node.*next' | grep -v grep 2>&1");
$isRunning = !empty(trim($processStatus));

// 로그 파일 읽기
$logContent = '';
if (file_exists('server.log')) {
    $logContent = shell_exec("tail -20 server.log 2>&1");
}

// Node.js 버전 확인
$nodeVersion = shell_exec('node --version 2>&1');
$pnpmVersion = shell_exec('pnpm --version 2>&1');
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서한F&C 샘플 서버 제어판</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
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
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .button:hover { background: #0056b3; }
        .button.success { background: #28a745; }
        .button.danger { background: #dc3545; }
        .button.warning { background: #ffc107; color: #212529; }
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
            font-family: 'Courier New', monospace; 
            white-space: pre-wrap; 
            max-height: 300px;
            overflow-y: auto;
            font-size: 12px;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .message { 
            padding: 15px; 
            margin: 15px 0; 
            border-radius: 6px; 
            background: #d1ecf1; 
            border: 1px solid #bee5eb; 
            color: #0c5460;
        }
        h1 { color: #333; margin-bottom: 30px; }
        h3 { color: #495057; margin-top: 30px; }
        .refresh { float: right; font-size: 12px; }
    </style>
    <script>
        // 자동 새로고침 (30초마다)
        setTimeout(function() {
            location.reload();
        }, 30000);
        
        function confirmAction(action) {
            if (action === 'stop' || action === 'restart') {
                return confirm('정말 ' + (action === 'stop' ? '중지' : '재시작') + '하시겠습니까?');
            }
            return true;
        }
    </script>
</head>
<body>
    <div class="container">
        <h1>🚀 서한F&C 웹사이트 샘플 제어판 
            <span class="refresh">자동 새로고침: 30초</span>
        </h1>
        
        <?php if ($message): ?>
        <div class="message">
            <strong><?= htmlspecialchars($message) ?></strong><br>
            <?= htmlspecialchars($status) ?>
        </div>
        <?php endif; ?>

        <div class="status <?= $isRunning ? 'running' : 'stopped' ?>">
            <h3>📊 서버 상태</h3>
            <p><strong>상태:</strong> <?= $isRunning ? '🟢 실행 중' : '🔴 중지됨' ?></p>
            <p><strong>Node.js:</strong> <?= trim($nodeVersion) ?></p>
            <p><strong>pnpm:</strong> <?= trim($pnpmVersion) ?: 'Not installed' ?></p>
            <p><strong>현재 시간:</strong> <?= date('Y-m-d H:i:s') ?></p>
        </div>

        <h3>🎮 서버 제어</h3>
        <div>
            <?php if (!$isRunning): ?>
                <a href="?action=start" class="button success" onclick="return confirmAction('start')">🚀 서버 시작</a>
            <?php else: ?>
                <a href="?action=stop" class="button danger" onclick="return confirmAction('stop')">⏹️ 서버 중지</a>
                <a href="?action=restart" class="button warning" onclick="return confirmAction('restart')">🔄 서버 재시작</a>
            <?php endif; ?>
            
            <a href="?action=install" class="button" onclick="return confirmAction('install')">📦 의존성 설치</a>
            <a href="?" class="button">🔄 새로고침</a>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🌐 웹사이트 링크</h3>
                <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/" class="button" target="_blank">홈페이지</a>
                <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/admin/login" class="button" target="_blank">관리자</a>
                <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/intranet/login" class="button" target="_blank">인트라넷</a>
                <a href="http://<?= $_SERVER['HTTP_HOST'] ?>:3000/products" class="button" target="_blank">제품</a>
            </div>

            <div class="card">
                <h3>🔑 로그인 정보</h3>
                <p><strong>인트라넷 관리자:</strong></p>
                <p>ID: <code>intranet_admin</code></p>
                <p>PW: <code>admin123!@#</code></p>
            </div>
        </div>

        <?php if ($isRunning && $processStatus): ?>
        <h3>⚙️ 실행 중인 프로세스</h3>
        <div class="log"><?= htmlspecialchars($processStatus) ?></div>
        <?php endif; ?>

        <?php if ($logContent): ?>
        <h3>📋 서버 로그 (최근 20줄)</h3>
        <div class="log"><?= htmlspecialchars($logContent) ?></div>
        <?php endif; ?>

        <h3>📖 사용법</h3>
        <ol>
            <li><strong>"서버 시작"</strong> 버튼을 클릭하여 Next.js 애플리케이션 실행</li>
            <li>서버 시작 후 <strong>"홈페이지"</strong> 버튼으로 사이트 접속</li>
            <li>문제 발생 시 로그를 확인하거나 서버 재시작</li>
            <li>페이지는 30초마다 자동으로 새로고침됩니다</li>
        </ol>

        <div class="status">
            <p><strong>⚠️ 주의사항:</strong></p>
            <ul>
                <li>서버 시작에는 1-2분 정도 소요될 수 있습니다</li>
                <li>포트 3000이 사용 중인 경우 다른 포트로 실행될 수 있습니다</li>
                <li>문제 발생 시 "의존성 설치" 후 서버를 재시작해보세요</li>
            </ul>
        </div>
    </div>
</body>
</html> 