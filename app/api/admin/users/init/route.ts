
async function safeWriteJSON(filePath: string, data: any): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
  await fs.rename(tempPath, filePath);
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'db');
const usersFilePath = path.join(dataDir, 'users.json');

// 기본 사용자 데이터 구조
const defaultUsersData = {
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

/**
 * POST - 사용자 데이터 초기화 (기본 관리자 계정 복구)
 */
export async function POST(request: NextRequest) {
    try {
        console.log('[사용자 초기화] 기본 사용자 데이터 복구 시작');
        console.log('[사용자 초기화] 요청 시간:', new Date().toISOString());

        // 디렉토리 확인 및 생성
        try {
            await fs.access(dataDir);
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
            console.log('[사용자 초기화] 데이터 디렉토리 생성됨');
        }

        // 기본 사용자 데이터 저장
        await safeWriteJSON(usersFilePath, defaultUsersData);

        console.log('[사용자 초기화] 기본 사용자 데이터 복구 완료');
        console.log('[사용자 초기화] 복구된 사용자 수:', defaultUsersData.users.length);

        return NextResponse.json({
            success: true,
            message: '기본 관리자 계정이 복구되었습니다.',
            data: {
                totalUsers: defaultUsersData.users.length,
                adminAccount: {
                    username: 'admin',
                    password: 'admin123',
                    note: '기본 비밀번호입니다. 로그인 후 변경해주세요.'
                },
                editorAccount: {
                    username: 'editor',
                    password: 'editor123',
                    note: '기본 비밀번호입니다. 로그인 후 변경해주세요.'
                }
            }
        });
    } catch (error) {
        console.error('[사용자 초기화] 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '사용자 데이터 초기화에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * GET - 현재 사용자 데이터 상태 확인
 */
export async function GET(request: NextRequest) {
    try {
        // 파일 존재 여부 및 데이터 상태 확인
        let fileExists = true;
        let isValidData = false;
        let userCount = 0;

        try {
            const data = await safeReadJSON<AdminUsersData>(usersFilePath, defaultUsersData);

            if (data.users && Array.isArray(data.users) && data.users.length > 0) {
                isValidData = true;
                userCount = data.users.length;
            } else {
                isValidData = false;
                userCount = 0;
            }
        } catch (error) {
            fileExists = false;
            isValidData = false;
            userCount = 0;
        }

        return NextResponse.json({
            success: true,
            status: {
                fileExists,
                isValidData,
                userCount,
                needsInitialization: !fileExists || !isValidData || userCount === 0
            },
            message: fileExists && isValidData && userCount > 0
                ? '사용자 데이터가 정상입니다.'
                : '사용자 데이터 초기화가 필요합니다.'
        });
    } catch (error) {
        console.error('[사용자 상태 확인] 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '사용자 데이터 상태 확인에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 