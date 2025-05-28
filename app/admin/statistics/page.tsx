"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Users, Eye, MessageSquare, TrendingUp, TrendingDown,
    RefreshCw, Calendar, Award, Package, Target, Lightbulb,
    Activity, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// 색상 팔레트
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StatisticsData {
    overview: {
        totalVisitors: string;
        totalInquiries: string;
        totalProductViews: string;
        activeUsers: string;
        visitorChange: string;
        inquiryChange: string;
        productViewChange: string;
        activeUserChange: string;
    };
    content: {
        totalProducts: number;
        totalAwards: number;
        totalCoreValues: number;
        researchAreas: number;
        researchAchievements: number;
        totalInquiries: number;
    };
    dailyStats: Array<{
        date: string;
        visitors: number;
        inquiries: number;
        productViews: number;
    }>;
    trends: {
        popularProducts: Array<{
            name: string;
            views: number;
            change: string;
        }>;
        recentInquiries: Array<{
            date: string;
            type: string;
            status: string;
        }>;
    };
    lastUpdated: string;
}

export default function StatisticsPage() {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchStatistics = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/statistics');
            if (!response.ok) {
                throw new Error('통계 데이터를 가져오는데 실패했습니다.');
            }
            const statistics = await response.json();
            setData(statistics);
            setLastRefresh(new Date());
            toast.success('통계 데이터가 업데이트되었습니다.');
        } catch (error) {
            console.error('Statistics fetch error:', error);
            toast.error('통계 데이터를 가져오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>통계 데이터를 불러오는 중...</span>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">통계 데이터를 불러올 수 없습니다.</p>
                    <Button onClick={fetchStatistics} className="mt-4">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        다시 시도
                    </Button>
                </div>
            </div>
        );
    }

    const getChangeIcon = (change: string) => {
        if (change.startsWith('+')) {
            return <TrendingUp className="h-4 w-4 text-green-500" />;
        } else if (change.startsWith('-')) {
            return <TrendingDown className="h-4 w-4 text-red-500" />;
        }
        return <Activity className="h-4 w-4 text-gray-500" />;
    };

    const getChangeColor = (change: string) => {
        if (change.startsWith('+')) return 'text-green-600';
        if (change.startsWith('-')) return 'text-red-600';
        return 'text-gray-600';
    };

    // 콘텐츠 통계를 차트 데이터로 변환
    const contentChartData = [
        { name: '제품', value: data.content.totalProducts, color: COLORS[0] },
        { name: '인증/수상', value: data.content.totalAwards, color: COLORS[1] },
        { name: '핵심가치', value: data.content.totalCoreValues, color: COLORS[2] },
        { name: '연구분야', value: data.content.researchAreas, color: COLORS[3] },
        { name: '연구성과', value: data.content.researchAchievements, color: COLORS[4] },
    ];

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">통계 대시보드</h1>
                    <p className="text-gray-600 mt-1">
                        마지막 업데이트: {lastRefresh.toLocaleString('ko-KR')}
                    </p>
                </div>
                <Button onClick={fetchStatistics} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    새로고침
                </Button>
            </div>

            {/* 주요 지표 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 방문자</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalVisitors}</div>
                        <div className={`flex items-center text-xs ${getChangeColor(data.overview.visitorChange)}`}>
                            {getChangeIcon(data.overview.visitorChange)}
                            <span className="ml-1">{data.overview.visitorChange}</span>
                            <span className="ml-1 text-muted-foreground">지난 달 대비</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">문의 건수</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalInquiries}</div>
                        <div className={`flex items-center text-xs ${getChangeColor(data.overview.inquiryChange)}`}>
                            {getChangeIcon(data.overview.inquiryChange)}
                            <span className="ml-1">{data.overview.inquiryChange}</span>
                            <span className="ml-1 text-muted-foreground">지난 달 대비</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">제품 조회수</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.totalProductViews}</div>
                        <div className={`flex items-center text-xs ${getChangeColor(data.overview.productViewChange)}`}>
                            {getChangeIcon(data.overview.productViewChange)}
                            <span className="ml-1">{data.overview.productViewChange}</span>
                            <span className="ml-1 text-muted-foreground">지난 달 대비</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.overview.activeUsers}</div>
                        <div className={`flex items-center text-xs ${getChangeColor(data.overview.activeUserChange)}`}>
                            {getChangeIcon(data.overview.activeUserChange)}
                            <span className="ml-1">{data.overview.activeUserChange}</span>
                            <span className="ml-1 text-muted-foreground">지난 달 대비</span>
                        </div>
                    </CardContent>
                </Card>
                    </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 일별 방문자 추이 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            일별 방문자 추이 (최근 30일)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data.dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(value) => new Date(value).toLocaleDateString('ko-KR')}
                                    formatter={(value, name) => [value, name === 'visitors' ? '방문자' : name]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#0088FE"
                                    fill="#0088FE"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 콘텐츠 통계 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            콘텐츠 현황
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={contentChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {contentChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* 상세 통계 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 인기 제품 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            인기 제품 TOP 4
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.trends.popularProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.views.toLocaleString()} 조회</p>
                                        </div>
                                    </div>
                                    <Badge variant={product.change.startsWith('+') ? 'default' : 'secondary'}>
                                        {product.change}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 최근 문의 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            최근 문의 현황
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.trends.recentInquiries.map((inquiry, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <MessageSquare className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{inquiry.type}</p>
                                            <p className="text-sm text-gray-500">{new Date(inquiry.date).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={inquiry.status === '답변완료' ? 'default' : 'secondary'}
                                        className={inquiry.status === '답변완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                    >
                                        {inquiry.status === '답변완료' ? (
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                            <Clock className="h-3 w-3 mr-1" />
                                        )}
                                        {inquiry.status}
                                    </Badge>
                                </div>
                            ))}
                </div>
                    </CardContent>
                </Card>
            </div>

            {/* 일별 상세 통계 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BarChart className="h-5 w-5 mr-2" />
                        일별 상세 통계 (최근 30일)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data.dailyStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleDateString('ko-KR')}
                                formatter={(value, name) => {
                                    const labels = {
                                        visitors: '방문자',
                                        inquiries: '문의',
                                        productViews: '제품 조회'
                                    };
                                    return [value, labels[name as keyof typeof labels] || name];
                                }}
                            />
                            <Bar dataKey="visitors" fill="#0088FE" name="visitors" />
                            <Bar dataKey="inquiries" fill="#00C49F" name="inquiries" />
                            <Bar dataKey="productViews" fill="#FFBB28" name="productViews" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
} 