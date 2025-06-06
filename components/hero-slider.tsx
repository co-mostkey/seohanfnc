"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation, AnimatePresence, useTransform, useSpring, useMotionValue } from "framer-motion"
import { Menu, Bell, ArrowRight, X, Newspaper, Calendar, Shield, AlertTriangle, FileText, BadgeCheck, Flame, Phone } from "lucide-react"
import CountUp from 'react-countup'
import { useTheme } from 'next-themes'
import { cn, getImagePath } from "@/lib/utils"

const stats = [
  {
    value: 32,
    label: "품질 인증",
    suffix: "건",
    gradient: "from-red-500 to-orange-500"
  },
  {
    value: 1500,
    label: "고객사",
    suffix: "+",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    value: 25,
    label: "수출 국가",
    suffix: "개국",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    value: 98,
    label: "고객 만족도",
    suffix: "%",
    gradient: "from-red-500 to-orange-500"
  }
]

interface Notice {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt?: string
  author?: string
  isPinned?: boolean
  category?: string
  viewCount?: number
}

interface NewsItem {
  id: number
  title: string
  date: string
  source: string
}

interface Event {
  id: number
  title: string
  date: string
  location: string
}

const news: NewsItem[] = [
  {
    id: 1,
    title: "서한에프앤씨, 2023 소방산업대상 수상",
    date: "2023-12-12",
    source: "소방뉴스",
  },
  {
    id: 2,
    title: "서한에프앤씨, 해외 시장 진출 확대 계획 발표",
    date: "2023-12-05",
    source: "경제신문",
  },
  {
    id: 3,
    title: "소방 설비 시장, 2024년 성장세 전망",
    date: "2023-11-30",
    source: "산업일보",
  },
]

const events: Event[] = [
  {
    id: 1,
    title: "2024 소방 안전 박람회 참가",
    date: "2024-03-15",
    location: "서울 코엑스",
  },
  {
    id: 2,
    title: "신제품 발표회",
    date: "2024-02-20",
    location: "서한에프앤씨 본사",
  },
  {
    id: 3,
    title: "소방 설비 기술 세미나",
    date: "2024-01-25",
    location: "서울 JW 메리어트",
  },
]

interface MenuItem {
  id?: number
  icon: React.ReactNode
  title: string
  description: string
  link: string
  content?: {
    title: string
    subtitle: string
    items: Array<{
      id: number
      title: string
      description?: string
      date?: string
      category?: string
      link?: string
    }>
  }
}

