import { NextRequest, NextResponse } from 'next/server';
import { readProductsData, writeProductsData, ProductsDataStructure } from '@/lib/file-utils';
import { Product } from '@/types/product';
import { syncProductToSafetyEquipment } from "@/lib/safety-equipment-sync";

interface RouteParams {
    params: Promise<{
        productId: string;
    }>;
}

// 특정 제품 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
    const resolvedParams = await params;
    const { productId } = resolvedParams;
    console.log(`[API GET] 제품 조회 - productId: ${productId}`);

    try {
        const products = await readProductsData();
        const product = findProductById(products, productId);

        if (!product) {
            return NextResponse.json({ message: '제품을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('[API GET] 제품 조회 중 오류:', error);
        return NextResponse.json({ message: '제품 조회 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 특정 제품 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const resolvedParams = await params;
    const { productId } = resolvedParams;
    console.log(`[API PUT] 제품 수정 요청 시작 - productId: ${productId}`);

    try {
        const productDataFromRequest = await request.json() as Product;
        console.log('[API PUT] 받은 데이터:', JSON.stringify(productDataFromRequest, null, 2));

        if (productDataFromRequest.id && productDataFromRequest.id !== productId) {
            console.error('[API PUT] ID 불일치:', productDataFromRequest.id, '!==', productId);
            return NextResponse.json({ message: '요청된 productId와 제품 데이터의 ID가 일치하지 않습니다.' }, { status: 400 });
        }
        if (!productDataFromRequest.categoryId) {
            console.error('[API PUT] categoryId 누락');
            return NextResponse.json({ message: '카테고리 ID(categoryId)는 필수입니다.' }, { status: 400 });
        }

        console.log('[API PUT] 기존 제품 데이터 읽기 시작');
        const products = await readProductsData();
        console.log('[API PUT] 총 제품 수:', Object.keys(products).length);

        const existingProduct = findProductById(products, productId);
        if (!existingProduct) {
            console.error('[API PUT] 제품을 찾을 수 없음:', productId);
            return NextResponse.json({ message: '제품을 찾을 수 없습니다.' }, { status: 404 });
        }

        console.log('[API PUT] 기존 제품 찾음:', existingProduct.id);

        // 제품 데이터 업데이트
        const updatedProduct = {
            ...existingProduct,
            ...productDataFromRequest,
            id: productId // ID는 변경되지 않도록 보장
        };

        console.log('[API PUT] 업데이트된 제품:', JSON.stringify(updatedProduct, null, 2));

        // 기존 제품 제거하고 업데이트된 제품 추가
        removeProductById(products, productId);
        addProductToCategory(products, updatedProduct);

        console.log('[API PUT] 제품 데이터 저장 시작');
        await writeProductsData(products);
        console.log('[API PUT] 제품 데이터 저장 완료');

        // safety-equipment 카테고리인 경우 TypeScript 파일도 업데이트
        if (updatedProduct.categoryId === 'safety-equipment' || updatedProduct.categoryId === 'safety-equipment') {
            console.log('[API PUT] Safety-Equipment 동기화 시작');
            try {
                await syncProductToSafetyEquipment(updatedProduct);
                console.log('[API PUT] Safety-Equipment 동기화 완료');
            } catch (syncError) {
                console.error('[API PUT] Safety-Equipment 동기화 실패:', syncError);
                // 동기화 실패해도 계속 진행 (관리자에게는 성공으로 표시)
            }
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('[API PUT] 제품 수정 중 오류:', error);
        return NextResponse.json({ message: '제품 수정 중 오류가 발생했습니다.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}

// 특정 제품 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const resolvedParams = await params;
    const { productId } = resolvedParams;
    console.log(`[API DELETE] 제품 삭제 요청 - productId: ${productId}`);

    try {
        const products = await readProductsData();
        const product = findProductById(products, productId);

        if (!product) {
            return NextResponse.json({ message: '제품을 찾을 수 없습니다.' }, { status: 404 });
        }

        removeProductById(products, productId);
        await writeProductsData(products);

        return NextResponse.json({ message: '제품이 삭제되었습니다.' });
    } catch (error) {
        console.error('[API DELETE] 제품 삭제 중 오류:', error);
        return NextResponse.json({ message: '제품 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 헬퍼 함수들
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

function removeProductById(data: ProductsDataStructure, productId: string): void {
    for (const category of data.categories || []) {
        const index = category.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            category.products.splice(index, 1);
            return;
        }
    }
}

function addProductToCategory(data: ProductsDataStructure, product: Product): void {
    const categoryId = product.categoryId || 'default';
    let category = data.categories?.find(c => c.id === categoryId);

    if (!category) {
        // 카테고리가 없으면 생성
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
    }

    // 제품 추가 시 productCategoryId 필드는 제거 (writeProductsData에서 이미 처리하지만, 명시적으로도 가능)
    const { productCategoryId, ...productToAdd } = product;
    category.products.push(productToAdd as Product);
}

function getCategoryName(categoryId: string, lang: 'ko' | 'en' | 'cn'): string {
    const names: Record<string, Record<string, string>> = {
        'safety-equipment': {
            ko: '안전장비',
            en: 'Safety Equipment',
            cn: '安全设备'
        },
        'protective-gear': {
            ko: '보호장구',
            en: 'Protective Gear',
            cn: '防护装备'
        },
        'default': {
            ko: '기타',
            en: 'Others',
            cn: '其他'
        }
    };

    return names[categoryId]?.[lang] || names['default'][lang];
} 