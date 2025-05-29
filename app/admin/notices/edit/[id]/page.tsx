// export const dynamic = 'force-dynamic'; // 서버 컴포넌트에서는 불필요
// export const dynamicParams = false;

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout'; // 공통 레이아웃
import { NoticeEditForm } from '@/components/admin/NoticeEditForm'; // 클라이언트 컴포넌트 import
import { ArrowLeft } from 'lucide-react'; // 서버 컴포넌트에서 사용 가능
import { Notice } from '@/app/api/notices/route'; // Notice 타입을 가져옵니다.

// 데이터 가져오기 함수 (서버 컴포넌트 내에서 직접 사용 가능)
const getNoticeData = async (id: string): Promise<Notice | null> => {
  console.log(`Fetching notice data for ID (server): ${id}`);
  try {
    // 올바른 API 경로로 수정
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/notices/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch notice ${id}: ${res.status} ${res.statusText}`);
      const errorBody = await res.text();
      console.error(`Error body: ${errorBody}`);
      return null;
    }

    const response = await res.json();

    // API 응답 구조에 따라 데이터 추출
    const data = response.data || response;

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Notice 타입에 맞게 데이터 변환
      const noticeData: Notice = {
        id: data.id,
        title: data.title || '',
        content: data.content || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        author: data.author || '관리자',
        isPinned: data.isPinned === true, // boolean 확실히 처리
        category: data.category || '일반',
        viewCount: data.viewCount || 0
      };
      return noticeData;
    }
    console.error('Fetched data is not a single notice object:', data);
    return null;
  } catch (error) {
    console.error(`Error fetching notice ${id}:`, error);
    return null;
  }
};

// --- 정적 경로 생성 함수 (빌드 시 실행) ---
// 실제 데이터를 사용하는 경우, DB에서 ID 목록을 가져와야 함.
// export async function generateStaticParams() {
//   // 예시: 모든 공지사항 ID를 가져오는 API 호출 또는 DB 쿼리
//   // const notices = await fetch('http://localhost:3000/api/notices?limit=1000').then(res => res.json());
//   // const noticeIds = notices.data?.map((notice: Notice) => notice.id) || [];
//   // console.log('Generating static params for notice edit pages:', noticeIds);
//   // return noticeIds.map(id => ({
//   //   id: id,
//   // }));
//   return []; // 동적 렌더링을 위해 비워두거나, 필요한 경우 주석 해제
// }

// --- 페이지 컴포넌트 (서버 컴포넌트) ---
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeEditPageServer({ params }: PageProps) {
  const { id } = await params;
  const initialNotice = await getNoticeData(id);

  if (!initialNotice) {
    notFound(); // 데이터 없으면 404 페이지 표시
  }

  return (
    <AdminLayout>
      {/* 클라이언트 컴포넌트에 초기 데이터와 ID 전달 */}
      <NoticeEditForm
        initialNotice={{
          ...initialNotice,
          isPinned: initialNotice.isPinned ?? false
        }}
        noticeId={id}
      />
    </AdminLayout>
  );
}

// 기존 클라이언트 컴포넌트 로직은 NoticeEditForm.tsx 로 이동됨
// 이 파일은 이제 서버 컴포넌트로, 데이터 fetching과 클라이언트 컴포넌트 렌더링 담당 