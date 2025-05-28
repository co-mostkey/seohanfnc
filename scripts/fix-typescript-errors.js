/**
 * TypeScript 오류 자동 수정 스크립트
 * Next.js 15 타입 시스템에 맞게 수정
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

// 수정이 필요한 패턴들
const fixes = [
    // params가 null일 수 있는 경우 처리
    {
        pattern: /const\s+(\w+)\s*=\s*params\.(\w+)/g,
        replacement: 'const $1 = params?.$2'
    },
    {
        pattern: /params\.(\w+)\s+as\s+/g,
        replacement: 'params?.$1 as '
    },
    {
        pattern: /searchParams\.get\(/g,
        replacement: 'searchParams?.get('
    },
    {
        pattern: /pathname\.startsWith\(/g,
        replacement: 'pathname?.startsWith('
    },
    {
        pattern: /pathname\.includes\(/g,
        replacement: 'pathname?.includes('
    },
    // params.id 접근 시 null 체크
    {
        pattern: /\}, \[params\.id/g,
        replacement: '}, [params?.id'
    },
    // searchParams.entries() null 체크
    {
        pattern: /searchParams\.entries\(\)/g,
        replacement: 'searchParams?.entries() || []'
    },
    // path.replace null 체크
    {
        pattern: /path\.replace\(/g,
        replacement: 'path?.replace('
    },
    // document 타입 오류 수정
    {
        pattern: /document\.createElement\(/g,
        replacement: 'window.document.createElement('
    },
    {
        pattern: /document\.body\./g,
        replacement: 'window.document.body.'
    },
    // error 타입 처리
    {
        pattern: /error\.name/g,
        replacement: '(error as Error).name'
    },
    // pathname includes 체크
    {
        pattern: /legacyLayoutExactPaths\.includes\(pathname\)/g,
        replacement: 'pathname && legacyLayoutExactPaths.includes(pathname)'
    }
];

// viewport/themeColor 메타데이터 수정
const metadataFixes = [
    {
        pattern: /export\s+const\s+metadata[^{]*{([^}]+viewport:[^,}]+[^}]+)}/g,
        process: (match, content) => {
            // viewport 추출
            const viewportMatch = content.match(/viewport:\s*['"]([^'"]+)['"]/);
            const themeColorMatch = content.match(/themeColor:\s*['"]([^'"]+)['"]/);

            // viewport와 themeColor 제거
            let newContent = content
                .replace(/,?\s*viewport:\s*['"][^'"]+['"]/, '')
                .replace(/,?\s*themeColor:\s*['"][^'"]+['"]/, '');

            let result = `export const metadata: Metadata = {${newContent}}`;

            if (viewportMatch || themeColorMatch) {
                result += '\n\nexport const viewport: Viewport = {';
                const viewportProps = [];
                if (viewportMatch) viewportProps.push(`  width: 'device-width'`);
                if (viewportMatch) viewportProps.push(`  initialScale: 1`);
                if (themeColorMatch) viewportProps.push(`  themeColor: '${themeColorMatch[1]}'`);
                result += '\n' + viewportProps.join(',\n') + '\n}';
            }

            return result;
        }
    }
];

async function fixFile(filePath) {
    try {
        let content = await fs.readFile(filePath, 'utf8');
        let modified = false;

        // TypeScript 오류 수정
        for (const fix of fixes) {
            const newContent = content.replace(fix.pattern, fix.replacement);
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        }

        // 메타데이터 수정
        for (const fix of metadataFixes) {
            if (fix.process) {
                const newContent = content.replace(fix.pattern, fix.process);
                if (newContent !== content) {
                    // Viewport import 추가
                    if (!content.includes('import type { Viewport }') && newContent.includes('export const viewport: Viewport')) {
                        content = content.replace(
                            /import type { Metadata } from ['"]next['"]/,
                            `import type { Metadata, Viewport } from 'next'`
                        );
                        // Metadata import가 없는 경우
                        if (!content.includes('import type { Metadata')) {
                            const firstImport = content.match(/import .* from/);
                            if (firstImport) {
                                content = content.replace(
                                    firstImport[0],
                                    `import type { Metadata, Viewport } from 'next'\n${firstImport[0]}`
                                );
                            }
                        }
                    }
                    content = newContent;
                    modified = true;
                }
            }
        }

        if (modified) {
            await fs.writeFile(filePath, content, 'utf8');
            console.log(`✅ 수정됨: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ 오류 발생 ${filePath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🔧 TypeScript 오류 수정 시작...\n');

    // 수정이 필요한 파일들
    const patterns = [
        'app/**/*.tsx',
        'app/**/*.ts',
        'components/**/*.tsx',
        'components/**/*.ts',
        'lib/**/*.ts'
    ];

    let totalFixed = 0;

    for (const pattern of patterns) {
        const files = glob.sync(pattern, {
            ignore: ['**/node_modules/**', '**/.next/**']
        });

        for (const file of files) {
            const fixed = await fixFile(file);
            if (fixed) totalFixed++;
        }
    }

    console.log(`\n✨ 총 ${totalFixed}개 파일 수정 완료!`);

    // 특정 파일들에 대한 추가 수정
    await fixSpecificFiles();
}

async function fixSpecificFiles() {
    console.log('\n🔧 특정 파일 추가 수정...\n');

    // app/api/admin/users/init/route.ts의 safeWriteJSON 함수 추가
    const initRoutePath = 'app/api/admin/users/init/route.ts';
    try {
        let content = await fs.readFile(initRoutePath, 'utf8');
        if (content.includes('safeWriteJSON') && !content.includes('function safeWriteJSON')) {
            const safeWriteJSON = `
async function safeWriteJSON(filePath: string, data: any): Promise<void> {
  const tempPath = \`\${filePath}.tmp\`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
  await fs.rename(tempPath, filePath);
}
`;
            content = content.replace(
                'import { NextResponse } from',
                `import { promises as fs } from 'fs';
import { NextResponse } from`
            );
            content = safeWriteJSON + '\n' + content;
            await fs.writeFile(initRoutePath, content, 'utf8');
            console.log(`✅ 수정됨: ${initRoutePath}`);
        }
    } catch (error) {
        console.log(`⚠️  파일을 찾을 수 없음: ${initRoutePath}`);
    }

    // board-data 파일 생성
    const boardDataPath = 'data/board-data.ts';
    try {
        await fs.access(boardDataPath);
    } catch {
        const boardDataContent = `export function getBoardCategories() {
  return [
    { id: 'notice', name: '공지사항' },
    { id: 'news', name: '뉴스' },
    { id: 'event', name: '이벤트' }
  ];
}`;
        await fs.writeFile(boardDataPath, boardDataContent, 'utf8');
        console.log(`✅ 생성됨: ${boardDataPath}`);
    }
}

// 스크립트 실행
main().catch(console.error); 