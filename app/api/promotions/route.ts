import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PromotionItem } from '@/types/promotion';

const dataFilePath = path.join(process.cwd(), 'content', 'data', 'promotions.json');

async function readPromotionsData(): Promise<PromotionItem[]> {
    try {
        const jsonData = await fs.promises.readFile(dataFilePath, 'utf-8');
        const promotions = JSON.parse(jsonData) as PromotionItem[];
        return promotions.sort((a, b) => a.order - b.order);
    } catch (error) {
        console.error('Error reading promotions data:', error);
        // 파일이 없거나 읽기 오류 시 빈 배열 반환 또는 기본값 설정 가능
        return [];
    }
}

export async function GET() {
    try {
        const promotions = await readPromotionsData();
        return NextResponse.json(promotions);
    } catch (error) {
        console.error('Failed to fetch promotions:', error);
        return NextResponse.json({ message: '홍보 자료를 가져오는 데 실패했습니다.' }, { status: 500 });
    }
}

// POST, PUT, DELETE 함수들은 추후 관리자 페이지 기능 구현 시 추가
export async function POST(request: Request) {
    try {
        const newPromotionItem = await request.json() as PromotionItem;
        const promotions = await readPromotionsData();

        // ID 중복 확인 (실제 사용 시 더 견고한 ID 생성 방식 필요)
        if (promotions.some(p => p.id === newPromotionItem.id)) {
            return NextResponse.json({ message: '이미 사용 중인 ID입니다.' }, { status: 400 });
        }

        // order 값 자동 설정 (가장 큰 order 값 + 1)
        if (newPromotionItem.order === undefined || newPromotionItem.order === null) {
            const maxOrder = promotions.reduce((max, p) => Math.max(max, p.order), 0);
            newPromotionItem.order = maxOrder + 1;
        }

        newPromotionItem.createdAt = new Date().toISOString();
        newPromotionItem.updatedAt = new Date().toISOString();

        promotions.push(newPromotionItem);
        await fs.promises.writeFile(dataFilePath, JSON.stringify(promotions, null, 2), 'utf-8');
        return NextResponse.json(newPromotionItem, { status: 201 });
    } catch (error) {
        console.error('Error creating promotion item:', error);
        return NextResponse.json({ message: '홍보 자료 생성에 실패했습니다.' }, { status: 500 });
    }
} 