import { Metadata } from "next";
import fs from 'fs/promises';
import path from 'path';
import ClientComponent from "./client";

export const metadata: Metadata = {
    title: "인명구조 매트 | 안전장비 | 서한에프앤씨",
    description: "비상 상황 인명구조를 위한 특수 제작 매트 상세페이지입니다.",
};

/**
 * 인명구조 매트 상세페이지 (정규 커스텀 구조)
 * /products/Lifesaving-Mat
 */
export default async function LifesavingMatPage() {
    const filePath = path.join(process.cwd(), 'content/data/products/products.json');
    const json = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(json);
    const product = data.categories.find((c: any) => c.id === 'b-type').products.find((p: any) => p.id === 'Lifesaving-Mat');
    return <ClientComponent product={product} />;
} 