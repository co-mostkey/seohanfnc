import { NextRequest, NextResponse } from 'next/server';
import { listPosts, addPost } from '@/lib/as-board';
import { ASPost } from '@/types/as-post';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const posts = await listPosts();
        // 최신순 정렬
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(posts);
    } catch (error) {
        console.error('[GET /api/contact]', error);
        return NextResponse.json({ error: '목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title, author, email, content } = await request.json();

        if (!title || !author || !content) {
            return NextResponse.json({ error: '제목, 작성자, 내용은 필수 항목입니다.' }, { status: 400 });
        }

        const now = new Date().toISOString();

        const newPost: ASPost = {
            id: uuidv4(),
            title,
            author,
            email,
            content,
            createdAt: now,
            updatedAt: now,
        };

        await addPost(newPost);

        return NextResponse.json({ message: '등록되었습니다.', data: newPost }, { status: 201 });
    } catch (error) {
        console.error('[POST /api/contact]', error);
        return NextResponse.json({ error: '등록 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 