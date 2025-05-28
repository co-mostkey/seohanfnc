import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Member, MemberData } from '@/types/member';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';
import { dataRecovery } from '@/lib/data-integrity';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'db');
const membersFilePath = path.join(dataDir, 'members.json');

// 회원 세션 타입
interface MemberSession {
    id: string;
    memberId: string;
    email: string;
    name: string;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
    lastActivity: string;
}

// 회원 데이터 로드
async function loadMembers(): Promise<MemberData> {
    try {
        console.log('[MemberLogin] 회원 데이터 로드 시작');
        const data = await dataRecovery.validateAndRecoverMembers(membersFilePath);
        console.log('[MemberLogin] 회원 데이터 로드 완료, 회원 수:', data.members.length);
        return data;
    } catch (error) {
        console.error('[MemberLogin] 회원 데이터 로드 실패:', error);
        throw new Error('회원 데이터를 로드할 수 없습니다.');
    }
}

// 회원 데이터 저장
async function saveMembers(data: MemberData): Promise<void> {
    try {
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalMembers = data.members.length;
        data.metadata.activeMembers = data.members.filter(m => m.status === 'active').length;
        data.metadata.pendingMembers = data.members.filter(m => m.status === 'pending').length;

        await safeWriteJSON(membersFilePath, data);
        console.log('[MemberLogin] 회원 데이터 저장 완료');
    } catch (error) {
        console.error('[MemberLogin] 회원 데이터 저장 실패:', error);
        throw error;
    }
}

// 비밀번호 검증 (notes에서 해시 추출)
function extractPasswordHash(notes: string): string | null {
    if (!notes) return null;
    const match = notes.match(/password_hash:(.+?)(?:\n|$)/);
    return match ? match[1] : null;
}

// 비밀번호 검증
async function verifyMemberPassword(inputPassword: string, member: Member): Promise<boolean> {
    try {
        const passwordHash = extractPasswordHash(member.notes || '');
        if (!passwordHash) {
            console.error('[MemberLogin] 비밀번호 해시를 찾을 수 없음');
            return false;
        }

        return await bcrypt.compare(inputPassword, passwordHash);
    } catch (error) {
        console.error('[MemberLogin] 비밀번호 검증 오류:', error);
        return false;
    }
}

// 세션 생성
function createMemberSession(member: Member): MemberSession {
    const sessionId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30일 후 만료

    return {
        id: sessionId,
        memberId: member.id,
        email: member.email,
        name: member.name,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        lastActivity: now.toISOString()
    };
}

/**
 * POST - 일반 회원 로그인
 */
export async function POST(request: NextRequest) {
    try {
        console.log('[MemberLogin] 회원 로그인 요청 시작');

        // 요청 본문 검증
        let body;
        try {
            const text = await request.text();
            if (!text || text.trim() === '') {
                return NextResponse.json(
                    { success: false, error: '요청 데이터가 없습니다.' },
                    { status: 400 }
                );
            }
            body = JSON.parse(text);
        } catch (parseError) {
            return NextResponse.json(
                { success: false, error: '잘못된 요청 형식입니다.' },
                { status: 400 }
            );
        }

        const { email, password } = body;
        console.log('[MemberLogin] 로그인 시도:', { email });

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        const memberData = await loadMembers();

        // 회원 찾기
        const member = memberData.members.find(m =>
            m.email.toLowerCase() === email.toLowerCase()
        );

        if (!member) {
            console.log('[MemberLogin] 회원을 찾을 수 없음:', email);
            return NextResponse.json(
                { success: false, error: '등록되지 않은 이메일입니다.' },
                { status: 401 }
            );
        }

        // 계정 상태 확인
        if (member.status === 'pending') {
            return NextResponse.json(
                { success: false, error: '계정이 승인 대기 중입니다. 관리자 승인 후 이용 가능합니다.' },
                { status: 403 }
            );
        }

        if (member.status === 'suspended') {
            return NextResponse.json(
                { success: false, error: '정지된 계정입니다. 관리자에게 문의하세요.' },
                { status: 403 }
            );
        }

        if (member.status !== 'active') {
            return NextResponse.json(
                { success: false, error: '비활성 계정입니다. 관리자에게 문의하세요.' },
                { status: 403 }
            );
        }

        console.log('[MemberLogin] 회원 찾음:', { id: member.id, status: member.status });

        // 비밀번호 검증
        const isPasswordValid = await verifyMemberPassword(password, member);
        if (!isPasswordValid) {
            console.log('[MemberLogin] 비밀번호 불일치');
            return NextResponse.json(
                { success: false, error: '이메일 또는 비밀번호가 잘못되었습니다.' },
                { status: 401 }
            );
        }

        console.log('[MemberLogin] 비밀번호 검증 성공');

        // 세션 생성
        const newSession = createMemberSession(member);
        console.log('[MemberLogin] 새 세션 생성:', { sessionId: newSession.id });

        // 마지막 로그인 시간 업데이트
        const memberIndex = memberData.members.findIndex(m => m.id === member.id);
        if (memberIndex !== -1) {
            memberData.members[memberIndex].lastLoginAt = new Date().toISOString();
        }

        // 데이터 저장
        await saveMembers(memberData);
        console.log('[MemberLogin] 회원 데이터 저장 완료');

        // 응답 생성
        const response = NextResponse.json({
            success: true,
            message: '로그인에 성공했습니다.',
            member: {
                id: member.id,
                email: member.email,
                name: member.name,
                company: member.company,
                position: member.position,
                phone: member.phone,
                emailVerified: member.emailVerified,
                marketingConsent: member.marketingConsent
            },
            session: {
                id: newSession.id,
                expiresAt: newSession.expiresAt
            }
        });

        console.log('[MemberLogin] 쿠키 설정 시작');

        // 회원 전용 쿠키 설정
        response.cookies.set('memberSessionId', newSession.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30일
            path: '/'
        });

        response.cookies.set('isMemberAuthenticated', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30일
            path: '/'
        });

        response.cookies.set('memberInfo', JSON.stringify({
            id: member.id,
            email: member.email,
            name: member.name
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30일
            path: '/'
        });

        console.log('[MemberLogin] 쿠키 설정 완료, 응답 반환');
        return response;

    } catch (error) {
        console.error('[MemberLogin] 로그인 처리 중 오류:', error);
        return NextResponse.json(
            { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 