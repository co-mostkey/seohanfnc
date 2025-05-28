import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PromotionItem, DeliveryRecord } from '@/types/promotion';

const dataFilePath = path.join(process.cwd(), 'content', 'data', 'promotions.json');

// Helper functions (readPromotionsData, writePromotionsData) - 실제로는 공통 유틸리티로 분리 가능
async function readPromotionsData(): Promise<PromotionItem[]> {
    try {
        const jsonData = await fs.promises.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData) as PromotionItem[];
    } catch (error) {
        return [];
    }
}

async function writePromotionsData(data: PromotionItem[]): Promise<void> {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// PUT (update) a specific delivery record within a promotion item
export async function PUT(request: Request, { params }: { params: { promoId: string, recordId: string } }) {
    const { promoId, recordId } = params;

    try {
        const updatedRecordData = await request.json() as Partial<Omit<DeliveryRecord, 'id'>>;
        let promotions = await readPromotionsData();
        const promotionIndex = promotions.findIndex(p => p.id === promoId);

        if (promotionIndex === -1) {
            return NextResponse.json({ message: '해당 홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
        }

        const targetPromotion = promotions[promotionIndex];
        if (targetPromotion.type !== 'deliveryRecordList' || !targetPromotion.records) {
            return NextResponse.json({ message: '이 홍보 자료는 납품 실적 목록 타입이 아니거나 실적이 없습니다.' }, { status: 400 });
        }

        const recordIndex = targetPromotion.records.findIndex(r => r.id === recordId);
        if (recordIndex === -1) {
            return NextResponse.json({ message: '해당 납품 실적을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 기존 레코드 데이터와 업데이트된 데이터를 병합 (id는 변경하지 않음)
        targetPromotion.records[recordIndex] = {
            ...targetPromotion.records[recordIndex],
            ...updatedRecordData,
            id: recordId, // ID는 URL의 recordId로 유지
        };
        targetPromotion.updatedAt = new Date().toISOString(); // 상위 아이템 업데이트 날짜 갱신

        promotions[promotionIndex] = targetPromotion;
        await writePromotionsData(promotions);

        return NextResponse.json(targetPromotion.records[recordIndex]);

    } catch (error) {
        console.error('Error updating delivery record:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: '잘못된 요청 데이터 형식입니다.' }, { status: 400 });
        }
        return NextResponse.json({ message: '납품 실적 업데이트 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// DELETE a specific delivery record within a promotion item
export async function DELETE(request: Request, { params }: { params: { promoId: string, recordId: string } }) {
    const { promoId, recordId } = params;

    try {
        let promotions = await readPromotionsData();
        const promotionIndex = promotions.findIndex(p => p.id === promoId);

        if (promotionIndex === -1) {
            return NextResponse.json({ message: '해당 홍보 자료를 찾을 수 없습니다.' }, { status: 404 });
        }

        const targetPromotion = promotions[promotionIndex];
        if (targetPromotion.type !== 'deliveryRecordList' || !targetPromotion.records) {
            return NextResponse.json({ message: '이 홍보 자료는 납품 실적 목록 타입이 아니거나 실적이 없습니다.' }, { status: 400 });
        }

        const initialRecordCount = targetPromotion.records.length;
        targetPromotion.records = targetPromotion.records.filter(r => r.id !== recordId);

        if (targetPromotion.records.length === initialRecordCount) {
            return NextResponse.json({ message: '삭제할 납품 실적을 찾을 수 없습니다.' }, { status: 404 });
        }

        targetPromotion.updatedAt = new Date().toISOString(); // 상위 아이템 업데이트 날짜 갱신

        promotions[promotionIndex] = targetPromotion;
        await writePromotionsData(promotions);

        return NextResponse.json({ message: '납품 실적이 성공적으로 삭제되었습니다.' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting delivery record:', error);
        return NextResponse.json({ message: '납품 실적 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
} 