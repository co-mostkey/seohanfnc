"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Search, FileText, Package, MessageSquare, Award,
    Target, Lightbulb, Building, Clock, ExternalLink,
    Filter, SortAsc, SortDesc, RefreshCw, AlertCircle, Users
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_UI, ADMIN_CARD_STYLES } from '@/lib/admin-ui-constants';

interface SearchResult {
    id: string;
    title: string;
    content: string;
    type: 'company' | 'product' | 'inquiry' | 'award' | 'core-value' | 'research' | 'member';
    url: string;
    relevance: number;
}

interface SearchResponse {
    results: SearchResult[];
    total: number;
    query: string;
    searchTime: number;
    message?: string;
}

const typeLabels = {
    'company': '회사정보',
    'product': '제품',
    'inquiry': '문의',
    'award': '인증/수상',
    'core-value': '핵심가치',
    'research': '연구개발',
    'member': '회원'
};

const typeIcons = {
    'company': Building,
    'product': Package,
    'inquiry': MessageSquare,
    'award': Award,
    'core-value': Target,
    'research': Lightbulb,
    'member': Users
};

const typeColors = {
    'company': 'bg-blue-100 text-blue-800',
    'product': 'bg-green-100 text-green-800',
    'inquiry': 'bg-yellow-100 text-yellow-800',
    'award': 'bg-purple-100 text-purple-800',
    'core-value': 'bg-pink-100 text-pink-800',
    'research': 'bg-indigo-100 text-indigo-800',
    'member': 'bg-orange-100 text-orange-800'
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
    const [searchType, setSearchType] = useState(searchParams?.get('type') || 'all');
    const [sortBy, setSortBy] = useState('relevance');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [searchTime, setSearchTime] = useState<number | null>(null);
    const [currentQuery, setCurrentQuery] = useState('');

    const performSearch = useCallback(async (query: string, type: string = 'all') => {
        if (!query.trim() || query.trim().length < 2) {
            setResults([]);
            setTotalResults(0);
            setSearchTime(null);
            return;
        }

        setIsLoading(true);
        setCurrentQuery(query);

        try {
            const startTime = Date.now();
            const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}&type=${type}&limit=50`);
            const endTime = Date.now();

            if (!response.ok) {
                throw new Error('검색 요청이 실패했습니다.');
            }

            const data: SearchResponse = await response.json();

            setResults(data.results);
            setTotalResults(data.total);
            setSearchTime(endTime - startTime);

            if (data.message) {
                toast.info(data.message);
            }

            // URL 업데이트
            const params = new URLSearchParams();
            params.set('q', query);
            if (type !== 'all') params.set('type', type);
            router.push(`/admin/search?${params.toString()}`, { scroll: false });

        } catch (error) {
            console.error('Search error:', error);
            toast.error('검색 중 오류가 발생했습니다.');
            setResults([]);
            setTotalResults(0);
            setSearchTime(null);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchQuery, searchType);
    };

    const handleTypeChange = (newType: string) => {
        setSearchType(newType);
        if (searchQuery.trim()) {
            performSearch(searchQuery, newType);
        }
    };

    const sortedResults = React.useMemo(() => {
        const sorted = [...results];

        switch (sortBy) {
            case 'relevance':
                return sorted.sort((a, b) => b.relevance - a.relevance);
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'type':
                return sorted.sort((a, b) => a.type.localeCompare(b.type));
            default:
                return sorted;
        }
    }, [results, sortBy]);

    // URL 파라미터에서 초기 검색 실행
    useEffect(() => {
        const query = searchParams?.get('q');
        const type = searchParams?.get('type') || 'all';

        if (query) {
            setSearchQuery(query);
            setSearchType(type);
            performSearch(query, type);
        }
    }, [searchParams, performSearch]);

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : part
        );
    };

    const getTypeIcon = (type: string) => {
        const IconComponent = typeIcons[type as keyof typeof typeIcons] || FileText;
        return <IconComponent className="h-4 w-4" />;
    };

    return (
        <div className="space-y-6">
            <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>전역 검색</h1>
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                                        type="text"
                                        placeholder="검색어를 입력하세요... (최소 2글자)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={searchType} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">전체</SelectItem>
                                    <SelectItem value="company">회사정보</SelectItem>
                                    <SelectItem value="product">제품</SelectItem>
                                    <SelectItem value="inquiry">문의</SelectItem>
                                    <SelectItem value="research">연구개발</SelectItem>
                                    <SelectItem value="member">회원</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
            </form>
                </CardContent>
            </Card>

            {(results.length > 0 || currentQuery) && (
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div>
                            {currentQuery && (
                                <p className="text-lg font-medium">
                                    "{currentQuery}" 검색 결과: {totalResults}개
                                </p>
                            )}
                            {searchTime !== null && (
                                <p className="text-sm text-gray-500">
                                    검색 시간: {searchTime}ms
                                </p>
                            )}
                        </div>
                    </div>

                    {results.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">정렬:</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">관련도순</SelectItem>
                                    <SelectItem value="title">제목순</SelectItem>
                                    <SelectItem value="type">유형순</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                        <RefreshCw className="h-6 w-6 animate-spin" />
                        <span>검색 중...</span>
                    </div>
                </div>
            )}

            {!isLoading && currentQuery && results.length === 0 && (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                검색 결과가 없습니다
                            </h3>
                            <p className="text-gray-500 mb-4">
                                "{currentQuery}"에 대한 검색 결과를 찾을 수 없습니다.
                            </p>
                            <div className="text-sm text-gray-400">
                                <p>검색 팁:</p>
                                <ul className="mt-2 space-y-1">
                                    <li>• 다른 키워드로 검색해보세요</li>
                                    <li>• 검색어를 줄여보세요</li>
                                    <li>• 전체 카테고리에서 검색해보세요</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {!isLoading && sortedResults.length > 0 && (
                <div className="space-y-4">
                    {sortedResults.map((result) => (
                        <Card key={result.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Badge className={typeColors[result.type]}>
                                                {getTypeIcon(result.type)}
                                                <span className="ml-1">{typeLabels[result.type]}</span>
                                            </Badge>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <span>관련도: {result.relevance.toFixed(0)}%</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-2">
                                            {highlightText(result.title, currentQuery)}
                                        </h3>

                                        <p className="text-gray-600 mb-3 line-clamp-2">
                                            {highlightText(result.content, currentQuery)}
                                        </p>

                                        <Link
                                            href={result.url}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            상세보기
                                            <ExternalLink className="h-3 w-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!currentQuery && !isLoading && (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                검색어를 입력해주세요
                            </h3>
                            <p className="text-gray-500 mb-4">
                                회사정보, 제품, 문의, 연구개발, 회원 등 모든 데이터를 검색할 수 있습니다.
                            </p>
                            <div className="text-sm text-gray-400">
                                <p>검색 가능한 항목:</p>
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    {Object.entries(typeLabels).map(([type, label]) => (
                                        <Badge key={type} variant="outline" className="text-xs">
                                            {getTypeIcon(type)}
                                            <span className="ml-1">{label}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 