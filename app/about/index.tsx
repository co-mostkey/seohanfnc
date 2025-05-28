import React from 'react';
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: '회사소개 - 서한에프앤씨',
  description: '서한에프앤씨는 1992년 설립 이래 혁신적인 복합소재 제품을 개발해온 전문 기업입니다.'
};

export default function AboutPage() {
  // Breadcrumb items
  const breadcrumbItems = [
    { text: '홈', href: '/' },
    { text: '회사소개', href: '/about', active: true }
  ];

  // About sections with links
  const aboutSections = [
    {
      title: '회사 연혁',
      description: '1992년 설립 이래 서한에프앤씨가 걸어온 도전과 혁신의 역사를 살펴보세요.',
      icon: '📜',
      href: '/about/history'
    },
    {
      title: '비전 및 핵심가치',
      description: '글로벌 시장을 선도하는 첨단 복합소재 전문기업으로서의 비전과 핵심가치를 소개합니다.',
      icon: '🔭',
      href: '/about/vision'
    },
    {
      title: '조직도',
      description: '서한에프앤씨의 효율적인 조직 구조와 각 부서별 역할을 확인하세요.',
      icon: '🏢',
      href: '/about/organization'
    },
    {
      title: '인증 및 특허',
      description: '국내외 다양한 인증과 기술 혁신의 결과물인 특허 정보를 확인하세요.',
      icon: '🏆',
      href: '/about/certifications'
    }
  ];

  // Company metrics
  const companyMetrics = [
    { label: '설립연도', value: '1992', icon: '📅' },
    { label: '임직원 수', value: '200+', icon: '👥' },
    { label: '수출국가', value: '15개국', icon: '🌏' },
    { label: '특허보유', value: '30+', icon: '📝' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <SimpleBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="mb-12">
        <PageHeading
          title="회사소개"
          subtitle="1992년 설립 이래, 지속적인 혁신과 도전의 역사"
        />
      </div>
      {/* Company Overview Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">서한에프앤씨 소개</h2>
          <div className="h-1 w-20 bg-blue-500 mb-6"></div>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              서한에프앤씨는 1992년 설립 이래 30년 이상의 역사를 가진 복합소재 전문 기업으로,
              고품질의 복합소재 제품 개발 및 생산을 통해 국내외 시장에서 신뢰받는 기업으로 성장해 왔습니다.
            </p>
            <p>
              우리는 자동차, 조선, 항공, 산업기계 등 다양한 산업 분야에 필요한 맞춤형 복합소재 솔루션을
              제공하며, 지속적인 연구개발과 기술 혁신을 통해 산업의 미래를 선도하고 있습니다.
            </p>
            <p>
              최고 품질의 제품, 신뢰할 수 있는 서비스, 환경친화적인 생산 방식을 통해
              고객의 성공과 지속 가능한 미래에 기여하는 것이 서한에프앤씨의 약속입니다.
            </p>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="aspect-video rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500 text-center p-4">
              <span className="text-4xl block mb-2">🏭</span>
              <span>회사 전경 이미지</span>
            </div>
          </div>
        </div>
      </div>
      {/* Company Metrics */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">서한에프앤씨 현황</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {companyMetrics.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl text-blue-500 mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{metric.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Core Business Areas */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">주요 사업 분야</h2>
        <p className="text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-10">
          서한에프앤씨는 다양한 산업 분야에 필요한 고품질 복합소재 솔루션을 제공합니다.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
            <div className="text-3xl text-blue-500 mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">자동차 부품</h3>
            <p className="text-gray-600 dark:text-gray-300">
              내구성과 경량화를 겸비한 자동차용 복합소재 부품을 개발하여
              연비 향상과 안전성 증대에 기여합니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
            <div className="text-3xl text-blue-500 mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">전기전자 부품</h3>
            <p className="text-gray-600 dark:text-gray-300">
              전자기기에 필요한 정밀 부품과 절연 소재를 제공하여
              전자 산업의 안정성과 효율성을 높입니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm">
            <div className="text-3xl text-blue-500 mb-4">🏭</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">산업기계 부품</h3>
            <p className="text-gray-600 dark:text-gray-300">
              고강도, 내마모성을 갖춘 산업기계용 부품으로
              생산 설비의 수명과 성능을 향상시킵니다.
            </p>
          </div>
        </div>
      </div>
      {/* About Navigation Sections */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">더 알아보기</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {aboutSections.map((section, index) => (
            <Link href={section.href} key={index} >
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm h-full transform transition duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="text-3xl text-blue-500 mr-4">{section.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>
                <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Global Network */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">글로벌 네트워크</h2>
        <p className="text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
          서한에프앤씨는 세계 각국의 파트너와 협력하여 글로벌 시장에서 인정받는 제품을 공급하고 있습니다.
        </p>

        <div className="aspect-[16/9] max-w-4xl mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500 text-center p-4">
            <span className="text-4xl block mb-2">🗺️</span>
            <span>글로벌 네트워크 지도</span>
          </div>
        </div>
      </div>
    </div>
  );
} 