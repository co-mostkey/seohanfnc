'use client';

import React, { useState, useMemo, useEffect } from 'react';
// 아이콘 임포트 (탭에 사용할 아이콘 위주로 + 새로운 섹션 아이콘)
import { Shield, ListChecks, FileText as FileTextIcon, ImageIcon, Package, ChevronLeft, User, MessageCircle, ArrowLeft, ChevronRight, Award, Clock, Activity, Download, ExternalLink, ThumbsUp, Zap, AwardIcon, ShieldCheck, FileText, HelpCircle, ExternalLinkIcon, ListIcon, BookOpen, HardHat, Users, Layers, Maximize, Minimize, RotateCcw, Camera, Sun, Moon, Play, Pause, Maximize2, Minimize2, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Document, MediaGalleryItem } from '@/types/product'; // ProductFeature, SpecTableItem 등 필요한 타입 추가
import { cn, getImagePath } from '@/lib/utils'; // cn 함수 임포트 추가

// 컴포넌트 임포트
import DynamicModelViewer from '@/components/products/DynamicModelViewer';
import ProductModelViewer from '@/components/products/b-type/ProductModelViewer';
import ProductSpecifications from '@/components/products/b-type/ProductSpecifications'; // 기존 상세 표시용
import ProductFeaturesComponent from '@/components/products/b-type/ProductFeatures'; // 이름 변경 ProductFeatures -> ProductFeaturesComponent
// import ProductDocuments 컴포넌트는 새 스니펫의 documents 탭에서 직접 사용되므로, 기존 방식은 주석 처리 또는 수정
// import ProductDocuments, { Document } from '@/components/products/b-type/ProductDocuments'; 
import { ModelSpecTable } from '@/components/products/ModelSpecTable'; // ModelSpecTable 임포트 추가
import ProductImageGallery from '@/components/products/b-type/ProductImageGallery';

// ProductDetailClient가 page.tsx로부터 받는 Prop 타입 정의
interface ProductDetailClientProps {
  productId: string;
  initialProductName: string;
  galleryImagesData: MediaGalleryItem[];
  videoGalleryData: MediaGalleryItem[];
  mainImage?: string;
  initialDescription?: string;
  features?: Product['features'];
  documents?: Document[];
  specTable?: Product['specTable'];
  modelNumber?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  dimensions?: string;
  weight?: string;
  materials?: string;
  certificationsAndFeatures?: Product['certificationsAndFeatures'];
  cautions?: string[];
}

