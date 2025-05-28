import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "대인소독기 실내형 | 안전장비 | 서한에프앤씨",
    description: "인체에 심각한 위협을 가하는 바이러스로 인해 부지불식간에 전염될 수 있는 환경에서 안전하게 보행자들을 지켜내기 위하여, 상황에 맞는 소독액을 분사할 수 있는 대인소독소 장비입니다. 실내 공간 이동시 적용되는 소독장비로 미스트 방식으로 분사되어 광범위하게 효율적으로 소독을 할 수 있습니다.",
};

/**
 * 대인소독기 실내형 상세 페이지
 * products/Indoor-Human-Disinfector
 */
export default function IndoorHumanDisinfectorPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Indoor-Human-Disinfector");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Indoor-Human-Disinfector"
            initialProductName={String(product.nameKo || product.name || "대인소독기 실내형")}
            initialDescription={String(product.descriptionKo || product.description || "인체에 심각한 위협을 가하는 바이러스로 인해 부지불식간에 전염될 수 있는 환경에서 안전하게 보행자들을 지켜내기 위하여, 상황에 맞는 소독액을 분사할 수 있는 대인소독소 장비입니다. 실내 공간 이동시 적용되는 소독장비로 미스트 방식으로 분사되어 광범위하게 효율적으로 소독을 할 수 있습니다.")}
            mainImage={product.image || "/images/products/Indoor-Human-Disinfector/main/thumbnail.jpg"}
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