import { NextRequest, NextResponse } from "next/server";
import { createFullBackup, readJsonFile, writeJsonFile, listScheduledBackups } from '@/lib/file-db';
import { withMutex } from '@/lib/mutex';
import fs from 'fs/promises';
import path from 'path';

// 스케줄 설정 파일
const SCHEDULE_FILE = 'backup-schedule.json';

const backupsDir = path.join(process.cwd(), 'backups');
const scheduledBackupsFile = path.join(backupsDir, 'scheduled-backups.json');

interface BackupSchedule {
    enabled: boolean;
    interval: 'daily' | 'weekly' | 'monthly';
    timeOfDay: string; // HH:MM 형식
    dayOfWeek?: number; // 0-6 (일-토), 주간 백업용
    dayOfMonth?: number; // 1-31, 월간 백업용
    lastRun?: string; // ISO 날짜 문자열
    maxBackups?: number; // 최대 보관 백업 수
    retention?: number; // 보관 기간 (일)
}

interface ScheduledBackup {
    name: string;
    createdAt: string;
    fileCount: number;
    type: 'full' | 'incremental';
    status: 'completed' | 'failed' | 'in-progress';
}

// 백업 디렉토리 확인 및 생성
async function ensureBackupsDir() {
    try {
        await fs.access(backupsDir);
    } catch {
        await fs.mkdir(backupsDir, { recursive: true });
    }
}

// 스케줄된 백업 목록 읽기
async function readScheduledBackups(): Promise<ScheduledBackup[]> {
    try {
        await ensureBackupsDir();
        const content = await fs.readFile(scheduledBackupsFile, 'utf8');
        return JSON.parse(content);
    } catch {
        // 파일이 없으면 빈 배열 반환
        return [];
    }
}

// 스케줄된 백업 목록 저장
async function saveScheduledBackups(backups: ScheduledBackup[]): Promise<void> {
    await ensureBackupsDir();
    await fs.writeFile(scheduledBackupsFile, JSON.stringify(backups, null, 2), 'utf8');
}

/**
 * 백업 스케줄 설정 조회
 * GET /api/admin/backups/scheduled
 */
export async function GET() {
    try {
        const backups = await readScheduledBackups();

        // 생성일시 기준 내림차순 정렬
        backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({
            success: true,
            backups,
            total: backups.length
        });

    } catch (error) {
        console.error('스케줄된 백업 목록 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '스케줄된 백업 목록을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * 백업 스케줄 설정 업데이트
 * PUT /api/admin/backups/scheduled
 */
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { schedule } = body;

        if (!schedule) {
            return NextResponse.json(
                { success: false, error: '스케줄 설정이 필요합니다.' },
                { status: 400 }
            );
        }

        await writeJsonFile(SCHEDULE_FILE, { schedule });

        return NextResponse.json({
            success: true,
            message: '백업 스케줄이 업데이트되었습니다.',
            schedule
        });
    } catch (error: any) {
        console.error('Error updating backup schedule:', error);
        return NextResponse.json(
            { success: false, error: error.message || '백업 스케줄 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 수동으로 스케줄 백업 실행
 * POST /api/admin/backups/scheduled
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, fileCount, type = 'full' } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: '백업명이 필요합니다.' },
                { status: 400 }
            );
        }

        const backups = await readScheduledBackups();

        const newBackup: ScheduledBackup = {
            name,
            createdAt: new Date().toISOString(),
            fileCount: fileCount || 0,
            type,
            status: 'completed'
        };

        backups.push(newBackup);
        await saveScheduledBackups(backups);

        return NextResponse.json({
            success: true,
            message: '스케줄된 백업이 추가되었습니다.',
            backup: newBackup
        });

    } catch (error) {
        console.error('스케줄된 백업 추가 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '스케줄된 백업 추가에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// 스케줄된 백업 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const backupName = searchParams?.get('name');

        if (!backupName) {
            return NextResponse.json(
                { success: false, error: '백업명이 필요합니다.' },
                { status: 400 }
            );
        }

        const backups = await readScheduledBackups();
        const filteredBackups = backups.filter(backup => backup.name !== backupName);

        if (backups.length === filteredBackups.length) {
            return NextResponse.json(
                { success: false, error: '해당 백업을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        await saveScheduledBackups(filteredBackups);

        return NextResponse.json({
            success: true,
            message: '스케줄된 백업이 삭제되었습니다.'
        });

    } catch (error) {
        console.error('스케줄된 백업 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '스케줄된 백업 삭제에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 