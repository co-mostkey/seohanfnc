'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  File,
  FileText,
  X,
  Plus,
  Tag,
  Lock,
  Globe,
  Calendar,
  User,
  Building,
  AlertCircle
} from 'lucide-react';

// 부서 목록
const departments = [
  { id: 'all', name: '전체' },
  { id: 'management', name: '경영지원' },
  { id: 'sales', name: '영업' },
  { id: 'marketing', name: '마케팅' },
  { id: 'development', name: '개발' },
  { id: 'hr', name: '인사' },
];

// 파일 타입별 아이콘
const fileIcons: Record<string, React.ReactNode> = {
  'pdf': <FileText className="h-10 w-10 text-red-400" />,
  'docx': <FileText className="h-10 w-10 text-blue-400" />,
  'xlsx': <FileText className="h-10 w-10 text-green-400" />,
  'pptx': <FileText className="h-10 w-10 text-orange-400" />,
  'default': <File className="h-10 w-10 text-gray-400" />,
};

// 파일 확장자를 기반으로 아이콘 가져오기
const getFileIcon = (fileType: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  if (fileType === 'pdf') return <FileText className={`${sizeClasses[size]} text-red-400`} />;
  if (fileType === 'docx') return <FileText className={`${sizeClasses[size]} text-blue-400`} />;
  if (fileType === 'xlsx') return <FileText className={`${sizeClasses[size]} text-green-400`} />;
  if (fileType === 'pptx') return <FileText className={`${sizeClasses[size]} text-orange-400`} />;
  return <File className={`${sizeClasses[size]} text-gray-400`} />;
};

// 파일 크기 포맷
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export default function DocumentUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    isPublic: true,
    tags: [] as string[],
    tagInput: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 파일 선택 핸들러
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  // 파일 제거 핸들러
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // 입력 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 오류 지우기
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // 공개 여부 토글
  const handleTogglePublic = () => {
    setFormData({ ...formData, isPublic: !formData.isPublic });
  };

  // 태그 추가 핸들러
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (
      (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') ||
      !formData.tagInput.trim()
    ) {
      return;
    }

    e.preventDefault();

    // 중복 태그 확인
    if (!formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: '',
      });
    } else {
      setFormData({
        ...formData,
        tagInput: '',
      });
    }
  };

  // 태그 제거 핸들러
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '문서 제목을 입력해주세요.';
    }

    if (!formData.department) {
      newErrors.department = '부서를 선택해주세요.';
    }

    if (files.length === 0) {
      newErrors.files = '최소 1개 이상의 파일을 업로드해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 업로드 핸들러
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);

      // 실제 구현에서는 API 호출로 파일 업로드
      // 업로드 진행 상황 시뮬레이션
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // 3초 후 업로드 완료 시뮬레이션
      setTimeout(() => {
        clearInterval(timer);
        setUploadProgress(100);

        // 업로드 성공 처리
        alert('문서가 성공적으로 업로드되었습니다.');

        // 문서함 페이지로 이동
        window.location.href = '/intranet/documents';
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({
        ...errors,
        general: '문서 업로드 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="mb-6">
        <Link
          href="/intranet/documents"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          문서함으로 돌아가기
        </Link>

        <h1 className="text-2xl font-semibold text-white">문서 업로드</h1>
      </div>
      <form onSubmit={handleUpload}>
        <div className="space-y-8 bg-gray-800 p-6 rounded-lg">
          {/* 파일 드래그 앤 드롭 영역 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              파일 업로드
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors ${errors.files ? 'border-red-500' : 'border-gray-600'
                }`}
              onClick={handleFileSelect}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileChange}
              />

              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-300 text-center mb-1">
                클릭하여 파일 선택 또는 파일을 여기에 드래그하세요
              </p>
              <p className="text-gray-500 text-sm text-center">
                최대 50MB까지 업로드 가능합니다
              </p>

              {errors.files && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.files}
                </p>
              )}
            </div>

            {/* 선택된 파일 목록 */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-300">선택된 파일 ({files.length})</h3>
                <ul className="divide-y divide-gray-700 bg-gray-750 rounded-md">
                  {files.map((file, index) => {
                    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
                    return (
                      <li key={index} className="p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(fileExt, 'sm')}
                          <div>
                            <p className="text-sm text-white truncate max-w-xs">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          className="p-1 rounded-full hover:bg-gray-600 text-gray-400 hover:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* 문서 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                문서 제목*
              </label>
              <div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-600'
                    }`}
                  placeholder="문서 제목을 입력하세요"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                문서 설명
              </label>
              <div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="문서에 대한 간략한 설명을 입력하세요 (선택사항)"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="department" className="block text-sm font-medium text-gray-300">
                부서*
              </label>
              <div>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.department ? 'border-red-500' : 'border-gray-600'
                    }`}
                >
                  <option value="">부서 선택</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  문서 공개 설정
                </label>
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${formData.isPublic ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {formData.isPublic ? (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>모든 사용자가 문서를 볼 수 있습니다</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>내 부서원만 문서를 볼 수 있습니다</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">
                태그
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-700 border border-gray-600 rounded-md">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center bg-blue-900 text-blue-200 rounded-full px-2.5 py-0.5 text-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="text"
                    value={formData.tagInput}
                    onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                    className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                    placeholder={formData.tags.length === 0 ? "태그 입력 후 Enter..." : ""}
                  />
                </div>
                {formData.tagInput.trim() && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-1 rounded-full bg-blue-700 text-white hover:bg-blue-600"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Enter 키를 눌러 태그를 추가하세요. 태그는 검색과 필터링에 사용됩니다.
              </p>
            </div>
          </div>

          {/* 업로드 진행 상태 */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">업로드 진행 중...</span>
                <span className="text-sm text-gray-300">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 일반 오류 메시지 */}
          {errors.general && (
            <div className="rounded-md bg-red-900 bg-opacity-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-300">{errors.general}</p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/intranet/documents"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 rounded-md text-white transition-colors flex items-center ${isUploading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              {isUploading ? '업로드 중...' : '업로드'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 