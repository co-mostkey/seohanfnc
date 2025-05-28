import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

interface PendingUser {
    id: string;
    username: string;
    password: string;
    email: string;
    name: string;
    employeeId: string;
    department: string;
    position: string;
    phone?: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: string;
    rejectReason?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            username,
            password,
            email,
            name,
            employeeId,
            department,
            position,
            phone
        } = body;

        // 필수 필드 검증
        if (!username || !password || !email || !name || !employeeId || !department || !position) {
            return NextResponse.json(
                { success: false, error: '모든 필수 항목을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 사용자명 형식 검증 (영문, 숫자, 언더스코어만 허용)
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return NextResponse.json(
                { success: false, error: '사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능합니다.' },
                { status: 400 }
            );
        }

        // 비밀번호 길이 검증
        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: '올바른 이메일 형식이 아닙니다.' },
                { status: 400 }
            );
        }

        // 인트라넷 사용자 데이터베이스 읽기
        const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');
        const dbData = await fs.readFile(dbPath, 'utf8');
        const database = JSON.parse(dbData);

        // 중복 사용자명 확인
        const existingUser = database.users.find((u: any) => u.username === username);
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: '이미 사용 중인 사용자명입니다.' },
                { status: 409 }
            );
        }

        // 중복 이메일 확인
        const existingEmail = database.users.find((u: any) => u.email === email);
        if (existingEmail) {
            return NextResponse.json(
                { success: false, error: '이미 등록된 이메일 주소입니다.' },
                { status: 409 }
            );
        }

        // 중복 사번 확인
        const existingEmployeeId = database.users.find((u: any) => u.employeeId === employeeId);
        if (existingEmployeeId) {
            return NextResponse.json(
                { success: false, error: '이미 등록된 사번입니다.' },
                { status: 409 }
            );
        }

        // 대기 중인 신청에서도 중복 확인
        const pendingUser = database.pendingUsers.find((u: any) =>
            u.status === 'pending' && (
                u.username === username ||
                u.email === email ||
                u.employeeId === employeeId
            )
        );
        if (pendingUser) {
            return NextResponse.json(
                { success: false, error: '이미 처리 대기 중인 신청이 있습니다.' },
                { status: 409 }
            );
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 신청 정보 생성
        const newPendingUser: PendingUser = {
            id: `pending-${uuidv4()}`,
            username,
            password: hashedPassword,
            email,
            name,
            employeeId,
            department,
            position,
            phone,
            requestedAt: new Date().toISOString(),
            status: 'pending'
        };

        // pendingUsers 배열에 추가
        database.pendingUsers.push(newPendingUser);

        // 메타데이터 업데이트
        database.metadata.lastUpdated = new Date().toISOString();
        database.metadata.pendingApprovals = database.pendingUsers.filter((u: any) => u.status === 'pending').length;

        // 데이터베이스 저장
        await fs.writeFile(dbPath, JSON.stringify(database, null, 4), 'utf8');

        return NextResponse.json({
            success: true,
            message: '계정 신청이 완료되었습니다. 관리자 승인을 기다려주세요.',
            requestId: newPendingUser.id
        });
    } catch (error) {
        console.error('인트라넷 계정 신청 오류:', error);
        return NextResponse.json(
            { success: false, error: '계정 신청 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 