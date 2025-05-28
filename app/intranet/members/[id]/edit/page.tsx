'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Award,
  Save,
  Trash2,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';

// 임시 직원 데이터
const initialMembers = [
  {
    id: 1,
    name: '김철수',
    position: '대표이사',
    department: '경영지원',
    email: 'ceo@seohanfnc.com',
    phone: '010-1234-5678',
    extension: '100',
    location: '본사 8층',
    avatar: '/images/avatars/avatar-1.jpg',
    joinDate: '2010-03-15',
    birthDate: '1970-06-15',
    address: '서울시 강남구',
    skills: ['경영', '전략기획', '리더십'],
    education: [
      { school: '서울대학교', degree: '경영학 석사', year: '1995' },
      { school: '서울대학교', degree: '경영학 학사', year: '1993' },
    ],
    biography: '서한에프앤씨에서 10년 이상 재직 중인 대표이사로, 회사의 전략 기획 및 경영 방향을 제시하고 있습니다. 업계에서 20년 이상의 경력을 바탕으로 회사의 성장을 이끌어왔습니다.',
  },
  {
    id: 2,
    name: '이영희',
    position: '이사',
    department: '영업',
    email: 'sales.director@seohanfnc.com',
    phone: '010-2345-6789',
    extension: '200',
    location: '본사 7층',
    avatar: '/images/avatars/avatar-2.jpg',
    joinDate: '2012-05-10',
    birthDate: '1975-09-22',
    address: '서울시 서초구',
    skills: ['영업관리', '협상', '고객관계관리'],
    education: [
      { school: '고려대학교', degree: '경영학 학사', year: '1998' },
    ],
    biography: '영업 부문을 총괄하는 이사로, 국내외 주요 고객사와의 관계 구축 및 영업 전략 수립을 담당하고 있습니다. 탁월한 협상 능력과 시장 분석 역량을 갖추고 있습니다.',
  },
];

// 부서 목록
const departments = [
  { id: '경영지원', name: '경영지원' },
  { id: '영업', name: '영업' },
  { id: '마케팅', name: '마케팅' },
  { id: '개발', name: '개발' },
  { id: '인사', name: '인사' },
  { id: '생산', name: '생산' },
  { id: '품질관리', name: '품질관리' },
  { id: '재무', name: '재무' },
  { id: '구매', name: '구매' },
];

// 직급 목록
const positions = [
  { id: '대표이사', name: '대표이사' },
  { id: '이사', name: '이사' },
  { id: '부장', name: '부장' },
  { id: '차장', name: '차장' },
  { id: '과장', name: '과장' },
  { id: '대리', name: '대리' },
  { id: '사원', name: '사원' },
];

