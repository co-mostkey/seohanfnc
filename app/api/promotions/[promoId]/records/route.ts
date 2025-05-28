import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PromotionItem, DeliveryRecord } from '@/types/promotion';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for new records

const dataFilePath = path.join(process.cwd(), 'content', 'data', 'promotions.json');

// Helper function to read data
async function readPromotionsData(): Promise<PromotionItem[]> {
    try {
        const jsonData = await fs.promises.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData) as PromotionItem[];
    } catch (error) {
        return [];
    }
}

// Helper function to write data
async function writePromotionsData(data: PromotionItem[]): Promise<void> {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// POST a new delivery record to a specific promotion item
export async function POST(request: Request, { params }: { params: { promoId: string } }) {
    const { promoId } = params;

    try {
        const newRecordData = await request.json() as Omit<DeliveryRecord, 'id'>; // id는 서버에서 생성
        let promotions = await readPromotionsData();
        const promotionIndex = promotions.findIndex(p => p.id === promoId);

        if (promotionIndex === -1) {
            return NextResponse.json({ message: '해당 홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
        }

        const targetPromotion = promotions[promotionIndex];

        if (targetPromotion.type !== 'deliveryRecordList') {
            return NextResponse.json({ message: '이 홍보 자료는 납품 실적 목록 타입이 아닙니다.' }, { status: 400 });
        }

        const newRecord: DeliveryRecord = {
            ...newRecordData,
            id: uuidv4(), // 새 납품 실적에 고유 ID 부여
        };

        if (!targetPromotion.records) {
            targetPromotion.records = [];
        }
        targetPromotion.records.push(newRecord);
        targetPromotion.updatedAt = new Date().toISOString(); // 상위 아이템 업데이트 날짜 갱신

        promotions[promotionIndex] = targetPromotion;
        await writePromotionsData(promotions);

        return NextResponse.json(newRecord, { status: 201 });

    } catch (error) {
        console.error('Error adding delivery record:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: '잘못된 요청 데이터 형식입니다.' }, { status: 400 });
        }
        return NextResponse.json({ message: '납품 실적 추가 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 