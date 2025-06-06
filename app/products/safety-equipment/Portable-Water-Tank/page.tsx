import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "이동식 수조 | 안전장비 | 서한에프앤씨",
    description: "긴급 용수, 산불 화재 진압, 재난 대비용 저장 장비로 사용되는 이동식 수조입니다. 세 가지 모델(3,000/5,000/10,000 리터)로 제공되며, 빠른 설치와 이동이 가능합니다.",
};

/**
 * 이동식 수조 상세 페이지
 * products/b-type/Portable-Water-Tank
 */
export default function PortableWaterTankPage() {
    // 제품 데이터 가져오기
    const product = getProductById("Portable-Water-Tank");

    // 제품을 찾지 못한 경우 404 페이지 표시
    if (!product) {
        // 제품이 products.json에 등록되지 않았을 때를 대비한 하드코딩 정보
        return (
            <ProductDetailClient
                productId="Portable-Water-Tank"
                initialProductName="이동식 수조"
                initialDescription="긴급 용수, 산불 화재 진압, 재난 대비용 저장 장비로 사용되는 이동식 수조입니다. 세 가지 모델(3,000/5,000/10,000 리터)로 제공되며, 빠른 설치와 이동이 가능합니다."
                mainImage="/images/products/Portable-Water-Tank/thumbnail.jpg"
                galleryImagesData={[]}
                videoGalleryData={[]}
                features={[
                    {
                        "title": "다양한 용량 옵션",
                        "description": "3,000L, 5,000L, 10,000L 세 가지 모델로 상황에 맞게 선택 가능"
                    },
                    {
                        "title": "신속한 설치",
                        "description": "2-4인 기준 10-30분 내 설치 완료 가능한 간편한 구조"
                    },
                    {
                        "title": "내구성 있는 소재",
                        "description": "고강도 방수 타포린 소재로 제작되어 반복 사용 가능"
                    },
                    {
                        "title": "이동 편의성",
                        "description": "접이식 구조로 운반 및 보관이 용이함"
                    },
                    {
                        "title": "다목적 활용",
                        "description": "소방, 재난대비, 농업용수, 산업용 임시저장 등 다양한 용도로 활용 가능"
                    }
                ]}
                documents={[]}
                specTable={[
                    {
                        "title": "구분",
                        "SH_MWT_3000": "SH-MWT-3000",
                        "SH_MWT_5000": "SH-MWT-5000",
                        "SH_MWT_10000": "SH-MWT-10000"
                    },
                    {
                        "title": "저장용량(L)",
                        "SH_MWT_3000": "3,000 리터",
                        "SH_MWT_5000": "5,000 리터",
                        "SH_MWT_10000": "10,000 리터"
                    },
                    {
                        "title": "크기(접었을때)",
                        "SH_MWT_3000": "600 × 500 × 300 mm",
                        "SH_MWT_5000": "700 × 600 × 300 mm",
                        "SH_MWT_10000": "900 × 700 × 400 mm"
                    },
                    {
                        "title": "크기(펼쳤을때)",
                        "SH_MWT_3000": "2,000 × 2,000 × 800 mm",
                        "SH_MWT_5000": "2,500 × 2,500 × 850 mm",
                        "SH_MWT_10000": "3,300 × 3,300 × 1,000 mm"
                    },
                    {
                        "title": "무게",
                        "SH_MWT_3000": "15 kg",
                        "SH_MWT_5000": "20 kg",
                        "SH_MWT_10000": "32 kg"
                    },
                    {
                        "title": "재질",
                        "SH_MWT_3000": "고강도 방수 타포린",
                        "SH_MWT_5000": "고강도 방수 타포린",
                        "SH_MWT_10000": "고강도 방수 타포린"
                    },
                    {
                        "title": "설치 소요시간",
                        "SH_MWT_3000": "10분 (2인 기준)",
                        "SH_MWT_5000": "15분 (3인 기준)",
                        "SH_MWT_10000": "30분 (4인 기준)"
                    },
                    {
                        "title": "입·출수구",
                        "SH_MWT_3000": "3인치×1개",
                        "SH_MWT_5000": "3인치×2개",
                        "SH_MWT_10000": "3인치×2개, 4인치×1개"
                    }
                ]}
                cautions={[
                    "설치 전 바닥에 날카로운 물체나 돌이 없는지 확인하십시오.",
                    "수조에 물을 채울 때 최대 용량을 초과하지 마십시오.",
                    "접을 때 완전히 물기를 제거하고 건조 후 보관하십시오.",
                    "겨울철 영하의 온도에서는 얼음 형성으로 인한 손상이 발생할 수 있으니 주의하십시오.",
                    "정기적으로 손상 여부를 점검하여 누수를 예방하십시오."
                ]}
                additionalSections={[
                    {
                        "title": "적용현장",
                        "content": "다양한 긴급 상황에서 활용 가능\n\n산불 진화 : 산악지역 등 수원이 없는 지역에서 임시 저수조로 활용\n\n자연재해 대응 : 홍수, 가뭄 등 재난 상황에서 긴급 용수 저장\n\n농업용 관개시설 : 임시 관개용 물 저장 시설로 활용\n\n건설현장 : 콘크리트 작업 등 산업용 용수 저장\n\n캠핑 및 이벤트 : 대규모 야외 행사 또는 캠핑장에서 용수 저장"
                    }
                ]}
            />
        );
    }

    return (
        <ProductDetailClient
            productId="Portable-Water-Tank"
            initialProductName={String(product.nameKo || product.name || "이동식 수조")}
            initialDescription={String(product.descriptionKo || product.description || "긴급 용수, 산불 화재 진압, 재난 대비용 저장 장비로 사용되는 이동식 수조입니다. 세 가지 모델(3,000/5,000/10,000 리터)로 제공되며, 빠른 설치와 이동이 가능합니다.")}
            mainImage={product.image || "/images/products/Portable-Water-Tank/thumbnail.jpg"}
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