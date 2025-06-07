import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// [TRISID] 개별 프로젝트 조회/수정 API

const PROJECTS_FILE_PATH = path.join(process.cwd(), 'data/db/intranet-projects.json');

// 프로젝트 조회 (GET)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // 프로젝트 데이터 읽기
        const data = await fs.readFile(PROJECTS_FILE_PATH, 'utf8');
        const projectData = JSON.parse(data);
        const projects = projectData.projects || [];

        // 해당 ID의 프로젝트 찾기
        let project = projects.find((p: any) => p.id === id);

        if (!project) {
            return NextResponse.json({
                success: false,
                error: '프로젝트를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 기존 데이터 구조를 프론트엔드에 맞게 변환
        project = {
            ...project,
            name: project.name || project.title,
            // team 구조 표준화
            team: project.members ? project.members.map((member: any) => ({
                id: member.id || `member-${Date.now()}`,
                name: member.name,
                role: member.role || '팀원',
                avatar: '/images/avatars/avatar-3.svg'
            })) : [],
            // manager 구조 표준화
            manager: typeof project.manager === 'string' ? {
                id: 'manager-default',
                name: project.manager,
                avatar: '/images/avatars/avatar-3.svg'
            } : project.manager,
            // recentActivities가 없으면 기본값 제공
            recentActivities: project.recentActivities || [{
                id: `activity-${Date.now()}`,
                action: '프로젝트가 업데이트되었습니다',
                user: {
                    name: typeof project.manager === 'string' ? project.manager : (project.manager?.name || '관리자'),
                    avatar: '/images/avatars/avatar-3.svg'
                },
                timestamp: project.updatedAt || project.createdAt
            }],
            // tasks 구조 표준화
            tasks: project.tasks ? project.tasks.map((task: any) => ({
                ...task,
                completed: task.status === 'completed',
                assignee: task.assignee || '미지정',
                dueDate: task.dueDate
            })) : []
        };

        return NextResponse.json({
            success: true,
            project
        });

    } catch (error) {
        console.error('[TRISID] 프로젝트 조회 실패:', error);
        return NextResponse.json({
            success: false,
            error: '프로젝트 조회 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

// 프로젝트 수정 (PUT)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // 프로젝트 데이터 읽기
        const data = await fs.readFile(PROJECTS_FILE_PATH, 'utf8');
        const projectData = JSON.parse(data);
        const projects = projectData.projects || [];

        // 해당 ID의 프로젝트 인덱스 찾기
        const projectIndex = projects.findIndex((p: any) => p.id === id);

        if (projectIndex === -1) {
            return NextResponse.json({
                success: false,
                error: '프로젝트를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 프로젝트 업데이트 (name을 title로도 저장하여 호환성 유지)
        const updatedProject = {
            ...projects[projectIndex],
            ...body,
            title: body.name || body.title || projects[projectIndex].title || projects[projectIndex].name,
            name: body.name || body.title || projects[projectIndex].name || projects[projectIndex].title,
            id, // ID는 변경되지 않도록 유지
            updatedAt: new Date().toISOString()
        };

        projects[projectIndex] = updatedProject;

        // 전체 데이터 구조로 저장
        projectData.projects = projects;
        if (projectData.metadata) {
            projectData.metadata.lastUpdated = new Date().toISOString();
        }

        // 파일에 저장
        await fs.writeFile(PROJECTS_FILE_PATH, JSON.stringify(projectData, null, 2));

        return NextResponse.json({
            success: true,
            project: updatedProject
        });

    } catch (error) {
        console.error('[TRISID] 프로젝트 수정 실패:', error);
        return NextResponse.json({
            success: false,
            error: '프로젝트 수정 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

// 프로젝트 삭제 (DELETE)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // 프로젝트 데이터 읽기
        const data = await fs.readFile(PROJECTS_FILE_PATH, 'utf8');
        const projectData = JSON.parse(data);
        const projects = projectData.projects || [];

        // 해당 ID의 프로젝트 인덱스 찾기
        const projectIndex = projects.findIndex((p: any) => p.id === id);

        if (projectIndex === -1) {
            return NextResponse.json({
                success: false,
                error: '프로젝트를 찾을 수 없습니다.'
            }, { status: 404 });
        }

        // 프로젝트 삭제
        const deletedProject = projects.splice(projectIndex, 1)[0];

        // 전체 데이터 구조로 저장
        projectData.projects = projects;
        if (projectData.metadata) {
            projectData.metadata.totalProjects = projects.length;
            projectData.metadata.lastUpdated = new Date().toISOString();
        }

        // 파일에 저장
        await fs.writeFile(PROJECTS_FILE_PATH, JSON.stringify(projectData, null, 2));

        return NextResponse.json({
            success: true,
            message: '프로젝트가 삭제되었습니다.',
            project: deletedProject
        });

    } catch (error) {
        console.error('[TRISID] 프로젝트 삭제 실패:', error);
        return NextResponse.json({
            success: false,
            error: '프로젝트 삭제 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 