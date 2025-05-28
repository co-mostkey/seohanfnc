'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { ArrowLeft, Send, AlertCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function NewContactPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        email: '',
        phone: '',
        company: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbItems = [
        { text: '홈', href: '/' },
        { text: '문의', href: '/contact' },
        { text: '문의하기', href: '/contact/new', active: true }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.author.trim() || !formData.content.trim()) {
            toast({
                title: "입력 오류",
                description: "제목, 작성자, 내용은 필수 입력 항목입니다.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast({
                    title: "문의 등록 완료",
                    description: "문의가 성공적으로 등록되었습니다. 빠른 시간 내에 답변드리겠습니다.",
                });
                router.push('/contact');
            } else {
                throw new Error('문의 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "등록 실패",
                description: "문의 등록 중 오류가 발생했습니다. 다시 시도해 주세요.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
            <div className="w-full max-w-4xl mx-auto">
                {/* Breadcrumb & Page Heading */}
                <div className="mb-6">
                    <SimpleBreadcrumb items={breadcrumbItems} />
                </div>
                <div className="mb-8">
                    <PageHeading
                        title="문의하기"
                        subtitle="제품이나 서비스에 대한 궁금한 점을 남겨주세요. 담당자가 확인 후 빠르게 답변드리겠습니다."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className={cn(
                            "rounded-lg border border-gray-200 dark:border-gray-700/50",
                            "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm overflow-hidden"
                        )}>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Send className="h-5 w-5 text-primary dark:text-primary-400" />
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">문의 작성</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            제목 <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="문의 제목을 입력해주세요"
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                성명 <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="author"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                placeholder="이름을 입력해주세요"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                회사명/소속
                                            </Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="회사명 또는 소속을 입력해주세요"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                이메일
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                연락처
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="010-0000-0000"
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            문의 내용 <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="content"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            placeholder="문의하실 내용을 자세히 입력해주세요"
                                            required
                                            rows={8}
                                            className="w-full resize-none"
                                        />
                                    </div>

                                    {/* Notice */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="flex gap-3">
                                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                                <p className="font-medium mb-1">문의 처리 안내</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>접수된 문의는 1-2 영업일 내에 답변드립니다.</li>
                                                    <li>긴급한 문의는 전화(02-1234-5678)로 연락해주세요.</li>
                                                    <li>개인정보는 문의 처리 목적으로만 사용됩니다.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button type="button" variant="outline" asChild className="flex-1">
                                            <Link href="/contact" >
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                목록으로
                                            </Link>
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    등록 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    문의 등록
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Phone Contact */}
                            <div className={cn(
                                "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                                "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                            )}>
                                <div className="flex items-center mb-3">
                                    <Phone className="h-5 w-5 text-primary dark:text-primary-400 mr-2" />
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">전화 문의</h3>
                                </div>
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">02-1234-5678</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    평일 09:00 - 18:00<br />
                                    (주말/공휴일 휴무)
                                </p>
                            </div>

                            {/* Email Contact */}
                            <div className={cn(
                                "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                                "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                            )}>
                                <div className="flex items-center mb-3">
                                    <Mail className="h-5 w-5 text-primary dark:text-primary-400 mr-2" />
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">이메일 문의</h3>
                                </div>
                                <a
                                    href="mailto:shfnc@hanmail.net"
                                    className="text-primary dark:text-primary-400 hover:underline break-all"
                                >
                                    shfnc@hanmail.net
                                </a>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    24시간 접수 가능
                                </p>
                            </div>

                            {/* Address */}
                            <div className={cn(
                                "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                                "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                            )}>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">주소</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    서울특별시 강남구<br />
                                    테헤란로 123길 45<br />
                                    서한빌딩 7층
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 