"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: NextThemesProviderProps['attribute']
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // 컴포넌트가 마운트된 후에만 children을 렌더링
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 서버 사이드 렌더링 시에는 children만 렌더링, 클라이언트 사이드에서 테마 적용
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

