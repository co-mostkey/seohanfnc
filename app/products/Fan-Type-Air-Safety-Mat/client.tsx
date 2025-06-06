'use client';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { ModelSpecTable } from '@/components/products/ModelSpecTable';
import { cn } from '@/lib/utils';
import { ImpactAbsorptionChart } from '@/components/products/ImpactAbsorptionChart';
import { ProductHero } from '@/components/products/ProductHero';

export default function FanTypeAirSafetyMatClient({ product }: { product: any }) {
  const model3dPath = product.model3D?.glbFile || `/models/products/${product.id}/${product.id}.glb`;
  const visualImage = product.pageBackgroundImage || `/images/products/${product.id}/main/visual.jpg`;
  const thumbnailImage = product.image || `/images/products/${product.id}/thumbnail.jpg`;

  const galleryImages = useMemo(() => {
    const baseImages = [];
    if (thumbnailImage) {
      baseImages.push(thumbnailImage);
    }
    const galleryData = (product.gallery_images_data || product.gallery || []).map((item: any) =>
      typeof item === 'string' ? item : item.src
    ).filter(Boolean);
    return [...baseImages, ...galleryData];
  }, [thumbnailImage, product.gallery, product.gallery_images_data]);

  const [activeImage, setActiveImage] = useState(galleryImages.length > 0 ? galleryImages[0] : (visualImage || '/images/placeholder.jpg'));

  const features = product.features;
  const certifications = product.certifications;
  const certificationSubtitle = certifications?.map((c: any) => c.description).join(' / ');

  return (
    <div>
      <ProductHero
        productName={product.nameKo}
        certificationSubtitle={certificationSubtitle}
        backgroundImage={visualImage || ''}
        modelPath={model3dPath}
        productId={product.id}
      />

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* 주요 특징 (카드형) */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-white">주요 특징</h3>
            <ul className="space-y-3 text-gray-300">
              {product.features?.map((feature: any, i: number) => (
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
              src={activeImage}
              alt="배경 블러"
              fill
              className="object-cover scale-150 blur-3xl opacity-30"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 p-8">
              <div className="md:col-span-3 w-full h-96 md:h-[450px] relative overflow-hidden rounded-lg border border-gray-600/50">
                <Image
                  src={activeImage || '/images/placeholder.jpg'}
                  alt={product.nameKo}
                  fill
                  className="object-cover"
                  onError={() => setActiveImage(visualImage || '/images/placeholder.jpg')}
                  sizes="(max-width: 768px) 90vw, 54vw"
                />
              </div>
              <div className="md:col-span-2 flex flex-col justify-center text-white">
                <h3 className="text-3xl font-bold mb-3">{product.nameKo}</h3>
                {product.approvalNumber && (
                  <div className="text-lg text-gray-300 mb-4">
                    <span className="font-semibold text-gray-100">제품승인번호:</span> {product.approvalNumber}
                  </div>
                )}
                <ul className="space-y-3 text-gray-200">
                  {product.features?.slice(0, 3).map((feature: any, i: number) => (
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

          {/* 충격흡수 데이터 섹션 추가 */}
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
          {product.gallery && product.gallery.length > 0 && (
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 shadow-lg">
              <h2 className="text-2xl font-extrabold text-white mb-4 tracking-tight drop-shadow">제품 갤러리</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {product.gallery.map((img: string, i: number) => (
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