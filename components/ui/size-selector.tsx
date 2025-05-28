'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { ZoomIn, ZoomOut } from 'lucide-react';

export type ContentSize = 'normal' | 'large';

interface SizeSelectorProps {
  className?: string;
}

export const SizeSelector = ({ className }: SizeSelectorProps) => {
  // 로컬 스토리지에서 사이즈 설정 불러오기
  const [contentSize, setContentSize] = useState<ContentSize>('normal');

  useEffect(() => {
    // 로컬 스토리지에서 저장된 설정 불러오기
    const savedSize = localStorage.getItem('content-size') as ContentSize | null;
    if (savedSize) {
      setContentSize(savedSize);
      updateContentScale(savedSize);
    }
  }, []);

  const updateContentScale = (size: ContentSize) => {
    const scale = size === 'large' ? '1' : '0.75';
    document.documentElement.style.setProperty('--content-scale', scale);
    localStorage.setItem('content-size', size);
  };

  const toggleSize = () => {
    const newSize = contentSize === 'normal' ? 'large' : 'normal';
    setContentSize(newSize);
    updateContentScale(newSize);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSize} 
              className="rounded-full w-8 h-8 p-0"
            >
              {contentSize === 'normal' ? <ZoomIn size={16} /> : <ZoomOut size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{contentSize === 'normal' ? '크게 보기' : '보통 크기로 보기'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SizeSelector; 