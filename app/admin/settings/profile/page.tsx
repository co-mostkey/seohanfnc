"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    User, Save, RefreshCw, Lock, Eye, EyeOff,
    AlertTriangle, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    department?: string;
    bio?: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    permissions: string[];
}

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // 기본 정보 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [bio, setBio] = useState('');

    // 비밀번호 변경 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 프로필 로드
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch('/api/admin/settings/profile');
                const result = await response.json();

                if (result.success) {
                    const profileData = result.profile;
                    setProfile(profileData);
                    setName(profileData.name || '');
                    setEmail(profileData.email || '');
                    setPhone(profileData.phone || '');
                    setDepartment(profileData.department || '');
                    setBio(profileData.bio || '');
                } else {
                    throw new Error(result.error || '프로필을 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
                toast.error('프로필을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, []);

    // 변경사항 감지
    useEffect(() => {
        if (!profile) return;

        const hasBasicChanges =
            name !== (profile.name || '') ||
            email !== (profile.email || '') ||
            phone !== (profile.phone || '') ||
            department !== (profile.department || '') ||
            bio !== (profile.bio || '');

        setHasChanges(hasBasicChanges);
    }, [profile, name, email, phone, department, bio]);

    // 기본 정보 저장
    const handleSaveProfile = async () => {
        if (!name.trim()) {
            toast.error('이름을 입력해주세요.');
            return;
        }

        if (!email.trim()) {
            toast.error('이메일을 입력해주세요.');
            return;
        }

        // 간단한 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/admin/settings/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    department: department.trim(),
                    bio: bio.trim()
                }),
            });

            const result = await response.json();

            if (result.success) {
                setProfile(result.profile);
                setHasChanges(false);
                toast.success('프로필이 성공적으로 업데이트되었습니다.');
            } else {
                throw new Error(result.error || '프로필 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            toast.error('프로필 저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    // 비밀번호 변경
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('모든 비밀번호 필드를 입력해주세요.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('새 비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/admin/settings/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                }),
            });

            const result = await response.json();

            if (result.success) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                toast.success('비밀번호가 성공적으로 변경되었습니다.');
            } else {
                throw new Error(result.error || '비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            toast.error('비밀번호 변경에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>프로필을 불러오는 중...</span>
                </div>
            </div>
        );
    }

    if (!profile) {
    return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">프로필을 불러올 수 없습니다</h3>
                    <p className="text-gray-600 mb-4">인증이 만료되었거나 서버 오류가 발생했습니다.</p>
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
                        <User className="h-8 w-8 mr-3" />
                        프로필 설정
                    </h1>
                    <p className="text-gray-600 mt-1">
                        개인 정보를 관리합니다.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={handleSaveProfile}
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

            {/* 프로필 탭 */}
            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        기본 정보
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        비밀번호 변경
                    </TabsTrigger>
                </TabsList>

                {/* 기본 정보 탭 */}
                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                기본 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* 계정 정보 (읽기 전용) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>사용자 ID</Label>
                                    <Input
                                        value={profile.username}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <p className="text-sm text-gray-500">사용자 ID는 변경할 수 없습니다.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>역할</Label>
                                    <Input
                                        value={profile.role === 'admin' ? '관리자' : profile.role === 'editor' ? '편집자' : profile.role}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* 편집 가능한 정보 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">이름 *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="이름을 입력하세요"
                                        maxLength={50}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">이메일 *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="이메일을 입력하세요"
                                        maxLength={100}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">전화번호</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="전화번호를 입력하세요"
                                        maxLength={20}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">부서</Label>
                                    <Input
                                        id="department"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        placeholder="부서를 입력하세요"
                                        maxLength={50}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">소개</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="간단한 소개를 입력하세요"
                                    rows={3}
                                    maxLength={200}
                                />
                                <p className="text-sm text-gray-500">
                                    {bio.length}/200자
                                </p>
                            </div>

                            {/* 계정 상태 정보 */}
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>계정 생성일</Label>
                                    <Input
                                        value={new Date(profile.createdAt).toLocaleString('ko-KR')}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>마지막 로그인</Label>
                                    <Input
                                        value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('ko-KR') : '없음'}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 보안 탭 */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Lock className="h-5 w-5 mr-2" />
                                비밀번호 변경
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                                    <div className="text-blue-800 text-sm">
                                        <p className="font-medium mb-1">비밀번호 변경 안내</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>현재 비밀번호를 정확히 입력해주세요</li>
                                            <li>새 비밀번호는 최소 6자 이상이어야 합니다</li>
                                            <li>비밀번호 변경 후 다시 로그인해야 할 수 있습니다</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">현재 비밀번호 *</Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="현재 비밀번호를 입력하세요"
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">새 비밀번호 *</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">새 비밀번호 확인 *</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 비밀번호 일치 확인 */}
                            {newPassword && confirmPassword && (
                                <div className={`flex items-center text-sm ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {newPassword === confirmPassword ? (
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                    )}
                                    {newPassword === confirmPassword ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                                </div>
                            )}

                            <Button
                                onClick={handleChangePassword}
                                disabled={isSaving || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                className="w-full"
                            >
                                {isSaving ? (
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Lock className="h-4 w-4 mr-2" />
                                )}
                                비밀번호 변경
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 