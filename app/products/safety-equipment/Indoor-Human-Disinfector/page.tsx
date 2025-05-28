import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "대인소독기 실내형 | 안전장비 | 서한에프앤씨",
    description: "실내간 이동시 고정 설치하여 사용하는 대인 소독 장비입니다. 출입구에 설치하여 인체와 물품의 소독을 효과적으로 수행합니다.",
};

/**
 * 대인소독기 실내형 상세 페이지
 * products/safety-equipment/Indoor-Human-Disinfector
 */
export default function IndoorHumanDisinfectorPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Indoor-Human-Disinfector");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        // 제품이 products.json에 등록되지 않았을 때를 대비한 하드코딩 정보
        return (
            <ProductDetailClient
                productId="Indoor-Human-Disinfector"
                initialProductName="대인소독기 실내형"
                initialDescription="실내간 이동시 고정 설치하여 사용하는 대인 소독 장비입니다. 출입구에 설치하여 인체와 물품의 소독을 효과적으로 수행합니다."
                mainImage="/images/products/Indoor-Human-Disinfector/thumbnail.jpg"
                galleryImagesData={[]}
                videoGalleryData={[]}
                features={[
                    {
                        "title": "실내 고정식 설계",
                        "description": "실내 공간 사이에 고정 설치하여 사용하는 소독 시스템"
                    },
                    {
                        "title": "정밀 노즐 시스템",
                        "description": "0.15mm 직경의 8개 노즐을 통한 균일한 소독액 분사"
                    },
                    {
                        "title": "조절 가능한 분사량",
                        "description": "사용 환경에 따라 24cc~120cc까지 분사량 조절 가능"
                    },
                    {
                        "title": "효율적인 탱크 용량",
                        "description": "20L 용량의 탱크로 장시간 연속 사용 가능"
                    },
                    {
                        "title": "간편한 유지보수",
                        "description": "손쉬운 소독액 보충 및 필터 교체로 편리한 관리"
                    }
                ]}
                documents={[]}
                specTable={[
                    {
                        "title": "구분",
                        "value": "사양"
                    },
                    {
                        "title": "크기 (mm)",
                        "value": "1500 X 1200 X 1200"
                    },
                    {
                        "title": "노즐",
                        "value": "0.15 (mm) X 8개소"
                    },
                    {
                        "title": "가압펌프",
                        "value": "고압 미스트 발생용 부스터 펌프"
                    },
                    {
                        "title": "분사량 (1회)",
                        "value": "24 cc ~ 120 cc [조절 가능]"
                    },
                    {
                        "title": "탱크용량",
                        "value": "20 리터"
                    }
                ]}
                cautions={[
                    "소독액 교체 시 반드시 전원을 차단하고 작업해야 합니다.",
                    "분사 노즐 막힘 방지를 위해 정기적인 청소가 필요합니다.",
                    "약제는 제조사가 권장하는 적합한 소독제만 사용해야 합니다.",
                    "설치 후 정기적인 유지보수 점검이 필요합니다.",
                    "직접적인 분사가 인체에 닿지 않도록 주의해야 합니다."
                ]}
                additionalSections={[
                    {
                        "title": "적용현장",
                        "content": "실내간 이동시 고정설치가 필요한 현장\n\n지하철 역사내 : 승강장, 환승통로, 출입구 등\n\n광범위한 건물내 구역간 이동 : 쇼핑몰 통로, 대형 건물 연결 통로, 공항 및 터미널 등\n\n유동인구가 많은 실내 공간 : 대형 백화점, 전시장, 콘서트홀 등"
                    }
                ]}
            />
        );
    }

    return (
        <ProductDetailClient
            productId="Indoor-Human-Disinfector"
            initialProductName={String(product.nameKo || product.name || "대인소독기 실내형")}
            initialDescription={String(product.descriptionKo || product.description || "실내간 이동시 고정 설치하여 사용하는 대인 소독 장비입니다. 출입구에 설치하여 인체와 물품의 소독을 효과적으로 수행합니다.")}
            mainImage={product.image || "/images/products/Indoor-Human-Disinfector/thumbnail.jpg"}
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