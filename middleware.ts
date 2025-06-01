import { NextRequest, NextResponse } from 'next/server';

// Experimental Edge Runtime 사용 (Next.js 15.3.3 호환)
export const runtime = 'experimental-edge';

// [TRISID] 유지보수 모드 체크 - 간단하게 false로 고정 (추후 API로 구현 가능)
function checkMaintenanceMode(): boolean {
  // Edge runtime에서 파일시스템 접근이 제한되므로 
  // 현재는 false로 고정, 필요시 환경변수나 API로 처리
  return false;
}

// 경로를 명시적으로 지정하여 라우팅 우선순위 문제 해결
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // [TRISID] 유지보수 모드 체크 (관리자 경로 제외)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    const isMaintenanceMode = checkMaintenanceMode();

    if (isMaintenanceMode) {
      // 유지보수 페이지로 리다이렉트 (단순한 503 응답)
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>사이트 점검 중</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #ea580c; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔧 사이트 점검 중</h1>
            <p>현재 시스템 점검 중입니다.</p>
            <p>빠른 시일 내에 서비스를 재개하겠습니다.</p>
            <p>문의사항이 있으시면 관리자에게 연락해 주세요.</p>
          </div>
        </body>
        </html>
        `,
        {
          status: 503,
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'Retry-After': '3600'
          }
        }
      );
    }
  }

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
  if (pathname === '/admin') {
    // /admin 루트에서는 세션이 없어도 리다이렉트하지 않고, 클라이언트에서 로그인 폼을 노출
    // 세션 체크만 하고, 리다이렉트는 하지 않음
    const sessionId = request.cookies.get('sessionId')?.value;
    console.log('[Middleware] /admin 루트 접근, 세션 ID:', sessionId ? '존재함' : '없음');
    // 세션이 없어도 NextResponse.next()로 통과
  } else if (pathname.startsWith('/admin')) {
    // /admin 하위 경로에서는 기존처럼 세션 체크/리다이렉트 유지
    const sessionId = request.cookies.get('sessionId')?.value;
    console.log('[Middleware] 관리자 하위 경로 접근:', pathname, '세션 ID:', sessionId ? '존재함' : '없음');
    if (!sessionId) {
      console.log('[Middleware] 관리자 세션 ID 없음, /admin으로 리다이렉트');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
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

  // [TRISID] 인트라넷 접근 권한 검증 (로그인 페이지 제외)
  if (pathname.startsWith('/intranet') && pathname !== '/intranet/login') {
    console.log('[Middleware] 인트라넷 접근 시도:', pathname);

    const intranetSessionId = request.cookies.get('intranetSessionId')?.value;
    const isIntranetAuthenticated = request.cookies.get('isIntranetAuthenticated')?.value;

    console.log('[Middleware] 인트라넷 세션 ID:', intranetSessionId ? '존재함' : '없음');
    console.log('[Middleware] 인트라넷 인증 상태:', isIntranetAuthenticated);

    if (!intranetSessionId || isIntranetAuthenticated !== 'true') {
      console.log('[Middleware] 인트라넷 인증 실패, 로그인 페이지로 리다이렉트');
      return NextResponse.redirect(new URL('/intranet/login', request.url));
    }

    console.log('[Middleware] 인트라넷 인증 성공, 접근 허용');
  }

  // 인트라넷 API 요청 권한 검증
  if (pathname.startsWith('/api/auth/intranet-') && pathname !== '/api/auth/intranet-login') {
    const intranetSessionId = request.cookies.get('intranetSessionId')?.value;

    if (!intranetSessionId) {
      return NextResponse.json(
        { success: false, error: '인트라넷 인증이 필요합니다.' },
        { status: 401 }
      );
    }

    console.log(`[Middleware] 인트라넷 API 요청 허용: ${request.method} ${pathname}`);
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