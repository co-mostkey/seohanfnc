import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { Lightbulb, CheckCheck, Recycle, Handshake, Scale, Target, Globe, Zap } from 'lucide-react';
import { cn, getImagePath } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: '비전 및 핵심가치 - 서한에프앤씨',
  description: '안전을 넘어 지속 가능한 미래를 향한 서한에프앤씨의 비전과 핵심가치를 소개합니다.'
};

export default function VisionPage() {
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about` },
    { text: '비전 및 핵심가치', href: `${basePath}/about/vision`, active: true }
  ];

  const coreValues = [
    {
      id: 'safety',
      title: '안전 제일',
      description: '모든 활동의 최우선 가치는 사람의 안전입니다.',
      icon: CheckCheck,
      details: [
        '안전 규정 및 표준 준수',
        '철저한 위험성 평가 및 예방',
        '안전 의식 내재화를 위한 교육 강화',
        '안전한 작업 환경 조성'
      ]
    },
    {
      id: 'innovation',
      title: '기술 혁신',
      description: '끊임없는 연구개발로 안전 기술의 미래를 선도합니다.',
      icon: Lightbulb,
      details: [
        '지속적인 R&D 투자 확대',
        '차세대 안전 기술 및 신소재 개발',
        '창의적인 아이디어 발굴 및 사업화',
        '변화를 두려워하지 않는 도전 정신'
      ]
    },
    {
      id: 'customer',
      title: '고객 중심',
      description: '고객의 신뢰와 만족을 최고의 가치로 생각합니다.',
      icon: Handshake,
      details: [
        '고객의 소리에 귀 기울이는 소통',
        '고객의 기대를 뛰어넘는 제품과 서비스',
        '신속하고 정확한 기술 지원',
        '고객과의 장기적인 파트너십 구축'
      ]
    },
    {
      id: 'integrity',
      title: '정직과 신뢰',
      description: '투명하고 윤리적인 경영으로 사회적 책임을 다합니다.',
      icon: Scale,
      details: [
        '법규 및 윤리 규범 준수',
        '공정하고 투명한 업무 처리',
        '정직한 기업 문화 조성',
        '이해관계자와의 신뢰 관계 구축'
      ]
    },
    {
      id: 'sustainability',
      title: '지속가능경영',
      description: '환경과 사회를 생각하며 미래 세대를 위한 가치를 만듭니다.',
      icon: Recycle,
      details: [
        '친환경 제품 개발 및 생산 확대',
        '에너지 효율 개선 및 탄소 배출 감축',
        '자원 재활용 및 폐기물 관리 강화',
        '지역사회 공헌 및 상생 협력'
      ]
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <Image
          src={getImagePath('/images/patterns/grid-pattern.svg')}
          alt="Background Pattern"
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        {/* GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 사용 제거 */}
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="w-full">
          <div className="mb-6">
            <SimpleBreadcrumb items={breadcrumbItems} />
          </div>
          <div className="mb-12 md:mb-16">
            <PageHeading
              title="비전 및 핵심가치"
              subtitle="안전을 넘어 지속 가능한 미래를 향한 서한에프앤씨의 약속"
            />
          </div>

          <section className="mb-16 md:mb-20">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/80 to-blue-600 dark:from-primary/70 dark:to-blue-800 rounded-lg p-8 md:p-12 text-white shadow-xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 opacity-50"></div>
              <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5 opacity-30"></div>

              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <Target className="h-16 w-16 mx-auto mb-6 text-white/80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">OUR VISION</h2>
                <p className="text-xl md:text-2xl font-medium italic mb-8 leading-relaxed opacity-90">
                  &ldquo;글로벌 소방안전 기술을 선도하는<br className="sm:hidden" /> 혁신 기업&rdquo;
                </p>
                <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto opacity-95">
                  서한에프앤씨는 끊임없는 기술 개발과 최고의 품질을 바탕으로, <br className="hidden sm:block" />
                  전 세계 고객에게 가장 신뢰받는 안전 솔루션을 제공하여 <br className="hidden sm:block" />
                  인류의 안전과 행복 증진에 기여하는 것을 목표로 합니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-white/90" />
                    <h3 className="text-base font-semibold mb-1">글로벌 리더십</h3>
                    <p className="text-xs opacity-80">세계적 수준의 기술 경쟁력 확보</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-white/90" />
                    <h3 className="text-base font-semibold mb-1">혁신적 기술</h3>
                    <p className="text-xs opacity-80">미래 안전 트렌드를 이끄는 기술 개발</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors">
                    <Recycle className="h-8 w-8 mx-auto mb-2 text-white/90" />
                    <h3 className="text-base font-semibold mb-1">지속가능 성장</h3>
                    <p className="text-xs opacity-80">환경과 사회적 책임을 다하는 경영</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center text-gray-800 dark:text-gray-200">핵심 가치</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {coreValues.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.id}
                    className={cn(
                      "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                      "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm",
                      "transition-all duration-300 ease-in-out",
                      "hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary dark:text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{value.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{value.description}</p>

                    <ul className="space-y-1.5 text-sm">
                      {value.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <CheckCheck className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 dark:text-gray-400">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}