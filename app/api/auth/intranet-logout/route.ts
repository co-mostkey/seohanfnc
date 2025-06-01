import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json(
            { success: true, message: '인트라넷 로그아웃 되었습니다.' },
            { status: 200 }
        );

        // 인트라넷 세션 쿠키 삭제
        response.cookies.set('intranetSessionId', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0, // 즉시 만료
        });

        response.cookies.set('isIntranetAuthenticated', '', {
            httpOnly: false, // 클라이언트에서 접근 가능해야 할 수 있음
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0, // 즉시 만료
        });

        return response;
    } catch (error) {
        // console.error('[IntranetLogoutAPI] 오류:', error); // 디버깅 로그 제외
        return NextResponse.json(
            { success: false, error: '로그아웃 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 