import { Metadata } from "next";
import { getProductById } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./client";

export const metadata: Metadata = {
    title: "테스트 B타입 고급 제품 | 서한에프앤씨",
    description: "A타입 수준 디자인과 3D 모델링이 통합된 고급 B타입 제품입니다.",
};

/**
 * 테스트 B타입 고급 제품 상세 페이지 (B타입 고급 버전)
 * products/test-b-type-advanced
 */
export default function TestBTypeAdvancedPage() {
    const product = getProductById("test-b-type-advanced");

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
} 