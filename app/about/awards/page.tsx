import React from 'react';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';
import { AwardsGallery } from './client-components';
import { awardsAndCertsData } from '@/data/awards-and-certs';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const categories = [
  { id: 'award', name: '수상', icon: Award, color: 'border-amber-200 bg-amber-50 text-amber-800' },
  { id: 'selection', name: '선정', icon: Award, color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  { id: 'certification', name: '인증', icon: Award, color: 'border-blue-200 bg-blue-50 text-blue-800' },
  { id: 'patent', name: '특허', icon: Award, color: 'border-purple-200 bg-purple-50 text-purple-800' }
];

const getCategoryConfig = (type: string) => {
  return categories.find(cat => cat.id === type) || categories[0];
};

export default function AwardsPage() {
  // 데이터 필터링 - 안전하게 처리
  const allData = awardsAndCertsData || [];
  const awards = allData.filter(item => item.type === 'award' || item.type === 'selection');
  const certsAndPatents = allData.filter(item => item.type === 'certification' || item.type === 'patent');

  // 갤러리 아이템 생성 - 안전하게 처리
  const galleryItems = certsAndPatents.map((item, index) => {
    const relativeSrc = item.imageSrc || '/images/placeholder.jpg';
    return {
      id: index,
      src: relativeSrc.startsWith('/') ? `${basePath}${relativeSrc}` : `${basePath}/${relativeSrc}`,
      alt: item.title || '인증서',
      category: item.type === 'certification' ? '인증서' : '특허증'
    };
  });

  // Breadcrumb items
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about` },
    { text: '인증 및 특허', href: `${basePath}/about/awards`, active: true }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SimpleBreadcrumb items={breadcrumbItems} />

      <PageHeading
        title="인증 및 특허"
        description="서한F&C가 보유한 각종 인증서와 특허를 소개합니다."
        icon={Award}
      />

      {/* 수상 및 선정 섹션 */}
      {awards.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">수상 내역</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((item) => {
              const categoryConfig = getCategoryConfig(item.type);
              const IconComponent = categoryConfig.icon;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-lg border", categoryConfig.color)}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", categoryConfig.color)}>
                          {categoryConfig.name}
                        </span>
                        <span className="text-sm text-gray-500">{item.year}년</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 인증서 및 특허 갤러리 섹션 */}
      {galleryItems.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">인증서 및 특허</h2>
          <AwardsGallery items={galleryItems} />
        </section>
      )}
    </div>
  );
}