import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "수직강하식 구조대 | 인명구조장비 | 서한에프앤씨",
    description: "화재시 또는 재난상황 발생시 이동설치가 가능한 구조로 가볍고 신속한 설치가 가능한 구조의 인명구조 장비입니다.",
};

/**
 * 수직강하식 구조대 상세 페이지
 * products/Vertical-Rescue-Equipment
 */
export default function VerticalRescueEquipmentPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Vertical-Rescue-Equipment");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Vertical-Rescue-Equipment"
            initialProductName={String(product.nameKo || product.name || "수직강하식 구조대")}
            initialDescription={String(product.descriptionKo || product.description || "화재시 또는 재난상황 발생시 이동설치가 가능한 구조로 가볍고 신속한 설치가 가능한 구조의 인명구조 장비입니다.")}
            mainImage={product.image || "/images/products/Vertical-Rescue-Equipment/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber="한국소방산업기술원 형식승인품 (형식승인번호 : 구23-3)"
            cautions={product.cautions || []}
        />
    );
}