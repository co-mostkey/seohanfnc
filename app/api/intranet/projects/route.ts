import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

const dbPath = path.join(process.cwd(), 'data/db/intranet-projects.json');

// 기본 데이터 구조
const defaultData = {
    projects: [],
    statuses: [],
    metadata: {
        lastId: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        lastUpdated: new Date().toISOString()
    }
};

// GET: 프로젝트 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const data = await safeReadJSON(dbPath, defaultData) as any;
        let projects = data.projects || [];

        // 기존 데이터의 title을 name으로 매핑
        projects = projects.map((project: any) => ({
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
        }));

        // 상태별 필터링
        if (status && status !== 'all') {
            projects = projects.filter((project: any) => project.status === status);
        }

        // 검색 필터링
        if (search) {
            const searchLower = search.toLowerCase();
            projects = projects.filter((project: any) =>
                (project.name || project.title || '').toLowerCase().includes(searchLower) ||
                project.description?.toLowerCase().includes(searchLower)
            );
        }

        // 최신순 정렬
        projects.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({
            success: true,
            projects,
            statuses: data.statuses || [],
            metadata: data.metadata || {}
        });
    } catch (error) {
        console.error('프로젝트 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '프로젝트 목록을 불러올 수 없습니다.' },
            { status: 500 }
        );
    }
}

// POST: 프로젝트 추가
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, status, priority, startDate, endDate, progress, managerId, teamMemberIds, category } = body;

        if (!name || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다. (프로젝트명, 시작일, 마감일)' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, defaultData) as any;
        const newId = (data.metadata.lastId || 0) + 1;

        const newProject = {
            id: `proj-${newId}`,
            name,
            description: description || '',
            status: status || 'planning',
            priority: priority || 'normal',
            category: category || '웹사이트',
            startDate,
            endDate,
            progress: progress || 0,
            manager: {
                id: managerId || 'default-manager',
                name: '프로젝트 매니저',
                avatar: '/images/avatars/avatar-3.svg'
            },
            team: teamMemberIds ? teamMemberIds.map((id: string, index: number) => ({
                id,
                name: `팀원 ${index + 1}`,
                role: '개발자',
                avatar: '/images/avatars/avatar-3.svg'
            })) : [],
            tasks: [],
            recentActivities: [{
                id: `activity-${Date.now()}`,
                action: '프로젝트를 생성했습니다',
                user: {
                    name: '프로젝트 매니저',
                    avatar: '/images/avatars/avatar-3.svg'
                },
                timestamp: new Date().toISOString()
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.projects.push(newProject);
        data.metadata.lastId = newId;
        data.metadata.totalProjects = data.projects.length;
        data.metadata.activeProjects = data.projects.filter((p: any) => p.status === 'in-progress').length;
        data.metadata.completedProjects = data.projects.filter((p: any) => p.status === 'completed').length;
        data.metadata.lastUpdated = new Date().toISOString();

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            project: newProject
        });
    } catch (error) {
        console.error('프로젝트 추가 오류:', error);
        return NextResponse.json(
            { success: false, error: '프로젝트 추가에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// PUT: 프로젝트 수정
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: '프로젝트 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, defaultData) as any;
        const projectIndex = data.projects.findIndex((project: any) => project.id === id);

        if (projectIndex === -1) {
            return NextResponse.json(
                { success: false, error: '프로젝트를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        data.projects[projectIndex] = {
            ...data.projects[projectIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        // 메타데이터 업데이트
        data.metadata.activeProjects = data.projects.filter((p: any) => p.status === 'in-progress').length;
        data.metadata.completedProjects = data.projects.filter((p: any) => p.status === 'completed').length;
        data.metadata.lastUpdated = new Date().toISOString();

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            project: data.projects[projectIndex]
        });
    } catch (error) {
        console.error('프로젝트 수정 오류:', error);
        return NextResponse.json(
            { success: false, error: '프로젝트 수정에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 프로젝트 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');

        if (!projectId) {
            return NextResponse.json(
                { success: false, error: '프로젝트 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, defaultData) as any;
        const projectIndex = data.projects.findIndex((project: any) => project.id === projectId);

        if (projectIndex === -1) {
            return NextResponse.json(
                { success: false, error: '프로젝트를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        data.projects.splice(projectIndex, 1);

        // 메타데이터 업데이트
        data.metadata.totalProjects = data.projects.length;
        data.metadata.activeProjects = data.projects.filter((p: any) => p.status === 'in-progress').length;
        data.metadata.completedProjects = data.projects.filter((p: any) => p.status === 'completed').length;
        data.metadata.lastUpdated = new Date().toISOString();

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            message: '프로젝트가 삭제되었습니다.'
        });
    } catch (error) {
        console.error('프로젝트 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '프로젝트 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
} 