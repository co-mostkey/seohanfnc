import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';
import { HistoryTimeline } from './client-components';
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { Award, BadgeCheck, Building, Globe, Lightbulb, Trophy, Calendar } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: '회사 연혁 - 서한에프앤씨',
  description: '1992년 창업 이래 끊임없는 도전과 혁신으로 성장해 온 서한에프앤씨의 발자취를 소개합니다.'
};

// Provided history data as a multi-line string
const rawHistoryText = `
2018 Year
01    ISO 9001:2015 인증 획득 [Q209412]
09    한국산업은행으로 부터 4차 산업 유망기업인 [KDB-TECH]기업으로 선정
2017 Year
03    [완강기] 및 [간이완강기] 신규 형식승인 취득
03    초동대처 기동형 [인명구조매트] 개발 KFI 인증 취득
05    터키 공기안전매트 수출
10    [충청북도 중소기업 경영대상] 수상 - 충청북도 도지사상
2016 Year
01    충주시 '성실납세자' 3년 연속 선정
02    서울 동국대학교와 산학협력 연구기술 협약 체결
03    연구소기업 '(주) 서한 디앤에스' 설립
04    베트남 경찰국 관공서 공기안전매트 / 이동식 구조대 4차 수출
2015 Year
03    '중소기업청'으로부터 [수출 유망 기업]으로 선정
05    몽골 소방방재청 공기안전매트 / 소방차용 구조대 3차 수출
12    '여성가족부'의 [가족친화 인증기업] 인증
2014 Year
01    고용노동부로부터 '강소기업'으로 선정
06    베트남 경찰국 공기안전매트 3차 수출
11    특허등 산업재산권 4건 추가 등록 (완강기, 공기안전매트, 소화기 등)
2013 Year
01    세계 최초의 기계식 무화약 점화장치를 이용한 자동소화장치 "Safe-g" 개발
08    특허기술을 활용해 기능을 강화한 신형 완강기 개발 -KFI 형식인증취득
2012 Year
01    [미래 창조 과학부]인정 기업부설 "서한 기술 연구소" 설립
03    미국 Anchor Bridge사에 터키 해군용 공기안전매트 수출
2011 Year
10    "중소기업청"으로부터 [이노비즈 기업]으로 선정(기술혁신형 중소기업)
10    "소방방재청" 주관으로부터 [대한민국 안전대상] 우수제품상 수상
2010 Year
03    "한국산업은행"으로부터 [유망중소기업]으로 선정
11    "중국 국가소방장구 질량중심"으로부터 공기안전매트, 구조대 제품인증
2009 Year
06    "소방방재청" 소방산업 육성 및 기여 공로로 소방방재청장상 수상
06    "독일" VETTER사 공기안전매트 및 공기주입식 인명구조막 수출
11    중국 현지법인 개설 (화학 및 소방제품 제조 판매)
2008 Year
05    "러시아" 완강기 수출
10    "중국" 심천 소방국 "공기주입식 인명구조막" 수출
2007 Year
03    "공기주입식 인명구조막" 개발
05    "공기주입식 인명구조막" 특허 취득
11    "중소기업청"으로 부터 [경영혁신형 중소기업]으로 선정
2006 Year
02    "완강기 설치대" KFI 인증 획득
06    "구조대" 베트남 수출
09    "공기안전매트" 터키 수출
11    "공기안전매트" 중국 요녕성 소방국 수출
2005 Year
01    "중국 A&F유한공사"와 현지 합작 판매법인 설립
10    "이란" 국가 소방국에 공기안전매트 수출
12    "홍콩" 소방국에 공기안전매트 수출
2004 Year
02    "중국 국가소방장구질량감찰검사중심"로 부터 완강기 품질인증 획득
07    "중국 A&F유한공사"에 공기안전매트, 완강기 및 소방기구 수출
11    중국 심양 소방국에 공기안전매트 수출
11    중국 대련 소방국에 공기안전매트 수출
11    ISO9001 품질경영시스템 인증 획득
2003 Year
03    "베트남"으로 완강기 및 공기안전매트 수출
2002 Year
10    완강기 및 간이완강기 및 구조대 형식승인 취득
2001 Year
05    "이집트" 및 중동지역에 공기안전매트(팬식) 수출
2000 Year
03    (주) 서한 에프 앤 씨로 법인 전환
1998 Year
08    "서한상사" 공기안전매트 제조 및 판매
`;

// Function to parse the raw text data into structured format
interface HistoryEvent { year: string; month?: string; content: string; icon?: string; }
interface YearData { year: string; events: HistoryEvent[]; }

function parseHistoryData(rawData: string): YearData[] {
  const yearMap: { [year: string]: HistoryEvent[] } = {};
  let currentYear: string | null = null;

  const lines = rawData.trim().split('\n');

  for (const line of lines) {
    const yearMatch = line.match(/^(\d{4})\s+Year$/);
    const eventMatch = line.match(/^\s*(\d{2})\s+(.+)$/);

    if (yearMatch) {
      currentYear = yearMatch[1];
      if (!yearMap[currentYear]) {
        yearMap[currentYear] = [];
      }
    } else if (eventMatch && currentYear) {
      const month = eventMatch[1];
      const content = eventMatch[2].trim();
      // Simple icon mapping based on content keywords
      let icon = 'Calendar'; // Default icon
      if (content.includes('인증') || content.includes('승인') || content.includes('선정')) icon = 'BadgeCheck';
      if (content.includes('수출')) icon = 'Globe';
      if (content.includes('개발') || content.includes('설립') || content.includes('전환')) icon = 'Lightbulb';
      if (content.includes('수상')) icon = 'Trophy';
      if (content.includes('체결')) icon = 'Handshake'; // Added for 협약
      if (content.includes('등록')) icon = 'FileText'; // Added for 특허 등록
      if (content.includes('제조') || content.includes('판매')) icon = 'Package'; // Added for 제조/판매

      yearMap[currentYear].push({ year: currentYear, month: month, content: content, icon: icon });
    }
  }

  // Convert map to array and sort by year descending
  const structuredData: YearData[] = Object.keys(yearMap)
    .sort((a, b) => parseInt(b) - parseInt(a)) // Sort years descending
    .map(year => ({ year: year, events: yearMap[year] }));

  return structuredData;
}

const structuredHistoryData = parseHistoryData(rawHistoryText);

export default function HistoryPage() {
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about` },
    { text: '연혁', href: `${basePath}/about/history`, active: true } // Corrected title
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
              title="연혁"
              subtitle="1992년부터 이어온 서한에프앤씨의 성장과 혁신의 발자취"
            />
          </div>

          {/* Pass the structured data to the client component */}
          <HistoryTimeline historyData={structuredHistoryData} />

        </div>
      </div>
    </main>
  );
}

