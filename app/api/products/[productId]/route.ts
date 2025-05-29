import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/data/products';

export async function GET(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const { productId } = params;

        if (!productId) {
            return NextResponse.json(
                { error: '제품 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const product = getProductById(productId);

        if (!product) {
            return NextResponse.json(
                { error: '제품을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('제품 API 오류:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 