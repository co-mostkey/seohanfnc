"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ASPost } from '@/types/as-post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    MessageCircle,
    Calendar,
    User,
    Mail,
    Phone,
    Clock,
    CheckCircle,
    AlertCircle,
    Eye,
    ArrowLeft,
    Star,
    Tag,
    Building,
    RefreshCw,
    Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
    isRead?: boolean;
    isFeatured?: boolean;
    responses?: any[];
}

export default function AdminInquiriesClient() {
    const [inquiries, setInquiries] = useState<UnifiedInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const { toast } = useToast();

    useEffect(() => {
        fetchAllInquiries();
    }, []);

    const fetchAllInquiries = async () => {
        try {
            setLoading(true);

            // 모든 종류의 문의를 병렬로 가져오기
            const [contactResponse, asResponse, adminInquiriesResponse] = await Promise.all([
                fetch('/api/contact').catch(() => ({ ok: false })),
                fetch('/api/as').catch(() => ({ ok: false })),
                fetch('/api/admin/inquiries').catch(() => ({ ok: false }))
            ]);

            const allInquiries: UnifiedInquiry[] = [];
            const seenIds = new Set<string>(); // 중복 ID 추적용

            // Contact 문의 처리
            if (contactResponse.ok) {
                const contactData = await (contactResponse as Response).json();
                const contactPosts = Array.isArray(contactData) ? contactData : (contactData.data || []);
                contactPosts.forEach((post: ASPost) => {
                    if (!seenIds.has(post.id)) {
                        seenIds.add(post.id);
                        allInquiries.push({
                            ...post,
                            type: 'contact',
                            author: post.author,
                            customerName: post.author,
                            customerEmail: post.email,
                            customerPhone: post.phone,
                        });
                    }
                });
            }

            // AS 문의 처리
            if (asResponse.ok) {
                const asData = await (asResponse as Response).json();
                const asPosts = Array.isArray(asData) ? asData : (asData.data || []);
                asPosts.forEach((post: ASPost) => {
                    if (!seenIds.has(post.id)) {
                        seenIds.add(post.id);
                        allInquiries.push({
                            ...post,
                            type: 'as',
                            author: post.author,
                            customerName: post.author,
                            customerEmail: post.email,
                            customerPhone: post.phone,
                        });
                    }
                });
            }

            // 관리자 inquiries (견적 요청 등) 처리
            if (adminInquiriesResponse.ok) {
                const adminData = await (adminInquiriesResponse as Response).json();
                const adminInquiries = adminData.inquiries || [];
                adminInquiries.forEach((inquiry: any) => {
                    if (!seenIds.has(inquiry.id)) {
                        seenIds.add(inquiry.id);
                        allInquiries.push({
                            id: inquiry.id,
                            title: inquiry.title,
                            content: inquiry.content,
                            customerName: inquiry.customerName,
                            customerEmail: inquiry.customerEmail,
                            customerPhone: inquiry.customerPhone,
                            company: inquiry.company,
                            type: inquiry.type || 'general',
                            status: inquiry.status,
                            priority: inquiry.priority,
                            productName: inquiry.productName,
                            createdAt: inquiry.createdAt,
                            isRead: inquiry.isRead,
                            isFeatured: inquiry.isFeatured,
                            responses: inquiry.responses,
                        });
                    }
                });
            }

            // 최신순 정렬
            allInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setInquiries(allInquiries);
        } catch (error) {
            console.error('문의 목록 로드 실패:', error);
            toast({
                title: "로드 실패",
                description: "문의 목록을 불러오는데 실패했습니다.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateInquiryStatus = async (id: string, status: string, type: string) => {
        try {
            let endpoint = '';

            // 문의 타입에 따라 다른 API 엔드포인트 사용
            switch (type) {
                case 'contact':
                    endpoint = `/api/contact/${id}`;
                    break;
                case 'as':
                    endpoint = `/api/as/${id}`;
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
                body: JSON.stringify({ id, status })
            });

            if (response.ok) {
                await fetchAllInquiries();
                toast({
                    title: "상태 변경 완료",
                    description: "문의 상태가 성공적으로 변경되었습니다.",
                });
            }
        } catch (error) {
            console.error('상태 변경 실패:', error);
            toast({
                title: "상태 변경 실패",
                description: "문의 상태 변경에 실패했습니다.",
                variant: "destructive",
            });
        }
    };

    const getTypeInfo = (type: string) => {
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
    };

    const getStatusInfo = (status?: string) => {
        switch (status) {
            case 'answered':
            case 'completed':
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    text: '답변완료',
                    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                };
            case 'pending':
            case 'in_progress':
                return {
                    icon: <Clock className="h-4 w-4" />,
                    text: '답변대기',
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                };
            case 'closed':
                return {
                    icon: <AlertCircle className="h-4 w-4" />,
                    text: '종료',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                };
            default:
                return {
                    icon: <MessageCircle className="h-4 w-4" />,
                    text: '접수',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                };
        }
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inquiry.customerName || inquiry.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inquiry.customerEmail || inquiry.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter ||
            (statusFilter === 'pending' && (!inquiry.status || inquiry.status === 'pending'));

        const matchesType = typeFilter === 'all' || inquiry.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const stats = {
        total: inquiries.length,
        pending: inquiries.filter(i => !i.status || i.status === 'pending' || i.status === 'in_progress').length,
        answered: inquiries.filter(i => i.status === 'answered' || i.status === 'completed').length,
        closed: inquiries.filter(i => i.status === 'closed').length,
        unread: inquiries.filter(i => !i.isRead).length,
        contact: inquiries.filter(i => i.type === 'contact').length,
        quotation: inquiries.filter(i => i.type === 'quotation').length,
        as: inquiries.filter(i => i.type === 'as').length,
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">전체 문의 목록 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Link href="/admin" >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                관리자 메인
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">통합 문의 관리</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">모든 종류의 문의사항을 한 곳에서 관리할 수 있습니다.</p>
                </div>
                <Button onClick={fetchAllInquiries} variant="outline" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    새로고침
                </Button>
            </div>
            {/* Stats Cards - Improved Design */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">전체 문의</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.total}</p>
                        </div>
                        <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-lg">
                            <MessageCircle className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-5 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">답변대기</p>
                            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">{stats.pending}</p>
                        </div>
                        <div className="bg-yellow-200 dark:bg-yellow-800 p-3 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-xl shadow-sm border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-green-700 dark:text-green-300">답변완료</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{stats.answered}</p>
                        </div>
                        <div className="bg-green-200 dark:bg-green-800 p-3 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-5 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-red-700 dark:text-red-300">미읽음</p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">{stats.unread}</p>
                        </div>
                        <div className="bg-red-200 dark:bg-red-800 p-3 rounded-lg">
                            <Eye className="h-5 w-5 text-red-700 dark:text-red-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 p-5 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">일반문의</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.contact}</p>
                        </div>
                        <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-lg">
                            <MessageCircle className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-5 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-purple-700 dark:text-purple-300">견적요청</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">{stats.quotation}</p>
                        </div>
                        <div className="bg-purple-200 dark:bg-purple-800 p-3 rounded-lg">
                            <Tag className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-5 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-orange-700 dark:text-orange-300">AS문의</p>
                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">{stats.as}</p>
                        </div>
                        <div className="bg-orange-200 dark:bg-orange-800 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-orange-700 dark:text-orange-300" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Search and Filter - Improved Design */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="제목, 작성자, 내용, 이메일로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">필터</span>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">전체 상태</option>
                            <option value="pending">답변대기</option>
                            <option value="answered">답변완료</option>
                            <option value="closed">종료</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">전체 유형</option>
                            <option value="contact">일반문의</option>
                            <option value="quotation">견적요청</option>
                            <option value="as">AS문의</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Inquiries List */}
            <div className="space-y-4">
                {filteredInquiries.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? '검색 조건에 맞는 문의가 없습니다' : '등록된 문의가 없습니다'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? '다른 검색 조건을 시도해보세요.' : '새로운 문의가 등록되면 여기에 표시됩니다.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredInquiries.map((inquiry) => {
                            const statusInfo = getStatusInfo(inquiry.status);
                            const typeInfo = getTypeInfo(inquiry.type);
                            const displayName = inquiry.customerName || inquiry.author || '이름 없음';
                            const displayEmail = inquiry.customerEmail || inquiry.email || '';
                            const displayPhone = inquiry.customerPhone || inquiry.phone || '';

                            return (
                                <div
                                    key={inquiry.id}
                                    className={cn(
                                        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow",
                                        !inquiry.isRead && "border-l-4 border-l-blue-500",
                                        inquiry.type === 'quotation' && "border-l-4 border-l-purple-500"
                                    )}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        {/* 문의 정보 */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-3 mb-3">
                                                {inquiry.isFeatured && (
                                                    <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                )}
                                                {!inquiry.isRead && (
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                )}
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/admin/inquiries/${inquiry.id}`}
                                                        className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400 block"
                                                    >
                                                        {inquiry.title}
                                                    </Link>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {inquiry.content}
                                                    </p>
                                                    {inquiry.productName && (
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                                                            <Package className="h-3 w-3" />
                                                            제품: {inquiry.productName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 고객 정보 */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-700 dark:text-gray-300">{displayName}</span>
                                                </div>
                                                {displayEmail && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600 dark:text-gray-400">{displayEmail}</span>
                                                    </div>
                                                )}
                                                {displayPhone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600 dark:text-gray-400">{displayPhone}</span>
                                                    </div>
                                                )}
                                                {inquiry.company && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Building className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600 dark:text-gray-400">{inquiry.company}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 상태 및 작업 */}
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                                                    typeInfo.className
                                                )}>
                                                    {typeInfo.text}
                                                </span>
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                                                    statusInfo.className
                                                )}>
                                                    {statusInfo.icon}
                                                    <span>{statusInfo.text}</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/inquiries/${inquiry.id}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        상세보기
                                                    </Link>
                                                </Button>
                                                <select
                                                    value={inquiry.status || 'pending'}
                                                    onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value, inquiry.type)}
                                                    className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="pending">답변대기</option>
                                                    <option value="answered">답변완료</option>
                                                    <option value="closed">종료</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
} 