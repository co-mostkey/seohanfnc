'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CeoImage() {
  // 마우스 움직임에 따른 패럴랙스 효과
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 70, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 70, damping: 20 });

  // 이미지 시각 효과를 위한 상태
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    
    // 화면 중앙을 기준으로 -1에서 1 사이의 값으로 정규화
    const normalizedX = (clientX / innerWidth) * 2 - 1;
    const normalizedY = (clientY / innerHeight) * 2 - 1;
    
    mouseX.set(normalizedX * 15); // -15 ~ 15 범위
    mouseY.set(normalizedY * 10); // -10 ~ 10 범위
  };

  return (
    <motion.div 
      className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ 
        x, 
        y,
        transition: 'transform 0.3s ease'
      }}
    >
      <div className="flex items-center justify-center h-full text-gray-400">CEO 이미지</div>
    </motion.div>
  );
} 