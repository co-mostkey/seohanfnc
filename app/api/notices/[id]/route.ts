import { NextRequest, NextResponse } from 'next/server';
import { readItems, writeItems, deleteItem } from '@/lib/file-db';
import { Notice } from '../route';

const NOTICES_FILE = 'notices.json';

/**
 * 특정 공지사항 조회 및 조회수 증가
 * GET /api/notices/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: '공지사항 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 공지사항 목록 가져오기
        const notices = await readItems<Notice>(NOTICES_FILE);
        const noticeIndex = notices.findIndex(n => n.id === id);

        if (noticeIndex === -1) {
            return NextResponse.json(
                { success: false, message: '해당 공지사항을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const notice = notices[noticeIndex];

        // 조회수 증가
        const updatedNotice = {
            ...notice,
            viewCount: (notice.viewCount || 0) + 1
        };

        // 조회수 업데이트된 공지사항을 배열에 반영
        notices[noticeIndex] = updatedNotice;

        // 파일에 저장
        try {
            await writeItems(NOTICES_FILE, notices);
        } catch (writeError) {
            console.error('조회수 업데이트 실패:', writeError);
            // 조회수 업데이트 실패해도 공지사항은 반환
        }

        return NextResponse.json({
            success: true,
            data: updatedNotice
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error('[Notices][GET][ID]', error);
        return NextResponse.json(
            { success: false, message: '공지사항을 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 특정 공지사항 삭제
 * DELETE /api/notices/[id]
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: noticeId } = await params;

        if (!noticeId) {
            return NextResponse.json(
                { success: false, message: '공지사항 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 삭제
        const success = await deleteItem<Notice>(NOTICES_FILE, noticeId);

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
        console.error('[Notices][DELETE][ID]', error);
        return NextResponse.json(
            { success: false, message: '공지사항 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 