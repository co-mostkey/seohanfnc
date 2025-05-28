import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'company-awards');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const POST = async (req: NextRequest) => {
    console.log('[companyAwardImage API] Received request');
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 파일 크기 검사
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
            }, { status: 400 });
        }

        // 파일 확장자 검사
        const ext = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({
                error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}.`
            }, { status: 400 });
        }

        // 고유한 파일명 생성
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // 파일 저장
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.promises.writeFile(filePath, buffer);

        const relativePath = path.join('/uploads', 'company-awards', uniqueName).replace(/\\/g, '/');

        console.log('[companyAwardImage API] File uploaded successfully:', relativePath);

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: relativePath,
            fileName: uniqueName,
            size: file.size,
            type: file.type,
        }, { status: 200 });

    } catch (error: any) {
        console.error('[companyAwardImage API] Error during file upload:', error);
        return NextResponse.json({
            error: 'Internal server error during file upload.',
            details: error.message || String(error)
        }, { status: 500 });
    }
}; 