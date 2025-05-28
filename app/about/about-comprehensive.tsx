"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Building, TrendingUp, Users, Calendar, Trophy, MapPin,
    ArrowRight, Briefcase, ChevronRight, Target, CheckCheck,
    Lightbulb, Handshake, Scale, Recycle, Globe, Zap,
    Award, BadgeCheck, FileText, Package, Check, Phone, Mail,
    Sparkles,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo3D from '@/components/ui/3D/Logo3D';
import HistoryTimeline from '@/components/admin/HistoryTimeline';
import { CompanyInfo, CoreValueItem as CompanyCoreValueItem } from '@/types/company';

const LucideIcons: { [key: string]: React.FC<LucideProps> } = {
    Building,
    TrendingUp,
    Users,
    Calendar,
    Trophy,
    MapPin,
    ArrowRight,
    Briefcase,
    ChevronRight,
    Target,
    CheckCheck,
    Lightbulb,
    Handshake,
    Scale,
    Recycle,
    Globe,
    Zap,
    Award,
    BadgeCheck,
    FileText,
    Package,
    Check,
    Phone,
    Mail,
    Sparkles,
};

function formatText(text: string | undefined, companyName: string | undefined, allowHtml: true): { __html: string };
function formatText(text: string | undefined, companyName: string | undefined, allowHtml?: false | undefined): string;
function formatText(text: string | undefined, companyName: string | undefined, allowHtml: boolean = false): any {
    if (!text) {
        return allowHtml ? { __html: '' } : '';
    }
    const replacedText = text.replace(/{nameKo}/g, companyName || '');
    if (allowHtml) {
        return { __html: replacedText };
    }
    return replacedText;
}

interface CoreValueItem extends CompanyCoreValueItem {
};

