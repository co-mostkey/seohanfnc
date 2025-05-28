'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Shield } from 'lucide-react';
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

export default function PrivacyTermsPage() {
    const [term, setTerm] = useState<Term | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTerm = async () => {
            try {
                const response = await fetch('/api/admin/terms?activeOnly=true');
                const data = await response.json();
                if (data.success) {
                    const privacyTerm = data.terms.find((t: Term) => t.id === 'privacy');
                    if (privacyTerm) {
                        setTerm(privacyTerm);
                    } else {
                        setError('개인정보 처리방침을 찾을 수 없습니다.');
                    }
                } else {
                    setError('약관을 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('약관 로드 오류:', error);
                setError('약관을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadTerm();
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
                <Image
                    src={`${basePath}/images/backgrounds/login-bg.png`}
                    alt="Privacy Background"
                    fill
                    className="object-cover object-center z-[-2]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
                <div className="relative w-full max-w-4xl bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
                <Image
                    src={`${basePath}/images/backgrounds/login-bg.png`}
                    alt="Privacy Background"
                    fill
                    className="object-cover object-center z-[-2]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
                <div className="relative w-full max-w-4xl bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
            <Image
                src={`${basePath}/images/backgrounds/login-bg.png`}
                alt="Privacy Background"
                fill
                className="object-cover object-center z-[-2]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
            <div className="relative w-full max-w-4xl bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1] max-h-[90vh] overflow-y-auto">

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
                    <div className="flex items-center mb-2">
                        <Shield className="h-6 w-6 mr-2 text-orange-400" />
                        <h1 className="text-2xl font-bold text-white">{term?.title}</h1>
                    </div>
                    <p className="text-gray-400 text-sm">
                        버전 {term?.version} | 시행일: {term?.effectiveDate ? new Date(term.effectiveDate).toLocaleDateString('ko-KR') : ''}
                    </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                    <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-300">
                            {term?.content}
                        </pre>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        로그인으로 돌아가기
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
} 