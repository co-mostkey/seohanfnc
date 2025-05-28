import { Metadata } from "next";
import productsDataJson from "@/content/data/products/products.json";
import { Product } from "@/types/product";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

interface ProductsJsonStructure {
    categories: Array<{
        id: string;
        nameKo?: string;
        nameEn?: string;
        products: Product[];
        // 기타 카테고리 정보
    }>;
}

const fullProductsData = productsDataJson as unknown as ProductsJsonStructure;

// getProductById 함수를 page.tsx 내에 간소화하여 정의 (data/products.ts의 것과 유사하게)
function getProductSummaryById(id: string): Product | undefined {
    for (const category of fullProductsData.categories) {
        const found = category.products.find(p => p.id === id);
        if (found) {
            return { ...found, productCategoryId: category.id };
        }
    }
    return undefined;
}

export async function generateMetadata(): Promise<Metadata> {
    const productSummary = getProductSummaryById("descender-hanger-summary");

    if (!productSummary) {
        return {
            title: "제품을 찾을 수 없습니다.",
            description: "요청하신 제품 정보를 찾을 수 없습니다.",
        };
    }
    return {
        title: `${productSummary.nameKo || productSummary.nameEn || '완강기 지지대'} - 서한에프앤씨`,
        description: productSummary.descriptionKo || productSummary.descriptionEn || '다양한 완강기 지지대 제품들을 확인해보세요.',
    };
}

export default function DescenderHangerSummaryPage() {
    const productSummary = getProductSummaryById("descender-hanger-summary");
    let hangerCategoryProducts: Product[] = [];

    const hangersCategory = fullProductsData.categories.find(cat => cat.id === "descender-hangers");
    if (hangersCategory && hangersCategory.products) {
        hangerCategoryProducts = hangersCategory.products.map(p => ({ ...p, productCategoryId: hangersCategory.id }));
    }

    if (!productSummary) {
        notFound();
    }

    return (
        <ProductDetailClient
            productId={productSummary.id}
            initialProductName={String(productSummary.nameKo || productSummary.nameEn || "완강기 지지대")}
            initialDescription={String(productSummary.descriptionKo || productSummary.descriptionEn || "설치 환경과 필요에 맞는 다양한 완강기 지지대를 확인하세요.")}
            mainImage={productSummary.image} // 요약 페이지 대표 이미지
            allProducts={hangerCategoryProducts} // 'descender-hangers' 카테고리 제품 목록만 전달
            galleryImagesData={[]} // 빈 배열로 초기화
            videoGalleryData={[]} // 빈 배열로 초기화
        // approvalNumber, cautions 등은 productSummary에서 필요시 전달
        />
    );
} 