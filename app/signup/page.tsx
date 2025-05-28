"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, Eye, X } from "lucide-react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Term {
  id: string;
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  isRequired: boolean;
  isActive: boolean;
}

// SignupFormData 인터페이스의 타입 수정
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

// 오류 상태 타입을 확장하여 form 및 agreeTermsError 필드 추가
interface SignupFormErrors extends Partial<SignupFormData> {
  form?: string;
  agreeTermsError?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showTermModal, setShowTermModal] = useState(false);
  const router = useRouter();

  // 약관 데이터 로드
  useEffect(() => {
    const loadTerms = async () => {
      try {
        const response = await fetch('/api/admin/terms?activeOnly=true');
        const data = await response.json();
        if (data.success) {
          setTerms(data.terms);
        }
      } catch (error) {
        console.error('약관 로드 오류:', error);
      }
    };
    loadTerms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if ((name === 'agreeTerms' || name === 'agreePrivacy') && errors.agreeTermsError) {
      setErrors(prev => ({ ...prev, agreeTermsError: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: SignupFormErrors = {};
    if (!formData.username) newErrors.username = "아이디를 입력해주세요";
    if (!formData.email) newErrors.email = "이메일을 입력해주세요";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "올바른 이메일 형식이 아닙니다";
    if (!formData.password) newErrors.password = "비밀번호를 입력해주세요";
    else if (formData.password.length < 6) newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    if (!formData.name) newErrors.name = "이름을 입력해주세요";
    if (!formData.phone) newErrors.phone = "연락처를 입력해주세요";
    else if (!/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) newErrors.phone = "올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)";

    // 필수 약관 동의 확인
    const requiredTerms = terms.filter(term => term.isRequired);
    const hasServiceTerm = requiredTerms.some(term => term.id === 'service');
    const hasPrivacyTerm = requiredTerms.some(term => term.id === 'privacy');

    if (hasServiceTerm && !formData.agreeTerms) {
      newErrors.agreeTermsError = "서비스 이용약관에 동의해주세요";
    }
    if (hasPrivacyTerm && !formData.agreePrivacy) {
      newErrors.agreeTermsError = "개인정보 처리방침에 동의해주세요";
    }

    setErrors(newErrors);
    const fieldErrorKeys = Object.keys(newErrors).filter(key => key !== 'form');
    return fieldErrorKeys.length === 0;
  };

  const openTermModal = (termId: string) => {
    const term = terms.find(t => t.id === termId);
    if (term) {
      setSelectedTerm(term);
      setShowTermModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, form: undefined }));
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      console.log("회원가입 요청:", formData);

      // 실제 회원가입 API 호출
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          marketingConsent: formData.agreeMarketing,
          privacyConsent: formData.agreePrivacy,
          serviceConsent: formData.agreeTerms
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("회원가입 성공:", result);
        // 성공 시 로그인 페이지로 이동
        router.push("/login?message=registration_success");
      } else {
        console.error("회원가입 실패:", result.error);
        setErrors(prev => ({ ...prev, form: result.error || "회원가입에 실패했습니다." }));
      }

    } catch (err: any) {
      console.error("회원가입 오류:", err);
      setErrors(prev => ({ ...prev, form: err.message || "회원가입 중 오류가 발생했습니다." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
      <Image
        src={`${basePath}/images/backgrounds/login-bg.png`}
        alt="Signup Background"
        fill
        className="object-cover object-center z-[-2]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
      <div className="relative w-full max-w-md bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1] mt-5 max-h-[90vh] overflow-y-auto">

        <div className="flex flex-col items-center mb-4">
          <Link href="/" className="mb-6" >
            <Image
              src={`${basePath}/logo.png`}
              alt="서한에프앤씨"
              width={100}
              height={33}
            />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">회원가입</h1>
          <p className="text-gray-300 text-sm">
            서한에프앤씨 회원 서비스에 가입합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1.5">
              아이디 <span className="text-red-400">*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="아이디 입력"
            />
            {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1.5">
              이메일 <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="이메일 입력"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1.5">
                비밀번호 <span className="text-red-400">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="비밀번호 입력"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1.5">
                비밀번호 확인 <span className="text-red-400">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="비밀번호 재입력"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1.5">
              이름 <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="이름 입력"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1.5">
              연락처 <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="010-0000-0000"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>

          {/* 약관 동의 섹션 */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-medium text-gray-200">약관 동의</h3>

            {/* 서비스 이용약관 */}
            {terms.find(t => t.id === 'service') && (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 rounded border-gray-500 bg-gray-700 focus:ring-orange-500 focus:ring-offset-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm flex-1">
                  <label htmlFor="agreeTerms" className="text-gray-300 flex items-center justify-between">
                    <span>
                      서비스 이용약관에 동의합니다
                      {terms.find(t => t.id === 'service')?.isRequired && <span className="text-red-400 ml-1">*</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => openTermModal('service')}
                      className="text-orange-400 hover:text-orange-300 transition-colors ml-2"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* 개인정보 처리방침 */}
            {terms.find(t => t.id === 'privacy') && (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreePrivacy"
                    name="agreePrivacy"
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 rounded border-gray-500 bg-gray-700 focus:ring-orange-500 focus:ring-offset-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm flex-1">
                  <label htmlFor="agreePrivacy" className="text-gray-300 flex items-center justify-between">
                    <span>
                      개인정보 처리방침에 동의합니다
                      {terms.find(t => t.id === 'privacy')?.isRequired && <span className="text-red-400 ml-1">*</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => openTermModal('privacy')}
                      className="text-orange-400 hover:text-orange-300 transition-colors ml-2"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {/* 마케팅 수신동의 */}
            {terms.find(t => t.id === 'marketing') && (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeMarketing"
                    name="agreeMarketing"
                    type="checkbox"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 rounded border-gray-500 bg-gray-700 focus:ring-orange-500 focus:ring-offset-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm flex-1">
                  <label htmlFor="agreeMarketing" className="text-gray-300 flex items-center justify-between">
                    <span>
                      마케팅 정보 수신에 동의합니다
                      {terms.find(t => t.id === 'marketing')?.isRequired && <span className="text-red-400 ml-1">*</span>}
                      <span className="text-gray-500 ml-1">(선택)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => openTermModal('marketing')}
                      className="text-orange-400 hover:text-orange-300 transition-colors ml-2"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </label>
                </div>
              </div>
            )}

            {errors.agreeTermsError && <p className="text-xs text-red-400">{errors.agreeTermsError}</p>}
          </div>

          {errors.form && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
              {errors.form}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  처리 중...
                </>
              ) : "회원가입"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
              로그인
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-orange-400 transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            메인으로 돌아가기
          </Link>
        </div>
      </div>

      {/* 약관 모달 */}
      {showTermModal && selectedTerm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                <h2 className="text-xl font-semibold">{selectedTerm.title}</h2>
                <span className="ml-2 text-sm text-gray-500">v{selectedTerm.version}</span>
              </div>
              <button
                onClick={() => setShowTermModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                  {selectedTerm.content}
                </pre>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowTermModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 