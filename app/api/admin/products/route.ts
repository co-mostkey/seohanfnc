import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Product, ProductCategoryGroup } from '@/types/product';
import {
    readItems,
    writeItems,
    DATA_DIR
} from '@/lib/file-db';
import { readProductsData, writeProductsData, getAllProductIds } from '@/lib/file-utils';
import { getAllProductsForAdmin } from '@/data/products'; // getAllProducts 대신 getAllProductsForAdmin 사용
import fs from 'fs';
import path from 'path';
// import { v4 as uuidv4 } from 'uuid'; // 클라이언트에서 ID를 제공하므로 주석 처리 또는 삭제

// 제품 데이터 파일 경로
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'db', 'products.json');

// 모든 제품 조회 (data/products.ts의 getAllProductsForAdmin와 유사한 로직)
export async function GET() {
    try {
        // getAllProductsForAdmin 함수를 사용하여 관리자용 제품 목록 가져오기 (isPublished 필터링 없음)
        const products = getAllProductsForAdmin();

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('제품 목록 조회 중 오류:', error);
        return NextResponse.json(
            { message: '제품 목록을 불러오는데 실패했습니다.' },
            { status: 500 }
        );
    }
}

// 새 제품 추가
export async function POST(request: NextRequest) {
    try {
        // 클라이언트로부터 id가 포함된 Product 데이터를 받음 (스키마에 따라 id는 필수)
        const productDataFromRequest = await request.json() as Product;

        // 1. ID 중복 검사
        const existingProductIds = await getAllProductIds();
        if (existingProductIds.includes(productDataFromRequest.id)) {
            return NextResponse.json(
                { message: `제품 ID '${productDataFromRequest.id}'는 이미 존재합니다. 다른 ID를 사용해주세요.` },
                { status: 409 } // Conflict
            );
        }

        // 2. Category ID 유효성 검사 (categoryId는 필수)
        if (!productDataFromRequest.categoryId) {
            return NextResponse.json({ message: '카테고리 ID(categoryId)는 필수입니다.' }, { status: 400 });
        }

        // productCategoryId는 저장하지 않음. category 필드를 사용.
        // API 요청에서는 categoryId를 사용하고, 실제 저장 시에는 Product 객체 내의 category 필드 사용
        const { productCategoryId, ...restOfProductData } = productDataFromRequest;
        const newProduct: Product = {
            ...restOfProductData,
            // id: productDataFromRequest.id, // 이미 productDataFromRequest에 포함되어 있음
            category: productDataFromRequest.categoryId // products.json 구조에 맞춰 category 필드 사용
        };

        const currentData = await readProductsData();
        const categoryIndex = currentData.categories.findIndex(cat => cat.id === newProduct.categoryId);

        if (categoryIndex === -1) {
            // 해당 카테고리가 없으면 새로 생성 (운영에서는 별도 카테고리 관리 권장)
            const categoryGroup: ProductCategoryGroup = {
                id: newProduct.categoryId || 'default',
                nameKo: '기본 카테고리',
                nameEn: 'Default Category',
                nameCn: '默认类别',
                products: [newProduct] // 새 제품을 추가
            };
            currentData.categories.push(categoryGroup);
        } else {
            currentData.categories[categoryIndex].products.push(newProduct);
        }

        await writeProductsData(currentData);

        // 클라이언트에는 productCategoryId를 포함하여 반환 (ProductForm과의 일관성)
        return NextResponse.json({ ...newProduct, productCategoryId: newProduct.categoryId }, { status: 201 });

    } catch (error: any) {
        console.error('[API_PRODUCTS_POST_ERROR]', error);
        if (error.message.includes('currently locked')) {
            return NextResponse.json({ message: '데이터 저장 중 충돌이 발생했습니다. 잠시 후 다시 시도해주세요.', error: error.message }, { status: 409 });
        }
        return NextResponse.json({ message: '제품 생성에 실패했습니다.', error: error.message }, { status: 500 });
    }
} 