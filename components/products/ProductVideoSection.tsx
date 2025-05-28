'use client';

import React from 'react';
import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductVideoSectionProps {
  videos: Array<{src: string, alt: string, type: 'video'}>;
  title?: string;
  className?: string;
}

/**
 * 제품 비디오를 표시하는 섹션 컴포넌트
 * 제품 사양 아래에 표시됩니다.
 */
export function ProductVideoSection({ videos, title = '제품 작동 영상', className }: ProductVideoSectionProps) {
  // 비디오가 없으면 표시하지 않음
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-12", className)}>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Film className="w-6 h-6 mr-2 text-red-400" />
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((video, index) => (
          <div 
            key={`video-${index}`} 
            className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-red-700/30 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="aspect-video relative">
              <video 
                src={video.src}
                controls
                className="w-full h-full object-cover object-bottom"
                poster={(() => {
                  // 비디오 커버 이미지 생성 (동일 파일명에 .jpg 확장자로 가정)
                  const videoSrc = video.src;
                  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
                  let posterSrc = videoSrc;
                  
                  videoExtensions.forEach(ext => {
                    if (posterSrc.toLowerCase().endsWith(ext)) {
                      // 파일명에서 확장자 제거하고 jpg 확장자 추가
                      const basePath = posterSrc.slice(0, posterSrc.toLowerCase().lastIndexOf(ext));
                      posterSrc = basePath + '.jpg';
                    }
                  });
                  
                  return posterSrc;
                })()}
                preload="metadata"
              >
                <source src={video.src} type="video/mp4" />
                <p>브라우저가 비디오 태그를 지원하지 않습니다.</p>
              </video>
            </div>
            {video.alt && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">
                  {video.alt}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
