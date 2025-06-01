import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// [TRISID] 인트라넷 일정 관리 API

export async function GET() {
    try {
        const dbPath = path.join(process.cwd(), 'data/db/intranet-events.json');

        let eventsData;
        try {
            const fileData = await fs.readFile(dbPath, 'utf8');
            eventsData = JSON.parse(fileData);
        } catch (error) {
            // 파일이 없으면 기본 데이터로 초기화
            eventsData = {
                events: [],
                lastId: 0
            };
            await fs.writeFile(dbPath, JSON.stringify(eventsData, null, 4), 'utf8');
        }

        return NextResponse.json({
            success: true,
            events: eventsData.events
        });

    } catch (error) {
        console.error('[TRISID] 일정 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title, date, time, location, type, description } = await request.json();

        if (!title || !date) {
            return NextResponse.json(
                { success: false, error: '제목과 날짜는 필수입니다.' },
                { status: 400 }
            );
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-events.json');

        let eventsData;
        try {
            const fileData = await fs.readFile(dbPath, 'utf8');
            eventsData = JSON.parse(fileData);
        } catch (error) {
            eventsData = {
                events: [],
                lastId: 0
            };
        }

        const eventDate = new Date(date);
        const newEvent = {
            id: (++eventsData.lastId).toString(),
            title,
            date,
            month: `${eventDate.getMonth() + 1}월`,
            day: eventDate.getDate().toString(),
            time: time || '시간 미정',
            location: location || '',
            type: type || 'meeting',
            description: description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        eventsData.events.push(newEvent);
        await fs.writeFile(dbPath, JSON.stringify(eventsData, null, 4), 'utf8');

        console.log('[TRISID] 새 일정 추가:', newEvent.title);

        return NextResponse.json({
            success: true,
            event: newEvent
        });

    } catch (error) {
        console.error('[TRISID] 일정 추가 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 추가 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, title, date, time, location, type, description } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: '일정 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-events.json');
        const fileData = await fs.readFile(dbPath, 'utf8');
        const eventsData = JSON.parse(fileData);

        const eventIndex = eventsData.events.findIndex((event: any) => event.id === id);

        if (eventIndex === -1) {
            return NextResponse.json(
                { success: false, error: '일정을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 날짜가 변경된 경우 month, day 업데이트
        let updateData: any = {
            ...(title !== undefined && { title }),
            ...(time !== undefined && { time }),
            ...(location !== undefined && { location }),
            ...(type !== undefined && { type }),
            ...(description !== undefined && { description }),
            updatedAt: new Date().toISOString()
        };

        if (date !== undefined) {
            const eventDate = new Date(date);
            updateData = {
                ...updateData,
                date,
                month: `${eventDate.getMonth() + 1}월`,
                day: eventDate.getDate().toString()
            };
        }

        const updatedEvent = {
            ...eventsData.events[eventIndex],
            ...updateData
        };

        eventsData.events[eventIndex] = updatedEvent;
        await fs.writeFile(dbPath, JSON.stringify(eventsData, null, 4), 'utf8');

        console.log('[TRISID] 일정 업데이트:', updatedEvent.title);

        return NextResponse.json({
            success: true,
            event: updatedEvent
        });

    } catch (error) {
        console.error('[TRISID] 일정 업데이트 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 업데이트 중 오류가 발생했습니다.' },
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
                { success: false, error: '일정 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const dbPath = path.join(process.cwd(), 'data/db/intranet-events.json');
        const fileData = await fs.readFile(dbPath, 'utf8');
        const eventsData = JSON.parse(fileData);

        const eventIndex = eventsData.events.findIndex((event: any) => event.id === id);

        if (eventIndex === -1) {
            return NextResponse.json(
                { success: false, error: '일정을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedEvent = eventsData.events.splice(eventIndex, 1)[0];
        await fs.writeFile(dbPath, JSON.stringify(eventsData, null, 4), 'utf8');

        console.log('[TRISID] 일정 삭제:', deletedEvent.title);

        return NextResponse.json({
            success: true,
            message: '일정이 삭제되었습니다.'
        });

    } catch (error) {
        console.error('[TRISID] 일정 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 