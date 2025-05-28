"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_UI, ADMIN_CARD_STYLES, ADMIN_BUTTON_SIZES, ADMIN_INPUT_STYLES } from '@/lib/admin-ui-constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CompanyInfo, Logo3DSettings, CoreValueItem, AwardItem, HistoryStyles } from '@/types/company';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileUpload } from '@/components/admin/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    ImageIcon, Info, MessageSquareText, Sparkles, Building, Users, Phone, Mail, LinkIcon, MapPin, Clock, Globe, Edit3, AlignLeft,
    RotateCcw, Save, TrendingUp, ImagePlus, Wallpaper, Eye, EyeOff, Palette, Cog, Rotate3d, Target, Brain, BriefcaseBusiness,
    ScrollText, Award, Gem, PlusCircle, Trash2, GripVertical, ExternalLink,
    CheckCheck, Lightbulb, Handshake, Scale, Recycle, // coreValues 아이콘들
    CheckCircle, // 추가
    FlaskConical, // 추가
    ShieldCheck // 추가
} from 'lucide-react';
import type { LucideProps } from 'lucide-react'; // Import LucideProps
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Select 컴포넌트 임포트
import Logo3D from '@/components/ui/3D/Logo3D'; // Logo3D 컴포넌트 임포트
import HistoryTimeline from '@/components/admin/HistoryTimeline'; // Import HistoryTimeline component
import { Download } from 'lucide-react'; // Import Download icon

// Lucide 아이콘 이름과 실제 컴포넌트를 매핑하는 객체 (파일 최상단으로 이동)
const LucideIcons: { [key: string]: React.FC<LucideProps> } = { // Update type here
    Award,
    Building,
    CheckCircle, // 수정: CheckCircle 임포트 후, CheckCircle, 형태로 사용
    Cpu: Cog, // Cpu 아이콘이 없으므로 Cog로 대체 (또는 다른 적절한 아이콘)
    FlaskConical, // 수정: FlaskConical 임포트 후, FlaskConical, 형태로 사용
    Lightbulb,
    Recycle,
    ShieldCheck, // 수정: ShieldCheck 임포트 후, ShieldCheck, 형태로 사용 (또는 ShieldCheck: ShieldCheck)
    Users,
    Zap: Sparkles, // Zap 아이콘이 없으므로 Sparkles로 대체
    Target,
    Gem,
    Handshake,
    TrendingUp,
    Landmark: Building, // Landmark 아이콘이 없으므로 Building으로 대체
    History: ScrollText, // History 아이콘이 없으므로 ScrollText로 대체
    Sparkles,
    ImageIcon,
    MessageSquareText,
    Info,
    Phone,
    Mail,
    LinkIcon,
    MapPin,
    Clock,
    Globe,
    Edit3,
    AlignLeft,
    RotateCcw,
    Save,
    ImagePlus,
    Wallpaper,
    Eye,
    EyeOff,
    Palette,
    Cog,
    Rotate3d,
    Brain,
    BriefcaseBusiness,
    ScrollText,
    PlusCircle,
    Trash2,
    GripVertical,
    ExternalLink,
    CheckCheck,
    Scale,
};

const defaultLogo3DSettings: Logo3DSettings = {
    enableRotation: true,
    rotationSpeed: 0.0015,
    stylePreset: 'default',
    modelScale: 1,
    glbFileUrl: '',
    viewerBackgroundType: 'transparent', // 기본값: 투명
    viewerBackgroundColor: '#FFFFFF', // 기본 배경색 (타입이 'color'일 때 사용)
    viewerBackgroundHdriPath: '', // 빈 문자열로 변경하여 404 오류 방지
};

const defaultData: CompanyInfo = {
    id: 'default',
    nameKo: '',
    nameEn: '',
    addressKo: '',
    addressEn: '',
    phone: '',
    fax: '',
    email: '',
    supportEmail: '',
    businessHours: '',
    CEO: '',
    businessNumber: '',
    established: '',
    description: '',
    intro: '',
    philosophy: '',
    aboutPageMainTitleFormat: '{nameKo} 회사소개',
    aboutPageSectionTitleFormat: '안전 기술의 미래, <br className="hidden sm:block" /> {nameKo}가 만들어갑니다.',
    aboutPageMainTitleClassName: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight tracking-tight text-primary-500', // 키컬러(primary-500)로 변경
    logoUrl: '',
    aboutPageVisualUrl: '',
    aboutPageHeroImageUrl: '',
    showAboutIntroSection: true,
    logo3dSettings: { ...defaultLogo3DSettings },
    socialLinks: { facebook: '', instagram: '', youtube: '', blog: '', linkedin: '' },
    philosophyStatement: '',
    coreValues: [
        { id: 'safety', icon: 'CheckCheck', mainTitle: '안전 제일', subTitle: '모든 활동의 최우선 가치는 사람의 안전입니다.', description: '안전 규정 및 표준 준수\n철저한 위험성 평가 및 예방\n안전 의식 내재화를 위한 교육 강화\n안전한 작업 환경 조성' },
        { id: 'innovation', icon: 'Lightbulb', mainTitle: '기술 혁신', subTitle: '끊임없는 연구개발로 안전 기술의 미래를 선도합니다.', description: '지속적인 R&D 투자 확대\n차세대 안전 기술 및 신소재 개발\n창의적인 아이디어 발굴 및 사업화\n변화를 두려워하지 않는 도전 정신' },
        { id: 'customer', icon: 'Handshake', mainTitle: '고객 중심', subTitle: '고객의 신뢰와 만족을 최고의 가치로 생각합니다.', description: '고객의 소리에 귀 기울이는 소통\n고객의 기대를 뛰어넘는 제품과 서비스\n신속하고 정확한 기술 지원\n고객과의 장기적인 파트너십 구축' },
        { id: 'integrity', icon: 'Scale', mainTitle: '정직과 신뢰', subTitle: '투명하고 윤리적인 경영으로 사회적 책임을 다합니다.', description: '법규 및 윤리 규범 준수\n공정하고 투명한 업무 처리\n정직한 기업 문화 조성\n이해관계자와의 신뢰 관계 구축' },
        { id: 'sustainability', icon: 'Recycle', mainTitle: '지속가능경영', subTitle: '환경과 사회를 생각하며 미래 세대를 위한 가치를 만듭니다.', description: '친환경 제품 개발 및 생산 확대\n에너지 효율 개선 및 탄소 배출 감축\n자원 재활용 및 폐기물 관리 강화\n지역사회 공헌 및 상생 협력' },
    ],
    businessType: `소방안전 장비
공기안전매트, 완강기, 구조대 등 다양한 소방안전 장비 개발 및 생산
- 공기안전매트
    - 완강기 및 간이완강기
- 인명구조대
    - 소화기 및 소화장치

산업안전 솔루션
산업 현장의 안전을 위한 다양한 솔루션 제공
    - 산업용 안전 장비
        - 안전 방재 시스템
            - 안전 교육 및 훈련
                - 위험 평가 및 컨설팅

연구개발
미래 안전 기술을 위한 지속적인 연구개발
    - 신소재 개발
        - 안전 기술 연구
            - 제품 품질 향상
                - 산학 협력 프로젝트`,
    employees: '',
    annualRevenue: '',
    website: '',
    history: `2018년
01월: ISO 9001: 2015 인증 획득[Q209412]
09월: 한국산업은행으로 부터 4차 산업 유망기업인[KDB - TECH]기업으로 선정

2017년
03월: [완강기] 및[간이완강기] 신규 형식승인 취득
03월: 초동대처 기동형[인명구조매트] 개발 KFI 인증 취득
05월: 터키 공기안전매트 수출
10월: [충청북도 중소기업 경영대상] 수상 - 충청북도 도지사상

2016년
01월: 충주시 '성실납세자' 3년 연속 선정
02월: 서울 동국대학교와 산학협력 연구기술 협약 체결
03월: 연구소기업 '(주) 서한 디앤에스' 설립
04월: 베트남 경찰국 관공서 공기안전매트 / 이동식 구조대 4차 수출

2015년
03월: '중소기업청'으로부터[수출 유망 기업]으로 선정
05월: 몽골 소방방재청 공기안전매트 / 소방차용 구조대 3차 수출
12월: '여성가족부'의[가족친화 인증기업]인증

2000년
03월: (주) 서한 에프 앤 씨로 법인 전환

1992년
05월: 서한상사 설립`,
    vision: `서한에프앤씨는 끊임없는 기술 개발과 최고의 품질을 바탕으로,\n전 세계 고객에게 가장 신뢰받는 안전 솔루션을 제공하여\n인류의 안전과 행복 증진에 기여하는 것을 목표로 합니다.`,
    awardsAndCertifications: [],
    latitude: '',
    longitude: '',
    mapApiKey: '',
    directions: '',
    transportation: '',
};

