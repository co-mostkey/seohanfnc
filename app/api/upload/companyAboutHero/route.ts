import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { acquireLock, releaseLock, ensureDirectoryExists } from '@/lib/file-db';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'company');
const LOCK_FILE = path.join(process.cwd(), 'company-upload.lock');

export async function POST(req: NextRequest) {
    let lockAcquired = false;
    try {
        await acquireLock(LOCK_FILE);
        lockAcquired = true;

        await ensureDirectoryExists(UPLOAD_DIR);

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'No file provided.', success: false }, { status: 400 });
        }

        const fileExtension = path.extname(file.name);
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFilename);

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        const fileUrl = `/uploads/company/${uniqueFilename}`;

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: fileUrl,
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error('[UploadCompanyAboutHero][POST] Error uploading file:', error);
        return NextResponse.json({ message: 'Error uploading file.', success: false, error: (error as Error).message }, { status: 500 });
    } finally {
        if (lockAcquired) {
            await releaseLock(LOCK_FILE);
        }
    }
} 