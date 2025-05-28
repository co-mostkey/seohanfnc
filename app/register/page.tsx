"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    User, Mail, Phone, Building, MapPin,
    Lock, CheckCircle, AlertCircle, ArrowLeft, ChevronLeft, Eye, EyeOff, FileText, Shield, X
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Term {
    id: string;
    title: string;
    content: string;
    version: string;
    effectiveDate: string;
    lastUpdated: string;
    isRequired: boolean;
    isActive: boolean;
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [terms, setTerms] = useState<Term[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
    const [showTermModal, setShowTermModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        company: '',
        position: '',
        address: '',
        interests: '',
        marketingConsent: false,
        privacyConsent: false
    });

    // 약관 데이터 로드
    useEffect(() => {
        const loadTerms = async () => {
            try {
                const response = await fetch('/api/admin/terms?activeOnly=true');
                const data = await response.json();
                if (data.success) {
                    setTerms(data.terms);
                }
            } catch (error) {
                console.error('약관 로드 오류:', error);
            }
        };
        loadTerms();
    }, []);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const openTermModal = (termId: string) => {
        const term = terms.find(t => t.id === termId);
        if (term) {
            setSelectedTerm(term);
            setShowTermModal(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 기본 유효성 검사
        if (!formData.email || !formData.password || !formData.name) {
            toast.error('이메일, 비밀번호, 이름은 필수 입력 항목입니다.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        if (!formData.privacyConsent) {
            toast.error('개인정보 처리 방침에 동의해야 합니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    phone: formData.phone,
                    company: formData.company,
                    position: formData.position,
                    address: formData.address,
                    interests: formData.interests ? formData.interests.split(',').map(s => s.trim()) : [],
                    marketingConsent: formData.marketingConsent,
                    privacyConsent: formData.privacyConsent
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                // 성공 페이지로 이동하거나 로그인 페이지로 리다이렉트
                router.push('/login?message=registration_success');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            toast.error('회원가입 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
                <Image
                    src={`${basePath}/images/backgrounds/login-bg.png`}
                    alt="Register Background"
                    fill
                    className="object-cover object-center z-[-2]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
                <div className="relative w-full max-w-2xl bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1] max-h-[90vh] overflow-y-auto">

                    <div className="flex flex-col items-center mb-6">
                        <Link href="/" className="mb-6">
                            <Image
                                src={`${basePath}/logo.png`}
                                alt="서한에프앤씨"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">회원가입</h1>
                        <p className="text-gray-300 text-sm text-center">
                            서한F&C 회원 서비스에 가입합니다
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 기본 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-300">이름 *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="이름을 입력하세요"
                                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">이메일 *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="이메일을 입력하세요"
                                        className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">비밀번호 *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="비밀번호 (최소 6자)"
                                        className="pl-10 pr-12 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-300">비밀번호 확인 *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        className="pl-10 pr-12 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 연락처 정보 */}
                        <div className="border-t border-gray-600 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-300">전화번호</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="010-1234-5678"
                                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-gray-300">회사명</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="company"
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => handleInputChange('company', e.target.value)}
                                            placeholder="회사명을 입력하세요"
                                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position" className="text-gray-300">직책</Label>
                                <Input
                                    id="position"
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    placeholder="직책을 입력하세요"
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-300">주소</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="주소를 입력하세요"
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interests" className="text-gray-300">관심 분야</Label>
                            <Input
                                id="interests"
                                type="text"
                                value={formData.interests}
                                onChange={(e) => handleInputChange('interests', e.target.value)}
                                placeholder="관심 분야를 쉼표로 구분하여 입력하세요 (예: 화학, 환경, 안전)"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>

                        {/* 동의 사항 */}
                        <div className="border-t border-gray-600 pt-4">
                            <div className="space-y-4">
                                {/* 개인정보 처리방침 */}
                                <div className="flex items-start space-x-3">
                                    <Switch
                                        id="privacyConsent"
                                        checked={formData.privacyConsent}
                                        onCheckedChange={(checked) => handleInputChange('privacyConsent', checked)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="privacyConsent" className="text-sm text-gray-300 flex items-center justify-between">
                                            <span>개인정보 처리 방침에 동의합니다 *</span>
                                            <button
                                                type="button"
                                                onClick={() => openTermModal('privacy')}
                                                className="text-orange-400 hover:text-orange-300 transition-colors ml-2 flex items-center"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                보기
                                            </button>
                                        </Label>
                                    </div>
                                </div>

                                {/* 마케팅 수신동의 */}
                                <div className="flex items-start space-x-3">
                                    <Switch
                                        id="marketingConsent"
                                        checked={formData.marketingConsent}
                                        onCheckedChange={(checked) => handleInputChange('marketingConsent', checked)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="marketingConsent" className="text-sm text-gray-300 flex items-center justify-between">
                                            <span>마케팅 정보 수신에 동의합니다 (선택)</span>
                                            <button
                                                type="button"
                                                onClick={() => openTermModal('marketing')}
                                                className="text-orange-400 hover:text-orange-300 transition-colors ml-2 flex items-center"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                보기
                                            </button>
                                        </Label>
                                    </div>
                                </div>

                                {/* 서비스 이용약관 안내 */}
                                <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                                    <span>회원가입 시 서비스 이용약관에 자동으로 동의하게 됩니다.</span>
                                    <button
                                        type="button"
                                        onClick={() => openTermModal('service')}
                                        className="text-orange-400 hover:text-orange-300 transition-colors flex items-center"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        보기
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 비밀번호 일치 확인 표시 */}
                        {formData.password && formData.confirmPassword && (
                            <div className={`flex items-center text-sm ${formData.password === formData.confirmPassword
                                ? 'text-green-400'
                                : 'text-red-400'
                                }`}>
                                {formData.password === formData.confirmPassword ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                )}
                                {formData.password === formData.confirmPassword
                                    ? '비밀번호가 일치합니다.'
                                    : '비밀번호가 일치하지 않습니다.'
                                }
                            </div>
                        )}

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    회원가입 중...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    회원가입
                                </div>
                            )}
                        </button>
                    </form>

                    {/* 로그인 링크 */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            이미 계정이 있으신가요?{' '}
                            <Link
                                href="/login"
                                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                            >
                                로그인
                            </Link>
                        </p>
                    </div>

                    {/* 메인으로 돌아가기 */}
                    <div className="mt-4 text-center">
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

            {/* 약관 모달 */}
            {showTermModal && selectedTerm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-black/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700/60">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <div className="flex items-center">
                                {selectedTerm.id === 'privacy' ? (
                                    <Shield className="h-5 w-5 mr-2 text-orange-400" />
                                ) : selectedTerm.id === 'service' ? (
                                    <FileText className="h-5 w-5 mr-2 text-orange-400" />
                                ) : (
                                    <Mail className="h-5 w-5 mr-2 text-orange-400" />
                                )}
                                <h2 className="text-xl font-semibold text-white">{selectedTerm.title}</h2>
                                <span className="ml-2 text-sm text-gray-400">v{selectedTerm.version}</span>
                            </div>
                            <button
                                onClick={() => setShowTermModal(false)}
                                className="text-gray-400 hover:text-gray-200 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="prose prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-300">
                                    {selectedTerm.content}
                                </pre>
                            </div>
                        </div>
                        <div className="flex justify-end p-6 border-t border-gray-700">
                            <button
                                onClick={() => setShowTermModal(false)}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 