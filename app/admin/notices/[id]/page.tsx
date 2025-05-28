import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, notFound } from 'next/navigation';
import {
  Edit,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Pin,
  Eye,
  Calendar,
  Clock,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PageHeading } from '@/components/ui/PageHeading';

// 샘플 공지사항 데이터 (실제 구현에서는 API나 파일시스템에서 가져오도록 수정 필요)
const SAMPLE_NOTICES = {
  'notice-1': {
    id: 'notice-1',
    title: '서한에프앤씨 웹사이트 리뉴얼 안내',
    category: '일반',
    author: '관리자',
    createdAt: '2023-11-15',
    updatedAt: '2023-11-17',
    isPinned: true,
    viewCount: 254,
    content: `# 서한에프앤씨 웹사이트 리뉴얼 안내\n\n안녕하세요, 서한에프앤씨 고객님.\n\n저희 서한에프앤씨의 웹사이트가 전면 리뉴얼되어 새롭게 오픈하였습니다. 이번 리뉴얼을 통해 더욱 직관적이고 사용하기 편리한 사용자 인터페이스를 제공하고, 모바일 환경에서도 최적화된 서비스를 이용하실 수 있게 되었습니다.\n\n## 주요 개선사항\n\n1. **반응형 디자인 적용**\n   - 모든 디바이스(PC, 태블릿, 모바일)에서 최적화된 화면 제공\n   - 화면 크기에 따라 자동으로 레이아웃 조정\n\n2. **제품 정보 개선**\n   - 더욱 상세한 제품 정보와 스펙 제공\n   - 제품 카테고리 재구성으로 쉬운 제품 탐색 가능\n   - 제품 사양서 및 매뉴얼 다운로드 기능 강화\n\n3. **고객지원 서비스 강화**\n   - 온라인 문의 시스템 개선\n   - 자주 묻는 질문(FAQ) 확대\n   - 제품별 기술 자료 제공\n\n4. **회사 소개 컨텐츠 확충**\n   - 회사 연혁 및 비전 콘텐츠 업데이트\n   - 핵심 기술력 및 특허 정보 추가\n\n앞으로도 저희 서한에프앤씨는 고객님께 더 나은 서비스와 정보를 제공하기 위해 지속적으로 노력하겠습니다. 새로운 웹사이트에 대한 의견이나 제안사항이 있으시면 언제든지 문의해 주시기 바랍니다.\n\n감사합니다.\n\n서한에프앤씨 드림`
  },
  'notice-2': {
    id: 'notice-2',
    title: '2023년 하반기 제품 출시 일정 안내',
    category: '제품',
    author: '관리자',
    createdAt: '2023-11-10',
    updatedAt: '2023-11-10',
    isPinned: true,
    viewCount: 187,
    content: `# 2023년 하반기 제품 출시 일정 안내\n\n안녕하세요, 서한에프앤씨입니다.\n\n2023년 하반기 신제품 출시 일정을 안내해 드립니다.\n\n## 출시 예정 제품 및 일정\n\n1. **SFC-X2000 시리즈 (산업용 센서)**\n   - 출시일: 2023년 12월 초\n   - 주요 특징: 고감도 센서, 방수/방진 IP68등급, 확장된 동작 온도 범위\n\n2. **SFCM-800 컨트롤러**\n   - 출시일: 2023년 12월 중순\n   - 주요 특징: 확장된 I/O 포트, 개선된 네트워크 연결성, 클라우드 연동 기능\n\n3. **SCL-P 시리즈 (경량화 소재)**\n   - 출시일: 2024년 1월 초\n   - 주요 특징: 향상된 내구성, 경량화 설계, 친환경 소재 적용\n\n## 사전 예약 안내\n\n모든 신제품은 출시 2주 전부터 사전 예약이 가능하며, 사전 예약 고객을 대상으로 특별 할인 및 추가 서비스를 제공할 예정입니다.\n\n사전 예약 및 제품에 대한 자세한 문의는 영업팀(sales@seohanfnc.com)으로 연락 주시기 바랍니다.\n\n감사합니다.`
  }
};

// 임시 데이터 함수 (실제 API 호출로 교체 필요)
const getNoticeById = async (id: string) => {
  console.log("Fetching notice:", id); // 데이터 로딩 확인용 로그
  // 샘플 데이터에서 찾기 (실제 구현에서는 API 사용)
  return SAMPLE_NOTICES[id as keyof typeof SAMPLE_NOTICES] || null;
};

// 모든 공지사항 ID 목록을 반환 (실제 데이터 로직으로 교체 필요)
// export async function generateStaticParams() {
//   // const notices = await getAllNoticeIds(); // 모든 공지사항 ID를 가져오는 함수
//   const notices = [{ id: 'sample-notice' }]; // 임시 데이터
//   return notices.map((notice) => ({
//     id: notice.id,
//   }));
// }

// generateStaticParams 수정: 샘플 데이터 ID 목록 반환
export async function generateStaticParams() {
  // 실제 구현에서는 모든 공지사항 ID를 가져오는 로직 필요
  // const notices = await getAllNoticeIds();
  // return notices.map(notice => ({ id: notice.id }));

  const noticeIds = Object.keys(SAMPLE_NOTICES);
  return noticeIds.map(id => ({
    id: id,
  }));
}

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await getNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <AdminLayout>
      <PageHeading title={notice.title} />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4 text-sm text-gray-500">
          작성일: {new Date(notice.createdAt).toLocaleDateString()} | 작성자: {notice.author}
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: notice.content }}
        />
      </div>
    </AdminLayout>
  );
} 