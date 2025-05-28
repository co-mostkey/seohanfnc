import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "고체 에어로졸 소화기 | 소방안전장비 | 서한에프앤씨",
    description: "SAFE-g는 세계 최초의 기계식 무화약 점화 장치를 이용한 고체 에어로졸 소화기로 무인 상태에서도 화재를 자동으로 감지하여 소화 시킴으로써, 화재의 확산을 막고, 화학반응을 통한 소화 원리로 화재 진압으로 인한 중요설비, 기록물, 문화재 등의 2차 훼손없는 보존을 위한 제품입니다.",
};

/**
 * 고체 에어로졸 소화기 상세 페이지
 * products/Solid-Aerosol-Extinguisher
 */
export default function SolidAerosolExtinguisherPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Solid-Aerosol-Extinguisher");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Solid-Aerosol-Extinguisher"
            initialProductName={String(product.nameKo || product.name || "고체 에어로졸 소화기")}
            initialDescription={String(product.descriptionKo || product.description || "SAFE-g는 세계 최초의 기계식 무화약 점화 장치를 이용한 고체 에어로졸 소화기로 무인 상태에서도 화재를 자동으로 감지하여 소화 시킴으로써, 화재의 확산을 막고, 화학반응을 통한 소화 원리로 화재 진압으로 인한 중요설비, 기록물, 문화재 등의 2차 훼손없는 보존을 위한 제품입니다.")}
            mainImage={product.image || "/images/products/Solid-Aerosol-Extinguisher/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber={product.approvalNumber ? `형식승인번호 : ${product.approvalNumber}` : "형식승인번호 : 소공 13-1"}
            cautions={product.cautions || []}
            additionalSections={product.additionalSections || []}
        />
    );
} 