export default function MemberEditPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 멤버 정보 상태
  const [memberData, setMemberData] = useState({
    id: 0,
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    extension: '',
    location: '',
    avatar: '',
    joinDate: '',
    birthDate: '',
    address: '',
    biography: '',
    skills: [] as string[],
    education: [] as { school: string; degree: string; year: string }[],
  });

  // 새로운 스킬과 학력을 위한 상태
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    year: ''
  });

  // 날짜 포맷 변환 (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // ID로 직원 찾기 (실제로는 API 호출)
  useEffect(() => {
    try {
      const id = Number(params.id);

      // 서버에서 직원 정보 조회 (실제 구현에서는 API 호출)
      const foundMember = initialMembers.find(m => m.id === id);

      if (foundMember) {
        // 날짜 포맷 변환
        setMemberData({
          ...foundMember,
          joinDate: formatDateForInput(foundMember.joinDate),
          birthDate: formatDateForInput(foundMember.birthDate),
        });
      } else {
        setError('요청하신 직원 정보를 찾을 수 없습니다.');
      }

      setLoading(false);
    } catch (err) {
      setError('직원 정보를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  }, [params?.id]);

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setMemberData({
      ...memberData,
      [name]: value
    });

    // 오류 지우기
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 실제 구현에서는 이미지 업로드 API 호출 후 URL 설정
      const imageUrl = URL.createObjectURL(file);

      setMemberData({
        ...memberData,
        avatar: imageUrl
      });
    }
  };

  // 스킬 추가 핸들러
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    setMemberData({
      ...memberData,
      skills: [...memberData.skills, newSkill.trim()]
    });

    setNewSkill('');
  };

  // 스킬 제거 핸들러
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...memberData.skills];
    updatedSkills.splice(index, 1);

    setMemberData({
      ...memberData,
      skills: updatedSkills
    });
  };

  // 학력 추가 핸들러
  const handleAddEducation = () => {
    if (!newEducation.school.trim() || !newEducation.degree.trim() || !newEducation.year.trim()) {
      return;
    }

    setMemberData({
      ...memberData,
      education: [...memberData.education, { ...newEducation }]
    });

    setNewEducation({
      school: '',
      degree: '',
      year: ''
    });
  };

  // 학력 제거 핸들러
  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...memberData.education];
    updatedEducation.splice(index, 1);

    setMemberData({
      ...memberData,
      education: updatedEducation
    });
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!memberData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!memberData.position) {
      newErrors.position = '직급을 선택해주세요.';
    }

    if (!memberData.department) {
      newErrors.department = '부서를 선택해주세요.';
    }

    if (!memberData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(memberData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!memberData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    }

    if (!memberData.joinDate) {
      newErrors.joinDate = '입사일을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // 오류가 있으면 폼 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    try {
      // 실제 구현에서는 API 호출로 직원 정보 업데이트
      // 저장 성공 시뮬레이션
      setTimeout(() => {
        setSaving(false);
        alert('직원 정보가 성공적으로 업데이트되었습니다.');
        router.push(`/intranet/members/${memberData.id}`);
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({
        ...errors,
        general: '직원 정보 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
      setSaving(false);
    }
  };

  // 이미지 선택 핸들러
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  // 아바타 렌더링
  const renderAvatar = () => {
    if (memberData.avatar) {
      try {
        return (
          <div className="relative w-full h-full">
            <Image
              src={memberData.avatar}
              alt={`${memberData.name} 프로필 사진`}
              fill
              className="object-cover rounded-full"
            />
          </div>
        );
      } catch (error) {
        // 이미지 로드 실패 시 이니셜 표시
        const initials = memberData.name.charAt(0);
        return (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full text-3xl font-semibold text-gray-600 dark:text-gray-300">
            {initials}
          </div>
        );
      }
    } else {
      // 아바타가 없는 경우 이니셜 표시
      const initials = memberData.name.charAt(0);
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full text-3xl font-semibold text-gray-600 dark:text-gray-300">
          {initials}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-32 w-32 bg-gray-700 rounded-full mb-6 mx-auto"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-lg text-gray-400 mb-6">{error}</p>
        <Link href="/intranet/members" className="inline-block text-blue-500 hover:text-blue-400">
          임직원 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link
          href={`/intranet/members/${memberData.id}`}
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          프로필로 돌아가기
        </Link>

        <h1 className="text-2xl font-semibold text-white">프로필 편집</h1>
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 프로필 이미지 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">프로필 이미지</h2>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              {renderAvatar()}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={handleImageSelect}
                className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              프로필 이미지는 1:1 비율의 정사각형 이미지를 권장합니다.
            </p>

            <button
              type="button"
              onClick={handleImageSelect}
              className="inline-flex items-center text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              이미지 업로드
            </button>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">기본 정보</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  이름*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={memberData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* 직급 */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
                  직급*
                </label>
                <select
                  id="position"
                  name="position"
                  value={memberData.position}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.position ? 'border-red-500' : 'border-gray-600'
                    }`}
                >
                  <option value="">직급 선택</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.position}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 부서 */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-1">
                  부서*
                </label>
                <select
                  id="department"
                  name="department"
                  value={memberData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.department ? 'border-red-500' : 'border-gray-600'
                    }`}
                >
                  <option value="">부서 선택</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
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

              {/* 입사일 */}
              <div>
                <label htmlFor="joinDate" className="block text-sm font-medium text-gray-300 mb-1">
                  입사일*
                </label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  value={memberData.joinDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.joinDate ? 'border-red-500' : 'border-gray-600'
                    }`}
                />
                {errors.joinDate && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.joinDate}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 생년월일 */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-1">
                  생년월일
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={memberData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 상세주소 */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                  상세주소
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={memberData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex) 서울시 강남구"
                />
              </div>
            </div>

            {/* 자기소개 */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-300 mb-1">
                자기소개
              </label>
              <textarea
                id="biography"
                name="biography"
                value={memberData.biography}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="간략한 자기소개를 입력하세요."
              ></textarea>
            </div>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">연락처 정보</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  이메일*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={memberData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  휴대전화*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={memberData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-600'
                    }`}
                  placeholder="ex) 010-1234-5678"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 내선번호 */}
              <div>
                <label htmlFor="extension" className="block text-sm font-medium text-gray-300 mb-1">
                  내선번호
                </label>
                <input
                  type="text"
                  id="extension"
                  name="extension"
                  value={memberData.extension}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex) 1234"
                />
              </div>

              {/* 근무 위치 */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                  근무 위치
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={memberData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex) 본사 3층"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 보유 기술 및 역량 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-6">보유 기술 및 역량</h2>

          <div className="space-y-6">
            {/* 보유 기술 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                보유 기술
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {memberData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-1.5 text-blue-400 hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 기술을 입력하세요"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md text-white transition-colors"
                  disabled={!newSkill.trim()}
                >
                  추가
                </button>
              </div>
            </div>

            {/* 학력 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                학력
              </label>

              {memberData.education.length > 0 && (
                <ul className="mb-4 space-y-2">
                  {memberData.education.map((edu, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-750 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{edu.school}</p>
                        <p className="text-xs text-gray-400">{edu.degree}, {edu.year}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={newEducation.school}
                    onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="학교명"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="학위/전공"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={newEducation.year}
                    onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="졸업년도"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="w-full h-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                    disabled={!newEducation.school.trim() || !newEducation.degree.trim() || !newEducation.year.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3">
          <Link
            href={`/intranet/members/${memberData.id}`}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            취소
          </Link>

          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white transition-colors flex items-center ${saving
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </form>
    </div>
  );
} 