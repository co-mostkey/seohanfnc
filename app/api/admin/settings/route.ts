import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const settingsFilePath = path.join(dataDir, 'settings.json');

interface SiteSettings {
    general: {
        siteName: string;
        siteDescription: string;
        siteUrl: string;
        adminEmail: string;
        timezone: string;
        language: string;
        maintenanceMode: boolean;
        debugMode: boolean;
    };
    notifications: {
        emailNotifications: boolean;
        inquiryNotifications: boolean;
        systemAlerts: boolean;
        notificationEmail: string;
        slackWebhook: string;
    };
    security: {
        sessionTimeout: number;
        maxLoginAttempts: number;
        requireStrongPassword: boolean;
        twoFactorAuth: boolean;
        autoLogout: boolean;
    };
    appearance: {
        theme: 'light' | 'dark' | 'auto';
        primaryColor: string;
        customCSS: string;
    };
    backup: {
        autoBackup: boolean;
        backupInterval: number;
        maxBackups: number;
        lastBackup: string;
    };
    performance: {
        cacheEnabled: boolean;
        compressionEnabled: boolean;
        imageOptimization: boolean;
        lazyLoading: boolean;
        cdnEnabled: boolean;
    };
}

const defaultSettings: SiteSettings = {
    general: {
        siteName: '서한F&C',
        siteDescription: '서한F&C 웹사이트 관리 시스템',
        siteUrl: 'https://seohanfc.com',
        adminEmail: 'admin@seohanfc.com',
        timezone: 'Asia/Seoul',
        language: 'ko',
        maintenanceMode: false,
        debugMode: false,
    },
    notifications: {
        emailNotifications: true,
        inquiryNotifications: true,
        systemAlerts: true,
        notificationEmail: 'admin@seohanfc.com',
        slackWebhook: '',
    },
    security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        requireStrongPassword: true,
        twoFactorAuth: false,
        autoLogout: true,
    },
    appearance: {
        theme: 'light',
        primaryColor: '#ea580c',
        customCSS: '',
    },
    backup: {
        autoBackup: true,
        backupInterval: 24,
        maxBackups: 7,
        lastBackup: '',
    },
    performance: {
        cacheEnabled: true,
        compressionEnabled: true,
        imageOptimization: true,
        lazyLoading: true,
        cdnEnabled: false,
    },
};

// 데이터 디렉토리 확인 및 생성
async function ensureDataDir() {
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// 설정 파일 읽기
async function readSettings(): Promise<SiteSettings> {
    try {
        await ensureDataDir();
        const content = await fs.readFile(settingsFilePath, 'utf8');
        const savedSettings = JSON.parse(content);

        // 기본 설정과 병합하여 누락된 필드 보완
        return {
            general: { ...defaultSettings.general, ...savedSettings.general },
            notifications: { ...defaultSettings.notifications, ...savedSettings.notifications },
            security: { ...defaultSettings.security, ...savedSettings.security },
            appearance: { ...defaultSettings.appearance, ...savedSettings.appearance },
            backup: { ...defaultSettings.backup, ...savedSettings.backup },
            performance: { ...defaultSettings.performance, ...savedSettings.performance },
        };
    } catch (error) {
        console.log('설정 파일이 없거나 읽기 실패, 기본 설정 사용:', error);
        return defaultSettings;
    }
}

// 설정 파일 저장
async function saveSettings(settings: SiteSettings): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');
}

/**
 * GET - 현재 설정 조회
 */
export async function GET() {
    try {
        const settings = await readSettings();

        return NextResponse.json({
            success: true,
            settings,
            message: '설정을 성공적으로 불러왔습니다.'
        });
    } catch (error) {
        console.error('설정 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '설정을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 설정 업데이트
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { settings: newSettings } = body;

        if (!newSettings) {
            return NextResponse.json(
                { success: false, error: '설정 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        // 현재 설정 읽기
        const currentSettings = await readSettings();

        // 새 설정과 병합
        const updatedSettings: SiteSettings = {
            general: { ...currentSettings.general, ...newSettings.general },
            notifications: { ...currentSettings.notifications, ...newSettings.notifications },
            security: { ...currentSettings.security, ...newSettings.security },
            appearance: { ...currentSettings.appearance, ...newSettings.appearance },
            backup: { ...currentSettings.backup, ...newSettings.backup },
            performance: { ...currentSettings.performance, ...newSettings.performance },
        };

        // 설정 저장
        await saveSettings(updatedSettings);

        return NextResponse.json({
            success: true,
            settings: updatedSettings,
            message: '설정이 성공적으로 저장되었습니다.'
        });
    } catch (error) {
        console.error('설정 저장 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '설정 저장에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * POST - 설정 초기화
 */
export async function POST() {
    try {
        await saveSettings(defaultSettings);

        return NextResponse.json({
            success: true,
            settings: defaultSettings,
            message: '설정이 기본값으로 초기화되었습니다.'
        });
    } catch (error) {
        console.error('설정 초기화 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '설정 초기화에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 