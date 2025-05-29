"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, UserCircle, ShieldAlert, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, RefreshCw, Database, LogIn, ArrowLeft, FileText, Shield, X, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

// 로그인 폼 컴포넌트
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showTermModal, setShowTermModal] = useState(false);

  // 컴포넌트 마운트 시 입력 필드 강제 초기화
  useEffect(() => {
    // 브라우저 자동완성으로 인한 미리 입력된 값 제거
    const clearInputs = () => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;

      if (emailInput) {
        emailInput.value = '';
      }
      if (passwordInput) {
        passwordInput.value = '';
      }

      // state도 확실히 초기화
      setFormData({
        email: '',
        password: ''
      });
    };

    // 약간의 지연 후 실행 (브라우저 자동완성이 적용된 후)
    const timer = setTimeout(clearInputs, 100);

    return () => clearTimeout(timer);
  }, []);

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

  // URL 파라미터에서 메시지 확인
  useEffect(() => {
    const message = searchParams?.get('message');
    if (message === 'registration_success') {
      setSuccess('회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.');
    }
  }, [searchParams]);

  // 이미 로그인된 사용자 체크
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/member-verify');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.log('인증 확인 중 오류:', error);
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
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
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/member-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('로그인에 성공했습니다. 잠시 후 대시보드로 이동합니다.');

        // 1초 후 대시보드로 이동
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
        <Image
          src={`${basePath}/images/backgrounds/login-bg.png`}
          alt="Login Background"
          fill
          className="object-cover object-center z-[-2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
        <div className="relative w-full max-w-md bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">

          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="mb-6">
              <Image
                src={`${basePath}/logo.png`}
                alt="서한에프앤씨"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">회원 로그인</h1>
            <p className="text-gray-300 text-sm text-center">
              서한F&C 회원 계정으로 로그인하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 pr-12"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            {/* 성공 메시지 */}
            {success && (
              <div className="text-green-400 text-sm bg-green-500/10 border border-green-500/40 rounded-lg p-3 text-center">
                {success}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </div>
              )}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              아직 계정이 없으신가요?{' '}
              <Link
                href="/register"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                회원가입
              </Link>
            </p>
          </div>

          {/* 약관 및 개인정보 처리방침 링크 */}
          <div className="mt-4 text-center">
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <button
                type="button"
                onClick={() => openTermModal('service')}
                className="hover:text-orange-400 transition-colors"
              >
                이용약관
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => openTermModal('privacy')}
                className="hover:text-orange-400 transition-colors"
              >
                개인정보처리방침
              </button>
            </div>
          </div>

          {/* 관리자 로그인 링크 */}
          <div className="mt-4 text-center">
            <Link
              href="/admin"
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              관리자 로그인
            </Link>
          </div>

          {/* 메인으로 돌아가기 */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-orange-400 transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 약관 모달 */}
      {showTermModal && selectedTerm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700/60">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center">
                {selectedTerm.id === 'privacy' ? (
                  <Shield className="h-5 w-5 mr-2 text-orange-400" />
                ) : selectedTerm.id === 'service' ? (
                  <FileText className="h-5 w-5 mr-2 text-orange-400" />
                ) : (
                  <Mail className="h-5 w-5 mr-2 text-orange-400" />
                )}
                <h2 className="text-xl font-semibold text-white">{selectedTerm.title}</h2>
                <span className="ml-2 text-sm text-gray-400">v{selectedTerm.version}</span>
              </div>
              <button
                onClick={() => setShowTermModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-300">
                  {selectedTerm.content}
                </pre>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => setShowTermModal(false)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 로딩 컴포넌트
function LoginLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 overflow-hidden z-[0]">
      <Image
        src={`${basePath}/images/backgrounds/login-bg.png`}
        alt="Login Background"
        fill
        className="object-cover object-center z-[-2]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-[-1]" />
      <div className="relative w-full max-w-md bg-black/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/60 z-[1]">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
} 