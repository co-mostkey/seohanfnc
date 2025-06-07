import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

// [TRISID] 인트라넷 할 일 관리 API

const dbPath = path.join(process.cwd(), 'data/db/intranet-tasks.json');

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const assignee = searchParams.get('assignee');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');

        const data = await safeReadJSON(dbPath, { tasks: [], lastId: 0 });
        let tasks = data.tasks || [];

        // 담당자 필터링
        if (assignee) {
            tasks = tasks.filter((task: any) =>
                task.assignees && task.assignees.some((a: any) => a.id === assignee)
            );
        }

        // 상태 필터링
        if (status === 'completed') {
            tasks = tasks.filter((task: any) => task.completed);
        } else if (status === 'pending') {
            tasks = tasks.filter((task: any) => !task.completed);
        }

        // 우선순위 필터링
        if (priority) {
            tasks = tasks.filter((task: any) => task.priority === priority);
        }

        // 마감일 순 정렬
        tasks.sort((a: any, b: any) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

        return NextResponse.json({
            success: true,
            tasks
        });

    } catch (error) {
        console.error('[TRISID] 할 일 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '할 일 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title, description, dueDate, priority, assignees, category } = await request.json();

        if (!title || !dueDate) {
            return NextResponse.json(
                { success: false, error: '제목과 마감일은 필수입니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, { tasks: [], lastId: 0 });
        const newId = (data.lastId || 0) + 1;

        const newTask = {
            id: String(newId),
            title,
            description: description || '',
            dueDate,
            priority: priority || 'medium',
            assignees: assignees || [],
            category: category || 'general',
            completed: false,
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.tasks.push(newTask);
        data.lastId = newId;

        await safeWriteJSON(dbPath, data);

        console.log('[TRISID] 새 할 일 추가:', newTask.title);

        return NextResponse.json({
            success: true,
            task: newTask
        });

    } catch (error) {
        console.error('[TRISID] 할 일 추가 오류:', error);
        return NextResponse.json(
            { success: false, error: '할 일 추가 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, title, description, dueDate, priority, assignees, completed, progress } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: '할 일 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, { tasks: [], lastId: 0 });
        const taskIndex = data.tasks.findIndex((task: any) => task.id === id);

        if (taskIndex === -1) {
            return NextResponse.json(
                { success: false, error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 업데이트할 필드만 변경
        const updatedTask = {
            ...data.tasks[taskIndex],
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(dueDate !== undefined && { dueDate }),
            ...(priority !== undefined && { priority }),
            ...(assignees !== undefined && { assignees }),
            ...(completed !== undefined && { completed }),
            ...(progress !== undefined && { progress }),
            updatedAt: new Date().toISOString()
        };

        data.tasks[taskIndex] = updatedTask;
        await safeWriteJSON(dbPath, data);

        console.log('[TRISID] 할 일 업데이트:', updatedTask.title);

        return NextResponse.json({
            success: true,
            task: updatedTask
        });

    } catch (error) {
        console.error('[TRISID] 할 일 업데이트 오류:', error);
        return NextResponse.json(
            { success: false, error: '할 일 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get('id');

        if (!taskId) {
            return NextResponse.json(
                { success: false, error: '할 일 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, { tasks: [], lastId: 0 });
        const taskIndex = data.tasks.findIndex((task: any) => task.id === taskId);

        if (taskIndex === -1) {
            return NextResponse.json(
                { success: false, error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedTask = data.tasks.splice(taskIndex, 1)[0];
        await safeWriteJSON(dbPath, data);

        console.log('[TRISID] 할 일 삭제:', deletedTask.title);

        return NextResponse.json({
            success: true,
            message: '할 일이 삭제되었습니다.'
        });

    } catch (error) {
        console.error('[TRISID] 할 일 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '할 일 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 