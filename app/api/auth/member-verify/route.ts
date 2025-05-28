import { NextRequest, NextResponse } from 'next/server';
import { Member, MemberData } from '@/types/member';
import { dataRecovery } from '@/lib/data-integrity';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'db');
const membersFilePath = path.join(dataDir, 'members.json');

// 회원 데이터 로드
async function loadMembers(): Promise<MemberData> {
    try {
        const data = await dataRecovery.validateAndRecoverMembers(membersFilePath);
        return data;
    } catch (error) {
        console.error('[MemberVerify] 회원 데이터 로드 실패:', error);
        throw new Error('회원 데이터를 로드할 수 없습니다.');
    }
}

/**
 * GET - 일반 회원 세션 검증
 */
export async function GET(request: NextRequest) {
    try {
        console.log('[MemberVerify] 회원 세션 검증 요청 시작');

        // 쿠키에서 회원 정보 확인
        const memberSessionId = request.cookies.get('memberSessionId')?.value;
        const isMemberAuthenticated = request.cookies.get('isMemberAuthenticated')?.value;
        const memberInfoCookie = request.cookies.get('memberInfo')?.value;

        if (!memberSessionId || !isMemberAuthenticated || isMemberAuthenticated !== 'true') {
            console.log('[MemberVerify] 세션 정보 없음');
            return NextResponse.json({
                success: false,
                authenticated: false,
                error: '로그인이 필요합니다.'
            }, { status: 401 });
        }

        let memberInfo;
        try {
            memberInfo = memberInfoCookie ? JSON.parse(memberInfoCookie) : null;
        } catch (error) {
            console.error('[MemberVerify] 회원 정보 파싱 오류:', error);
            return NextResponse.json({
                success: false,
                authenticated: false,
                error: '세션 정보가 손상되었습니다.'
            }, { status: 401 });
        }

        if (!memberInfo || !memberInfo.id) {
            console.log('[MemberVerify] 회원 정보 없음');
            return NextResponse.json({
                success: false,
                authenticated: false,
                error: '세션 정보가 없습니다.'
            }, { status: 401 });
        }

        // 데이터베이스에서 회원 정보 확인
        const memberData = await loadMembers();
        const member = memberData.members.find(m => m.id === memberInfo.id);

        if (!member) {
            console.log('[MemberVerify] 회원을 찾을 수 없음:', memberInfo.id);
            return NextResponse.json({
                success: false,
                authenticated: false,
                error: '회원 정보를 찾을 수 없습니다.'
            }, { status: 401 });
        }

        // 계정 상태 확인
        if (member.status !== 'active') {
            console.log('[MemberVerify] 비활성 계정:', { id: member.id, status: member.status });
            return NextResponse.json({
                success: false,
                authenticated: false,
                error: '계정이 비활성 상태입니다.'
            }, { status: 403 });
        }

        console.log('[MemberVerify] 세션 검증 성공:', { id: member.id, email: member.email });

        return NextResponse.json({
            success: true,
            authenticated: true,
            member: {
                id: member.id,
                email: member.email,
                name: member.name,
                company: member.company,
                position: member.position,
                phone: member.phone,
                emailVerified: member.emailVerified,
                marketingConsent: member.marketingConsent,
                status: member.status
            }
        });

    } catch (error) {
        console.error('[MemberVerify] 세션 검증 중 오류:', error);
        return NextResponse.json({
            success: false,
            authenticated: false,
            error: '세션 검증 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 