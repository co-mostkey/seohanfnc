"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Save,
  X,
  ArrowLeft,
  Pin,
  FileText
} from 'lucide-react';

// 카테고리 목록 (Props로 받거나, 여기서 직접 정의)
const CATEGORIES = [
  { id: 'general', name: '일반' },
  { id: 'product', name: '제품' },
  { id: 'event', name: '이벤트' },
  { id: 'service', name: '서비스' },
  { id: 'update', name: '업데이트' },
];

// 임시 데이터 업데이트 함수 (실제 API 호출로 교체 필요)
const updateNoticeData = async (id: string, data: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Updating notice:', id, data);
  // In real app, send PUT/PATCH request to API
  return { success: true };
};

interface NoticeData {
  id: string;
  title: string;
  category?: string;
  content: string;
  isPinned: boolean;
  // 필요한 다른 필드 추가
}

interface NoticeEditFormProps {
  initialNotice: NoticeData;
  noticeId: string;
}

export function NoticeEditForm({ initialNotice, noticeId }: NoticeEditFormProps) {
  const router = useRouter();

  // 공지사항 상태 관리 (초기값은 props로 받음)
  const [title, setTitle] = useState(initialNotice.title);
  const [category, setCategory] = useState(initialNotice.category || '일반');
  const [content, setContent] = useState(initialNotice.content);
  const [isPinned, setIsPinned] = useState(initialNotice.isPinned);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제 구현에서는 API 호출
      await updateNoticeData(noticeId, { title, category, content, isPinned });

      alert('공지사항이 성공적으로 저장되었습니다.'); // 임시 알림
      router.push('/admin/posts?board=notice');
    } catch (error) {
      console.error('공지사항 저장 중 오류 발생:', error);
      alert('공지사항 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (
      title !== initialNotice.title ||
      category !== initialNotice.category ||
      content !== initialNotice.content ||
      isPinned !== initialNotice.isPinned
    ) {
      if (window.confirm('변경 사항이 저장되지 않습니다. 취소하시겠습니까?')) {
        router.push('/admin/posts?board=notice');
      }
    } else {
      router.push('/admin/posts?board=notice');
    }
  };

  // --- 여기서부터 JSX 반환 --- 
  // 기존 NoticeEditPage 컴포넌트의 return 문 내부 JSX를 여기에 붙여넣습니다.
  // 단, AdminLayout 은 page.tsx 에서 감싸므로 여기서는 제외합니다.
  return (
    <div className="bg-gray-900 text-white">
      {/* 헤더 (필요 시 AdminLayout과 분리하여 여기 두거나, page.tsx에서 관리) */}
      <header className="bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">공지사항 수정</h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-1.5" />
              취소
            </button>
            <button
              type="submit" // 폼 제출 버튼으로 변경
              form="noticeEditForm" // 아래 form 태그의 id와 연결
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </header>
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto p-4 my-6">
        {/* 네비게이션 */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <Link
              href="/admin/posts?board=notice"
              className="hover:text-white transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              게시판으로 돌아가기
            </Link>
          </div>
          {/* Breadcrumb (필요시 추가) */}
        </div>

        {/* 공지사항 수정 폼 */}
        <form id="noticeEditForm" onSubmit={handleSubmit} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
          {/* 기본 정보 */}
          <div className="p-6 border-b border-gray-800">
            {/* 제목 입력 필드 */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="공지사항 제목을 입력하세요"
                required
              />
            </div>

            {/* 카테고리 및 상단 고정 */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 카테고리 선택 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  카테고리
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 상단 고정 체크박스 */}
              <div className="flex items-center h-full pt-7">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${isPinned ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 transition-transform duration-200 ease-linear transform bg-white rounded-full ${isPinned ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-300 flex items-center">
                    <Pin className={`h-4 w-4 mr-1 ${isPinned ? 'text-blue-400' : 'text-gray-500'}`} />
                    상단에 고정
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 본문 에디터 */}
          <div className="p-6">
            {/* 내용 입력 (Textarea 또는 ReactQuill) */}
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                내용
              </label>
              {/* 마크다운 가이드 표시 등 */}
            </div>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="내용을 입력하세요..."
              required
            />
            {/* 미리보기 (선택 사항) */}
          </div>

          {/* 작업 버튼 (폼 내부에 둘 수도 있음) */}
          <div className="bg-gray-900 border-t border-gray-800 p-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors flex items-center"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </main>
      {/* 푸터 (필요 시 AdminLayout과 분리하여 여기 두거나, page.tsx에서 관리) */}
      <footer className="bg-gray-950 border-t border-gray-800 p-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} 서한에프앤씨 관리자 시스템. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default NoticeEditForm; // 기본 내보내기 추가 