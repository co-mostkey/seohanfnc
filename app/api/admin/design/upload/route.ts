import { NextRequest, NextResponse } from 'next/server';
import { processUploadedFile } from '@/lib/file-storage';

/**
 * 디자인 관련 파일 업로드 API
 * POST /api/admin/design/upload
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const fileType = formData.get('fileType') as string || 'design';

        if (!file) {
            console.error('No file found in formData');
            return NextResponse.json(
                { success: false, error: '업로드할 파일이 없습니다.', message: '업로드할 파일이 없습니다.' },
                { status: 400 }
            );
        }

        // 디자인 관련 파일은 design 폴더에 저장
        const subDir = fileType === 'image' ? 'design/logos' : `design/${fileType}`;

        try {
            console.log(`Processing design file: ${file.name}, size: ${file.size}, type: ${file.type}, subDir: ${subDir}`);
            const fileInfo = await processUploadedFile(file, subDir);
            console.log('Design file processed successfully:', fileInfo);

            return NextResponse.json({
                success: true,
                message: '파일이 성공적으로 업로드되었습니다.',
                url: fileInfo.url,
                filename: fileInfo.filename,
                originalName: fileInfo.originalFilename,
                fileSize: file.size,
            });
        } catch (processingError: any) {
            console.error('Error in processUploadedFile for design:', processingError);
            const errorMessage = processingError.message || '파일 처리 중 서버에서 오류가 발생했습니다.';
            return NextResponse.json(
                { success: false, error: errorMessage, message: errorMessage },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Error processing POST request in /api/admin/design/upload:', error);
        return NextResponse.json(
            { success: false, error: '요청 처리 중 오류가 발생했습니다.', message: error.message || '요청 처리 중 알 수 없는 오류' },
            { status: 500 }
        );
    }
} 