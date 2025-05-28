"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ContentLoader from './content-loader';
import Link from 'next/link';
import { ArrowLeft, Download, ChevronRight } from 'lucide-react';

interface ProductDetailProps {
  id: string;
}

interface DocumentData {
  id: string;
  nameKo: string;
  nameEn: string;
  nameCn?: string;
  path: string;
}

interface ProductData {
  id: string;
  nameKo: string;
  nameEn: string;
  nameCn?: string;
  category: string;
  descriptionKo: string;
  descriptionEn: string;
  descriptionCn?: string;
  image: string;
  documents?: DocumentData[];
  features?: string[];
  specifications?: Record<string, string>;
  relatedProducts?: string[];
  [key: string]: any;
}

interface CategoryData {
  id: string;
  nameKo: string;
  nameEn: string;
  nameCn?: string;
  descriptionKo: string;
  descriptionEn: string;
  descriptionCn?: string;
  image: string;
  products: ProductData[];
}

interface ProductsData {
  categories: CategoryData[];
}

export default function ProductDetail({ id }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      setError(null);

      try {
        // Try to fetch product data from the content data directory
        const response = await fetch('/data/products/products.json');

        if (!response.ok) {
          throw new Error(`Failed to load product data: ${response.statusText}`);
        }

        const data = await response.json() as ProductsData;

        // Find the product in the categories
        let foundProduct: ProductData | null = null;
        let foundCategory: CategoryData | null = null;

        // Loop through categories to find the product
        for (const cat of data.categories) {
          const prod = cat.products.find(p => p.id === id);
          if (prod) {
            foundProduct = prod;
            foundCategory = cat;
            break;
          }
        }

        if (foundProduct && foundCategory) {
          setProduct(foundProduct);
          setCategory(foundCategory);

          // Find related products (other products in the same category)
          const related = foundCategory.products
            .filter(p => p.id !== id)
            .slice(0, 3); // Limit to 3 related products

          setRelatedProducts(related);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        console.error('Error loading product data:', err);
        setError('Failed to load product information. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg w-full h-96"></div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  // Show product info if available
  if (product && category) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-blue-600">
              제품소개
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/products/category/${category.id}`}
              className="hover:text-blue-600"
            >
              {category.nameKo}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{product.nameKo}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-96">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.nameKo}
                  width={600}
                  height={400}
                  className="object-contain max-h-full"
                />
              ) : (
                <div className="text-gray-400">이미지 준비 중</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.nameKo}</h1>
            <h2 className="text-xl text-gray-600 mb-6">{product.nameEn}</h2>

            <div className="prose max-w-none mb-8">
              <p className="text-lg">{product.descriptionKo}</p>
            </div>

            {/* Download section */}
            {product.documents && product.documents.length > 0 && (
              <div className="border-t border-b py-6 my-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">제품 자료 다운로드</h3>
                <div className="space-y-4">
                  {product.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{doc.nameKo}</div>
                        <div className="text-sm text-gray-700">{doc.nameEn}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Inquiry button */}
            <div className="mt-6">
              <Link
                href="/support/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg inline-block transition-colors"
              >
                제품 문의하기
              </Link>
            </div>
          </div>
        </div>
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 제품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/products/${relProduct.id}`}
                  className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-video relative bg-gray-50">
                    {relProduct.image && (
                      <Image
                        src={relProduct.image}
                        alt={relProduct.nameKo}
                        fill
                        className="object-contain p-4"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {relProduct.nameKo}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">{relProduct.nameEn}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Back to products button */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            제품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // Default empty state
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-600">제품 정보를 찾을 수 없습니다</h2>
        <p className="mt-2 text-gray-500">요청하신 제품 정보를 찾을 수 없습니다. 제품 목록에서 다른 제품을 선택해주세요.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          제품 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 