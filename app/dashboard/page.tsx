'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Phone,
    Building,
    Briefcase,
    LogOut,
    Settings,
    Bell,
    Calendar,
    FileText,
    Download,
    Shield
} from 'lucide-react';

interface MemberInfo {
    id: string;
    email: string;
    name: string;
    company?: string;
    position?: string;
    phone?: string;
    emailVerified: boolean;
    marketingConsent: boolean;
    status: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // 회원 정보 로드
    useEffect(() => {
        const loadMemberInfo = async () => {
            try {
                const response = await fetch('/api/auth/member-verify');
                const data = await response.json();

                if (data.authenticated && data.member) {
                    setMemberInfo(data.member);
                } else {
                    // 인증되지 않은 경우 로그인 페이지로 이동
                    router.push('/login');
                }
            } catch (error) {
                console.error('회원 정보 로드 오류:', error);
                setError('회원 정보를 불러오는 중 오류가 발생했습니다.');
                // 오류 발생 시에도 로그인 페이지로 이동
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } finally {
                setIsLoading(false);
            }
        };

        loadMemberInfo();
    }, [router]);

    // 로그아웃 처리
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/member-logout', {
                method: 'POST',
            });

            if (response.ok) {
                // 로그아웃 성공 시 홈페이지로 이동
                router.push('/');
            } else {
                setError('로그아웃 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 오류:', error);
            setError('로그아웃 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // 상태 배지 색상 결정
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'suspended':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // 상태 텍스트 변환
    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return '활성';
            case 'pending':
                return '승인 대기';
            case 'suspended':
                return '정지';
            default:
                return status;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">회원 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!memberInfo) {
        return null; // 리다이렉트 중
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                서한F&C 회원 대시보드
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                안녕하세요, {memberInfo.name}님
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                        로그아웃 중...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        로그아웃
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 회원 정보 카드 */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    회원 정보
                                </CardTitle>
                                <CardDescription>
                                    등록된 회원 정보를 확인하실 수 있습니다.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* 기본 정보 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            이름
                                        </label>
                                        <p className="text-gray-900">{memberInfo.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center">
                                            <Mail className="w-4 h-4 mr-1" />
                                            이메일
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-gray-900">{memberInfo.email}</p>
                                            {memberInfo.emailVerified ? (
                                                <Badge variant="default" className="text-xs">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    인증됨
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs">
                                                    미인증
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {memberInfo.phone && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                                <Phone className="w-4 h-4 mr-1" />
                                                전화번호
                                            </label>
                                            <p className="text-gray-900">{memberInfo.phone}</p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            계정 상태
                                        </label>
                                        <Badge variant={getStatusBadgeVariant(memberInfo.status)}>
                                            {getStatusText(memberInfo.status)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* 회사 정보 */}
                                {(memberInfo.company || memberInfo.position) && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">회사 정보</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {memberInfo.company && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <Building className="w-4 h-4 mr-1" />
                                                        회사명
                                                    </label>
                                                    <p className="text-gray-900">{memberInfo.company}</p>
                                                </div>
                                            )}
                                            {memberInfo.position && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        직책
                                                    </label>
                                                    <p className="text-gray-900">{memberInfo.position}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* 사이드바 */}
                    <div className="space-y-6">
                        {/* 빠른 액션 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    빠른 액션
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start" disabled>
                                    <Settings className="w-4 h-4 mr-2" />
                                    계정 설정
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        준비중
                                    </Badge>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" disabled>
                                    <Bell className="w-4 h-4 mr-2" />
                                    알림 설정
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        준비중
                                    </Badge>
                                </Button>
                                <Button variant="outline" className="w-full justify-start" disabled>
                                    <FileText className="w-4 h-4 mr-2" />
                                    문서 관리
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        준비중
                                    </Badge>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* 최근 활동 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    최근 활동
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-sm">최근 활동이 없습니다.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 도움말 */}
                        <Card>
                            <CardHeader>
                                <CardTitle>도움말</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-gray-600">
                                    문의사항이 있으시면 관리자에게 연락해주세요.
                                </p>
                                <Button variant="outline" size="sm" className="w-full" disabled>
                                    <Mail className="w-4 h-4 mr-2" />
                                    문의하기
                                    <Badge variant="secondary" className="ml-auto text-xs">
                                        준비중
                                    </Badge>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
} 