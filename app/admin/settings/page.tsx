'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Settings, Save, RefreshCw, Bell, Shield, Palette,
    Globe, Database, Monitor, AlertTriangle, Download, Upload, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

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

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // 설정 로드
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/admin/settings');
                const result = await response.json();

                if (result.success) {
                    setSettings(result.settings);
                } else {
                    throw new Error(result.error || '설정을 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
                toast.error('설정을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    // 설정 저장
    const handleSave = async () => {
        if (!settings) return;

        setSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ settings }),
            });

            const result = await response.json();

            if (result.success) {
                setSettings(result.settings);
                setHasChanges(false);
                toast.success('설정이 성공적으로 저장되었습니다.');
            } else {
                throw new Error(result.error || '설정 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('설정 저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    // 설정 초기화
    const handleReset = async () => {
        setIsResetting(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
            });

            const result = await response.json();

            if (result.success) {
                setSettings(result.settings);
                setHasChanges(false);
                toast.success('설정이 기본값으로 초기화되었습니다.');
            } else {
                throw new Error(result.error || '설정 초기화에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to reset settings:', error);
            toast.error('설정 초기화에 실패했습니다.');
        } finally {
            setIsResetting(false);
        }
    };

    // 설정 변경 핸들러
    const updateSetting = (section: keyof SiteSettings, key: string, value: any) => {
        if (!settings) return;

        setSettings(prev => ({
            ...prev!,
            [section]: {
                ...prev![section],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    // 백업 생성
    const createBackup = async () => {
        try {
            toast.info('백업을 생성하고 있습니다...');

            const response = await fetch('/api/admin/backups/files', {
                method: 'POST',
            });

            const result = await response.json();

            if (result.success) {
                // 백업 생성 후 설정의 lastBackup 업데이트
                updateSetting('backup', 'lastBackup', new Date().toISOString());
                toast.success('백업이 성공적으로 생성되었습니다.');
            } else {
                throw new Error(result.error || '백업 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Backup creation failed:', error);
            toast.error('백업 생성에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>설정을 불러오는 중...</span>
                </div>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">설정을 불러올 수 없습니다</h3>
                    <p className="text-gray-600 mb-4">설정 파일에 문제가 있거나 서버 오류가 발생했습니다.</p>
                    <Button onClick={() => window.location.reload()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        다시 시도
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <Settings className="h-8 w-8 mr-3" />
                        시스템 설정
                    </h1>
                    <p className="text-gray-600 mt-1">
                        관리자 시스템의 전반적인 설정을 관리합니다.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isResetting}
                        className="min-w-[100px]"
                    >
                        {isResetting ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <RotateCcw className="h-4 w-4 mr-2" />
                        )}
                        초기화
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className="min-w-[100px]"
                    >
                        {isSaving ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        저장
                    </Button>
                </div>
            </div>

            {/* 변경사항 알림 */}
            {hasChanges && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-800">저장되지 않은 변경사항이 있습니다.</span>
                    </div>
                </div>
            )}

            {/* 설정 탭 */}
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="general" className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        일반
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        알림
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        보안
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        외관
                    </TabsTrigger>
                    <TabsTrigger value="backup" className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        백업
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        성능
                    </TabsTrigger>
                </TabsList>

                {/* 일반 설정 */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Globe className="h-5 w-5 mr-2" />
                                일반 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">사이트 이름</Label>
                                    <Input
                                        id="siteName"
                                        value={settings.general.siteName}
                                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                                        placeholder="사이트 이름을 입력하세요"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteUrl">사이트 URL</Label>
                                    <Input
                                        id="siteUrl"
                                        value={settings.general.siteUrl}
                                        onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">사이트 설명</Label>
                                <Textarea
                                    id="siteDescription"
                                    value={settings.general.siteDescription}
                                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                                    placeholder="사이트에 대한 간단한 설명을 입력하세요"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">관리자 이메일</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        value={settings.general.adminEmail}
                                        onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">시간대</Label>
                                    <Select
                                        value={settings.general.timezone}
                                        onValueChange={(value) => updateSetting('general', 'timezone', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="language">언어</Label>
                                    <Select
                                        value={settings.general.language}
                                        onValueChange={(value) => updateSetting('general', 'language', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ko">한국어</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ja">日本語</SelectItem>
                                            <SelectItem value="zh">中文</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>유지보수 모드</Label>
                                        <p className="text-sm text-gray-600">
                                            활성화하면 관리자만 사이트에 접근할 수 있습니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.general.maintenanceMode}
                                        onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>디버그 모드</Label>
                                        <p className="text-sm text-gray-600">
                                            개발 중에만 활성화하세요. 상세한 오류 정보가 표시됩니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.general.debugMode}
                                        onCheckedChange={(checked) => updateSetting('general', 'debugMode', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 알림 설정 */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bell className="h-5 w-5 mr-2" />
                                알림 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>이메일 알림</Label>
                                        <p className="text-sm text-gray-600">
                                            시스템 이벤트에 대한 이메일 알림을 받습니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.emailNotifications}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>문의 알림</Label>
                                        <p className="text-sm text-gray-600">
                                            새로운 문의가 등록되면 알림을 받습니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.inquiryNotifications}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'inquiryNotifications', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>시스템 알림</Label>
                                        <p className="text-sm text-gray-600">
                                            시스템 오류 및 중요 이벤트 알림을 받습니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.systemAlerts}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="notificationEmail">알림 이메일</Label>
                                    <Input
                                        id="notificationEmail"
                                        type="email"
                                        value={settings.notifications.notificationEmail}
                                        onChange={(e) => updateSetting('notifications', 'notificationEmail', e.target.value)}
                                        placeholder="notifications@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slackWebhook">Slack 웹훅 URL</Label>
                                    <Input
                                        id="slackWebhook"
                                        value={settings.notifications.slackWebhook}
                                        onChange={(e) => updateSetting('notifications', 'slackWebhook', e.target.value)}
                                        placeholder="https://hooks.slack.com/..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 보안 설정 */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="h-5 w-5 mr-2" />
                                보안 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
                                    <Input
                                        id="sessionTimeout"
                                        type="number"
                                        min="5"
                                        max="480"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxLoginAttempts">최대 로그인 시도 횟수</Label>
                                    <Input
                                        id="maxLoginAttempts"
                                        type="number"
                                        min="3"
                                        max="10"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>강력한 비밀번호 요구</Label>
                                        <p className="text-sm text-gray-600">
                                            비밀번호에 대문자, 소문자, 숫자, 특수문자를 포함하도록 요구합니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.security.requireStrongPassword}
                                        onCheckedChange={(checked) => updateSetting('security', 'requireStrongPassword', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>2단계 인증</Label>
                                        <p className="text-sm text-gray-600">
                                            로그인 시 추가 인증 단계를 요구합니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.security.twoFactorAuth}
                                        onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>자동 로그아웃</Label>
                                        <p className="text-sm text-gray-600">
                                            비활성 상태가 지속되면 자동으로 로그아웃됩니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.security.autoLogout}
                                        onCheckedChange={(checked) => updateSetting('security', 'autoLogout', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 외관 설정 */}
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Palette className="h-5 w-5 mr-2" />
                                외관 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="theme">테마</Label>
                                    <Select
                                        value={settings.appearance.theme}
                                        onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">라이트</SelectItem>
                                            <SelectItem value="dark">다크</SelectItem>
                                            <SelectItem value="auto">시스템 설정 따름</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="primaryColor">기본 색상</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="primaryColor"
                                            type="color"
                                            value={settings.appearance.primaryColor}
                                            onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                                            className="w-16 h-10"
                                        />
                                        <Input
                                            value={settings.appearance.primaryColor}
                                            onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                                            placeholder="#ea580c"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customCSS">커스텀 CSS</Label>
                                <Textarea
                                    id="customCSS"
                                    value={settings.appearance.customCSS}
                                    onChange={(e) => updateSetting('appearance', 'customCSS', e.target.value)}
                                    placeholder="/* 커스텀 CSS 코드를 입력하세요 */"
                                    rows={8}
                                    className="font-mono text-sm"
                                />
                                <p className="text-sm text-gray-600">
                                    주의: 잘못된 CSS 코드는 사이트 레이아웃을 깨뜨릴 수 있습니다.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 백업 설정 */}
                <TabsContent value="backup">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Database className="h-5 w-5 mr-2" />
                                백업 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>자동 백업</Label>
                                    <p className="text-sm text-gray-600">
                                        설정된 간격으로 자동으로 백업을 생성합니다.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.backup.autoBackup}
                                    onCheckedChange={(checked) => updateSetting('backup', 'autoBackup', checked)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="backupInterval">백업 간격 (시간)</Label>
                                    <Input
                                        id="backupInterval"
                                        type="number"
                                        min="1"
                                        max="168"
                                        value={settings.backup.backupInterval}
                                        onChange={(e) => updateSetting('backup', 'backupInterval', parseInt(e.target.value))}
                                        disabled={!settings.backup.autoBackup}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxBackups">최대 백업 보관 수</Label>
                                    <Input
                                        id="maxBackups"
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={settings.backup.maxBackups}
                                        onChange={(e) => updateSetting('backup', 'maxBackups', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>마지막 백업</Label>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm">
                                        {settings.backup.lastBackup
                                            ? new Date(settings.backup.lastBackup).toLocaleString('ko-KR')
                                            : '백업 기록이 없습니다.'
                                        }
                                    </span>
                                    <Button onClick={createBackup} size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        지금 백업
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 성능 설정 */}
                <TabsContent value="performance">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Monitor className="h-5 w-5 mr-2" />
                                성능 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>캐시 활성화</Label>
                                        <p className="text-sm text-gray-600">
                                            페이지 로딩 속도를 향상시키기 위해 캐시를 사용합니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.performance.cacheEnabled}
                                        onCheckedChange={(checked) => updateSetting('performance', 'cacheEnabled', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>압축 활성화</Label>
                                        <p className="text-sm text-gray-600">
                                            파일 크기를 줄여 전송 속도를 향상시킵니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.performance.compressionEnabled}
                                        onCheckedChange={(checked) => updateSetting('performance', 'compressionEnabled', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>이미지 최적화</Label>
                                        <p className="text-sm text-gray-600">
                                            이미지를 자동으로 최적화하여 로딩 속도를 개선합니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.performance.imageOptimization}
                                        onCheckedChange={(checked) => updateSetting('performance', 'imageOptimization', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>지연 로딩</Label>
                                        <p className="text-sm text-gray-600">
                                            화면에 보이는 콘텐츠만 먼저 로드합니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.performance.lazyLoading}
                                        onCheckedChange={(checked) => updateSetting('performance', 'lazyLoading', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>CDN 활성화</Label>
                                        <p className="text-sm text-gray-600">
                                            콘텐츠 전송 네트워크를 사용하여 전 세계 사용자에게 빠른 서비스를 제공합니다.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={settings.performance.cdnEnabled}
                                        onCheckedChange={(checked) => updateSetting('performance', 'cdnEnabled', checked)}
                                    />
                        </div>
            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 