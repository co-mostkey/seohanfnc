'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PromotionItem, promotionTypeLabels } from '@/types/promotion';
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
import { PlusCircle, Edit, Trash2, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function AdminPromotionsPage() {
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

    if (isLoading && promotions.length === 0) { // 초기 로딩 시에만 전체 화면 로더 표시
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
                <p className="ml-4 text-lg">홍보 자료를 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">홍보 자료 관리</CardTitle>
                    <Link href={`${basePath}/admin/promotions/new`} passHref>
                        <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                            <PlusCircle className="mr-2 h-4 w-4" /> 새 홍보 자료 추가
                        </Button>
                    </Link>
                </CardHeader>
                <CardDescription className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                    웹사이트에 표시될 홍보 자료를 관리합니다. 순서, 제목, 유형 등을 수정할 수 있습니다.
                </CardDescription>
                <CardContent>
                    {error && !isLoading && ( // 로딩 중 아닐 때만 에러 메시지 표시
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-3" />
                            <span>{error}</span>
                        </div>
                    )}
                    {isLoading && promotions.length > 0 && ( // 데이터가 이미 있을 때 로딩 표시 (예: 삭제 후 새로고침)
                        <div className="flex items-center justify-center p-4 text-sm text-gray-500 dark:text-gray-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            목록을 새로고침하는 중...
                        </div>
                    )}
                    {!isLoading && promotions.length === 0 && !error && (
                        <div className="text-center py-12">
                            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">홍보 자료 없음</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">아직 추가된 홍보 자료가 없습니다.</p>
                            <div className="mt-6">
                                <Link href={`${basePath}/admin/promotions/new`} passHref>
                                    <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                                        <PlusCircle className="mr-2 h-4 w-4" /> 새 홍보 자료 추가
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    {promotions.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] text-center">순서</TableHead>
                                        <TableHead>제목</TableHead>
                                        <TableHead className="hidden md:table-cell">타입</TableHead>
                                        <TableHead className="hidden sm:table-cell text-center">공개</TableHead>
                                        <TableHead className="hidden md:table-cell">최종 수정일</TableHead>
                                        <TableHead className="text-right w-[100px]">작업</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {promotions.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <TableCell className="font-medium text-center">{item.order}</TableCell>
                                            <TableCell>
                                                <Link href={`${basePath}/admin/promotions/edit/${item.id}`} className="font-medium text-sky-600 hover:underline dark:text-sky-400">
                                                    {item.title}
                                                </Link>
                                                {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{item.description}</p>}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="outline" className="capitalize">{promotionTypeLabels[item.type] || item.type}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-center">
                                                {item.isVisible ? <Eye className="h-5 w-5 text-green-500 mx-auto" /> : <EyeOff className="h-5 w-5 text-gray-400 mx-auto" />}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(item.updatedAt).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <Link href={`${basePath}/admin/promotions/edit/${item.id}`} passHref legacyBehavior>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-700/30 hover:border-blue-500 dark:hover:border-blue-600">
                                                            <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            <span className="sr-only">수정</span>
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-700/30 hover:border-red-500 dark:hover:border-red-600"
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={deletingId === item.id}
                                                    >
                                                        {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                        <span className="sr-only">삭제</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
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