// 시스템 설정 관련 타입 정의

export interface SiteSettings {
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

export interface NotificationSettings {
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

export interface AdminProfile {
    id: string;
    username: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    department?: string;
    bio?: string;
    preferences: {
        language: string;
        timezone: string;
        theme: 'light' | 'dark' | 'auto';
        emailNotifications: boolean;
        dashboardLayout: string;
    };
    security: {
        lastPasswordChange: string;
        twoFactorEnabled: boolean;
        loginHistory: Array<{
            timestamp: string;
            ip: string;
            userAgent: string;
            success: boolean;
        }>;
    };
    createdAt: string;
    updatedAt: string;
}

export interface SystemStatus {
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

export interface BackupSettings {
    autoBackup: boolean;
    backupInterval: number;
    maxBackups: number;
    lastBackup: string;
    retentionDays: number;
    compressionLevel: number;
    includeUploads: boolean;
    includeLogs: boolean;
}

export interface SecuritySettings {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireStrongPassword: boolean;
    twoFactorAuth: boolean;
    autoLogout: boolean;
    ipWhitelist: string[];
    bruteForceProtection: boolean;
    passwordExpiry: number;
}

export interface PerformanceSettings {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    imageOptimization: boolean;
    lazyLoading: boolean;
    cdnEnabled: boolean;
    maxFileSize: number;
    maxUploadSize: number;
    sessionStorage: 'memory' | 'file' | 'database';
}

// API 응답 타입
export interface SettingsApiResponse<T = any> {
    success: boolean;
    data?: T;
    settings?: T;
    message?: string;
    error?: string;
    details?: string;
}

// 설정 변경 이벤트 타입
export interface SettingsChangeEvent {
    section: keyof SiteSettings;
    key: string;
    oldValue: any;
    newValue: any;
    timestamp: string;
    userId: string;
}

// 설정 유효성 검사 결과
export interface SettingsValidationResult {
    isValid: boolean;
    errors: Array<{
        field: string;
        message: string;
        code: string;
    }>;
    warnings: Array<{
        field: string;
        message: string;
        code: string;
    }>;
} 