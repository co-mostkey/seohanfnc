import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FiDownload, FiFile, FiCalendar, FiEye, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb';
import { PageHeading } from '@/components/ui/PageHeading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resource = resourcesData.find(r => r.id === parseInt(id));

  if (!resource) {
    return {
      title: '자료 없음 | 서한F&C',
      description: '요청하신 자료를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${resource.title} | 자료실 | 서한F&C`,
    description: `서한F&C 자료실의 ${resource.title} 문서입니다. ${resource.type} 자료를 확인하고 다운로드하세요.`,
  };
}

// 임시 데이터 - 실제로는 API나 데이터베이스에서 가져와야 함
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const resourcesData = [
  {
    id: 1,
    title: '전기제어반 기술 사양서',
    type: '기술 문서',
    date: '2023-11-15',
    views: 234,
    fileType: 'PDF',
    fileSize: '2.5MB',
    downloadUrl: '#',
    description: '이 문서는 서한산업의 전기제어반에 대한 상세 기술 사양을 제공합니다. 제품 사양, 기술적 특성, 운영 조건 및 성능 매개변수에 대한 정보를 포함하고 있습니다. 전기 엔지니어, 시스템 통합업체 및 기술 관리자를 위한 참고 자료로 활용될 수 있습니다.',
    thumbnailUrl: `${basePath}/images/resources/tech-spec-thumb.jpg`,
    related: [2, 7],
  },
  {
    id: 2,
    title: '공정자동화시스템 사용자 매뉴얼',
    type: '매뉴얼',
    date: '2023-10-28',
    views: 187,
    fileType: 'PDF',
    fileSize: '4.8MB',
    downloadUrl: '#',
    description: '서한산업의 공정자동화시스템 사용자 매뉴얼입니다. 시스템 구성, 설치 방법, 기본 작동 원리, 일반적인 문제 해결 방법 등을 포함하고 있습니다. 이 매뉴얼은 시스템 운영자, 유지보수 담당자, 공정 엔지니어를 대상으로 작성되었습니다.',
    thumbnailUrl: `${basePath}/images/resources/manual-thumb.jpg`,
    related: [1, 3],
  },
  {
    id: 3,
    title: '통신설비 설치 가이드라인',
    type: '가이드라인',
    date: '2023-09-22',
    views: 163,
    fileType: 'DOC',
    fileSize: '1.2MB',
    downloadUrl: '#',
    description: '산업 환경에서 통신설비 설치를 위한 표준 가이드라인입니다. 케이블 배선, 네트워크 장비 설치, 신호 간섭 방지 등에 대한 모범 사례를 제공합니다. 이 가이드라인은 통신 기술자, 현장 엔지니어, 프로젝트 관리자를 위해 개발되었습니다.',
    thumbnailUrl: `${basePath}/images/resources/guide-thumb.jpg`,
    related: [2, 6],
  },
  {
    id: 4,
    title: '에너지 관리 솔루션 소개서',
    type: '소개서',
    date: '2023-08-17',
    views: 205,
    fileType: 'PDF',
    fileSize: '3.7MB',
    downloadUrl: '#',
    description: '서한산업의 에너지 관리 솔루션에 대한 종합적인 소개서입니다. 에너지 모니터링, 분석, 최적화 기능을 포함한 솔루션의 주요 기능과 이점을 설명합니다. 시설 관리자, 에너지 컨설턴트, 지속가능성 책임자에게 유용한 정보를 제공합니다.',
    thumbnailUrl: `${basePath}/images/resources/energy-thumb.jpg`,
    related: [5, 7],
  },
  {
    id: 5,
    title: '스마트 팩토리 구축 사례 연구',
    type: '사례 연구',
    date: '2023-07-30',
    views: 146,
    fileType: 'PDF',
    fileSize: '5.2MB',
    downloadUrl: '#',
    description: '국내 제조업체의 스마트 팩토리 구축 프로젝트에 대한 사례 연구입니다. 프로젝트 배경, 구현된 솔루션, 도전과제 및 결과에 대한 상세한 분석을 제공합니다. 제조업체 경영진, 디지털 혁신 책임자, 산업 컨설턴트에게 특히 유용한 자료입니다.',
    thumbnailUrl: `${basePath}/images/resources/smart-factory-thumb.jpg`,
    related: [4, 6],
  },
  {
    id: 6,
    title: '산업용 IoT 시스템 아키텍처 문서',
    type: '기술 문서',
    date: '2023-06-25',
    views: 127,
    fileType: 'PDF',
    fileSize: '6.1MB',
    downloadUrl: '#',
    description: '서한산업의 산업용 IoT 시스템 아키텍처를 설명하는 기술 문서입니다. 데이터 수집, 처리, 저장, 분석 및 시각화 계층을 포함한 전체 시스템 구조를 설명합니다. 또한 보안, 확장성, 상호 운용성에 대한 접근 방식도 다루고 있습니다.',
    thumbnailUrl: `${basePath}/images/resources/iot-thumb.jpg`,
    related: [3, 5],
  },
  {
    id: 7,
    title: '서한산업 제품 카탈로그 (2023)',
    type: '카탈로그',
    date: '2023-01-10',
    views: 321,
    fileType: 'PDF',
    fileSize: '8.5MB',
    downloadUrl: '#',
    description: '서한산업의 2023년 종합 제품 카탈로그입니다. 모든 제품 라인의 기술 사양, 기능, 이점 및 응용 사례를 포함합니다. 구매 담당자, 시스템 통합업체, 프로젝트 엔지니어에게 유용한 참고 자료입니다.',
    thumbnailUrl: `${basePath}/images/resources/catalog-thumb.jpg`,
    related: [1, 4],
  },
];

