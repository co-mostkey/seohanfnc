"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    FileText, Shield, Calendar, ArrowLeft, Eye, Download,
    AlertTriangle, CheckCircle, Info
} from 'lucide-react';

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

export default function TermsPage() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<string>('');

    // 약관 데이터 로드
    useEffect(() => {
        const loadTerms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/terms');
                const data = await response.json();

                if (data.success) {
                    setTerms(data.terms);
                    // 첫 번째 약관을 기본 선택
                    if (data.terms.length > 0) {
                        setSelectedTab(data.terms[0].id);
                    }
                } else {
                    console.error('약관 로드 실패:', data.error);
                }
            } catch (error) {
                console.error('약관 로드 오류:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTerms();
    }, []);

    const getStatusBadge = (term: Term) => {
        return term.isRequired ?
            <Badge className="bg-red-100 text-red-800">필수</Badge> :
            <Badge className="bg-blue-100 text-blue-800">선택</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const downloadTerm = (term: Term) => {
        const content = `${term.title}\n버전: ${term.version}\n시행일: ${formatDate(term.effectiveDate)}\n\n${term.content}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = `${term.title}_v${term.version}.txt`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="text-gray-600">약관을 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                메인으로 돌아가기
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-orange-600" />
                            <h1 className="text-2xl font-bold text-gray-900">이용약관 및 정책</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {terms.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    등록된 약관이 없습니다
                                </h3>
                                <p className="text-gray-500">
                                    현재 표시할 약관이 없습니다.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                        {/* 탭 목록 */}
                        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 h-auto p-2 bg-white rounded-lg shadow-sm">
                            {terms.map((term) => (
                                <TabsTrigger
                                    key={term.id}
                                    value={term.id}
                                    className="flex flex-col items-start p-4 h-auto data-[state=active]:bg-orange-50 data-[state=active]:text-orange-900 data-[state=active]:border-orange-200"
                                >
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <span className="font-medium">{term.title}</span>
                                        {getStatusBadge(term)}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        v{term.version} · {formatDate(term.effectiveDate)}
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* 탭 콘텐츠 */}
                        {terms.map((term) => (
                            <TabsContent key={term.id} value={term.id} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-6 w-6 text-orange-600" />
                                                <div>
                                                    <CardTitle className="text-xl">{term.title}</CardTitle>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {getStatusBadge(term)}
                                                        <Badge variant="outline">버전 {term.version}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadTerm(term)}
                                                className="flex items-center"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                다운로드
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* 약관 정보 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">시행일:</span>
                                                <div className="flex items-center mt-1">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="text-sm">{formatDate(term.effectiveDate)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">최종 수정일:</span>
                                                <div className="flex items-center mt-1">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="text-sm">{formatDate(term.lastUpdated)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 중요 안내 */}
                                        {term.isRequired && (
                                            <div className="flex items-start p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
                                                <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-medium text-red-900 mb-1">필수 동의 약관</h4>
                                                    <p className="text-sm text-red-700">
                                                        이 약관은 서비스 이용을 위해 반드시 동의해야 하는 필수 약관입니다.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {!term.isRequired && (
                                            <div className="flex items-start p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg">
                                                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-medium text-blue-900 mb-1">선택 동의 약관</h4>
                                                    <p className="text-sm text-blue-700">
                                                        이 약관은 선택적으로 동의할 수 있으며, 동의하지 않아도 서비스 이용에 제한이 없습니다.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* 약관 내용 */}
                                        <div className="prose max-w-none">
                                            <div className="bg-white border rounded-lg p-6">
                                                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                                                    {term.content}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* 하단 안내 */}
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-1">약관 관련 문의</h4>
                                                    <p className="text-sm text-gray-600">
                                                        약관에 대한 문의사항이 있으시면 고객센터(02-1234-5678) 또는
                                                        이메일(info@seohanfc.com)로 연락주시기 바랍니다.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </div>
    );
} 