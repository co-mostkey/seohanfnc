import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "간이완강기 | 완강기 | 서한에프앤씨",
  description: "간편한 1회용 완강기로 긴급 상황 시 빠르게 탈출하기 위한 직관적인 사용법과 컴팩트한 디자인의 피난 기구입니다.",
};

/**
 * 간이완강기 상세 페이지
 * products/descenders/Handy-Descending-Life-Line
 */
export default function HandyDescendingLifeLinePage() {
  // 제품 데이터 가져오기
  const product = getProductById("Handy-Descending-Life-Line");

  // 제품을 찾지 못한 경우 404 페이지 표시
  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient
      productId="Handy-Descending-Life-Line"
      initialProductName={String(product.nameKo || product.name || "간이완강기")}
      initialDescription={String(product.descriptionKo || product.description || "")}
      mainImage={product.image || "/images/products/Handy-Descending-Life-Line/thumbnail.jpg"}
      galleryImagesData={product.gallery_images_data || []}
      videoGalleryData={product.videos || []}
      features={product.features || []}
      documents={product.documents || []}
      specTable={product.specTable}
      approvalNumber="한국소방산업기술원 형식승인품 (간완15-1-2)"
      cautions={product.cautions || []}
    />
  );
}