export const AboutComprehensive = () => {
    const breadcrumbItems = [
        { text: '홈', href: '/' },
        { text: '회사소개', href: '/about', active: true }
    ];

    const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyData = async (retries = 3) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

            try {
                const res = await fetch('/api/admin/company', {
                    signal: controller.signal,
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    setCompanyData(data);
                } else {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                console.error('Error fetching company data for about page:', error);

                if (retries > 0 && !controller.signal.aborted) {
                    console.log(`Retrying... ${retries} attempts remaining`);
                    setTimeout(() => fetchCompanyData(retries - 1), 1000 * (4 - retries));
                    return;
                }

                // 최종 실패 시 빈 데이터로 설정하여 페이지가 렌더링되도록 함
                setCompanyData({
                    id: "default",
                    nameKo: "서한에프앤씨",
                    nameEn: "Seohan F&C",
                    addressKo: "서울특별시 강남구",
                    description: "1992년 설립 이래, 최고의 기술력과 품질로 고객의 안전을 책임지는 소방안전 전문기업입니다.",
                    established: "1992년",
                    CEO: "이정훈",
                    businessNumber: "123-45-67890",
                    phone: "02-1234-5678",
                    email: "info@seohanfc.com",
                    intro: "안전을 위한 끊임없는 연구개발과 혁신으로 고객의 생명과 재산을 보호합니다.",
                    philosophy: "최고의 품질과 서비스로 고객 만족을 실현합니다.",
                    vision: "소방안전 분야의 선도기업으로서 사회 안전에 기여하겠습니다.",
                    businessType: "소방안전장비 제조 및 판매\n완강기 및 인명구조장비\n소방시설 점검 및 유지보수",
                    history: "1992: 서한에프앤씨 설립\n2000: 기술연구소 개설\n2010: ISO 9001 품질인증 취득\n2020: 신제품 개발 및 특허 등록",
                    showAboutIntroSection: true,
                    aboutPageMainTitleFormat: "[회사명] 소개",
                    aboutPageSectionTitleFormat: "[회사명] 소개",
                    coreValues: []
                });
            } finally {
                setLoading(false);
            }
        };

        // 초기 로딩 지연 추가 (서버 시작 대기)
        setTimeout(() => {
            fetchCompanyData();
        }, 500);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!companyData) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <p className="text-red-500">회사 정보를 불러오는데 실패했습니다.</p>
            </div>
        );
    }

    const HeroSection = () => (
        <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 md:py-32 overflow-hidden">
            {companyData.aboutPageHeroImageUrl && (
                <Image
                    src={companyData.aboutPageHeroImageUrl}
                    alt={`${companyData.nameKo || '회사'} 소개 히어로 배경`}
                    fill
                    className="object-cover opacity-30"
                    priority
                />
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <nav aria-label="Breadcrumb" className="mb-8 text-center">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        {breadcrumbItems.map((item, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
                                <Link
                                    href={item.href}
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
                <h1
                    className={cn(
                        "text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight tracking-tight",
                        companyData.aboutPageMainTitleClassName || "text-primary-500"
                    )}
                    dangerouslySetInnerHTML={formatText(companyData.aboutPageMainTitleFormat, companyData.nameKo, true) as { __html: string }}
                />
                {companyData.description && (
                    <p className="text-lg md:text-xl text-gray-300 text-center max-w-3xl mx-auto whitespace-pre-wrap">
                        {formatText(companyData.description, companyData.nameKo) as string}
                    </p>
                )}
            </div>
        </section>
    );

    const IntroSection = () => (
        companyData.showAboutIntroSection && (
            (() => {
                const titleObject = formatText(companyData.aboutPageSectionTitleFormat, companyData.nameKo, true);
                const titleString = typeof titleObject === 'object' && titleObject.__html ? titleObject.__html : '';
                return (
                    <Section title={titleString} description="">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6 text-gray-300">
                                {companyData.intro && (
                                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                        {formatText(companyData.intro, companyData.nameKo) as string}
                                    </p>
                                )}
                                {companyData.philosophy && (
                                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                        {formatText(companyData.philosophy, companyData.nameKo) as string}
                                    </p>
                                )}
                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <InfoItem icon={<Building className="w-6 h-6 text-primary-400" />} label="회사명" value={companyData.nameKo} />
                                    <InfoItem icon={<Calendar className="w-6 h-6 text-primary-400" />} label="설립일" value={companyData.established} />
                                    <InfoItem icon={<Users className="w-6 h-6 text-primary-400" />} label="대표이사" value={companyData.CEO} />
                                    <InfoItem icon={<Briefcase className="w-6 h-6 text-primary-400" />} label="사업자번호" value={companyData.businessNumber} />
                                    <InfoItem icon={<Phone className="w-6 h-6 text-primary-400" />} label="대표전화" value={companyData.phone} />
                                    <InfoItem icon={<Mail className="w-6 h-6 text-primary-400" />} label="이메일" value={companyData.email} />
                                </div>
                            </div>
                            <div className={cn(
                                "relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl group flex items-center justify-center",
                                (companyData.aboutPageVisualUrl || !companyData.logo3dSettings) && [
                                    "bg-gray-800/50",
                                    "border border-gray-700/50"
                                ]
                            )}>
                                {companyData.aboutPageVisualUrl ? (
                                    <Image
                                        src={companyData.aboutPageVisualUrl}
                                        alt={`${companyData.nameKo || '회사'} 대표 이미지`}
                                        fill
                                        className="object-contain transition-transform duration-500 group-hover:scale-105 p-4"
                                    />
                                ) : companyData.logo3dSettings && (
                                    <Logo3D settings={companyData.logo3dSettings} />
                                )}
                            </div>
                        </div>
                    </Section>
                );
            })()
        )
    );

    const VisionSection = () => (
        companyData.vision && (
            <Section title="우리의 비전" description="서한에프앤씨가 꿈꾸는 미래입니다.">
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                    <blockquote className="relative text-xl md:text-2xl leading-relaxed text-gray-200 italic border-l-4 border-primary-500 pl-6">
                        <p className="whitespace-pre-wrap">
                            {formatText(companyData.vision, companyData.nameKo) as string}
                        </p>
                    </blockquote>
                </div>
            </Section>
        )
    );

    const PhilosophySection = () => (
        companyData.philosophyStatement && (
            <Section title="경영 철학" description="우리의 사업을 이끄는 핵심 원칙입니다.">
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                    <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                        {formatText(companyData.philosophyStatement, companyData.nameKo) as string}
                    </p>
                </div>
            </Section>
        )
    );

    const CoreValuesSection = () => {
        const coreValuesData = companyData.coreValues;
        if (!coreValuesData || coreValuesData.length === 0) return null;

        return (
            <Section title="핵심 가치" description="우리의 모든 행동과 결정의 기준이 되는 가치입니다.">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coreValuesData.map((value) => {
                        const IconComponent = value.icon && LucideIcons[value.icon] ? LucideIcons[value.icon] : Sparkles;
                        return (
                            <div key={value.id} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-primary-500/30 transition-shadow duration-300 border border-gray-700 hover:border-primary-500/50">
                                <div className="flex items-center mb-4">
                                    <IconComponent className="w-8 h-8 text-primary-400 mr-4 flex-shrink-0" />
                                    <h3 className="text-xl font-semibold text-white">{value.mainTitle}</h3>
                                </div>
                                {value.subTitle && (
                                    <p className="text-md text-gray-400 mb-3 -mt-2 ml-12 italic">{value.subTitle}</p>
                                )}
                                <div className="text-gray-300 space-y-2 text-sm whitespace-pre-wrap leading-relaxed">
                                    {value.description}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Section>
        );
    };

    const BusinessAreasSection = () => {
        if (!companyData.businessType) return null;
        const businessLines = companyData.businessType.split('\n').filter(line => line.trim() !== '');

        return (
            <Section title="주요 사업 영역" description="우리가 제공하는 핵심 서비스와 솔루션입니다.">
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                    <ul className="space-y-4">
                        {businessLines.map((line, index) => {
                            const isMainCategory = !line.startsWith('    ') && !line.startsWith('  - ');
                            return (
                                <li key={index} className={`flex items-start ${isMainCategory ? 'font-semibold text-lg text-primary-300' : 'ml-6 text-gray-300'}`}>
                                    {isMainCategory ? <Briefcase className="w-5 h-5 mr-3 mt-1 text-primary-400 flex-shrink-0" /> : <Check className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />}
                                    <span className="whitespace-pre-wrap">{line.trim()}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Section>
        );
    };

    const HistorySection = () => {
        if (!companyData || !companyData.history) {
            return (
                <Section title="주요 연혁" description="회사가 걸어온 길입니다.">
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="mx-auto h-12 w-12 mb-4" />
                        <p>연혁 정보가 준비 중입니다.</p>
                    </div>
                </Section>
            );
        }

        // 기본 스타일 설정
        const defaultHistoryStyles = {
            colorScheme: 'default' as const,
            timelineStyle: 'modern' as const,
            showIcons: true,
            showDates: true,
            compactMode: false
        };

        // 저장된 스타일이 있으면 사용, 없으면 기본값 사용
        const historyStyles = companyData.historyStyles || defaultHistoryStyles;

        return (
            <Section title="주요 연혁" description="회사가 걸어온 길입니다.">
                <div className="mt-8">
                    <HistoryTimeline
                        historyText={companyData.history}
                        customStyles={historyStyles}
                    />
                </div>
            </Section>
        );
    };

    const AwardsSection = () => {
        const awardsData = companyData.awardsAndCertifications;

        if (!awardsData || awardsData.length === 0) {
            return null;
        }

        return (
            <Section title="인증 및 수상" description="우리의 기술력과 신뢰성을 입증하는 성과입니다.">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {awardsData.map((award) => (
                        <div key={award.id || award.title} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-primary-500/50 transition-all duration-300 flex flex-col items-center p-4 text-center hover:shadow-primary-500/20">
                            {award.imageUrl && (
                                <div className="relative w-full aspect-[3/4] mb-4 rounded-md overflow-hidden bg-gray-700/50 flex items-center justify-center p-1">
                                    <Image
                                        src={award.imageUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${award.imageUrl}` : award.imageUrl}
                                        alt={award.title || '인증서 이미지'}
                                        fill
                                        className="object-contain"
                                        unoptimized={award.imageUrl.startsWith('http')}
                                        onError={(e) => { (e.target as HTMLImageElement).src = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/placeholder-a4.png`; }}
                                    />
                                </div>
                            )}
                            <h4 className="text-md font-semibold text-white mb-1 leading-tight flex-grow">{award.title}</h4>
                            {award.year && <p className="text-xs text-gray-400">{award.year}</p>}
                            {award.issuingOrganization && <p className="text-xs text-gray-500 mt-0.5">{award.issuingOrganization}</p>}
                            {award.link && (
                                <a href={award.link} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-primary-400 hover:text-primary-300 hover:underline inline-flex items-center">
                                    자세히 보기 <ArrowRight className="w-3 h-3 ml-1" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </Section>
        );
    };

    return (
        <div className="bg-gray-850 text-gray-200">
            <HeroSection />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24 pb-24 md:pb-32">
                <IntroSection />
                <VisionSection />
                <PhilosophySection />
                <CoreValuesSection />
                <BusinessAreasSection />
                <HistorySection />
                <AwardsSection />
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value, className }: { icon: React.ReactNode, label: string, value?: string, className?: string }) => (
    <div className={cn("flex items-start", className)}>
        <div className="flex-shrink-0 mr-3 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-md font-semibold text-white">{value || 'N/A'}</p>
        </div>
    </div>
);

interface SectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, description, children }) => (
    <section className="scroll-mt-20" id={title.toLowerCase().replace(/\s+/g, '-')}>
        <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight" dangerouslySetInnerHTML={{ __html: title }}></h2>
            {description && <p className="text-lg text-gray-400 max-w-2xl mx-auto">{description}</p>}
        </div>
        {children}
    </section>
);

export default AboutComprehensive; 