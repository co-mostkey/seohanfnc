import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

// [TRISID] 인트라넷 일정 관리 API

const dbPath = path.join(process.cwd(), 'data/db/intranet-events.json');

// GET: 일정 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        const data = await safeReadJSON(dbPath, { events: [], lastId: 0 });
        let events = data.events || [];

        // 월별 필터링
        if (month && year) {
            events = events.filter((event: any) => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() + 1 === parseInt(month) &&
                    eventDate.getFullYear() === parseInt(year);
            });
        }

        // 날짜순 정렬
        events.sort((a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return NextResponse.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('일정 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 목록을 불러올 수 없습니다.' },
            { status: 500 }
        );
    }
}

// POST: 일정 추가
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, date, time, location, type, description } = body;

        if (!title || !date) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, { events: [], lastId: 0 });
        const newId = (data.lastId || 0) + 1;

        const eventDate = new Date(date);
        const newEvent = {
            id: String(newId),
            title,
            date,
            month: `${eventDate.getMonth() + 1}월`,
            day: String(eventDate.getDate()),
            time: time || '',
            location: location || '',
            type: type || 'meeting',
            description: description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.events.push(newEvent);
        data.lastId = newId;

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            event: newEvent
        });
    } catch (error) {
        console.error('일정 추가 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 추가에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// PUT: 일정 수정
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, date, time, location, type, description } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: '일정 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, { events: [], lastId: 0 });
        const eventIndex = data.events.findIndex((event: any) => event.id === id);

        if (eventIndex === -1) {
            return NextResponse.json(
                { success: false, error: '일정을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const eventDate = new Date(date);
        data.events[eventIndex] = {
            ...data.events[eventIndex],
            title: title || data.events[eventIndex].title,
            date: date || data.events[eventIndex].date,
            month: date ? `${eventDate.getMonth() + 1}월` : data.events[eventIndex].month,
            day: date ? String(eventDate.getDate()) : data.events[eventIndex].day,
            time: time !== undefined ? time : data.events[eventIndex].time,
            location: location !== undefined ? location : data.events[eventIndex].location,
            type: type || data.events[eventIndex].type,
            description: description !== undefined ? description : data.events[eventIndex].description,
            updatedAt: new Date().toISOString()
        };

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            event: data.events[eventIndex]
        });
    } catch (error) {
        console.error('일정 수정 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 수정에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 일정 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('id');

        if (!eventId) {
            return NextResponse.json(
                { success: false, error: '일정 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, { events: [], lastId: 0 });
        const eventIndex = data.events.findIndex((event: any) => event.id === eventId);

        if (eventIndex === -1) {
            return NextResponse.json(
                { success: false, error: '일정을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        data.events.splice(eventIndex, 1);

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            message: '일정이 삭제되었습니다.'
        });
    } catch (error) {
        console.error('일정 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '일정 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
} 