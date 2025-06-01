import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// [TRISID] 인트라넷 할 일 관리 API

export async function GET() {
    try {
        const dbPath = path.join(process.cwd(), 'data/db/intranet-tasks.json');

        let tasksData;
        try {
            const fileData = await fs.readFile(dbPath, 'utf8');
            tasksData = JSON.parse(fileData);
        } catch (error) {
            // 파일이 없으면 기본 데이터로 초기화
            tasksData = {
                tasks: [],
                lastId: 0
            };
            await fs.writeFile(dbPath, JSON.stringify(tasksData, null, 4), 'utf8');
        }

        return NextResponse.json({
            success: true,
            tasks: tasksData.tasks
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
        const { title, dueDate, priority, assignees } = await request.json();

        if (!title || !dueDate) {
            return NextResponse.json(
                { success: false, error: '제목과 마감일은 필수입니다.' },
                { status: 400 }
            );
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-tasks.json');

        let tasksData;
        try {
            const fileData = await fs.readFile(dbPath, 'utf8');
            tasksData = JSON.parse(fileData);
        } catch (error) {
            tasksData = {
                tasks: [],
                lastId: 0
            };
        }

        const newTask = {
            id: (++tasksData.lastId).toString(),
            title,
            dueDate,
            priority: priority || 'medium',
            assignees: assignees || [],
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tasksData.tasks.push(newTask);
        await fs.writeFile(dbPath, JSON.stringify(tasksData, null, 4), 'utf8');

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
        const { id, title, dueDate, priority, assignees, completed } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: '할 일 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-tasks.json');
        const fileData = await fs.readFile(dbPath, 'utf8');
        const tasksData = JSON.parse(fileData);

        const taskIndex = tasksData.tasks.findIndex((task: any) => task.id === id);

        if (taskIndex === -1) {
            return NextResponse.json(
                { success: false, error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 업데이트할 필드만 변경
        const updatedTask = {
            ...tasksData.tasks[taskIndex],
            ...(title !== undefined && { title }),
            ...(dueDate !== undefined && { dueDate }),
            ...(priority !== undefined && { priority }),
            ...(assignees !== undefined && { assignees }),
            ...(completed !== undefined && { completed }),
            updatedAt: new Date().toISOString()
        };

        tasksData.tasks[taskIndex] = updatedTask;
        await fs.writeFile(dbPath, JSON.stringify(tasksData, null, 4), 'utf8');

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
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: '할 일 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-tasks.json');
        const fileData = await fs.readFile(dbPath, 'utf8');
        const tasksData = JSON.parse(fileData);

        const taskIndex = tasksData.tasks.findIndex((task: any) => task.id === id);

        if (taskIndex === -1) {
            return NextResponse.json(
                { success: false, error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedTask = tasksData.tasks.splice(taskIndex, 1)[0];
        await fs.writeFile(dbPath, JSON.stringify(tasksData, null, 4), 'utf8');

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