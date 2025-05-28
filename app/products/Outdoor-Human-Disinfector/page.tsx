import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "대인소독기 실외형 | 안전장비 | 서한에프앤씨",
    description: "코로나19 바이러스 등 세균 감염 예방을 위한 실외형 대인소독기로, 인체에 해롭지 않은 친환경 소독액을 미세 안개 분사하여 바이러스를 제거합니다. 약제 소독 → 출입 → 자동 손소독의 3단계 보안 프로세스를 제공합니다.",
};

/**
 * 대인소독기 실외형 상세 페이지
 * products/Outdoor-Human-Disinfector
 */
export default function OutdoorHumanDisinfectorPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Outdoor-Human-Disinfector");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Outdoor-Human-Disinfector"
            initialProductName={String(product.nameKo || product.name || "대인소독기 실외형")}
            initialDescription={String(product.descriptionKo || product.description || "코로나19 바이러스 등 세균 감염 예방을 위한 실외형 대인소독기로, 인체에 해롭지 않은 친환경 소독액을 미세 안개 분사하여 바이러스를 제거합니다. 약제 소독 → 출입 → 자동 손소독의 3단계 보안 프로세스를 제공합니다.")}
            mainImage={product.image || "/images/products/Outdoor-Human-Disinfector/main/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            cautions={product.cautions || []}
            additionalSections={product.additionalSections || []}
        />
    );
} 