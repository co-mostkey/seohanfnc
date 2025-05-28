'use client';

import React, { useState } from 'react';
import { Play, Pause, Info } from 'lucide-react';
import Image from 'next/image';

interface SimpleImageViewerProps {
  modelPath: string;
  productName: string;
}

// 제품 ID에 따라 적절한 이미지 경로 반환
const getProductImagePath = (modelPath: string): string => {
  // 모델 경로에서 제품 ID 추출
  if (modelPath.includes('Cylinder-Type-SafetyAirMat')) {
    return '/images/products/Cylinder-Type-SafetyAirMat/main/visual.jpg';
  } else if (modelPath.includes('Fan-Type-Air-Safety-Mat')) {
    return '/images/products/Fan-Type-Air-Safety-Mat/main/visual.jpg';
  } else if (modelPath.includes('Lifesaving-Mat')) {
    return '/images/products/Lifesaving-Mat/main/visual.jpg';
  }
  
  // 기본 이미지 경로
  return '/images/placeholder-3d.jpg';
};

// 키프레임 애니메이션을 추가하여 제품 사진에 약간의 동적 효과 부여
const ImageWithAnimation = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative w-full h-full overflow-hidden group">
      <div className="w-full h-full transform transition-transform duration-10000 hover:scale-110 group-hover:rotate-1">
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity" 
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
    </div>
  );
};

export default function SimpleImageViewer({ modelPath, productName }: SimpleImageViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // 이미지 경로 가져오기
  const imagePath = getProductImagePath(modelPath);
  
  // 토글 플레이 버튼 클릭 핸들러
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleInfo = () => setShowInfo(!showInfo);
  
  return (
    <div className="w-full h-full relative">
      {/* 이미지 컨테이너 - 3D 모델 대신 임시로 사용 */}
      <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900">
        <ImageWithAnimation src={imagePath} alt={productName} />
        
        {/* 제품 이름 */}
        <div className="absolute bottom-6 left-6 text-white text-xl font-bold z-10 bg-black/30 px-3 py-1 rounded">
          {productName}
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
          <button 
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            onClick={togglePlay}
            aria-label={isPlaying ? "정지" : "자동 회전"}
          >
            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
          </button>
          
          <button 
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            onClick={toggleInfo}
            aria-label="제품 정보"
          >
            <Info size={20} className="text-white" />
          </button>
        </div>
        
        {/* 제품 정보 모달 */}
        {showInfo && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg max-w-md w-full">
              <h3 className="text-white text-xl font-bold mb-4">{productName}</h3>
              <p className="text-white/90 mb-4">
                3D 모델 로드에 문제가 발생하여 임시로 이미지를 표시하고 있습니다. 공식 사이트에서 자세한 정보를 확인하세요.
              </p>
              <button 
                className="bg-primary-500 text-white px-4 py-2 rounded-md w-full hover:bg-primary-600 transition-colors"
                onClick={toggleInfo}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