export default function HeroSlider() {
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0))
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const controls = useAnimation()
  const tabControls = useAnimation()
  const contentControls = useAnimation()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { theme: themeFromUseTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([])
  const [noticesLoading, setNoticesLoading] = useState(true)

  // 초기 메뉴 상태 확인을 위한 플래그
  const initialStateSet = useRef(false)

  // 데스크탑 메뉴 열림/닫힘 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  // 성과지표 활성화 상태 관리
  const [activeStatIndex, setActiveStatIndex] = useState<number | null>(null)

  // 마우스 위치 관련 상태 및 모션값
  const x = useSpring(mouseX, { stiffness: 70, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 70, damping: 20 });

  // 호버 상태 관리
  const [hoverSection, setHoverSection] = useState<string | null>(null);

  // 줌 효과 관련 모션값
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const targetScale = useMotionValue(1.05);

  // 마우스 위치 추적 값
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorSize, setCursorSize] = useState(0);

  // 마우스 움직임 처리 함수
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // 화면 중앙 기준 마우스 위치 계산 (-1 ~ 1 범위)
    const centerX = (e.clientX - rect.left) / rect.width - 0.5;
    const centerY = (e.clientY - rect.top) / rect.height - 0.5;

    // 마우스 위치에 따라 이동 효과 적용 - 이동 범위 조정
    mouseX.set(centerX * -30);
    mouseY.set(centerY * -30);

    // 마우스 위치에 따른 줌 효과 계산
    const distanceFromCenter = Math.sqrt(centerX * centerX + centerY * centerY);
    const newScale = 1.05 + (1 - distanceFromCenter) * 0.07;
    targetScale.set(newScale);
    scale.set(newScale);

    // 마우스 위치 업데이트
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // 커서 크기 조정
    setCursorSize(20 + (1 - distanceFromCenter) * 40);

    // 호버 상태 갱신
    setIsHovered(true);
  };

  // 마우스 나갈 때 처리
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorSize(0);
    scale.set(1);
  };

  // 섹션 호버 핸들러
  const handleSectionHover = (section: string | null) => {
    setHoverSection(section);
  };

  // 메뉴 상태에 따른 애니메이션 컨트롤
  useEffect(() => {
    if (!mounted) return;

    const applyAnimations = async () => {
      if (isMenuOpen) {
        await Promise.all([
          controls.start(openMenuStyle),
          tabControls.start(openMenuStyle),
          contentControls.start(openMenuStyle)
        ]);
      } else {
        await Promise.all([
          controls.start(closedMenuStyle),
          tabControls.start(closedMenuStyle),
          contentControls.start(closedMenuStyle)
        ]);
      }
    };

    applyAnimations();
  }, [isMenuOpen, controls, tabControls, contentControls, mounted]);

  // 메뉴 상태 감지 - 외부 메뉴 컴포넌트의 토글 상태 감지
  useEffect(() => {
    const handleMenuToggle = (e: CustomEvent) => {
      setIsMenuOpen(e.detail.isOpen);
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('menuToggle' as any, handleMenuToggle);

    // 초기 메뉴 상태 확인
    const checkMenuState = () => {
      if (initialStateSet.current) return;

      const menuButton = document.querySelector('[data-menu-toggle]');
      if (menuButton) {
        const isOpen = menuButton.getAttribute('data-menu-open') === 'true';
        setIsMenuOpen(isOpen);
        initialStateSet.current = true;

        // 초기 상태에 맞는 애니메이션 값 즉시 적용
        if (!isOpen) {
          controls.set(closedMenuStyle);
          tabControls.set(closedMenuStyle);
          contentControls.set(closedMenuStyle);
        } else {
          controls.set(openMenuStyle);
          tabControls.set(openMenuStyle);
          contentControls.set(openMenuStyle);
        }
      }
    };

    // 다양한 타이밍에 메뉴 상태 확인
    checkMenuState();
    const timeoutId = setTimeout(checkMenuState, 100);

    return () => {
      window.removeEventListener('menuToggle' as any, handleMenuToggle);
      clearTimeout(timeoutId);
    };
  }, [controls, tabControls, contentControls]);

  // 기존 카운터 애니메이션 로직
  const animateCounters = async () => {
    await controls.start({ opacity: 1 })

    stats.forEach((stat, index) => {
      let frame = 0
      const totalFrames = 60
      const increment = stat.value / totalFrames

      const animate = () => {
        frame++
        const current = Math.min(Math.ceil(increment * frame), stat.value)

        setCounters(prev => {
          const newCounters = [...prev]
          newCounters[index] = current
          return newCounters
        })

        if (frame < totalFrames) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    })
  }

  useEffect(() => {
    controls.set({ opacity: 0 })
    setCounters(stats.map(() => 0))
    animateCounters()
  }, [])

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
    setIsDark(theme === 'dark');
  }, [theme]);

  // 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices?limit=3&page=1', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setNotices(data.data);
          } else {
            console.warn('API 응답 형식이 올바르지 않습니다.');
            setNotices([]);
          }
        } else {
          console.error('공지사항을 불러오는 중 오류 발생:', response.status);
          setNotices([]);
        }
      } catch (error) {
        console.error('공지사항을 불러오는 중 오류 발생:', error);
        setNotices([]);
      } finally {
        setNoticesLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // combinedItems 생성을 notices 상태에 의존하도록 수정
  const combinedItems = React.useMemo(() => [
    ...notices.map((notice, index) => ({
      id: parseInt(notice.id.replace(/\D/g, '')) || index + 1,
      title: notice.title,
      description: notice.title,
      date: new Date(notice.createdAt).toLocaleDateString('ko-KR'),
      category: notice.category || '일반',
      type: '공지사항'
    })),
    ...news.map(item => ({
      id: item.id,
      title: item.title,
      description: item.title,
      date: item.date,
      category: item.source,
      type: '뉴스'
    })),
    ...events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.title,
      date: event.date,
      category: event.location,
      type: '일정'
    })),
  ], [notices]);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      icon: <Flame className="w-10 h-10 md:w-12 md:h-12" />,
      title: "소방설비",
      description: "최신 소방 설비 및 시스템",
      link: "/products/fire",
      content: {
        title: "소방설비",
        subtitle: "최신 기술과 혁신으로 만드는 안전한 공간",
        items: [
          {
            id: 1,
            title: "자동 소화 시스템",
            description: "최신 기술이 적용된 스마트 소화 시스템",
            date: "2024-04-01",
            category: "제품",
          },
          {
            id: 2,
            title: "화재 감지기",
            description: "고성능 화재 감지 및 경보 시스템",
            date: "2024-03-15",
            category: "제품",
          },
          {
            id: 3,
            title: "소방 펌프",
            description: "신뢰성 높은 소방용 펌프 시스템",
            date: "2024-03-01",
            category: "제품",
          },
        ],
      },
    },
    {
      id: 2,
      icon: <Shield className="w-10 h-10 md:w-12 md:h-12" />,
      title: "안전장비",
      description: "다양한 안전 보호 장비",
      link: "/products/b-type",
      content: {
        title: "안전장비",
        subtitle: "생명을 보호하는 첨단 안전 솔루션",
        items: [
          {
            id: 1,
            title: "인명구조장비",
            description: "화재 및 재해 상황에서의 인명구조 장비",
            date: "2024-04-10",
            category: "제품",
          },
          {
            id: 2,
            title: "개인보호장비",
            description: "소방관 및 구조대원용 개인보호장비",
            date: "2024-03-25",
            category: "제품",
          },
          {
            id: 3,
            title: "비상탈출장비",
            description: "신속하고 안전한 비상탈출 장비",
            date: "2024-03-10",
            category: "제품",
          },
        ],
      },
    },
    {
      id: 3,
      icon: <AlertTriangle className="w-10 h-10 md:w-12 md:h-12" />,
      title: "경보시스템",
      description: "첨단 화재 경보 시스템",
      link: "/products/alarm",
      content: {
        title: "경보시스템",
        subtitle: "빠르고 정확한 화재 감지 및 경보",
        items: [
          {
            id: 1,
            title: "화재수신기",
            description: "중앙 집중식 화재 감지 및 경보 시스템",
            date: "2024-04-05",
            category: "제품",
          },
          {
            id: 2,
            title: "감지기",
            description: "연기, 열, 가스 감지용 각종 감지기",
            date: "2024-03-20",
            category: "제품",
          },
          {
            id: 3,
            title: "경보장치",
            description: "시각, 청각 경보 장치 시스템",
            date: "2024-03-05",
            category: "제품",
          },
        ],
      },
    },
    {
      id: 4,
      icon: <BadgeCheck className="w-10 h-10 md:w-12 md:h-12" />,
      title: "인증현황",
      description: "제품 품질 인증 및 승인",
      link: "/certification",
      content: {
        title: "인증현황",
        subtitle: "엄격한 품질관리를 통한 신뢰성 보증",
        items: [
          {
            id: 1,
            title: "국가인증",
            description: "국가기관 승인 및 인증 현황",
            date: "2024-04-12",
            category: "인증",
          },
          {
            id: 2,
            title: "국제인증",
            description: "해외 품질인증 및 안전기준 충족",
            date: "2024-03-28",
            category: "인증",
          },
          {
            id: 3,
            title: "시험성적서",
            description: "제품별 성능시험 및 검증결과",
            date: "2024-03-12",
            category: "인증",
          },
        ],
      },
    },
    {
      id: 5,
      icon: <FileText className="w-10 h-10 md:w-12 md:h-12" />,
      title: "기술자료",
      description: "제품 및 기술 문서",
      link: "/support/technical",
      content: {
        title: "기술자료",
        subtitle: "전문적인 기술 정보 및 가이드",
        items: [
          {
            id: 1,
            title: "제품 매뉴얼",
            description: "상세 제품 사용 가이드",
            date: "2024-04-15",
            category: "문서",
          },
          {
            id: 2,
            title: "기술 스펙",
            description: "제품 기술 사양 문서",
            date: "2024-03-30",
            category: "문서",
          },
          {
            id: 3,
            title: "설치 가이드",
            description: "제품 설치 및 유지보수 안내",
            date: "2024-03-15",
            category: "문서",
          },
        ],
      },
    },
    {
      id: 6,
      icon: <Bell className="w-10 h-10 md:w-12 md:h-12" />,
      title: "공지사항",
      description: "회사 소식 및 공지",
      link: "/support/notice",
      content: {
        title: "공지사항",
        subtitle: "서한에프앤씨의 새로운 소식을 전해드립니다",
        items: notices.map((notice, index) => ({
          id: parseInt(notice.id.replace(/\D/g, '')) || index + 1,
          title: notice.title,
          description: notice.title,
          date: new Date(notice.createdAt).toLocaleDateString('ko-KR'),
          category: notice.category || '일반',
        })),
      },
    },
  ]

  function formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 컴포넌트 시작 부분에 footer 높이 상수 추가
  const FOOTER_HEIGHT = 88; // px 단위, 푸터의 실제 높이에 맞게 조정

  // 애니메이션 스타일 상수 정의
  const openMenuStyle = {
    opacity: 1,
    y: 0
  };

  const closedMenuStyle = {
    opacity: 1,
    y: 0
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-white dark:bg-neutral-950"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 배경 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 기본 배경 색상 */}
        <div className="absolute inset-0 bg-white dark:bg-neutral-900" />

        {/* 메인 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900" />

        {/* 히어로 이미지 - 패럴랙스 효과 적용 */}
        <motion.div
          className="absolute inset-0 z-10 overflow-hidden scale-110"
          style={{
            x,
            y,
            scale: springScale
          }}
        >
          <Image
            src={getImagePath("/hero/hero_01.png")}
            alt="Hero Background"
            fill
            className="object-contain md:object-cover object-center opacity-70 dark:opacity-90 scale-110"
            priority
            sizes="100vw"
            style={{ objectPosition: "center center" }}
          />
        </motion.div>

        {/* 이미지 경계를 가리기 위한 추가 그라디언트 */}
        <div className="absolute inset-0 z-11 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-neutral-900 dark:via-transparent dark:to-neutral-900 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-neutral-900 dark:via-transparent dark:to-neutral-900 opacity-70"></div>
        </div>

        {/* 오버레이 그라디언트 */}
        <div className="absolute inset-0 z-12">
          {/* 좌우 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-white/60 dark:from-neutral-950/70 dark:via-neutral-950/40 dark:to-neutral-950/60 opacity-20" />
          {/* 상하 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80 dark:from-neutral-950/70 dark:via-neutral-950/40 dark:to-neutral-950/80 opacity-20" />
        </div>

        {/* 모던한 효과 레이어 */}
        <motion.div
          className="absolute inset-0 z-12 pointer-events-none"
          style={{
            x: useTransform(x, value => value * 0.3),
            y: useTransform(y, value => value * 0.3)
          }}
        >
          {/* 그리드 패턴 - 더 정교하게 */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <div className="h-full w-full bg-[url('/grid-pattern.png')] bg-repeat bg-[length:100px_100px]" />
          </div>

          {/* 글로우 효과 */}
          <div className="absolute left-0 right-0 top-0 h-10 bg-gradient-to-b from-red-500/10 to-transparent blur-xl" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-red-500/10 to-transparent blur-xl" />

          {/* 대각선 패턴 - 비선형적 간격 */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.08] dark:opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diamond-grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                {/* 대각선 (왼쪽 위에서 오른쪽 아래) */}
                <line x1="0" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-gray-900 dark:text-white" />
                {/* 대각선 (오른쪽 위에서 왼쪽 아래) */}
                <line x1="50" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-gray-900 dark:text-white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diamond-grid-pattern)" />
          </svg>
        </motion.div>

        {/* 마우스 움직임에 따른 동적 요소 */}
        {isHovered && (
          <motion.div
            className="absolute pointer-events-none z-20 mix-blend-overlay"
            style={{
              left: mousePosition.x - cursorSize / 2,
              top: mousePosition.y - cursorSize / 2,
              width: cursorSize,
              height: cursorSize,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
              opacity: isHovered ? 0.7 : 0
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.7 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* 심플한 대각선 효과 */}
        <motion.div
          className="absolute inset-0 z-13 pointer-events-none"
          style={{
            x: useTransform(x, value => value * 0.5),
            y: useTransform(y, value => value * 0.5)
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="spacedDiagonals" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="10" x2="20" y2="10" stroke="url(#diagonalGradient)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="diagonalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3C00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF3C00" stopOpacity="0.3" />
            </linearGradient>
            <rect width="100%" height="100%" fill="url(#spacedDiagonals)" />
          </svg>
        </motion.div>
      </div>
      {/* 메인 컨텐츠 영역 - 항상 중앙에 배치, 패딩으로 여백 조정 */}
      <div
        className="relative w-full h-full z-30 pointer-events-auto flex flex-col"
      >
        {/* 상단 영역: 타이틀 배치 */}
        <div className="w-full pt-12 md:pt-16 lg:pt-20 px-8 md:px-20 lg:px-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-[2px] p-6 rounded-lg bg-black/20 max-w-3xl ml-0 mr-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 md:mb-6 drop-shadow-md">
              안전한 세상을 만드는<br />
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">서한에프앤씨</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl font-medium text-white drop-shadow-md mb-8"
            >
              1992년 설립 이래, 최고의 기술력과 품질로 고객의 안전을 책임지는 소방안전 전문기업입니다.
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-md font-medium flex items-center hover:from-red-600 hover:to-orange-600 transition-all"
              >
                <Link href="/products" className="flex items-center" >
                  제품 둘러보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-md font-medium border border-white/20 hover:bg-white/20 transition-all"
              >
                <Link href="/about" >회사 소개</Link>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* 하단 영역: 탭 메뉴와 콘텐츠 - 푸터 바로 위에 배치 */}
        <div className="w-full px-1 md:px-2 lg:px-3 absolute bottom-[85px] left-0 right-0 z-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="max-w-[98%] md:max-w-[90%] mx-auto w-full"
          >
            {/* 탭 콘텐츠 - 먼저 렌더링하여 위에 표시 */}
            <motion.div
              className="mt-0 mb-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-t-2xl border border-gray-200 dark:border-gray-800 border-b-0 shadow-md overflow-hidden"
              animate={contentControls}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <AnimatePresence mode="wait">
                {activeMenu === 'notice' || activeMenu === null ? (
                  <motion.div
                    key="notice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-4 p-3 md:p-4 lg:p-5"
                  >
                    {/* 공지사항 패널 */}
                    <div className="w-full">
                      <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">최근 공지사항</h3>
                          <Link
                            href="/support/notice"
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center"
                          >
                            더보기
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>

                        {/* 성과지표 - 공지사항과 어울리는 디자인 */}
                        <div className="flex flex-wrap bg-gradient-to-r from-red-50 to-white dark:from-gray-800/60 dark:to-gray-900/60 rounded-xl mb-3 overflow-hidden">
                          <div className="w-full px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-red-600 dark:text-red-400">글로벌 성과</h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">2024년 기준</div>
                          </div>
                          <div className="w-full flex flex-wrap p-2">
                            {stats.map((stat, index) => (
                              <div
                                key={index}
                                className="w-1/2 md:w-1/4 p-1.5 group relative"
                                onMouseEnter={() => setActiveStatIndex(index)}
                                onMouseLeave={() => setActiveStatIndex(null)}
                              >
                                <div className="flex items-center justify-center relative px-2 py-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 transition-all group-hover:border-red-200 dark:group-hover:border-red-900">
                                  <div className="flex flex-col items-center">
                                    <div className="flex items-baseline">
                                      <span className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                        <CountUp start={0} end={stat.value} duration={2} />
                                      </span>
                                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-0.5">
                                        {stat.suffix}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-gray-600 dark:text-gray-400 text-center mt-0.5 font-medium">
                                      {stat.label}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[30vh]">
                          <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {notices.map((notice) => (
                              <Link
                                key={notice.id}
                                href={`/support/notice/${notice.id}`}
                                className="block py-2 px-1 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{notice.title}</p>
                                    <div className="flex items-center mt-1 gap-2">
                                      <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                                        {notice.category}
                                      </span>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  menuItems.map((item) => {
                    if (activeMenu === item.title && item.content) {
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="p-3 md:p-4 overflow-x-auto"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="text-red-600 dark:text-red-500">{item.icon}</span>
                                {item.content.title}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{item.content.subtitle}</p>
                            </div>
                            <Link
                              href={item.link}
                              className="px-3 py-1.5 text-xs text-gray-800 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors bg-gray-200/80 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg flex items-center gap-2"
                            >
                              바로가기
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                          {/* 인증현황 탭인 경우 인증서 갤러리 추가 */}
                          {item.title === "인증현황" && (
                            <div className="mb-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-red-50 to-white dark:from-gray-800/60 dark:to-gray-900/60 rounded-xl p-3">
                                <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">주요 인증서</h4>
                                <div className="relative w-full overflow-hidden">
                                  <div className="animate-scroll flex py-2">
                                    {/* 첫 번째 인증서 세트 */}
                                    {Array.from({ length: 20 }).map((_, index) => (
                                      <div key={`set1-${index}`} className="group relative flex-shrink-0 w-[130px] md:w-[150px] lg:w-[170px] aspect-[3/4] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md mx-2">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-800 opacity-5"></div>
                                        <Image
                                          src={getImagePath(index < 10 ? `/imgsign/m_3_4_img${index}.jpg` : `/imgsign/m_3_4_img${index}.jpg`)}
                                          alt={`인증서 ${index + 1}`}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                          sizes="(max-width: 768px) 130px, (max-width: 1024px) 150px, 170px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                          <span className="text-xs text-white truncate w-full text-center font-medium">
                                            인증서 {index + 1}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                    {/* 두 번째 인증서 세트 (무한 스크롤 효과를 위해 복제) */}
                                    {Array.from({ length: 20 }).map((_, index) => (
                                      <div key={`set2-${index}`} className="group relative flex-shrink-0 w-[130px] md:w-[150px] lg:w-[170px] aspect-[3/4] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md mx-2">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-800 opacity-5"></div>
                                        <Image
                                          src={getImagePath(index < 10 ? `/imgsign/m_3_4_img${index}.jpg` : `/imgsign/m_3_4_img${index}.jpg`)}
                                          alt={`인증서 ${index + 1}`}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                          sizes="(max-width: 768px) 130px, (max-width: 1024px) 150px, 170px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                          <span className="text-xs text-white truncate w-full text-center font-medium">
                                            인증서 {index + 1}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mt-3 max-h-[20vh] md:max-h-[20vh] overflow-y-auto">
                            {item.title !== "인증현황" && item.content.items.map((content) => (
                              <Link
                                key={content.id}
                                href={content.link || item.link}
                                className="flex flex-col p-2 md:p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-lg border border-gray-100 dark:border-gray-800 group"
                              >
                                <p className="text-sm font-medium text-gray-800 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">
                                  {content.title}
                                </p>
                                {content.description && (
                                  <p className="text-xs text-gray-500 dark:text-white/50 mt-1 group-hover:text-gray-700 dark:group-hover:text-white/70">
                                    {content.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-auto pt-2">
                                  {content.category && (
                                    <span className="text-xs text-gray-500 dark:text-white/50 group-hover:text-gray-700 dark:group-hover:text-white/70 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                      {content.category}
                                    </span>
                                  )}
                                  {content.date && (
                                    <span className="text-xs text-gray-500 dark:text-white/50 whitespace-nowrap group-hover:text-gray-700 dark:group-hover:text-white/70">
                                      {content.date}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })
                )}
              </AnimatePresence>
            </motion.div>

            {/* 탭 메뉴 - 나중에 렌더링하여 아래에 표시 */}
            <motion.div
              className="flex flex-nowrap gap-1 px-0 mb-0 overflow-x-auto justify-center"
              animate={tabControls}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {[
                { id: 'notice', title: '공지사항', icon: <div className="h-6 w-6 flex items-center justify-center"><Bell className="h-5 w-5" /></div> },
                ...menuItems.slice(0, 5).map(item => ({
                  id: item.title,
                  title: item.title,
                  icon: <div className="h-6 w-6 flex items-center justify-center">{item.icon}</div>
                }))
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveMenu(activeMenu === tab.id ? null : tab.id)}
                  className={`px-3 py-2 whitespace-nowrap rounded-b-lg font-medium text-sm md:text-base flex items-center gap-2 transition-colors
                    ${activeMenu === tab.id
                      ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-500 shadow-sm border border-gray-200 dark:border-gray-700 border-t-0'
                      : 'bg-white/70 dark:bg-neutral-800/80 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-neutral-800/90'}`}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`${activeMenu === tab.id ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.title}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* 중앙 영역: 여백 */}
        <div className="flex-grow" />
      </div>
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}


