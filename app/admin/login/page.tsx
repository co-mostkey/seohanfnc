'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
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
                window.location.href = '/admin';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 뒤로가기 버튼 */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="text-gray-400 hover:text-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        홈으로 돌아가기
                    </Button>
                </div>

                <Card className="shadow-2xl border-gray-700 bg-gray-800">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
                            <Shield className="w-6 h-6 mr-2 text-orange-500" />
                            관리자 로그인
                        </CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            서한F&C 관리자 계정으로 로그인하세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 아이디 입력 */}
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

                            {/* 에러 메시지 */}
                            {error && (
                                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* 로그인 버튼 */}
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

                        {/* 일반 사용자 로그인 링크 */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                일반 사용자이신가요?{' '}
                                <Link
                                    href="/login"
                                    className="text-orange-400 hover:text-orange-300 font-medium"
                                >
                                    회원 로그인
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 