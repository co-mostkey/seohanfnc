'use client';

import { ProductDetailClientProps } from "@/types/component-props";
import ProductDetailClient from "../../Vehicle-Disinfector/client";

/**
 * 대인소독기 실내형 제품 상세 페이지 클라이언트 컴포넌트
 * Vehicle-Disinfector/client.tsx를 재사용하므로 이 파일은 간단하게 구성합니다.
 */
export default function IndoorHumanDisinfectorClient(props: ProductDetailClientProps) {
    // 차량소독기 client 컴포넌트를 재사용하여 일관된 UI 제공
    // 팔레트는 보라색(purple) 계열 사용
    return <ProductDetailClient {...props} />;
} 