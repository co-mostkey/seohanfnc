// `use client`;

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { Metadata } from 'next'; // Removed type import
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { PageHeading } from '@/components/ui/PageHeading';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
// import { motion } from 'framer-motion'; // Remove direct import
import { AnimatedSection, StaggerWrapper, ResearchAwardItem, ResearchAreaItem, ResearchAchievementItem } from './client-components'; // ResearchAwardItem 추가
import {
  FlaskConical,
  Lightbulb,
  Cpu,
  Recycle,
  ShieldCheck,
  Users,
  CheckCircle,
  Building,
  ExternalLink,
  Award as AwardIcon,
  ChevronRight, // Breadcrumb용
  Search, // 예시 아이콘 (실제 사용될 아이콘으로 교체 필요)
  Zap,    // 예시 아이콘
} from 'lucide-react';
import fs from 'fs/promises'; // 서버 컴포넌트에서 파일 시스템 접근
import path from 'path';       // 경로 조작

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 아이콘 문자열을 실제 컴포넌트로 매핑
const LucideIcons = {
  FlaskConical,
  Lightbulb,
  Cpu,
  Recycle,
  ShieldCheck,
  Users,
  CheckCircle,
  Building,
  ExternalLink,
  AwardIcon,
  Search, // 예시: 실제 데이터에 사용될 아이콘 이름으로 추가
  Zap,    // 예시
  Default: Lightbulb, // 아이콘 이름이 없을 경우 기본 아이콘
};

export const metadata = {
  title: '연구개발 - 서한에프앤씨',
  description: '미래 안전 기술을 선도하는 서한에프앤씨의 R&D 비전, 연구 분야, 혁신 성과를 소개합니다.'
};

// 기존 researchAreas, researchAchievements 상수 삭제

async function getCompanyData() {
  const filePath = path.join(process.cwd(), 'data', 'company.json');
  console.log('[ResearchPage] Attempting to read company data from:', filePath); // 파일 경로 로그 추가
  try {
    const jsonData = await fs.readFile(filePath, 'utf8');
    console.log('[ResearchPage] Successfully read company.json.');
    const data = JSON.parse(jsonData);
    console.log('[ResearchPage] Successfully parsed company.json.');
    return data;
  } catch (error) {
    console.error("[ResearchPage] Error fetching company data from file system:", error);
    return {
      researchPage: {
        hero: {
          title: '연구개발(R&D)',
          subtitle: '혁신적인 기술 개발로 안전의 새로운 기준을 만듭니다',
          backgroundColor: 'transparent',
          backgroundImageUrl: null,
          backgroundOpacity: 1,
          backgroundOverlayColor: null,
        },
        introduction: { title: '기술 혁신을 통한 안전 가치 창조', description: '', imageUrl: '/images/research/rd-vision.jpg' }, // description 배열->문자열 기본값 수정
        areas: { title: '주요 연구 분야', items: [] },
        achievements: { title: '주요 연구 성과', items: [] },
        awardsSectionTitle: '주요 인증 및 특허',
        infrastructure: { title: '첨단 연구 인프라 및 전문 연구팀', description: '', imageUrl: '/images/research/rd-infra.jpg' }, // description 배열->문자열 기본값 수정
      },
      awardsAndCertifications: []
    };
  }
}

