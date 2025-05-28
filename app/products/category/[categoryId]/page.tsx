import { redirect, notFound } from "next/navigation"
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { findProductsByCategory, getCategoryName } from '@/data/products';
import ProductCategoryClient from './client';

// Read categories from the product data file
async function getCategories() {
  const filePath = path.join(process.cwd(), 'content/data/products/products.json');

  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);

    // 안전성 검사 강화
    if (!data || !data.categories || !Array.isArray(data.categories)) {
      console.warn('categories 데이터가 유효하지 않습니다:', data);
      return [];
    }

    return data.categories.map((cat: any) => cat.id).filter((id: any) => id && typeof id === 'string');
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

/**
 * 정적 빌드를 위한 파라미터 생성
 */
export async function generateStaticParams() {
  return [];
}

// 정적 경로 생성 제거 - 동적 라우팅 사용
// export async function generateStaticParams() {
//   try {
//     // 완전히 하드코딩된 카테고리 목록으로 빌드 에러 방지
//     return [
//       { categoryId: 'safety-equipment' },
//       { categoryId: 'descenders' },
//       { categoryId: 'disinfection-equipment' }
//     ];
//   } catch (error) {
//     console.error('generateStaticParams (category)에서 오류 발생:', error);
//     return [
//       { categoryId: 'safety-equipment' }
//     ];
//   }
// }

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Redirect to the products page with the category as a query parameter
  const resolvedParams = await params;
  const { categoryId } = resolvedParams;
  redirect(`/products?category=${categoryId}`);
}

