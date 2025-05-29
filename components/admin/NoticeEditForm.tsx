"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  X,
  ArrowLeft,
  Pin,
  FileText,
  Bold,
  Italic,
  List,
  Link2
} from 'lucide-react';

// 표기 목록 (Props로 받거나, 여기서 직접 정의)
const CATEGORIES = [
  { id: 'general', name: '일반' },
  { id: 'important', name: '중요' },
  { id: 'product', name: '제품' },
  { id: 'company', name: '회사소식' },
  { id: 'recruit', name: '채용/협력' }
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
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 공지사항 상태 관리 (초기값은 props로 받음)
  const [title, setTitle] = useState(initialNotice.title);
  const [category, setCategory] = useState(initialNotice.category || '일반');
  const [content, setContent] = useState(initialNotice.content);
  const [isPinned, setIsPinned] = useState(initialNotice.isPinned);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 마크다운 도구 함수들
  const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const newContent = before + prefix + selectedText + suffix + after;

    setContent(newContent);

    // 포커스 복원 및 커서 위치 설정
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleBold = () => {
    insertMarkdown('**', '**', '굵은 텍스트');
  };

  const handleItalic = () => {
    insertMarkdown('_', '_', '기울임 텍스트');
  };

  const handleList = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;

    const before = textarea.value.substring(0, lineStart);
    const after = textarea.value.substring(start);

    const newContent = before + '- ' + after;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + 2, lineStart + 2);
    }, 10);
  };

  const handleLink = () => {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      insertMarkdown('[', `](${url})`, '링크 텍스트');
    }
  };

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
      // 실제 API 호출로 변경
      const response = await fetch(`/api/notices/${noticeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          content,
          isPinned,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '공지사항 수정에 실패했습니다.');
      }

      alert('공지사항이 성공적으로 수정되었습니다.');
      router.push('/admin/notices');
    } catch (error) {
      console.error('공지사항 수정 중 오류 발생:', error);
      alert('공지사항 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        router.push('/admin/notices');
      }
    } else {
      router.push('/admin/notices');
    }
  };

  // --- 여기서부터 JSX 반환 --- 
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
              href="/admin/notices"
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

            {/* 표기 및 상단 고정 */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 표기 선택 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  표기
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
            </div>

            {/* 마크다운 툴바 */}
            <div className="bg-gray-800 border border-gray-700 border-b-0 rounded-t-md p-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleBold}
                className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                title="굵게 (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleItalic}
                className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                title="기울임 (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-gray-700 mx-1" />
              <button
                type="button"
                onClick={handleList}
                className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                title="목록"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleLink}
                className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                title="링크 추가"
              >
                <Link2 className="h-4 w-4" />
              </button>
            </div>

            <textarea
              ref={contentRef}
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] bg-gray-800 border border-gray-700 rounded-b-md py-3 px-4 text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="내용을 입력하세요..."
              required
            />

            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p>지원하는 마크다운 문법:</p>
              <ul className="ml-4 space-y-0.5">
                <li>• **굵은 텍스트** → <strong>굵은 텍스트</strong></li>
                <li>• _기울임 텍스트_ → <em>기울임 텍스트</em></li>
                <li>• [링크 텍스트](URL) → 링크</li>
                <li>• - 목록 항목</li>
              </ul>
            </div>
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