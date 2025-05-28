import { NextRequest, NextResponse } from 'next/server';
import { readItems, writeItems, saveItem, deleteItem } from '@/lib/file-db';
import { SiteMenuItem } from '@/types/menu';

const FILE_NAME = 'site-menus.json';

export async function GET() {
    try {
        const menus = await readItems<SiteMenuItem>(FILE_NAME);
        return NextResponse.json(menus);
    } catch (error: any) {
        console.error('[Menus][GET]', error);
        return NextResponse.json({ message: '메뉴 정보를 불러오지 못했습니다.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as SiteMenuItem;
        if (!body.id) return NextResponse.json({ message: 'id 필드가 필요합니다.' }, { status: 400 });
        await saveItem<SiteMenuItem>(FILE_NAME, body);
        const menus = await readItems<SiteMenuItem>(FILE_NAME);
        return NextResponse.json(menus);
    } catch (error: any) {
        console.error('[Menus][POST]', error);
        return NextResponse.json({ message: '메뉴를 저장하지 못했습니다.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const json = await req.json();

        // Bulk 업데이트 (menus 배열 전달 시 전체 교체)
        if (Array.isArray(json.menus)) {
            await writeItems<SiteMenuItem>(FILE_NAME, json.menus);
            return NextResponse.json(json.menus);
        }

        // 단일 항목 저장
        const body = json as SiteMenuItem;
        if (!body.id) return NextResponse.json({ message: 'id 필드가 필요합니다.' }, { status: 400 });
        await saveItem<SiteMenuItem>(FILE_NAME, body);
        const menus = await readItems<SiteMenuItem>(FILE_NAME);
        return NextResponse.json(menus);
    } catch (error: any) {
        console.error('[Menus][PUT]', error);
        return NextResponse.json({ message: '메뉴를 업데이트하지 못했습니다.' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams?.get('id');
        if (!id) return NextResponse.json({ message: 'id 쿼리 파라미터가 필요합니다.' }, { status: 400 });
        const success = await deleteItem<SiteMenuItem>(FILE_NAME, id);
        if (!success) return NextResponse.json({ message: '삭제할 항목을 찾지 못했습니다.' }, { status: 404 });
        const menus = await readItems<SiteMenuItem>(FILE_NAME);
        return NextResponse.json(menus);
    } catch (error: any) {
        console.error('[Menus][DELETE]', error);
        return NextResponse.json({ message: '메뉴를 삭제하지 못했습니다.' }, { status: 500 });
    }
} 