import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Railway 헬스체크를 위한 API 엔드포인트
export async function GET() {
    try {
        // 기본적인 시스템 상태 확인
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'seohanfnc-website',
            version: '1.0.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
            }
        };

        return NextResponse.json(healthData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('Health check error:', error);

        return NextResponse.json(
            {
                status: 'unhealthy',
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

// POST 요청도 지원 (일부 헬스체크 시스템에서 사용)
export async function POST() {
    return GET();
}

// HEAD 요청 지원 (가벼운 헬스체크)
export async function HEAD() {
    try {
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        return new NextResponse(null, { status: 500 });
    }
}

// 헬스체크 API - NHN 클라우드 로드밸런서용
export async function GET_NHN() {
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
export async function HEAD_NHN() {
    return new Response('OK', { status: 200 });
} 