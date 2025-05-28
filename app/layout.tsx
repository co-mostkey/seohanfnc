import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import ClientLayout from "@/components/client-layout"
import { Toaster } from 'sonner'

// 폰트 설정: Inter - 기본 텍스트용
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// 폰트 설정: Playfair - 제목 및 강조 텍스트용
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

// 메타데이터 설정
export const metadata: Metadata = {
  title: "서한에프앤씨 - Seohan F&C",
  description: "1992년 설립 이래, 최고의 기술력과 품질로 고객의 안전을 책임지는 소방안전 전문기업입니다.",
  generator: 'v0.dev',
  keywords: '서한에프앤씨, 소방안전, 완강기, 인명구조, 안전장비',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '서한에프앤씨'
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  other: {
    'msapplication-tap-highlight': 'no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent'
  }
}

// 루트 레이아웃 속성 타입 정의
interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * 애플리케이션 루트 레이아웃 컴포넌트
 * - 프로바이더 적용 (다국어 처리, 테마 등)
 * - 글로벌 폰트 및 스타일 적용
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // iOS 뷰포트 높이 계산 및 설정
              function setVH() {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
              }
              
              // 초기 설정
              setVH();
              
              // 리사이즈 및 방향 변경 시 재계산
              window.addEventListener('resize', setVH);
              window.addEventListener('orientationchange', function() {
                setTimeout(setVH, 100);
              });
              
              // iOS Safari 주소창 변화 감지
              let initialHeight = window.innerHeight;
              window.addEventListener('resize', function() {
                if (Math.abs(window.innerHeight - initialHeight) > 150) {
                  setTimeout(setVH, 50);
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} overflow-auto`} suppressHydrationWarning>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}