'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';

const SimpleModelViewer = dynamic(() => import('@/components/products/SimpleModelViewer'), { ssr: false });

interface ProductHeroProps {
    productName: string;
    certificationSubtitle?: string;
    backgroundImage: string;
    modelPath: string;
    productId: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
    productName,
    certificationSubtitle,
    backgroundImage,
    modelPath,
    productId,
}) => {
    const finalBackgroundImage = backgroundImage || '/images/placeholder.jpg';

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={finalBackgroundImage}
                    alt={`${productName} 배경 이미지`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* 3D Model Viewer */}
            <div className="w-full h-[95vh] relative z-30">
                <SimpleModelViewer modelPath={modelPath} interactive={true} productId={productId} />
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-10 left-0 right-0 z-20 text-center px-4 pointer-events-none">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
                    {productName}
                </h2>

                {/* Subtitle Group - 가로선과 인증번호 */}
                <div className="mt-3">
                    <div
                        className="h-0.5 mx-auto rounded-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                        style={{ width: 'clamp(300px, 50vw, 600px)' }}
                    />
                    {certificationSubtitle && (
                        <p className="mt-3 text-lg text-gray-300 drop-shadow-md tracking-wider">
                            {certificationSubtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}; 