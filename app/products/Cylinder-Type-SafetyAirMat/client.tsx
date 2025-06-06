'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { cn } from '@/lib/utils';
import { ImpactAbsorptionChart } from '@/components/products/ImpactAbsorptionChart';

const SimpleModelViewer = dynamic(() => import('@/components/products/SimpleModelViewer'), { ssr: false });

export default function CylinderTypeSafetyAirMatClient({ product }: { product: any }) {
    // [TRISID] B타입 데이터 우선 사용, 없으면 기존 방식(ID 기반 경로) 사용 (데이터 연동)
    const model3dPath = product.model3D?.glbFile || `/models/products/${product.id}/${product.id}.glb`;
    const visualImage = product.pageBackgroundImage || `/images/products/${product.id}/main/visual.jpg`;
    const thumbnailImage = product.image || `/images/products/${product.id}/thumbnail.jpg`;

    // [TRISID] B타입 갤러리(객체 배열)와 기존 갤러리(문자열 배열) 모두 지원하도록 수정 (데이터 연동)
    const galleryImages = useMemo(() => {
        const baseImages = [];
        if (thumbnailImage) {
            baseImages.push(thumbnailImage);
        }
        const galleryData = (product.gallery_images_data || product.gallery || []).map((item: any) =>
            typeof item === 'string' ? item : item.src
        ).filter(Boolean); // null, undefined 값 제거
        return [...baseImages, ...galleryData];
    }, [thumbnailImage, product.gallery, product.gallery_images_data]);

    const [activeImage, setActiveImage] = useState(galleryImages.length > 0 ? galleryImages[0] : (visualImage || ''));

    // [TRISID] 데이터 연동을 위한 주요 데이터 소스 정의 (B타입 우선)
    const approvalNumber = product.model3D?.approvalNumber || product.approvalNumber;
    const features = product.certifications || product.features;

    return (
        <div>
            {/* Hero Section: 3D 모델링 중앙 배치 */}
            <section className="relative w-full h-screen flex flex-col items-center justify-center">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={visualImage || ''}
                        alt="제품 배경 이미지"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="w-full h-[95vh] relative z-30">
                    <SimpleModelViewer modelPath={model3dPath} interactive={true} productId={product.id} />
                </div>

                {/* Text Overlay */}
                <div className="absolute bottom-10 left-0 right-0 z-20 text-center px-4 pointer-events-none">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
                        {product.nameKo}
                    </h2>
                    <div
                        className="h-0.5 mx-auto my-4 rounded-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                        style={{ width: 'clamp(300px, 50vw, 600px)' }}
                    />
                    {approvalNumber && (
                        <p className="mt-4 text-xl text-gray-300 drop-shadow-md">
                            제품승인번호: {approvalNumber}
                        </p>
                    )}
                </div>
            </section>

            {/* Main Content Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="space-y-12">
                    {/* 주요 특징 (카드형) */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-white">주요 특징</h3>
                        <ul className="space-y-3 text-gray-300">
                            {features?.map((feature: any, i: number) => (
                                <li key={i} className="flex items-start">
                                    <svg className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <div>
                                        <strong className="text-white">{feature.title}:</strong>
                                        <span className="ml-2">{feature.description}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 개선된 대표 이미지 카드 */}
                    <div className="relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700/50 shadow-lg backdrop-blur-sm">
                        <Image
                            src={activeImage || ''}
                            alt="배경 블러"
                            fill
                            className="object-cover scale-150 blur-3xl opacity-30"
                            aria-hidden="true"
                        />
                        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 p-8">
                            <div className="md:col-span-3 w-full h-96 md:h-[450px] relative overflow-hidden rounded-lg border border-gray-600/50">
                                <Image
                                    src={activeImage || ''}
                                    alt={product.nameKo}
                                    fill
                                    className="object-cover"
                                    onError={() => setActiveImage(visualImage || '')}
                                    sizes="(max-width: 768px) 90vw, 54vw"
                                />
                            </div>
                            <div className="md:col-span-2 flex flex-col justify-center text-white">
                                <h3 className="text-3xl font-bold mb-3">{product.nameKo}</h3>
                                {approvalNumber && (
                                    <div className="text-lg text-gray-300 mb-4">
                                        <span className="font-semibold text-gray-100">제품승인번호:</span> {approvalNumber}
                                    </div>
                                )}
                                <ul className="space-y-3 text-gray-200">
                                    {features?.slice(0, 3).map((feature: any, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span><strong>{feature.title}:</strong> {feature.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="relative p-4 bg-black/30 backdrop-blur-sm">
                            <div className="flex space-x-3 overflow-x-auto pb-2">
                                {galleryImages.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={cn(
                                            'flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden border-2 transition-all duration-200',
                                            activeImage === img ? 'border-primary scale-105' : 'border-gray-600/50 hover:border-gray-400'
                                        )}
                                    >
                                        <Image
                                            src={img}
                                            alt={`썸네일 ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 제품 사양 (카드형) */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
                        <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight drop-shadow">제품 사양</h2>
                        <ModelSpecTable specTable={product.specTable} className="" />
                    </div>

                    {/* 실린더식 공기안전매트 충격흡수 비교 데이터 */}
                    {product.impactAbsorptionData && (
                        <ImpactAbsorptionChart data={product.impactAbsorptionData} />
                    )}

                    {/* 주의사항 (카드형) */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
                        <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight drop-shadow">주의사항</h2>
                        <ul className="list-disc pl-5 space-y-1 text-red-300 text-lg">
                            {product.cautions && product.cautions.map((c: string, i: number) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>

                    {/* 첨부문서 (카드형) */}
                    {product.documents && product.documents.length > 0 && (
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
                            <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight drop-shadow">첨부문서</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                {product.documents.map((doc: any) => (
                                    doc.path && (
                                        <li key={doc.id}>
                                            <a
                                                href={doc.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-300 underline hover:text-white transition-colors duration-200"
                                            >
                                                {doc.nameKo || doc.name || '문서 다운로드'}
                                            </a>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 관련 동영상 (카드형) */}
                    {product.videos && product.videos.length > 0 && (
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
                            <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight drop-shadow">제품 동영상</h2>
                            <video src={product.videos[0]} controls className="w-full max-w-xl rounded border border-gray-700 mx-auto mt-4" />
                        </div>
                    )}

                    {/* 갤러리 (카드형) */}
                    {galleryImages.length > 1 && ( // 대표 이미지를 제외하고 1개 이상일 때만 표시
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
                            <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight drop-shadow">제품 갤러리</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {galleryImages.slice(1).map((img: string, i: number) => ( // 첫번째는 대표이미지이므로 제외
                                    <div key={i} className="aspect-square relative overflow-hidden rounded-lg border border-gray-700/50 group">
                                        <Image
                                            src={img}
                                            alt={`${product.nameKo} 갤러리 이미지 ${i + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 17vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
} 
