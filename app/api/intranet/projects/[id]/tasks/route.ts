import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// [TRISID] 프로젝트 할일 관리 API

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

// POST: 새 할일 추가
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = params.id;
        const { title, assignee, dueDate } = await request.json();

        console.log('[TRISID] 새 할일 추가 요청:', { projectId, title, assignee, dueDate });

        // 필수 필드 검증
        if (!title || !assignee || !dueDate) {
            return NextResponse.json(
                { success: false, error: '모든 필드를 입력해주세요.' },
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

        // 새 할일 생성
        const newTask = {
            id: `task-${Date.now()}`,
            title,
            status: 'pending',
            assignee,
            dueDate
        };

        // 프로젝트에 할일 추가
        if (!projectsData.projects[projectIndex].tasks) {
            projectsData.projects[projectIndex].tasks = [];
        }
        projectsData.projects[projectIndex].tasks.push(newTask);

        // 업데이트 시간 갱신
        projectsData.projects[projectIndex].updatedAt = new Date().toISOString();

        // 데이터 저장
        if (!writeProjectsData(projectsData)) {
            return NextResponse.json(
                { success: false, error: '데이터 저장에 실패했습니다.' },
                { status: 500 }
            );
        }

        console.log('[TRISID] 새 할일 추가 성공:', newTask);

        return NextResponse.json({
            success: true,
            task: newTask
        });

    } catch (error) {
        console.error('[TRISID] 할일 추가 API 오류:', error);
        return NextResponse.json(
            { success: false, error: '할일 추가 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 