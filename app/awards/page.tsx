'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, TrendingUp, Trophy, Medal, FileText, Zap } from 'lucide-react';

export default function AwardsPage() {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'award' | 'certification' | 'patent'>('all');
    const [isClient, setIsClient] = useState(false);
    const [awards, setAwards] = useState<AwardItem[]>([]);
    const [certsAndPatents, setCertsAndPatents] = useState<CertificationItem[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    useEffect(() => {
        setIsClient(true);

        try {
            // 안전한 데이터 로딩
            const loadedAwards = getAwards();
            const loadedCertsAndPatents = getCertificationsAndPatents();

            console.log('[AwardsPage] awards:', loadedAwards);
            console.log('[AwardsPage] certsAndPatents:', loadedCertsAndPatents);

            setAwards(loadedAwards || []);
            setCertsAndPatents(loadedCertsAndPatents || []);

            // 갤러리 아이템 안전하게 생성
            const safeGalleryItems = [
                ...loadedCertsAndPatents.map((item, index) => ({
                    id: index,
                    src: item.imageSrc || '/images/placeholder.jpg', // 기본 이미지 설정
                    alt: item.title || '인증서',
                    category: item.type === 'patent' ? '특허증' : '인증서'
                }))
            ];

            console.log('[AwardsPage] galleryItems:', safeGalleryItems);
            setGalleryItems(safeGalleryItems);

        } catch (error) {
            console.error('[AwardsPage] 데이터 로딩 오류:', error);
            // 오류 발생 시 빈 배열로 초기화
            setAwards([]);
            setCertsAndPatents([]);
            setGalleryItems([]);
        }
    }, []);

    // ... existing code ...
} 