'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  File,
  FileText,
  X,
  Plus,
  AlertCircle,
  Pin,
  Save,
  Send,
  Info
} from 'lucide-react';

// 카테고리 목록
const categories = [
  { id: '회사소식', name: '회사소식' },
  { id: '인사', name: '인사' },
  { id: '교육', name: '교육' },
  { id: '사내 활동', name: '사내 활동' },
  { id: '시설', name: '시설' },
];

// 파일 크기 포맷
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

// 파일 타입 아이콘
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const iconClass = "h-4 w-4 mr-2";

  if (['pdf'].includes(extension)) {
    return <FileText className={`${iconClass} text-red-400`} />;
  } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
    return <File className={`${iconClass} text-blue-400`} />;
  } else {
    return <File className={`${iconClass} text-gray-400`} />;
  }
};

export default function NoticeCreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 공지사항 데이터 상태
  const [noticeData, setNoticeData] = useState({
    title: '',
    content: '',
    category: '',
    isImportant: false,
    isPinned: false,
  });

  // 첨부파일 상태
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setNoticeData({
      ...noticeData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    });

    // 오류 지우기
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);

      // 오류 지우기
      if (errors.files) {
        const newErrors = { ...errors };
        delete newErrors.files;
        setErrors(newErrors);
      }
    }
  };

  // 파일 제거 핸들러
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!noticeData.title.trim()) {
      newErrors.title = '공지사항 제목을 입력해주세요.';
    }

    if (!noticeData.content.trim()) {
      newErrors.content = '공지사항 내용을 입력해주세요.';
    }

    if (!noticeData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 임시저장 핸들러
  const handleSaveDraft = () => {
    // 유효성 검사 없이 임시 저장
    setIsSaving(true);

    // 임시저장 API 호출 시뮬레이션
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);

      // 3초 후 저장 메시지 숨기기
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1000);
  };

  // 공지사항 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // 오류가 있으면 폼 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // [TRISID] 인트라넷 공지사항 등록 API 호출
      const response = await fetch('/api/intranet/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noticeData.title.trim(),
          content: noticeData.content.trim(),
          category: noticeData.category,
          isPinned: noticeData.isPinned,
          isImportant: noticeData.isImportant,
          // 작성자 정보는 세션에서 가져오거나 기본값 사용
          author: {
            id: 'current-user',
            name: '현재 사용자',
            position: '직원',
            department: '부서',
            avatar: '/images/avatars/default.jpg'
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '공지사항 등록에 실패했습니다.');
      }

      alert('공지사항이 성공적으로 등록되었습니다.');
      router.push('/intranet/notices');
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : '공지사항 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="mb-6">
        <Link
          href="/intranet/notices"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          공지사항 목록으로
        </Link>

        <h1 className="text-2xl font-semibold text-white">공지사항 작성</h1>
      </div>
      {/* 일반 오류 메시지 */}
      {errors.general && (
        <div className="rounded-md bg-red-900 bg-opacity-50 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-300">{errors.general}</p>
          </div>
        </div>
      )}
      {/* 임시저장 메시지 */}
      {isSaved && (
        <div className="rounded-md bg-blue-900 bg-opacity-50 p-4 mb-6">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-400" />
            <p className="ml-3 text-sm text-blue-300">임시저장 되었습니다.</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-6 rounded-lg">
        {/* 기본 정보 */}
        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              제목*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={noticeData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
              placeholder="공지사항 제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              카테고리*
            </label>
            <select
              id="category"
              name="category"
              value={noticeData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-600'
                }`}
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* 중요 공지 및 상단 고정 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isImportant"
                name="isImportant"
                checked={noticeData.isImportant}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <label htmlFor="isImportant" className="ml-2 text-sm text-gray-300">
                중요 공지로 표시
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPinned"
                name="isPinned"
                checked={noticeData.isPinned}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <label htmlFor="isPinned" className="ml-2 text-sm text-gray-300">
                상단에 고정
              </label>
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            내용*
          </label>
          <textarea
            id="content"
            name="content"
            value={noticeData.content}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.content ? 'border-red-500' : 'border-gray-600'
              }`}
            placeholder="공지사항 내용을 입력하세요"
            rows={10}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.content}
            </p>
          )}
        </div>

        {/* 첨부파일 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            첨부파일
          </label>

          <div
            className="border border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={handleFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
            />

            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-300 text-sm text-center">
              클릭하여 파일 첨부
            </p>
            <p className="text-gray-500 text-xs text-center mt-1">
              최대 10MB까지 업로드 가능합니다
            </p>
          </div>

          {/* 첨부된 파일 목록 */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                첨부된 파일 ({files.length})
              </h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center overflow-hidden">
                      {getFileIcon(file.name)}
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="p-1 ml-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
            className={`px-4 py-2 rounded-md text-white transition-colors flex items-center ${isSaving || isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600'
              }`}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {isSaving ? '저장 중...' : '임시저장'}
          </button>

          <Link
            href="/intranet/notices"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
          >
            취소
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || isSaving}
            className={`px-4 py-2 rounded-md text-white transition-colors flex items-center ${isSubmitting || isSaving
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            <Send className="h-4 w-4 mr-1.5" />
            {isSubmitting ? '등록 중...' : '공지사항 등록'}
          </button>
        </div>
      </form>
    </div>
  );
} 