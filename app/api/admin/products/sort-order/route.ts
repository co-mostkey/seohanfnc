import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types/product';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');

export async function PUT(request: NextRequest) {
    try {
        const { products: sortOrderUpdates } = await request.json();

        if (!Array.isArray(sortOrderUpdates)) {
            return NextResponse.json(
                { message: '잘못된 요청 형식입니다.' },
                { status: 400 }
            );
        }

        // 기존 제품 데이터 읽기
        const fileContent = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        // sortOrder 업데이트를 위한 맵 생성
        const sortOrderMap = new Map(
            sortOrderUpdates.map((item: { id: string; sortOrder: number }) => [
                item.id,
                item.sortOrder,
            ])
        );

        // 각 카테고리의 제품들에 sortOrder 적용
        data.categories.forEach((category: any) => {
            category.products.forEach((product: Product, index: number) => {
                const newSortOrder = sortOrderMap.get(product.id);
                if (newSortOrder !== undefined) {
                    product.sortOrder = newSortOrder;
                }
            });
        });

        // 파일에 저장
        await fs.writeFile(
            PRODUCTS_FILE_PATH,
            JSON.stringify(data, null, 2),
            'utf-8'
        );

        return NextResponse.json(
            { message: '정렬 순서가 성공적으로 업데이트되었습니다.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('정렬 순서 업데이트 오류:', error);
        return NextResponse.json(
            { message: '정렬 순서 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 