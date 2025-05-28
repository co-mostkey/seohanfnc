"use client";

import React, { useState, useEffect } from "react";
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_UI, ADMIN_CARD_STYLES } from "@/lib/admin-ui-constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Mail, Phone, Bell, MessageSquare, SendHorizonal } from "lucide-react";
import { validateEmail, validatePhone } from "@/lib/validators/email-validator";

// 알림 설정 인터페이스
interface NotificationSettings {
    email: string;
    phone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    messageNotifications: boolean;
}

export default function NotificationsSettingsPage() {
    const [settings, setSettings] = useState<NotificationSettings>({
        email: "",
        phone: "",
        emailNotifications: true,
        pushNotifications: true,
        messageNotifications: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testEmailSending, setTestEmailSending] = useState(false);

    useEffect(() => {
        // 설정 데이터 로드
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            // API 호출
            const response = await fetch('/api/admin/settings/notifications');

            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
            } else {
                // 기본값 설정 (데이터가 없는 경우)
                setSettings({
                    email: "admin@seohanfnc.com",
                    phone: "02-1234-5678",
                    emailNotifications: true,
                    pushNotifications: true,
                    messageNotifications: true,
                });
            }
        } catch (error) {
            console.error("설정 로드 중 오류 발생:", error);
            toast.error("설정을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const validateSettings = () => {
        // 이메일 형식 검증
        if (settings.email) {
            const emailResult = validateEmail(settings.email);
            if (!emailResult.valid) {
                toast.error(emailResult.message);
                return false;
            }
        }

        // 전화번호 형식 검증
        if (settings.phone) {
            const phoneResult = validatePhone(settings.phone);
            if (!phoneResult.valid) {
                toast.error(phoneResult.message);
                return false;
            }
        }

        return true;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 유효성 검사
            if (!validateSettings()) {
                setSaving(false);
                return;
            }

            // API 호출
            const response = await fetch('/api/admin/settings/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ settings }),
            });

            if (!response.ok) {
                throw new Error('설정 저장에 실패했습니다.');
            }

            toast.success("설정이 저장되었습니다.");
        } catch (error) {
            console.error("설정 저장 중 오류:", error);
            toast.error("설정 저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    // 테스트 이메일 발송 함수
    const sendTestEmail = async () => {
        // 이메일 유효성 검사
        if (!settings.email) {
            toast.error("테스트 이메일을 보낼 이메일 주소가 필요합니다.");
            return;
        }

        const emailResult = validateEmail(settings.email);
        if (!emailResult.valid) {
            toast.error(emailResult.message);
            return;
        }

        setTestEmailSending(true);
        try {
            const response = await fetch('/api/admin/settings/test-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: settings.email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '테스트 이메일 발송에 실패했습니다.');
            }

            toast.success("테스트 이메일이 발송되었습니다. 메일함을 확인해주세요.");
        } catch (error) {
            console.error("테스트 이메일 발송 중 오류:", error);
            toast.error(error instanceof Error ? error.message : "테스트 이메일 발송에 실패했습니다.");
        } finally {
            setTestEmailSending(false);
        }
    };

    const handleChange = (field: keyof NotificationSettings) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSettings({
            ...settings,
            [field]: e.target.value,
        });
    };

    const handleSwitchChange = (field: keyof NotificationSettings) => (
        checked: boolean
    ) => {
        setSettings({
            ...settings,
            [field]: checked,
        });
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6">
                <div className="flex items-center justify-center h-64 flex-col">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent mb-4"></div>
                    <p className="text-gray-300 font-medium" style={ADMIN_FONT_STYLES.BODY_TEXT}>설정 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-lg">
            <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>알림 설정</h1>
            <p className="text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                문의 관련 연락 정보 및 알림 설정을 관리합니다.
            </p>

            <div className={ADMIN_CARD_STYLES.DEFAULT}>
                <div className={ADMIN_CARD_STYLES.HEADER}>
                    <h2 className="text-lg font-medium text-gray-100" style={ADMIN_FONT_STYLES.SECTION_TITLE}>연락처 설정</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                <span>이메일 주소</span>
                            </div>
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                value={settings.email}
                                onChange={handleChange('email')}
                                placeholder="your@email.com"
                                className="bg-gray-800 border-gray-700 text-gray-200 flex-grow"
                                style={ADMIN_FONT_STYLES.BODY_TEXT}
                            />
                            <Button
                                variant="outline"
                                onClick={sendTestEmail}
                                disabled={testEmailSending || !settings.email}
                                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
                            >
                                <SendHorizonal className="h-4 w-4 mr-2 text-gray-400" />
                                {testEmailSending ? '전송 중...' : '테스트'}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            문의 고객에게 연락할 때 사용되는 이메일입니다.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-300" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                <span>전화번호</span>
                            </div>
                        </label>
                        <Input
                            type="tel"
                            value={settings.phone}
                            onChange={handleChange('phone')}
                            placeholder="02-1234-5678"
                            className="bg-gray-800 border-gray-700 text-gray-200"
                            style={ADMIN_FONT_STYLES.BODY_TEXT}
                        />
                        <p className="text-xs text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            문의 고객에게 연락할 때 사용되는 전화번호입니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className={ADMIN_CARD_STYLES.DEFAULT}>
                <div className={ADMIN_CARD_STYLES.HEADER}>
                    <h2 className="text-lg font-medium text-gray-100" style={ADMIN_FONT_STYLES.SECTION_TITLE}>알림 설정</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                <Label className="text-gray-200" style={ADMIN_FONT_STYLES.BODY_TEXT}>이메일 알림</Label>
                            </div>
                            <p className="text-sm text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                새 문의 및 중요 알림을 이메일로 받습니다.
                            </p>
                        </div>
                        <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={handleSwitchChange('emailNotifications')}
                            className="data-[state=checked]:bg-orange-600"
                        />
                    </div>
                    <Separator className="bg-gray-700" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center">
                                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                                <Label className="text-gray-200" style={ADMIN_FONT_STYLES.BODY_TEXT}>푸시 알림</Label>
                            </div>
                            <p className="text-sm text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                브라우저 푸시 알림을 받습니다.
                            </p>
                        </div>
                        <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={handleSwitchChange('pushNotifications')}
                            className="data-[state=checked]:bg-orange-600"
                        />
                    </div>
                    <Separator className="bg-gray-700" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center">
                                <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                                <Label className="text-gray-200" style={ADMIN_FONT_STYLES.BODY_TEXT}>메시지 알림</Label>
                            </div>
                            <p className="text-sm text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                새 메시지가 도착하면 알림을 받습니다.
                            </p>
                        </div>
                        <Switch
                            checked={settings.messageNotifications}
                            onCheckedChange={handleSwitchChange('messageNotifications')}
                            className="data-[state=checked]:bg-orange-600"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className={ADMIN_UI.BUTTON_PRIMARY}
                >
                    {saving ? '저장 중...' : '설정 저장'}
                </Button>
            </div>
        </div>
    );
} 