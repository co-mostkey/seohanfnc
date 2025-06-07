import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// [TRISID] 프로젝트 채팅 메시지 관리 API

const DATA_FILE = path.join(process.cwd(), 'data/db/intranet-projects.json');

// 데이터 읽기
function readProjectsData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('[TRISID] 프로젝트 데이터 읽기 실패:', error);
        return { projects: [] };
    }
}

// 데이터 쓰기
function writeProjectsData(data: any) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('[TRISID] 프로젝트 데이터 쓰기 실패:', error);
        return false;
    }
}

// GET: 채팅 메시지 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = params.id;

        console.log('[TRISID] 채팅 메시지 조회 요청:', projectId);

        const projectsData = readProjectsData();
        const project = projectsData.projects.find((p: any) => p.id === projectId);

        if (!project) {
            return NextResponse.json(
                { success: false, error: '프로젝트를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const messages = project.messages || [];

        console.log('[TRISID] 채팅 메시지 조회 성공:', messages.length, '개');

        return NextResponse.json({
            success: true,
            messages
        });

    } catch (error) {
        console.error('[TRISID] 채팅 메시지 조회 API 오류:', error);
        return NextResponse.json(
            { success: false, error: '채팅 메시지 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// POST: 새 채팅 메시지 전송
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = params.id;
        const { message, userName, userAvatar } = await request.json();

        console.log('[TRISID] 새 채팅 메시지 전송 요청:', { projectId, message, userName });

        // 필수 필드 검증
        if (!message || !userName) {
            return NextResponse.json(
                { success: false, error: '메시지와 사용자 정보가 필요합니다.' },
                { status: 400 }
            );
        }

        // 메시지 길이 검증
        if (message.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: '빈 메시지는 전송할 수 없습니다.' },
                { status: 400 }
            );
        }

        if (message.length > 1000) {
            return NextResponse.json(
                { success: false, error: '메시지는 1000자 이하로 입력해주세요.' },
                { status: 400 }
            );
        }

        const projectsData = readProjectsData();
        const projectIndex = projectsData.projects.findIndex((p: any) => p.id === projectId);

        if (projectIndex === -1) {
            return NextResponse.json(
                { success: false, error: '프로젝트를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 새 메시지 생성
        const newMessage = {
            id: `msg-${Date.now()}`,
            message: message.trim(),
            user: {
                name: userName,
                avatar: userAvatar || '/images/avatars/avatar-3.svg'
            },
            timestamp: new Date().toISOString(),
            type: 'text'
        };

        // 프로젝트에 메시지 추가
        if (!projectsData.projects[projectIndex].messages) {
            projectsData.projects[projectIndex].messages = [];
        }

        // 새 메시지를 맨 뒤에 추가 (채팅은 시간순)
        projectsData.projects[projectIndex].messages.push(newMessage);

        // 최대 500개까지만 유지 (성능 관리)
        if (projectsData.projects[projectIndex].messages.length > 500) {
            projectsData.projects[projectIndex].messages =
                projectsData.projects[projectIndex].messages.slice(-500);
        }

        // 업데이트 시간 갱신
        projectsData.projects[projectIndex].updatedAt = new Date().toISOString();

        // 데이터 저장
        if (!writeProjectsData(projectsData)) {
            return NextResponse.json(
                { success: false, error: '데이터 저장에 실패했습니다.' },
                { status: 500 }
            );
        }

        console.log('[TRISID] 새 채팅 메시지 전송 성공:', newMessage);

        return NextResponse.json({
            success: true,
            message: newMessage
        });

    } catch (error) {
        console.error('[TRISID] 채팅 메시지 전송 API 오류:', error);
        return NextResponse.json(
            { success: false, error: '채팅 메시지 전송 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 