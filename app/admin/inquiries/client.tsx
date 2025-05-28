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
    Building
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin" >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                관리자 메인
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">통합 문의 관리</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">모든 종류의 문의사항을 통합 관리할 수 있습니다.</p>
                </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">전체</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                        </div>
                        <MessageCircle className="h-6 w-6 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">답변대기</p>
                            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">답변완료</p>
                            <p className="text-xl font-bold text-green-600">{stats.answered}</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">미읽음</p>
                            <p className="text-xl font-bold text-red-600">{stats.unread}</p>
                        </div>
                        <Star className="h-6 w-6 text-red-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">일반문의</p>
                            <p className="text-xl font-bold text-blue-600">{stats.contact}</p>
                        </div>
                        <MessageCircle className="h-6 w-6 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">견적요청</p>
                            <p className="text-xl font-bold text-purple-600">{stats.quotation}</p>
                        </div>
                        <Tag className="h-6 w-6 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">AS문의</p>
                            <p className="text-xl font-bold text-orange-600">{stats.as}</p>
                        </div>
                        <AlertCircle className="h-6 w-6 text-orange-500" />
                    </div>
                </div>
            </div>
            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="제목, 작성자, 내용, 이메일로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="all">전체 상태</option>
                            <option value="pending">답변대기</option>
                            <option value="answered">답변완료</option>
                            <option value="completed">처리완료</option>
                            <option value="closed">종료</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {filteredInquiries.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? '검색 조건에 맞는 문의가 없습니다' : '등록된 문의가 없습니다'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? '다른 검색 조건을 시도해보세요.' : '새로운 문의가 등록되면 여기에 표시됩니다.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">문의 정보</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작성자</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">유형</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">상태</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작성일</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작업</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredInquiries.map((inquiry) => {
                                    const statusInfo = getStatusInfo(inquiry.status);
                                    const typeInfo = getTypeInfo(inquiry.type);
                                    const displayName = inquiry.customerName || inquiry.author || '이름 없음';
                                    const displayEmail = inquiry.customerEmail || inquiry.email || '';
                                    const displayPhone = inquiry.customerPhone || inquiry.phone || '';

                                    return (
                                        <tr key={inquiry.id} className={cn(
                                            "hover:bg-gray-50 dark:hover:bg-gray-700",
                                            !inquiry.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                                        )}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    {inquiry.isFeatured && (
                                                        <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                                                    )}
                                                    {!inquiry.isRead && (
                                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`/admin/inquiries/${inquiry.id}`}
                                                            className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-400 block truncate"
                                                        >
                                                            {inquiry.title}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                            {inquiry.content.substring(0, 120)}...
                                                        </p>
                                                        {inquiry.productName && (
                                                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                제품: {inquiry.productName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
                                                        {displayEmail && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Mail className="h-3 w-3 text-gray-400" />
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{displayEmail}</p>
                                                            </div>
                                                        )}
                                                        {displayPhone && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{displayPhone}</p>
                                                            </div>
                                                        )}
                                                        {inquiry.company && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Building className="h-3 w-3 text-gray-400" />
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{inquiry.company}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                    typeInfo.className
                                                )}>
                                                    {typeInfo.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                                        statusInfo.className
                                                    )}>
                                                        {statusInfo.icon}
                                                        <span>{statusInfo.text}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                                        {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/admin/inquiries/${inquiry.id}`} >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            상세
                                                        </Link>
                                                    </Button>
                                                    <select
                                                        value={inquiry.status || 'pending'}
                                                        onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value, inquiry.type)}
                                                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                                                    >
                                                        <option value="pending">답변대기</option>
                                                        <option value="answered">답변완료</option>
                                                        <option value="completed">처리완료</option>
                                                        <option value="closed">종료</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 