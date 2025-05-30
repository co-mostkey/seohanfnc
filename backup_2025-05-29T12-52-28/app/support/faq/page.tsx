import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react'; // Icon for FAQ
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"; // Import Accordion components

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: '자주 묻는 질문 (FAQ) - 서한에프앤씨',
  description: '서한에프앤씨 제품 및 서비스에 대해 자주 묻는 질문과 답변을 확인하세요.'
};

// Mock FAQ Data
const faqData = [
  {
    id: "faq-1",
    question: "공기안전매트 설치는 얼마나 걸리나요?",
    answer: "실린더식 공기안전매트의 경우 고압 공기실린더를 이용하여 약 1분 이내에 신속하게 설치가 완료됩니다. 팬식 공기안전매트는 크기에 따라 다르지만 보통 3~5분 정도 소요됩니다."
  },
  {
    id: "faq-2",
    question: "완강기와 간이완강기의 차이점은 무엇인가요?",
    answer: "완강기는 연속 사용이 가능하며 주로 다중이용시설에 설치됩니다. 간이완강기는 1회용이며 주로 일반 가정이나 소규모 시설에서 사용됩니다. 두 제품 모두 KFI 형식승인을 받은 안전한 제품입니다."
  },
  {
    id: "faq-3",
    question: "제품 카탈로그나 사용 설명서는 어디서 다운로드 받을 수 있나요?",
    answer: "본 웹사이트의 [고객지원 > 자료실] 메뉴 또는 각 제품 상세 페이지 하단의 '다운로드' 섹션에서 관련 자료를 다운로드 받으실 수 있습니다."
  },
  {
    id: "faq-4",
    question: "고체에어로졸 소화기의 장점은 무엇인가요?",
    answer: "고체에어로졸 소화기는 전기 화재에 안전하며, 잔여물이 남지 않아 중요 설비(전기실, 통신실 등) 보호에 효과적입니다. 또한 오존층 파괴 지수가 0인 친환경 소화 약제를 사용합니다."
  },
  {
    id: "faq-5",
    question: "제품 관련 문의 및 접수 절차는 어떻게 되나요?",
    answer: "제품 사용 중 문제가 발생하면 고객센터(전화 또는 이메일)로 연락 주십시오. 증상 확인 후 수리 또는 교체 절차를 안내해 드립니다. 자세한 내용은 [문의] 페이지를 통해 문의해 주시기 바랍니다."
  }
  // Add more FAQs as needed
];

export default function FaqPage() {
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '고객지원', href: `${basePath}/support` },
    { text: '자주 묻는 질문', href: `${basePath}/support/faq`, active: true }
  ];

  return (
    <main className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <Image
          src="/images/patterns/grid-pattern.svg"
          alt="Background Pattern"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        {/* GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 사용 제거 */}
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto"> {/* Limit content width */}
          {/* Breadcrumb & Page Heading */}
          <div className="mb-6">
            <SimpleBreadcrumb items={breadcrumbItems} />
          </div>
          <div className="mb-12 md:mb-16">
            <PageHeading
              title="자주 묻는 질문 (FAQ)"
              subtitle="궁금한 점이 있으신가요? 먼저 확인해보세요."
            />
          </div>

          {/* FAQ Accordion Section */}
          <section>
            {faqData.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqData.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className={cn(
                      "rounded-lg border border-gray-200 dark:border-gray-700/50",
                      "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm",
                      "px-4"
                    )}
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline text-gray-800 dark:text-gray-100">
                      <span className="mr-2 text-primary dark:text-primary-400">Q.</span>{faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-12">등록된 자주 묻는 질문이 없습니다.</p>
            )}
          </section>

        </div>
      </div>
    </main>
  );
} 