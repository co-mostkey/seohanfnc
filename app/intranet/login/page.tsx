"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function IntranetLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/intranet-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '로그인에 실패했습니다.');
            }

            // 로그인 성공
            router.push('/intranet');
        } catch (error) {
            console.error('로그인 오류:', error);
            setError(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">서한F&C 인트라넷</h1>
                    <p className="text-gray-400">직원 전용 시스템입니다.</p>
                </div>

                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">로그인</CardTitle>
                        <CardDescription className="text-gray-400">
                            인트라넷 계정으로 로그인하세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-200">사용자명</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="사용자명을 입력하세요"
                                    required
                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-200">비밀번호</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                    autoComplete="off"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive" className="bg-red-900/20 border-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        로그인 중...
                                    </>
                                ) : (
                                    '로그인'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-sm text-gray-400 text-center">
                            계정이 없으신가요?{' '}
                            <Link href="/intranet/register" className="text-blue-400 hover:text-blue-300">
                                계정 신청
                            </Link>
                        </div>
                        <div className="text-sm text-gray-400 text-center">
                            <Link href="/" className="text-blue-400 hover:text-blue-300">
                                홈페이지로 돌아가기
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        보안을 위해 공용 컴퓨터에서는 사용 후 반드시 로그아웃하세요.
                    </p>
                </div>
            </div>
        </div>
    );
} 