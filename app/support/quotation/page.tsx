"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeading } from '@/components/ui/PageHeading';
import { cn } from '@/lib/utils';
import { ContentBlock } from '@/components/ContentBlock';
import {
  User, Building, Mail, Phone, Briefcase, FileText, Paperclip, Send, Info, List, Edit
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface QuoteFormData {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  productCategory: string;
  productName: string;
  quantity: number;
  message?: string;
  privacy: boolean;
  createdAt: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "이름을 2자 이상 입력해주세요." }),
  company: z.string().optional(),
  email: z.string().email({ message: "올바른 이메일 주소를 입력해주세요." }),
  phone: z.string().min(10, { message: "올바른 전화번호를 입력해주세요." }),
  productCategory: z.string().min(1, { message: "제품 카테고리를 선택해주세요." }),
  productName: z.string().min(2, { message: "제품명을 2자 이상 입력해주세요." }),
  quantity: z.coerce.number().min(1, { message: "수량을 1 이상 입력해주세요." }),
  message: z.string().optional(),
  privacy: z.boolean().refine(val => val === true, { message: "개인정보 처리방침에 동의해야 합니다." })
});

type FormValues = z.infer<typeof formSchema>;

const productCategories = [
  '공기안전매트', '인명구조기구', '소화장비', '소독장비', '기타'
];

const LOCAL_STORAGE_KEY = 'onlineQuotes';

