import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Member, MemberData, MemberStats } from '@/types/member';
import { safeReadJSON, safeWriteJSON, restoreFromBackup } from '@/lib/file-lock';
import { dataRecovery } from '@/lib/data-integrity';
import { backupDataFile, validateMemberData, ensureDirExists } from '@/lib/apiUtils';

const dataDir = path.join(process.cwd(), 'data', 'db');
const membersFilePath = path.join(dataDir, 'members.json');

// 기본 회원 데이터
const defaultMemberData: MemberData = {
    members: [],
    metadata: {
        lastUpdated: new Date().toISOString(),
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0
    }
};

// 회원 데이터 로드 (무결성 검증 포함)
async function loadMembers(): Promise<MemberData> {
    try {
        console.log('[LoadMembers] 회원 데이터 로드 시작');
        const data = await dataRecovery.validateAndRecoverMembers(membersFilePath);
        console.log('[LoadMembers] 회원 데이터 로드 완료, 회원 수:', data.members.length);
        return data;
    } catch (error) {
        console.error('[LoadMembers] 회원 데이터 로드 실패:', error);
        throw new Error('회원 데이터를 로드할 수 없습니다.');
    }
}

// 회원 데이터 저장 (무결성 검증 포함)
async function saveMembers(data: MemberData): Promise<void> {
    try {
        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalMembers = data.members.length;
        data.metadata.activeMembers = data.members.filter(m => m.status === 'active').length;
        data.metadata.pendingMembers = data.members.filter(m => m.status === 'pending').length;

        // 데이터 검증
        if (!data.members || !Array.isArray(data.members)) {
            throw new Error('잘못된 회원 데이터 구조');
        }

        await safeWriteJSON(membersFilePath, data);
        console.log('[SaveMembers] 회원 데이터 저장 완료, 회원 수:', data.members.length);
    } catch (error) {
        console.error('[SaveMembers] 회원 데이터 저장 실패:', error);
        throw new Error('회원 데이터 저장에 실패했습니다.');
    }
}

// 회원 통계 계산
function calculateMemberStats(members: Member[]): MemberStats {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return {
        total: members.length,
        active: members.filter(m => m.status === 'active').length,
        inactive: members.filter(m => m.status === 'inactive').length,
        pending: members.filter(m => m.status === 'pending').length,
        suspended: members.filter(m => m.status === 'suspended').length,
        newThisMonth: members.filter(m => new Date(m.createdAt) >= thisMonth).length,
        newThisWeek: members.filter(m => new Date(m.createdAt) >= thisWeek).length,
        newLastMonth: members.filter(m => {
            const createdAt = new Date(m.createdAt);
            return createdAt >= lastMonth && createdAt < thisMonth;
        }).length,
        recentLogins: members.filter(m =>
            m.lastLoginAt && new Date(m.lastLoginAt) >= thisWeek
        ).length,
        emailVerified: members.filter(m => m.emailVerified).length,
        marketingConsent: members.filter(m => m.marketingConsent).length
    };
}

/**
 * GET - 회원 목록 조회
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const memberId = searchParams?.get('id');
        const page = parseInt(searchParams?.get('page') || '1');
        const limit = parseInt(searchParams?.get('limit') || '20');
        const search = searchParams?.get('search') || '';
        const status = searchParams?.get('status') || 'all';
        const source = searchParams?.get('source') || 'all';
        const includeStats = searchParams?.get('includeStats') === 'true';

        const memberData = await loadMembers();

        // 특정 회원 조회
        if (memberId) {
            const member = memberData.members.find(m => m.id === memberId);
            if (!member) {
                return NextResponse.json(
                    { success: false, error: '회원을 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                member,
                message: '회원 정보를 성공적으로 불러왔습니다.'
            });
        }

        // 필터링
        let filteredMembers = memberData.members;

        // 검색 필터
        if (search) {
            const searchLower = search.toLowerCase();
            filteredMembers = filteredMembers.filter(member =>
                member.name.toLowerCase().includes(searchLower) ||
                member.email.toLowerCase().includes(searchLower) ||
                (member.company && member.company.toLowerCase().includes(searchLower)) ||
                (member.phone && member.phone.includes(search))
            );
        }

        // 상태 필터
        if (status !== 'all') {
            filteredMembers = filteredMembers.filter(member => member.status === status);
        }

        // 가입 경로 필터
        if (source !== 'all') {
            filteredMembers = filteredMembers.filter(member => member.source === source);
        }

        // 정렬 (최신순)
        filteredMembers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 페이지네이션
        const totalItems = filteredMembers.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

        const response: any = {
            success: true,
            members: paginatedMembers,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            message: '회원 목록을 성공적으로 불러왔습니다.'
        };

        // 통계 포함
        if (includeStats) {
            response.stats = calculateMemberStats(memberData.members);
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('회원 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '회원 목록을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * POST - 새 회원 추가 (관리자용)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // [TRISID] 2025-06-01: 폴더 자동 생성 및 데이터 검증, 자동 백업 적용
        ensureDirExists('data/db');
        ensureDirExists('data/db/backups');

        // 데이터 검증 (동기 함수이므로 await 제거)
        if (!validateMemberData(body)) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 회원 데이터입니다.' },
                { status: 400 }
            );
        }

        await backupDataFile('data/db/members.json');
        const {
            email,
            name,
            phone,
            company,
            position,
            address,
            interests = [],
            status = 'active',
            source = 'manual',
            marketingConsent = false,
            privacyConsent = true,
            notes = ''
        } = body;

        // 필수 필드 검증
        if (!email || !name) {
            return NextResponse.json(
                { success: false, error: '이메일과 이름은 필수 입력 항목입니다.' },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: '올바른 이메일 형식을 입력해주세요.' },
                { status: 400 }
            );
        }

        const memberData = await loadMembers();

        // 이메일 중복 확인
        const existingMember = memberData.members.find(m => m.email === email.toLowerCase());
        if (existingMember) {
            return NextResponse.json(
                { success: false, error: '이미 등록된 이메일입니다.' },
                { status: 409 }
            );
        }

        // 새 회원 생성
        const newMember: Member = {
            id: uuidv4(),
            email: email.trim().toLowerCase(),
            name: name.trim(),
            phone: phone?.trim(),
            company: company?.trim(),
            position: position?.trim(),
            address: address?.trim(),
            interests,
            status,
            emailVerified: status === 'active', // 관리자가 추가하는 경우 자동 인증
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
            source,
            marketingConsent,
            privacyConsent,
            notes: notes?.trim()
        };

        memberData.members.push(newMember);
        await saveMembers(memberData);

        return NextResponse.json({
            success: true,
            member: newMember,
            message: '회원이 성공적으로 추가되었습니다.'
        });
    } catch (error) {
        console.error('회원 추가 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '회원 추가에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 회원 정보 수정
 */
