import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "완강기 | 완강기 | 서한에프앤씨",
  description: "사람이 화재시 탈출할 수 있는 장비로 완강기는 사용자의 체중에 따라 자동으로 하강 속도가 7.5초에 1m씩 천천히 내려갈 수 있게 하는 특수한 완강기입니다.",
};

/**
 * 완강기 상세 페이지
 * products/descenders/Descending-Life-Line
 */
export default function DescendingLifeLinePage() {
  // 제품 데이터 가져오기
  const product = getProductById("Descending-Life-Line");

  // 제품을 찾지 못한 경우 404 페이지 표시
  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient
      productId="Descending-Life-Line"
      initialProductName={String(product.nameKo || product.name || "완강기")}
      initialDescription={String(product.descriptionKo || product.description || "")}
      mainImage={product.image || "/images/products/Descending-Life-Line/thumbnail.jpg"}
      galleryImagesData={product.gallery_images_data || []}
      videoGalleryData={product.videos || []}
      features={product.features || []}
      documents={product.documents || []}
      specTable={product.specTable}
      approvalNumber="한국소방산업기술원 형식승인품 (완15-1-1)"
      cautions={product.cautions || []}
    />
  );
}