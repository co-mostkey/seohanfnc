"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield } from 'lucide-react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

export default function AdminLoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = '/admin';
            } else {
                setError(result.error || '로그인에 실패했습니다.');
            }
        } catch (error) {
            setError('로그인 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
            <Image
                src="/images/backgrounds/login-bg.png"
                alt="Login Background"
                fill
                className="object-cover object-center z-[-2]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
            <div className="relative w-full max-w-md bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src="/logo.png"
                        alt="서한에프앤씨"
                        width={120}
                        height={40}
                        className="h-10 w-auto mb-6"
                    />
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                        <Shield className="w-6 h-6 mr-2 text-orange-500" /> 관리자 로그인
                    </h1>
                    <p className="text-gray-300 text-sm text-center">
                        서한F&C 관리자 계정으로 로그인하세요
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">아이디</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="관리자 아이디를 입력하세요"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">비밀번호</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 입력하세요"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pr-12"
                                autoComplete="off"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-200"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {error && (
                        <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                로그인 중...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                관리자 로그인
                            </div>
                        )}
                    </Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        일반 사용자이신가요?{' '}
                        <a
                            href="/login"
                            className="text-orange-400 hover:text-orange-300 font-medium"
                        >
                            회원 로그인
                        </a>
                    </p>
                </div>
                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-orange-400 transition-colors group"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                        메인으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    );
} 