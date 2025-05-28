import { NextRequest, NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '@/lib/as-board';
import { ASPost } from '@/types/as-post';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const post = await getPost(id);
        if (!post) {
            return NextResponse.json({ error: '해당 문의를 찾을 수 없습니다.' }, { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        console.error('[GET /api/contact/:id]', error);
        return NextResponse.json({ error: '조회 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 내용 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content } = body;

        const updateData: Partial<ASPost> = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: '수정할 내용이 없습니다.' }, { status: 400 });
        }

        updateData.updatedAt = new Date().toISOString();

        const updated = await updatePost(id, updateData);

        if (!updated) {
            return NextResponse.json({ error: '수정할 문의가 없거나 실패했습니다.' }, { status: 404 });
        }

        return NextResponse.json({ message: '수정 완료', data: updated });
    } catch (error) {
        console.error('[PATCH /api/contact/:id]', error);
        return NextResponse.json({ error: '수정 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 삭제
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const success = await deletePost(id);
        if (!success) {
            return NextResponse.json({ error: '삭제할 문의가 없습니다.' }, { status: 404 });
        }
        return NextResponse.json({ message: '삭제 완료' });
    } catch (error) {
        console.error('[DELETE /api/contact/:id]', error);
        return NextResponse.json({ error: '삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 