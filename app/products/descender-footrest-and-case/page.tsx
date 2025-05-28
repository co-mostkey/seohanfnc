import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "완강기 발판 및 케이스 | 피난장비 | 서한에프앤씨",
    description: "피난용 완강기를 효과적으로 사용하기 위한 전용 발판 및 보관 케이스로, 비상 상황에서 신속하고 안전한 피난을 돕는 제품입니다.",
};

/**
 * 완강기 발판 및 케이스 상세 페이지
 * products/descender-footrest-and-case
 */
export default function DescenderFootrestAndCasePage() {
    // 제품 데이터 가져오기 (products.json에 추가된 ID 사용)
    const product = getProductById("descender-footrest-and-case");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="descender-footrest-and-case"
            initialProductName={String(product.nameKo || product.name || "완강기 발판 및 케이스")}
            initialDescription={String(product.descriptionKo || product.description || "")}
            mainImage={product.image || "/images/products/descender-footrest-and-case/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber="KCL발판시험성적서"
            cautions={product.cautions || []}
        />
    );
} 