export default function QuotationPage() {
  const [quotes, setQuotes] = useState<QuoteFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 로컬 스토리지에서 불러오기
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    let localQuotes: QuoteFormData[] = [];

    if (storedQuotes) {
      try {
        localQuotes = JSON.parse(storedQuotes);
      } catch (error) {
        console.error("Error parsing quotes from localStorage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // 2. 서버에서 견적 요청 데이터 불러오기
    async function fetchQuotationRequests() {
      try {
        const response = await fetch('/api/admin/inquiries?type=quotation');
        if (!response.ok) {
          throw new Error('서버에서 견적 요청을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        const serverQuotes: QuoteFormData[] = [];

        if (data.inquiries && Array.isArray(data.inquiries)) {
          // 서버 데이터를 QuoteFormData 형식으로 변환
          data.inquiries.forEach((inquiry: any) => {
            // 컨텐츠에서 제품명과 카테고리, 수량 추출 시도
            let productCategory = '';
            let productName = '';
            let quantity = 1;

            try {
              // 컨텐츠 파싱
              const categoryMatch = inquiry.content.match(/제품 카테고리:\s*(.+?)(?:\n|$)/);
              const nameMatch = inquiry.content.match(/제품명:\s*(.+?)(?:\n|$)/);
              const quantityMatch = inquiry.content.match(/수량:\s*(\d+)개/);

              productCategory = categoryMatch ? categoryMatch[1].trim() : '';
              productName = nameMatch ? nameMatch[1].trim() : '';
              quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;
            } catch (e) {
              console.error('컨텐츠 파싱 오류:', e);
            }

            serverQuotes.push({
              id: inquiry.id,
              name: inquiry.customerName,
              company: inquiry.company || '',
              email: inquiry.customerEmail,
              phone: inquiry.customerPhone || '',
              productCategory,
              productName: inquiry.productName || productName,
              quantity,
              message: '',
              privacy: true,
              createdAt: inquiry.createdAt
            });
          });
        }

        // 3. 로컬 및 서버 데이터 병합 (중복 제거)
        const mergedQuotes = [...localQuotes];

        // 서버 데이터 중 로컬에 없는 항목만 추가
        serverQuotes.forEach(serverQuote => {
          const isDuplicate = localQuotes.some(localQuote =>
            localQuote.id === serverQuote.id ||
            (localQuote.email === serverQuote.email &&
              localQuote.productName === serverQuote.productName &&
              Math.abs(new Date(localQuote.createdAt).getTime() - new Date(serverQuote.createdAt).getTime()) < 60000) // 1분 이내 같은 요청은 중복으로 간주
          );

          if (!isDuplicate) {
            mergedQuotes.push(serverQuote);
          }
        });

        // 날짜순 정렬 (최신순)
        mergedQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 상태 업데이트
        setQuotes(mergedQuotes);
      } catch (error) {
        console.error("서버 데이터 로드 중 오류:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotationRequests();
  }, []);

  // LocalStorage 저장 로직은 유지
  useEffect(() => {
    if (quotes.length > 0) {
      // 로컬에서 생성된 데이터만 로컬 스토리지에 저장
      const localQuotes = quotes.filter(q => q.id.includes('-')); // UUID 형식의 ID만 localStorage에 저장
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localQuotes));
    }
  }, [quotes]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", company: "", email: "", phone: "",
      productCategory: "", productName: "", quantity: 1, message: "", privacy: false,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // API 요청으로 견적 요청 전송
      const response = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `견적 문의: ${values.productName} (${values.quantity}개)`,
          content: `제품 카테고리: ${values.productCategory}\n제품명: ${values.productName}\n수량: ${values.quantity}개\n\n추가 요청사항:\n${values.message || '없음'}`,
          customerName: values.name,
          customerEmail: values.email,
          customerPhone: values.phone,
          company: values.company,
          type: 'quotation',
          productName: values.productName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '견적 요청 중 오류가 발생했습니다.');
      }

      // 기존 로컬 스토리지 기능 유지
      const newQuote: QuoteFormData = {
        ...values,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setQuotes(prevQuotes => [newQuote, ...prevQuotes]);

      console.log("Form Submitted & Saved to server:", newQuote);
      alert('견적 요청이 성공적으로 접수되었습니다.');
      form.reset();
    } catch (error) {
      console.error("견적 요청 제출 중 오류 발생:", error);
      alert('견적 요청 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const maskName = (name: string) => name.length > 1 ? name[0] + '*' + name.slice(-1) : name;

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-black">
      <Image
        src={`${basePath}/images/backgrounds/login-bg.png`}
        alt="Quotation Background"
        fill
        className="object-cover object-center z-[-2]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
      {/* Inner GlobalNav removed to avoid duplicate nav */}

      <div className="relative z-10 container mx-auto max-w-screen-xl px-6 py-10 md:py-16">
        <div className="mb-12 md:mb-16 text-center lg:text-left">
          <PageHeading
            align="center"
            className="mx-auto lg:mx-0"
            title="온라인 견적 요청"
            subtitle="필요한 제품 정보를 입력해주시면 신속하게 견적을 보내드립니다."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className={cn(
              "rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700/50",
              "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm h-full"
            )}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <List className="mr-2 h-5 w-5 text-primary dark:text-primary-400" /> 견적 요청 목록
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">접수된 견적 요청 목록입니다.</p>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex justify-center py-8 items-center text-gray-400">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent mr-3"></div>
                    <span>불러오는 중...</span>
                  </div>
                ) : quotes.length > 0 ? (
                  quotes.map((quote, index) => (
                    <div key={quote.id} className="p-3 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate pr-2">
                          {index + 1}. {quote.productCategory} / {quote.productName} ({quote.quantity}개)
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">비밀글 🔒</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>작성자: {maskName(quote.name)}</span>
                        <span>{formatDate(quote.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">접수된 견적 요청이 없습니다.</p>
                )}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className={cn(
                "rounded-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700/50",
                "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
              )}>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  <Edit className="mr-2 h-5 w-5 text-primary dark:text-primary-400" /> 견적 내용 작성
                </h2>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">고객 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">성함 <span className="text-red-500">*</span></Label>
                      <Input id="name" placeholder="홍길동" {...form.register("name")} className="mt-1" />
                      {form.formState.errors.name && <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="company">회사명</Label>
                      <Input id="company" placeholder="(주)서한에프앤씨" {...form.register("company")} className="mt-1" />
                    </div>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">연락처 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">이메일 <span className="text-red-500">*</span></Label>
                      <Input id="email" type="email" placeholder="email@example.com" {...form.register("email")} className="mt-1" />
                      {form.formState.errors.email && <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">연락처 <span className="text-red-500">*</span></Label>
                      <Input id="phone" type="tel" placeholder="010-1234-5678" {...form.register("phone")} className="mt-1" />
                      {form.formState.errors.phone && <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">제품 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-category">제품 카테고리 <span className="text-red-500">*</span></Label>
                      <Select onValueChange={(value) => form.setValue("productCategory", value)} defaultValue={form.getValues("productCategory")}>
                        <SelectTrigger id="product-category" className="mt-1">
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.productCategory && <p className="text-xs text-red-500 mt-1">{form.formState.errors.productCategory.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="product-name">제품명 <span className="text-red-500">*</span></Label>
                      <Input id="product-name" placeholder="정확한 제품명 또는 모델명" {...form.register("productName")} className="mt-1" />
                      {form.formState.errors.productName && <p className="text-xs text-red-500 mt-1">{form.formState.errors.productName.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="quantity">수량 <span className="text-red-500">*</span></Label>
                      <Input id="quantity" type="number" min="1" placeholder="1" {...form.register("quantity")} className="mt-1" />
                      {form.formState.errors.quantity && <p className="text-xs text-red-500 mt-1">{form.formState.errors.quantity.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">추가 요청사항</h3>
                  <div>
                    <Label htmlFor="message">메시지</Label>
                    <Textarea id="message" placeholder="궁금하신 점이나 특별히 요청하실 내용을 입력해주세요." {...form.register("message")} className="mt-1" rows={5} />
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                    <Paperclip className="mr-2 h-5 w-5 text-primary dark:text-primary-400" /> 첨부 파일 (선택)
                  </h3>
                  <Input
                    id="attachment"
                    type="file"
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-primary-300 dark:hover:file:bg-primary/30"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">도면, 사양서 등 필요한 파일을 첨부할 수 있습니다. (최대 10MB)</p>
                </div>

                <div className="items-top flex space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={form.watch("privacy")}
                    onCheckedChange={(checked: boolean) => form.setValue("privacy", checked, {
                      shouldValidate: true
                    })}
                    aria-labelledby="privacy-label"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="privacy"
                      id="privacy-label"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      개인정보 수집 및 이용 동의 <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      견적 문의 처리 목적으로 개인정보(성함, 연락처, 이메일 등)를 수집 및 이용합니다.
                      <Link href="/privacy" className="underline hover:text-primary dark:hover:text-primary-400">개인정보처리방침</Link> 전문 보기
                    </p>
                    {form.formState.errors.privacy && <p className="text-xs text-red-500 mt-1">{form.formState.errors.privacy.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? '제출 중...' : <><Send className="mr-2 h-4 w-4" />견적 요청 제출</>}
                </Button>
              </div>
            </form>
          </section>

          <ContentBlock slug="quote-info" className={cn(
            "mt-12 lg:col-span-12 rounded-lg p-6 border border-blue-200 dark:border-blue-900/50",
            "bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm shadow-sm"
          )} />

        </div>
      </div>
    </main>
  );
} 