type TabKey = 'details' | 'features' | 'specifications' | 'documents';

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  productId,
  initialProductName,
  galleryImagesData = [],
  videoGalleryData = [],
  mainImage,
  initialDescription,
  features = [],
  documents = [],
  specTable,
  modelNumber,
  manufacturer,
  countryOfOrigin,
  dimensions,
  weight,
  materials,
  certificationsAndFeatures = [],
  cautions = []
}) => {

  if (!productId) {
    return <div>제품 ID가 제공되지 않았습니다. 페이지를 로드할 수 없습니다.</div>;
  }

  const [activeTab, setActiveTab] = useState<TabKey>('details');

  const currentProductName = initialProductName;
  const currentDescription = initialDescription || '';

  const specifications = {
    '모델 번호': modelNumber || 'N/A',
    '제조사': manufacturer || 'N/A',
    '원산지': countryOfOrigin || 'N/A',
    '크기': dimensions || 'N/A',
    '무게': weight || 'N/A',
    '재질': materials || 'N/A',
  };

  const allMediaItems: MediaGalleryItem[] = useMemo(() => {
    const imagesWithType = galleryImagesData.map(item => ({ ...item, type: 'image' as const, id: item.id || `img-${item.src}` }));
    const videosWithType = videoGalleryData.map(item => ({ ...item, type: 'video' as const, id: item.id || `vid-${item.src}` }));
    return [...imagesWithType, ...videosWithType].sort((a, b) => (a.id && b.id) ? a.id.localeCompare(b.id) : 0);
  }, [galleryImagesData, videoGalleryData]);

  // displayFeaturesToRender는 features prop을 직접 사용하거나 가공
  const displayFeaturesToRender = features && features.length > 0 ? features.map(f => ({ icon: f.icon || Shield, ...f })) : [
    { title: '고강도 내구성', description: '특수 재질 사용으로 극한 환경에서도 사용 가능', icon: Shield },
    { title: '신속한 설치', description: '단 몇 분 만에 설치 완료하여 즉시 사용', icon: Shield },
    { title: '안전 인증', description: '국내외 안전 기준 통과 및 인증 획득', icon: Shield },
  ];

  const tabDefinitions = useMemo(() => [
    {
      key: 'details' as TabKey,
      label: '제품 상세',
      icon: Package,
      content: () => (
        <div className="space-y-8">
          <div className="p-6 bg-card rounded-lg shadow-md border border-border">
            <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">제품 개요</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {currentDescription}
            </p>
          </div>
          {specTable && Array.isArray(specTable) && specTable.length > 0 && (
            <div className="p-6 bg-card rounded-lg shadow-md border border-border">
              <h3 className="text-xl font-serif font-semibold mb-4 text-foreground">세부 사양표</h3>
              <ModelSpecTable specTable={specTable} className="bg-gray-800/30" />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'features' as TabKey,
      label: '주요 특징',
      icon: Shield,
      content: () => (
        <div className="p-6 bg-card rounded-lg shadow-md border border-border">
          <h3 className="text-2xl font-serif font-semibold mb-6 text-foreground">주요 특징</h3>
          <ProductFeaturesComponent features={displayFeaturesToRender} />
        </div>
      )
    },
    {
      key: 'specifications' as TabKey,
      label: '상세 사양',
      icon: ListChecks,
      content: () => (
        <div className="space-y-8">
          <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
            {specTable && Array.isArray(specTable) && specTable.length > 0 && (
              <div className="mt-0">
                <h3 className="text-lg font-semibold mb-4 text-red-400">규격별 상세 사양</h3>
                <ModelSpecTable specTable={specTable} className="bg-gray-800/30" />
              </div>
            )}
            {productId === 'Cylinder-Type-SafetyAirMat' && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-red-400">피난안전장비 충격흡수 비교 데이터</h3>
                <div className="space-y-6">
                  <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
                    <h4 className="font-medium text-white mb-3 text-sm">충격흡수 비교 데이터 (DIN-14151-3)</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>관련근거 : 독일 구조용 에어매트 기준 (DIN-14151-3)</p>
                      <p>시험비교대상 : 공기안전매트(5층형)</p>
                      <p>시험일자 : 2017년 5월 18일</p>
                      <p>사용더미 : 75kg (DIN 14151-3 기준)</p>
                      <p>시험높이 : 16 (m) 시험법 (DIN 14151-3 기준)</p>
                      <p className="text-amber-400/90">본 시험은 독일 DIN 14151-3의 기준에 의한 낙하 충격흡수량(충격가속도의 배수[g]로 표기) 단위 (g)</p>
                      <p>1g : 9.81 m/s<sup>2</sup> 기준으로서 시험하였으며, 일반 충격량의 단위 (kg⋅m/s)와는 상이함을 알려드립니다.</p>
                      <p>※ 충격흡수량 환산 : 0.01 (V)=1 (g) [사용센서 : SAE-J211준용 센서]</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col">
                      <h5 className="text-sm font-medium text-white mb-2">지면 충돌시</h5>
                      <div className="relative h-64 flex-grow bg-gray-900/50 rounded overflow-hidden">
                        <Image
                          src={getImagePath('/images/products/Cylinder-Type-SafetyAirMat/data/Cylinder-Type-SafetyAirMat-test1.jpg')}
                          alt="지면 충돌시 충격흡수력 그래프"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-center text-amber-400 text-sm mt-2 font-medium">충격흡수량 : 33.620 (V) = 3,362 (g)</p>
                    </div>
                    <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30 flex flex-col">
                      <h5 className="text-sm font-medium text-white mb-2">공기안전매트</h5>
                      <div className="relative h-64 flex-grow bg-gray-900/50 rounded overflow-hidden">
                        <Image
                          src={getImagePath('/images/products/Cylinder-Type-SafetyAirMat/data/Cylinder-Type-SafetyAirMat-test2.jpg')}
                          alt="공기안전매트 충격흡수력 그래프"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-center text-green-400 text-sm mt-2 font-medium">충격흡수량 : 220 (mV) = 22 (g)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg text-white">
            <h3 className="text-xl font-bold mb-5 flex items-center">
              <Award className="w-5 h-5 mr-2 text-amber-400" />
              인증 및 특징
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificationsAndFeatures && certificationsAndFeatures.map((item: any, index: number) => (
                <div key={index} className="flex items-center p-3.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors">
                  {item.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />}
                  {item.icon !== 'ShieldCheck' && item.icon && <AwardIcon className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />}
                  {!item.icon && <AwardIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />}
                  <span className="text-sm text-gray-200">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'documents' as TabKey,
      label: '미디어 갤러리',
      icon: ImageIcon,
      content: () => (
        <div className="p-1">
          {allMediaItems.length > 0 ? (
            <ProductImageGallery items={allMediaItems} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">표시할 미디어가 없습니다.</p>
          )}
        </div>
      )
    },
  ], [
    currentProductName, currentDescription, specifications, displayFeaturesToRender,
    specTable, productId, documents, allMediaItems, mainImage,
    certificationsAndFeatures, features
  ]);

  const activeContent = tabDefinitions.find(tab => tab.key === activeTab)?.content();

  return (
    <div
      className="px-4 sm:px-6 lg:px-18 py-8 flex flex-col lg:flex-row lg:gap-x-16 xl:gap-x-24 bg-transparent text-foreground"
      style={{ minHeight: 'calc(100vh - var(--header-height) - var(--footer-height) - var(--main-content-top-padding) - var(--main-content-bottom-padding))', backgroundColor: 'transparent' }}
    >
      <div
        className="w-full flex flex-col lg:w-1/2 xl:w-5/12 lg:sticky lg:self-start lg:justify-center lg:h-[calc(100vh_-_var(--header-height)_-_var(--main-content-top-padding)_-_var(--footer-height)_-_var(--main-content-bottom-padding))] lg:top-[calc(var(--header-height)_+_var(--main-content-top-padding))]"
      >
        <div className="min-h-0 py-1 flex items-center justify-center">
          <div className="w-full h-full aspect-square overflow-hidden flex items-center justify-center">
            <ProductModelViewer
              productId={productId}
              productName={currentProductName}
              fallbackImage={mainImage || '/images/placeholder-image.png'}
            />
          </div>
        </div>
        <div className="flex-shrink-0 py-2">
          <Button variant="outline" size="sm" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
        </div>
        <div className="flex-shrink-0 pt-1 pb-2">
          <div className="flex space-x-1 sm:space-x-2 justify-center sm:justify-around">
            {tabDefinitions.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-md transition-all duration-200 ease-in-out',
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <tab.icon className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 py-2">
          <Link
            href={`/support/contact?product_name=${encodeURIComponent(currentProductName)}&product_id=${encodeURIComponent(productId)}`}
            className="flex justify-center w-full items-center px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-blue-600/30"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            제품 문의하기
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-1/2 xl:w-7/12 flex flex-col mt-8 lg:mt-0 lg:pt-16 lg:pb-16">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 font-serif tracking-tight">{currentProductName}</h1>
        </div>
        <div className="flex flex-col space-y-6 mb-8">
        </div>
        <div className="w-full flex-grow">
          {activeContent}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
