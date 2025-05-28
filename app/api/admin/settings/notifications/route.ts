import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const notificationsFilePath = path.join(dataDir, 'notifications.json');

interface NotificationSettings {
    emailNotifications: boolean;
    inquiryNotifications: boolean;
    systemAlerts: boolean;
    notificationEmail: string;
    slackWebhook: string;
    emailTemplates: {
        inquiry: string;
        systemAlert: string;
        welcome: string;
    };
    schedules: {
        dailyReport: boolean;
        weeklyReport: boolean;
        monthlyReport: boolean;
    };
}

const defaultNotificationSettings: NotificationSettings = {
    emailNotifications: true,
    inquiryNotifications: true,
    systemAlerts: true,
    notificationEmail: 'admin@seohanfc.com',
    slackWebhook: '',
    emailTemplates: {
        inquiry: '새로운 문의가 접수되었습니다.\n\n문의자: {{name}}\n이메일: {{email}}\n내용: {{message}}',
        systemAlert: '시스템 알림: {{title}}\n\n내용: {{message}}\n시간: {{timestamp}}',
        welcome: '{{name}}님, 서한F&C에 오신 것을 환영합니다!'
    },
    schedules: {
        dailyReport: false,
        weeklyReport: true,
        monthlyReport: true,
    }
};

// 데이터 디렉토리 확인 및 생성
async function ensureDataDir() {
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// 알림 설정 읽기
async function readNotificationSettings(): Promise<NotificationSettings> {
    try {
        await ensureDataDir();
        const content = await fs.readFile(notificationsFilePath, 'utf8');
        const savedSettings = JSON.parse(content);

        // 기본 설정과 병합하여 누락된 필드 보완
        return {
            ...defaultNotificationSettings,
            ...savedSettings,
            emailTemplates: {
                ...defaultNotificationSettings.emailTemplates,
                ...savedSettings.emailTemplates
            },
            schedules: {
                ...defaultNotificationSettings.schedules,
                ...savedSettings.schedules
            }
        };
    } catch (error) {
        console.log('알림 설정 파일이 없거나 읽기 실패, 기본 설정 사용:', error);
        return defaultNotificationSettings;
    }
}

// 알림 설정 저장
async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(notificationsFilePath, JSON.stringify(settings, null, 2), 'utf8');
}

/**
 * GET - 알림 설정 조회
 */
export async function GET() {
    try {
        const settings = await readNotificationSettings();

        return NextResponse.json({
            success: true,
            settings,
            message: '알림 설정을 성공적으로 불러왔습니다.'
        });
    } catch (error) {
        console.error('알림 설정 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '알림 설정을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 알림 설정 업데이트
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { settings: newSettings } = body;

        if (!newSettings) {
            return NextResponse.json(
                { success: false, error: '알림 설정 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        // 현재 설정 읽기
        const currentSettings = await readNotificationSettings();

        // 새 설정과 병합
        const updatedSettings: NotificationSettings = {
            ...currentSettings,
            ...newSettings,
            emailTemplates: {
                ...currentSettings.emailTemplates,
                ...newSettings.emailTemplates
            },
            schedules: {
                ...currentSettings.schedules,
                ...newSettings.schedules
            }
        };

        // 설정 저장
        await saveNotificationSettings(updatedSettings);

        return NextResponse.json({
            success: true,
            settings: updatedSettings,
            message: '알림 설정이 성공적으로 저장되었습니다.'
        });
    } catch (error) {
        console.error('알림 설정 저장 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '알림 설정 저장에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * POST - 테스트 알림 발송
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, recipient } = body;

        if (!type) {
            return NextResponse.json(
                { success: false, error: '알림 타입이 필요합니다.' },
                { status: 400 }
            );
        }

        const settings = await readNotificationSettings();

        // 실제 환경에서는 여기서 이메일/Slack 발송 로직 구현
        console.log(`테스트 알림 발송: ${type} to ${recipient || settings.notificationEmail}`);

        return NextResponse.json({
            success: true,
            message: `${type} 테스트 알림이 발송되었습니다.`,
            recipient: recipient || settings.notificationEmail
        });
    } catch (error) {
        console.error('테스트 알림 발송 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '테스트 알림 발송에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 