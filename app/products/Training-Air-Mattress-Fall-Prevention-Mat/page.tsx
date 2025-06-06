import { Metadata } from "next";
import fs from 'fs/promises';
import path from 'path';
import ClientComponent from "./client";

export const metadata: Metadata = {
    title: "훈련용 에어매트(추락방지매트) | 안전장비 | 서한에프앤씨",
    description: "훈련 및 추락 방지를 위한 에어매트 상세페이지입니다.",
};

/**
 * 훈련용 에어매트(추락방지매트) 상세페이지 (정규 커스텀 구조)
 * /products/Training-Air-Mattress-Fall-Prevention-Mat
 */
export default async function TrainingAirMattressPage() {
    const filePath = path.join(process.cwd(), 'content/data/products/products.json');
    const json = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(json);
    const product = data.categories.find((c: any) => c.id === 'b-type').products.find((p: any) => p.id === 'Training-Air-Mattress-Fall-Prevention-Mat');
    return <ClientComponent product={product} />;
} 