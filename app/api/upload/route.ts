import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const type = formData.get('type') as string; // 홍보자료 타입

        // type이 있으면 홍보자료 업로드 (단일 파일)
        if (type) {
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json({
                    success: false,
                    message: '파일이 없습니다.'
                }, { status: 400 });
            }

            // 파일 타입별 허용 확장자 설정
            const allowedTypes: { [key: string]: string[] } = {
                'video': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
                'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
                'document': ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'hwp']
            };

            // 파일 확장자 검증
            const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
            const currentAllowedTypes = allowedTypes[type] || [];

            if (currentAllowedTypes.length > 0 && !currentAllowedTypes.includes(fileExt)) {
                return NextResponse.json({
                    success: false,
                    message: `허용되지 않는 파일 형식입니다. 허용 형식: ${currentAllowedTypes.join(', ')}`
                }, { status: 400 });
            }

            // 파일 크기 체크 (비디오는 100MB, 나머지는 10MB)
            const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
            if (file.size > maxSize) {
                return NextResponse.json({
                    success: false,
                    message: `파일 크기가 너무 큽니다. 최대 크기: ${type === 'video' ? '100MB' : '10MB'}`
                }, { status: 400 });
            }

            // 업로드 디렉토리 설정
            let uploadSubDir = 'general';
            if (type === 'video') uploadSubDir = 'videos';
            else if (type === 'image') uploadSubDir = 'images';
            else if (type === 'document') uploadSubDir = 'documents';

            const uploadDir = path.join(process.cwd(), 'public', 'uploads', uploadSubDir);
            await mkdir(uploadDir, { recursive: true });

            // 안전한 파일명 생성
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 8);
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const filename = `${timestamp}_${randomString}_${sanitizedFilename}`;
            const filepath = path.join(uploadDir, filename);

            // 파일 저장
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filepath, buffer);

            // 홍보자료용 응답
            const fileUrl = `/uploads/${uploadSubDir}/${filename}`;
            return NextResponse.json({
                success: true,
                url: fileUrl,
                fileName: file.name // 원본 파일명 반환
            });
        }

        // type이 없으면 문의사항 업로드 (다중 파일)
        else {
            const uploadedUrls: string[] = [];

            // 업로드 디렉토리 생성
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'inquiries');
            await mkdir(uploadDir, { recursive: true });

            // 모든 파일 처리
            for (const [key, value] of formData.entries()) {
                if (key.startsWith('file-') && value instanceof File) {
                    const file = value as File;

                    // 파일 크기 체크 (10MB)
                    if (file.size > 10 * 1024 * 1024) {
                        continue; // 10MB 초과 파일은 건너뛰기
                    }

                    // 안전한 파일명 생성
                    const timestamp = Date.now();
                    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const filename = `${timestamp}_${sanitizedFilename}`;
                    const filepath = path.join(uploadDir, filename);

                    // 파일 저장
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    await writeFile(filepath, buffer);

                    // URL 추가
                    uploadedUrls.push(`/uploads/inquiries/${filename}`);
                }
            }

            // 문의사항용 응답 (기존 호환성 유지)
            return NextResponse.json({
                success: true,
                urls: uploadedUrls
            });
        }
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        return NextResponse.json({
            success: false,
            message: '파일 업로드 중 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }, { status: 500 });
    }
} 