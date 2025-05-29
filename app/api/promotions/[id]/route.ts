import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PromotionItem } from '@/types/promotion';

const dataFilePath = path.join(process.cwd(), 'content', 'data', 'promotions.json');

async function readPromotionsData(): Promise<PromotionItem[]> {
    try {
        const jsonData = await fs.promises.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData) as PromotionItem[];
    } catch (error) {
        // If file doesn't exist or other read error, return empty array
        // console.error('Error reading promotions data in [id] route:', error);
        return [];
    }
}

async function writePromotionsData(data: PromotionItem[]): Promise<void> {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log(`[API GET /api/promotions/${id}] 요청 ID:`, id); // 요청된 ID 로그

    const promotions = await readPromotionsData();
    console.log(`[API GET /api/promotions/${id}] 읽어온 promotions 데이터 개수:`, promotions.length); // 읽어온 데이터 개수 로그
    // console.log(`[API GET /api/promotions/${id}] 전체 promotions 데이터:`, JSON.stringify(promotions, null, 2)); // 필요시 전체 데이터 로그 (너무 길면 주석 처리)

    const promotion = promotions.find(p => {
        // console.log(`[API GET /api/promotions/${id}] 비교: p.id = "${p.id}", id = "${id}", 일치여부: ${p.id === id}`); // 개별 비교 로그
        return p.id === id;
    });

    if (!promotion) {
        console.log(`[API GET /api/promotions/${id}] ID '${id}'에 해당하는 홍보 자료를 찾지 못했습니다.`); // 찾지 못한 경우 로그
        return NextResponse.json({ message: '홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.log(`[API GET /api/promotions/${id}] ID '${id}'에 해당하는 홍보 자료를 찾음:`, promotion); // 찾은 경우 로그
    return NextResponse.json(promotion);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    let promotions = await readPromotionsData();
    const promotionIndex = promotions.findIndex(p => p.id === id);

    if (promotionIndex === -1) {
        return NextResponse.json({ message: '수정할 홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
    }

    try {
        const updatedItemData = await request.json();
        // Ensure the ID from the URL is used, not from the body, and keep original creation date
        promotions[promotionIndex] = {
            ...promotions[promotionIndex], // 기존 데이터 유지 (특히 createdAt)
            ...updatedItemData,
            id: id, // URL의 ID를 사용 (id -> promotionId)
            updatedAt: new Date().toISOString() // 수정 날짜 업데이트
        };

        await writePromotionsData(promotions);
        return NextResponse.json(promotions[promotionIndex]);
    } catch (error) {
        console.error('Error updating promotion item:', error);
        return NextResponse.json({ message: '홍보 자료 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    let promotions = await readPromotionsData();
    const filteredPromotions = promotions.filter(p => p.id !== id);

    if (promotions.length === filteredPromotions.length) {
        return NextResponse.json({ message: '삭제할 홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
    }

    try {
        await writePromotionsData(filteredPromotions);
        return NextResponse.json({ message: '홍보 자료가 성공적으로 삭제되었습니다.' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting promotion item:', error);
        return NextResponse.json({ message: '홍보 자료 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    let promotions = await readPromotionsData();
    const promotionIndex = promotions.findIndex(p => p.id === id);

    if (promotionIndex === -1) {
        return NextResponse.json({ message: '수정할 홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
    }

    try {
        const patchData = await request.json();

        // isVisible 필드만 업데이트
        if (patchData.hasOwnProperty('isVisible')) {
            promotions[promotionIndex] = {
                ...promotions[promotionIndex],
                isVisible: patchData.isVisible,
                updatedAt: new Date().toISOString()
            };
        }

        await writePromotionsData(promotions);
        return NextResponse.json(promotions[promotionIndex]);
    } catch (error) {
        console.error('Error patching promotion item:', error);
        return NextResponse.json({ message: '홍보 자료 상태 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 