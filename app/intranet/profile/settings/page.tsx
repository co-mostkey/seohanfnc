'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Languages, 
  Lock, 
  Mail, 
  MessageSquare, 
  Calendar,
  Phone,
  Shield,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('ko');

  const handleSaveSettings = () => {
    // 저장 로직 구현
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="px-4 py-6 md:px-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">환경설정</h1>
        <p className="text-gray-400">개인 계정 및 시스템 설정을 관리합니다.</p>
      </div>

      <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 mb-8 bg-gray-800">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
            보안 설정
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-blue-600">
            화면 설정
          </TabsTrigger>
          <TabsTrigger value="sync" className="hidden md:block data-[state=active]:bg-blue-600">
            동기화 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="border rounded-lg border-gray-700 p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">알림 설정</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">이메일 알림</Label>
                </div>
                <p className="text-sm text-gray-400">중요 알림 및 업데이트를 이메일로 받습니다.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">푸시 알림</Label>
                </div>
                <p className="text-sm text-gray-400">브라우저 푸시 알림을 받습니다.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">메시지 알림</Label>
                </div>
                <p className="text-sm text-gray-400">새 메시지가 도착하면 알림을 받습니다.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">일정 알림</Label>
                </div>
                <p className="text-sm text-gray-400">일정 시작 시간 전에 알림을 받습니다.</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">SMS 알림</Label>
                </div>
                <p className="text-sm text-gray-400">긴급 상황에 SMS로 알림을 받습니다.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="border rounded-lg border-gray-700 p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">보안 설정</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">비밀번호 변경</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="current-password" className="text-white mb-2 block">현재 비밀번호</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showPassword ? "text" : "password"} 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="new-password" className="text-white mb-2 block">새 비밀번호</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password" className="text-white mb-2 block">비밀번호 확인</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white" 
                  />
                </div>
                
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      새 비밀번호와 확인 비밀번호가 일치하지 않습니다.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  비밀번호 변경
                </Button>
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">2단계 인증</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">2단계 인증 사용</Label>
                  <p className="text-sm text-gray-400">로그인 시 추가 보안 코드를 입력하여 계정을 보호합니다.</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">세션 관리</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                  <div>
                    <p className="text-white font-medium">Windows PC - Chrome</p>
                    <p className="text-sm text-gray-400">서울, 대한민국 • 현재 접속 중</p>
                  </div>
                  <Button variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10">
                    현재 세션
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                  <div>
                    <p className="text-white font-medium">Android Phone - App</p>
                    <p className="text-sm text-gray-400">서울, 대한민국 • 마지막 접속: 오늘</p>
                  </div>
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10">
                    로그아웃
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="border rounded-lg border-gray-700 p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">화면 설정</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">테마</h3>
              <RadioGroup 
                value={theme} 
                onValueChange={setTheme}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'}`}>
                  <RadioGroupItem value="light" id="theme-light" className="text-blue-500" />
                  <Label htmlFor="theme-light" className="flex items-center cursor-pointer">
                    <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="text-white">라이트 모드</span>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'}`}>
                  <RadioGroupItem value="dark" id="theme-dark" className="text-blue-500" />
                  <Label htmlFor="theme-dark" className="flex items-center cursor-pointer">
                    <Moon className="h-5 w-5 mr-2 text-blue-300" />
                    <span className="text-white">다크 모드</span>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${theme === 'system' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700'}`}>
                  <RadioGroupItem value="system" id="theme-system" className="text-blue-500" />
                  <Label htmlFor="theme-system" className="flex items-center cursor-pointer">
                    <Smartphone className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="text-white">시스템 설정 사용</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">언어 설정</h3>
              <RadioGroup value={language} onValueChange={setLanguage}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="ko" id="lang-ko" className="text-blue-500" />
                  <Label htmlFor="lang-ko" className="text-white cursor-pointer">한국어</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="en" id="lang-en" className="text-blue-500" />
                  <Label htmlFor="lang-en" className="text-white cursor-pointer">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jp" id="lang-jp" className="text-blue-500" />
                  <Label htmlFor="lang-jp" className="text-white cursor-pointer">日本語</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="border rounded-lg border-gray-700 p-6 bg-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">동기화 설정</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">Google 캘린더 동기화</Label>
                </div>
                <p className="text-sm text-gray-400">Google 캘린더와 일정을 동기화합니다.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">Microsoft 365 동기화</Label>
                </div>
                <p className="text-sm text-gray-400">Microsoft 365와 메일, 일정, 연락처를 동기화합니다.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
                  <Label className="text-white">Slack 연동</Label>
                </div>
                <p className="text-sm text-gray-400">Slack과 메시지를 동기화합니다.</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSaveSettings}
        >
          <Save className="h-4 w-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}
