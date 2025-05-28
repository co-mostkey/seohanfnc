'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, AlertTriangle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ResearchPageData } from '@/types/company';

const initialResearchPageData: ResearchPageData = {
    hero: { title: '', subtitle: '', backgroundColor: 'transparent', backgroundImageUrl: '', backgroundOpacity: 1, backgroundOverlayColor: 'rgba(0,0,0,0.5)' },
    introduction: { title: '', description: '', imageUrl: '' },
    areas: { title: '', items: [] },
    achievements: { title: '', items: [] },
    awardsSectionTitle: '주요 인증 및 특허 현황',
    infrastructure: { title: '', description: '', imageUrl: '' },
};

// 간단한 ID 생성기 (실제 프로덕션에서는 uuid 등을 권장)
const generateId = () => Math.random().toString(36).substr(2, 9);

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // basePath 가져오기

export default function AdminResearchPage() {
    const [data, setData] = useState<ResearchPageData>(initialResearchPageData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async (retries = 3) => {
        setIsLoading(true);
        try {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

            const response = await fetch(`${baseUrl}/api/admin/research-settings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const fetchedData = await response.json();
            // API에서 awardsSectionTitle이 없을 경우 대비하여 기본값 병합
            setData(prev => ({
                ...initialResearchPageData, // 먼저 전체 기본값으로 설정
                ...fetchedData, // API에서 받은 값으로 덮어쓰기
                awardsSectionTitle: fetchedData.awardsSectionTitle || initialResearchPageData.awardsSectionTitle // awardsSectionTitle 보장
            }));
            toast.success('연구개발 설정을 불러왔습니다.');
        } catch (error) {
            console.error("Error fetching research data:", error);

            if (retries > 0 && (error as Error).name !== 'AbortError') {
                console.log(`재시도 중... ${retries}회 남음`);
                setTimeout(() => fetchData(retries - 1), 1000 * (4 - retries));
                return;
            }

            toast.error(`데이터 로딩 실패: ${(error instanceof Error ? error.message : String(error))}`);
            setData(initialResearchPageData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (section: keyof ResearchPageData, field: string, value: any, subField?: string, itemId?: string, itemField?: string) => {
        setData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy

            if (itemId && (section === 'areas' || section === 'achievements')) {
                const sectionItems = newData[section].items as Array<{ id: string;[key: string]: any }>;
                const itemIndex = sectionItems.findIndex(item => item.id === itemId);
                if (itemIndex > -1 && itemField) {
                    sectionItems[itemIndex][itemField] = value;
                }
            } else if (subField && typeof newData[section] === 'object' && newData[section] !== null) {
                (newData[section] as { [key: string]: any })[subField] = value;
            } else if (typeof newData[section] === 'object' && newData[section] !== null && field in newData[section]) {
                (newData[section] as { [key: string]: any })[field] = value;
            } else {
                // This case handles awardsSectionTitle directly if other conditions are not met
                if (field === 'awardsSectionTitle') {
                    (newData as { [key: string]: any })[field] = value;
                } else if (newData.hasOwnProperty(field)) {
                    (newData as { [key: string]: any })[field] = value;
                } else {
                    // Fallback for direct top-level simple fields if necessary, though most are nested.
                    // This might need more specific handling if more top-level simple fields are added.
                    console.warn("Unhandled direct field assignment in handleInputChange:", field);
                }
            }
            return newData;
        });
    };

    const addAreaItem = () => {
        setData(prev => ({
            ...prev,
            areas: {
                ...prev.areas,
                items: [...prev.areas.items, { id: generateId(), icon: 'Lightbulb', title: '', description: '' }]
            }
        }));
    };

    const removeAreaItem = (id: string) => {
        setData(prev => ({
            ...prev,
            areas: { ...prev.areas, items: prev.areas.items.filter(item => item.id !== id) }
        }));
    };

    const addAchievementItem = () => {
        setData(prev => ({
            ...prev,
            achievements: {
                ...prev.achievements,
                items: [...prev.achievements.items, { id: generateId(), year: '', title: '', details: '' }]
            }
        }));
    };

    const removeAchievementItem = (id: string) => {
        setData(prev => ({
            ...prev,
            achievements: { ...prev.achievements, items: prev.achievements.items.filter(item => item.id !== id) }
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const response = await fetch(`${baseUrl}/api/admin/research-settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data), // data에는 researchPage 전체 객체가 포함됨
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to save data: ${response.statusText}`);
            }
            toast.success('연구개발 설정이 성공적으로 저장되었습니다.');
            fetchData();
        } catch (error) {
            console.error("Error saving research data:", error);
            toast.error(`저장 실패: ${(error instanceof Error ? error.message : String(error))}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center">로딩 중...</div>;
    }

    const researchPageUrl = `${basePath}/research`;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Toaster richColors position="top-right" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">연구개발 페이지 설정</h1>
                <Link
                    href={researchPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                >
                    <Button variant="outline">연구개발 페이지 보기</Button>
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* <h1 className="text-3xl font-bold mb-8">연구개발 페이지 설정</h1> */}

                {/* Hero Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>히어로 섹션</CardTitle>
                        <CardDescription>페이지 최상단에 표시되는 내용입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="heroTitle">메인 타이틀</Label>
                            <Input id="heroTitle" value={data.hero.title} onChange={(e) => handleInputChange('hero', 'title', e.target.value, 'title')} />
                        </div>
                        <div>
                            <Label htmlFor="heroSubtitle">서브 타이틀</Label>
                            <Textarea id="heroSubtitle" value={data.hero.subtitle} onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value, 'subtitle')} />
                        </div>
                        <div>
                            <Label htmlFor="heroBgColor">배경색</Label>
                            <Input id="heroBgColor" value={data.hero.backgroundColor || ''} onChange={(e) => handleInputChange('hero', 'backgroundColor', e.target.value, 'backgroundColor')} placeholder="예: #FFFFFF 또는 transparent" />
                        </div>
                        <div>
                            <Label htmlFor="heroBgImageUrl">배경 이미지 URL</Label>
                            <Input id="heroBgImageUrl" value={data.hero.backgroundImageUrl || ''} onChange={(e) => handleInputChange('hero', 'backgroundImageUrl', e.target.value, 'backgroundImageUrl')} placeholder="예: /images/hero-bg.jpg" />
                        </div>
                        <div>
                            <Label htmlFor="heroBgOpacity">배경 이미지 투명도 (0.0 ~ 1.0)</Label>
                            <Input id="heroBgOpacity" type="number" step="0.05" min="0" max="1" value={data.hero.backgroundOpacity || 1} onChange={(e) => handleInputChange('hero', 'backgroundOpacity', parseFloat(e.target.value), 'backgroundOpacity')} />
                        </div>
                        <div>
                            <Label htmlFor="heroOverlayColor">배경 오버레이 색상</Label>
                            <Input id="heroOverlayColor" value={data.hero.backgroundOverlayColor || ''} onChange={(e) => handleInputChange('hero', 'backgroundOverlayColor', e.target.value, 'backgroundOverlayColor')} placeholder="예: rgba(0, 0, 0, 0.5)" />
                        </div>
                    </CardContent>
                </Card>

                {/* Introduction Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>소개 섹션</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="introTitle">소개 타이틀</Label>
                            <Input id="introTitle" value={data.introduction.title} onChange={(e) => handleInputChange('introduction', 'title', e.target.value, 'title')} />
                        </div>
                        <div>
                            <Label htmlFor="introDescription">설명 (줄바꿈으로 문단 구분)</Label>
                            <Textarea id="introDescription" value={data.introduction.description} onChange={(e) => handleInputChange('introduction', 'description', e.target.value, 'description')} rows={5} />
                            <p className="text-sm text-muted-foreground mt-1">여러 문단으로 나누려면 엔터키를 사용하세요. HTML은 지원하지 않습니다.</p>
                        </div>
                        <div>
                            <Label htmlFor="introImageUrl">이미지 URL</Label>
                            <Input id="introImageUrl" value={data.introduction.imageUrl || ''} onChange={(e) => handleInputChange('introduction', 'imageUrl', e.target.value, 'imageUrl')} />
                        </div>
                    </CardContent>
                </Card>

                {/* Areas Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>핵심 연구개발 분야</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="areasTitle">섹션 타이틀</Label>
                            <Input id="areasTitle" value={data.areas.title} onChange={(e) => handleInputChange('areas', 'title', e.target.value, 'title')} />
                        </div>
                        {data.areas.items.map((item, index) => (
                            <Card key={item.id} className="p-4 border">
                                <CardHeader className="p-0 mb-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold">연구 분야 #{index + 1}</h4>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAreaItem(item.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 p-0">
                                    <div>
                                        <Label htmlFor={`areaTitle-${item.id}`}>아이템 타이틀</Label>
                                        <Input id={`areaTitle-${item.id}`} value={item.title} onChange={(e) => handleInputChange('areas', '', e.target.value, '', item.id, 'title')} />
                                    </div>
                                    <div>
                                        <Label htmlFor={`areaIcon-${item.id}`}>아이콘 (Lucide 아이콘 이름)</Label>
                                        <Input id={`areaIcon-${item.id}`} value={item.icon} onChange={(e) => handleInputChange('areas', '', e.target.value, '', item.id, 'icon')} placeholder="예: Cpu, FlaskConical" />
                                        <p className="text-sm text-muted-foreground mt-1">사용 가능한 아이콘 이름은 <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">lucide.dev</a>를 참고하세요.</p>
                                    </div>
                                    <div>
                                        <Label htmlFor={`areaDesc-${item.id}`}>설명</Label>
                                        <Textarea id={`areaDesc-${item.id}`} value={item.description} onChange={(e) => handleInputChange('areas', '', e.target.value, '', item.id, 'description')} rows={3} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" onClick={addAreaItem} className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" /> 연구 분야 추가
                        </Button>
                    </CardContent>
                </Card>

                {/* Achievements Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>대표 연구개발 성과</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="achievementsTitle">섹션 타이틀</Label>
                            <Input id="achievementsTitle" value={data.achievements.title} onChange={(e) => handleInputChange('achievements', 'title', e.target.value, 'title')} />
                        </div>
                        {data.achievements.items.map((item, index) => (
                            <Card key={item.id} className="p-4 border">
                                <CardHeader className="p-0 mb-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold">연구 성과 #{index + 1}</h4>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAchievementItem(item.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 p-0">
                                    <div>
                                        <Label htmlFor={`achYear-${item.id}`}>연도</Label>
                                        <Input id={`achYear-${item.id}`} value={item.year} onChange={(e) => handleInputChange('achievements', '', e.target.value, '', item.id, 'year')} />
                                    </div>
                                    <div>
                                        <Label htmlFor={`achTitle-${item.id}`}>성과 타이틀</Label>
                                        <Input id={`achTitle-${item.id}`} value={item.title} onChange={(e) => handleInputChange('achievements', '', e.target.value, '', item.id, 'title')} />
                                    </div>
                                    <div>
                                        <Label htmlFor={`achDetails-${item.id}`}>상세 내용</Label>
                                        <Textarea id={`achDetails-${item.id}`} value={item.details} onChange={(e) => handleInputChange('achievements', '', e.target.value, '', item.id, 'details')} rows={3} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" onClick={addAchievementItem} className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" /> 연구 성과 추가
                        </Button>
                    </CardContent>
                </Card>

                {/* Awards Section Title */}
                <Card>
                    <CardHeader>
                        <CardTitle>인증 및 특허 섹션</CardTitle>
                        <CardDescription>
                            연구개발 페이지에 표시될 "인증 및 특허" 섹션의 제목을 설정합니다.
                            <br />실제 인증 및 특허 항목들은
                            <Link href={`${basePath}/admin/company`} className="underline text-primary hover:text-primary/80"> 회사 정보 관리</Link>
                            페이지에서 통합 관리됩니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="awardsSectionTitleVal">섹션 제목</Label>
                            <Input
                                id="awardsSectionTitleVal"
                                value={data.awardsSectionTitle}
                                onChange={(e) => handleInputChange('researchPage' as any, 'awardsSectionTitle', e.target.value, 'awardsSectionTitle')}
                            />
                        </div>
                        <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md">
                            <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0" />
                                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                    <p className="font-semibold">데이터 연동 안내</p>
                                    <p>이곳에서는 연구개발 페이지의 "인증 및 특허" 섹션 <span className="font-bold">제목만</span> 수정할 수 있습니다. <br />표시되는 실제 인증서 및 특허 항목들은 회사 전체 데이터와 연동되며,
                                        <Link href={`${basePath}/admin/company`} className="font-semibold underline hover:text-yellow-500 dark:hover:text-yellow-200"> 회사 정보 관리</Link> 페이지의 "인증 및 수상" 섹션에서 관리할 수 있습니다.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Infrastructure Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>연구 인프라 섹션</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="infraTitle">타이틀</Label>
                            <Input id="infraTitle" value={data.infrastructure.title} onChange={(e) => handleInputChange('infrastructure', 'title', e.target.value, 'title')} />
                        </div>
                        <div>
                            <Label htmlFor="infraDescription">설명 (줄바꿈으로 문단 구분)</Label>
                            <Textarea id="infraDescription" value={data.infrastructure.description} onChange={(e) => handleInputChange('infrastructure', 'description', e.target.value, 'description')} rows={5} />
                            <p className="text-sm text-muted-foreground mt-1">여러 문단으로 나누려면 엔터키를 사용하세요. HTML은 지원하지 않습니다.</p>
                        </div>
                        <div>
                            <Label htmlFor="infraImageUrl">이미지 URL</Label>
                            <Input id="infraImageUrl" value={data.infrastructure.imageUrl || ''} onChange={(e) => handleInputChange('infrastructure', 'imageUrl', e.target.value, 'imageUrl')} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button type="submit" disabled={isSaving || isLoading} className="w-full sm:w-auto">
                        {isSaving ? '저장 중...' : '연구개발 설정 저장'}
                    </Button>
                    <Link
                        href={researchPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-block"
                    >
                        <Button type="button" variant="outline" className="w-full">연구개발 페이지 미리보기</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
} 