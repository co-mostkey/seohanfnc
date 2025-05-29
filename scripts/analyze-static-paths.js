const fs = require('fs');
const path = require('path');

// 분석 결과 저장
const results = {
  totalFiles: 0,
  filesWithStaticPaths: 0,
  pathsFound: {
    images: [],
    videos: [],
    other: []
  },
  filesList: []
};

// 제외할 디렉토리
const excludeDirs = [
  'node_modules',
  '.next',
  '.git',
  'out',
  'public',
  'uploads'
];

// 파일 확장자 필터
const includeExtensions = ['.tsx', '.ts', '.jsx', '.js'];

// 정적 자산 경로 패턴 (API 경로 제외)
const staticPathPatterns = [
  // Image src 패턴
  /src\s*=\s*["'](\/(?!api\/)[^"']+\.(jpg|jpeg|png|gif|svg|webp))["']/gi,
  // 비디오 src 패턴
  /src\s*=\s*["'](\/(?!api\/)[^"']+\.(mp4|webm|ogg))["']/gi,
  // 기타 정적 파일 패턴
  /src\s*=\s*["'](\/(?!api\/)[^"']+)["']/gi,
  // CSS url() 패턴
  /url\(['"]?(\/(?!api\/)[^'")]+)['"]?\)/gi,
  // href 패턴 중 정적 파일
  /href\s*=\s*["'](\/(?!api\/)[^"']+\.(pdf|doc|docx|xls|xlsx))["']/gi
];

// 제외할 경로 패턴
const excludePatterns = [
  /^\/api\//,        // API 경로
  /^\/intranet\//,   // 인트라넷 라우트
  /^\/admin\//,      // 관리자 라우트
  /^\/products\//,   // 제품 라우트 (정적 파일이 아닌 경우)
  /^\/support\//,    // 지원 라우트
  /^#/,              // 앵커 링크
  /^mailto:/,        // 이메일 링크
  /^tel:/,           // 전화번호 링크
  /^https?:\/\//,    // 외부 URL
];

// 이미지 확장자
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'];
const videoExtensions = ['.mp4', '.webm', '.ogg'];

function shouldExcludePath(filePath) {
  // 제외 패턴 확인
  return excludePatterns.some(pattern => pattern.test(filePath));
}

function categorizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (imageExtensions.includes(ext)) return 'images';
  if (videoExtensions.includes(ext)) return 'videos';
  return 'other';
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const foundPaths = new Set();
  
  staticPathPatterns.forEach(pattern => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const staticPath = match[1];
      if (staticPath && !shouldExcludePath(staticPath)) {
        foundPaths.add(staticPath);
      }
    }
  });
  
  if (foundPaths.size > 0) {
    results.filesWithStaticPaths++;
    results.filesList.push({
      file: filePath,
      paths: Array.from(foundPaths)
    });
    
    foundPaths.forEach(staticPath => {
      const category = categorizeFile(staticPath);
      results.pathsFound[category].push({
        path: staticPath,
        file: filePath
      });
    });
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walkDirectory(filePath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (includeExtensions.includes(ext)) {
        results.totalFiles++;
        analyzeFile(filePath);
      }
    }
  });
}

// 분석 시작
console.log('정적 자산 경로 분석 시작...\n');
walkDirectory('.');

// 결과 출력
console.log('=== 분석 결과 ===\n');
console.log(`총 파일 수: ${results.totalFiles}`);
console.log(`정적 경로를 포함한 파일 수: ${results.filesWithStaticPaths}`);
console.log(`\n발견된 경로:`);
console.log(`- 이미지: ${results.pathsFound.images.length}개`);
console.log(`- 비디오: ${results.pathsFound.videos.length}개`);
console.log(`- 기타: ${results.pathsFound.other.length}개`);

// 상세 결과를 파일로 저장
const report = {
  summary: {
    totalFiles: results.totalFiles,
    filesWithStaticPaths: results.filesWithStaticPaths,
    pathCounts: {
      images: results.pathsFound.images.length,
      videos: results.pathsFound.videos.length,
      other: results.pathsFound.other.length
    }
  },
  filesList: results.filesList,
  uniquePaths: {
    images: [...new Set(results.pathsFound.images.map(p => p.path))],
    videos: [...new Set(results.pathsFound.videos.map(p => p.path))],
    other: [...new Set(results.pathsFound.other.map(p => p.path))]
  }
};

fs.writeFileSync('static-paths-analysis.json', JSON.stringify(report, null, 2));
console.log('\n상세 분석 결과가 static-paths-analysis.json에 저장되었습니다.');

// 샘플 출력
console.log('\n=== 샘플 경로 (각 카테고리별 최대 5개) ===');
Object.entries(results.pathsFound).forEach(([category, paths]) => {
  if (paths.length > 0) {
    console.log(`\n${category.toUpperCase()}:`);
    paths.slice(0, 5).forEach(({ path: p, file }) => {
      console.log(`  ${p}`);
      console.log(`    → ${file}`);
    });
    if (paths.length > 5) {
      console.log(`  ... 그 외 ${paths.length - 5}개`);
    }
  }
}); 