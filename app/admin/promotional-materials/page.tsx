"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PromotionItem, PromotionType } from '@/types/promotion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, AlertTriangle, Loader2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// promotionTypeLabels 상수 정의
const promotionTypeLabels: Record<PromotionType, string> = {
    deliveryRecordList: '납품 실적 목록',
    video: '일반 비디오',
    image: '이미지',
    document: '문서',
    mainTitleBoxMultiVideo: '메인 다중 비디오',
    customContent: '커스텀 콘텐츠',
    gallery: '이미지 갤러리',
    news: '뉴스/소식',
    timeline: '연혁/타임라인',
};

// 타입별 색상
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

export default function AdminPromotionalMaterialsPage() {
    const router = useRouter();
    const [promotions, setPromotions] = useState<PromotionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPromotions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${basePath}/api/promotions`);
            if (!response.ok) {
                throw new Error('홍보 자료를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            // order 기준으로 정렬
            const sortedData = data.sort((a: PromotionItem, b: PromotionItem) => a.order - b.order);
            setPromotions(sortedData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleDelete = async (id: string) => {
        if (!confirm('정말로 이 홍보 자료를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }
        setDeletingId(id);
        setError(null);
        try {
            const response = await fetch(`${basePath}/api/promotions/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '삭제 중 오류가 발생했습니다.');
            }
            alert('홍보 자료가 성공적으로 삭제되었습니다.');
            fetchPromotions(); // 목록 새로고침
        } catch (err: any) {
            setError(err.message);
            alert(`오류: ${err.message}`);
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading && promotions.length === 0) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto" />
                    <p className="mt-4 text-lg text-gray-300">홍보 자료를 불러오는 중입니다...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-100">홍보 자료 관리</CardTitle>
                        <CardDescription className="mt-2 text-gray-400">
                            웹사이트에 표시될 홍보 자료를 관리합니다. 순서, 제목, 유형 등을 수정할 수 있습니다.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-gray-600 hover:bg-gray-700"
                        >
                            <Link href={`${basePath}/promotions`} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                홍보자료 페이지 보기
                            </Link>
                        </Button>
                        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                            <Link href={`${basePath}/admin/promotional-materials/new`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                새 홍보 자료 추가
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-md flex items-center"
                        >
                            <AlertTriangle className="h-5 w-5 mr-3" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                    {isLoading && promotions.length > 0 && (
                        <div className="flex items-center justify-center p-4 text-sm text-gray-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            목록을 새로고침하는 중...
                        </div>
                    )}
                    {!isLoading && promotions.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <AlertTriangle className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-2 text-lg font-medium text-gray-200">홍보 자료 없음</h3>
                            <p className="mt-1 text-sm text-gray-400">아직 추가된 홍보 자료가 없습니다.</p>
                            <div className="mt-6">
                                <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                                    <Link href={`${basePath}/admin/promotional-materials/new`}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        새 홍보 자료 추가
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                    {promotions.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700">
                                        <TableHead className="w-[80px] text-center text-gray-300">순서</TableHead>
                                        <TableHead className="text-gray-300">제목</TableHead>
                                        <TableHead className="hidden md:table-cell text-gray-300">타입</TableHead>
                                        <TableHead className="hidden sm:table-cell text-center text-gray-300">공개</TableHead>
                                        <TableHead className="hidden md:table-cell text-gray-300">최종 수정일</TableHead>
                                        <TableHead className="text-right w-[100px] text-gray-300">작업</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {promotions.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-gray-700 hover:bg-gray-800/50"
                                        >
                                            <TableCell className="font-medium text-center text-gray-300">{item.order}</TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`${basePath}/admin/promotional-materials/edit/${item.id}`}
                                                    className="font-medium text-red-400 hover:text-red-300 hover:underline"
                                                >
                                                    {item.title}
                                                </Link>
                                                {item.description && (
                                                    <p className="text-xs text-gray-500 truncate max-w-xs mt-1">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge className={cn("text-xs", typeColors[item.type])}>
                                                    {promotionTypeLabels[item.type] || item.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-center">
                                                {item.isVisible ? (
                                                    <Eye className="h-5 w-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <EyeOff className="h-5 w-5 text-gray-500 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm text-gray-400">
                                                {new Date(item.updatedAt).toLocaleString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 border-gray-600 hover:bg-blue-600/20 hover:border-blue-500"
                                                        asChild
                                                    >
                                                        <Link href={`${basePath}/admin/promotional-materials/edit/${item.id}`}>
                                                            <Edit className="h-4 w-4 text-blue-400" />
                                                            <span className="sr-only">수정</span>
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 border-gray-600 hover:bg-red-600/20 hover:border-red-500"
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={deletingId === item.id}
                                                    >
                                                        {deletingId === item.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        )}
                                                        <span className="sr-only">삭제</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 