// Helper function to resolve image URLs with basePath
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `${basePath}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default async function ResearchPage() {
  const companyData = await getCompanyData();
  const researchPageData = companyData?.researchPage || { /* 기본값들... */ };
  // 위 getCompanyData의 catch 블록에서 기본값을 설정하므로, 여기서는 간단히 처리 가능
  // 또는 여기서도 상세 기본값을 한 번 더 정의할 수 있습니다.

  const heroData = researchPageData.hero || {
    title: '연구개발(R&D)',
    subtitle: '혁신적인 기술 개발로 안전의 새로운 기준을 만듭니다',
    backgroundColor: 'transparent',
    backgroundImageUrl: null,
    backgroundOpacity: 1,
    backgroundOverlayColor: null,
  };

  const breadcrumbItems = [
    { text: '홈', href: resolveImageUrl('/') }, // basePath 적용
    { text: '연구개발', href: resolveImageUrl('/research'), active: true } // basePath 적용
  ];

  const introductionData = researchPageData.introduction || { title: '기술 혁신을 통한 안전 가치 창조', description: [], imageUrl: '/images/research/rd-vision.jpg' };
  const areasData = researchPageData.areas || { title: '주요 연구 분야', items: [] };
  const achievementsData = researchPageData.achievements || { title: '주요 연구 성과', items: [] };
  const awardsSectionTitle = researchPageData.awardsSectionTitle || '주요 인증 및 특허';
  const infrastructureData = researchPageData.infrastructure || { title: '첨단 연구 인프라 및 전문 연구팀', description: [], imageUrl: '/images/research/rd-infra.jpg' };
  const awardsAndCertifications = companyData?.awardsAndCertifications || [];

  console.log('[ResearchPage] Attempting to render awards. awardsAndCertifications content:', JSON.stringify(awardsAndCertifications, null, 2));
  console.log('[ResearchPage] awardsAndCertifications length:', (awardsAndCertifications || []).length);

  const mainStyle = {
    backgroundColor: heroData.backgroundColor || 'transparent',
  };

  const heroBackgroundImageFinalUrl = resolveImageUrl(heroData.backgroundImageUrl);
  const introductionImageFinalUrl = resolveImageUrl(introductionData.imageUrl);
  const infrastructureImageFinalUrl = resolveImageUrl(infrastructureData.imageUrl);

  return (
    <main
      className="relative text-gray-100 bg-transparent"
      style={mainStyle}
    >
      {heroBackgroundImageFinalUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBackgroundImageFinalUrl}
            alt={heroData.title || "연구개발 배경 이미지"} // alt 텍스트 개선
            fill
            className="object-cover"
            style={{ opacity: heroData.backgroundOpacity !== undefined ? heroData.backgroundOpacity : 1 }}
            priority
          />
          {heroData.backgroundOverlayColor && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: heroData.backgroundOverlayColor }}
            />
          )}
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-center md:text-left">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
                <Link
                  // href가 null일 경우 대비
                  href={item.href || '/'}
                  className={cn(
                    "text-sm font-medium",
                    item.active ? "text-primary-400 cursor-default" : "text-gray-300 hover:text-primary-300"
                  )}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mb-12 md:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {heroData.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {heroData.subtitle}
          </p>
        </div>

        <AnimatedSection className="mb-16 md:mb-24 p-8 bg-gray-800/70 rounded-xl shadow-xl backdrop-blur-md border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="prose prose-invert max-w-none text-gray-200">
              <h2 className="text-3xl font-semibold text-primary-300 mb-6">{introductionData.title}</h2>
              {typeof introductionData.description === 'string' && (
                <p className="text-lg leading-relaxed whitespace-pre-line">{introductionData.description}</p>
              )}
            </div>
            {introductionImageFinalUrl &&
              <div className="relative h-72 md:h-96 rounded-lg overflow-hidden shadow-lg group">
                <Image
                  src={introductionImageFinalUrl}
                  alt={introductionData.title || "연구개발 비전 이미지"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
            }
          </div>
        </AnimatedSection>

        {areasData.items && areasData.items.length > 0 && (
          <AnimatedSection className="mb-16 md:mb-24">
            <h2 className="text-3xl font-bold mb-10 text-center text-white">{areasData.title}</h2>
            <StaggerWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {areasData.items.map((area) => (
                <ResearchAreaItem key={area.id || area.title} area={area} />
              ))}
            </StaggerWrapper>
          </AnimatedSection>
        )}

        {achievementsData.items && achievementsData.items.length > 0 && (
          <AnimatedSection className="mb-16 md:mb-24">
            <h2 className="text-3xl font-bold mb-10 text-center text-white">{achievementsData.title}</h2>
            <StaggerWrapper className="space-y-6 max-w-3xl mx-auto">
              {achievementsData.items.map((achievement) => (
                <ResearchAchievementItem key={achievement.id || achievement.title} achievement={achievement} />
              ))}
            </StaggerWrapper>
          </AnimatedSection>
        )}

        {(awardsAndCertifications && awardsAndCertifications.length > 0) ? (
          <AnimatedSection className="mb-16 md:mb-24">
            <h2 className="text-3xl font-bold mb-10 text-center text-white flex items-center justify-center">
              <AwardIcon className="w-8 h-8 mr-3 text-primary-400" />
              {awardsSectionTitle}
            </h2>
            <StaggerWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {awardsAndCertifications.map((award) => {
                console.log('[ResearchPage] Mapping award item for ResearchAwardItem:', JSON.stringify(award, null, 2));
                return <ResearchAwardItem key={award.id || award.title} award={award} />;
              })}
            </StaggerWrapper>
          </AnimatedSection>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>표시할 인증 및 특허 정보가 없습니다.</p>
            <p>(데이터 소스: company.json 최상단 awardsAndCertifications 배열)</p>
            <p>현재 배열 길이: {(awardsAndCertifications || []).length}</p>
          </div>
        )}

        <AnimatedSection className="p-8 bg-gray-800/70 rounded-xl shadow-xl backdrop-blur-md border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {infrastructureImageFinalUrl &&
              <div className="relative h-72 md:h-96 rounded-lg overflow-hidden shadow-lg group order-last md:order-first">
                <Image
                  src={infrastructureImageFinalUrl}
                  alt={infrastructureData.title || "연구 시설 및 팀 이미지"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
            }
            <div className="prose prose-invert max-w-none text-gray-200">
              <h2 className="text-3xl font-semibold text-primary-300 mb-6">{infrastructureData.title}</h2>
              {typeof infrastructureData.description === 'string' && (
                <p className="text-lg leading-relaxed whitespace-pre-line">{infrastructureData.description}</p>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* 하단 여백 */}
        <div className="pb-24 md:pb-32"></div>

      </div>
    </main>
  );
}

