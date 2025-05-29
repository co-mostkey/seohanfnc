import { NextRequest, NextResponse } from 'next/server';
import { readItems, writeItems, saveItem, deleteItem } from '@/lib/file-db';
import { mkdir, stat } from 'fs/promises';
import path from 'path';
import { validate } from '@/lib/validators/notice';

// 파일 저장 경로
const NOTICES_FILE = 'notices.json';
const DATA_DIR = path.join(process.cwd(), 'data', 'db');

// 디렉토리 존재 확인
async function ensureDataDir() {
    try {
        await stat(DATA_DIR);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await mkdir(DATA_DIR, { recursive: true });
        } else {
            throw error;
        }
    }
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    author?: string;
    isPinned?: boolean;
    category?: string;
    viewCount?: number;
}

/**
 * 공지사항 목록 조회
 * GET /api/notices?page=1&limit=10&search=검색어
 */
export async function GET(req: NextRequest) {
    try {
        await ensureDataDir();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams?.get('page') || '1');
        const limit = parseInt(searchParams?.get('limit') || '10');
        const search = searchParams?.get('search') || '';
        const category = searchParams?.get('category') || '';

        // 데이터 불러오기
        let notices = await readItems<Notice>(NOTICES_FILE);

        // 필터링 (검색어)
        if (search) {
            const searchLower = search.toLowerCase();
            notices = notices.filter(notice =>
                notice.title.toLowerCase().includes(searchLower) ||
                notice.content.toLowerCase().includes(searchLower)
            );
        }

        // 필터링 (카테고리)
        if (category) {
            notices = notices.filter(notice => notice.category === category);
        }

        // 고정 공지는 항상 최상단
        notices.sort((a, b) => {
            // 고정 공지 우선
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            // 그 다음 최신순
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // 페이지네이션
        const totalCount = notices.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedNotices = notices.slice(startIndex, endIndex);

        return NextResponse.json({
            success: true,
            data: paginatedNotices,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages
            }
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('[Notices][GET]', error);
        return NextResponse.json(
            { success: false, message: '공지사항을 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 새 공지사항 작성
 * POST /api/notices
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 데이터 검증
        const validationResult = validate(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, message: validationResult.message },
                { status: 400 }
            );
        }

        // 기존 공지사항들을 불러와서 가장 큰 번호를 찾기
        const notices = await readItems<Notice>(NOTICES_FILE);
        let maxNumber = 0;

        notices.forEach(notice => {
            // ID에서 숫자 부분만 추출
            const match = notice.id.match(/^notice_(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNumber) {
                    maxNumber = num;
                }
            }
        });

        // 새 공지사항 객체 생성 (순차적인 번호 사용)
        const newNotice: Notice = {
            id: `notice_${maxNumber + 1}`,
            title: body.title,
            content: body.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: body.author || 'Admin',
            isPinned: body.isPinned || false,
            category: body.category || '일반',
            viewCount: 0
        };

        // 저장
        await saveItem<Notice>(NOTICES_FILE, newNotice);

        return NextResponse.json({
            success: true,
            message: '공지사항이 등록되었습니다.',
            data: newNotice
        });
    } catch (error: any) {
        console.error('[Notices][POST]', error);
        return NextResponse.json(
            { success: false, message: '공지사항 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 공지사항 수정
 * PUT /api/notices
 */
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        // ID 확인
        if (!body.id) {
            return NextResponse.json(
                { success: false, message: 'ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 데이터 검증
        const validationResult = validate(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, message: validationResult.message },
                { status: 400 }
            );
        }

        // 기존 데이터 확인
        const notices = await readItems<Notice>(NOTICES_FILE);
        const existingNotice = notices.find(notice => notice.id === body.id);

        if (!existingNotice) {
            return NextResponse.json(
                { success: false, message: '해당 공지사항을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 수정할 공지사항 객체 생성
        const updatedNotice: Notice = {
            ...existingNotice,
            title: body.title,
            content: body.content,
            updatedAt: new Date().toISOString(),
            author: body.author || existingNotice.author,
            isPinned: body.isPinned !== undefined ? body.isPinned : existingNotice.isPinned,
            category: body.category || existingNotice.category
        };

        // 저장
        await saveItem<Notice>(NOTICES_FILE, updatedNotice);

        return NextResponse.json({
            success: true,
            message: '공지사항이 수정되었습니다.',
            data: updatedNotice
        });
    } catch (error: any) {
        console.error('[Notices][PUT]', error);
        return NextResponse.json(
            { success: false, message: '공지사항 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 공지사항 삭제
 * DELETE /api/notices?id=notice_id
 */
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams?.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 삭제
        const success = await deleteItem<Notice>(NOTICES_FILE, id);

        if (!success) {
            return NextResponse.json(
                { success: false, message: '해당 공지사항을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '공지사항이 삭제되었습니다.'
        });
    } catch (error: any) {
        console.error('[Notices][DELETE]', error);
        return NextResponse.json(
            { success: false, message: '공지사항 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 