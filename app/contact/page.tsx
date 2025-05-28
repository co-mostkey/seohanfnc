import Link from 'next/link';
import { ASPost } from '@/types/as-post';
import { readItems } from '@/lib/file-db';
import { Metadata } from 'next';
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { MessageCircle, Edit, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: '문의 - 서한에프앤씨',
    description: '서한에프앤씨에 제품이나 서비스에 대한 문의사항을 남겨주세요.',
};

export default async function ContactPage() {
    const posts = (await readItems<ASPost>('as-board.json')) || [];
    const sorted = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const breadcrumbItems = [
        { text: '홈', href: '/' },
        { text: '문의', href: '/contact', active: true }
    ];

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'answered':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">답변완료</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">답변대기</span>;
            case 'closed':
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">종료</span>;
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">접수</span>;
        }
    };

    return (
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
            <div className="w-full max-w-6xl mx-auto">
                {/* Breadcrumb & Page Heading */}
                <div className="mb-6">
                    <SimpleBreadcrumb items={breadcrumbItems} />
                </div>
                <div className="mb-12 md:mb-16">
                    <PageHeading
                        title="문의"
                        subtitle="제품이나 서비스에 대한 문의사항을 남겨주세요. 빠른 시간 내에 답변드리겠습니다."
                    />
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={cn(
                        "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                        "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                    )}>
                        <div className="flex items-center mb-3">
                            <MessageCircle className="h-5 w-5 text-primary dark:text-primary-400 mr-2" />
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">온라인 문의</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            온라인으로 편리하게 문의하세요. 담당자가 확인 후 빠르게 답변드립니다.
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/contact/new" >
                                <Edit className="h-4 w-4 mr-2" />
                                문의하기
                            </Link>
                        </Button>
                    </div>

                    <div className={cn(
                        "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                        "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                    )}>
                        <div className="flex items-center mb-3">
                            <span className="text-primary dark:text-primary-400 text-lg mr-2">📞</span>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">전화 문의</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong className="text-lg text-gray-800 dark:text-gray-100">02-1234-5678</strong>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            평일 09:00 - 18:00<br />
                            (주말/공휴일 휴무)
                        </p>
                    </div>

                    <div className={cn(
                        "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                        "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                    )}>
                        <div className="flex items-center mb-3">
                            <span className="text-primary dark:text-primary-400 text-lg mr-2">✉️</span>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">이메일 문의</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <a href="mailto:shfnc@hanmail.net" className="text-primary dark:text-primary-400 hover:underline">
                                shfnc@hanmail.net
                            </a>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            24시간 접수 가능
                        </p>
                    </div>
                </div>

                {/* Contact List */}
                <div className={cn(
                    "rounded-lg border border-gray-200 dark:border-gray-700/50",
                    "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm overflow-hidden"
                )}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">문의 내역</h2>
                            <Button asChild>
                                <Link href="/contact/new" >
                                    <Edit className="h-4 w-4 mr-2" />
                                    새 문의 작성
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {sorted.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageCircle className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">등록된 문의가 없습니다</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                제품이나 서비스에 대한 궁금한 점이 있으시면 언제든 문의해 주세요.
                            </p>
                            <Button asChild>
                                <Link href="/contact/new">첫 문의 작성하기</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">번호</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">제목</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작성자</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">작성일</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                                    {sorted.map((post, idx) => (
                                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {sorted.length - idx}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/contact/${post.id}`}
                                                    className="text-sm text-primary dark:text-primary-400 hover:underline font-medium"
                                                >
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900 dark:text-gray-100">{post.author}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(post.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 