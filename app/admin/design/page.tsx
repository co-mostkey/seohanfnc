"use client";

import React, { useEffect, useState } from 'react';
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_UI, ADMIN_CARD_STYLES, ADMIN_BUTTON_SIZES } from '@/lib/admin-ui-constants';
import { DesignSettings } from '@/types/design';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColorPickerInput } from '@/components/admin/ColorPickerInput';
import { Save, RotateCcw, Eye, Palette, Type, Sliders, RefreshCw, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUpload } from '@/components/admin/FileUpload';

// 사전 정의된 테마 팔레트
const THEME_PRESETS = {
    default: {
        primaryColor: '#FF7A00',
        secondaryColor: '#1E293B',
        accentColor: '#4463ef',
        backgroundColor: '#121212',
        textColor: '#ffffff',
        darkMode: true,
    },
    light: {
        primaryColor: '#FF7A00',
        secondaryColor: '#f1f5f9',
        accentColor: '#3451e6',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        darkMode: false,
    },
    dark: {
        primaryColor: '#FF7A00',
        secondaryColor: '#1e293b',
        accentColor: '#4463ef',
        backgroundColor: '#0f1116',
        textColor: '#f1f5f9',
        darkMode: true,
    },
    blue: {
        primaryColor: '#0070f3',
        secondaryColor: '#2e3748',
        accentColor: '#f97316',
        backgroundColor: '#121212',
        textColor: '#ffffff',
        darkMode: true,
    },
    green: {
        primaryColor: '#10b981',
        secondaryColor: '#1e293b',
        accentColor: '#f59e0b',
        backgroundColor: '#111111',
        textColor: '#ffffff',
        darkMode: true,
    }
};

const defaultSettings: DesignSettings = {
    logoUrl: '/logo.png',
    primaryColor: '#FF7A00',
    secondaryColor: '#1E293B',
    accentColor: '#4463ef',
    backgroundColor: '#121212',
    textColor: '#ffffff',
    footerText: '© 2025 서한F&C. All rights reserved.',
    darkMode: true,
    fontPrimary: 'Pretendard',
    fontSecondary: 'Arial',
    borderRadius: 'medium',
    fontSize: 'medium',
    spacing: 'medium',
};

