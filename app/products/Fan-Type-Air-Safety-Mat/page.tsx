import { Metadata } from "next";
import fs from 'fs/promises';
import path from 'path';
import ClientComponent from "./client";

export const metadata: Metadata = {
    title: "팬형 공기안전매트 | 안전장비 | 서한에프앤씨",
    description: "고층 피난자를 위한 팬형 공기안전매트 상세페이지입니다.",
};

/**
 * 팬형 공기안전매트 상세페이지 (정규 커스텀 구조)
 * /products/Fan-Type-Air-Safety-Mat
 */
export default async function FanTypeAirSafetyMatPage() {
    const filePath = path.join(process.cwd(), 'content/data/products/products.json');
    const json = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(json);
    const product = data.categories.find((c: any) => c.id === 'b-type').products.find((p: any) => p.id === 'Fan-Type-Air-Safety-Mat');
    return <ClientComponent product={product} />;
} 