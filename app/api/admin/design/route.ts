import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/file-db';
import { DesignSettings } from '@/types/design';

const FILE_NAME = 'design-settings.json';

export async function GET() {
    try {
        const settings = await readJsonFile<DesignSettings>(FILE_NAME);
        return NextResponse.json(settings);
    } catch (error: any) {
        console.error('[Design][GET]', error);
        return NextResponse.json({ message: '디자인 설정을 불러오지 못했습니다.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<DesignSettings>;
        const current = await readJsonFile<DesignSettings>(FILE_NAME);
        const updated = { ...current, ...body } as DesignSettings;
        await writeJsonFile(FILE_NAME, updated);
        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('[Design][PUT]', error);
        return NextResponse.json({ message: '디자인 설정을 저장하지 못했습니다.' }, { status: 500 });
    }
} 