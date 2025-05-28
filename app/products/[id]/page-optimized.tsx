import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { findProductById, getAllProducts } from '@/data/products';
import { Product } from '@/types/product';
import { ProductDetailClient } from '@/components/products/detail/ProductDetailClient';

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

// 정적 경로 생성을 위한 함수 - Next.js 'output: export' 설정에 필수
export async function generateStaticParams() {
  // 모든 제품 가져오기
  const allProducts = getAllProducts();

  // inquiryOnly가 아닌 제품만 정적 페이지 생성
  const productsForPages = allProducts.filter(product => !product.inquiryOnly);

  // 정적 경로 생성에 필요한 제품 ID 정보
  return [
    ...productsForPages.map(p => ({ id: p.id })),
    // 특정 ID를 직접 추가할 수도 있음
  ];
}

// 메타데이터 생성
export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const product = await getProductData(params.id);

  if (!product) {
    return {
      title: '제품을 찾을 수 없음',
      description: '요청하신 제품 정보를 찾을 수 없습니다.'
    };
  }

  const getName = (nameField: any): string => {
    if (typeof nameField === 'string') return nameField;
    if (nameField && typeof nameField.ko === 'string') return nameField.ko;
    return '제품명 없음'; // Fallback name
  };

  const getDescription = (descField: any): string => {
    if (typeof descField === 'string') return descField;
    if (descField && typeof descField.ko === 'string') return descField.ko;
    return `서한에프앤씨의 ${getName(product.name)} 제품입니다. 뛰어난 품질과 기술력으로 제작된 안전 솔루션입니다.`; // Fallback description 수정
  };

  const productName = getName(product.name);
  const productDescription = getDescription(product.description);

  // SEO 최적화를 위한 메타데이터
  return {
    title: `${productName} | 서한에프앤씨`, // 회사명 수정
    description: productDescription,
    openGraph: {
      title: `${productName} | 서한에프앤씨`, // 회사명 수정
      description: productDescription, // openGraph description도 동일하게 처리
      images: [
        {
          url: `/images/products/${params.id}/${params.id}.jpg`,
          width: 1200,
          height: 630,
          alt: productName // alt에도 처리된 productName 사용
        }
      ],
      type: 'website'
    }
  };
}

/**
 * 제품 상세 페이지 (서버 컴포넌트)
 * 제품 ID를 기반으로 해당 제품의 상세 정보를 표시합니다.
 */
export default async function ProductDetailPage({
  params
}: {
  params: { id: string }
}) {
  // 제품 ID에서 데이터 조회
  const productId = params?.id;
  const product = await getProductData(productId);

  // 제품이 존재하지 않는 경우 404 페이지 표시
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <ProductDetailClient productId={productId} />
    </div>
  );
}