const AdminCompanyPage = () => {
    const [data, setData] = useState<CompanyInfo>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [originalData, setOriginalData] = useState<CompanyInfo>(defaultData);
    const [logo3dUpdating, setLogo3dUpdating] = useState(false); // 3D 로고 업데이트 상태
    const [historyStyleDialogOpen, setHistoryStyleDialogOpen] = useState(false); // 연혁 스타일 다이얼로그 상태
    const [historyCustomStyles, setHistoryCustomStyles] = useState<HistoryStyles>({
        colorScheme: 'default', // default, blue, green, purple, orange
        timelineStyle: 'modern', // modern, classic, minimal
        showIcons: true,
        showDates: true,
        compactMode: false
    }); // 연혁 커스텀 스타일 상태
    const [originalHistoryStyles, setOriginalHistoryStyles] = useState<HistoryStyles>(historyCustomStyles); // 원본 스타일 저장용

    // 3D 로고 설정 디바운싱을 위한 ref
    const logo3dUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 3D 로고 설정을 메모이제이션하여 불필요한 재렌더링 방지
    const memoizedLogo3DSettings = useMemo(() => {
        return data.logo3dSettings || defaultLogo3DSettings;
    }, [data.logo3dSettings]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('Admin Company Page - Fetching data...');
                const res = await fetch('/api/admin/company', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });

                console.log('Admin Company Page - Response status:', res.status);

                if (res.ok) {
                    const fetchedData = await res.json();
                    console.log('Admin Company Page - Data fetched successfully:', fetchedData);

                    const newSocialLinks = {
                        ...(defaultData.socialLinks || {}),
                        ...(fetchedData.socialLinks || {}),
                    };
                    const newLogo3DSettings = { // Logo3DSettings 병합 로직 강화
                        ...defaultLogo3DSettings, // 기본값으로 시작
                        ...(fetchedData.logo3dSettings || {}), // 저장된 값으로 덮어쓰기
                        // glbFileUrl은 fetchedData 우선, 없으면 defaultData (이미 defaultLogo3DSettings에 포함됨)
                        glbFileUrl: fetchedData.logo3dSettings?.glbFileUrl || defaultLogo3DSettings.glbFileUrl,
                        // 나머지 필드들도 fetchedData 우선 적용 (이미 스프레드 연산자로 처리됨)
                    };
                    const mergedData = {
                        ...defaultData,
                        ...fetchedData,
                        socialLinks: newSocialLinks,
                        showAboutIntroSection: fetchedData.showAboutIntroSection !== undefined ? fetchedData.showAboutIntroSection : defaultData.showAboutIntroSection,
                        logo3dSettings: newLogo3DSettings,
                        philosophyStatement: fetchedData.philosophyStatement || defaultData.philosophyStatement || '',
                        coreValues: (fetchedData.coreValues && fetchedData.coreValues.length > 0) ? fetchedData.coreValues : defaultData.coreValues || [],
                        awardsAndCertifications: (fetchedData.awardsAndCertifications && fetchedData.awardsAndCertifications.length > 0) ? fetchedData.awardsAndCertifications : defaultData.awardsAndCertifications || [],
                        aboutPageMainTitleClassName: fetchedData.aboutPageMainTitleClassName || defaultData.aboutPageMainTitleClassName,
                    };
                    setData(mergedData);
                    setOriginalData(mergedData);

                    // 연혁 스타일 설정 로드
                    if (mergedData.historyStyles) {
                        setHistoryCustomStyles(mergedData.historyStyles);
                        setOriginalHistoryStyles(mergedData.historyStyles);
                    }
                } else {
                    console.error('Admin Company Page - Response not ok:', res.status, res.statusText);
                    const errorText = await res.text();
                    console.error('Admin Company Page - Error response:', errorText);
                    toast.error(`회사 정보를 불러오는데 실패했습니다. (${res.status})`);
                    setData(defaultData);
                    setOriginalData(defaultData);
                }
            } catch (error) {
                console.error('Admin Company Page - Fetch error:', error);
                toast.error(`회사 정보 로딩 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);

                // 오류 발생 시에도 기본 데이터 구조를 유지
                const fallbackData = {
                    ...defaultData,
                    awardsAndCertifications: defaultData.awardsAndCertifications || [],
                    historyStyles: {
                        colorScheme: 'default' as const,
                        timelineStyle: 'modern' as const,
                        showIcons: true,
                        showDates: true,
                        compactMode: false
                    }
                };
                setData(fallbackData);
                setOriginalData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            if (logo3dUpdateTimeoutRef.current) {
                clearTimeout(logo3dUpdateTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, parent?: keyof CompanyInfo | 'logo3dSettings') => {
        const { name, value } = e.target;
        if (parent === 'logo3dSettings') {
            // 3D 로고 설정 변경 시 디바운싱 적용
            setLogo3dUpdating(true);

            if (logo3dUpdateTimeoutRef.current) {
                clearTimeout(logo3dUpdateTimeoutRef.current);
            }

            setData(prev => ({
                ...prev,
                logo3dSettings: {
                    ...(prev.logo3dSettings || {}),
                    [name]: (name === 'rotationSpeed' || name === 'modelScale') ? parseFloat(value) : value,
                },
            }));

            logo3dUpdateTimeoutRef.current = setTimeout(() => {
                setLogo3dUpdating(false);
            }, 500); // 300ms에서 500ms로 증가
        } else if (parent) {
            setData(prev => ({
                ...prev,
                [parent as keyof CompanyInfo]: {
                    ...(prev[parent as keyof CompanyInfo] as object),
                    [name]: value,
                },
            }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSwitchChange = (checked: boolean, name: keyof CompanyInfo | keyof Logo3DSettings, parent?: 'logo3dSettings') => {
        if (parent === 'logo3dSettings') {
            // 3D 로고 설정 변경 시 디바운싱 적용
            setLogo3dUpdating(true);

            if (logo3dUpdateTimeoutRef.current) {
                clearTimeout(logo3dUpdateTimeoutRef.current);
            }

            setData(prev => ({
                ...prev,
                logo3dSettings: {
                    ...(prev.logo3dSettings || {}),
                    [name as keyof Logo3DSettings]: checked,
                },
            }));

            logo3dUpdateTimeoutRef.current = setTimeout(() => {
                setLogo3dUpdating(false);
            }, 500); // 300ms에서 500ms로 증가
        } else {
            setData(prev => ({ ...prev, [name as keyof CompanyInfo]: checked }));
        }
    };

    const handleSliderChange = (value: number[], name: keyof Logo3DSettings, parent: 'logo3dSettings') => {
        if (parent === 'logo3dSettings') {
            // 3D 로고 설정 변경 시 디바운싱 적용
            setLogo3dUpdating(true);

            if (logo3dUpdateTimeoutRef.current) {
                clearTimeout(logo3dUpdateTimeoutRef.current);
            }

            setData(prev => ({
                ...prev,
                logo3dSettings: {
                    ...(prev.logo3dSettings || {}),
                    [name]: value[0],
                }
            }));

            logo3dUpdateTimeoutRef.current = setTimeout(() => {
                setLogo3dUpdating(false);
            }, 500); // 300ms에서 500ms로 증가
        }
    };

    const handleLogoUpload = (uploadedFile: { url: string }) => {
        setData(prev => ({ ...prev, logoUrl: uploadedFile.url }));
        toast.success('회사 로고가 업로드되었습니다. 변경사항을 저장해주세요.');
    };

    const handleAboutVisualUpload = (uploadedFile: { url: string }) => {
        setData(prev => ({ ...prev, aboutPageVisualUrl: uploadedFile.url }));
        toast.success('About 페이지 대표 이미지가 업로드되었습니다. 변경사항을 저장해주세요.');
    };

    const handleAboutHeroImageUpload = (uploadedFile: { url: string }) => {
        setData(prev => ({ ...prev, aboutPageHeroImageUrl: uploadedFile.url }));
        toast.success('About 페이지 히어로 이미지가 업로드되었습니다. 변경사항을 저장해주세요.');
    };

    const handleLogo3DGlbUpload = (uploadedFile: { url: string }) => {
        setData(prev => ({
            ...prev,
            logo3dSettings: {
                ...(prev.logo3dSettings || defaultLogo3DSettings),
                glbFileUrl: uploadedFile.url,
            },
        }));
        toast.success('3D 로고 GLB 파일이 업로드되었습니다. 변경사항을 저장해주세요.');
    };

    const resetChanges = () => {
        setData(originalData);
        toast.info('변경 사항이 초기화되었습니다.');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/company', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const savedData = await res.json();
                const newSocialLinks = {
                    ...(defaultData.socialLinks || {}),
                    ...(savedData.socialLinks || {}),
                };
                const newLogo3DSettings = {
                    ...(defaultData.logo3dSettings || {}),
                    ...(savedData.logo3dSettings || {}),
                };
                const mergedData = {
                    ...defaultData,
                    ...savedData,
                    socialLinks: newSocialLinks,
                    showAboutIntroSection: savedData.showAboutIntroSection !== undefined ? savedData.showAboutIntroSection : defaultData.showAboutIntroSection,
                    logo3dSettings: newLogo3DSettings,
                    philosophyStatement: savedData.philosophyStatement || defaultData.philosophyStatement || '',
                    coreValues: savedData.coreValues || [],
                    awardsAndCertifications: savedData.awardsAndCertifications || [],
                    aboutPageMainTitleClassName: savedData.aboutPageMainTitleClassName || defaultData.aboutPageMainTitleClassName, // 추가
                };
                setData(mergedData);
                setOriginalData(mergedData);
                toast.success('회사 정보가 성공적으로 저장되었습니다.');
            } else {
                const errorData = await res.json();
                toast.error(`저장 실패: ${errorData.message || '알 수 없는 오류'}`);
            }
        } catch (error) {
            console.error('Error saving company data:', error);
            toast.error('회사 정보 저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const handleCoreValueItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => {
            const updatedCoreValues = [...(prev.coreValues || [])];
            updatedCoreValues[index] = {
                ...(updatedCoreValues[index] || { id: uuidv4() }),
                [name]: value,
            };
            return { ...prev, coreValues: updatedCoreValues };
        });
    };

    const addCoreValueItem = () => {
        setData(prev => ({
            ...prev,
            coreValues: [...(prev.coreValues || []), { id: uuidv4(), icon: 'Sparkles', mainTitle: '', subTitle: '', description: '' }],
        }));
    };

    const removeCoreValueItem = (index: number) => {
        setData(prev => ({
            ...prev,
            coreValues: (prev.coreValues || []).filter((_, i) => i !== index),
        }));
    };

    const handleAwardItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => {
            const updatedAwards = [...(prev.awardsAndCertifications || [])];
            if (updatedAwards[index]) {
                updatedAwards[index] = { ...updatedAwards[index], [name]: value };
            }
            return { ...prev, awardsAndCertifications: updatedAwards };
        });
    };

    const handleAwardImageUpload = (index: number, uploadedFile: { url: string }) => {
        setData(prev => {
            const updatedAwards = [...(prev.awardsAndCertifications || [])];
            if (updatedAwards[index]) {
                updatedAwards[index] = { ...updatedAwards[index], imageUrl: uploadedFile.url };
            }
            return { ...prev, awardsAndCertifications: updatedAwards };
        });
        toast.success(`인증/수상 항목 ${index + 1}의 이미지가 업로드되었습니다. 변경사항을 저장해주세요.`);
    };

    const addAwardItem = () => {
        setData(prev => ({
            ...prev,
            awardsAndCertifications: [
                ...(prev.awardsAndCertifications || []),
                { id: uuidv4(), title: '', description: '', year: '', issuingOrganization: '', imageUrl: '', link: '' }
            ]
        }));
    };

    const removeAwardItem = (index: number) => {
        setData(prev => ({
            ...prev,
            awardsAndCertifications: (prev.awardsAndCertifications || []).filter((_, i) => i !== index)
        }));
    };

    const handleSelectChange = (value: string, name: keyof Logo3DSettings, parent: 'logo3dSettings') => {
        if (parent === 'logo3dSettings') {
            // 3D 로고 설정 변경 시 디바운싱 적용
            setLogo3dUpdating(true);

            if (logo3dUpdateTimeoutRef.current) {
                clearTimeout(logo3dUpdateTimeoutRef.current);
            }

            setData(prev => {
                const newLogoSettings = {
                    ...(prev.logo3dSettings || {}),
                    [name]: value,
                };
                // 배경 유형 변경 시 관련 값 초기화 또는 기본값 설정 (선택적)
                if (name === 'viewerBackgroundType') {
                    if (value === 'color') {
                        newLogoSettings.viewerBackgroundHdriPath = defaultLogo3DSettings.viewerBackgroundHdriPath; // HDRI 경로 초기화/기본값
                    } else if (value === 'hdri') {
                        newLogoSettings.viewerBackgroundColor = defaultLogo3DSettings.viewerBackgroundColor; // 색상값 초기화/기본값
                    } else if (value === 'transparent') {
                        newLogoSettings.viewerBackgroundColor = defaultLogo3DSettings.viewerBackgroundColor;
                        newLogoSettings.viewerBackgroundHdriPath = defaultLogo3DSettings.viewerBackgroundHdriPath;
                    }
                }
                return {
                    ...prev,
                    logo3dSettings: newLogoSettings,
                };
            });

            logo3dUpdateTimeoutRef.current = setTimeout(() => {
                setLogo3dUpdating(false);
            }, 500); // 300ms에서 500ms로 증가
        }
    };

    // 이벤트 유형을 자동으로 감지하는 함수
    const detectEventType = (text: string): 'award' | 'establishment' | 'export' | 'development' | 'general' => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('인증') || lowerText.includes('수상') || lowerText.includes('상') || lowerText.includes('선정')) {
            return 'award';
        }
        if (lowerText.includes('설립') || lowerText.includes('창립') || lowerText.includes('법인') || lowerText.includes('전환')) {
            return 'establishment';
        }
        if (lowerText.includes('수출') || lowerText.includes('계약') || lowerText.includes('협약') || lowerText.includes('체결')) {
            return 'export';
        }
        if (lowerText.includes('개발') || lowerText.includes('출시') || lowerText.includes('완료') || lowerText.includes('취득')) {
            return 'development';
        }

        return 'general';
    };

    // HTML/CSS 복사 및 다운로드 함수들
    const copyHistoryHTML = async () => {
        try {
            const htmlContent = generateHistoryHTML(data.history || '', historyCustomStyles);
            await navigator.clipboard.writeText(htmlContent);
            toast.success('HTML 코드가 클립보드에 복사되었습니다.');
        } catch (error) {
            toast.error('복사에 실패했습니다.');
        }
    };

    const copyHistoryCSS = async () => {
        try {
            const cssContent = generateHistoryCSS(historyCustomStyles);
            await navigator.clipboard.writeText(cssContent);
            toast.success('CSS 코드가 클립보드에 복사되었습니다.');
        } catch (error) {
            toast.error('복사에 실패했습니다.');
        }
    };

    const downloadHistoryCode = () => {
        try {
            const htmlContent = generateHistoryHTML(data.history || '', historyCustomStyles);
            const cssContent = generateHistoryCSS(historyCustomStyles);

            const fullContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회사 연혁 타임라인</title>
    <style>
${cssContent}
    </style>
</head>
<body>
    <div class="timeline-container">
        <h1>회사 연혁</h1>
${htmlContent}
    </div>
</body>
</html>`;

            const blob = new Blob([fullContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = window.document.createElement('a');
            a.href = url;
            a.download = `${data.nameKo || '회사'}_연혁_타임라인.html`;
            window.document.body.appendChild(a);
            a.click();
            window.document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('HTML 파일이 다운로드되었습니다.');
        } catch (error) {
            toast.error('다운로드에 실패했습니다.');
        }
    };

    // HTML 생성 함수
    const generateHistoryHTML = (historyText: string, styles: typeof historyCustomStyles) => {
        if (!historyText) return '';

        const lines = historyText.split('\n').filter(line => line.trim());
        let html = '';
        let currentYear = '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            // 연도 패턴 매칭
            const yearMatch = trimmedLine.match(/^(\d{4})년/);
            if (yearMatch) {
                if (currentYear) html += '    </div>\n'; // 이전 연도 닫기
                currentYear = yearMatch[1];
                html += `    <div class="year-section" data-year="${currentYear}">\n`;
                html += `        <div class="year-header">\n`;
                html += `            <h2 class="year-title">${currentYear}년</h2>\n`;
                html += `        </div>\n`;
                html += `        <div class="events-container">\n`;
                continue;
            }

            // 월/일 이벤트 패턴 매칭
            const eventMatch = trimmedLine.match(/^(\d{1,2})월(?:\s*(\d{1,2})일)?:\s*(.+)$/);
            if (eventMatch && currentYear) {
                const month = eventMatch[1];
                const day = eventMatch[2];
                const title = eventMatch[3];
                const isHighlighted = title.includes('[') && title.includes(']');
                const eventType = detectEventType(title);

                html += `            <div class="event-item ${isHighlighted ? 'highlighted' : ''}" data-type="${eventType}">\n`;
                if (styles.showIcons) {
                    html += `                <div class="event-icon ${eventType}"></div>\n`;
                }
                html += `                <div class="event-content">\n`;
                if (styles.showDates) {
                    html += `                    <div class="event-date">${month}월${day ? ` ${day}일` : ''}</div>\n`;
                }
                html += `                    <div class="event-title">${title}</div>\n`;
                html += `                </div>\n`;
                html += `            </div>\n`;
                continue;
            }

            // 들여쓰기된 세부 내용
            if (line.startsWith('    ') || line.startsWith('\t')) {
                const detail = trimmedLine.replace(/^[-•]\s*/, '');
                html += `                    <div class="event-detail">${detail}</div>\n`;
            }
        }

        if (currentYear) html += '        </div>\n    </div>\n'; // 마지막 연도 닫기

        return html;
    };

    // CSS 생성 함수
    const generateHistoryCSS = (styles: typeof historyCustomStyles) => {
        const colorSchemes = {
            default: {
                primary: '#3b82f6',
                secondary: '#10b981',
                accent: '#f59e0b',
                text: '#1f2937'
            },
            blue: {
                primary: '#3b82f6',
                secondary: '#1e40af',
                accent: '#60a5fa',
                text: '#1e3a8a'
            },
            green: {
                primary: '#10b981',
                secondary: '#047857',
                accent: '#34d399',
                text: '#064e3b'
            },
            purple: {
                primary: '#8b5cf6',
                secondary: '#7c3aed',
                accent: '#a78bfa',
                text: '#581c87'
            },
            orange: {
                primary: '#f59e0b',
                secondary: '#d97706',
                accent: '#fbbf24',
                text: '#92400e'
            }
        };

        const colors = colorSchemes[styles.colorScheme as keyof typeof colorSchemes] || colorSchemes.default;

        return `.timeline-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: ${colors.text};
}

.timeline-container h1 {
    text-align: center;
    color: ${colors.primary};
    margin-bottom: 40px;
    font-size: 2.5rem;
    font-weight: bold;
}

.year-section {
    margin-bottom: ${styles.compactMode ? '20px' : '40px'};
    position: relative;
}

.year-header {
    margin-bottom: ${styles.compactMode ? '15px' : '25px'};
    padding-bottom: 10px;
    border-bottom: 2px solid ${colors.primary};
}

.year-title {
    color: ${colors.primary};
    font-size: ${styles.compactMode ? '1.5rem' : '2rem'};
    font-weight: bold;
    margin: 0;
}

.events-container {
    position: relative;
    padding-left: ${styles.timelineStyle === 'minimal' ? '0' : '30px'};
}

${styles.timelineStyle !== 'minimal' ? `
.events-container::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, ${colors.primary}, ${colors.secondary});
}
` : ''}

.event-item {
    position: relative;
    margin-bottom: ${styles.compactMode ? '15px' : '25px'};
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: ${styles.compactMode ? '10px' : '15px'};
    background: #f8fafc;
    border-radius: 8px;
    border-left: 4px solid ${colors.secondary};
    ${styles.timelineStyle === 'classic' ? 'box-shadow: 0 2px 4px rgba(0,0,0,0.1);' : ''}
}

.event-item.highlighted {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-left-color: ${colors.accent};
}

${styles.showIcons ? `
.event-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
}

