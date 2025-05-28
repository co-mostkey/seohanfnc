'use client';

import React, { useState, useEffect } from 'react';
import { PromotionItem, DeliveryRecord, PromotionType } from '@/types/promotion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';
import { Video, FileText, Image as ImageIcon, List, ExternalLink, Loader2, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// 납품 실적 아이템 렌더링 컴포넌트
function DeliveryRecordItem({ record }: { record: DeliveryRecord }) {
    let accentColorClass = "bg-sky-500"; // 기본 색상
    if (record.company.toLowerCase().includes("대우")) accentColorClass = "bg-red-500";
    else if (record.company.toLowerCase().includes("현대")) accentColorClass = "bg-blue-500";
    else if (record.company.toLowerCase().includes("gs")) accentColorClass = "bg-yellow-500";
    else if (record.company.toLowerCase().includes("samsung") || record.company.toLowerCase().includes("삼성")) accentColorClass = "bg-blue-600";
    else if (record.company.toLowerCase().includes("lh") || record.company.toLowerCase().includes("한국토지주택공사")) accentColorClass = "bg-green-500";


    return (
        <div className="flex items-start bg-slate-700/40 hover:bg-slate-700/70 p-3 rounded-lg transition-all duration-200 group mb-2 last:mb-0 shadow-sm hover:shadow-md">
            <div className={cn("flex-shrink-0 w-1.5 h-auto self-stretch rounded-full mr-3.5", accentColorClass)}></div>
            <div className="flex-grow min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-base font-semibold text-sky-100 group-hover:text-white transition-colors break-keep">{record.company}</span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors mt-1 break-words leading-relaxed">
                    {record.isApartment && <span className="inline-block mr-1.5 text-base relative -top-px">🏢</span>}
                    {record.project}
                </p>
            </div>
        </div>
    );
}

// 홍보 아이템 타입에 따른 아이콘 반환 함수
function getPromotionIcon(type: PromotionType) {
    switch (type) {
        case 'mainHeroVideo':
        case 'video':
            return <Video className="w-6 h-6 mr-2.5 text-rose-400 flex-shrink-0" />;
        case 'deliveryRecordList':
            return <List className="w-6 h-6 mr-2.5 text-emerald-400 flex-shrink-0" />;
        case 'image':
            return <ImageIcon className="w-6 h-6 mr-2.5 text-violet-400 flex-shrink-0" />;
        case 'document':
            return <FileText className="w-6 h-6 mr-2.5 text-amber-400 flex-shrink-0" />;
        default:
            return <Info className="w-6 h-6 mr-2.5 text-gray-400 flex-shrink-0" />;
    }
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPromotions() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${basePath}/api/promotions`, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // 공개된 항목만 필터링 (isVisible이 true이거나 undefined/null인 경우)
                const visiblePromotions = data.filter((item: PromotionItem) => item.isVisible !== false);
                setPromotions(visiblePromotions);
            } catch (e: any) {
                setError(e.message || '홍보 자료를 불러오는 중 오류가 발생했습니다.');
                console.error("Error fetching promotions:", e);
            }
            setIsLoading(false);
        }
        fetchPromotions();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-4">
                <Loader2 className="w-12 h-12 animate-spin text-sky-500 mb-4" />
                <p className="text-lg text-slate-300">홍보 자료를 불러오는 중입니다...</p>
                <p className="text-sm text-slate-500">잠시만 기다려주세요.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <p className="text-2xl font-semibold text-red-400 mb-3">오류 발생</p>
                <p className="text-slate-300 mb-6 max-w-md">{error}</p>
                <Button onClick={() => window.location.reload()} variant="destructive" size="lg">
                    다시 시도
                </Button>
            </div>
        );
    }

    if (promotions.length === 0) {
        return (
            <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6 text-center">
                <Info className="w-16 h-16 text-sky-500 mb-6" />
                <p className="text-2xl font-semibold text-slate-200 mb-3">홍보 자료 없음</p>
                <p className="text-slate-400 max-w-md">현재 등록된 홍보 자료가 없습니다. 관리자 페이지에서 새로운 자료를 추가해주세요.</p>
            </div>
        );
    }

    // 단순화된 return 문
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-4 md:p-6 lg:p-8 pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-10 md:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 py-2">
                    홍보 자료실
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                    {promotions.map((item) => (
                        <Card
                            key={item.id}
                            className={cn(
                                "bg-slate-800/70 border border-slate-700/90 shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 flex flex-col overflow-hidden group",
                            )}
                        >
                            <CardHeader className="pb-3 pt-5 px-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start min-w-0">
                                        {getPromotionIcon(item.type)}
                                        <CardTitle className="text-xl lg:text-2xl font-semibold text-sky-200 group-hover:text-sky-100 transition-colors break-words leading-tight">
                                            {item.title}
                                        </CardTitle>
                                    </div>
                                    <span className="text-xs text-slate-500 group-hover:text-slate-400 whitespace-nowrap pl-2 transition-colors">{new Date(item.updatedAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}</span>
                                </div>
                                {item.description && <CardDescription className="text-slate-400 group-hover:text-slate-300 pt-2.5 text-sm leading-relaxed transition-colors">{item.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="flex-grow px-5 pb-5 flex flex-col">
                                {/* 비디오 타입 (mainHeroVideo, video) 복원 */}
                                {(item.type === 'mainHeroVideo' || item.type === 'video') && item.videoUrl && (
                                    <div className="aspect-video rounded-md overflow-hidden border border-slate-700 mt-2 shadow-inner flex-grow">
                                        <video
                                            src={item.videoUrl.startsWith('http') ? item.videoUrl : `${basePath}${item.videoUrl}`}
                                            controls
                                            className="w-full h-full object-cover"
                                            poster={item.thumbnailUrl ? (item.thumbnailUrl.startsWith('http') ? item.thumbnailUrl : `${basePath}${item.thumbnailUrl}`) : undefined}
                                        >
                                            브라우저가 비디오 태그를 지원하지 않습니다.
                                        </video>
                                    </div>
                                )}
                                {/* 납품 실적 목록 타입 (deliveryRecordList) 복원 */}
                                {item.type === 'deliveryRecordList' && item.records && item.records.length > 0 && (
                                    <div className="mt-2 space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1.5 flex-grow bg-slate-900/30 p-3 rounded-md border border-slate-700/50 shadow-inner">
                                        {item.records.map(record => <DeliveryRecordItem key={record.id} record={record} />)}
                                    </div>
                                )}
                                {/* 이미지 타입 (image) 복원 */}
                                {item.type === 'image' && item.imageUrl && (
                                    <Link href={item.imageUrl.startsWith('http') ? item.imageUrl : `${basePath}${item.imageUrl}`} passHref legacyBehavior>
                                        <a target="_blank" rel="noopener noreferrer" className="block mt-2 rounded-md overflow-hidden border border-slate-700 shadow-inner group/image flex-grow relative aspect-w-16 aspect-h-9 w-full">
                                            <Image
                                                src={item.imageUrl.startsWith('http') ? item.imageUrl : `${basePath}${item.imageUrl}`}
                                                alt={item.title || '홍보 이미지'}
                                                layout="fill"
                                                objectFit="cover"
                                                className="group-hover/image:scale-105 transition-transform duration-300 ease-in-out"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover/image:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                                                <ExternalLink className="w-8 h-8 text-white/80" />
                                            </div>
                                        </a>
                                    </Link>
                                )}
                                {/* 문서 타입 (document) 복원 */}
                                {item.type === 'document' && item.documentUrl && (
                                    <div className="mt-auto pt-3"> {/* mt-auto pushes button to bottom */}
                                        <Button asChild variant="outline" className="w-full border-sky-600/70 text-sky-300 hover:bg-sky-700/30 hover:text-sky-200 hover:border-sky-500 transition-all duration-200 group/button">
                                            <Link href={item.documentUrl.startsWith('http') ? item.documentUrl : `${basePath}${item.documentUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                <FileText className="w-4 h-4 mr-2 text-sky-400 group-hover/button:text-sky-300 transition-colors" />
                                                {item.fileName || '문서 보기/다운로드'}
                                                <ExternalLink className="w-4 h-4 ml-auto text-slate-500 group-hover/button:text-sky-400 transition-colors" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                                {/* 비디오, 납품실적, 이미지, 문서 외의 타입은 여기에 간단한 텍스트나 메시지 표시 가능 */}
                                {!((item.type === 'mainHeroVideo' || item.type === 'video') && item.videoUrl) &&
                                    !((item.type === 'deliveryRecordList' && item.records && item.records.length > 0)) &&
                                    !((item.type === 'image' && item.imageUrl)) &&
                                    !((item.type === 'document' && item.documentUrl)) &&
                                    (
                                        <div className="flex-grow flex items-center justify-center text-slate-500 italic mt-2">
                                            (표시할 콘텐츠가 없거나 준비중입니다)
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 다음 CSS를 global.css 또는 해당 컴포넌트의 CSS 모듈에 추가합니다.
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.5); // slate-700/50
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.7); // slate-500/70
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 1); // slate-500
}
*/ 