import React from 'react';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';

export const metadata = {
  title: '기업소개 - 서한에프앤씨',
  description: '서한에프앤씨의 기업 개요, 경영 철학, 사업 영역을 소개합니다.'
};

const CompanyPage = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { text: '홈', href: '/' },
    { text: '회사소개', href: '/about' },
    { text: '기업소개', href: '/about/company', active: true }
  ];

  // Company information
  const companyInfo = {
    name: '주식회사 서한에프앤씨',
    established: '1992년 5월',
    ceo: '김대표',
    employees: '250여 명',
    business: '복합소재 부품 제조 및 개발',
    address: '경상남도 창원시 마산회원구 자유무역2길 31',
    tel: '055-123-4567',
    fax: '055-123-4568',
    email: 'info@seohanfnc.com'
  };

  // Business areas
  const businessAreas = [
    {
      title: '자동차 부품',
      description: '경량화와 내구성을 갖춘 자동차용 복합소재 부품 개발 및 생산',
      details: [
        '차체 경량화를 위한 구조 부품',
        '외장 및 내장 트림 부품',
        '엔진룸 부품',
        '전기차 배터리 케이스 및 관련 부품'
      ],
      icon: '🚗'
    },
    {
      title: '건축자재',
      description: '친환경적이고 내화성이 뛰어난 건축용 복합소재 개발 및 공급',
      details: [
        '외장 패널 및 장식재',
        '단열재 및 방음재',
        '화재 저항성 구조재',
        '경량 지붕재 및 천장재'
      ],
      icon: '🏗️'
    },
    {
      title: '산업용 소재',
      description: '다양한 산업 분야에 활용되는 고기능성 복합소재 개발 및 생산',
      details: [
        '고강도 구조 부품',
        '내화학성 소재',
        '전자기기 하우징',
        '특수 목적 엔지니어링 플라스틱'
      ],
      icon: '🏭'
    },
    {
      title: '환경 솔루션',
      description: '친환경 소재 및 재활용 기술을 활용한 환경 솔루션 개발',
      details: [
        '재활용 복합소재 개발',
        '바이오 기반 소재',
        '탄소 저감 제품',
        '친환경 생산 공정'
      ],
      icon: '♻️'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <SimpleBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="mb-12">
        <PageHeading
          title="기업소개"
          subtitle="복합소재 기술로 새로운 가치를 창출하는 글로벌 전문기업"
        />
      </div>

      {/* Company Overview */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              회사 개요
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              서한에프앤씨는 1992년 설립 이래, 복합소재 분야에서 끊임없는 혁신과 기술 개발로
              국내외 시장에서 신뢰받는 기업으로 성장해왔습니다. 고급 엔지니어링 플라스틱과
              탄소섬유, 유리섬유 강화 복합소재를 활용한 다양한 제품을 개발 및 생산하고 있습니다.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              자동차 부품, 건축자재, 산업용 소재 등 다양한 분야에 고품질의 복합소재 제품을
              공급함으로써 고객사의 경쟁력 강화에 기여하고 있으며, 지속 가능한 미래를 위한
              친환경 소재 개발에도 앞장서고 있습니다.
            </p>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
              회사 전경 이미지
            </div>
          </div>
        </div>
      </section>

      {/* Management Philosophy */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">
          경영 철학
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">
              ⭐
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
              고객 중심
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              고객의 요구와 기대를 넘어서는 가치를 제공함으로써 고객과 함께 성장합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
              품질 우선
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              엄격한 품질 관리와 지속적인 개선을 통해 최고 품질의 제품과 서비스를 제공합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">
              🌱
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
              지속 가능성
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              환경과 사회적 책임을 다하며 지속 가능한 미래를 위한 기술과 솔루션을 개발합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Company Information Table */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200">
          기업 정보
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50 w-1/4">회사명</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.name}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">설립일</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.established}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">대표이사</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.ceo}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">임직원수</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.employees}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">주요사업</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.business}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">본사주소</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.address}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">대표전화</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.tel}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">팩스</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.fax}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800/50">이메일</th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{companyInfo.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Business Areas */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">
          사업 영역
        </h2>
        <div className="space-y-10">
          {businessAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-blue-50 dark:bg-blue-900/10 p-8 flex flex-col justify-center">
                  <div className="text-5xl mb-4 text-center">{area.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {area.description}
                  </p>
                </div>
                <div className="md:w-2/3 p-8">
                  <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                    주요 제품 및 서비스
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {area.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                        <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Organization Structure */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">
          조직 구성
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-6">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
              조직도 이미지
            </div>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              서한에프앤씨는 경영지원, 연구개발, 생산, 품질관리, 영업/마케팅 등 체계적인 조직 구성을
              통해 효율적인 업무 수행과 고객 만족을 실현하고 있습니다.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              각 부서는 전문성을 바탕으로 유기적으로 협력하며, 지속적인 혁신과 품질 향상을 위해
              노력하고 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">
          인증 현황
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">인증 로고</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-gray-200">
              ISO 9001
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              품질경영시스템
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">인증 로고</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-gray-200">
              ISO 14001
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              환경경영시스템
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">인증 로고</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-gray-200">
              IATF 16949
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              자동차품질경영시스템
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">인증 로고</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center text-gray-800 dark:text-gray-200">
              ISO 45001
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              안전보건경영시스템
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="/about/certifications"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            인증 및 특허 더 보기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </section>

      {/* Global Network */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">
          글로벌 네트워크
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-6">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
              글로벌 네트워크 지도
            </div>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-300">
              서한에프앤씨는 한국 본사를 중심으로 중국, 미국, 유럽 등 글로벌 시장에 진출하여
              다양한 고객사와 협력 관계를 구축하고 있습니다. 전 세계 15개국 이상의 파트너십을 통해
              혁신적인 복합소재 솔루션을 제공하고 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage; 