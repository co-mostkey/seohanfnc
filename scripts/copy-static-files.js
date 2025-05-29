const fs = require('fs');
const path = require('path');

// 디렉토리 복사 함수
function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// standalone 디렉토리 확인
const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
if (!fs.existsSync(standaloneDir)) {
    console.error('❌ Standalone directory not found. Please run "pnpm build" first.');
    process.exit(1);
}

try {
    // public 디렉토리 복사
    const publicSrc = path.join(process.cwd(), 'public');
    const publicDest = path.join(standaloneDir, 'public');
    if (fs.existsSync(publicSrc)) {
        console.log('📁 Copying public directory...');
        copyDirSync(publicSrc, publicDest);
    }

    // static 디렉토리 복사
    const staticSrc = path.join(process.cwd(), '.next', 'static');
    const staticDest = path.join(standaloneDir, '.next', 'static');
    if (fs.existsSync(staticSrc)) {
        console.log('📁 Copying static directory...');
        copyDirSync(staticSrc, staticDest);
    }

    console.log('✅ Static files copied successfully!');
} catch (error) {
    console.error('❌ Error copying files:', error);
    process.exit(1);
} 