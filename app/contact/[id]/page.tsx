import { notFound } from 'next/navigation';
import { readItems } from '@/lib/file-db';
import { ASPost } from '@/types/as-post';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { ArrowLeft, Calendar, User, Mail, Phone, Building, MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactDetailPageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
    const { id } = await params;
    const posts = (await readItems<ASPost>('as-board.json')) || [];
    const post = posts.find(p => p.id === id);

    if (!post) {
        notFound();
    }

    const breadcrumbItems = [
        { text: '홈', href: '/' },
        { text: '문의', href: '/contact' },
        { text: post.title, href: `/contact/${post.id}`, active: true }
    ];

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'answered':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        답변완료
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        종료
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <Clock className="w-4 h-4 mr-1" />
                        답변대기
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <SimpleBreadcrumb items={breadcrumbItems} />

                {/* Header */}
                <div className="mt-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" asChild>
                            <Link href="/contact" >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                문의 목록
                            </Link>
                        </Button>
                        <PageHeading
                            title="문의 상세"
                            subtitle="문의사항의 상세 내용을 확인하세요"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h1>
                                {getStatusBadge(post.status)}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{post.author}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            {/* 작성자 정보 */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">작성자 정보</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">이름</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{post.author}</p>
                                        </div>
                                    </div>

                                    {post.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{post.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {post.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">연락처</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-100">{post.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {post.company && (
                                        <div className="flex items-center gap-3">
                                            <Building className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">회사/소속</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-100">{post.company}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 문의 내용 */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">문의 내용</h3>
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {post.content}
                                    </div>
                                </div>
                            </div>

                            {/* 답변 */}
                            {post.answer && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">관리자 답변</h3>
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-green-800 dark:text-green-200">관리자</span>
                                            {post.answeredAt && (
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    {new Date(post.answeredAt).toLocaleDateString('ko-KR')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="whitespace-pre-wrap text-green-700 dark:text-green-200">
                                            {post.answer}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    문의 ID: {post.id}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" asChild>
                                        <Link href="/contact">
                                            목록으로 돌아가기
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/contact/new" >
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            새 문의 작성
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 