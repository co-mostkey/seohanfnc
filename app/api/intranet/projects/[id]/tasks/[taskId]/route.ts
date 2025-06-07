import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// [TRISID] 개별 할일 관리 API

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

// PUT: 할일 상태 변경
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string, taskId: string } }
) {
    try {
        const { id: projectId, taskId } = params;
        const { status } = await request.json();

        console.log('[TRISID] 할일 상태 변경 요청:', { projectId, taskId, status });

        // 상태 값 검증
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: '올바른 상태값을 입력해주세요.' },
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

        const project = projectsData.projects[projectIndex];
        if (!project.tasks) {
            project.tasks = [];
        }

        const taskIndex = project.tasks.findIndex((t: any) => t.id === taskId);
        if (taskIndex === -1) {
            return NextResponse.json(
                { success: false, error: '할일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 할일 상태 업데이트
        projectsData.projects[projectIndex].tasks[taskIndex].status = status;
        projectsData.projects[projectIndex].updatedAt = new Date().toISOString();

        // 데이터 저장
        if (!writeProjectsData(projectsData)) {
            return NextResponse.json(
                { success: false, error: '데이터 저장에 실패했습니다.' },
                { status: 500 }
            );
        }

        console.log('[TRISID] 할일 상태 변경 성공:', { taskId, status });

        return NextResponse.json({
            success: true,
            task: projectsData.projects[projectIndex].tasks[taskIndex]
        });

    } catch (error) {
        console.error('[TRISID] 할일 상태 변경 API 오류:', error);
        return NextResponse.json(
            { success: false, error: '할일 상태 변경 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 할일 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string, taskId: string } }
) {
    try {
        const { id: projectId, taskId } = params;

        console.log('[TRISID] 할일 삭제 요청:', { projectId, taskId });

        const projectsData = readProjectsData();
        const projectIndex = projectsData.projects.findIndex((p: any) => p.id === projectId);

        if (projectIndex === -1) {
            return NextResponse.json(
                { success: false, error: '프로젝트를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const project = projectsData.projects[projectIndex];
        if (!project.tasks) {
            project.tasks = [];
        }

        const taskIndex = project.tasks.findIndex((t: any) => t.id === taskId);
        if (taskIndex === -1) {
            return NextResponse.json(
                { success: false, error: '할일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 할일 삭제
        const deletedTask = projectsData.projects[projectIndex].tasks.splice(taskIndex, 1)[0];
        projectsData.projects[projectIndex].updatedAt = new Date().toISOString();

        // 데이터 저장
        if (!writeProjectsData(projectsData)) {
            return NextResponse.json(
                { success: false, error: '데이터 저장에 실패했습니다.' },
                { status: 500 }
            );
        }

        console.log('[TRISID] 할일 삭제 성공:', deletedTask);

        return NextResponse.json({
            success: true,
            deletedTask
        });

    } catch (error) {
        console.error('[TRISID] 할일 삭제 API 오류:', error);
        return NextResponse.json(
            { success: false, error: '할일 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 