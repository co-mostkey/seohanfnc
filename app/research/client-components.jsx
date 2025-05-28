'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Cpu, Recycle, ShieldCheck, FlaskConical, Lightbulb as DefaultIcon, Award as AwardIcon, CalendarDays, Building, Award as AwardIconItself } from 'lucide-react';

// Simple Fade-in Animation Wrapper Component
export const AnimatedSection = ({ children, className, delay = 0 }) => {
  // Simplified fade-in animation
  const simpleFadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut", delay: delay } // Adjust duration if needed
  };

  return (
    <motion.section
      className={className}
      variants={simpleFadeIn} // Use the simplified variant
      initial="initial"
      animate="animate" // Animate on load
    >
      {children}
    </motion.section>
  );
};

// Wrapper for staggered children animation
export const StaggerWrapper = ({ children, className, staggerChildren = 0.1 }) => {
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: staggerChildren
      }
    }
  };
  // Also apply a simple fade-in to the container itself if needed
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <motion.div
      className={className}
      variants={{ ...staggerContainer, ...fadeIn }} // Combine variants
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Helper function to resolve image URLs with basePath (클라이언트 사이드 버전)
const resolveClientImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (basePath && !url.startsWith('/')) {
    const separator = basePath.endsWith('/') ? '' : '/';
    return `${basePath}${separator}${url}`;
  }

  if (basePath && url.startsWith('/')) {
    return `${basePath.replace(/\/+$/, '')}${url}`;
  }

  return url;
};

// ResearchAwardItem 컴포넌트를 회사소개 페이지의 AwardsSection 아이템과 동일하게 수정
export function ResearchAwardItem({ award }) {
  if (!award || !award.title) {
    console.error('ResearchAwardItem: 필수 데이터(award 또는 award.title)가 없습니다.', award);
    // 회사소개 페이지에는 이런 오류 처리 블록이 명시적으로 없으므로,
    // 데이터가 항상 올바르다고 가정하거나, 여기서 null을 반환하여 렌더링하지 않도록 할 수 있습니다.
    // 여기서는 일단 유지하되, 실제 동작을 보고 조정합니다.
    return (
      <div className="rounded-lg border border-red-500 bg-red-100 p-4 shadow-md text-center">
        <h4 className="font-semibold text-red-700">데이터 표시 오류</h4>
        <p className="text-sm text-red-600">인증/특허 정보를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  // 이미지 URL 처리는 회사소개 페이지의 AwardsSection 로직을 따름
  // process.env.NEXT_PUBLIC_BASE_PATH 접근은 클라이언트 컴포넌트에서 바로 가능
  const imageSrc = award.imageUrl
    ? (award.imageUrl.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${award.imageUrl}`
      : award.imageUrl)
    : null;

  return (
    <motion.div
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-primary-500/50 transition-all duration-300 flex flex-col items-center p-4 text-center hover:shadow-primary-500/20 h-full"
      variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
    // StaggerWrapper가 initial과 animate를 처리하므로 여기서는 제거해도 무방할 수 있으나, 일관성을 위해 유지
    >
      {imageSrc && (
        <div className="relative w-full aspect-[3/4] mb-4 rounded-md overflow-hidden bg-gray-700/50 flex items-center justify-center p-1">
          <Image
            src={imageSrc}
            alt={award.title || '인증서 이미지'}
            fill
            className="object-contain" // 회사소개는 object-contain 사용
            unoptimized={typeof award.imageUrl === 'string' && award.imageUrl.startsWith('http')}
            onError={(e) => {
              console.warn(`ResearchAwardItem 이미지 로드 실패: ${imageSrc}. placeholder로 대체합니다.`);
              e.target.src = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/placeholder-image.png`;
            }}
          />
        </div>
      )}
      {/* 이미지가 없는 경우 placeholder 영역을 명시적으로 두지 않음 (회사소개와 동일하게) */}

      <h4 className="text-md font-semibold text-white mb-1 leading-tight flex-grow">{award.title}</h4>
      {award.year && <p className="text-xs text-gray-400">{award.year}</p>}
      {award.issuingOrganization && <p className="text-xs text-gray-500 mt-0.5">{award.issuingOrganization}</p>}
      {award.link && (
        <a
          href={award.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-primary-400 hover:text-primary-300 hover:underline inline-flex items-center"
        >
          자세히 보기 <ArrowRight className="w-3 h-3 ml-1" />
        </a>
      )}
    </motion.div>
  );
}

// Client-side Lucide icons mapping for ResearchAreaItem
const ClientLucideIcons = {
  Cpu,
  Recycle,
  ShieldCheck,
  FlaskConical,
  Default: DefaultIcon,
};

export function ResearchAreaItem({ area }) {
  const IconComponent = ClientLucideIcons[area.icon] || ClientLucideIcons.Default;
  return (
    <motion.div
      className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700/40 backdrop-blur-sm transition-all duration-300 hover:shadow-primary-500/30 hover:border-primary-500/60 hover:-translate-y-1 flex flex-col h-full"
      variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
    >
      <div className="mb-5 text-center">
        <div className="inline-block bg-primary-500/20 p-4 rounded-full ring-2 ring-primary-500/30">
          <IconComponent className="h-10 w-10 text-primary-300" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white text-center">{area.title}</h3>
      <p className="text-sm text-gray-300 flex-grow text-center leading-relaxed">{area.description}</p>
    </motion.div>
  );
}

export function ResearchAchievementItem({ achievement }) {
  return (
    <motion.div
      className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:bg-gray-700/70 flex items-center gap-6"
      variants={{ initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }}
    >
      <div className="flex-shrink-0 bg-primary-500 text-white p-4 rounded-lg shadow-md w-20 text-center">
        <span className="block text-2xl font-bold">{achievement.year}</span>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-primary-300 mb-1">{achievement.title}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{achievement.details}</p>
      </div>
    </motion.div>
  );
} 