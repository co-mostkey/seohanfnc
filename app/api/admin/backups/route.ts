import { NextRequest, NextResponse } from 'next/server';
import {
    listFileBackups,
    restoreFromBackup,
    listScheduledBackups,
    createFullBackup,
    restoreFromScheduledBackup
} from '@/lib/file-db';

/**
 * 특정 파일의 백업 목록 조회
 * GET /api/admin/backups?filename=example.json
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filename = searchParams?.get('filename');
        const type = searchParams?.get('type') || 'file'; // file 또는 scheduled

        if (type === 'file' && filename) {
            // 특정 파일의 백업 목록 조회
            const backups = await listFileBackups(filename);
            return NextResponse.json({ success: true, backups });
        } else if (type === 'scheduled') {
            // 스케줄 백업 목록 조회
            const backups = await listScheduledBackups();
            return NextResponse.json({ success: true, backups });
        } else {
            return NextResponse.json(
                { success: false, error: '유효한 파일명이나 백업 유형이 필요합니다.' },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('Error fetching backups:', error);
        return NextResponse.json(
            { success: false, error: error.message || '백업 목록을 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 백업 생성 (전체 시스템 백업)
 * POST /api/admin/backups
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const backupName = body.backupName || `manual_backup_${Date.now()}`;

        const result = await createFullBackup(backupName);

        return NextResponse.json({
            success: true,
            message: '백업이 성공적으로 생성되었습니다.',
            backupPath: result.backupPath,
            fileCount: result.backedUpFiles.length,
            files: result.backedUpFiles
        });
    } catch (error: any) {
        console.error('Error creating backup:', error);
        return NextResponse.json(
            { success: false, error: error.message || '백업 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 백업에서 복원
 * PUT /api/admin/backups
 */
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { filename, backupFileName, type, backupName } = body;

        if (type === 'file' && filename && backupFileName) {
            // 특정 파일 백업에서 복원
            await restoreFromBackup(filename, backupFileName);
            return NextResponse.json({
                success: true,
                message: `${filename} 파일이 성공적으로 복원되었습니다.`
            });
        } else if (type === 'scheduled' && backupName) {
            // 스케줄 백업에서 복원
            const result = await restoreFromScheduledBackup(backupName);
            return NextResponse.json({
                success: result.success,
                message: result.success
                    ? '백업에서 성공적으로 복원되었습니다.'
                    : '백업 복원 중 일부 파일을 복원하지 못했습니다.',
                restoredFiles: result.restoredFiles
            });
        } else {
            return NextResponse.json(
                { success: false, error: '유효한 복원 정보가 필요합니다.' },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('Error restoring from backup:', error);
        return NextResponse.json(
            { success: false, error: error.message || '백업 복원 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 