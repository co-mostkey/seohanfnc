import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']; // 지원할 비디오 확장자
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']; // 지원할 이미지 확장자

    const galleriesBasePath = 'public';
    const videosDir = path.join(process.cwd(), galleriesBasePath, 'videos', 'products', productId, 'gallery');
    const imagesDir = path.join(process.cwd(), galleriesBasePath, 'images', 'products', productId, 'gallery');

    let videoFiles: Array<{ src: string; name: string }> = [];
    let imageFiles: Array<{ src: string; alt: string }> = [];

    try {
        if (fs.existsSync(videosDir)) {
            const files = fs.readdirSync(videosDir);
            videoFiles = files
                .filter(file => videoExtensions.some(ext => file.toLowerCase().endsWith(ext)))
                .map(file => ({
                    src: `/videos/products/${productId}/gallery/${file}`,
                    name: file,
                }));
        }
    } catch (error) {
        console.error(`Error reading video directory for ${productId}:`, error);
        // 비디오 폴더 오류는 무시하고 이미지 처리는 계속 진행
    }

    try {
        if (fs.existsSync(imagesDir)) {
            const files = fs.readdirSync(imagesDir);
            imageFiles = files
                .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
                .map(file => ({
                    src: `/images/products/${productId}/gallery/${file}`,
                    alt: file, // alt 텍스트는 파일명으로 우선 설정, 필요시 수정
                }));
        }
    } catch (error) {
        console.error(`Error reading image directory for ${productId}:`, error);
        // 이미지 폴더 오류도 무시
    }

    return NextResponse.json({
        videos: videoFiles,
        images: imageFiles,
    });
} 