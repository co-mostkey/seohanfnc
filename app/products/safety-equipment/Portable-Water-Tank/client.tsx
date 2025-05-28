'use client';

import { ProductDetailClientProps } from "@/types/component-props";
import ProductDetailClient from "../../Vehicle-Disinfector/client";

/**
 * 이동식 수조 제품 상세 페이지 클라이언트 컴포넌트
 * Vehicle-Disinfector/client.tsx를 재사용하여 일관된 UI 제공
 */
export default function PortableWaterTankClient(props: ProductDetailClientProps) {
    // 차량소독기 client 컴포넌트를 재사용하여 일관된 보라색 테마의 UI 제공
    return <ProductDetailClient {...props} />;
} 