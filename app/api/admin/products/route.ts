import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types/product';
import { readProductsData, writeProductsData } from '@/lib/file-utils';
import { getAllProductsForAdmin } from '@/data/products';
import { productFormSchema } from '@/lib/validators/product-validator';
import { createStaticATypeProductPage } from './create-static-a-type';
import { createStaticBTypeProductPage } from './create-static-b-type';

// 모든 제품 조회
export async function GET() {
    try {
        const products = await getAllProductsForAdmin();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}

// 새 제품 추가
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 데이터 유효성 검사
        const validation = productFormSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                message: '잘못된 데이터 형식입니다.',
                errors: validation.error.errors
            }, { status: 400 });
        }

        // mainImage를 image로 변환
        const { mainImage, ...rest } = validation.data;
        const newProductData = {
            ...rest,
            image: mainImage,
        } as Product;

        const products = await readProductsData();

        // 중복 ID 검사
        const existingProduct = findProductById(products, newProductData.id);
        if (existingProduct) {
            return NextResponse.json({
                message: '이미 존재하는 제품 ID입니다.'
            }, { status: 409 });
        }

        // 제품을 카테고리에 추가
        addProductToCategory(products, newProductData);
        await writeProductsData(products);

        // 제품 타입에 따른 정적 페이지 생성
        if (newProductData.productStyle === 'B') {
            await createStaticBTypeProductPage(newProductData);
        } else {
            // [TRISID] A타입 자동 생성 - 완성된 시스템, 절대 수정 금지!
            await createStaticATypeProductPage(newProductData);
            console.log(`[TRISID] A타입 제품 ${newProductData.id} 고급 정적 페이지 생성 완료 (Sloping-Rescue-Chute 기반)`);
        }

        return NextResponse.json(newProductData, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            message: '제품 추가 중 서버 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// 헬퍼 함수들
function findProductById(data: any, productId: string): Product | undefined {
    for (const category of data.categories || []) {
        const product = category.products.find((p: any) => p.id === productId);
        if (product) {
            return {
                ...product,
                productCategoryId: category.id
            } as Product;
        }
    }
    return undefined;
}

function addProductToCategory(data: any, product: Product): void {
    const categoryId = product.categoryId || 'etc';
    let category = data.categories?.find((c: any) => c.id === categoryId);

    if (!category) {
        // 카테고리가 없으면 동적으로 생성
        category = {
            id: categoryId,
            nameKo: '기타',
            nameEn: 'Others',
            nameCn: '其他',
            products: []
        };
        if (!data.categories) {
            data.categories = [];
        }
        data.categories.push(category);
    }

    const { productCategoryId, ...productToAdd } = product;
    category.products.push(productToAdd as Product);
} 