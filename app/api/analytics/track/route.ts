import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const analyticsFilePath = path.join(process.cwd(), 'data', 'analytics.json');

interface TrackingEvent {
    type: 'page_view' | 'product_view' | 'inquiry_submit' | 'download';
    page?: string;
    product?: string;
    userAgent?: string;
    ip?: string;
    timestamp: string;
}

interface AnalyticsData {
    dailyStats: Array<{
        date: string;
        visitors: number;
        inquiries: number;
        productViews: number;
    }>;
    popularProducts: Array<{
        name: string;
        views: number;
        change: string;
        category: string;
    }>;
    recentInquiries: Array<{
        id: string;
        date: string;
        type: string;
        subject: string;
        status: string;
        priority: string;
    }>;
    metadata: {
        lastUpdated: string;
        dataSource: string;
        updateFrequency: string;
        retentionPeriod: string;
    };
}

// 분석 데이터 읽기
async function readAnalyticsData(): Promise<AnalyticsData | null> {
    try {
        const content = await fs.readFile(analyticsFilePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading analytics data:', error);
        return null;
    }
}

// 분석 데이터 저장
async function saveAnalyticsData(data: AnalyticsData): Promise<void> {
    try {
        await fs.writeFile(analyticsFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving analytics data:', error);
        throw error;
    }
}

// 오늘 날짜 문자열 생성
function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

// 클라이언트 IP 주소 추출
function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, page, product }: TrackingEvent = body;

        if (!type) {
            return NextResponse.json(
                { message: 'Event type is required' },
                { status: 400 }
            );
        }

        // 분석 데이터 읽기
        const analyticsData = await readAnalyticsData();

        if (!analyticsData) {
            return NextResponse.json(
                { message: 'Analytics data not found' },
                { status: 500 }
            );
        }

        const today = getTodayString();
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const clientIP = getClientIP(request);

        // 오늘 날짜의 통계 찾기 또는 생성
        let todayStats = analyticsData.dailyStats.find(stat => stat.date === today);

        if (!todayStats) {
            todayStats = {
                date: today,
                visitors: 0,
                inquiries: 0,
                productViews: 0
            };
            analyticsData.dailyStats.push(todayStats);
        }

        // 이벤트 타입에 따른 통계 업데이트
        switch (type) {
            case 'page_view':
                todayStats.visitors += 1;
                break;

            case 'product_view':
                todayStats.productViews += 1;

                // 인기 제품 업데이트
                if (product) {
                    const popularProduct = analyticsData.popularProducts.find(p => p.name === product);
                    if (popularProduct) {
                        popularProduct.views += 1;
                    }
                }
                break;

            case 'inquiry_submit':
                todayStats.inquiries += 1;
                break;

            case 'download':
                // 다운로드 통계는 별도로 관리할 수 있음
                break;
        }

        // 메타데이터 업데이트
        analyticsData.metadata.lastUpdated = new Date().toISOString();

        // 데이터 저장
        await saveAnalyticsData(analyticsData);

        // 개발 환경에서는 로그 출력
        if (process.env.NODE_ENV === 'development') {
            console.log(`Analytics tracked: ${type}`, {
                page,
                product,
                ip: clientIP,
                userAgent: userAgent.substring(0, 50) + '...',
                timestamp: new Date().toISOString()
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Event tracked successfully',
            event: {
                type,
                page,
                product,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to track event',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// GET 요청으로 현재 통계 조회
export async function GET() {
    try {
        const analyticsData = await readAnalyticsData();

        if (!analyticsData) {
            return NextResponse.json(
                { message: 'Analytics data not found' },
                { status: 404 }
            );
        }

        const today = getTodayString();
        const todayStats = analyticsData.dailyStats.find(stat => stat.date === today);

        return NextResponse.json({
            today: todayStats || { date: today, visitors: 0, inquiries: 0, productViews: 0 },
            total: {
                totalDays: analyticsData.dailyStats.length,
                totalVisitors: analyticsData.dailyStats.reduce((sum, day) => sum + day.visitors, 0),
                totalInquiries: analyticsData.dailyStats.reduce((sum, day) => sum + day.inquiries, 0),
                totalProductViews: analyticsData.dailyStats.reduce((sum, day) => sum + day.productViews, 0),
            },
            lastUpdated: analyticsData.metadata.lastUpdated
        });

    } catch (error) {
        console.error('Analytics GET error:', error);
        return NextResponse.json(
            { message: 'Failed to get analytics data' },
            { status: 500 }
        );
    }
} 