export async function PUT(request: NextRequest) {
    try {
        console.log('[PUT] 회원 수정 요청 시작');

        const body = await request.json();
        console.log('[PUT] 요청 본문:', JSON.stringify(body, null, 2));

        if (!body || !body.id) {
            return NextResponse.json(
                { success: false, error: '회원 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 파일 직접 처리
        const membersFile = path.join(process.cwd(), 'data', 'db', 'members.json');
        const fileContent = await fs.readFile(membersFile, 'utf8');
        const memberData = JSON.parse(fileContent);

        const memberIndex = memberData.members.findIndex((m: any) => m.id === body.id);

        if (memberIndex === -1) {
            return NextResponse.json(
                { success: false, error: '회원을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const existingMember = memberData.members[memberIndex];

        // 업데이트할 필드들 처리
        const updatedMember = { ...existingMember };

        if (body.status !== undefined) updatedMember.status = body.status;
        if (body.name !== undefined) updatedMember.name = body.name.trim();
        if (body.email !== undefined) updatedMember.email = body.email.trim().toLowerCase();
        if (body.phone !== undefined) updatedMember.phone = body.phone?.trim();
        if (body.company !== undefined) updatedMember.company = body.company?.trim();
        if (body.position !== undefined) updatedMember.position = body.position?.trim();
        if (body.address !== undefined) updatedMember.address = body.address?.trim();
        if (body.interests !== undefined) updatedMember.interests = body.interests;
        if (body.emailVerified !== undefined) updatedMember.emailVerified = body.emailVerified;
        if (body.marketingConsent !== undefined) updatedMember.marketingConsent = body.marketingConsent;
        if (body.privacyConsent !== undefined) updatedMember.privacyConsent = body.privacyConsent;
        if (body.notes !== undefined) updatedMember.notes = body.notes?.trim();

        memberData.members[memberIndex] = updatedMember;

        // 메타데이터 업데이트
        memberData.metadata = {
            lastUpdated: new Date().toISOString(),
            totalMembers: memberData.members.length,
            activeMembers: memberData.members.filter((m: any) => m.status === 'active').length,
            pendingMembers: memberData.members.filter((m: any) => m.status === 'pending').length
        };

        await fs.writeFile(membersFile, JSON.stringify(memberData, null, 2));

        console.log('[PUT] 회원 정보 수정 완료:', updatedMember.name, updatedMember.status);

        return NextResponse.json({
            success: true,
            member: updatedMember,
            message: '회원 정보가 성공적으로 수정되었습니다.'
        });
    } catch (error) {
        console.error('[PUT] 회원 수정 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '회원 수정에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE - 회원 삭제
 */
export async function DELETE(request: NextRequest) {
    try {
        console.log('[DELETE] 회원 삭제 요청 시작');

        const { searchParams } = new URL(request.url);
        const id = searchParams?.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: '회원 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        console.log('[DELETE] 삭제할 회원 ID:', id);

        // 파일 직접 처리
        const membersFile = path.join(process.cwd(), 'data', 'db', 'members.json');
        const fileContent = await fs.readFile(membersFile, 'utf8');
        const memberData = JSON.parse(fileContent);

        const memberIndex = memberData.members.findIndex((m: any) => m.id === id);

        if (memberIndex === -1) {
            return NextResponse.json(
                { success: false, error: '회원을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedMember = memberData.members[memberIndex];
        memberData.members.splice(memberIndex, 1);

        // 메타데이터 업데이트
        memberData.metadata = {
            lastUpdated: new Date().toISOString(),
            totalMembers: memberData.members.length,
            activeMembers: memberData.members.filter((m: any) => m.status === 'active').length,
            pendingMembers: memberData.members.filter((m: any) => m.status === 'pending').length
        };

        await fs.writeFile(membersFile, JSON.stringify(memberData, null, 2));

        console.log('[DELETE] 회원 삭제 완료:', deletedMember.name);

        return NextResponse.json({
            success: true,
            message: `${deletedMember.name} 회원이 삭제되었습니다.`
        });
    } catch (error) {
        console.error('[DELETE] 회원 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '회원 삭제에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 