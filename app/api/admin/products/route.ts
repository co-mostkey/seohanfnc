import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Product, ProductCategoryGroup } from '@/types/product';
import {
    readItems,
    writeItems,
    DATA_DIR
} from '@/lib/file-db';
import { readProductsData, writeProductsData, getAllProductIds, ProductsDataStructure, getCategoryName } from '@/lib/file-utils';
import { getAllProductsForAdmin } from '@/data/products'; // getAllProducts 대신 getAllProductsForAdmin 사용
import fs from 'fs';
import path from 'path';
import { productFormSchema } from '@/lib/validators/product-validator';
// import { v4 as uuidv4 } from 'uuid'; // 클라이언트에서 ID를 제공하므로 주석 처리 또는 삭제

// 제품 데이터 파일 경로
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'db', 'products.json');

// 모든 제품 조회 (data/products.ts의 getAllProductsForAdmin와 유사한 로직)
export async function GET() {
    try {
        const products = await getAllProductsForAdmin();
        return NextResponse.json(products);
    } catch (error) {
        console.error('Failed to read products data:', error);
        // getAllProductsForAdmin에서 오류 발생 시 빈 배열 반환하여 프론트엔드 오류 방지
        return NextResponse.json([], { status: 500 });
    }
}

// 새 제품 추가
export async function POST(request: NextRequest) {
    console.log('[API POST] 새 제품 추가 요청 시작');
    try {
        const body = await request.json();
        console.log('[API POST] 받은 데이터:', JSON.stringify(body, null, 2));

        // Zod 스키마로 데이터 유효성 검사
        const validation = productFormSchema.safeParse(body);
        if (!validation.success) {
            console.error('[API POST] 데이터 유효성 검사 실패:', validation.error.errors);
            return NextResponse.json({ message: '잘못된 데이터 형식입니다.', errors: validation.error.errors }, { status: 400 });
        }

        const newProductData = validation.data as Product;

        const products = await readProductsData();

        const existingProduct = findProductById(products, newProductData.id);
        if (existingProduct) {
            console.error('[API POST] 이미 존재하는 제품 ID:', newProductData.id);
            return NextResponse.json({ message: '이미 존재하는 제품 ID입니다.' }, { status: 409 });
        }

        addProductToCategory(products, newProductData);

        console.log('[API POST] 제품 데이터 저장 시작');
        await writeProductsData(products);
        console.log('[API POST] 제품 데이터 저장 완료');

        return NextResponse.json(newProductData, { status: 201 });

    } catch (error) {
        console.error('[API POST] 제품 추가 중 오류:', error);
        return NextResponse.json({ message: '제품 추가 중 서버 오류가 발생했습니다.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

// 헬퍼 함수들 (중복 방지를 위해 여기에 유지)
function findProductById(data: ProductsDataStructure, productId: string): Product | undefined {
    for (const category of data.categories || []) {
        const product = category.products.find(p => p.id === productId);
        if (product) {
            return {
                ...product,
                productCategoryId: category.id
            } as Product;
        }
    }
    return undefined;
}

function addProductToCategory(data: ProductsDataStructure, product: Product): void {
    const categoryId = product.categoryId || 'etc'; // categoryId가 없으면 'etc' 카테고리로
    let category = data.categories?.find(c => c.id === categoryId);

    if (!category) {
        // 카테고리가 없으면 동적으로 생성
        category = {
            id: categoryId,
            nameKo: getCategoryName(categoryId, 'ko'),
            nameEn: getCategoryName(categoryId, 'en'),
            nameCn: getCategoryName(categoryId, 'cn'),
            products: []
        };
        if (!data.categories) {
            data.categories = [];
        }
        data.categories.push(category);
        console.log(`[Helper] 새 카테고리 생성: ${categoryId}`);
    }

    const { productCategoryId, ...productToAdd } = product;
    category.products.push(productToAdd as Product);
    console.log(`[Helper] 제품 ${product.id}을(를) 카테고리 ${categoryId}에 추가`);
} 