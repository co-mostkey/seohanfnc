import { notFound } from 'next/navigation';
import { getSafetyEquipmentById } from '@/content/data/b-type';
import SafetyEquipmentLayout from '@/components/layouts/SafetyEquipmentLayout';
import { Metadata } from 'next';
import SafetyEquipmentDetailClient from './client';

interface SafetyEquipmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 안전장비 상세 페이지의 메타데이터 생성
 */
export async function generateMetadata({ params }: SafetyEquipmentPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getSafetyEquipmentById(id);

  if (!product) {
    return {
      title: '제품을 찾을 수 없음',
      description: '요청하신 안전장비 제품을 찾을 수 없습니다.'
    };
  }

  return {
    title: `${product.nameKo} | 서한에프앤씨 안전장비`,
    description: product.description,
    openGraph: {
      title: `${product.nameKo} | 서한에프앤씨 안전장비`,
      description: product.description,
      images: [product.thumbnail]
    }
  };
}

/**
 * 안전장비 상세 페이지 컴포넌트
 * 
 * 서버 컴포넌트로서 제품 데이터를 가져와 클라이언트 컴포넌트에 전달합니다.
 */
export default async function SafetyEquipmentPage({ params }: SafetyEquipmentPageProps) {
  const { id } = await params;
  const product = getSafetyEquipmentById(id);

  if (!product) {
    notFound();
  }

  // 불필요한 외부 div 레이어 제거
  return (
    <SafetyEquipmentLayout>
      <SafetyEquipmentDetailClient product={product} />
    </SafetyEquipmentLayout>
  );
}
