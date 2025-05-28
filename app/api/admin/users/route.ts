import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { logInfo, logError, logWarn } from '@/lib/logger';
import { AdminUser, AdminUsersData, AdminSession } from '@/types/user';
import { safeReadJSON, safeWriteJSON, restoreFromBackup } from '@/lib/file-lock';
import { dataRecovery } from '@/lib/data-integrity';

const dataDir = path.join(process.cwd(), 'data', 'db');
const usersFilePath = path.join(dataDir, 'users.json');

// 기본 관리자 사용자 데이터
const defaultUsersData: AdminUsersData = {
    users: [
        {
            id: "admin-001",
            username: "admin",
            password: "$2b$10$hashedPasswordForAdmin123",
            email: "admin@seohanfc.com",
            role: "관리자",
            name: "시스템 관리자",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
            lastLogin: new Date().toISOString(),
            permissions: [
                "admin.full",
                "users.manage",
                "content.manage",
                "system.manage",
                "statistics.view"
            ]
        },
        {
            id: "editor-001",
            username: "editor",
            password: "$2b$10$hashedPasswordForEditor123",
            email: "editor@seohanfc.com",
            role: "에디터",
            name: "콘텐츠 에디터",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
            lastLogin: "2024-01-19T15:30:00.000Z",
            permissions: [
                "content.manage",
                "products.manage",
                "inquiries.manage"
            ]
        }
    ],
    roles: {
        "관리자": {
            name: "관리자",
            description: "시스템 전체 관리 권한",
            permissions: ["admin.full", "users.manage", "content.manage", "system.manage", "statistics.view"],
            level: 100
        },
        "에디터": {
            name: "에디터",
            description: "콘텐츠 관리 권한",
            permissions: ["content.manage", "products.manage", "inquiries.manage"],
            level: 50
        },
        "스태프": {
            name: "스태프",
            description: "기본 스태프 권한",
            permissions: ["inquiries.view", "statistics.view"],
            level: 20
        }
    },
    sessions: [],
    metadata: {
        lastUpdated: new Date().toISOString(),
        totalUsers: 2,
        activeUsers: 2,
        totalSessions: 0
    }
};

// 사용자 데이터 로드 (무결성 검증 포함)
async function loadUsers(): Promise<AdminUsersData> {
    try {
        console.log('[LoadUsers] 관리자 사용자 데이터 로드 시작');
        const data = await dataRecovery.validateAndRecoverAdminUsers(usersFilePath);
        console.log('[LoadUsers] 관리자 사용자 데이터 로드 완료, 사용자 수:', data.users.length);
        return data;
    } catch (error) {
        console.error('[LoadUsers] 관리자 사용자 데이터 로드 실패:', error);
        throw new Error('관리자 사용자 데이터를 로드할 수 없습니다.');
    }
}

// 사용자 데이터 저장 (무결성 검증 포함)
async function saveUsers(data: AdminUsersData): Promise<void> {
    try {
        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalUsers = data.users.length;
        data.metadata.activeUsers = data.users.filter(user => user.isActive).length;
        data.metadata.totalSessions = data.sessions.filter(session => session.isActive).length;

        // 데이터 검증
        if (!data.users || !Array.isArray(data.users)) {
            throw new Error('잘못된 사용자 데이터 구조');
        }

        // 최소 1명의 활성 관리자 확인
        const activeAdmins = data.users.filter(user =>
            user.isActive && user.role === '관리자'
        );

        if (activeAdmins.length === 0) {
            throw new Error('최소 1명의 활성 관리자가 필요합니다.');
        }

        await safeWriteJSON(usersFilePath, data);
        console.log('[SaveUsers] 사용자 데이터 저장 완료, 사용자 수:', data.users.length);
    } catch (error) {
        console.error('[SaveUsers] 사용자 데이터 저장 실패:', error);
        throw new Error('사용자 데이터 저장에 실패했습니다.');
    }
}

