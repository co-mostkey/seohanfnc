import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiInfo } from 'react-icons/fi';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '온라인 견적 요청 | 서한산업',
  description: '서한산업 제품에 대한 견적을 온라인으로 요청하세요.',
};

export default function EstimatePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 이동 경로 */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-500">
          홈
        </Link>
        <FiChevronRight className="mx-2" />
        <Link href="/support" className="hover:text-primary-600 dark:hover:text-primary-500">
          고객지원
        </Link>
        <FiChevronRight className="mx-2" />
        <span className="text-gray-700 dark:text-gray-300">온라인 견적 요청</span>
      </div>
      
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">온라인 견적 요청</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          서한산업의 제품에 대한 견적을 온라인으로 요청하실 수 있습니다. 아래 양식을 작성하여 제출해 주시면 담당자가 확인 후 빠르게 연락드리겠습니다.
        </p>
      </div>
      
      {/* 견적 요청 양식 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">견적 요청 양식</h2>
        </div>
        
        <form className="p-6">
          {/* 필수 입력 안내 */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 기본 정보 섹션 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  회사명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  담당자명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="010-0000-0000"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* 제품 정보 섹션 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">제품 정보</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  제품 카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  id="productCategory"
                  name="productCategory"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">카테고리 선택</option>
                  <option value="카테고리1">전기 파워 시스템</option>
                  <option value="카테고리2">제어 시스템</option>
                  <option value="카테고리3">자동화 장비</option>
                  <option value="카테고리4">기타</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  제품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  수량 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  요청 사항 및 상세 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="제품 사양, 사용 환경, 추가 요구사항 등 상세 내용을 기재해 주세요."
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  첨부 파일
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-500 hover:text-primary-500 dark:hover:text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>파일 업로드</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">또는 여기에 파일을 끌어 놓으세요</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (최대 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 개인정보 수집 동의 */}
          <div className="mb-8">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacy"
                  name="privacy"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="privacy" className="font-medium text-gray-700 dark:text-gray-300">
                  개인정보 수집 및 이용 동의 <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  견적 요청을 위한 개인정보 수집 및 이용에 동의합니다. 
                  <Link href="/privacy-policy" className="text-primary-600 dark:text-primary-500 hover:underline ml-1">
                    개인정보처리방침 보기
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* 제출 버튼 */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
            >
              견적 요청하기
            </button>
          </div>
        </form>
      </div>
      
      {/* 안내 사항 */}
      <div className="mt-10 bg-gray-50 dark:bg-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">견적 요청 안내 사항</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            제출하신 견적 요청은 영업일 기준 24시간 내에 처리됩니다.
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            견적서는 요청하신 이메일로 발송됩니다.
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            상세한 정보를 제공해 주실수록 더 정확한 견적을 받으실 수 있습니다.
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            견적에 대한 문의사항은 <a href="tel:02-1234-5678" className="text-primary-600 dark:text-primary-500 hover:underline">02-1234-5678</a> 또는 <a href="mailto:sales@seohan.com" className="text-primary-600 dark:text-primary-500 hover:underline">sales@seohan.com</a>으로 연락주시기 바랍니다.
          </li>
        </ul>
      </div>
    </div>
  );
} 