'use client';

import React, { useState, useEffect } from 'react';
import { PromotionItem, DeliveryRecord, PromotionType } from '@/types/promotion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, FileText, Image as ImageIcon, ExternalLink,
    Loader2, AlertTriangle, Info, Clock, Building,
    Globe, Newspaper, Timer, Package, Grid, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 타입별 한글 레이블
const typeLabels: Record<PromotionType, string> = {
    deliveryRecordList: '납품실적',
    video: '비디오',
    image: '이미지',
    document: '문서자료',
    mainTitleBoxMultiVideo: '메인비디오',
    customContent: '커스텀콘텐츠',
    gallery: '갤러리',
    news: '뉴스/소식',
    timeline: '연혁'
};

// 타입별 색상 클래스
const typeColors: Record<PromotionType, string> = {
    deliveryRecordList: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    video: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    image: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    document: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    mainTitleBoxMultiVideo: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    customContent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    gallery: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    news: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    timeline: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
};

// 납품 실적 아이템 컴포넌트
function DeliveryRecordItem({ record }: { record: DeliveryRecord }) {
    const companyColorMap: { [key: string]: string } = {
        '대우': 'from-red-500 to-red-600',
        '현대': 'from-blue-500 to-blue-600',
        'gs': 'from-yellow-500 to-yellow-600',
        '삼성': 'from-blue-600 to-blue-700',
        'lh': 'from-green-500 to-green-600',
        '한국토지주택공사': 'from-green-500 to-green-600',
        'lg': 'from-red-600 to-pink-600',
        '포스코': 'from-orange-500 to-orange-600',
        '롯데': 'from-red-500 to-rose-600'
    };

    let gradientClass = 'from-sky-500 to-sky-600';
    const lowerCompany = record.company.toLowerCase();

    for (const [key, value] of Object.entries(companyColorMap)) {
        if (lowerCompany.includes(key)) {
            gradientClass = value;
            break;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative"
        >
            <div className="flex items-start bg-black/20 hover:bg-black/30 backdrop-blur-sm p-3 rounded-lg transition-all duration-300 border border-white/10 hover:border-white/20">
                <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b rounded-l-lg", gradientClass)} />
                <div className="flex-grow pl-3">
                    <div className="flex items-center justify-between gap-3">
                        <h4 className="font-medium text-white/90 group-hover:text-white transition-colors text-sm">
                            {record.company}
                        </h4>
                        {record.date && (
                            <time className="text-xs text-white/50 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(record.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })}
                            </time>
                        )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 flex items-center gap-2">
                        {record.isApartment && <Building className="w-3 h-3 text-blue-400" />}
                        {record.project}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// 홍보 아이템 타입별 아이콘
function getPromotionIcon(type: PromotionType, className = "w-5 h-5") {
    const icons: Record<PromotionType, React.ReactElement> = {
        video: <Video className={className} />,
        mainTitleBoxMultiVideo: <Video className={className} />,
        deliveryRecordList: <Package className={className} />,
        image: <ImageIcon className={className} />,
        document: <FileText className={className} />,
        customContent: <Globe className={className} />,
        gallery: <Grid className={className} />,
        news: <Newspaper className={className} />,
        timeline: <Timer className={className} />
    };
    return icons[type] || <Info className={className} />;
}

// 갤러리 이미지 컴포넌트 - 개선된 버전
function GalleryGrid({ images }: { images: Array<{ id?: string; url: string; caption?: string; order?: number }> }) {
    // order 기준으로 정렬
    const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className="space-y-3">
            {/* 첫 번째 이미지는 크게 표시 */}
            {sortedImages[0] && (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                >
                    <Image
                        src={sortedImages[0].url.startsWith('http') ? sortedImages[0].url : `${basePath}${sortedImages[0].url}`}
                        alt={sortedImages[0].caption || '갤러리 메인 이미지'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-sm text-white font-medium">{sortedImages[0].caption}</p>
                    </div>
                </motion.div>
            )}

            {/* 나머지 이미지들은 그리드로 표시 */}
            {sortedImages.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                    {sortedImages.slice(1, 4).map((img, idx) => (
                        <motion.div
                            key={img.id || idx}
                            whileHover={{ scale: 1.05 }}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        >
                            <Image
                                src={img.url.startsWith('http') ? img.url : `${basePath}${img.url}`}
                                alt={img.caption || `갤러리 이미지 ${idx + 2}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                <p className="text-xs text-white line-clamp-1">{img.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {sortedImages.length > 4 && (
                <p className="text-xs text-white/50 text-center">
                    +{sortedImages.length - 4}개 더 보기
                </p>
            )}
        </div>
    );
}

// 뉴스 카드 컴포넌트 - 새로운 버전
function NewsCard({ item }: { item: PromotionItem }) {
    const newsDate = item.newsDate ? new Date(item.newsDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

    return (
        <div className="space-y-3">
            {/* 뉴스 메타 정보 */}
            <div className="flex items-center justify-between text-xs">
                {newsDate && (
                    <div className="flex items-center gap-1 text-white/60">
                        <Calendar className="w-3 h-3" />
                        <time>{newsDate}</time>
                    </div>
                )}
                {item.newsSource && (
                    <span className="text-cyan-400">{item.newsSource}</span>
                )}
            </div>

            {/* 뉴스 설명 */}
            {item.newsDescription && (
                <p className="text-sm text-white/80 line-clamp-4 leading-relaxed">
                    {item.newsDescription}
                </p>
            )}

            {/* 뉴스 링크 */}
            {item.newsLink && (
                <Button asChild size="sm" variant="outline" className="w-full bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400">
                    <a
                        href={item.newsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        <Newspaper className="w-4 h-4" />
                        뉴스 기사 보기
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </Button>
            )}
        </div>
    );
}

// 뉴스 아이템 컴포넌트
function NewsItem({ item }: { item: { title: string; date: string; content: string; link?: string } }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-2 border-cyan-500 pl-4 py-2"
        >
            <div className="flex items-center justify-between mb-1">
                <h5 className="font-medium text-white/90 text-sm">{item.title}</h5>
                <time className="text-xs text-white/50">
                    {new Date(item.date).toLocaleDateString('ko-KR')}
                </time>
            </div>
            <p className="text-xs text-white/70 line-clamp-2">{item.content}</p>
            {item.link && (
                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-1"
                >
                    자세히 보기 <ExternalLink className="w-3 h-3" />
                </a>
            )}
        </motion.div>
    );
}

// 타임라인 아이템 컴포넌트
function TimelineItem({ item, index }: { item: { year: string; title: string; description: string }; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center gap-4"
        >
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm">
                {item.year}
            </div>
            <div className="flex-grow">
                <h5 className="font-medium text-white/90 text-sm">{item.title}</h5>
                <p className="text-xs text-white/70 mt-1">{item.description}</p>
            </div>
        </motion.div>
    );
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 페이지 타이틀 설정
        document.title = '홍보 자료실 | 서한에프앤씨';

        async function fetchPromotions() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${basePath}/api/promotions`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const visiblePromotions = data
                    .filter((item: PromotionItem) => item.isVisible !== false)
                    .sort((a: PromotionItem, b: PromotionItem) => a.order - b.order);
                setPromotions(visiblePromotions);
            } catch (e: any) {
                setError(e.message || '홍보 자료를 불러오는 중 오류가 발생했습니다.');
                if (process.env.NODE_ENV === 'development') {
                    console.error("Error fetching promotions:", e);
                }
            }
            setIsLoading(false);
        }
        fetchPromotions();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
                {/* 배경 이미지 */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={`${basePath}/hero/hero_01.png`}
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center z-10"
                >
                    <Loader2 className="w-16 h-16 animate-spin text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-white">홍보 자료를 불러오는 중입니다...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
                {/* 배경 이미지 */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={`${basePath}/hero/hero_01.png`}
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto p-8 z-10"
                >
                    <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-red-400 mb-3">오류가 발생했습니다</h2>
                    <p className="text-white/80 mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        다시 시도
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* 배경 이미지 */}
            <div className="fixed inset-0 z-0">
                <Image
                    src={`${basePath}/hero/hero_01.png`}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
            </div>

            {/* 콘텐츠 영역 */}
            <div className="relative z-10 pt-24 pb-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* 타이틀 */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                홍보 자료실
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                            서한에프앤씨의 다양한 프로젝트와 성과를 확인하세요
                        </p>
                    </motion.div>

                    {/* 홍보자료 그리드 */}
                    {promotions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Info className="w-16 h-16 text-white/50 mx-auto mb-4" />
                            <p className="text-xl text-white/70">
                                등록된 홍보 자료가 없습니다.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {promotions.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="h-full bg-black/40 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 group overflow-hidden">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-grow">
                                                        <CardTitle className="text-lg text-white group-hover:text-red-400 transition-colors line-clamp-2">
                                                            {item.title}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge className={cn("text-xs", typeColors[item.type])}>
                                                                {getPromotionIcon(item.type, "w-3 h-3 mr-1 inline")}
                                                                {typeLabels[item.type]}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                {item.description && (
                                                    <CardDescription className="text-white/60 mt-2 line-clamp-2 text-sm">
                                                        {item.description}
                                                    </CardDescription>
                                                )}
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                {/* 비디오 타입 */}
                                                {item.type === 'video' && item.videoUrl && (
                                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                                        <video
                                                            src={item.videoUrl.startsWith('http') ? item.videoUrl : `${basePath}${item.videoUrl}`}
                                                            controls
                                                            poster={item.thumbnailUrl}
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                )}

                                                {/* 메인 다중 비디오 타입 */}
                                                {item.type === 'mainTitleBoxMultiVideo' && item.videoUrls && item.videoUrls.length > 0 && (
                                                    <div className="space-y-2">
                                                        {item.videoUrls.map((videoUrl, index) => (
                                                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                                                <video
                                                                    src={videoUrl.startsWith('http') ? videoUrl : `${basePath}${videoUrl}`}
                                                                    controls
                                                                    className="w-full h-full"
                                                                />
                                                            </div>
                                                        ))}
                                                        {item.showButton && item.buttonText && item.buttonLink && (
                                                            <div className="pt-2">
                                                                <Button asChild size="sm" className="w-full bg-red-600 hover:bg-red-700">
                                                                    <Link href={item.buttonLink}>
                                                                        {item.buttonText}
                                                                        <ExternalLink className="w-3 h-3 ml-1" />
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 납품실적 타입 */}
                                                {item.type === 'deliveryRecordList' && item.records && (
                                                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                                        {item.records.slice(0, 5).map((record, idx) => (
                                                            <DeliveryRecordItem key={record.id || idx} record={record} />
                                                        ))}
                                                        {item.records.length > 5 && (
                                                            <p className="text-xs text-white/50 text-center pt-2">
                                                                +{item.records.length - 5}개 더 보기
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 이미지 타입 */}
                                                {item.type === 'image' && item.imageUrl && (
                                                    <Link
                                                        href={item.imageUrl.startsWith('http') ? item.imageUrl : `${basePath}${item.imageUrl}`}
                                                        target="_blank"
                                                        className="block relative aspect-video rounded-lg overflow-hidden group/img"
                                                    >
                                                        <Image
                                                            src={item.imageUrl.startsWith('http') ? item.imageUrl : `${basePath}${item.imageUrl}`}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            <ExternalLink className="w-10 h-10 text-white" />
                                                        </div>
                                                    </Link>
                                                )}

                                                {/* 문서 타입 */}
                                                {item.type === 'document' && item.documentUrl && (
                                                    <div className="flex items-center justify-center p-6 bg-black/20 rounded-lg">
                                                        <div className="text-center">
                                                            <FileText className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                                                            <p className="text-white/80 mb-3 text-sm">{item.fileName || '문서 파일'}</p>
                                                            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                                                                <Link
                                                                    href={item.documentUrl.startsWith('http') ? item.documentUrl : `${basePath}${item.documentUrl}`}
                                                                    target="_blank"
                                                                >
                                                                    다운로드
                                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 갤러리 타입 - 개선된 버전 */}
                                                {item.type === 'gallery' && item.galleryImages && item.galleryImages.length > 0 && (
                                                    <GalleryGrid images={item.galleryImages} />
                                                )}

                                                {/* 뉴스 타입 - 새로운 버전 */}
                                                {item.type === 'news' && (item.newsLink || item.newsDescription) && (
                                                    <NewsCard item={item} />
                                                )}

                                                {/* 뉴스 타입 - 기존 버전 (호환성) */}
                                                {item.type === 'news' && !item.newsLink && !item.newsDescription && item.newsItems && item.newsItems.length > 0 && (
                                                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                                        {item.newsItems.slice(0, 3).map((news, idx) => (
                                                            <NewsItem key={idx} item={news} />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* 타임라인 타입 */}
                                                {item.type === 'timeline' && item.timelineItems && item.timelineItems.length > 0 && (
                                                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                                        {item.timelineItems.slice(0, 3).map((timeline, idx) => (
                                                            <TimelineItem key={idx} item={timeline} index={idx} />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* 커스텀 콘텐츠 타입 - 마크다운 지원 추가 */}
                                                {item.type === 'customContent' && (
                                                    <>
                                                        {item.contentType === 'markdown' && item.markdownContent ? (
                                                            <div className="prose prose-invert prose-sm max-w-none 
                                                                prose-headings:text-white 
                                                                prose-p:text-white/80 
                                                                prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                                                                prose-strong:text-white 
                                                                prose-code:text-purple-300 prose-code:bg-purple-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                                                prose-pre:bg-black/40 prose-pre:border prose-pre:border-purple-500/20
                                                                prose-blockquote:border-purple-500 prose-blockquote:text-white/70
                                                                prose-ul:text-white/80 prose-ol:text-white/80
                                                                prose-hr:border-white/20">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {item.markdownContent}
                                                                </ReactMarkdown>
                                                            </div>
                                                        ) : item.customHtml ? (
                                                            <div
                                                                className="prose prose-invert prose-sm max-w-none text-white/80
                                                                    [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white
                                                                    [&_p]:text-white/80 [&_li]:text-white/80
                                                                    [&_a]:text-purple-400 [&_a:hover]:underline
                                                                    [&_strong]:text-white [&_em]:text-white/90
                                                                    [&_code]:text-purple-300 [&_code]:bg-purple-900/30 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
                                                                    [&_pre]:bg-black/40 [&_pre]:border [&_pre]:border-purple-500/20
                                                                    [&_blockquote]:border-purple-500 [&_blockquote]:text-white/70
                                                                    [&_hr]:border-white/20"
                                                                dangerouslySetInnerHTML={{ __html: item.customHtml }}
                                                            />
                                                        ) : (
                                                            <div className="text-center py-8 text-white/50">
                                                                <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                                <p className="text-sm">콘텐츠가 없습니다</p>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
} 