/**
 * GET - 관리자 사용자 목록 조회
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams?.get('id');

        const usersData = await loadUsers();

        // 특정 사용자 조회
        if (userId) {
            const user = usersData.users.find(u => u.id === userId);
            if (!user) {
                return NextResponse.json(
                    { success: false, error: '사용자를 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            // 비밀번호 제외하고 반환
            const { password, ...userWithoutPassword } = user;
            return NextResponse.json({
                success: true,
                user: userWithoutPassword,
                message: '사용자 정보를 성공적으로 불러왔습니다.'
            });
        }

        // 전체 사용자 목록 조회 (비밀번호 제외)
        const usersWithoutPasswords = usersData.users.map(({ password, ...user }) => user);

        return NextResponse.json({
            success: true,
            users: usersWithoutPasswords,
            metadata: usersData.metadata,
            message: '사용자 목록을 성공적으로 불러왔습니다.'
        });
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '사용자 목록을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * POST - 새 관리자 사용자 추가
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            username,
            password,
            email,
            name,
            role = '스태프',
            isActive = true,
            permissions = []
        } = body;

        // 필수 필드 검증
        if (!username || !password || !email || !name) {
            return NextResponse.json(
                { success: false, error: '아이디, 비밀번호, 이메일, 이름은 필수 입력 항목입니다.' },
                { status: 400 }
            );
        }

        const usersData = await loadUsers();

        // 중복 확인
        const existingUser = usersData.users.find(u =>
            u.username === username || u.email === email
        );
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: '이미 존재하는 아이디 또는 이메일입니다.' },
                { status: 409 }
            );
        }

        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 역할별 기본 권한 설정
        let defaultPermissions = permissions;
        if (permissions.length === 0) {
            const rolePermissions = {
                '관리자': ['admin.full', 'users.manage', 'content.manage', 'system.manage', 'statistics.view'],
                '에디터': ['content.manage', 'products.manage', 'inquiries.manage'],
                '스태프': ['inquiries.view', 'statistics.view']
            };
            defaultPermissions = rolePermissions[role as keyof typeof rolePermissions] || ['inquiries.view'];
        }

        // 새 사용자 생성
        const newUser: AdminUser = {
            id: uuidv4(),
            username: username.trim(),
            password: hashedPassword,
            email: email.trim().toLowerCase(),
            name: name.trim(),
            role,
            isActive,
            createdAt: new Date().toISOString(),
            lastLogin: '',
            permissions: defaultPermissions
        };

        usersData.users.push(newUser);
        await saveUsers(usersData);

        // 비밀번호 제외하고 반환
        const { password: _, ...userResponse } = newUser;

        return NextResponse.json({
            success: true,
            user: userResponse,
            message: '관리자 사용자가 성공적으로 추가되었습니다.'
        });
    } catch (error) {
        console.error('사용자 추가 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '사용자 추가에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 관리자 사용자 수정
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            id,
            username,
            password,
            email,
            name,
            role,
            isActive,
            permissions
        } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: '사용자 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const usersData = await loadUsers();
        const userIndex = usersData.users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const existingUser = usersData.users[userIndex];

        // 중복 확인 (자신 제외)
        if (username && username !== existingUser.username) {
            const duplicateUser = usersData.users.find(u =>
                u.id !== id && u.username === username
            );
            if (duplicateUser) {
                return NextResponse.json(
                    { success: false, error: '이미 존재하는 아이디입니다.' },
                    { status: 409 }
                );
            }
        }

        if (email && email !== existingUser.email) {
            const duplicateUser = usersData.users.find(u =>
                u.id !== id && u.email === email
            );
            if (duplicateUser) {
                return NextResponse.json(
                    { success: false, error: '이미 존재하는 이메일입니다.' },
                    { status: 409 }
                );
            }
        }

        // 사용자 정보 업데이트
        const updatedUser = { ...existingUser };

        if (username !== undefined) updatedUser.username = username.trim();
        if (email !== undefined) updatedUser.email = email.trim().toLowerCase();
        if (name !== undefined) updatedUser.name = name.trim();
        if (role !== undefined) updatedUser.role = role;
        if (isActive !== undefined) updatedUser.isActive = isActive;
        if (permissions !== undefined) updatedUser.permissions = permissions;

        // 비밀번호 변경 시 해시화
        if (password && password.trim() !== '') {
            updatedUser.password = await bcrypt.hash(password, 10);
        }

        usersData.users[userIndex] = updatedUser;
        await saveUsers(usersData);

        // 비밀번호 제외하고 반환
        const { password: _, ...userResponse } = updatedUser;

        return NextResponse.json({
            success: true,
            user: userResponse,
            message: '사용자 정보가 성공적으로 수정되었습니다.'
        });
    } catch (error) {
        console.error('사용자 수정 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '사용자 수정에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE - 관리자 사용자 삭제
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams?.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: '사용자 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const usersData = await loadUsers();
        const userIndex = usersData.users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedUser = usersData.users[userIndex];

        // 마지막 관리자 삭제 방지
        const adminUsers = usersData.users.filter(u => u.role === '관리자' && u.isActive);
        if (deletedUser.role === '관리자' && adminUsers.length <= 1) {
            return NextResponse.json(
                { success: false, error: '마지막 관리자는 삭제할 수 없습니다.' },
                { status: 400 }
            );
        }

        usersData.users.splice(userIndex, 1);
        await saveUsers(usersData);

        return NextResponse.json({
            success: true,
            message: `${deletedUser.name} 사용자가 삭제되었습니다.`
        });
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '사용자 삭제에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 