export default function AdminDesignPage() {
    const [settings, setSettings] = useState<DesignSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [mobilePreview, setMobilePreview] = useState(false);
    const [originalSettings, setOriginalSettings] = useState<DesignSettings>(defaultSettings);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/design');
                if (res.ok) {
                    const json = await res.json();
                    const mergedSettings = { ...defaultSettings, ...json };
                    setSettings(mergedSettings);
                    setOriginalSettings(mergedSettings);
                }
            } catch (e) {
                console.error(e);
                toast.error('디자인 설정을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field: keyof DesignSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSwitchChange = (field: keyof DesignSettings) => (checked: boolean) => {
        setSettings(prev => ({ ...prev, [field]: checked }));
    };

    const handleSelectChange = (field: keyof DesignSettings) => (value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleColorChange = (field: keyof DesignSettings) => (color: string) => {
        setSettings(prev => ({ ...prev, [field]: color }));
    };

    const handleLogoUpload = (uploadedFile: { url: string; filename: string; originalName?: string }) => {
        setSettings(prev => ({ ...prev, logoUrl: uploadedFile.url }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/admin/design', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            toast.success('디자인 설정이 저장되었습니다.');
            setOriginalSettings(settings);
        } catch (e) {
            console.error(e);
            toast.error('저장 실패');
        } finally {
            setSaving(false);
        }
    };

    const resetChanges = () => {
        setSettings(originalSettings);
        toast.info('변경 사항이 초기화되었습니다.');
    };

    const applyThemePreset = (presetKey: keyof typeof THEME_PRESETS) => {
        const preset = THEME_PRESETS[presetKey];
        setSettings(prev => ({
            ...prev,
            ...preset
        }));
        toast.success(`${presetKey} 테마가 적용되었습니다.`);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent" />
            </div>
        );
    }

    // 미리보기 CSS 스타일 생성
    const previewStyle = {
        '--primary-color': settings.primaryColor,
        '--secondary-color': settings.secondaryColor,
        '--accent-color': settings.accentColor,
        '--text-color': settings.textColor,
        '--background-color': settings.backgroundColor,
        fontFamily: settings.fontPrimary,
        color: settings.textColor,
        backgroundColor: settings.backgroundColor,
    } as React.CSSProperties;

    // 테두리 반경 클래스 결정
    const getBorderRadiusClass = () => {
        switch (settings.borderRadius) {
            case 'none': return 'rounded-none';
            case 'small': return 'rounded-sm';
            case 'medium': return 'rounded-md';
            case 'large': return 'rounded-lg';
            case 'full': return 'rounded-full';
            default: return 'rounded-md';
        }
    };

    // 글꼴 크기 클래스 결정
    const getFontSizeClass = () => {
        switch (settings.fontSize) {
            case 'small': return 'text-sm';
            case 'medium': return 'text-base';
            case 'large': return 'text-lg';
            default: return 'text-base';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>디자인 설정</h1>
                <div className="space-x-2">
                    <Button onClick={() => setPreviewOpen(true)} variant="outline" className={`${ADMIN_UI.BUTTON_OUTLINE}`} style={ADMIN_FONT_STYLES.BUTTON}><Eye className="h-4 w-4 mr-1" /> 미리보기</Button>
                    <Button onClick={resetChanges} variant="outline" className={`${ADMIN_UI.BUTTON_OUTLINE}`} style={ADMIN_FONT_STYLES.BUTTON}><RotateCcw className="h-4 w-4 mr-1" /> 되돌리기</Button>
                    <Button onClick={handleSave} disabled={saving} className={`${ADMIN_UI.BUTTON_PRIMARY}`} style={ADMIN_FONT_STYLES.BUTTON}><Save className="h-4 w-4 mr-1" />{saving ? '저장 중...' : '저장'}</Button>
                </div>
            </div>

            <Tabs defaultValue="colors" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="colors" className="flex items-center"><Palette className="h-4 w-4 mr-1" /> 색상</TabsTrigger>
                    <TabsTrigger value="typography" className="flex items-center"><Type className="h-4 w-4 mr-1" /> 타이포그래피</TabsTrigger>
                    <TabsTrigger value="themes" className="flex items-center"><RefreshCw className="h-4 w-4 mr-1" /> 테마</TabsTrigger>
                    <TabsTrigger value="general" className="flex items-center"><Sliders className="h-4 w-4 mr-1" /> 일반</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-4">
                    <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-6 space-y-4`}>
                        <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>색상 설정</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm">메인 색상 (Primary)</label>
                                <ColorPickerInput
                                    value={settings.primaryColor || '#FF7A00'}
                                    onColorChange={handleColorChange('primaryColor')}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">보조 색상 (Secondary)</label>
                                <ColorPickerInput
                                    value={settings.secondaryColor || '#1E293B'}
                                    onColorChange={handleColorChange('secondaryColor')}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">강조 색상 (Accent)</label>
                                <ColorPickerInput
                                    value={settings.accentColor || '#4463ef'}
                                    onColorChange={handleColorChange('accentColor')}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">배경 색상</label>
                                <ColorPickerInput
                                    value={settings.backgroundColor || '#121212'}
                                    onColorChange={handleColorChange('backgroundColor')}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">텍스트 색상</label>
                                <ColorPickerInput
                                    value={settings.textColor || '#ffffff'}
                                    onColorChange={handleColorChange('textColor')}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                            <Switch
                                id="dark-mode"
                                checked={settings.darkMode}
                                onCheckedChange={handleSwitchChange('darkMode')}
                            />
                            <Label htmlFor="dark-mode">다크 모드 사용</Label>
                        </div>

                        <div className="mt-4 p-3 border rounded-md border-gray-700/30">
                            <span className="text-xs text-gray-400">색상 미리보기</span>
                            <div className="grid grid-cols-5 gap-3 mt-2">
                                <div className="flex flex-col items-center">
                                    <div className="w-full h-12 rounded-md" style={{ backgroundColor: settings.primaryColor }}></div>
                                    <span className="text-xs mt-1">Primary</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-full h-12 rounded-md" style={{ backgroundColor: settings.secondaryColor }}></div>
                                    <span className="text-xs mt-1">Secondary</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-full h-12 rounded-md" style={{ backgroundColor: settings.accentColor }}></div>
                                    <span className="text-xs mt-1">Accent</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-full h-12 rounded-md" style={{ backgroundColor: settings.backgroundColor }}></div>
                                    <span className="text-xs mt-1">Background</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-full h-12 rounded-md flex items-center justify-center" style={{ backgroundColor: settings.backgroundColor }}>
                                        <span style={{ color: settings.textColor }}>Aa</span>
                                    </div>
                                    <span className="text-xs mt-1">Text</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-4">
                    <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-6 space-y-4`}>
                        <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>타이포그래피 설정</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm">기본 폰트</label>
                                <Select
                                    value={settings.fontPrimary}
                                    onValueChange={handleSelectChange('fontPrimary')}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="폰트 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pretendard">Pretendard</SelectItem>
                                        <SelectItem value="Noto Sans KR">Noto Sans KR</SelectItem>
                                        <SelectItem value="Malgun Gothic">맑은 고딕</SelectItem>
                                        <SelectItem value="Dotum">돋움</SelectItem>
                                        <SelectItem value="Gulim">굴림</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">보조 폰트</label>
                                <Select
                                    value={settings.fontSecondary}
                                    onValueChange={handleSelectChange('fontSecondary')}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="폰트 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Arial">Arial</SelectItem>
                                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                                        <SelectItem value="Verdana">Verdana</SelectItem>
                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                        <SelectItem value="Georgia">Georgia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">글꼴 크기</label>
                                <Select
                                    value={settings.fontSize || 'medium'}
                                    onValueChange={handleSelectChange('fontSize')}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="글꼴 크기 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">작게</SelectItem>
                                        <SelectItem value="medium">보통</SelectItem>
                                        <SelectItem value="large">크게</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div>
                            <label className="block mb-1 text-sm">테두리 반경</label>
                            <RadioGroup
                                value={settings.borderRadius || 'medium'}
                                onValueChange={handleSelectChange('borderRadius')}
                                className="flex items-center space-x-4"
                            >
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="none" id="r-none" />
                                    <Label htmlFor="r-none">없음</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="small" id="r-small" />
                                    <Label htmlFor="r-small">작게</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="medium" id="r-medium" />
                                    <Label htmlFor="r-medium">중간</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="large" id="r-large" />
                                    <Label htmlFor="r-large">크게</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="full" id="r-full" />
                                    <Label htmlFor="r-full">원형</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="mt-6 p-4 border rounded-md border-gray-700/30">
                            <span className="text-xs text-gray-400">타이포그래피 미리보기</span>
                            <div className="mt-2">
                                <h1 style={{ fontFamily: settings.fontPrimary, fontSize: '1.5rem' }}>제목 텍스트입니다</h1>
                                <p style={{ fontFamily: settings.fontPrimary, fontSize: '0.9rem' }}>기본 폰트를 사용한 본문 텍스트입니다.</p>
                                <p style={{ fontFamily: settings.fontSecondary, fontSize: '0.9rem' }}>Secondary font sample text.</p>
                                <div className="mt-3 flex items-center space-x-3">
                                    <button className={`px-3 py-1.5 bg-green-600 text-white ${getBorderRadiusClass()}`}>
                                        버튼 예시
                                    </button>
                                    <button className={`px-3 py-1.5 border border-gray-500 ${getBorderRadiusClass()}`}>
                                        테두리 버튼
                                    </button>
                                    <span className={`inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 ${getBorderRadiusClass()}`}>
                                        태그
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="themes" className="space-y-4">
                    <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-6 space-y-4`}>
                        <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>테마 프리셋</h2>
                        <p className="text-sm text-gray-400">사전 정의된 테마를 적용하여 디자인을 빠르게 변경할 수 있습니다.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            {Object.entries(THEME_PRESETS).map(([key, theme]) => (
                                <div
                                    key={key}
                                    className="border rounded-md p-4 cursor-pointer hover:border-orange-500 transition-colors"
                                    onClick={() => applyThemePreset(key as keyof typeof THEME_PRESETS)}
                                    style={{
                                        backgroundColor: theme.backgroundColor,
                                        color: theme.textColor
                                    }}
                                >
                                    <h3 className="text-lg font-medium capitalize mb-2" style={{ color: theme.primaryColor }}>
                                        {key} 테마
                                    </h3>
                                    <div className="flex space-x-2 mb-3">
                                        {['primaryColor', 'secondaryColor', 'accentColor'].map(color => (
                                            <div
                                                key={color}
                                                className="w-6 h-6 rounded-full border border-gray-500/30"
                                                style={{
                                                    backgroundColor: theme[color as keyof typeof theme] as string
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs">
                                            {theme.darkMode ? '다크 모드' : '라이트 모드'}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 text-xs rounded px-2"
                                            style={{
                                                backgroundColor: theme.primaryColor,
                                                color: '#fff',
                                                borderColor: 'transparent'
                                            }}
                                        >
                                            적용
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="general" className="space-y-4">
                    <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-6 space-y-4`}>
                        <h2 className={ADMIN_HEADING_STYLES.SECTION_TITLE} style={ADMIN_FONT_STYLES.SECTION_TITLE}>일반 설정</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm">로고 이미지</label>
                                <div className="mb-3 flex items-center space-x-4">
                                    <div className="w-[160px] h-[60px] flex items-center justify-center border border-gray-700/40 rounded-md bg-gray-800/30">
                                        {settings.logoUrl ? (
                                            <img
                                                src={settings.logoUrl}
                                                alt="Logo"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400">로고 없음</span>
                                        )}
                                    </div>
                                    <FileUpload
                                        endpoint="/api/admin/design/upload"
                                        fileType="image"
                                        onUploadSuccess={handleLogoUpload}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">푸터 텍스트</label>
                                <Textarea className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} value={settings.footerText || ''} onChange={handleChange('footerText')} />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">간격 설정</label>
                                <Select
                                    value={settings.spacing || 'medium'}
                                    onValueChange={handleSelectChange('spacing')}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="간격 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="compact">좁게</SelectItem>
                                        <SelectItem value="medium">보통</SelectItem>
                                        <SelectItem value="loose">넓게</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* 미리보기 다이얼로그 */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className={`${ADMIN_CARD_STYLES.DEFAULT} max-w-3xl w-full p-0 overflow-hidden`}>
                    <DialogHeader className="p-4 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                            <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>테마 미리보기</DialogTitle>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setMobilePreview(!mobilePreview)}
                                className="flex items-center"
                            >
                                <Smartphone className="h-4 w-4 mr-1" />
                                {mobilePreview ? '데스크탑 보기' : '모바일 보기'}
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="p-4">
                        <div className={`${mobilePreview ? 'w-[375px] mx-auto' : 'w-full'} transition-all duration-300`}>
                            <div className="border border-gray-700/40 rounded-lg overflow-hidden" style={previewStyle}>
                                <header className="flex justify-between items-center p-4 border-b" style={{ borderColor: `${settings.textColor}20` }}>
                                    {settings.logoUrl ? (
                                        <img
                                            src={settings.logoUrl}
                                            alt="Logo"
                                            className="h-8 object-contain"
                                        />
                                    ) : (
                                        <div style={{ color: settings.primaryColor, fontWeight: 'bold', fontSize: '1.25rem' }}>
                                            서한F&C
                                        </div>
                                    )}
                                    <nav className="flex gap-4">
                                        <a href="#" style={{ color: settings.primaryColor }} className={getFontSizeClass()}>홈</a>
                                        <a href="#" className={getFontSizeClass()}>제품</a>
                                        <a href="#" className={getFontSizeClass()}>소개</a>
                                        <a href="#" className={getFontSizeClass()}>문의</a>
                                    </nav>
                                </header>

                                <main className="p-6">
                                    <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: settings.primaryColor }}>
                                        웹사이트 디자인 미리보기
                                    </h1>
                                    <p className={`mb-4 ${getFontSizeClass()}`}>
                                        이 페이지는 현재 선택한 디자인 설정을 적용한 미리보기입니다.
                                    </p>

                                    <div className={`p-4 mt-4 ${getBorderRadiusClass()}`} style={{ backgroundColor: `${settings.secondaryColor}80` }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                            테마 샘플 요소
                                        </h3>
                                        <p className={`${getFontSizeClass()}`} style={{ fontSize: '0.9rem' }}>
                                            여러 디자인 요소가 적용된 카드 컴포넌트입니다.
                                        </p>
                                        <div className="flex space-x-2 mt-3">
                                            <button className={`px-4 py-2 ${getBorderRadiusClass()}`} style={{ backgroundColor: settings.primaryColor, color: '#fff' }}>
                                                버튼 예시
                                            </button>
                                            <button className={`px-4 py-2 ${getBorderRadiusClass()} border`} style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}>
                                                보조 버튼
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className={`p-3 ${getBorderRadiusClass()}`} style={{ backgroundColor: `${settings.accentColor}20` }}>
                                            <h4 className={`text-sm font-medium ${getFontSizeClass()}`} style={{ color: settings.accentColor }}>기능 1</h4>
                                            <p className="text-sm mt-1">간략한 설명 텍스트</p>
                                        </div>
                                        <div className={`p-3 ${getBorderRadiusClass()}`} style={{ backgroundColor: `${settings.accentColor}20` }}>
                                            <h4 className={`text-sm font-medium ${getFontSizeClass()}`} style={{ color: settings.accentColor }}>기능 2</h4>
                                            <p className="text-sm mt-1">간략한 설명 텍스트</p>
                                        </div>
                                    </div>
                                </main>

                                <footer className="px-6 py-4 border-t text-sm" style={{ borderColor: `${settings.textColor}20` }}>
                                    {settings.footerText}
                                </footer>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 