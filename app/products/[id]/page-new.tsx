import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductDetailClient from './page-client';
import ProductDetailFrameLayout from '@/components/layouts/ProductDetailFrameLayout';
import { findProductById } from '@/data/products';
import { Product } from '@/types/product';

// 제품 데이터 가져오기 함수
async function getProductData(productId: string): Promise<Product | null> {
  try {
    // 제품 ID를 사용하여 제품 데이터 조회
    const product = findProductById(productId);
    return product || null;
  } catch (error) {
    console.error('제품 데이터 로드 오류:', error);
    return null;
  }
}

// 메타데이터 생성
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const product = findProductById(id);

  if (!product) {
    return {
      title: '제품을 찾을 수 없음 | SEOHAN',
      description: '요청하신 제품을 찾을 수 없습니다.'
    };
  }

  // 제품명 안전하게 처리 (문자열 또는 객체)
  const title = typeof product.name === 'string'
    ? product.name
    : (product.name && typeof product.name === 'object' && 'ko' in product.name)
      ? (product.name as any).ko
      : String(product.name);

  // 제품 설명 안전하게 처리 (문자열 또는 객체)
  const description = typeof product.description === 'string'
    ? product.description
    : (product.description && typeof product.description === 'object' && 'ko' in product.description)
      ? (product.description as any).ko
      : String(product.description);

  return {
    title: `${title} | SEOHAN`,
    description: description,
    openGraph: {
      images: product.images && product.images.length > 0
        ? [typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any).path || '']
        : [],
    },
  };
}

// 제품 상세 페이지 (서버 컴포넌트)
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // 제품 데이터 가져오기
  const productId = params?.id;
  const product = await getProductData(productId);

  // 제품이 없으면 404 반환
  if (!product) {
    notFound();
  }

  // 제품이 있으면 클라이언트 컴포넌트로 렌더링
  return (
    <ProductDetailFrameLayout>
      <ProductDetailClient productId={productId} />
    </ProductDetailFrameLayout>
  );
}
