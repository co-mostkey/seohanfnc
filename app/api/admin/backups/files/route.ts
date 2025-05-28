import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import archiver from 'archiver';

const backupsDir = path.join(process.cwd(), 'backups');
const dataDir = path.join(process.cwd(), 'data');

// 백업 디렉토리 확인 및 생성
async function ensureBackupsDir() {
    try {
        await fs.access(backupsDir);
    } catch {
        await fs.mkdir(backupsDir, { recursive: true });
    }
}

// 파일 크기를 읽기 쉬운 형태로 변환
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 백업 파일 목록 조회
export async function GET() {
    try {
        await ensureBackupsDir();

        const files = await fs.readdir(backupsDir);
        const backupFiles = files.filter(file => file.endsWith('.zip'));

        const backups = await Promise.all(
            backupFiles.map(async (file) => {
                const filePath = path.join(backupsDir, file);
                const stats = await fs.stat(filePath);

                return {
                    name: file,
                    createdAt: stats.birthtime.toISOString(),
                    size: formatFileSize(stats.size),
                    sizeBytes: stats.size
                };
            })
        );

        // 생성일시 기준 내림차순 정렬
        backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({
            success: true,
            backups,
            total: backups.length
        });

    } catch (error) {
        console.error('백업 목록 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '백업 목록을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// 새 백업 생성
export async function POST() {
    try {
        await ensureBackupsDir();

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup-${timestamp}.zip`;
        const backupPath = path.join(backupsDir, backupName);

        // 백업할 디렉토리들
        const dirsToBackup = [
            { source: dataDir, name: 'data' },
            { source: path.join(process.cwd(), 'public', 'uploads'), name: 'uploads' },
            { source: path.join(process.cwd(), 'logs'), name: 'logs' }
        ];

        // ZIP 파일 생성
        const output = createWriteStream(backupPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.pipe(output);

        let fileCount = 0;

        // 각 디렉토리를 백업에 추가
        for (const dir of dirsToBackup) {
            try {
                await fs.access(dir.source);

                // 디렉토리 내 파일들을 재귀적으로 추가
                const addDirectory = async (dirPath: string, basePath: string) => {
                    const items = await fs.readdir(dirPath);

                    for (const item of items) {
                        const itemPath = path.join(dirPath, item);
                        const stats = await fs.stat(itemPath);

                        if (stats.isDirectory()) {
                            await addDirectory(itemPath, basePath);
                        } else {
                            const relativePath = path.relative(dir.source, itemPath);
                            const archivePath = path.join(dir.name, relativePath).replace(/\\/g, '/');
                            archive.file(itemPath, { name: archivePath });
                            fileCount++;
                        }
                    }
                };

                await addDirectory(dir.source, dir.name);
            } catch (error) {
                console.warn(`디렉토리 ${dir.source}를 백업에 추가할 수 없습니다:`, error);
            }
        }

        // 백업 완료
        await archive.finalize();

        // 완료 대기
        await new Promise((resolve, reject) => {
            output.on('close', resolve);
            output.on('error', reject);
            archive.on('error', reject);
        });

        // 생성된 백업 파일 정보
        const stats = await fs.stat(backupPath);

        return NextResponse.json({
            success: true,
            message: '백업이 성공적으로 생성되었습니다.',
            backup: {
                name: backupName,
                createdAt: stats.birthtime.toISOString(),
                size: formatFileSize(stats.size),
                fileCount
            }
        });

    } catch (error) {
        console.error('백업 생성 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '백업 생성에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// 백업 파일 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const backupName = searchParams?.get('name');

        if (!backupName) {
            return NextResponse.json(
                { success: false, error: '백업 파일명이 필요합니다.' },
                { status: 400 }
            );
        }

        const backupPath = path.join(backupsDir, backupName);

        // 파일 존재 확인
        try {
            await fs.access(backupPath);
        } catch {
            return NextResponse.json(
                { success: false, error: '백업 파일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 파일 삭제
        await fs.unlink(backupPath);

        return NextResponse.json({
            success: true,
            message: '백업 파일이 삭제되었습니다.'
        });

    } catch (error) {
        console.error('백업 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '백업 파일 삭제에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 