// [TRISID] 2024-06-01: 인트라넷 계정 신청(회원가입) 페이지 - 다크 테마, 정책 안내, 승인 대기 안내
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function IntranetRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', email: '', department: '', position: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); setSuccess('');
        try {
            const response = await fetch('/api/auth/intranet-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || '계정 신청에 실패했습니다.');
            }
            setSuccess('계정 신청이 완료되었습니다. 관리자의 승인을 기다려주세요.');
            setFormData({ username: '', password: '', name: '', email: '', department: '', position: '' });
        } catch (error) {
            setError(error instanceof Error ? error.message : '계정 신청 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">인트라넷 계정 신청</h1>
                    <p className="text-gray-400">관리자 승인 후 사용 가능합니다.</p>
                </div>
                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">계정 신청</CardTitle>
                        <CardDescription className="text-gray-400">
                            모든 항목을 정확히 입력해 주세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-gray-200">아이디</Label>
                                <Input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" autoComplete="off" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-200">비밀번호</Label>
                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" autoComplete="off" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-200">이름</Label>
                                <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-200">이메일</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-gray-200">부서</Label>
                                <Input id="department" name="department" type="text" value={formData.department} onChange={handleChange} className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position" className="text-gray-200">직위</Label>
                                <Input id="position" name="position" type="text" value={formData.position} onChange={handleChange} className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" />
                            </div>
                            {error && (
                                <Alert variant="destructive" className="bg-red-900/20 border-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="success" className="bg-green-900/20 border-green-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 신청 중...</>) : '계정 신청'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-sm text-gray-400 text-center">
                            이미 계정이 있으신가요?{' '}
                            <Link href="/intranet/login" className="text-blue-400 hover:text-blue-300">로그인</Link>
                        </div>
                        <div className="text-sm text-gray-400 text-center">
                            <Link href="/" className="text-blue-400 hover:text-blue-300">홈페이지로 돌아가기</Link>
                        </div>
                    </CardFooter>
                </Card>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">신청 후 관리자의 승인 절차가 필요합니다. 승인 전까지 로그인할 수 없습니다.</p>
                </div>
            </div>
        </div>
    );
} 