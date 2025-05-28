import React from 'react';
import { Metadata } from 'next';
import { FiUser, FiMail, FiPhone, FiInfo, FiFileText, FiSend, FiCheckCircle } from 'react-icons/fi';

export const metadata: Metadata = {
  title: '온라인 견적 | 고객 지원 | 서한산업',
  description: '서한산업의 제품 및 서비스에 대한 온라인 견적을 신청하실 수 있습니다.',
};

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">온라인 견적</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            서한산업의 제품 및 서비스에 대한 견적을 온라인으로 신청하실 수 있습니다.
            아래 양식을 작성하여 제출해 주시면 담당자가 확인 후 빠르게 연락드리겠습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* 견적 프로세스 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mb-3">
                  <FiFileText className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">1. 양식 작성</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  견적 요청 양식을 작성하고 필요한 정보를 제공해 주세요.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mb-3">
                  <FiSend className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">2. 검토 및 견적 산출</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  담당자가 요청 내용을 검토하고 맞춤형 견적을 준비합니다.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 mb-3">
                  <FiCheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">3. 견적서 수령</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  이메일로 견적서를 받아보시고, 추가 문의사항은 담당자와 상담하세요.
                </p>
              </div>
            </div>
          </div>

          {/* 견적 양식 */}
          <form className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 개인 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                  고객 정보
                </h2>

                {/* 이름 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    이름/담당자명 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="홍길동"
                      required
                    />
                  </div>
                </div>

                {/* 회사명 */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    회사명/기관명 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiInfo className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="company"
                      className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="OO 주식회사"
                      required
                    />
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="example@company.com"
                      required
                    />
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="010-1234-5678"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 견적 정보 섹션 */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                  견적 요청 정보
                </h2>

                {/* 제품/서비스 카테고리 */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    제품/서비스 카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">카테고리 선택</option>
                    <option value="전기제어반">전기제어반</option>
                    <option value="공정자동화시스템">공정자동화시스템</option>
                    <option value="에너지관리솔루션">에너지관리솔루션</option>
                    <option value="통신설비">통신설비</option>
                    <option value="유지보수서비스">유지보수 서비스</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                {/* 예산 범위 */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    예산 범위
                  </label>
                  <select
                    id="budget"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">예산 범위 선택 (선택사항)</option>
                    <option value="1000만원 미만">1,000만원 미만</option>
                    <option value="1000만원-5000만원">1,000만원 - 5,000만원</option>
                    <option value="5000만원-1억원">5,000만원 - 1억원</option>
                    <option value="1억원-5억원">1억원 - 5억원</option>
                    <option value="5억원 이상">5억원 이상</option>
                  </select>
                </div>

                {/* 납품 희망 시기 */}
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    납품 희망 시기
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* 견적 요청 세부사항 */}
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    견적 요청 세부사항 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="details"
                    rows={5}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="필요한 제품/서비스에 대한 세부 요구사항을 자세히 작성해 주세요."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 파일 첨부 */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                참고 자료 첨부 (선택사항)
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
                      className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus-within:outline-none"
                    >
                      <span>파일 선택</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                    </label>
                    <p className="pl-1">또는 여기로 파일을 끌어다 놓으세요</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF, DOCX (최대 10MB)</p>
                </div>
              </div>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mt-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
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
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    제공해주신 정보는 견적 요청 목적으로만 사용되며, 관련 법률에 의거하여 안전하게 보호됩니다. 
                    자세한 내용은 <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">개인정보처리방침</a>을 참조하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                견적 요청하기
              </button>
            </div>
          </form>
        </div>

        {/* 부가 정보 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">견적 요청 후 얼마나 기다려야 하나요?</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  견적 요청은 영업일 기준 1~3일 내에 처리됩니다. 복잡한 프로젝트의 경우 추가 시간이 소요될 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">견적에 포함되는 내용은 무엇인가요?</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  견적서에는 제품/서비스 명세, 가격, 납품 일정, 지원 범위, 결제 조건 등이 포함됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">견적은 얼마나 유효한가요?</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  견적서는 발행일로부터 30일간 유효합니다. 시장 상황에 따라 가격이 변동될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">직접 문의하기</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              온라인 견적 이외에도 아래 연락처로 직접 문의하실 수 있습니다.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white">전화 문의</p>
                  <p>영업부: 1588-1234 (평일 09:00-18:00)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white">이메일 문의</p>
                  <p>sales@seohanindustry.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white">방문 상담</p>
                  <p>경기도 화성시 동탄대로 123 서한산업 본사</p>
                  <p className="mt-1">※ 방문 상담은 사전 예약이 필요합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 