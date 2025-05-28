import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, stat, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processUploadedFile, deleteFile } from '@/lib/file-storage';

// 파일 저장 기본 경로 (public 폴더 내부로 해야 웹에서 접근 가능)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureDirectoryExists(dirPath: string) {
    try {
        await stat(dirPath);
    } catch (e: any) {
        if (e.code === 'ENOENT') {
            await mkdir(dirPath, { recursive: true });
        } else {
            throw e;
        }
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * 파일 업로드 처리 API
 * POST /api/admin/upload
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const subDir = formData.get('subDir') as string || '';

        if (!file) {
            console.error('No file found in formData');
            return NextResponse.json(
                { success: false, error: '업로드할 파일이 없습니다.', message: '업로드할 파일이 없습니다.' },
                { status: 400 }
            );
        }

        // processUploadedFile 호출을 try...catch로 감싸서 오류 처리 강화
        try {
            console.log(`Attempting to process file: ${file.name}, size: ${file.size}, type: ${file.type}, subDir: ${subDir}`);
            const fileInfo = await processUploadedFile(file, subDir);
            console.log('File processed successfully:', fileInfo);
            return NextResponse.json({
                success: true,
                message: '파일이 성공적으로 업로드되었습니다.',
                // API 응답에 실제 저장된 파일명(fileInfo.filename)과 URL(fileInfo.url)을 포함
                url: fileInfo.url,
                fileName: fileInfo.filename,
                originalName: fileInfo.originalFilename,
                fileSize: file.size,
                file: fileInfo, // 상세 정보를 위해 fileInfo 전체를 포함할 수도 있음
            });
        } catch (processingError: any) {
            // processUploadedFile 내부에서 발생한 모든 오류를 여기서 처리
            console.error('Error in processUploadedFile or sub-functions:', processingError);
            // 클라이언트에 전달할 오류 메시지 (가능하다면 processingError.message 사용)
            const errorMessage = processingError.message || '파일 처리 중 서버에서 오류가 발생했습니다.';
            return NextResponse.json(
                { success: false, error: errorMessage, message: errorMessage },
                { status: 500 } // 내부 서버 오류로 상태 코드 변경
            );
        }

    } catch (error: any) {
        // FormData 파싱 등 요청 처리의 초기 단계에서 발생한 오류
        console.error('Error processing POST request in /api/admin/upload:', error);
        return NextResponse.json(
            { success: false, error: '요청 처리 중 오류가 발생했습니다.', message: error.message || '요청 처리 중 알 수 없는 오류' },
            { status: 500 }
        );
    }
}

/**
 * 파일 정보 가져오기 API
 * GET /api/admin/upload?path=uploads/path/to/file.jpg
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams?.get('path');

        if (!path) {
            return NextResponse.json(
                { success: false, error: '파일 경로가 필요합니다.' },
                { status: 400 }
            );
        }

        // 경로가 유효한지 확인 (보안을 위해 uploads 디렉토리에만 접근 허용)
        if (!path.startsWith('uploads/') && !path.startsWith('/uploads/')) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 파일 경로입니다.' },
                { status: 403 }
            );
        }

        // 여기서는 파일 경로만 검증하고 실제 파일 접근은 하지 않음
        // 파일은 public 디렉토리에 있으므로 Next.js가 정적 파일로 제공
        const safePath = path.startsWith('/') ? path : `/${path}`;

        return NextResponse.json({
            success: true,
            file: {
                url: safePath,
            },
        });
    } catch (error) {
        console.error('파일 정보 요청 중 오류 발생:', error);
        return NextResponse.json(
            { success: false, error: '파일 정보 요청 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * 파일 삭제 API
 * DELETE /api/admin/upload?path=uploads/path/to/file.jpg
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const path = searchParams?.get('path');

        if (!path) {
            return NextResponse.json(
                { success: false, error: '파일 경로가 필요합니다.' },
                { status: 400 }
            );
        }

        // 경로가 유효한지 확인 (보안을 위해 uploads 디렉토리에만 접근 허용)
        if (!path.startsWith('uploads/') && !path.startsWith('/uploads/')) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 파일 경로입니다.' },
                { status: 403 }
            );
        }

        // 파일 삭제
        const result = await deleteFile(path);

        if (!result) {
            return NextResponse.json(
                { success: false, error: '파일 삭제에 실패했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '파일이 성공적으로 삭제되었습니다.',
        });
    } catch (error) {
        console.error('파일 삭제 중 오류 발생:', error);
        return NextResponse.json(
            { success: false, error: '파일 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 