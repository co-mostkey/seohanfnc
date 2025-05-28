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
    const promotions = await readPromotionsData();
    const promotion = promotions.find(p => p.id === id);

    if (!promotion) {
        return NextResponse.json({ message: '홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
    }
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
            id: id, // URL의 ID를 사용
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