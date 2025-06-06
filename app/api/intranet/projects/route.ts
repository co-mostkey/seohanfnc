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

        // 상태별 필터링
        if (status && status !== 'all') {
            projects = projects.filter((project: any) => project.status === status);
        }

        // 검색 필터링
        if (search) {
            const searchLower = search.toLowerCase();
            projects = projects.filter((project: any) =>
                project.title.toLowerCase().includes(searchLower) ||
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
        const { title, description, status, startDate, endDate, manager, members, category } = body;

        if (!title || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, defaultData) as any;
        const newId = (data.metadata.lastId || 0) + 1;

        const newProject = {
            id: `proj-${newId}`,
            title,
            description: description || '',
            status: status || 'planning',
            startDate,
            endDate,
            manager: manager || '',
            members: members || [],
            category: category || '',
            progress: 0,
            tasks: [],
            milestones: [],
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