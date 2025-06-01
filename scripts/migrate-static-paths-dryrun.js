const fs = require('fs');
const path = require('path');

// 분석 결과 로드
const analysisResults = JSON.parse(fs.readFileSync('static-paths-analysis.json', 'utf-8'));

// 이미지 확장자
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'];
const videoExtensions = ['.mp4', '.webm', '.ogg'];

// 변경 예시 수집
const changeExamples = [];

function getUtilFunction(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (imageExtensions.includes(ext)) return 'getImagePath';
    if (videoExtensions.includes(ext)) return 'getVideoPath';
    return 'getAssetPath';
}

function previewFile(fileInfo) {
    const { file, paths } = fileInfo;
    const changes = [];

    try {
        // 파일 읽기
        const content = fs.readFileSync(file, 'utf-8');

        // 각 경로에 대한 변경 예시 생성
        paths.forEach(staticPath => {
            const utilFunction = getUtilFunction(staticPath);

            // src="..." 패턴 찾기
            const srcPattern = new RegExp(`src\\s*=\\s*["']${staticPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
            const srcMatches = content.match(srcPattern);
            if (srcMatches) {
                srcMatches.forEach(match => {
                    changes.push({
                        type: 'src',
                        before: match,
                        after: `src={${utilFunction}('${staticPath}')}`,
                        path: staticPath
                    });
                });
            }

            // href="..." 패턴 찾기 (정적 파일인 경우만)
            if (staticPath.match(/\.(pdf|doc|docx|xls|xlsx)$/i)) {
                const hrefPattern = new RegExp(`href\\s*=\\s*["']${staticPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
                const hrefMatches = content.match(hrefPattern);
                if (hrefMatches) {
                    hrefMatches.forEach(match => {
                        changes.push({
                            type: 'href',
                            before: match,
                            after: `href={${utilFunction}('${staticPath}')}`,
                            path: staticPath
                        });
                    });
                }
            }
        });

        if (changes.length > 0) {
            changeExamples.push({
                file,
                changes,
                needsImport: true
            });
        }

    } catch (error) {
        console.error(`오류 발생 (${file}): ${error.message}`);
    }
}

// 실행
console.log('=== 정적 경로 마이그레이션 DRY-RUN ===\n');
console.log('실제 파일은 변경되지 않습니다. 변경 예정 사항만 표시합니다.\n');

// 각 파일 분석
analysisResults.filesList.forEach(previewFile);

// 결과 출력
console.log('=== 변경 예정 사항 ===\n');

let totalChanges = 0;
changeExamples.forEach(({ file, changes }) => {
    console.log(`📁 ${file}`);
    console.log(`   ${changes.length}개 변경 예정\n`);

    // 처음 2개만 예시로 보여주기
    changes.slice(0, 2).forEach(change => {
        console.log(`   변경 전: ${change.before}`);
        console.log(`   변경 후: ${change.after}\n`);
    });

    if (changes.length > 2) {
        console.log(`   ... 그 외 ${changes.length - 2}개 변경\n`);
    }

    totalChanges += changes.length;
});

console.log('\n=== 요약 ===');
console.log(`총 ${changeExamples.length}개 파일에서 ${totalChanges}개 경로 변경 예정`);

// 필요한 import 함수들 확인
const requiredFunctions = new Set();
changeExamples.forEach(({ changes }) => {
    changes.forEach(change => {
        const func = getUtilFunction(change.path);
        requiredFunctions.add(func);
    });
});

console.log(`\n필요한 유틸 함수: ${Array.from(requiredFunctions).join(', ')}`);

// 주의사항
console.log('\n⚠️  주의사항:');
console.log('1. 모든 변경 대상 파일에 utils import가 추가됩니다.');
console.log('2. CSS url() 패턴은 수동으로 처리해야 할 수 있습니다.');
console.log('3. 백업이 생성되므로 문제 발생 시 복원 가능합니다.');

console.log('\n실제 마이그레이션을 실행하려면 "node scripts/migrate-static-paths.js"를 실행하세요.'); 