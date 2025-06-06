"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, LogIn, Loader2, Shield } from "lucide-react";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 관리자 로그인 폼 컴포넌트
function AdminLoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 이미 로그인된 관리자 체크
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/validate', {
                    method: 'POST',
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success && result.user) {
                    router.push('/admin');
                }
            } catch (error) {
                console.log('관리자 인증 확인 중 오류:', error);
            }
        };

        checkAuth();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 입력 시 에러 메시지 초기화
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
            });

            const result = await response.json();

            if (result.success) {
                // 로그인 성공 시 관리자 페이지로 이동
                router.replace('/admin');
            } else {
                setError(result.error || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('관리자 로그인 오류:', error);
            setError('로그인 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0] bg-gray-900">
                <Image
                    src={`${basePath}/images/backgrounds/login-bg.png`}
                    alt="Login Background"
                    fill
                    className="object-cover object-center z-[-2]"
                    priority
                    onError={(e) => {
                        // 배경 이미지 로드 실패 시 숨김
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
                <div className="relative w-full max-w-md bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">

                    <div className="flex flex-col items-center mb-6">
                        <Link href="/" className="mb-6">
                            <Image
                                src={`${basePath}/logo.png`}
                                alt="서한에프앤씨"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                                onError={(e) => {
                                    // 로고 로드 실패 시 텍스트로 대체
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const textLogo = document.createElement('span');
                                    textLogo.className = 'text-2xl font-bold text-orange-500';
                                    textLogo.textContent = '서한F&C';
                                    target.parentElement?.appendChild(textLogo);
                                }}
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">관리자 로그인</h1>
                        <p className="text-gray-300 text-sm text-center">
                            서한F&C 관리자 계정으로 로그인하세요
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 아이디 입력 */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-300">아이디</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                data-form-type="other"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
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
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 pr-12"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    data-form-type="other"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                                {error}
                            </div>
                        )}

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                        </button>
                    </form>

                    {/* 일반 회원 로그인 링크 */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            일반 사용자이신가요?{' '}
                            <Link
                                href="/login"
                                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                            >
                                회원 로그인
                            </Link>
                        </p>
                    </div>

                    {/* 메인으로 돌아가기 */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-orange-400 transition-colors group"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                            메인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// 로딩 컴포넌트
function AdminLoginLoading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0] bg-gray-900">
            <Image
                src={`${basePath}/images/backgrounds/login-bg.png`}
                alt="Login Background"
                fill
                className="object-cover object-center z-[-2]"
                priority
                onError={(e) => {
                    // 배경 이미지 로드 실패 시 숨김
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
            <div className="relative w-full max-w-md bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
            </div>
        </div>
    );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function AdminLoginPage() {
    return (
        <Suspense fallback={<AdminLoginLoading />}>
            <AdminLoginForm />
        </Suspense>
    );
} 