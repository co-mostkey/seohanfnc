import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';
import { CeoImage } from './client-components';
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { CheckCircle } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: 'CEO 인사말 - 서한에프앤씨',
  description: '서한에프앤씨 대표이사 김대표의 인사말과 회사의 비전, 약속을 전합니다.'
};

export default function GreetingPage() {
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about` },
    { text: '인사말', href: `${basePath}/about/greeting`, active: true }
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
        <div className="w-full">
          {/* Breadcrumb & Page Heading */}
          <div className="mb-6">
            <SimpleBreadcrumb items={breadcrumbItems} />
          </div>
          <div className="mb-12 md:mb-16">
            <PageHeading
              title="인사말"
              subtitle="고객의 안전과 행복을 최우선으로 생각합니다"
            />
          </div>

          {/* Greeting Section */}
          <section className="mb-16 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* CEO Image */}
              <div className="lg:col-span-1 relative flex justify-center lg:justify-start">
                <div className="relative w-full max-w-xs lg:max-w-none aspect-[3/4] rounded-lg overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
                  <Image
                    src="/images/about/ceo-placeholder.jpg"
                    alt="서한에프앤씨 대표이사 김대표"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 80vw, 30vw"
                  />
                </div>
              </div>

              {/* Greeting Text */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700/50">
                  <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
                    서한에프앤씨 홈페이지를 방문해주신 모든 분들께
                  </h2>

                  <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                    <p>
                      안녕하십니까, 서한에프앤씨 대표이사 <strong className="font-semibold">김대표</strong>입니다.
                      <br />
                      저희 홈페이지를 찾아주신 여러분께 진심으로 감사의 말씀을 드립니다.
                    </p>
                    <p>
                      1992년 설립 이래, 서한에프앤씨는 오직 '안전'이라는 가치를 최우선으로 생각하며 소방안전 및 산업안전 분야의 기술 혁신을 위해 끊임없이 노력해왔습니다. 30여 년간 축적된 기술력과 노하우는 고객 여러분의 생명과 재산을 보호하는 가장 든든한 기반이 되고 있습니다.
                    </p>
                    <p>
                      우리는 급변하는 시대적 요구에 발맞추어, 첨단 기술을 접목한 스마트 안전 솔루션 개발과 친환경 제품 라인업 확대를 통해 지속 가능한 성장을 추구하고 있습니다. 국내 시장을 넘어 세계 시장에서도 인정받는 글로벌 강소기업으로 도약하기 위해 임직원 모두가 최선을 다하고 있습니다.
                    </p>
                    <p>
                      서한에프앤씨는 앞으로도 <strong className="font-semibold text-primary dark:text-primary-400">'최고의 기술로 가장 안전한 사회를 만든다'</strong>는 신념 아래, 끊임없는 도전과 혁신으로 고객 여러분의 기대에 부응할 것을 약속드립니다.
                      항상 고객의 목소리에 귀 기울이며, 신뢰할 수 있는 제품과 서비스로 보답하겠습니다.
                    </p>
                    <p>
                      여러분의 가정과 일터에 늘 안전과 행복이 함께 하시기를 기원합니다.
                      <br />
                      감사합니다.
                    </p>
                  </div>

                  <div className="mt-10 text-right border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">서한에프앤씨 대표이사</p>
                    <p className="text-lg md:text-xl font-bold mt-1 text-gray-900 dark:text-white">김 대 표</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Vision/Promise Section - Refined */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-gray-200">서한에프앤씨의 약속</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50 text-center">
                <CheckCircle className="h-10 w-10 text-primary dark:text-primary-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">최고 품질</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  엄격한 품질 관리를 통해 가장 신뢰할 수 있는 제품만을 제공합니다.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50 text-center">
                <CheckCircle className="h-10 w-10 text-primary dark:text-primary-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">기술 혁신</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  끊임없는 연구개발로 더 안전하고 편리한 솔루션을 만들어갑니다.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50 text-center">
                <CheckCircle className="h-10 w-10 text-primary dark:text-primary-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">고객 만족</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  고객의 목소리에 귀 기울이며 최상의 서비스로 보답하겠습니다.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

