import React from 'react';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';
import { AwardsGallery } from './client-components';
import { awardsAndCertsData, AwardOrCertItem } from '@/data/awards-and-certs';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: '수상 및 인증 - 서한에프앤씨',
  description: '서한에프앤씨의 수상 내역과 인증서를 소개합니다.'
};

// Filter data from the shared source
const allData = awardsAndCertsData; // Assign to a variable first
const awards = allData.filter(item => item.type === 'award' || item.type === 'selection');
const certsAndPatents = allData.filter(item => item.type === 'certification' || item.type === 'patent');

// Log the filtered data (keep for debugging if needed)
console.log('[AwardsPage] awards:', awards);
console.log('[AwardsPage] certsAndPatents:', certsAndPatents);

// Transform certsAndPatents data for AwardsGallery component, adding basePath
const galleryItems = certsAndPatents.map((item, index) => {
  const relativeSrc = item.imageSrc || '/images/certs/placeholder.png';
  return {
    id: index,
    // Prepend basePath to the src path
    src: relativeSrc.startsWith('/') ? `${basePath}${relativeSrc}` : `${basePath}/${relativeSrc}`,
    alt: item.title,
    category: item.type === 'certification' ? '인증서' : '특허증'
  }
});

// Log the transformed gallery items (keep for debugging if needed)
console.log('[AwardsPage] galleryItems:', galleryItems);

export default function AwardsPage() {
  // Breadcrumb items
  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about` },
    { text: '인증 및 특허', href: `${basePath}/about/awards`, active: true }
  ];

  // Log inside the component (keep for debugging if needed)
  // console.log('[AwardsPage] Rendering...');

  return (
    <main className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="w-full">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <SimpleBreadcrumb items={breadcrumbItems} />
          </div>

          <div className="mb-12">
            <PageHeading
              title="수상 및 인증"
              subtitle="서한에프앤씨의 기술력과 품질이 인정받은 성과들입니다"
            />
          </div>

          {/* Major Awards Section - Use the correctly defined 'awards' variable */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-gray-200">주요 수상 및 선정 내역</h2>
            {/* Check if awards array exists and has items */}
            {(awards && awards.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                {/* Map over the 'awards' array */}
                {awards.map((award: AwardOrCertItem) => ( // Added explicit type for award
                  (<div
                    key={award.id}
                    className={cn(
                      "group rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                      "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm",
                      "transition-all duration-300 ease-in-out",
                      "hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 hover:-translate-y-1",
                      "flex items-start gap-4"
                    )}
                  >
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
                      <Award className="h-6 w-6 text-primary dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{award.year}년 {award.month ? `${award.month}월` : ''}</p>
                      <h3 className="text-base md:text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors">{award.title}</h3>
                      {award.description && <p className="text-sm text-gray-600 dark:text-gray-300">{award.description}</p>}
                      {award.issuer && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">수여/선정기관: {award.issuer}</p>}
                    </div>
                  </div>)
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">등록된 수상 내역이 없습니다.</p>
            )}
          </section>

          {/* Certifications & Patents Gallery Section - Use galleryItems with basePath */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-gray-200">인증서 및 특허증</h2>
            {(galleryItems && galleryItems.length > 0) ? (
              // Pass the galleryItems with corrected src paths
              (<AwardsGallery certifications={galleryItems} />)
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">등록된 인증서 또는 특허증이 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}