function getFileIcon(fileType: string) {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FiFile className="text-red-500" />;
    case 'doc':
    case 'docx':
      return <FiFile className="text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <FiFile className="text-green-500" />;
    default:
      return <FiFile className="text-gray-500" />;
  }
}

// --- Dummy Data --- (Replace with actual data fetching)
const SAMPLE_RESOURCES = [
  {
    id: 'user-manual-sfc-1000',
    title: 'SFC-1000 사용자 매뉴얼',
    // ... (나머지 데이터)
  },
  {
    id: 'datasheet-sfc-2000',
    title: 'SFC-2000 데이터 시트',
    // ... (나머지 데이터)
  },
  {
    id: 'software-update-v3',
    title: '펌웨어 업데이트 v3.0.1',
    // ... (나머지 데이터)
  },
];

// 임시 데이터 가져오기 함수
const getResourceById = (id: string) => {
  return SAMPLE_RESOURCES.find(res => res.id === id) || null;
};

export default async function ResourceDetailPage({ params }: Props) {
  const { id } = await params;
  const resource = resourcesData.find(r => r.id === parseInt(id));

  if (!resource) {
    notFound();
  }

  const relatedResources = resource.related.map(id => resourcesData.find(r => r.id === id)).filter(Boolean);

  const categoryMap: { [key: string]: string } = {
    '매뉴얼': '매뉴얼',
    '데이터 시트': '데이터 시트',
    '소프트웨어': '소프트웨어',
    '카탈로그': '카탈로그',
    '사례 연구': '사례 연구',
    '기술 문서': '기술 문서',
    'manuals': '매뉴얼',
    'datasheets': '데이터 시트',
    'software': '소프트웨어',
    'catalogs': '카탈로그',
    'others': '기타 자료',
  };

  const categoryName = categoryMap[resource.type] || '기타 자료';

  const breadcrumbItems = [
    { text: '홈', href: '/' },
    { text: '고객지원', href: '/support' },
    { text: '자료실', href: '/support/resources' },
    { text: categoryName, href: `/support/resources?category=${encodeURIComponent(resource.type)}` },
    { text: resource.title, href: `/support/resources/${resource.id}`, active: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SimpleBreadcrumb items={breadcrumbItems} className="mb-6" />
      <PageHeading title={resource.title} className="mb-8" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{resource.title}</CardTitle>
          <CardDescription className="text-md mt-1">
            {resource.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>파일 형식: {resource.fileType} ({resource.fileSize})</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>게시일: {resource.date}</span>
            </div>
            <div className="flex items-center">
              <FiEye className="h-4 w-4 mr-2" />
              <span>조회수: {resource.views}</span>
            </div>
          </div>

          <Button
            asChild // Use asChild to render the Link component with Button styles
            className="w-full md:w-auto"
          >
            <a href={resource.downloadUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </a>
          </Button>
        </CardContent>
      </Card>
      {relatedResources.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">관련 자료</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedResources.map((relatedResource) => (
              relatedResource && (
                <div key={relatedResource.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition duration-150">
                  <Link
                    href={`/support/resources/${relatedResource.id}`}
                    className="block p-4"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {getFileIcon(relatedResource.fileType)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {relatedResource.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{relatedResource.type}</span>
                          <span>·</span>
                          <span>{relatedResource.date}</span>
                          <span>·</span>
                          <span>{relatedResource.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 