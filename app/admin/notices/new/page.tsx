"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, RotateCw, Trash2, Bold, Italic, List, Link2 } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ["일반", "중요", "제품", "회사소식", "채용/협력"];

interface FormState {
  title: string;
  category: string;
  content: string;
  isPinned: boolean;
}

export default function NewNotice() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [formState, setFormState] = useState<FormState>({
    title: '',
    category: '일반',
    content: '',
    isPinned: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
  };

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

    setFormState(prev => ({ ...prev, content: newContent }));

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
    setFormState(prev => ({ ...prev, content: newContent }));

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

    // 유효성 검사
    if (!formState.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formState.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formState.title.trim(),
          content: formState.content.trim(),
          category: formState.category,
          isPinned: formState.isPinned,
          author: '관리자', // 실제 구현 시 로그인한 관리자 정보 사용
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '공지사항 저장에 실패했습니다.');
      }

      // 성공적으로 저장되었다는 알림
      alert('공지사항이 성공적으로 저장되었습니다.');

      // 공지사항 목록 페이지로 리디렉션
      router.push('/admin/notices');
    } catch (error) {
      console.error('공지사항 저장 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '공지사항 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    if (window.confirm('작성 중인 내용이 모두 삭제됩니다. 초기화하시겠습니까?')) {
      setFormState({
        title: '',
        category: '일반',
        content: '',
        isPinned: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="bg-gray-950 border-b border-gray-800 p-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">새 공지사항 작성</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/notices"
              className="flex items-center px-3 py-1.5 bg-gray-800 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              공지사항 목록
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto p-4 my-6">
        <form onSubmit={handleSubmit} className="bg-gray-950 border border-gray-800 rounded-lg p-6">
          {/* 상단 정보 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* 제목 (2/4 너비) */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formState.title}
                onChange={handleInputChange}
                placeholder="공지사항 제목을 입력하세요"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 표기 (1/4 너비) */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                표기 <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 상단 고정 옵션 (1/4 너비) */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPinned"
                name="isPinned"
                checked={formState.isPinned}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-700 focus:ring-blue-500"
              />
              <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-300">
                상단 고정
              </label>
            </div>
          </div>

          {/* 내용 에디터 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
              내용 <span className="text-red-500">*</span>
            </label>

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
              value={formState.content}
              onChange={handleInputChange}
              placeholder="공지사항 내용을 입력하세요..."
              className="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-700 rounded-b-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              required
            ></textarea>
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

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-sm text-gray-300 transition-colors"
            >
              <RotateCw className="h-4 w-4 mr-1.5" />
              초기화
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/notices')}
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-sm text-gray-300 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>

        {/* 팁 섹션 */}
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-medium text-blue-300 mb-2">작성 팁</h3>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>공지사항 제목은 명확하고 간결하게 작성해주세요.</li>
            <li>중요한 공지사항은 '상단 고정' 옵션을 사용하면 목록의 최상단에 표시됩니다.</li>
            <li>마크다운 문법을 사용하여 텍스트를 꾸밀 수 있습니다.</li>
            <li>툴바 버튼을 사용하거나 직접 마크다운 문법을 입력할 수 있습니다.</li>
            <li>공지사항 작성 후 저장하면 바로 사이트에 게시됩니다.</li>
          </ul>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-950 border-t border-gray-800 p-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} 서한에프앤씨 관리자 시스템. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 