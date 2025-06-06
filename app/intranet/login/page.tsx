"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertCircle, InfoIcon } from 'lucide-react';
import Link from 'next/link';

export default function IntranetLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHelp, setShowHelp] = useState(false);

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
                // 더 친절한 에러 메시지 표시
                if (response.status === 401) {
                    setError('아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
                    setShowHelp(true);
                } else if (response.status === 403) {
                    setError(data.error || '계정이 비활성화되었습니다. 관리자에게 문의하세요.');
                } else {
                    setError(data.error || '로그인에 실패했습니다.');
                }
                return;
            }

            // 로그인 성공
            router.push('/intranet');
        } catch (error) {
            console.error('로그인 오류:', error);
            setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
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
        // 입력 시 에러 초기화
        if (error) {
            setError('');
            setShowHelp(false);
        }
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

                            {showHelp && (
                                <Alert className="bg-blue-900/20 border-blue-600 mt-2">
                                    <InfoIcon className="h-4 w-4 text-blue-400" />
                                    <AlertDescription className="text-blue-200">
                                        <p className="font-semibold mb-1">도움말</p>
                                        <p className="text-sm">
                                            로그인 정보를 잊으셨나요? IT팀(내선: 1234)으로 문의하세요.
                                        </p>
                                    </AlertDescription>
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

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                        보안을 위해 공용 컴퓨터에서는 사용 후 반드시 로그아웃하세요.
                    </p>
                    {/* 개발/테스트 환경에서만 표시 */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 mt-4">
                            <p className="text-xs text-gray-400 mb-2">테스트 계정 정보</p>
                            <p className="text-xs text-gray-300">
                                관리자: intranet_admin / admin123!@#
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 