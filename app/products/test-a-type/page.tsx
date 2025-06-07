import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "테스트 A타입 | 서한에프앤씨",
    description: "테스트용 A타입 제품입니다.",
};

/**
 * 테스트 A타입 상세 페이지
 * products/test-a-type
 */
export default function TestATypePage() {
    // 제품 데이터 가져오기
    const product = getProductById("test-a-type");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="test-a-type"
            initialProductName={String(product.nameKo || product.name || "테스트 A타입")}
            initialDescription={String(product.descriptionKo || product.description || "테스트용 A타입 제품입니다.")}
            mainImage={product.image || "/images/products/test-a-type/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber={product.approvalNumber ? `형식승인번호 : ${product.approvalNumber}` : "형식승인번호 : -"}
            cautions={product.cautions || []}
        />
    );
}