.event-icon.award { background: #f59e0b; }
.event-icon.establishment { background: #3b82f6; }
.event-icon.export { background: #10b981; }
.event-icon.development { background: #8b5cf6; }
.event-icon.general { background: #6b7280; }

.event-icon.award::before { content: '🏆'; }
.event-icon.establishment::before { content: '🏢'; }
.event-icon.export::before { content: '🌍'; }
.event-icon.development::before { content: '🚀'; }
.event-icon.general::before { content: '📅'; }
` : ''}

.event-content {
    flex: 1;
}

${styles.showDates ? `
.event-date {
    font-size: 0.875rem;
    color: ${colors.secondary};
    font-weight: 600;
    margin-bottom: 5px;
}
` : ''}

.event-title {
    font-weight: 600;
    color: ${colors.text};
    font-size: ${styles.compactMode ? '0.95rem' : '1rem'};
    line-height: 1.5;
}

.event-detail {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 8px;
    padding-left: 15px;
    position: relative;
}

.event-detail::before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${colors.secondary};
    font-weight: bold;
}

@media (max-width: 768px) {
    .timeline-container {
        padding: 15px;
    }
    
    .timeline-container h1 {
        font-size: 2rem;
        margin-bottom: 30px;
    }
    
    .year-title {
        font-size: 1.5rem;
    }
    
    .events-container {
        padding-left: ${styles.timelineStyle === 'minimal' ? '0' : '20px'};
    }
    
    .event-item {
        padding: 12px;
        gap: 10px;
    }
}`;
    };

    if (loading) {
        return (
            <div className={cn(ADMIN_UI.BG_PRIMARY, "min-h-screen flex items-center justify-center")}>
                <div className={cn(ADMIN_UI.TEXT_PRIMARY, "text-lg")}>로딩 중...</div>
            </div>
        );
    }

    const isChanged = JSON.stringify(data) !== JSON.stringify(originalData);

    return (
        <div className={cn(ADMIN_UI.BG_PRIMARY, "min-h-screen")}>
            <div className="max-w-7xl mx-auto p-6">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className={ADMIN_UI.FLEX_BETWEEN}>
                        <div>
                            <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>
                                회사정보 관리
                            </h1>
                            <p className={cn(ADMIN_UI.TEXT_SECONDARY, "mt-2")} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                회사의 기본 정보, 로고, 소개 내용 등을 관리할 수 있습니다.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {isChanged && (
                                <Button
                                    variant="outline"
                                    onClick={resetChanges}
                                    className={cn(ADMIN_UI.BUTTON_OUTLINE, "flex items-center gap-2")}
                                    style={ADMIN_FONT_STYLES.BUTTON}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    초기화
                                </Button>
                            )}
                            <Button
                                onClick={handleSave}
                                disabled={saving || !isChanged}
                                className={cn(ADMIN_UI.BUTTON_PRIMARY, "flex items-center gap-2")}
                                style={ADMIN_FONT_STYLES.BUTTON}
                            >
                                <Save className="w-4 h-4" />
                                {saving ? '저장 중...' : '저장'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 탭 컨테이너 */}
                <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList className={cn(ADMIN_CARD_STYLES.DEFAULT, "grid w-full grid-cols-6 p-1")}>
                        <TabsTrigger
                            value="basic"
                            className={cn("flex items-center gap-2", ADMIN_UI.TEXT_SECONDARY, ADMIN_UI.TRANSITION)}
                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                        >
                            <Building className="w-4 h-4" />
                            기본정보
                        </TabsTrigger>
                        <TabsTrigger
                            value="about"
                            className={cn("flex items-center gap-2", ADMIN_UI.TEXT_SECONDARY, ADMIN_UI.TRANSITION)}
                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                        >
                            <Info className="w-4 h-4" />
                            About 페이지
                        </TabsTrigger>
                        <TabsTrigger
                            value="logo"
                            className={cn("flex items-center gap-2", ADMIN_UI.TEXT_SECONDARY, ADMIN_UI.TRANSITION)}
                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                        >
                            <ImageIcon className="w-4 h-4" />
                            로고 관리
                        </TabsTrigger>
                        <TabsTrigger
                            value="values"
                            className={cn("flex items-center gap-2", ADMIN_UI.TEXT_SECONDARY, ADMIN_UI.TRANSITION)}
                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                        >
                            <Target className="w-4 h-4" />
                            핵심가치
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className={cn("flex items-center gap-2", ADMIN_UI.TEXT_SECONDARY, ADMIN_UI.TRANSITION)}
                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                        >
                            <ScrollText className="w-4 h-4" />
                            주요연혁
                        </TabsTrigger>
                        <TabsTrigger
                            value="awards"
                            className={cn("flex items-center gap-2", ADMIN_UI.TEXT_SECONDARY, ADMIN_UI.TRANSITION)}
                            style={ADMIN_FONT_STYLES.MENU_ITEM}
                        >
                            <Award className="w-4 h-4" />
                            인증/수상
                        </TabsTrigger>
                    </TabsList>

                    {/* 기본정보 탭 */}
                    <TabsContent value="basic" className="space-y-6">
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <Building className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                회사 기본정보
                            </h2>

                            <div className={cn(ADMIN_UI.GRID_DEFAULT, ADMIN_UI.GRID_COLS_2, "gap-6")}>
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="nameKo" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>회사명 (한국어)</Label>
                                    <Input
                                        id="nameKo"
                                        name="nameKo"
                                        value={data.nameKo}
                                        onChange={handleChange}
                                        placeholder="회사명을 입력하세요"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="nameEn" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>회사명 (영어)</Label>
                                    <Input
                                        id="nameEn"
                                        name="nameEn"
                                        value={data.nameEn}
                                        onChange={handleChange}
                                        placeholder="Company Name in English"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="CEO" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>대표자명</Label>
                                    <Input
                                        id="CEO"
                                        name="CEO"
                                        value={data.CEO}
                                        onChange={handleChange}
                                        placeholder="대표자명을 입력하세요"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="established" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>설립일</Label>
                                    <Input
                                        id="established"
                                        name="established"
                                        value={data.established}
                                        onChange={handleChange}
                                        placeholder="예: 1992년 5월"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="businessNumber" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>사업자등록번호</Label>
                                    <Input
                                        id="businessNumber"
                                        name="businessNumber"
                                        value={data.businessNumber}
                                        onChange={handleChange}
                                        placeholder="000-00-00000"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="website" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>웹사이트</Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        value={data.website}
                                        onChange={handleChange}
                                        placeholder="https://www.example.com"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 연락처 정보 */}
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <Phone className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                연락처 정보
                            </h2>

                            <div className={cn(ADMIN_UI.GRID_DEFAULT, ADMIN_UI.GRID_COLS_2, "gap-6")}>
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="phone" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>전화번호</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        placeholder="043-000-0000"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="fax" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>팩스번호</Label>
                                    <Input
                                        id="fax"
                                        name="fax"
                                        value={data.fax}
                                        onChange={handleChange}
                                        placeholder="043-000-0000"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="email" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>이메일</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="info@company.com"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="supportEmail" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>고객지원 이메일</Label>
                                    <Input
                                        id="supportEmail"
                                        name="supportEmail"
                                        type="email"
                                        value={data.supportEmail}
                                        onChange={handleChange}
                                        placeholder="support@company.com"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={cn(ADMIN_INPUT_STYLES.WRAPPER, "md:col-span-2")}>
                                    <Label htmlFor="businessHours" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>영업시간</Label>
                                    <Input
                                        id="businessHours"
                                        name="businessHours"
                                        value={data.businessHours}
                                        onChange={handleChange}
                                        placeholder="평일 09:00 - 18:00"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 주소 정보 */}
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <MapPin className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                주소 정보
                            </h2>

                            <div className="space-y-4">
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="addressKo" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>주소 (한국어)</Label>
                                    <Textarea
                                        id="addressKo"
                                        name="addressKo"
                                        value={data.addressKo}
                                        onChange={handleChange}
                                        placeholder="한국어 주소를 입력하세요"
                                        rows={2}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="addressEn" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>주소 (영어)</Label>
                                    <Textarea
                                        id="addressEn"
                                        name="addressEn"
                                        value={data.addressEn}
                                        onChange={handleChange}
                                        placeholder="Address in English"
                                        rows={2}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* About 페이지 탭 */}
                    <TabsContent value="about" className="space-y-6">
                        {/* About 페이지 메인 타이틀 설정 */}
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <Edit3 className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                About 페이지 메인 타이틀 설정
                            </h2>

                            <div className="space-y-6">
                                {/* 타이틀 형식 */}
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="aboutPageMainTitleFormat" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>타이틀 형식</Label>
                                    <Input
                                        id="aboutPageMainTitleFormat"
                                        name="aboutPageMainTitleFormat"
                                        value={data.aboutPageMainTitleFormat}
                                        onChange={handleChange}
                                        placeholder="{nameKo} 회사소개"
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                    <p className={cn(ADMIN_INPUT_STYLES.HELPER, "mt-1")} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        {'{nameKo}'}는 회사명으로 자동 치환됩니다.
                                    </p>
                                </div>

                                {/* 텍스트 사이즈 프리셋 */}
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>텍스트 사이즈</Label>
                                    <Select
                                        value={(() => {
                                            const className = data.aboutPageMainTitleClassName || '';
                                            if (className.includes('text-3xl')) return 'small';
                                            if (className.includes('text-4xl')) return 'medium';
                                            if (className.includes('text-5xl')) return 'large';
                                            if (className.includes('text-6xl')) return 'xlarge';
                                            if (className.includes('text-7xl')) return 'xxlarge';
                                            return 'custom';
                                        })()}
                                        onValueChange={(value) => {
                                            let newClassName = data.aboutPageMainTitleClassName || '';

                                            // 기존 텍스트 사이즈 클래스 제거
                                            newClassName = newClassName.replace(/text-\w+/g, '').replace(/\s+/g, ' ').trim();

                                            // 새로운 텍스트 사이즈 클래스 추가
                                            const sizeClasses = {
                                                small: 'text-3xl',
                                                medium: 'text-4xl',
                                                large: 'text-5xl',
                                                xlarge: 'text-6xl',
                                                xxlarge: 'text-7xl'
                                            };

                                            if (value !== 'custom' && sizeClasses[value as keyof typeof sizeClasses]) {
                                                newClassName = `${sizeClasses[value as keyof typeof sizeClasses]} ${newClassName}`.trim();
                                            }

                                            setData(prev => ({
                                                ...prev,
                                                aboutPageMainTitleClassName: newClassName
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                            <SelectValue placeholder="사이즈 선택" />
                                        </SelectTrigger>
                                        <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                            <SelectItem value="small" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>작게 (text-3xl)</SelectItem>
                                            <SelectItem value="medium" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>보통 (text-4xl)</SelectItem>
                                            <SelectItem value="large" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>크게 (text-5xl)</SelectItem>
                                            <SelectItem value="xlarge" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>매우 크게 (text-6xl)</SelectItem>
                                            <SelectItem value="xxlarge" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>초대형 (text-7xl)</SelectItem>
                                            <SelectItem value="custom" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>직접 입력</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 색상 프리셋 */}
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>색상</Label>
                                    <Select
                                        value={(() => {
                                            const className = data.aboutPageMainTitleClassName || '';
                                            if (className.includes('text-primary')) return 'primary';
                                            if (className.includes('text-red')) return 'red';
                                            if (className.includes('text-blue')) return 'blue';
                                            if (className.includes('text-green')) return 'green';
                                            if (className.includes('text-purple')) return 'purple';
                                            if (className.includes('text-orange')) return 'orange';
                                            if (className.includes('text-white')) return 'white';
                                            if (className.includes('text-gray-800')) return 'dark';
                                            if (className.includes('bg-gradient-to-r')) return 'gradient';
                                            return 'custom';
                                        })()}
                                        onValueChange={(value) => {
                                            let newClassName = data.aboutPageMainTitleClassName || '';

                                            // 기존 색상 관련 클래스 제거
                                            newClassName = newClassName
                                                .replace(/text-\w+-\d+/g, '')
                                                .replace(/bg-gradient-to-r/g, '')
                                                .replace(/from-\w+-\d+/g, '')
                                                .replace(/to-\w+-\d+/g, '')
                                                .replace(/bg-clip-text/g, '')
                                                .replace(/text-transparent/g, '')
                                                .replace(/\s+/g, ' ')
                                                .trim();

                                            // 새로운 색상 클래스 추가
                                            const colorClasses = {
                                                primary: 'text-primary-500',
                                                red: 'text-red-500',
                                                blue: 'text-blue-500',
                                                green: 'text-green-500',
                                                purple: 'text-purple-500',
                                                orange: 'text-orange-500',
                                                white: 'text-white',
                                                dark: 'text-gray-800',
                                                gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'
                                            };

                                            if (value !== 'custom' && colorClasses[value as keyof typeof colorClasses]) {
                                                newClassName = `${newClassName} ${colorClasses[value as keyof typeof colorClasses]}`.trim();
                                            }

                                            setData(prev => ({
                                                ...prev,
                                                aboutPageMainTitleClassName: newClassName
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                            <SelectValue placeholder="색상 선택" />
                                        </SelectTrigger>
                                        <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                            <SelectItem value="primary" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>키컬러 (Primary)</SelectItem>
                                            <SelectItem value="red" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>빨강</SelectItem>
                                            <SelectItem value="blue" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>파랑</SelectItem>
                                            <SelectItem value="green" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>초록</SelectItem>
                                            <SelectItem value="purple" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>보라</SelectItem>
                                            <SelectItem value="orange" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>주황</SelectItem>
                                            <SelectItem value="gradient" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>그라데이션 (보라→핑크)</SelectItem>
                                            <SelectItem value="white" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>흰색</SelectItem>
                                            <SelectItem value="dark" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>어두운 회색</SelectItem>
                                            <SelectItem value="custom" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>직접 입력</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 폰트 굵기 프리셋 */}
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>폰트 굵기</Label>
                                    <Select
                                        value={(() => {
                                            const className = data.aboutPageMainTitleClassName || '';
                                            if (className.includes('font-light')) return 'light';
                                            if (className.includes('font-normal')) return 'normal';
                                            if (className.includes('font-medium')) return 'medium';
                                            if (className.includes('font-semibold')) return 'semibold';
                                            if (className.includes('font-bold')) return 'bold';
                                            if (className.includes('font-extrabold')) return 'extrabold';
                                            if (className.includes('font-black')) return 'black';
                                            return 'custom';
                                        })()}
                                        onValueChange={(value) => {
                                            let newClassName = data.aboutPageMainTitleClassName || '';

                                            // 기존 폰트 굵기 클래스 제거
                                            newClassName = newClassName.replace(/font-\w+/g, '').replace(/\s+/g, ' ').trim();

                                            // 새로운 폰트 굵기 클래스 추가
                                            const weightClasses = {
                                                light: 'font-light',
                                                normal: 'font-normal',
                                                medium: 'font-medium',
                                                semibold: 'font-semibold',
                                                bold: 'font-bold',
                                                extrabold: 'font-extrabold',
                                                black: 'font-black'
                                            };

                                            if (value !== 'custom' && weightClasses[value as keyof typeof weightClasses]) {
                                                newClassName = `${newClassName} ${weightClasses[value as keyof typeof weightClasses]}`.trim();
                                            }

                                            setData(prev => ({
                                                ...prev,
                                                aboutPageMainTitleClassName: newClassName
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                            <SelectValue placeholder="굵기 선택" />
                                        </SelectTrigger>
                                        <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                            <SelectItem value="light" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>얇게 (font-light)</SelectItem>
                                            <SelectItem value="normal" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>보통 (font-normal)</SelectItem>
                                            <SelectItem value="medium" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>중간 (font-medium)</SelectItem>
                                            <SelectItem value="semibold" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>약간 굵게 (font-semibold)</SelectItem>
                                            <SelectItem value="bold" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>굵게 (font-bold)</SelectItem>
                                            <SelectItem value="extrabold" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>매우 굵게 (font-extrabold)</SelectItem>
                                            <SelectItem value="black" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>초굵게 (font-black)</SelectItem>
                                            <SelectItem value="custom" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>직접 입력</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 고급 설정 - Tailwind CSS 클래스 직접 입력 */}
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="aboutPageMainTitleClassName" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>고급 설정 (Tailwind CSS 클래스)</Label>
                                    <Textarea
                                        id="aboutPageMainTitleClassName"
                                        name="aboutPageMainTitleClassName"
                                        value={data.aboutPageMainTitleClassName}
                                        onChange={handleChange}
                                        placeholder="text-4xl font-bold text-center text-primary-500"
                                        rows={3}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                    <p className={cn(ADMIN_INPUT_STYLES.HELPER, "mt-1")} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        Tailwind CSS 클래스를 직접 입력할 수 있습니다.
                                    </p>
                                </div>

                                {/* 실시간 미리보기 */}
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>미리보기</Label>
                                    <div className={cn(ADMIN_CARD_STYLES.ACCENT, "p-4 rounded-lg border")}>
                                        <div
                                            className={data.aboutPageMainTitleClassName}
                                            dangerouslySetInnerHTML={{
                                                __html: (data.aboutPageMainTitleFormat || '{nameKo} 회사소개')
                                                    .replace('{nameKo}', data.nameKo || '회사명')
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About 페이지 기타 설정 */}
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <Info className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                About 페이지 기타 설정
                            </h2>

                            <div className="space-y-6">
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="aboutPageSectionTitleFormat" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>섹션 타이틀 형식</Label>
                                    <Textarea
                                        id="aboutPageSectionTitleFormat"
                                        name="aboutPageSectionTitleFormat"
                                        value={data.aboutPageSectionTitleFormat}
                                        onChange={handleChange}
                                        placeholder="안전 기술의 미래, <br className='hidden sm:block' /> {nameKo}가 만들어갑니다."
                                        rows={3}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>About 페이지 이미지</Label>
                                    <div className={cn(ADMIN_UI.GRID_DEFAULT, ADMIN_UI.GRID_COLS_2, "gap-4")}>
                                        <div>
                                            <Label className={cn(ADMIN_INPUT_STYLES.LABEL, "text-sm font-medium")} style={ADMIN_FONT_STYLES.BODY_TEXT}>대표 이미지</Label>
                                            <FileUpload
                                                endpoint="/api/admin/upload"
                                                onUploadSuccess={handleAboutVisualUpload}
                                                fileType="company/about"
                                                accept="image/*"
                                                maxSizeMb={5}
                                                buttonText="대표 이미지 업로드"
                                                currentImageUrl={data.aboutPageVisualUrl}
                                            />
                                            {data.aboutPageVisualUrl && (
                                                <div className="mt-2">
                                                    <Image
                                                        src={data.aboutPageVisualUrl}
                                                        alt="About 페이지 대표 이미지"
                                                        width={200}
                                                        height={150}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label className={cn(ADMIN_INPUT_STYLES.LABEL, "text-sm font-medium")} style={ADMIN_FONT_STYLES.BODY_TEXT}>히어로 이미지</Label>
                                            <FileUpload
                                                endpoint="/api/admin/upload"
                                                onUploadSuccess={handleAboutHeroImageUpload}
                                                fileType="company/about"
                                                accept="image/*"
                                                maxSizeMb={5}
                                                buttonText="히어로 이미지 업로드"
                                                currentImageUrl={data.aboutPageHeroImageUrl}
                                            />
                                            {data.aboutPageHeroImageUrl && (
                                                <div className="mt-2">
                                                    <Image
                                                        src={data.aboutPageHeroImageUrl}
                                                        alt="About 페이지 히어로 이미지"
                                                        width={200}
                                                        height={150}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="showAboutIntroSection"
                                        checked={data.showAboutIntroSection}
                                        onCheckedChange={(checked) => handleSwitchChange(checked, 'showAboutIntroSection')}
                                    />
                                    <Label htmlFor="showAboutIntroSection" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>About 페이지 인트로 섹션 표시</Label>
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="description" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>회사 소개</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        placeholder="회사에 대한 간단한 소개를 입력하세요"
                                        rows={4}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="intro" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>회사 인트로</Label>
                                    <Textarea
                                        id="intro"
                                        name="intro"
                                        value={data.intro}
                                        onChange={handleChange}
                                        placeholder="회사 인트로 메시지를 입력하세요"
                                        rows={3}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="philosophy" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>경영철학</Label>
                                    <Textarea
                                        id="philosophy"
                                        name="philosophy"
                                        value={data.philosophy}
                                        onChange={handleChange}
                                        placeholder="회사의 경영철학을 입력하세요"
                                        rows={4}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="vision" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>비전</Label>
                                    <Textarea
                                        id="vision"
                                        name="vision"
                                        value={data.vision}
                                        onChange={handleChange}
                                        placeholder="회사의 비전을 입력하세요"
                                        rows={4}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>

                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="businessType" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>사업분야</Label>
                                    <Textarea
                                        id="businessType"
                                        name="businessType"
                                        value={data.businessType}
                                        onChange={handleChange}
                                        placeholder="회사의 주요 사업분야를 입력하세요"
                                        rows={6}
                                        className={ADMIN_INPUT_STYLES.INPUT}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* 로고 관리 탭 */}
                    <TabsContent value="logo" className="space-y-6">
                        {/* 2D 로고 */}
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <ImageIcon className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                2D 로고
                            </h2>

                            <div className="space-y-4">
                                <FileUpload
                                    endpoint="/api/admin/upload"
                                    onUploadSuccess={handleLogoUpload}
                                    fileType="company/logo"
                                    accept="image/*"
                                    maxSizeMb={5}
                                    buttonText="로고 업로드"
                                    currentImageUrl={data.logoUrl}
                                />
                                {data.logoUrl && (
                                    <div className="mt-4">
                                        <Image
                                            src={data.logoUrl}
                                            alt="회사 로고"
                                            width={200}
                                            height={100}
                                            className={cn("rounded-lg object-contain p-4", ADMIN_CARD_STYLES.ACCENT)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3D 로고 */}
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "mb-6 flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                <Rotate3d className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                3D 로고
                                {logo3dUpdating && (
                                    <span className={cn("text-sm ml-2", ADMIN_UI.ACCENT_COLOR_FG)} style={ADMIN_FONT_STYLES.BODY_TEXT}>업데이트 중...</span>
                                )}
                            </h2>

                            <div className={cn(ADMIN_UI.GRID_DEFAULT, "lg:grid-cols-2 gap-6")}>
                                {/* 3D 로고 설정 */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>GLB 파일 업로드</Label>
                                        <FileUpload
                                            endpoint="/api/admin/upload"
                                            onUploadSuccess={handleLogo3DGlbUpload}
                                            fileType="company/3d"
                                            accept=".glb,.gltf"
                                            maxSizeMb={10}
                                            buttonText="3D 모델 업로드"
                                        />
                                        {data.logo3dSettings?.glbFileUrl && (
                                            <p className={cn("text-sm text-green-600")} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                ✓ GLB 파일이 업로드되었습니다
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="enableRotation"
                                            checked={data.logo3dSettings?.enableRotation || false}
                                            onCheckedChange={(checked) => handleSwitchChange(checked, 'enableRotation', 'logo3dSettings')}
                                        />
                                        <Label htmlFor="enableRotation" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>자동 회전 활성화</Label>
                                    </div>

                                    {data.logo3dSettings?.enableRotation && (
                                        <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                            <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>회전 속도: {data.logo3dSettings?.rotationSpeed || 0.0015}</Label>
                                            <Slider
                                                value={[data.logo3dSettings?.rotationSpeed || 0.0015]}
                                                onValueChange={(value) => handleSliderChange(value, 'rotationSpeed', 'logo3dSettings')}
                                                max={0.01}
                                                min={0.0001}
                                                step={0.0001}
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                        <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>모델 크기: {data.logo3dSettings?.modelScale || 1}</Label>
                                        <Slider
                                            value={[data.logo3dSettings?.modelScale || 1]}
                                            onValueChange={(value) => handleSliderChange(value, 'modelScale', 'logo3dSettings')}
                                            max={3}
                                            min={0.1}
                                            step={0.1}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                        <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>스타일 프리셋</Label>
                                        <Select
                                            value={data.logo3dSettings?.stylePreset || 'default'}
                                            onValueChange={(value) => handleSelectChange(value, 'stylePreset', 'logo3dSettings')}
                                        >
                                            <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                                <SelectValue placeholder="스타일 선택" />
                                            </SelectTrigger>
                                            <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                                <SelectItem value="default" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>기본</SelectItem>
                                                <SelectItem value="metallic" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>메탈릭</SelectItem>
                                                <SelectItem value="glass" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>글래스</SelectItem>
                                                <SelectItem value="neon" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>네온</SelectItem>
                                                <SelectItem value="wood" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>우드</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                        <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>배경 유형</Label>
                                        <Select
                                            value={data.logo3dSettings?.viewerBackgroundType || 'transparent'}
                                            onValueChange={(value) => handleSelectChange(value, 'viewerBackgroundType', 'logo3dSettings')}
                                        >
                                            <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                                <SelectValue placeholder="배경 유형 선택" />
                                            </SelectTrigger>
                                            <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                                <SelectItem value="transparent" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>투명</SelectItem>
                                                <SelectItem value="color" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>단색</SelectItem>
                                                <SelectItem value="hdri" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>HDRI 환경</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {data.logo3dSettings?.viewerBackgroundType === 'color' && (
                                        <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                            <Label htmlFor="viewerBackgroundColor" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>배경 색상</Label>
                                            <Input
                                                id="viewerBackgroundColor"
                                                name="viewerBackgroundColor"
                                                type="color"
                                                value={data.logo3dSettings?.viewerBackgroundColor || '#FFFFFF'}
                                                onChange={(e) => handleChange(e, 'logo3dSettings')}
                                                className={ADMIN_INPUT_STYLES.INPUT}
                                            />
                                        </div>
                                    )}

                                    {data.logo3dSettings?.viewerBackgroundType === 'hdri' && (
                                        <div className="space-y-4">
                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>HDRI 파일 업로드</Label>
                                                <FileUpload
                                                    endpoint="/api/admin/upload"
                                                    onUploadSuccess={(uploadedFile) => {
                                                        setData(prev => ({
                                                            ...prev,
                                                            logo3dSettings: {
                                                                ...(prev.logo3dSettings || {}),
                                                                viewerBackgroundHdriPath: uploadedFile.url,
                                                            },
                                                        }));
                                                        toast.success('HDRI 파일이 업로드되었습니다.');
                                                    }}
                                                    fileType="company/hdri"
                                                    accept=".hdr,.exr"
                                                    maxSizeMb={20}
                                                    buttonText="HDRI 파일 업로드"
                                                />
                                            </div>
                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label htmlFor="viewerBackgroundHdriPath" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>HDRI 파일 경로</Label>
                                                <Input
                                                    id="viewerBackgroundHdriPath"
                                                    name="viewerBackgroundHdriPath"
                                                    value={data.logo3dSettings?.viewerBackgroundHdriPath || ''}
                                                    onChange={(e) => handleChange(e, 'logo3dSettings')}
                                                    placeholder="/hdri/your-hdri-file.hdr"
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                                <p className={cn(ADMIN_INPUT_STYLES.HELPER, "mt-1")} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                    HDRI 파일을 업로드하거나 직접 경로를 입력하세요. (예: /hdri/studio.hdr)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 3D 로고 미리보기 */}
                                <div className="space-y-4">
                                    <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>미리보기</Label>
                                    <div className={cn(ADMIN_CARD_STYLES.ACCENT, "w-full h-64 rounded-lg overflow-hidden relative")}>
                                        {logo3dUpdating && (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 rounded-lg">
                                                <div className={cn(ADMIN_CARD_STYLES.DEFAULT, "px-3 py-2 rounded-md shadow-md flex items-center gap-2")}>
                                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className={cn(ADMIN_UI.TEXT_PRIMARY, "text-sm")} style={ADMIN_FONT_STYLES.BODY_TEXT}>설정 적용 중...</span>
                                                </div>
                                            </div>
                                        )}
                                        {data.logo3dSettings?.glbFileUrl ? (
                                            <Logo3D
                                                key={`logo3d-${data.logo3dSettings.glbFileUrl}`} // 모델 파일 변경 시에만 재마운트
                                                settings={memoizedLogo3DSettings}
                                            />
                                        ) : (
                                            <div className={cn("w-full h-full flex items-center justify-center", ADMIN_UI.TEXT_MUTED)} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                GLB 파일을 업로드하면 3D 로고가 표시됩니다
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* 핵심가치 탭 */}
                    <TabsContent value="values" className="space-y-6">
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <div className={cn(ADMIN_UI.FLEX_BETWEEN, "mb-6")}>
                                <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                    <Target className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                    핵심가치 관리
                                </h2>
                                <Button
                                    onClick={addCoreValueItem}
                                    className={cn(ADMIN_UI.BUTTON_PRIMARY, "flex items-center gap-2")}
                                    style={ADMIN_FONT_STYLES.BUTTON}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    핵심가치 추가
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {(data.coreValues || []).map((item, index) => (
                                    <div key={item.id || index} className={cn(ADMIN_CARD_STYLES.ACCENT, "p-4 border rounded-lg space-y-4")}>
                                        <div className={ADMIN_UI.FLEX_BETWEEN}>
                                            <h3 className={cn(ADMIN_UI.TEXT_PRIMARY, "font-medium")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>핵심가치 {index + 1}</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeCoreValueItem(index)}
                                                className={cn(ADMIN_UI.BUTTON_OUTLINE, "text-red-600 hover:text-red-700")}
                                                style={ADMIN_FONT_STYLES.BUTTON}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className={cn(ADMIN_UI.GRID_DEFAULT, ADMIN_UI.GRID_COLS_2, "gap-4")}>
                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>아이콘</Label>
                                                <Select
                                                    value={item.icon || 'Sparkles'}
                                                    onValueChange={(value) => {
                                                        const updatedCoreValues = [...(data.coreValues || [])];
                                                        updatedCoreValues[index] = { ...updatedCoreValues[index], icon: value };
                                                        setData(prev => ({ ...prev, coreValues: updatedCoreValues }));
                                                    }}
                                                >
                                                    <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                                        <SelectValue placeholder="아이콘 선택" />
                                                    </SelectTrigger>
                                                    <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                                        {Object.keys(LucideIcons).map((iconName) => {
                                                            const IconComponent = LucideIcons[iconName];
                                                            return (
                                                                <SelectItem key={iconName} value={iconName} className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>
                                                                    <div className="flex items-center gap-2">
                                                                        <IconComponent className="w-4 h-4" />
                                                                        {iconName}
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>메인 타이틀</Label>
                                                <Input
                                                    name="mainTitle"
                                                    value={item.mainTitle || ''}
                                                    onChange={(e) => handleCoreValueItemChange(index, e)}
                                                    placeholder="핵심가치 제목"
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={cn(ADMIN_INPUT_STYLES.WRAPPER, "md:col-span-2")}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>서브 타이틀</Label>
                                                <Input
                                                    name="subTitle"
                                                    value={item.subTitle || ''}
                                                    onChange={(e) => handleCoreValueItemChange(index, e)}
                                                    placeholder="핵심가치 부제목"
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={cn(ADMIN_INPUT_STYLES.WRAPPER, "md:col-span-2")}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>설명</Label>
                                                <Textarea
                                                    name="description"
                                                    value={item.description || ''}
                                                    onChange={(e) => handleCoreValueItemChange(index, e)}
                                                    placeholder="핵심가치에 대한 상세 설명"
                                                    rows={4}
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!data.coreValues || data.coreValues.length === 0) && (
                                    <div className={cn("text-center py-8", ADMIN_UI.TEXT_MUTED)} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        핵심가치를 추가해주세요.
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* 주요연혁 탭 */}
                    <TabsContent value="history" className="space-y-6">
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <div className={cn(ADMIN_UI.FLEX_BETWEEN, "mb-6")}>
                                <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                    <ScrollText className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                    주요연혁 관리
                                </h2>
                                <Button
                                    onClick={() => {
                                        // 현재 스타일을 원본으로 저장
                                        setOriginalHistoryStyles(historyCustomStyles);
                                        setHistoryStyleDialogOpen(true);
                                    }}
                                    className={cn(ADMIN_UI.BUTTON_PRIMARY, "flex items-center gap-2")}
                                    style={ADMIN_FONT_STYLES.BUTTON}
                                >
                                    <Palette className="w-4 h-4" />
                                    비주얼 스타일 설정
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                    <Label htmlFor="history" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>연혁 내용</Label>
                                    <Textarea
                                        id="history"
                                        name="history"
                                        value={data.history}
                                        onChange={handleChange}
                                        placeholder="연혁을 입력하세요. 예: 2018년&#10;01월: ISO 9001: 2015 인증 획득"
                                        rows={15}
                                        className={cn(ADMIN_INPUT_STYLES.INPUT, "font-mono text-sm")}
                                        style={ADMIN_FONT_STYLES.BODY_TEXT}
                                    />
                                    <div className={cn("text-sm space-y-1 mt-2", ADMIN_UI.TEXT_MUTED)} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        <p><strong>작성 규칙:</strong></p>
                                        <p>• 연도: "2018년" 형식으로 시작</p>
                                        <p>• 이벤트: "01월: 내용" 또는 "01월 15일: 내용" 형식</p>
                                        <p>• 중요 이벤트: [대괄호]로 강조</p>
                                        <p>• 세부 내용: 들여쓰기로 구조화</p>
                                    </div>
                                </div>

                                {/* 연혁 미리보기 */}
                                {data.history && (
                                    <div className="space-y-4">
                                        <div className={ADMIN_UI.FLEX_BETWEEN}>
                                            <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>연혁 미리보기</Label>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={copyHistoryHTML}
                                                    className={cn(ADMIN_UI.BUTTON_OUTLINE, "flex items-center gap-2")}
                                                    style={ADMIN_FONT_STYLES.BUTTON}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    HTML 복사
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={copyHistoryCSS}
                                                    className={cn(ADMIN_UI.BUTTON_OUTLINE, "flex items-center gap-2")}
                                                    style={ADMIN_FONT_STYLES.BUTTON}
                                                >
                                                    <Palette className="w-4 h-4" />
                                                    CSS 복사
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={downloadHistoryCode}
                                                    className={cn(ADMIN_UI.BUTTON_OUTLINE, "flex items-center gap-2")}
                                                    style={ADMIN_FONT_STYLES.BUTTON}
                                                >
                                                    <Download className="w-4 h-4" />
                                                    파일 다운로드
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={cn("border rounded-lg p-4 max-h-96 overflow-y-auto", ADMIN_CARD_STYLES.ACCENT)}>
                                            <HistoryTimeline
                                                historyText={data.history || ''}
                                                customStyles={historyCustomStyles}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 연혁 스타일 설정 다이얼로그 */}
                        <Dialog open={historyStyleDialogOpen} onOpenChange={setHistoryStyleDialogOpen}>
                            <DialogContent className={cn("max-w-2xl", ADMIN_CARD_STYLES.DEFAULT)}>
                                <DialogHeader>
                                    <DialogTitle className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.SECTION_TITLE}>연혁 비주얼 스타일 설정</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                            <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>색상 스키마</Label>
                                            <Select
                                                value={historyCustomStyles.colorScheme}
                                                onValueChange={(value) => setHistoryCustomStyles(prev => ({ ...prev, colorScheme: value as HistoryStyles['colorScheme'] }))}
                                            >
                                                <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                                    <SelectItem value="default" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>기본 (다채로운)</SelectItem>
                                                    <SelectItem value="blue" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>파란색 계열</SelectItem>
                                                    <SelectItem value="green" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>초록색 계열</SelectItem>
                                                    <SelectItem value="purple" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>보라색 계열</SelectItem>
                                                    <SelectItem value="orange" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>주황색 계열</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                            <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>타임라인 스타일</Label>
                                            <Select
                                                value={historyCustomStyles.timelineStyle}
                                                onValueChange={(value) => setHistoryCustomStyles(prev => ({ ...prev, timelineStyle: value as HistoryStyles['timelineStyle'] }))}
                                            >
                                                <SelectTrigger className={ADMIN_INPUT_STYLES.INPUT}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className={ADMIN_CARD_STYLES.DEFAULT}>
                                                    <SelectItem value="modern" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>모던</SelectItem>
                                                    <SelectItem value="classic" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>클래식</SelectItem>
                                                    <SelectItem value="minimal" className={ADMIN_UI.TEXT_PRIMARY} style={ADMIN_FONT_STYLES.MENU_ITEM}>미니멀</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="showIcons"
                                                checked={historyCustomStyles.showIcons}
                                                onCheckedChange={(checked) => setHistoryCustomStyles(prev => ({ ...prev, showIcons: checked }))}
                                            />
                                            <Label htmlFor="showIcons" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>아이콘 표시</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="showDates"
                                                checked={historyCustomStyles.showDates}
                                                onCheckedChange={(checked) => setHistoryCustomStyles(prev => ({ ...prev, showDates: checked }))}
                                            />
                                            <Label htmlFor="showDates" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>날짜 표시</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="compactMode"
                                                checked={historyCustomStyles.compactMode}
                                                onCheckedChange={(checked) => setHistoryCustomStyles(prev => ({ ...prev, compactMode: checked }))}
                                            />
                                            <Label htmlFor="compactMode" className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>컴팩트 모드</Label>
                                        </div>
                                    </div>

                                    {/* 실시간 미리보기 */}
                                    <div className="space-y-2">
                                        <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>실시간 미리보기</Label>
                                        <div className={cn("border rounded-lg p-4 max-h-64 overflow-y-auto", ADMIN_CARD_STYLES.ACCENT)}>
                                            <HistoryTimeline
                                                historyText={data.history || ''}
                                                customStyles={historyCustomStyles}
                                            />
                                        </div>
                                    </div>

                                    {/* 버튼 영역 */}
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                // 원본 스타일로 복원
                                                setHistoryCustomStyles(originalHistoryStyles);
                                                setHistoryStyleDialogOpen(false);
                                            }}
                                            className={cn(ADMIN_UI.BUTTON_OUTLINE)}
                                            style={ADMIN_FONT_STYLES.BUTTON}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                // 스타일 설정을 data에 저장
                                                setData(prev => ({
                                                    ...prev,
                                                    historyStyles: historyCustomStyles
                                                }));
                                                setHistoryStyleDialogOpen(false);
                                                toast.success('연혁 스타일이 적용되었습니다.');
                                            }}
                                            className={cn(ADMIN_UI.BUTTON_PRIMARY)}
                                            style={ADMIN_FONT_STYLES.BUTTON}
                                        >
                                            적용
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* 인증/수상 탭 */}
                    <TabsContent value="awards" className="space-y-6">
                        <div className={cn(ADMIN_CARD_STYLES.DEFAULT, ADMIN_UI.PADDING_CONTAINER)}>
                            <div className={cn(ADMIN_UI.FLEX_BETWEEN, "mb-6")}>
                                <h2 className={cn(ADMIN_HEADING_STYLES.SECTION_TITLE, "flex items-center gap-2")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                                    <Award className={cn("w-5 h-5", ADMIN_UI.ACCENT_COLOR_FG)} />
                                    인증/수상 관리
                                </h2>
                                <Button
                                    onClick={addAwardItem}
                                    className={cn(ADMIN_UI.BUTTON_PRIMARY, "flex items-center gap-2")}
                                    style={ADMIN_FONT_STYLES.BUTTON}
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    인증/수상 추가
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {(data.awardsAndCertifications || []).map((item, index) => (
                                    <div key={item.id || index} className={cn(ADMIN_CARD_STYLES.ACCENT, "p-4 border rounded-lg space-y-4")}>
                                        <div className={ADMIN_UI.FLEX_BETWEEN}>
                                            <h3 className={cn(ADMIN_UI.TEXT_PRIMARY, "font-medium")} style={ADMIN_FONT_STYLES.SECTION_TITLE}>인증/수상 {index + 1}</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeAwardItem(index)}
                                                className={cn(ADMIN_UI.BUTTON_OUTLINE, "text-red-600 hover:text-red-700")}
                                                style={ADMIN_FONT_STYLES.BUTTON}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className={cn(ADMIN_UI.GRID_DEFAULT, ADMIN_UI.GRID_COLS_2, "gap-4")}>
                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>제목</Label>
                                                <Input
                                                    name="title"
                                                    value={item.title || ''}
                                                    onChange={(e) => handleAwardItemChange(index, e)}
                                                    placeholder="인증/수상 제목"
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>연도</Label>
                                                <Input
                                                    name="year"
                                                    value={item.year || ''}
                                                    onChange={(e) => handleAwardItemChange(index, e)}
                                                    placeholder="2023"
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={cn(ADMIN_INPUT_STYLES.WRAPPER, "md:col-span-2")}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>발급기관</Label>
                                                <Input
                                                    name="issuingOrganization"
                                                    value={item.issuingOrganization || ''}
                                                    onChange={(e) => handleAwardItemChange(index, e)}
                                                    placeholder="발급기관명"
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={cn(ADMIN_INPUT_STYLES.WRAPPER, "md:col-span-2")}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>설명</Label>
                                                <Textarea
                                                    name="description"
                                                    value={item.description || ''}
                                                    onChange={(e) => handleAwardItemChange(index, e)}
                                                    placeholder="인증/수상에 대한 설명"
                                                    rows={3}
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>관련 링크</Label>
                                                <Input
                                                    name="link"
                                                    value={item.link || ''}
                                                    onChange={(e) => handleAwardItemChange(index, e)}
                                                    placeholder="https://..."
                                                    className={ADMIN_INPUT_STYLES.INPUT}
                                                    style={ADMIN_FONT_STYLES.BODY_TEXT}
                                                />
                                            </div>

                                            <div className={ADMIN_INPUT_STYLES.WRAPPER}>
                                                <Label className={ADMIN_INPUT_STYLES.LABEL} style={ADMIN_FONT_STYLES.BODY_TEXT}>이미지</Label>
                                                <FileUpload
                                                    endpoint="/api/admin/upload"
                                                    onUploadSuccess={(uploadedFile) => handleAwardImageUpload(index, uploadedFile)}
                                                    fileType="company/awards"
                                                    accept="image/*"
                                                    maxSizeMb={5}
                                                    buttonText="이미지 업로드"
                                                    currentImageUrl={item.imageUrl}
                                                />
                                                {item.imageUrl && (
                                                    <div className="mt-2">
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.title || '인증/수상 이미지'}
                                                            width={150}
                                                            height={100}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!data.awardsAndCertifications || data.awardsAndCertifications.length === 0) && (
                                    <div className={cn("text-center py-8", ADMIN_UI.TEXT_MUTED)} style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        인증/수상 내역을 추가해주세요.
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminCompanyPage; 