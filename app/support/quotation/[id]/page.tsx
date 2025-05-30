"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeading } from '@/components/ui/PageHeading';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, User, Building, Mail, Phone, Calendar, Package, Hash, FileText,
    MessageSquare, Download, Paperclip, Lock, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface QuoteDetail {
    id: string;
    title: string;
    content: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    company?: string;
    productName?: string;
    productCategory?: string;
    quantity?: number;
    message?: string;
    status?: string;
    createdAt: string;
    updatedAt?: string;
    responses?: QuoteResponse[];
    attachments?: string[];
}

interface QuoteResponse {
    id: string;
    content: string;
    authorName: string;
    authorRole?: string;
    createdAt: string;
    attachments?: string[];
}

export default function QuotationDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const quoteId = params.id as string;
    const password = searchParams.get('password');

    const [quote, setQuote] = useState<QuoteDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuoteDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 먼저 API에서 시도
            const queryParams = new URLSearchParams({
                id: quoteId,
                password: password!
            });

            const response = await fetch(`/api/admin/inquiries?${queryParams.toString()}`);

            if (response.ok) {
                const data = await response.json();

                if (data.success && data.inquiry) {
                    // API 데이터를 QuoteDetail 형식으로 변환
                    const quoteData: QuoteDetail = {
                        id: data.inquiry.id,
                        title: data.inquiry.title,
                        content: data.inquiry.content,
                        customerName: data.inquiry.customerName,
                        customerEmail: data.inquiry.customerEmail,
                        customerPhone: data.inquiry.customerPhone,
                        company: data.inquiry.company,
                        productName: data.inquiry.productName,
                        status: data.inquiry.status,
                        createdAt: data.inquiry.createdAt,
                        updatedAt: data.inquiry.updatedAt,
                        responses: data.inquiry.responses?.map((resp: any) => ({
                            id: resp.id,
                            content: resp.content,
                            authorName: resp.author || '관리자',
                            authorRole: resp.authorRole,
                            createdAt: resp.createdAt,
                            attachments: resp.attachments
                        })) || [],
                        attachments: data.inquiry.attachments || []
                    };

                    // 컨텐츠에서 추가 정보 파싱
                    try {
                        const categoryMatch = data.inquiry.content.match(/제품 카테고리:\s*(.+?)(?:\n|$)/);
                        const quantityMatch = data.inquiry.content.match(/수량:\s*(\d+)개/);
                        const messageMatch = data.inquiry.content.match(/추가 요청사항:\s*\n(.+?)(?:\n\n|$)/);

                        if (categoryMatch) quoteData.productCategory = categoryMatch[1].trim();
                        if (quantityMatch) quoteData.quantity = parseInt(quantityMatch[1], 10);
                        if (messageMatch) quoteData.message = messageMatch[1].trim();
                    } catch (e) {
                        // 파싱 오류는 무시
                    }

                    setQuote(quoteData);
                } else {
                    throw new Error('접근 키가 올바르지 않습니다.');
                }
            } else if (response.status === 401) {
                throw new Error('접근 키가 올바르지 않습니다.');
            } else {
                // API에서 찾을 수 없는 경우 로컬 스토리지 확인
                const storedQuotes = localStorage.getItem('onlineQuotes');
                if (storedQuotes) {
                    const quotes = JSON.parse(storedQuotes);
                    const localQuote = quotes.find((q: any) => q.id === quoteId);

                    // 로컬 견적의 경우 접근 키로 확인
                    if (localQuote && localQuote.accessKey && localQuote.accessKey === password?.toUpperCase()) {
                        setQuote({
                            ...localQuote,
                            responses: localQuote.responses || [],
                            attachments: localQuote.attachments || []
                        });
                    } else {
                        throw new Error('견적 요청을 찾을 수 없거나 접근 키가 올바르지 않습니다.');
                    }
                } else {
                    throw new Error('견적 요청을 찾을 수 없습니다.');
                }
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [quoteId, password, router]);

    useEffect(() => {
        if (!password) {
            router.push('/support/quotation');
            return;
        }

        fetchQuoteDetail();
    }, [quoteId, password, fetchQuoteDetail, router]);

    const getStatusInfo = useCallback((status?: string) => {
        switch (status) {
            case 'answered':
            case 'completed':
                return {
                    icon: <CheckCircle className="h-5 w-5" />,
                    text: '답변완료',
                    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                };
            case 'pending':
                return {
                    icon: <Clock className="h-5 w-5" />,
                    text: '답변대기',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                };
            case 'in_progress':
                return {
                    icon: <MessageSquare className="h-5 w-5" />,
                    text: '처리중',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                };
            case 'closed':
                return {
                    icon: <AlertCircle className="h-5 w-5" />,
                    text: '종료',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                };
            default:
                return {
                    icon: <MessageSquare className="h-5 w-5" />,
                    text: '접수',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                };
        }
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    if (loading) {
        return (
            <main className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-black">
                <Image
                    src={`${basePath}/images/backgrounds/login-bg.png`}
                    alt="Background"
                    fill
                    className="object-cover object-center z-[-2]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />

                <div className="relative z-10 container mx-auto max-w-screen-lg px-6 py-16">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                            <p className="mt-4 text-white">견적 요청 내용을 불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-black">
                <Image
                    src={`${basePath}/images/backgrounds/login-bg.png`}
                    alt="Background"
                    fill
                    className="object-cover object-center z-[-2]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />

                <div className="relative z-10 container mx-auto max-w-screen-lg px-6 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">오류가 발생했습니다</h2>
                        <p className="text-gray-300 mb-6">{error}</p>
                        <Button onClick={() => router.push('/support/quotation')} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            목록으로 돌아가기
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (!quote) {
        return null;
    }

    const statusInfo = getStatusInfo(quote.status);

    return (
        <main className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-black">
            <Image
                src={`${basePath}/images/backgrounds/login-bg.png`}
                alt="Background"
                fill
                className="object-cover object-center z-[-2]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />

            <div className="relative z-10 container mx-auto max-w-screen-lg px-6 py-10 md:py-16">
                {/* 헤더 */}
                <div className="mb-8">
                    <Button
                        onClick={() => router.push('/support/quotation')}
                        variant="outline"
                        className="mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        목록으로 돌아가기
                    </Button>

                    <PageHeading
                        title="견적 요청 상세"
                        subtitle="귀하의 견적 요청 내용과 답변을 확인하실 수 있습니다."
                    />
                </div>

                {/* 상태 표시 */}
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock className="h-5 w-5 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">비밀글로 작성된 견적 요청입니다.</span>
                        </div>
                        <span className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                            statusInfo.className
                        )}>
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                        </span>
                    </div>
                </div>

                {/* 견적 요청 내용 */}
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 md:p-8 mb-6 border border-gray-200 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">견적 요청 내용</h2>

                    {/* 고객 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">성함</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{quote.customerName}</p>
                                </div>
                            </div>
                            {quote.company && (
                                <div className="flex items-center gap-3">
                                    <Building className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">회사명</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{quote.company}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{quote.customerEmail}</p>
                                </div>
                            </div>
                            {quote.customerPhone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">연락처</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{quote.customerPhone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 제품 정보 */}
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">제품 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {quote.productCategory && (
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">카테고리</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{quote.productCategory}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">제품명</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{quote.productName || quote.title}</p>
                                </div>
                            </div>
                            {quote.quantity && (
                                <div className="flex items-center gap-3">
                                    <Hash className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">수량</p>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{quote.quantity}개</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 추가 요청사항 */}
                    {quote.message && (
                        <div className="space-y-3 mb-6">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">추가 요청사항</h3>
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{quote.message}</p>
                        </div>
                    )}

                    {/* 첨부 파일 */}
                    {quote.attachments && quote.attachments.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">첨부 파일</h3>
                            <div className="space-y-2">
                                {quote.attachments.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Paperclip className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">첨부파일 {index + 1}</span>
                                        <Download className="h-4 w-4 text-gray-500 ml-auto" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 작성일 */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-6">
                        <Calendar className="h-4 w-4" />
                        <span>작성일: {formatDate(quote.createdAt)}</span>
                    </div>
                </div>

                {/* 답변 목록 */}
                {quote.responses && quote.responses.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-white">답변 내역</h2>
                        {quote.responses.map((response, index) => (
                            <div
                                key={response.id}
                                className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700/50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                                {response.authorName}
                                                {response.authorRole && (
                                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                        ({response.authorRole})
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(response.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        답변 #{index + 1}
                                    </span>
                                </div>

                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap">{response.content}</p>
                                </div>

                                {/* 답변 첨부 파일 */}
                                {response.attachments && response.attachments.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">첨부 파일</p>
                                        <div className="space-y-1">
                                            {response.attachments.map((file, fileIndex) => (
                                                <a
                                                    key={fileIndex}
                                                    href={file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                                                >
                                                    <Paperclip className="h-4 w-4" />
                                                    <span>첨부파일 {fileIndex + 1}</span>
                                                    <Download className="h-3 w-3" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 답변이 없는 경우 */}
                {(!quote.responses || quote.responses.length === 0) && (
                    <div className="bg-yellow-50/80 dark:bg-yellow-900/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-200 dark:border-yellow-900/50">
                        <div className="flex items-center gap-3">
                            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            <div>
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">답변 대기 중</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    담당자가 견적 요청을 검토 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
} 