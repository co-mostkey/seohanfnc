import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { Attachment } from '@/types/post';

// 파일 저장 경로
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const POST_UPLOADS_DIR = path.join(UPLOAD_DIR, 'posts');

// 파일 업로드 처리 함수
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const postId = formData.get('postId') as string;

        if (!postId) {
            return NextResponse.json({ error: '게시글 ID가 필요합니다.' }, { status: 400 });
        }

        // 업로드 디렉토리 생성
        const postDir = path.join(POST_UPLOADS_DIR, postId);

        if (!existsSync(postDir)) {
            await mkdir(postDir, { recursive: true });
        }

        // 썸네일 처리
        const thumbnail = formData.get('thumbnail') as File | null;
        let thumbnailUrl = '';

        if (thumbnail) {
            const thumbnailBuffer = await thumbnail.arrayBuffer();
            const thumbnailFileName = `thumbnail-${Date.now()}-${thumbnail.name}`;
            const thumbnailPath = path.join(postDir, thumbnailFileName);

            await writeFile(thumbnailPath, Buffer.from(thumbnailBuffer));
            thumbnailUrl = `/uploads/posts/${postId}/${thumbnailFileName}`;

            // 썸네일 URL 저장 (posts-data.json에 업데이트)
            // 여기서는 API route를 통해 PUT 요청을 보내 게시글 업데이트
            await fetch(`${request.nextUrl.origin}/api/admin/posts`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: postId,
                    thumbnail: thumbnailUrl
                })
            });
        }

        // 첨부파일 처리
        const files = formData.getAll('files') as File[];
        const attachments: Attachment[] = [];

        for (const file of files) {
            const fileBuffer = await file.arrayBuffer();
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(postDir, fileName);

            await writeFile(filePath, Buffer.from(fileBuffer));

            // 첨부파일 정보 생성
            const attachment: Attachment = {
                id: `attach-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                postId: postId,
                filename: fileName,
                originalFilename: file.name,
                filesize: file.size,
                mimetype: file.type,
                path: filePath,
                url: `/uploads/posts/${postId}/${fileName}`,
                isImage: file.type.startsWith('image/'),
                downloadCount: 0,
                createdAt: new Date().toISOString()
            };

            attachments.push(attachment);
        }

        // 파일 정보 저장 (posts-data.json에 업데이트)
        if (attachments.length > 0) {
            // 기존 게시글 정보 가져오기
            const response = await fetch(`${request.nextUrl.origin}/api/admin/posts?id=${postId}`);
            const post = await response.json();

            // 첨부파일 정보 업데이트
            const updatedAttachments = [...(post.attachments || []), ...attachments];

            // 게시글 업데이트
            await fetch(`${request.nextUrl.origin}/api/admin/posts`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: postId,
                    attachments: updatedAttachments
                })
            });
        }

        return NextResponse.json({
            success: true,
            message: '파일이 성공적으로 업로드되었습니다.',
            thumbnailUrl,
            attachments
        });
    } catch (error) {
        console.error('파일 업로드 중 오류 발생:', error);
        return NextResponse.json(
            { error: '파일 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 