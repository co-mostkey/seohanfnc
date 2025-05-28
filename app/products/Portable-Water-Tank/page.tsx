import { Metadata } from "next";
import { getProductById } from "@/data/products";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "이동식 수조 | 안전장비 | 서한에프앤씨",
    description: "긴급 용수, 산불 화재 진압, 재난 대비 등 산업, 재난의 현장에서 필요한 용수를 저장할 수 있도록 이동식으로 제작된 장비입니다.",
};

/**
 * 이동식 수조 상세 페이지
 * products/Portable-Water-Tank
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
                initialDescription="긴급 용수, 산불 화재 진압, 재난 대비 등 산업, 재난의 현장에서 필요한 용수를 저장할 수 있도록 이동식으로 제작된 장비입니다."
                mainImage="/images/products/Portable-Water-Tank/main/thumbnail.jpg"
                galleryImagesData={[]}
                videoGalleryData={[]}
                features={[
                    {
                        "title": "자가 성형 시스템",
                        "description": "물을 공급하면 스스로 성형되는 수조입니다."
                    },
                    {
                        "title": "고품질 PVC 소재",
                        "description": "방수 성능을 지닌 PVC 재질로 제작되었습니다."
                    },
                    {
                        "title": "휴대성 강화",
                        "description": "하부에는 이동이 용이하도록 손잡이가 부착되어 있습니다."
                    },
                    {
                        "title": "이물질 유입 방지",
                        "description": "이물질 등의 유입을 방지하기 위하여 덮개가 있으며, 밴드가 부착되어 덮개의 이탈을 방지합니다."
                    },
                    {
                        "title": "신속한 용수 공급",
                        "description": "용수 공급을 위한 브라켓(40A, 65A 등 소방호스 연결구)이 부착되어 빠른 용수 공급이 가능합니다."
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
                        "title": "저장용량",
                        "SH_MWT_3000": "3,000 리터",
                        "SH_MWT_5000": "5,000 리터",
                        "SH_MWT_10000": "10,000 리터"
                    },
                    {
                        "title": "바닥직경",
                        "SH_MWT_3000": "2.9 (m)",
                        "SH_MWT_5000": "3.6 (m)",
                        "SH_MWT_10000": "4.6 (m)"
                    },
                    {
                        "title": "상부직경",
                        "SH_MWT_3000": "2.1 (m)",
                        "SH_MWT_5000": "2.7 (m)",
                        "SH_MWT_10000": "3.4 (m)"
                    },
                    {
                        "title": "수조높이",
                        "SH_MWT_3000": "0.8 (m)",
                        "SH_MWT_5000": "0.8 (m)",
                        "SH_MWT_10000": "0.8 (m)"
                    },
                    {
                        "title": "보관규격",
                        "SH_MWT_3000": "800X800X400(mm)",
                        "SH_MWT_5000": "1000X800X400(mm)",
                        "SH_MWT_10000": "1100X800X500(mm)"
                    },
                    {
                        "title": "수조중량",
                        "SH_MWT_3000": "30 kg 이하",
                        "SH_MWT_5000": "40 kg 이하",
                        "SH_MWT_10000": "50 kg 이하"
                    }
                ]}
                cautions={[
                    "사용 시 요철이 있는 곳을 피하여 설치하세요.",
                    "물을 공급하기 전 수조의 바닥면을 확인하고 날카로운 물체를 제거하세요.",
                    "덮개 사용 시 밴드를 적절하게 조여 이탈을 방지하세요.",
                    "사용 후 깨끗이 세척하고 완전히 건조시킨 후 보관하세요.",
                    "보관시 접힌 상태로 보관하여 보관 공간을 최소화하세요."
                ]}
                additionalSections={[
                    {
                        "title": "적용현장",
                        "content": "재난 현장 용수 공급\\n\\n산불 진화 및 재난 대응\\n\\n건설 현장 임시 용수 저장\\n\\n농업용 임시 저수조\\n\\n긴급 상황 시 임시 식수 저장\\n\\n군사용 임시 용수 저장"
                    }
                ]}
            />
        );
    }

    return (
        <ProductDetailClient
            productId="Portable-Water-Tank"
            initialProductName={String(product.nameKo || product.name || "이동식 수조")}
            initialDescription={String(product.descriptionKo || product.description || "긴급 용수, 산불 화재 진압, 재난 대비 등 산업, 재난의 현장에서 필요한 용수를 저장할 수 있도록 이동식으로 제작된 장비입니다.")}
            mainImage={product.image || "/images/products/Portable-Water-Tank/main/thumbnail.jpg"}
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