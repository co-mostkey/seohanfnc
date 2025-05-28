import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "경사강하식 구조대 | 인명구조장비 | 서한에프앤씨",
    description: "화재시 또는 재난상황 발생시 자루 형태의 포지를 이용하여 45도 각도의 경사면을 만들어 미끄럼 타듯 내려가는 구조로, 짧은 시간에 많은 인원이 탈출 할 수 있는 구조 장비입니다.",
};

/**
 * 경사강하식 구조대 상세 페이지
 * products/safety-equipment/Sloping-Rescue-Chute
 */
export default function SlopingRescueChutePage() {
    // 제품 데이터 가져오기
    const product = getProductById("Sloping-Rescue-Chute");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Sloping-Rescue-Chute"
            initialProductName={String(product.nameKo || product.name || "경사강하식 구조대")}
            initialDescription={String(product.descriptionKo || product.description || "화재시 또는 재난상황 발생시 자루 형태의 포지를 이용하여 45도 각도의 경사면을 만들어 미끄럼 타듯 내려가는 구조로, 짧은 시간에 많은 인원이 탈출 할 수 있는 구조 장비입니다.")}
            mainImage={product.image || "/images/products/Sloping-Rescue-Chute/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber={product.approvalNumber ? `형식승인번호 : ${product.approvalNumber}` : "형식승인번호 : 구 04-2-1"}
            cautions={product.cautions || []}
        />
    );
}