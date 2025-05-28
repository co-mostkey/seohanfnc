import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface SystemStatus {
    server: {
        uptime: number;
        platform: string;
        nodeVersion: string;
        memory: {
            total: number;
            used: number;
            free: number;
            usage: number;
        };
        cpu: {
            model: string;
            cores: number;
            load: number[];
        };
    };
    application: {
        version: string;
        environment: string;
        lastRestart: string;
        activeConnections: number;
    };
    storage: {
        dataDirectory: {
            path: string;
            size: number;
            available: number;
            usage: number;
        };
        backupDirectory: {
            path: string;
            size: number;
            available: number;
            usage: number;
        };
    };
    database: {
        status: 'healthy' | 'warning' | 'error';
        fileCount: number;
        totalSize: number;
        lastBackup: string;
    };
    services: {
        webServer: 'running' | 'stopped' | 'error';
        fileSystem: 'healthy' | 'warning' | 'error';
        notifications: 'enabled' | 'disabled' | 'error';
    };
    health: {
        overall: 'healthy' | 'warning' | 'critical';
        score: number;
        issues: string[];
        recommendations: string[];
    };
}

// 디렉토리 크기 계산
async function getDirectorySize(dirPath: string): Promise<number> {
    try {
        let totalSize = 0;
        const items = await fs.readdir(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = await fs.stat(itemPath);

            if (stats.isDirectory()) {
                totalSize += await getDirectorySize(itemPath);
            } else {
                totalSize += stats.size;
            }
        }

        return totalSize;
    } catch (error) {
        console.warn(`디렉토리 크기 계산 실패: ${dirPath}`, error);
        return 0;
    }
}

// 파일 개수 계산
async function countFiles(dirPath: string): Promise<number> {
    try {
        let fileCount = 0;
        const items = await fs.readdir(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = await fs.stat(itemPath);

            if (stats.isDirectory()) {
                fileCount += await countFiles(itemPath);
            } else {
                fileCount++;
            }
        }

        return fileCount;
    } catch (error) {
        console.warn(`파일 개수 계산 실패: ${dirPath}`, error);
        return 0;
    }
}

// 바이트를 읽기 쉬운 형태로 변환
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 시스템 상태 수집
async function collectSystemStatus(): Promise<SystemStatus> {
    const dataDir = path.join(process.cwd(), 'data');
    const backupDir = path.join(process.cwd(), 'backups');

    // 메모리 정보
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // CPU 정보
    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    // 디렉토리 크기 및 파일 개수
    const dataSize = await getDirectorySize(dataDir);
    const backupSize = await getDirectorySize(backupDir);
    const fileCount = await countFiles(dataDir);

    // 마지막 백업 시간 확인
    let lastBackup = '';
    try {
        const backupFiles = await fs.readdir(backupDir);
        const backupDates = backupFiles
            .filter(file => file.endsWith('.zip'))
            .map(file => {
                const stats = fs.stat(path.join(backupDir, file));
                return stats;
            });

        if (backupDates.length > 0) {
            const latestBackup = await Promise.all(backupDates);
            const latest = latestBackup.reduce((latest, current) =>
                current.birthtime > latest.birthtime ? current : latest
            );
            lastBackup = latest.birthtime.toISOString();
        }
    } catch (error) {
        console.warn('백업 정보 확인 실패:', error);
    }

    // 건강 상태 평가
    const issues: string[] = [];
    const recommendations: string[] = [];
    let healthScore = 100;

    // 메모리 사용률 체크
    const memoryUsage = (usedMemory / totalMemory) * 100;
    if (memoryUsage > 90) {
        issues.push('메모리 사용률이 90%를 초과했습니다.');
        recommendations.push('불필요한 프로세스를 종료하거나 메모리를 증설하세요.');
        healthScore -= 20;
    } else if (memoryUsage > 80) {
        issues.push('메모리 사용률이 높습니다.');
        recommendations.push('메모리 사용량을 모니터링하세요.');
        healthScore -= 10;
    }

    // 디스크 사용률 체크 (간단한 추정)
    const estimatedDiskUsage = (dataSize + backupSize) / (1024 * 1024 * 1024); // GB
    if (estimatedDiskUsage > 10) {
        issues.push('데이터 디렉토리 크기가 큽니다.');
        recommendations.push('오래된 백업 파일을 정리하세요.');
        healthScore -= 10;
    }

    // 백업 상태 체크
    if (!lastBackup) {
        issues.push('백업 기록이 없습니다.');
        recommendations.push('정기 백업을 설정하세요.');
        healthScore -= 15;
    } else {
        const backupAge = Date.now() - new Date(lastBackup).getTime();
        const daysSinceBackup = backupAge / (1000 * 60 * 60 * 24);
        if (daysSinceBackup > 7) {
            issues.push('마지막 백업이 일주일 이상 지났습니다.');
            recommendations.push('백업을 실행하세요.');
            healthScore -= 10;
        }
    }

    // 전체 건강 상태 결정
    let overallHealth: 'healthy' | 'warning' | 'critical';
    if (healthScore >= 90) {
        overallHealth = 'healthy';
    } else if (healthScore >= 70) {
        overallHealth = 'warning';
    } else {
        overallHealth = 'critical';
    }

    return {
        server: {
            uptime: os.uptime(),
            platform: os.platform(),
            nodeVersion: process.version,
            memory: {
                total: totalMemory,
                used: usedMemory,
                free: freeMemory,
                usage: memoryUsage
            },
            cpu: {
                model: cpus[0]?.model || 'Unknown',
                cores: cpus.length,
                load: loadAvg
            }
        },
        application: {
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            lastRestart: new Date().toISOString(), // 실제로는 앱 시작 시간
            activeConnections: 1 // 실제로는 활성 연결 수
        },
        storage: {
            dataDirectory: {
                path: dataDir,
                size: dataSize,
                available: freeMemory, // 간단한 추정
                usage: (dataSize / (dataSize + freeMemory)) * 100
            },
            backupDirectory: {
                path: backupDir,
                size: backupSize,
                available: freeMemory, // 간단한 추정
                usage: (backupSize / (backupSize + freeMemory)) * 100
            }
        },
        database: {
            status: fileCount > 0 ? 'healthy' : 'warning',
            fileCount,
            totalSize: dataSize,
            lastBackup
        },
        services: {
            webServer: 'running',
            fileSystem: 'healthy',
            notifications: 'enabled'
        },
        health: {
            overall: overallHealth,
            score: Math.max(0, healthScore),
            issues,
            recommendations
        }
    };
}

/**
 * GET - 시스템 상태 조회
 */
export async function GET() {
    try {
        const status = await collectSystemStatus();

        return NextResponse.json({
            success: true,
            status,
            timestamp: new Date().toISOString(),
            message: '시스템 상태를 성공적으로 조회했습니다.'
        });
    } catch (error) {
        console.error('시스템 상태 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '시스템 상태 조회에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 