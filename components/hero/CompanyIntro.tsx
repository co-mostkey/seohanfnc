import React from 'react';
import { type CompanyInfo, type CoreValueItem, type AwardItem } from '@/types/company';
import { Award, Building, CheckCircle, Cpu, FlaskConical, Lightbulb, Recycle, ShieldCheck, Users, Zap, Target, Gem, Handshake, TrendingUp, Landmark, History, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Lucide 아이콘 이름과 실제 컴포넌트를 매핑하는 객체
const LucideIcons: { [key: string]: React.ElementType } = {
  Award,
  Building,
  CheckCircle,
  Cpu,
  FlaskConical,
  Lightbulb,
  Recycle,
  ShieldCheck,
  Users,
  Zap,
  Target,
  Gem,
  Handshake,
  TrendingUp,
  Landmark,
  History,
  Sparkles,
  ImageIcon
  // 필요에 따라 더 많은 아이콘 추가
};

// Icon 컴포넌트의 타입을 더 구체적으로 정의
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface CompanyIntroProps {
  companyData: CompanyInfo | null;
  isLoading: boolean;
}

const SectionTitle: React.FC<{ title: string; icon?: IconComponent }> = ({ title, icon: Icon }) => (
  <div className="flex items-center mb-3 md:mb-4">
    {Icon && <Icon className="w-6 h-6 mr-3 text-primary-400" />}
    <h3 className="text-xl md:text-2xl font-semibold text-white">{title}</h3>
  </div>
);

const CoreValueCard: React.FC<{ item: CoreValueItem }> = ({ item }) => {
  const IconComponent = (item.icon && LucideIcons[item.icon] ? LucideIcons[item.icon] : Sparkles) as IconComponent;
  return (
    <div className="bg-gray-800/60 p-4 rounded-lg shadow-md h-full flex flex-col border border-gray-700/50">
      <div className="flex items-center mb-2">
        <IconComponent className="w-7 h-7 mr-3 text-primary-400 flex-shrink-0" />
        <div>
          {item.mainTitle && <h4 className="text-lg font-semibold text-white">{item.mainTitle}</h4>}
          {item.subTitle && <p className="text-xs text-gray-400 -mt-1">{item.subTitle}</p>}
        </div>
      </div>
      {item.description && <p className="text-sm text-gray-300 whitespace-pre-wrap flex-grow">{item.description}</p>}
    </div>
  );
};

// 인증/수상 아이템 표시 컴포넌트 (CertPatentBox.tsx 참고하여 간략화)
const AwardIntroItem: React.FC<{ item: AwardItem }> = ({ item }) => {
  const imagePath = item.imageUrl
    ? (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http') ? item.imageUrl : `${basePath}/${item.imageUrl}`)
    : `${basePath}/images/placeholder-a4.png`;
  const displayTitle = item.title || '인증/수상명 없음';

  return (
    <div className="bg-gray-800/60 p-3 rounded-lg shadow-md border border-gray-700/50 transition-all hover:shadow-primary-500/20 group">
      <div className="relative w-full aspect-[210/297] bg-gray-700/30 rounded overflow-hidden mb-2">
        <Image
          src={imagePath.startsWith('http') ? imagePath : (imagePath.startsWith('/') ? imagePath : `${basePath}${imagePath}`)}
          alt={displayTitle}
          fill
          className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 ease-in-out"
          unoptimized={imagePath.startsWith('http')}
          onError={(e) => { e.currentTarget.src = `${basePath}/images/placeholder-a4.png`; }}
        />
      </div>
      <div className="text-center w-full">
        <p className="text-xs font-semibold text-primary-300 truncate w-full" title={displayTitle}>{displayTitle}</p>
        {item.year && <p className="text-[10px] text-gray-400 mt-0.5">{item.year}</p>}
        {item.issuingOrganization && <p className="text-[10px] text-gray-500 truncate w-full" title={item.issuingOrganization}>{item.issuingOrganization}</p>}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:text-blue-300 hover:underline mt-1 inline-flex items-center transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            자세히 <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function CompanyIntro({ companyData, isLoading }: CompanyIntroProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl p-4">
        <div className="animate-pulse space-y-6 w-full">
          <div className="h-8 bg-gray-700/50 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          </div>
          <div className="h-8 bg-gray-700/50 rounded w-1/4 mt-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-700/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl p-4">
        <p className="text-white">회사 정보를 불러오는 중이거나, 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { vision, philosophyStatement, coreValues, businessType, history, intro, philosophy, awardsAndCertifications } = companyData;

  const ceoGreeting = [intro, philosophy].filter(Boolean).join('\n\n');

  // 표시할 인증/수상 항목 (최대 4개)
  const displayAwards = awardsAndCertifications?.filter(item => item.imageUrl && item.title).slice(0, 4) || [];

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-xl p-6 md:p-8 text-white overflow-y-auto hide-scrollbar flex flex-col gap-8 md:gap-10">
      {ceoGreeting && (
        <section>
          <SectionTitle title="CEO 인사말" icon={Landmark} />
          <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">{ceoGreeting}</p>
        </section>
      )}

      {vision && (
        <section>
          <SectionTitle title="비전" icon={Target} />
          <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">{vision}</p>
        </section>
      )}

      {philosophyStatement && (
        <section>
          <SectionTitle title="경영철학" icon={Gem} />
          <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">{philosophyStatement}</p>
        </section>
      )}

      {(coreValues && Array.isArray(coreValues) && coreValues.length > 0) && (
        <section>
          <SectionTitle title="핵심가치" icon={Sparkles} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {coreValues.map((value) => (
              <CoreValueCard key={value.id} item={value} />
            ))}
          </div>
        </section>
      )}

      {businessType && (
        <section>
          <SectionTitle title="주요사업" icon={TrendingUp} />
          <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">{businessType}</p>
        </section>
      )}

      {history && (
        <section>
          <SectionTitle title="주요연혁" icon={History} />
          <p className="text-gray-300 whitespace-pre-wrap text-sm md:text-base leading-relaxed">{history}</p>
        </section>
      )}

      {displayAwards.length > 0 && (
        <section>
          <SectionTitle title="주요 인증 및 수상" icon={Award} />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayAwards.map((award) => (
              <AwardIntroItem key={award.id} item={award} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 