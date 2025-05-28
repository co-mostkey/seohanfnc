import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "차량소독기 실외형 | 안전장비 | 서한에프앤씨",
    description: "인체에 심각한 위협을 가하는 바이러스로 인해 부지불식간에 전염될 수 있는 환경에서 안전하게 이동 차량들을 소독하기 위하여, 상황에 맞는 소독액을 분사할 수 있는 차량소독소 장비입니다. 고압 미스트 방식으로 광범위하게 분사하여, 차량 전체를 효율적으로 소독을 할 수 있습니다.",
};

/**
 * 차량소독기 실외형 상세 페이지
 * products/safety-equipment/Vehicle-Disinfector
 */
export default function VehicleDisinfectorPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Vehicle-Disinfector");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        // 제품이 products.json에 등록되지 않았을 때를 대비한 하드코딩 정보
        return (
            <ProductDetailClient
                productId="Vehicle-Disinfector"
                initialProductName="차량소독기 실외형"
                initialDescription="인체에 심각한 위협을 가하는 바이러스로 인해 부지불식간에 전염될 수 있는 환경에서 안전하게 이동 차량들을 소독하기 위하여, 상황에 맞는 소독액을 분사할 수 있는 차량소독소 장비입니다. 고압 미스트 방식으로 광범위하게 분사하여, 차량 전체를 효율적으로 소독을 할 수 있습니다."
                mainImage="/images/products/Vehicle-Disinfector/thumbnail.jpg"
                galleryImagesData={[]}
                videoGalleryData={[]}
                features={[
                    {
                        "title": "이동형 실외 설치",
                        "description": "현장 상황에 맞게 이동 및 설치가 가능한 실외형 소독 시스템입니다."
                    },
                    {
                        "title": "고압 미스트 분사 방식",
                        "description": "고압 미스트 방식으로 광범위하게 분사하여 차량 전체를 효율적으로 소독합니다."
                    },
                    {
                        "title": "맞춤형 규격 제작",
                        "description": "현장에 따라 외형 크기 변경이 가능한 맞춤형 제작 방식으로 제공됩니다."
                    },
                    {
                        "title": "다양한 약제탱크 용량",
                        "description": "3,000 ~ 10,000 리터 사이로 약제탱크 용량을 선택할 수 있습니다."
                    },
                    {
                        "title": "특허 출원 기술",
                        "description": "특허 출원 중인 고효율 소독 기술을 적용한 검증된 시스템입니다."
                    }
                ]}
                documents={[]}
                specTable={[
                    {
                        "title": "구분",
                        "value": "사양"
                    },
                    {
                        "title": "외형 (mm)",
                        "value": "4000 X 6000 X 3200 [현장에 따라 크기 변경 가능]"
                    },
                    {
                        "title": "노즐",
                        "value": "0.2 (mm) X 32개소"
                    },
                    {
                        "title": "가압펌프",
                        "value": "고압 부스터 펌프 (SHP-300)"
                    },
                    {
                        "title": "분사량 (1회)",
                        "value": "250 cc ~ 1000 cc [조절 가능]"
                    },
                    {
                        "title": "약제탱크 용량",
                        "value": "3,000 ~ 10,000 리터 [선택 가능]"
                    }
                ]}
                cautions={[
                    "소독액 교체 시 반드시 전원을 차단하고 작업해야 합니다.",
                    "분사 노즐 막힘 방지를 위해 정기적인 청소가 필요합니다.",
                    "약제는 제조사가 권장하는 적합한 소독제만 사용해야 합니다.",
                    "설치 후 정기적인 유지보수 점검이 필요합니다.",
                    "고압 분사 시 주변에 사람이 없는지 확인 후 가동해야 합니다."
                ]}
                additionalSections={[
                    {
                        "title": "적용현장",
                        "content": "차량 소독이 필요한 실외 환경\n\n물류센터 출입구 : 입출고 차량 소독\n\n농장/축산시설 : 출입 차량 방역\n\n공항/항만 시설 : 수출입 물류 방역\n\n대형 공장 : 생산 물품 운송 차량 소독\n\n긴급 방역 상황 : 바이러스 확산 방지를 위한 이동형 방역"
                    }
                ]}
            />
        );
    }

    return (
        <ProductDetailClient
            productId="Vehicle-Disinfector"
            initialProductName={String(product.nameKo || product.name || "차량소독기 실외형")}
            initialDescription={String(product.descriptionKo || product.description || "인체에 심각한 위협을 가하는 바이러스로 인해 부지불식간에 전염될 수 있는 환경에서 안전하게 이동 차량들을 소독하기 위하여, 상황에 맞는 소독액을 분사할 수 있는 차량소독소 장비입니다. 고압 미스트 방식으로 광범위하게 분사하여, 차량 전체를 효율적으로 소독을 할 수 있습니다.")}
            mainImage={product.image || "/images/products/Vehicle-Disinfector/thumbnail.jpg"}
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