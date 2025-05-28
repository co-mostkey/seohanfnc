import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Member, MemberData } from '@/types/member';

const dataDir = path.join(process.cwd(), 'data', 'db');
const membersFilePath = path.join(dataDir, 'members.json');

// 회원 데이터 로드
async function loadMembers(): Promise<MemberData> {
    try {
        const content = await fs.readFile(membersFilePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('회원 데이터 로드 실패:', error);
        // 파일이 없으면 기본 구조 생성
        const defaultData: MemberData = {
            members: [],
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalMembers: 0,
                activeMembers: 0,
                pendingMembers: 0
            }
        };
        await saveMembers(defaultData);
        return defaultData;
    }
}

// 회원 데이터 저장
async function saveMembers(data: MemberData): Promise<void> {
    try {
        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalMembers = data.members.length;
        data.metadata.activeMembers = data.members.filter(m => m.status === 'active').length;
        data.metadata.pendingMembers = data.members.filter(m => m.status === 'pending').length;

        await fs.writeFile(membersFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('회원 데이터 저장 실패:', error);
        throw new Error('회원 데이터 저장에 실패했습니다.');
    }
}

/**
 * POST - 일반 사용자 회원가입
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            email,
            password,
            name,
            phone,
            company,
            position,
            address,
            interests,
            marketingConsent = false,
            privacyConsent = true
        } = body;

        // 필수 필드 검증
        if (!email || !password || !name) {
            return NextResponse.json(
                {
                    success: false,
                    error: '이메일, 비밀번호, 이름은 필수 입력 항목입니다.'
                },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: '올바른 이메일 형식을 입력해주세요.'
                },
                { status: 400 }
            );
        }

        // 비밀번호 길이 검증
        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    error: '비밀번호는 최소 6자 이상이어야 합니다.'
                },
                { status: 400 }
            );
        }

        // 개인정보 처리 동의 확인
        if (!privacyConsent) {
            return NextResponse.json(
                {
                    success: false,
                    error: '개인정보 처리 방침에 동의해야 합니다.'
                },
                { status: 400 }
            );
        }

        const memberData = await loadMembers();

        // 이메일 중복 확인
        const existingMember = memberData.members.find(m => m.email === email.toLowerCase());
        if (existingMember) {
            return NextResponse.json(
                {
                    success: false,
                    error: '이미 등록된 이메일입니다.'
                },
                { status: 409 }
            );
        }

        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새 회원 생성
        const newMember: Member = {
            id: uuidv4(),
            email: email.trim().toLowerCase(),
            name: name.trim(),
            phone: phone?.trim(),
            company: company?.trim(),
            position: position?.trim(),
            address: address?.trim(),
            interests: interests || [],
            status: 'pending', // 기본적으로 승인 대기 상태
            emailVerified: false,
            createdAt: new Date().toISOString(),
            source: 'website',
            marketingConsent,
            privacyConsent,
            // 비밀번호는 별도 저장 (실제 구현에서는 별도 테이블 권장)
            // 여기서는 간단히 notes에 해시 저장 (보안상 권장하지 않음)
            notes: `password_hash:${hashedPassword}`
        };

        memberData.members.push(newMember);
        await saveMembers(memberData);

        // 응답에서 비밀번호 해시 제거
        const { notes, ...memberResponse } = newMember;

        return NextResponse.json({
            success: true,
            member: memberResponse,
            message: '회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.'
        });
    } catch (error) {
        console.error('회원가입 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '회원가입 처리 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 