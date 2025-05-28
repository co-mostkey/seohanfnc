"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Logo3D from '@/components/ui/3D/Logo3D';
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, TrendingUp, Users, Calendar, Trophy, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const AboutPageClient = () => {
  // 현재 활성화된 섹션 상태 관리
  const [activeSection, setActiveSection] = useState('company');

  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about`, active: true }
  ];

  // 회사소개 탭 섹션 정의
  const aboutSections = [
    {
      id: 'greeting',
      title: '인사말',
      description: '서한에프앤씨 대표이사의 인사말씀을 전합니다.',
      icon: Users,
      href: '/about/greeting'
    },
    {
      id: 'vision',
      title: '비전 및 핵심가치',
      description: '우리의 미래 비전과 기업 경영의 핵심 가치를 소개합니다.',
      icon: TrendingUp,
      href: '/about/vision'
    },
    {
      id: 'history',
      title: '연혁',
      description: '1992년부터 이어온 성장과 혁신의 발자취를 확인하세요.',
      icon: Calendar,
      href: '/about/history'
    },
    {
      id: 'awards',
      title: '인증 및 특허',
      description: '보유 기술 인증과 지적 재산권 현황을 안내합니다.',
      icon: Trophy,
      href: '/about/awards'
    },
    {
      id: 'location',
      title: '오시는 길',
      description: '본사 및 공장 위치와 연락처 정보를 안내합니다.',
      icon: MapPin,
      href: '/about/location'
    },
  ];

  // 탭 메뉴 정의
  const tabSections = [
    { id: 'company', title: '회사 소개' },
    { id: 'more', title: '더 알아보기' }
  ];

  return (
    <div className="relative z-10 container mx-auto px-4 pt-8 pb-4 md:pt-12 md:pb-8">
      {/* 개선된 브레드크럼브 - 더 심플하게 */}
      <div className="mb-6 flex items-center text-sm text-gray-400 transition-opacity hover:text-gray-300">
        <Link
          href={breadcrumbItems[0].href}
          className="hover:text-primary-400 transition-colors"
        >
          {breadcrumbItems[0].text}
        </Link>
        <ArrowRight className="h-3 w-3 mx-2 opacity-60" />
        <span className="font-medium text-white">{breadcrumbItems[1].text}</span>
      </div>
      {/* 탭 네비게이션과 타이틀 */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              회사소개
            </h1>
            <p className="text-gray-400 text-base">
              서한에프앤씨의 혁신적인 안전 기술을 소개합니다
            </p>
          </div>

          <div className="flex space-x-3 h-10 mt-2 md:mt-0">
            {tabSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "px-5 py-2 rounded-md font-medium transition-all text-sm md:text-base",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary-500/20"
                    : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/80 hover:text-white"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* 탭 기반 콘텐츠 애니메이션 효과 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
      {/* 회사 소개 탭 콘텐츠 */}
      {activeSection === 'company' && (
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            {/* 3D 로고 영역 */}
            <div className="relative h-80 sm:h-96 md:h-[30rem] rounded-xl overflow-hidden shadow-xl !bg-transparent border-0 backdrop-blur-sm">
              <Logo3D settings={{
                enableRotation: true,
                rotationSpeed: 0.0015,
                modelScale: 1,
                stylePreset: 'default',
                viewerBackgroundType: 'transparent',
              }} />
            </div>

            {/* 텍스트 영역 */}
            <div className="py-4">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-white leading-tight">
                  안전 기술의 미래, <br className="hidden sm:block" /> 서한에프앤씨가 만들어갑니다.
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                    1992년 설립 이래, 서한에프앤씨는 소방안전 및 산업안전 분야의 기술 혁신을 선도하며 고객의 생명과 재산을 보호하는 데 헌신해왔습니다. 최고의 기술력과 품질 경영을 바탕으로 국내를 넘어 세계 시장에서 신뢰받는 기업으로 성장하고 있습니다.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                    공기안전매트, 인명구조기구, 소화장비, 소독장비 등 다양한 제품 라인업을 통해 산업 현장부터 일상 생활 공간까지 안전 솔루션을 제공하며, 끈임없는 연구개발로 더 안전한 사회를 만드는 데 기여하겠습니다.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="flex flex-wrap gap-4 mt-2">
                    <Button
                      className="px-6 py-5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground"
                      asChild
                    >
                      <Link
                        href={`${basePath}/products`}
                        className="flex items-center"
                      >
                        제품 살펴보기 <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      className="px-6 py-5 rounded-md border border-gray-700 bg-gray-800/60 hover:bg-gray-800 text-gray-100 hover:text-white transition-colors"
                      asChild
                    >
                      <Link href={`${basePath}/support/contact`} >문의하기</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 섹션 - 위치 조정하여 리다이렉트 버튼과 겹치지 않도록 함 */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 md:p-8 border border-gray-700/20 shadow-xl relative overflow-hidden mt-8 md:mt-12">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-6 text-center">회사 현황</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 text-center">
                <div className="py-4 px-3 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 transform transition-transform hover:scale-105 hover:shadow-lg hover:border-primary/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">30<span className="text-primary-400">+</span></div>
                  <div className="text-xs md:text-sm text-gray-300 font-medium">업력 (년)</div>
                </div>
                <div className="py-4 px-3 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 transform transition-transform hover:scale-105 hover:shadow-lg hover:border-primary/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">50<span className="text-primary-400">+</span></div>
                  <div className="text-xs md:text-sm text-gray-300 font-medium">특허 및 인증</div>
                </div>
                <div className="py-4 px-3 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 transform transition-transform hover:scale-105 hover:shadow-lg hover:border-primary/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">10<span className="text-primary-400">+</span></div>
                  <div className="text-xs md:text-sm text-gray-300 font-medium">주요 제품군</div>
                </div>
                <div className="py-4 px-3 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 transform transition-transform hover:scale-105 hover:shadow-lg hover:border-primary/20">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">Global</div>
                  <div className="text-xs md:text-sm text-gray-300 font-medium">네트워크</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 더 알아보기 탭 콘텐츠 */}
      {activeSection === 'more' && (
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {aboutSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className={cn(
                    "group block rounded-xl p-6 md:p-8 border border-gray-800/50",
                    "bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-sm",
                    "transition-all duration-300 ease-in-out relative overflow-hidden",
                    "hover:shadow-lg hover:border-primary/40 hover:-translate-y-1",
                    "hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-900"
                  )}
                >
                  {/* 배경 효과 */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl transform translate-x-5 -translate-y-5 group-hover:bg-primary/10 transition-all"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gray-800 group-hover:bg-primary/20 p-3 rounded-full transition-colors">
                        <Icon className="h-6 w-6 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{section.description}</p>

                    {/* 더보기 아이콘 */}
                    <div className="mt-6 flex justify-end">
                      <div className="rounded-full bg-gray-800/70 p-1.5 group-hover:bg-primary/20 transition-colors">
                        <ChevronRight className="h-4 w-4 text-primary-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {/* 하단 여백 */}
      <div className="pb-10 md:pb-10"></div>
    </div>
  );
};
