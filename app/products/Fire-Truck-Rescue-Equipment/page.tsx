import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "소방차용 구조대 | 인명구조장비 | 서한에프앤씨",
    description: "화재시 또는 재난상황 발생시 출동 소방차의 사다리 바스켓에 설치하여 사용하는 구조대로 수직으로 펼쳐지는 자루형태의 포지 내에 나선형의 활강포가 구성되어 짧은 시간에 많은 인원이 탈출 할 수 있는 구조 장비입니다.",
};

/**
 * 소방차용 구조대 상세 페이지
 * products/Fire-Truck-Rescue-Equipment
 */
export default function FireTruckRescueEquipmentPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Fire-Truck-Rescue-Equipment");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId="Fire-Truck-Rescue-Equipment"
            initialProductName={String(product.nameKo || product.name || "소방차용 구조대")}
            initialDescription={String(product.descriptionKo || product.description || "화재시 또는 재난상황 발생시 출동 소방차의 사다리 바스켓에 설치하여 사용하는 구조대로 수직으로 펼쳐지는 자루형태의 포지 내에 나선형의 활강포가 구성되어 짧은 시간에 많은 인원이 탈출 할 수 있는 구조 장비입니다.")}
            mainImage={product.image || "/images/products/Fire-Truck-Rescue-Equipment/thumbnail.jpg"}
            galleryImagesData={product.gallery_images_data || []}
            videoGalleryData={product.videos || []}
            features={product.features || []}
            documents={product.documents || []}
            specTable={product.specTable}
            approvalNumber={product.approvalNumber ? `형식승인번호 : ${product.approvalNumber}` : ""}
            cautions={product.cautions || []}
        />
    );
} 