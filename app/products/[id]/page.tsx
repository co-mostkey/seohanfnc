import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductDetailClient } from './page-client';
import ProductDetailFrameLayout from '@/components/layouts/ProductDetailFrameLayout';
import { getProductById, getAllProducts, getCategoryName, findProductsByCategory } from '@/data/products';
import { Product } from '@/types/product';
import { ProductVisualExceptions } from '@/types/config'; // 추가
import visualExceptionsData from '@/config/product-visual-exceptions.json'; // JSON 파일 직접 import

// 제품 데이터 가져오기 함수
async function getProductData(productId: string): Promise<Product | null> {
  try {
    // 제품 ID를 사용하여 제품 데이터 조회
    const product = getProductById(productId);

    // 제품이 존재하지 않거나 공개되지 않은 경우 null 반환
    if (!product || product.isPublished === false) {
      return null;
    }

    return product;
  } catch (error) {
    console.error('제품 데이터 로드 오류:', error);
    return null;
  }
}

// 정적 경로 생성 제거 - 동적 라우팅 사용
// export async function generateStaticParams() {
//   try {
//     // 완전히 하드코딩된 제품 ID 목록으로 빌드 에러 방지
//     return [
//       { id: 'Cylinder-Type-SafetyAirMat' },
//       { id: 'Fan-Type-Air-Safety-Mat' },
//       { id: 'Lifesaving-Mat' },
//       { id: 'Air-Slide' },
//       { id: 'Descending-Life-Line' },
//       { id: 'Handy-Descending-Life-Line' },
//       { id: 'descender-hanger-summary' }
//     ];
//   } catch (error) {
//     console.error('generateStaticParams에서 오류 발생:', error);
//     // 최소한의 안전한 기본값 반환
//     return [
//       { id: 'Cylinder-Type-SafetyAirMat' }
//     ];
//   }
// }

// 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let title = '제품 정보';
  let description = '서한에프앤씨의 제품 정보를 확인하세요.';
  let imageUrl: string | undefined = undefined;

  if (id === 'descender-hanger-summary') {
    title = '완강기 지지대 전체보기';
    description = '다양한 완강기 지지대 제품을 확인하세요.';
    // imageUrl = "/images/category/descender-supports-category.jpg"; // 필요시 설정
  } else {
    const product = getProductById(id);
    if (product) { // product가 유효한 객체일 때만 내부 속성에 접근
      // title 설정
      if (typeof product.name === 'string') {
        title = product.name;
      } else if (product.name && typeof (product.name as any).ko === 'string') {
        title = (product.name as any).ko;
      } else if (product.nameKo) { // nameKo 필드가 별도로 있다면 우선 사용
        title = product.nameKo;
      } else {
        title = String(product.name || '제품명 없음'); // 최후의 fallback
      }

      // description 설정 (유사한 방식으로)
      if (typeof product.description === 'string') {
        description = product.description;
      } else if (product.description && typeof (product.description as any).ko === 'string') {
        description = (product.description as any).ko;
      } else if (product.descriptionKo) {
        description = product.descriptionKo;
      } else {
        description = String(product.description || '상세 설명 없음');
      }
      imageUrl = product.image;
    }
    // 만약 product가 undefined여도, title과 description은 기본값을 사용하게 됨
  }
  return {
    title: `${title} | SEOHAN`,
    description: description,
    openGraph: { images: imageUrl ? [imageUrl] : [] },
  };
}

// 제품 상세 페이지 (서버 컴포넌트)
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = await params;
  const visualExceptions: ProductVisualExceptions = visualExceptionsData;

  const product = await getProductData(productId);
  if (!product) {
    notFound();
  }
  const initialRelatedProducts: Product[] = product.relatedProducts
    ? product.relatedProducts.map((id: string) => getProductById(id)).filter(Boolean) as Product[]
    : [];
  const categoryName = product.category ? getCategoryName(product.category, 'ko') : '기타';

  return (
    <ProductDetailFrameLayout>
      <ProductDetailClient
        productId={productId} // 현재 ID 전달
        product={product}
        initialRelatedProducts={initialRelatedProducts}
        categoryName={categoryName}
        visualExceptions={visualExceptions} // 예외 데이터 전달
      />
    </ProductDetailFrameLayout>
  );
}
