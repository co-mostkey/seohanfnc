"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeading } from '@/components/ui/PageHeading';
import { cn } from '@/lib/utils';
import { ContentBlock } from '@/components/ContentBlock';
import {
  User, Building, Mail, Phone, Briefcase, FileText, Paperclip, Send, Info, List, Edit, MessageSquare, X, Download, CheckCircle
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
  accessKey?: string;
  createdAt: string;
  responses?: any[];
  attachments?: string[];
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

// 자주 사용되는 스타일 클래스 조합
const CARD_STYLES = "rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm";
const SECTION_HEADING_STYLES = "text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center";
const LABEL_REQUIRED_STYLES = "text-red-500";

export default function QuotationPage() {
  const [quotes, setQuotes] = useState<QuoteFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteFormData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedAccessKey, setGeneratedAccessKey] = useState('');

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

            const categoryMatch = inquiry.content.match(/제품 카테고리:\s*(.+?)(?:\n|$)/);
            const productNameMatch = inquiry.content.match(/제품명:\s*(.+?)(?:\n|$)/);
            const quantityMatch = inquiry.content.match(/수량:\s*(\d+)개/);

            if (categoryMatch) productCategory = categoryMatch[1].trim();
            if (productNameMatch) productName = productNameMatch[1].trim();
            if (quantityMatch) quantity = parseInt(quantityMatch[1], 10);

            // adminNotes에서 접근 키 추출
            const accessKeyMatch = inquiry.adminNotes?.match(/접근키:\s*([A-Z0-9-]+)/);
            const accessKey = accessKeyMatch ? accessKeyMatch[1] : '';

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
              accessKey: accessKey,
              createdAt: inquiry.createdAt,
              responses: inquiry.responses || [],
              attachments: inquiry.attachments || []
            });
          });
        }

        // 3. 로컬 및 서버 데이터 병합 (중복 제거)
        const mergedQuotes: QuoteFormData[] = [];
        const seenIds = new Set<string>();

        // 서버 데이터를 먼저 추가 (서버 데이터 우선)
        serverQuotes.forEach(serverQuote => {
          if (!seenIds.has(serverQuote.id)) {
            mergedQuotes.push(serverQuote);
            seenIds.add(serverQuote.id);
          }
        });

        // 로컬 데이터 중 서버에 없는 것만 추가
        localQuotes.forEach(localQuote => {
          if (!seenIds.has(localQuote.id)) {
            mergedQuotes.push(localQuote);
            seenIds.add(localQuote.id);
          }
        });

        // 날짜순 정렬 (최신순)
        mergedQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 상태 업데이트
        setQuotes(mergedQuotes);
      } catch (error) {
        // 서버 데이터 로드 실패는 조용히 처리 (로컬 데이터만 사용)
      } finally {
        setLoading(false);
      }
    }

    fetchQuotationRequests();
  }, []);

  // LocalStorage 저장 로직은 유지
  useEffect(() => {
    if (quotes.length > 0) {
      // 모든 견적을 로컬 스토리지에 저장 (서버 견적 포함)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
    }
  }, [quotes]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", company: "", email: "", phone: "",
      productCategory: "", productName: "", quantity: 1, message: "",
      privacy: false,
    },
  });

  // 고유 접근 키 생성 함수
  const generateAccessKey = useCallback(() => {
    const timestamp = Date.now().toString(36).slice(-4); // 타임스탬프 마지막 4자리
    const random = Math.random().toString(36).slice(2, 6); // 랜덤 4자리
    return `${timestamp}-${random}`.toUpperCase();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // 파일 업로드 처리
      const formData = new FormData();
      attachedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      // 파일 업로드 (있는 경우)
      let uploadedFileUrls: string[] = [];
      if (attachedFiles.length > 0) {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          uploadedFileUrls = uploadData.urls || [];
        }
      }

      // 고유 접근 키 생성
      const accessKey = generateAccessKey();

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
          attachments: uploadedFileUrls,
          adminNotes: `접근키: ${accessKey}`, // 관리자 메모에 접근키 저장
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || '견적 요청 중 오류가 발생했습니다.');
      }

      // 서버에서 생성된 견적 사용
      const serverInquiry = responseData.inquiry;
      const newQuote: QuoteFormData = {
        ...values,
        id: serverInquiry.id, // 서버에서 생성된 ID 사용
        accessKey: accessKey,
        createdAt: serverInquiry.createdAt,
        responses: serverInquiry.responses || [],
        attachments: serverInquiry.attachments || [],
      };
      setQuotes(prevQuotes => [newQuote, ...prevQuotes]);

      setGeneratedAccessKey(accessKey);
      setShowSuccessModal(true);
      form.reset();
      setAttachedFiles([]);
    } catch (error) {
      alert('견적 요청 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleQuoteClick = useCallback((quote: QuoteFormData) => {
    setSelectedQuote(quote);
    setShowPasswordModal(true);
    setPasswordInput('');
    setPasswordError('');
  }, []);

  const handlePasswordSubmit = async () => {
    if (!selectedQuote) return;

    try {
      // 접근 키로 확인 (관리자 메모에서 접근 키 추출)
      const response = await fetch(`/api/admin/inquiries?id=${selectedQuote.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.inquiry) {
          // adminNotes에서 접근 키 추출
          const accessKeyMatch = data.inquiry.adminNotes?.match(/접근키:\s*([A-Z0-9-]+)/);
          const serverAccessKey = accessKeyMatch ? accessKeyMatch[1] : null;

          // 접근 키로 확인
          if (
            (serverAccessKey && serverAccessKey === passwordInput.toUpperCase()) ||
            (selectedQuote.accessKey && selectedQuote.accessKey === passwordInput.toUpperCase())
          ) {
            setShowPasswordModal(false);
            window.location.href = `/support/quotation/${selectedQuote.id}?password=${encodeURIComponent(passwordInput.toUpperCase())}`;
          } else {
            setPasswordError('접근 키가 올바르지 않습니다.');
          }
        }
      } else {
        // 로컬 스토리지에 저장된 경우
        if (selectedQuote.accessKey && selectedQuote.accessKey === passwordInput.toUpperCase()) {
          setShowPasswordModal(false);
          window.location.href = `/support/quotation/${selectedQuote.id}?password=${encodeURIComponent(passwordInput.toUpperCase())}`;
        } else {
          setPasswordError('접근 키가 올바르지 않습니다.');
        }
      }
    } catch (error) {
      // 로컬 스토리지에 저장된 경우 직접 비교
      if (selectedQuote.accessKey && selectedQuote.accessKey === passwordInput.toUpperCase()) {
        setShowPasswordModal(false);
        window.location.href = `/support/quotation/${selectedQuote.id}?password=${encodeURIComponent(passwordInput.toUpperCase())}`;
      } else {
        setPasswordError('접근 키가 올바르지 않습니다.');
      }
    }
  };

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }, []);

  const maskName = useCallback((name: string) => {
    return name.length > 1 ? name[0] + '*' + name.slice(-1) : name;
  }, []);

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

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              견적 확인
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              견적 요청 시 발급된 접근 키를 입력해주세요.
            </p>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="접근 키 입력 (예: ABCD-1234)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="font-mono"
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPasswordModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handlePasswordSubmit}
                  className="flex-1"
                >
                  확인
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 개인정보처리방침 모달 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                개인정보처리방침
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h4>1. 개인정보의 수집 및 이용 목적</h4>
              <p>서한F&C는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
              <ul>
                <li>견적 문의 처리 및 답변</li>
                <li>고객 문의사항 응대</li>
                <li>서비스 개선을 위한 통계 분석</li>
              </ul>

              <h4>2. 수집하는 개인정보 항목</h4>
              <ul>
                <li>필수항목: 성명, 이메일, 연락처</li>
                <li>선택항목: 회사명, 추가 요청사항</li>
              </ul>

              <h4>3. 개인정보의 보유 및 이용 기간</h4>
              <p>수집된 개인정보는 문의 처리 완료 후 3년간 보관하며, 보유 기간 경과 시 지체 없이 파기합니다.</p>

              <h4>4. 개인정보의 제3자 제공</h4>
              <p>서한F&C는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>

              <h4>5. 개인정보의 파기</h4>
              <p>개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>

              <h4>6. 이용자의 권리</h4>
              <p>이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.</p>

              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm">
                  <strong>개인정보 보호책임자</strong><br />
                  이메일: privacy@shfnc.com<br />
                  전화: 02-1234-5678
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowPrivacyModal(false)}>
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                견적 요청이 접수되었습니다!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                아래의 접근 키를 저장해주세요. 답변 확인 시 필요합니다.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">접근 키</p>
                <p className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
                  {generatedAccessKey}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  ⚠️ 이 접근 키는 다시 확인할 수 없으니 꼭 메모해주세요.
                </p>
              </div>

              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  setGeneratedAccessKey('');
                }}
                className="w-full"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

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
            <div className={cn(CARD_STYLES, "p-4 md:p-6 h-full")}>
              <h2 className={SECTION_HEADING_STYLES}>
                <List className="mr-2 h-5 w-5 text-primary dark:text-primary-400" /> 견적 요청 목록
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">접수된 견적 요청 목록입니다. 클릭하여 상세 내용을 확인하세요.</p>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="flex justify-center py-8 items-center text-gray-400">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent mr-3"></div>
                    <span>불러오는 중...</span>
                  </div>
                ) : quotes.length > 0 ? (
                  quotes.map((quote, index) => (
                    <div
                      key={quote.id}
                      onClick={() => handleQuoteClick(quote)}
                      className="p-3 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate pr-2">
                          {index + 1}. {quote.productCategory} / {quote.productName} ({quote.quantity}개)
                        </span>
                        <div className="flex items-center gap-2">
                          {quote.responses && quote.responses.length > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              답변 {quote.responses.length}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 flex-shrink-0">비밀글 🔒</span>
                        </div>
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
              <div className={cn(CARD_STYLES, "p-6 md:p-8")}>
                <h2 className={SECTION_HEADING_STYLES}>
                  <Edit className="mr-2 h-5 w-5 text-primary dark:text-primary-400" /> 견적 내용 작성
                </h2>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">고객 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">성함 <span className={LABEL_REQUIRED_STYLES}>*</span></Label>
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
                      <Label htmlFor="email">이메일 <span className={LABEL_REQUIRED_STYLES}>*</span></Label>
                      <Input id="email" type="email" placeholder="email@example.com" {...form.register("email")} className="mt-1" />
                      {form.formState.errors.email && <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">연락처 <span className={LABEL_REQUIRED_STYLES}>*</span></Label>
                      <Input id="phone" type="tel" placeholder="010-1234-5678" {...form.register("phone")} className="mt-1" />
                      {form.formState.errors.phone && <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">제품 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-category">제품 카테고리 <span className={LABEL_REQUIRED_STYLES}>*</span></Label>
                      <Select
                        value={form.watch("productCategory")}
                        onValueChange={(value) => {
                          form.setValue("productCategory", value, { shouldValidate: true });
                        }}
                      >
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
                      <Label htmlFor="product-name">제품명 <span className={LABEL_REQUIRED_STYLES}>*</span></Label>
                      <Input id="product-name" placeholder="정확한 제품명 또는 모델명" {...form.register("productName")} className="mt-1" />
                      {form.formState.errors.productName && <p className="text-xs text-red-500 mt-1">{form.formState.errors.productName.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="quantity">수량 <span className={LABEL_REQUIRED_STYLES}>*</span></Label>
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
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-primary-300 dark:hover:file:bg-primary/30"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">도면, 사양서 등 필요한 파일을 첨부할 수 있습니다. (파일당 최대 10MB)</p>

                  {/* 첨부된 파일 목록 */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">첨부된 파일 ({attachedFiles.length}개)</p>
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="items-top flex space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={form.watch("privacy")}
                    onCheckedChange={(checked) => {
                      form.setValue("privacy", checked === true, {
                        shouldValidate: true
                      });
                    }}
                    aria-labelledby="privacy-label"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="privacy"
                      id="privacy-label"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      개인정보 수집 및 이용 동의 <span className={LABEL_REQUIRED_STYLES}>*</span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      견적 문의 처리 목적으로 개인정보(성함, 연락처, 이메일 등)를 수집 및 이용합니다.
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="underline hover:text-primary dark:hover:text-primary-400 ml-1"
                      >
                        개인정보처리방침
                      </button> 전문 보기
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
            "mt-12 lg:col-span-12",
            CARD_STYLES.replace("bg-white/80 dark:bg-gray-900/70", "bg-blue-50/80 dark:bg-blue-900/20"),
            "p-6 border-blue-200 dark:border-blue-900/50"
          )} />

        </div>
      </div>
    </main>
  );
} 