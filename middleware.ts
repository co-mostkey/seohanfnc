import { NextRequest, NextResponse } from 'next/server';

// Node.js Runtime 사용
export const runtime = 'nodejs';

// 경로를 명시적으로 지정하여 라우팅 우선순위 문제 해결
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // AS문의를 문의로 리다이렉트 (support/as -> contact)
  if (pathname.startsWith('/support/as')) {
    const newPath = pathname.replace('/support/as', '/contact');
    return NextResponse.redirect(new URL(newPath, request.url));
  }



  // 완강기 제품 경로
  if (pathname === '/products/Descending-Life-Line' || pathname === '/products/Descending-Life-Line/') {
    return NextResponse.redirect(new URL('/products/descenders/Descending-Life-Line/', request.url));
  }

  // 간이완강기 제품 경로
  if (pathname === '/products/Handy-Descending-Life-Line' || pathname === '/products/Handy-Descending-Life-Line/') {
    return NextResponse.redirect(new URL('/products/descenders/Handy-Descending-Life-Line/', request.url));
  }

  // 일반 사용자 대시보드 접근 권한 검증
  if (pathname.startsWith('/dashboard')) {
    console.log('[Middleware] 일반 사용자 대시보드 접근 시도:', pathname);

    const memberSessionId = request.cookies.get('memberSessionId')?.value;
    const isMemberAuthenticated = request.cookies.get('isMemberAuthenticated')?.value;

    console.log('[Middleware] 회원 세션 ID:', memberSessionId ? '존재함' : '없음');
    console.log('[Middleware] 회원 인증 상태:', isMemberAuthenticated);

    if (!memberSessionId || isMemberAuthenticated !== 'true') {
      console.log('[Middleware] 회원 인증 실패, 회원 로그인 페이지로 리다이렉트');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[Middleware] 회원 인증 성공, 대시보드 접근 허용');
  }

  // 관리자 페이지 접근 권한 검증 (관리자 로그인 페이지 제외)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    console.log('[Middleware] 관리자 페이지 접근 시도:', pathname);

    const sessionId = request.cookies.get('sessionId')?.value;
    console.log('[Middleware] 관리자 세션 ID:', sessionId ? '존재함' : '없음');

    if (!sessionId) {
      console.log('[Middleware] 관리자 세션 ID 없음, 관리자 로그인 페이지로 리다이렉트');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 세션 검증은 각 페이지에서 클라이언트 사이드에서 처리
    console.log('[Middleware] 관리자 세션 ID 존재, 페이지 로드 허용 (세션 검증은 클라이언트에서 처리)');
  }

  // 관리자 API 요청 권한 검증 (간단한 쿠키 확인만)
  if (pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/auth/')) {
    const sessionId = request.cookies.get('sessionId')?.value;

    // /api/admin/inquiries는 일부 기능(비밀번호 확인 등)을 위해 세션 없이도 접근 가능
    if (pathname.startsWith('/api/admin/inquiries')) {
      // API에서 자체적으로 권한을 확인하도록 함
      console.log(`[Middleware] 문의 API 요청 허용: ${request.method} ${pathname}`);
      return NextResponse.next();
    }

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // API에서 자체적으로 세션 검증을 처리하도록 함
    console.log(`[Middleware] 관리자 API 요청 허용: ${request.method} ${pathname} (세션 검증은 API에서 처리)`);
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로를 지정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};