// [TRISID] 에어매트 3D 히어로 컴포넌트 (최소 템플릿)
'use client';

import Image from 'next/image';
import SimpleModelViewer from './SimpleModelViewer';
import React from 'react';

interface Product3DHeroProps {
    name: string;
    approvalNumber?: string;
    description?: string;
    model3d?: string;
    image: string;
}

const Product3DHero: React.FC<Product3DHeroProps> = ({
    name,
    approvalNumber,
    description,
    model3d,
    image
}) => {
    return (
        <section className="relative w-full h-[480px] md:h-[600px] flex items-center justify-center overflow-hidden">
            {/* 3D 모델링 뷰어 */}
            {model3d && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <SimpleModelViewer
                        modelPath={model3d}
                    />
                </div>
            )}
            {/* 타이틀/인증번호/소개 오버레이 */}
            <div className="absolute top-10 left-10 z-20 text-white drop-shadow-xl rounded-xl px-8 py-6 max-w-[420px]">
                <h1 className="text-4xl font-bold mb-2">{name}</h1>
                {approvalNumber && (
                    <div className="text-orange-300 font-semibold text-lg mb-1">인증번호: {approvalNumber}</div>
                )}
                {description && <p className="text-base text-gray-100">{description}</p>}
            </div>
        </section>
    );
};

export default Product3DHero;