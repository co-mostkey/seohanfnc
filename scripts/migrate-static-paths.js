const fs = require('fs');
const path = require('path');

// 분석 결과 로드
const analysisResults = JSON.parse(fs.readFileSync('static-paths-analysis.json', 'utf-8'));

// 백업 디렉토리
const BACKUP_DIR = 'backup_' + new Date().toISOString().replace(/:/g, '-').split('.')[0];

// 이미지 확장자
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'];
const videoExtensions = ['.mp4', '.webm', '.ogg'];

// 처리 통계
const stats = {
    filesProcessed: 0,
    filesModified: 0,
    pathsReplaced: 0,
    errors: []
};

// utils import 패턴
const utilsImportPatterns = [
    /import\s+{\s*([^}]*)\s*}\s+from\s+['"]@\/lib\/utils['"];?/,
    /import\s+{\s*([^}]*)\s*}\s+from\s+["']..\/..\/lib\/utils["'];?/,
    /import\s+{\s*([^}]*)\s*}\s+from\s+["']..\/lib\/utils["'];?/
];

function getRelativePath(fromFile, toFile) {
    const from = path.dirname(fromFile);
    const to = toFile;
    let relativePath = path.relative(from, to).replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }
    return relativePath;
}

function getUtilFunction(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (imageExtensions.includes(ext)) return 'getImagePath';
    if (videoExtensions.includes(ext)) return 'getVideoPath';
    return 'getAssetPath';
}

function ensureBackup(filePath) {
    const backupPath = path.join(BACKUP_DIR, filePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
    }
}

function addUtilsImport(content, filePath, requiredFunctions) {
    // 이미 utils import가 있는지 확인
    let hasUtilsImport = false;
    let existingFunctions = [];

    for (const pattern of utilsImportPatterns) {
        const match = content.match(pattern);
        if (match) {
            hasUtilsImport = true;
            existingFunctions = match[1].split(',').map(f => f.trim());
            break;
        }
    }

    // 필요한 함수 중 누락된 것 확인
    const missingFunctions = requiredFunctions.filter(f => !existingFunctions.includes(f));

    if (missingFunctions.length === 0) {
        return content; // 이미 모든 필요한 함수가 import되어 있음
    }

    if (hasUtilsImport) {
        // 기존 import에 함수 추가
        const newFunctions = [...new Set([...existingFunctions, ...missingFunctions])];
        const newImport = `import { ${newFunctions.join(', ')} } from '@/lib/utils';`;

        content = content.replace(utilsImportPatterns[0], newImport);
    } else {
        // 새로운 import 추가
        const importStatement = `import { ${requiredFunctions.join(', ')} } from '@/lib/utils';`;

        // React import 뒤에 추가
        const reactImportMatch = content.match(/import\s+React.*?from\s+['"]react['"];?\s*\n/);
        if (reactImportMatch) {
            const insertPos = reactImportMatch.index + reactImportMatch[0].length;
            content = content.slice(0, insertPos) + importStatement + '\n' + content.slice(insertPos);
        } else {
            // 파일 시작 부분에 추가
            const useClientMatch = content.match(/^['"]use client['"];?\s*\n/);
            if (useClientMatch) {
                const insertPos = useClientMatch.index + useClientMatch[0].length;
                content = content.slice(0, insertPos) + '\n' + importStatement + '\n' + content.slice(insertPos);
            } else {
                content = importStatement + '\n\n' + content;
            }
        }
    }

    return content;
}

function processFile(fileInfo) {
    const { file, paths } = fileInfo;

    try {
        console.log(`처리 중: ${file}`);
        stats.filesProcessed++;

        // 백업 생성
        ensureBackup(file);

        // 파일 읽기
        let content = fs.readFileSync(file, 'utf-8');
        const originalContent = content;

        // 필요한 유틸 함수들 수집
        const requiredFunctions = new Set();

        // 각 경로를 변경
        paths.forEach(staticPath => {
            const utilFunction = getUtilFunction(staticPath);
            requiredFunctions.add(utilFunction);

            // src="..." 패턴 변경
            const srcPattern = new RegExp(`src\\s*=\\s*["']${staticPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
            content = content.replace(srcPattern, `src={${utilFunction}('${staticPath}')}`);

            // href="..." 패턴 변경 (정적 파일인 경우만)
            if (staticPath.match(/\.(pdf|doc|docx|xls|xlsx)$/i)) {
                const hrefPattern = new RegExp(`href\\s*=\\s*["']${staticPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
                content = content.replace(hrefPattern, `href={${utilFunction}('${staticPath}')}`);
            }

            // CSS url() 패턴 변경
            const urlPattern = new RegExp(`url\\(['"]?${staticPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?\\)`, 'g');
            if (content.includes(urlPattern.source)) {
                // CSS-in-JS로 변환 필요 - 이 부분은 수동으로 처리해야 할 수 있음
                console.log(`  ⚠️  CSS url() 패턴 발견: ${staticPath} - 수동 확인 필요`);
            }
        });

        // 변경사항이 있는 경우
        if (content !== originalContent) {
            // import 추가
            content = addUtilsImport(content, file, Array.from(requiredFunctions));

            // 파일 저장
            fs.writeFileSync(file, content, 'utf-8');
            stats.filesModified++;
            stats.pathsReplaced += paths.length;
            console.log(`  ✅ ${paths.length}개 경로 변경 완료`);
        } else {
            console.log(`  ℹ️  변경사항 없음`);
        }

    } catch (error) {
        console.error(`  ❌ 오류 발생: ${error.message}`);
        stats.errors.push({ file, error: error.message });
    }
}

// 실행 전 확인
console.log('=== 정적 경로 마이그레이션 ===\n');
console.log(`대상 파일: ${analysisResults.filesList.length}개`);
console.log(`변경할 경로: ${analysisResults.summary.pathCounts.images + analysisResults.summary.pathCounts.videos + analysisResults.summary.pathCounts.other}개\n`);

// 백업 디렉토리 생성
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`백업 디렉토리 생성: ${BACKUP_DIR}\n`);
}

// 사용자 확인
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('계속 진행하시겠습니까? (y/N) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
        console.log('\n마이그레이션 시작...\n');

        // 각 파일 처리
        analysisResults.filesList.forEach(processFile);

        // 결과 출력
        console.log('\n=== 마이그레이션 완료 ===\n');
        console.log(`처리된 파일: ${stats.filesProcessed}개`);
        console.log(`수정된 파일: ${stats.filesModified}개`);
        console.log(`변경된 경로: ${stats.pathsReplaced}개`);

        if (stats.errors.length > 0) {
            console.log(`\n오류 발생: ${stats.errors.length}개`);
            stats.errors.forEach(({ file, error }) => {
                console.log(`  - ${file}: ${error}`);
            });
        }

        console.log(`\n백업 위치: ${BACKUP_DIR}`);
        console.log('\n변경사항을 확인하고 문제가 있으면 백업에서 복원하세요.');

        // 마이그레이션 로그 저장
        const logData = {
            timestamp: new Date().toISOString(),
            backupDir: BACKUP_DIR,
            stats,
            processedFiles: analysisResults.filesList.map(f => f.file)
        };

        fs.writeFileSync('migration-log.json', JSON.stringify(logData, null, 2));
        console.log('마이그레이션 로그가 migration-log.json에 저장되었습니다.');
    } else {
        console.log('마이그레이션이 취소되었습니다.');
    }

    rl.close();
}); 