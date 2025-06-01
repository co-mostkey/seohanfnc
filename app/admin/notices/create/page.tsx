"use client";

import React, { useState } from 'react';
import { getImagePath } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Save, X, Check, Image as ImageIcon, FileUp, Plus, Trash2 } from 'lucide-react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PageHeading } from '@/components/ui/PageHeading';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 카테고리 목록
const categories = [
  { id: "일반", name: "일반" },
  { id: "뉴스", name: "뉴스" },
  { id: "업데이트", name: "업데이트" },
  { id: "이벤트", name: "이벤트" },
  { id: "점검", name: "점검" },
  { id: "테스트", name: "테스트" },
];

// 실제 공지사항 API 호출 함수
const createNoticeData = async (data: any) => {
  const response = await fetch('/api/notices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      category: data.category || '일반',
      isPinned: data.isPinned || false,
      author: data.author || 'Admin'
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: '공지사항 등록에 실패했습니다.' }));
    throw new Error(errorData.message || '공지사항 등록에 실패했습니다.');
  }

  return response.json();
};

export default function CreateNoticePage() {
  const router = useRouter();

  // 공지사항 상태
  const [notice, setNotice] = useState({
    title: '',
    category: '',
    content: '',
    isPinned: false,
  });

  // 검증 상태
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 임시 저장 및 제출 상태
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotice(prev => ({ ...prev, [name]: value }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotice(prev => ({ ...prev, [name]: checked }));
  };

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setNotice(prev => ({ ...prev, content }));

    // 입력 시 content 필드의 에러 메시지 제거
    if (errors.content) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!notice.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!notice.category) {
      newErrors.category = '카테고리를 선택해주세요';
    }

    if (!notice.content || notice.content === '<p><br></p>') {
      newErrors.content = '내용을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 임시 저장
  const handleSaveDraft = async () => {
    setIsSaving(true);

    try {
      // 실제 구현 시 API 호출
      console.log('임시 저장:', notice);

      // 성공 메시지 표시
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('임시 저장 중 오류 발생:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 공지사항 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createNoticeData(notice);
      if (result.success && result.data && result.data.id) {
        toast({
          title: "성공",
          description: "새 공지사항이 성공적으로 등록되었습니다.",
        });

        // 메인 공지사항 페이지로 이동
        router.push('/admin/notices');

      } else {
        throw new Error(result.message || 'Failed to create notice');
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "공지사항 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // 작성 취소
  const handleCancel = () => {
    if (notice.title || notice.content !== '<p><br></p>') {
      if (confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* 헤더 */}
      <header className="bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="mr-6" >
                <Image
                  src={getImagePath('/logo.png')}
                  alt="서한에프앤씨"
                  width={100}
                  height={30}
                  className="dark:invert"
                />
              </Link>
              <h1 className="text-xl font-bold">새 공지사항 작성</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-1.5" />
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1.5"></div>
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                임시 저장
              </button>
              <button
                type="submit"
                form="noticeForm"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                ) : (
                  <Check className="h-4 w-4 mr-1.5" />
                )}
                등록하기
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* 임시 저장 성공 메시지 */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <Check className="h-5 w-5 mr-2" />
          임시 저장되었습니다.
        </div>
      )}
      {/* 메인 콘텐츠 */}
      <main className="container mx-auto p-4 my-6 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로가기 */}
          <div className="mb-6">
            <Link
              href="/admin/notices"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              공지사항 목록으로 돌아가기
            </Link>
          </div>

          {/* 공지사항 작성 폼 */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            <form id="noticeForm" onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                {/* 제목 */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={notice.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-800 border ${errors.title ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="제목을 입력하세요"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                </div>

                {/* 카테고리 */}
                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <select
                      id="category"
                      name="category"
                      value={notice.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-800 border ${errors.category ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>

                {/* 상단 고정 */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    name="isPinned"
                    checked={notice.isPinned}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-600"
                  />
                  <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-300">
                    공지사항 상단에 고정
                  </label>
                </div>

                {/* 내용 에디터 */}
                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <div className={`${errors.content ? 'border border-red-500 rounded-md' : ''}`}>
                    <Textarea
                      id="content"
                      name="content"
                      value={notice.content}
                      onChange={handleEditorChange}
                      className={`w-full px-4 py-2 bg-gray-800 border ${errors.content ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                      placeholder="내용을 입력하세요"
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    이미지는 드래그 앤 드롭 또는 클립보드에서 붙여넣기로 추가할 수 있습니다.
                  </p>
                </div>

                {/* 첨부 파일 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    첨부 파일
                  </label>
                  <div className="border border-dashed border-gray-700 rounded-md p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileUp className="h-10 w-10 text-gray-500" />
                      <p className="text-sm text-gray-400">
                        파일을 끌어다 놓거나 클릭하여 업로드하세요
                      </p>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors mt-2"
                      >
                        파일 선택
                      </button>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    최대 파일 크기: 10MB, 지원 형식: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, ZIP
                  </div>
                </div>
              </div>

              {/* 폼 하단 */}
              <div className="bg-gray-900 px-6 py-4 border-t border-gray-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
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