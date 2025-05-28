import { NextRequest, NextResponse } from 'next/server';

/**
 * POST - 일반 회원 로그아웃
 */
export async function POST(request: NextRequest) {
    try {
        console.log('[MemberLogout] 회원 로그아웃 요청 시작');

        // 응답 생성
        const response = NextResponse.json({
            success: true,
            message: '로그아웃되었습니다.'
        });

        // 회원 관련 쿠키 삭제
        response.cookies.set('memberSessionId', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/'
        });

        response.cookies.set('isMemberAuthenticated', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/'
        });

        response.cookies.set('memberInfo', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/'
        });

        console.log('[MemberLogout] 로그아웃 완료');
        return response;

    } catch (error) {
        console.error('[MemberLogout] 로그아웃 처리 중 오류:', error);
        return NextResponse.json(
            { success: false, error: '로그아웃 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 