import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "에어슬라이드 | 안전장비 | 서한에프앤씨",
    description: "고압으로 압축된 에어를 사용하여, 순간적으로 에어가 주입되어 피난층에서 지상까지 이르는 미끄럼틀이 형성되는 장비입니다.",
};

/**
 * 에어슬라이드 상세 페이지
 * products/b-type/Air-Slide
 */
export default function AirSlidePage() {
    // 제품 데이터 가져오기
    const product = getProductById("Air-Slide");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Air-Slide"
            initialProductName={String(product.nameKo || product.name || "에어슬라이드")}
            initialDescription={String(product.descriptionKo || product.description || "")}
            mainImage={product.image || "/images/products/Air-Slide/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber="한국소방산업기술원 형식승인품 (제품 승인 번호 : 19-4-1)"
            cautions={product.cautions || []}
        />
    );
}