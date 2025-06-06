"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Clock, Tag, Mail, Phone, Building, User,
    Star, Calendar, FileText, MessageCircle, CheckCircle, AlarmClock,
    Download, Paperclip, ExternalLink, Send, Trash, AlertCircle,
    ArrowLeft, Edit, Eye, Package, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Inquiry, InquiryResponse, InquiryStatus } from '@/types/inquiry';
import { ADMIN_HEADING_STYLES, ADMIN_CARD_STYLES, ADMIN_FONT_STYLES, ADMIN_UI } from '@/lib/admin-ui-constants';

interface UnifiedInquiry {
    id: string;
    title: string;
    content: string;
    author?: string;
    customerName?: string;
    email?: string;
    customerEmail?: string;
    phone?: string;
    customerPhone?: string;
    company?: string;
    type: 'contact' | 'quotation' | 'as' | 'general';
    status?: string;
    priority?: string;
    productName?: string;
    createdAt: string;
    updatedAt?: string;
    isRead?: boolean;
    isFeatured?: boolean;
    responses?: any[];
    answer?: string;
    answeredAt?: string;
    attachments?: any[];
}

export default function AdminInquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [inquiry, setInquiry] = useState<UnifiedInquiry | null>(null);
    const [answering, setAnswering] = useState(false);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        if (params?.id) {
            fetchInquiryDetail(params?.id as string);
        }
    }, [params?.id]);

    const fetchInquiryDetail = async (id: string) => {
        try {
            setLoading(true);

            // 관리자 API에서 먼저 조회 시도
            const adminResponse = await fetch(`/api/admin/inquiries?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (adminResponse.ok) {
                const adminData = await adminResponse.json();
                if (adminData.success && adminData.inquiry) {
                    setInquiry({
                        ...adminData.inquiry,
                        type: adminData.inquiry.type || 'general',
                    });
                    if (adminData.inquiry.answer) {
                        setAnswer(adminData.inquiry.answer);
                    }
                    return;
                }
            }

            // 다른 API에서 조회 시도
            const [contactResponse, asResponse] = await Promise.all([
                fetch(`/api/contact/${id}`).catch(() => ({ ok: false })),
                fetch(`/api/as/${id}`).catch(() => ({ ok: false }))
            ]);

            let foundInquiry: UnifiedInquiry | null = null;

            // Contact API 응답 처리
            if (contactResponse.ok) {
                const contactData = await (contactResponse as Response).json();
                if (contactData && contactData.id) {
                    foundInquiry = {
                        ...contactData,
                        type: 'contact',
                        customerName: contactData.author,
                        customerEmail: contactData.email,
                        customerPhone: contactData.phone,
                    };
                }
            }

            // AS API 응답 처리
            if (!foundInquiry && asResponse.ok) {
                const asData = await (asResponse as Response).json();
                if (asData && asData.id) {
                    foundInquiry = {
                        ...asData,
                        type: 'as',
                        customerName: asData.author,
                        customerEmail: asData.email,
                        customerPhone: asData.phone,
                    };
                }
            }

            if (foundInquiry) {
                setInquiry(foundInquiry);
                if (foundInquiry.answer) {
                    setAnswer(foundInquiry.answer);
                }
            } else {
                toast({
                    title: "문의를 찾을 수 없습니다",
                    description: "해당 문의가 존재하지 않거나 삭제되었습니다.",
                    variant: "destructive",
                });
                router.push('/admin/inquiries');
            }
        } catch (error) {
            toast({
                title: "로드 실패",
                description: "문의 상세 정보를 불러오는데 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateInquiryStatus = async (status: string) => {
        if (!inquiry) return;

        try {
            let endpoint = '';

            switch (inquiry.type) {
                case 'contact':
                    endpoint = `/api/contact/${inquiry.id}`;
                    break;
                case 'as':
                    endpoint = `/api/as/${inquiry.id}`;
                    break;
                case 'quotation':
                case 'general':
                    endpoint = `/api/admin/inquiries`;
                    break;
                default:
                    endpoint = `/api/admin/inquiries`;
            }

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: inquiry.id, status })
            });

            if (response.ok) {
                setInquiry(prev => prev ? { ...prev, status } : null);
                toast({
                    title: "상태 변경 완료",
                    description: `문의 상태가 '${status === 'pending' ? '답변대기' : status === 'answered' ? '답변완료' : '종료'}'로 변경되었습니다.`,
                });
            } else {
                toast({
                    title: "상태 변경 실패",
                    description: "문의 상태 변경에 실패했습니다.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "상태 변경 실패",
                description: "문의 상태 변경에 실패했습니다.",
                variant: "destructive",
            });
        }
    };

    const submitAnswer = async () => {
        if (!inquiry || !answer.trim()) return;

        try {
            setAnswering(true);
            let endpoint = '';
            let body: any = {};

            switch (inquiry.type) {
                case 'contact':
                    endpoint = `/api/contact/${inquiry.id}`;
                    body = { answer, status: 'answered' };
                    break;
                case 'as':
                    endpoint = `/api/as/${inquiry.id}`;
                    body = { answer, status: 'answered' };
                    break;
                case 'quotation':
                case 'general':
                    endpoint = `/api/admin/inquiries/response`;
                    body = {
                        inquiryId: inquiry.id,
                        content: answer,
                        isPublic: true,
                        author: '관리자',
                        authorId: 'admin',
                        authorRole: '관리자'
                    };
                    break;
                default:
                    endpoint = `/api/admin/inquiries/response`;
                    body = {
                        inquiryId: inquiry.id,
                        content: answer,
                        isPublic: true,
                        author: '관리자',
                        authorId: 'admin',
                        authorRole: '관리자'
                    };
            }

            const response = await fetch(endpoint, {
                method: inquiry.type === 'contact' || inquiry.type === 'as' ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const responseData = await response.json();

            if (response.ok) {
                // 견적요청과 일반 문의의 경우 상태를 답변완료로 변경
                if (inquiry.type === 'quotation' || inquiry.type === 'general') {
                    await updateInquiryStatus('answered');
                }

                toast({
                    title: "답변 등록 완료",
                    description: "답변이 성공적으로 등록되었습니다.",
                });

                // 답변 작성 폼 초기화
                setAnswer('');

                // 데이터 새로고침
                await fetchInquiryDetail(inquiry.id);
            } else {
                toast({
                    title: "답변 등록 실패",
                    description: responseData.error || "답변 등록에 실패했습니다.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "답변 등록 실패",
                description: "답변 등록에 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setAnswering(false);
        }
    };

    const copyInquiryContent = () => {
        if (!inquiry) return;

        const displayName = inquiry.customerName || inquiry.author || '이름 없음';
        const displayEmail = inquiry.customerEmail || inquiry.email || '';
        const displayPhone = inquiry.customerPhone || inquiry.phone || '';

        const textToCopy = `[문의 정보]
제목: ${inquiry.title}
작성자: ${displayName}
이메일: ${displayEmail}
연락처: ${displayPhone}
회사: ${inquiry.company || '-'}
제품명: ${inquiry.productName || '-'}
등록일: ${new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}

[문의 내용]
${inquiry.content}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
                title: "복사 완료",
                description: "문의 내용이 클립보드에 복사되었습니다.",
            });
        }).catch(() => {
            toast({
                title: "복사 실패",
                description: "클립보드 복사에 실패했습니다.",
                variant: "destructive",
            });
        });
    };

    const getTypeInfo = useCallback((type: string) => {
        switch (type) {
            case 'contact':
                return { text: '일반문의', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
            case 'quotation':
                return { text: '견적요청', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
            case 'as':
                return { text: 'AS문의', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' };
            default:
                return { text: '기타', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
        }
    }, []);

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
            case 'in_progress':
                return {
                    icon: <Clock className="h-5 w-5" />,
                    text: '답변대기',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                };
            case 'closed':
                return {
                    icon: <AlertCircle className="h-5 w-5" />,
                    text: '종료',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                };
            default:
                return {
                    icon: <MessageCircle className="h-5 w-5" />,
                    text: '접수',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                };
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">문의 상세 정보 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">문의를 찾을 수 없습니다</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">해당 문의가 존재하지 않거나 삭제되었습니다.</p>
                    <Button asChild>
                        <Link href="/admin/inquiries">문의 목록으로 돌아가기</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(inquiry.status);
    const typeInfo = getTypeInfo(inquiry.type);
    const displayName = inquiry.customerName || inquiry.author || '이름 없음';
    const displayEmail = inquiry.customerEmail || inquiry.email || '';
    const displayPhone = inquiry.customerPhone || inquiry.phone || '';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Link href="/admin/inquiries" >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                문의 목록
                            </Link>
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        {inquiry.isFeatured && <Star className="h-6 w-6 text-yellow-500" />}
                        {!inquiry.isRead && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">문의 상세</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={cn("px-3 py-1.5 text-sm", typeInfo.className)}>
                        <Tag className="h-4 w-4 mr-1.5" />
                        {typeInfo.text}
                    </Badge>
                    <Badge className={cn("px-3 py-1.5 text-sm", statusInfo.className)}>
                        {statusInfo.icon}
                        <span className="ml-1.5">{statusInfo.text}</span>
                    </Badge>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 문의 정보 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{inquiry.title}</h2>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(inquiry.createdAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            {/* 고객 정보 */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-5 mb-6">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">고객 정보</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                                            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">작성자</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
                                        </div>
                                    </div>

                                    {displayEmail && (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                                                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">이메일</p>
                                                <a
                                                    href={`mailto:${displayEmail}`}
                                                    className="font-medium text-primary dark:text-primary-400 hover:underline"
                                                >
                                                    {displayEmail}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {displayPhone && (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                                                <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">연락처</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{displayPhone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {inquiry.company && (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                                                <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">회사/소속</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{inquiry.company}</p>
                                            </div>
                                        </div>
                                    )}

                                    {inquiry.productName && (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                                                <Package className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">제품명</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{inquiry.productName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 문의 내용 */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">문의 내용</h3>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {inquiry.content}
                                    </div>
                                </div>
                            </div>

                            {/* 첨부 파일 */}
                            {inquiry.attachments && inquiry.attachments.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/50">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">첨부 파일</h3>
                                    <div className="space-y-2">
                                        {inquiry.attachments.map((file: any, index: number) => {
                                            const fileName = typeof file === 'string'
                                                ? `첨부파일 ${index + 1}`
                                                : file.originalFilename || file.filename || `첨부파일 ${index + 1}`;
                                            const fileUrl = typeof file === 'string' ? file : file.url || file.path;

                                            return (
                                                <a
                                                    key={index}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Paperclip className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                                        {fileName}
                                                    </span>
                                                    <Download className="h-4 w-4 text-gray-500" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 기존 답변 */}
                        {(inquiry.answer || (inquiry.responses && inquiry.responses.length > 0)) && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">답변 내역</h3>
                                <div className="space-y-4">
                                    {inquiry.answer && (
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-green-800 dark:text-green-200">관리자 답변</span>
                                                {inquiry.answeredAt && (
                                                    <span className="text-xs text-green-600 dark:text-green-400">
                                                        {new Date(inquiry.answeredAt).toLocaleDateString('ko-KR')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="whitespace-pre-wrap text-green-700 dark:text-green-200">
                                                {inquiry.answer}
                                            </div>
                                        </div>
                                    )}

                                    {inquiry.responses && inquiry.responses.map((response, index) => (
                                        <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                    {response.author} ({response.authorRole})
                                                </span>
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    {new Date(response.createdAt).toLocaleDateString('ko-KR')}
                                                </span>
                                            </div>
                                            <div className="whitespace-pre-wrap text-green-700 dark:text-green-200">
                                                {response.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 답변 작성 */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                {inquiry.answer || (inquiry.responses && inquiry.responses.length > 0) ? '추가 답변' : '답변 작성'}
                            </h3>
                            <div className="space-y-4">
                                <Textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="답변을 입력해주세요..."
                                    rows={6}
                                    className="w-full resize-none"
                                />
                                <div className="flex gap-3">
                                    <Button onClick={submitAnswer} disabled={!answer.trim() || answering} className="flex items-center gap-2">
                                        {answering ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                답변 등록 중...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                답변 등록
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" onClick={() => setAnswer('')}>
                                        초기화
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* 상태 관리 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">상태 관리</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">현재 상태</span>
                                    <Badge className={statusInfo.className}>
                                        {statusInfo.icon}
                                        <span className="ml-1">{statusInfo.text}</span>
                                    </Badge>
                                </div>

                                <div>
                                    <Label htmlFor="status" className="text-sm font-medium">상태 변경</Label>
                                    <select
                                        id="status"
                                        value={inquiry.status || 'pending'}
                                        onChange={(e) => updateInquiryStatus(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="pending">답변대기</option>
                                        <option value="answered">답변완료</option>
                                        <option value="closed">종료</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 문의 정보 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">문의 정보</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">문의 ID</span>
                                    <span className="font-mono text-xs text-gray-900 dark:text-gray-100">{inquiry.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">문의 유형</span>
                                    <Badge className={typeInfo.className}>{typeInfo.text}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">등록일</span>
                                    <span className="text-gray-900 dark:text-gray-100">
                                        {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                {inquiry.updatedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">수정일</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {new Date(inquiry.updatedAt).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">읽음 상태</span>
                                    <span className={cn(
                                        "text-xs px-2 py-1 rounded-full",
                                        inquiry.isRead
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    )}>
                                        {inquiry.isRead ? '읽음' : '미읽음'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 빠른 액션 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">빠른 액션</h3>
                            <div className="space-y-2">
                                <Button variant="outline" onClick={copyInquiryContent} className="w-full justify-start">
                                    <Copy className="h-4 w-4 mr-2" />
                                    문의 내용 복사
                                </Button>
                                {displayEmail && (
                                    <Button variant="outline" asChild className="w-full justify-start">
                                        <a href={`mailto:${displayEmail}`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            이메일 보내기
                                        </a>
                                    </Button>
                                )}
                                {displayPhone && (
                                    <Button variant="outline" asChild className="w-full justify-start">
                                        <a href={`tel:${displayPhone}`}>
                                            <Phone className="h-4 w-4 mr-2" />
                                            전화걸기
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline" asChild className="w-full justify-start">
                                    <Link
                                        href={inquiry.type === 'contact' ? `/contact/${inquiry.id}` :
                                            inquiry.type === 'as' ? `/support/as/${inquiry.id}` :
                                                `/contact/${inquiry.id}`}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        사용자 화면으로 보기
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 