import React from 'react';
import Image from 'next/image';
// import { GlobalNav } from '@/components/ui/GlobalNav'; // GlobalNav import 제거
import {
  MAIN_CONTENT_PT_CLASS,
  MAIN_CONTENT_PB_DESKTOP_CLASS,
  MAIN_CONTENT_PB_MOBILE_CLASS
} from '@/lib/layoutConstants';
import { cn, getImagePath } from '@/lib/utils'; // cn import 추가 (main className에 사용)

interface ProductDetailFrameLayoutProps {
  children: React.ReactNode;
}

export default function ProductDetailFrameLayout({ children }: ProductDetailFrameLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 relative overflow-hidden">
      {/* 배경 효과 영역 */}
      <div className="fixed inset-0 z-0">
        {/* 안전구염 이미지를 오버레이로 표시 */}
        <div className="absolute right-0 bottom-0 w-[60vw] h-[70vh] z-0 opacity-20 hidden lg:block">
          <Image
            src={getImagePath('/images/products/safety-mat-bg.jpg')}
            alt="안전구염 배경"
            fill
            className="object-contain object-right-bottom"
            priority
          />
        </div>

        {/* 비주얼 이미지 왼쪽 위치 */}
        <div className="absolute left-0 bottom-[20vh] w-[40vw] h-[50vh] z-0 opacity-30 hidden xl:block">
          <Image
            src={getImagePath('/images/products/visuals/safety-air-cushion.png')}
            alt="안전 에어 쿠션"
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* 그라디언트 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/90 to-black z-0"></div>
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black to-transparent z-0"></div>

        {/* 컬러 오버레이 */}
        <div className="absolute top-20 left-[-20vw] w-[70vw] h-[70vh] rounded-full bg-red-900/10 blur-[150px] z-0"></div>
        <div className="absolute bottom-20 right-[-20vw] w-[70vw] h-[70vh] rounded-full bg-orange-700/5 blur-[150px] z-0"></div>

        {/* 배경 그리드 패턴 */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5 z-0"></div>
      </div>

      {/* 상단 헤더 및 네비게이션 제거 */}
      {/* 
      <header className="w-full sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-gray-800/30 shadow-lg shadow-black/20">
        <GlobalNav />
      </header>
      */}

      {/* 메인 콘텐츠 - ClientLayout의 main 태그와 동일한 패딩 구조 적용 */}
      <main className={cn(
        "relative z-10 w-full flex-grow overflow-y-auto",
        MAIN_CONTENT_PT_CLASS,
        MAIN_CONTENT_PB_DESKTOP_CLASS,
        MAIN_CONTENT_PB_MOBILE_CLASS
      )}>
        {children}
      </main>

      {/* 푸터 (이 푸터도 ClientLayout의 푸터와 중복될 수 있으므로 확인 필요) */}
      {/* 만약 ClientLayout에서 이미 푸터를 렌더링한다면 이 footer는 제거해야 함. */}
      {/* 현재는 ClientLayout의 isLegacyLayoutPage=false 분기에서 Footer가 렌더링 되므로, 여기 푸터는 중복임. 제거.*/}
      {/* 
      <footer className="relative z-10 w-full py-6 px-4 bg-black/70 border-t border-gray-800/30 backdrop-blur-xl">
        <div className="container mx-auto text-center">
          <span className="text-sm text-gray-400">© 2024 서한에프앤씨 | 모든 권리 보유</span>
        </div>
      </footer>
      */}
    </div>
  );
} 