import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 헬스체크 API - NHN 클라우드 로드밸런서용
export async function GET() {
    try {
        const startTime = Date.now();

        // 기본 시스템 체크
        const systemInfo = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
            platform: process.platform,
        };

        // 중요 파일 시스템 체크
        const checks = {
            fileSystem: false,
            dataDirectory: false,
            publicDirectory: false,
        };

        try {
            // 데이터 디렉토리 체크
            const dataDir = path.join(process.cwd(), 'content', 'data');
            if (fs.existsSync(dataDir)) {
                checks.dataDirectory = true;
            }

            // Public 디렉토리 체크
            const publicDir = path.join(process.cwd(), 'public');
            if (fs.existsSync(publicDir)) {
                checks.publicDirectory = true;
            }

            // 전체 파일 시스템 상태
            checks.fileSystem = checks.dataDirectory && checks.publicDirectory;
        } catch (error) {
            console.error('Health check file system error:', error);
        }

        const responseTime = Date.now() - startTime;

        // 전체 상태 판단
        const isHealthy = checks.fileSystem && responseTime < 5000; // 5초 이내 응답

        const response = {
            ...systemInfo,
            checks,
            responseTime: `${responseTime}ms`,
            healthy: isHealthy,
        };

        return NextResponse.json(response, {
            status: isHealthy ? 200 : 503,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });

    } catch (error) {
        console.error('Health check error:', error);

        return NextResponse.json(
            {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
                healthy: false,
            },
            {
                status: 503,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
        );
    }
}

// 간단한 텍스트 응답용 (로드밸런서 간단 체크)
export async function HEAD() {
    return new Response('OK', { status: 200 });
} 