import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data', 'db');
const usersFilePath = path.join(dataDir, 'users.json');

interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    permissions: string[];
    phone?: string;
    department?: string;
    bio?: string;
}

interface UsersData {
    users: User[];
    roles: Record<string, any>;
    sessions: Array<{
        id: string;
        userId: string;
        username: string;
        role: string;
        createdAt: string;
        expiresAt: string;
        isActive: boolean;
    }>;
    metadata: {
        lastUpdated: string;
        totalUsers: number;
        activeUsers: number;
        totalSessions: number;
    };
}

// 사용자 데이터 로드
async function loadUsers(): Promise<UsersData> {
    try {
        const content = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
        throw new Error('사용자 데이터를 불러올 수 없습니다.');
    }
}

// 사용자 데이터 저장
async function saveUsers(data: UsersData): Promise<void> {
    try {
        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalUsers = data.users.length;
        data.metadata.activeUsers = data.users.filter(user => user.isActive).length;
        data.metadata.totalSessions = data.sessions.filter(session => session.isActive).length;

        await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('사용자 데이터 저장 실패:', error);
        throw new Error('사용자 데이터 저장에 실패했습니다.');
    }
}

// 세션에서 현재 사용자 정보 가져오기
async function getCurrentUser(request: NextRequest): Promise<User | null> {
    try {
        const sessionId = request.cookies.get('sessionId')?.value;
        if (!sessionId) {
            return null;
        }

        const usersData = await loadUsers();
        const session = usersData.sessions.find(s => s.id === sessionId && s.isActive);

        if (!session) {
            return null;
        }

        // 세션 만료 확인
        if (new Date(session.expiresAt) < new Date()) {
            return null;
        }

        const user = usersData.users.find(u => u.id === session.userId);
        return user || null;
    } catch (error) {
        console.error('현재 사용자 정보 조회 실패:', error);
        return null;
    }
}

/**
 * GET - 현재 관리자 프로필 조회
 */
export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        // 비밀번호 제외하고 반환
        const { password, ...userProfile } = currentUser;

        return NextResponse.json({
            success: true,
            profile: userProfile,
            message: '프로필을 성공적으로 불러왔습니다.'
        });
    } catch (error) {
        console.error('프로필 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '프로필을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 관리자 프로필 업데이트
 */
export async function PUT(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            name,
            email,
            phone,
            department,
            bio,
            currentPassword,
            newPassword
        } = body;

        const usersData = await loadUsers();
        const userIndex = usersData.users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 비밀번호 변경 요청이 있는 경우
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { success: false, error: '현재 비밀번호를 입력해주세요.' },
                    { status: 400 }
                );
            }

            // 현재 비밀번호 확인
            const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser.password);
            if (!isCurrentPasswordValid) {
                return NextResponse.json(
                    { success: false, error: '현재 비밀번호가 올바르지 않습니다.' },
                    { status: 400 }
                );
            }

            // 새 비밀번호 유효성 검사
            if (newPassword.length < 6) {
                return NextResponse.json(
                    { success: false, error: '새 비밀번호는 최소 6자 이상이어야 합니다.' },
                    { status: 400 }
                );
            }

            // 새 비밀번호 해시화
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            usersData.users[userIndex].password = hashedNewPassword;
        }

        // 개인 정보 업데이트 (기본 유효성 검사)
        if (name !== undefined) {
            if (!name.trim()) {
                return NextResponse.json(
                    { success: false, error: '이름을 입력해주세요.' },
                    { status: 400 }
                );
            }
            usersData.users[userIndex].name = name.trim();
        }

        if (email !== undefined) {
            if (!email.trim()) {
                return NextResponse.json(
                    { success: false, error: '이메일을 입력해주세요.' },
                    { status: 400 }
                );
            }

            // 간단한 이메일 형식 검증
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                return NextResponse.json(
                    { success: false, error: '올바른 이메일 형식을 입력해주세요.' },
                    { status: 400 }
                );
            }

            usersData.users[userIndex].email = email.trim();
        }

        if (phone !== undefined) {
            usersData.users[userIndex].phone = phone.trim();
        }

        if (department !== undefined) {
            usersData.users[userIndex].department = department.trim();
        }

        if (bio !== undefined) {
            usersData.users[userIndex].bio = bio.trim();
        }

        // 데이터 저장
        await saveUsers(usersData);

        // 업데이트된 사용자 정보 반환 (비밀번호 제외)
        const { password, ...updatedProfile } = usersData.users[userIndex];

        return NextResponse.json({
            success: true,
            profile: updatedProfile,
            message: '프로필이 성공적으로 업데이트되었습니다.'
        });
    } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '프로필 업데이트에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// 비밀번호 검증 함수
async function verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    try {
        // bcrypt 해시인 경우
        if (storedPassword.startsWith('$2b$')) {
            return await bcrypt.compare(inputPassword, storedPassword);
        }

        // 임시 하드코딩된 비밀번호 (개발용)
        if (inputPassword === 'admin123' && storedPassword.includes('$2b$10$hashedPasswordForAdmin123')) {
            return true;
        }
        if (inputPassword === 'editor123' && storedPassword.includes('$2b$10$hashedPasswordForEditor123')) {
            return true;
        }

        // 평문 비교 (보안상 권장하지 않음)
        return inputPassword === storedPassword;
    } catch (error) {
        console.error('비밀번호 검증 오류:', error);
        return false;
    }
} 