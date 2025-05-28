'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Users,
  Filter,
  ChevronDown,
  Grid,
  List,
  Mail,
  Phone,
  Building,
  MapPin,
  User,
  SlidersHorizontal,
  X,
  UserPlus,
  ArrowDownAZ,
  ArrowUpDown
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
    isManager: true,
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
    isManager: true,
  },
  {
    id: 3,
    name: '박지성',
    position: '부장',
    department: '영업',
    email: 'sales.manager@seohanfnc.com',
    phone: '010-3456-7890',
    extension: '210',
    location: '본사 7층',
    avatar: '/images/avatars/avatar-3.jpg',
    isManager: true,
  },
  {
    id: 4,
    name: '최민지',
    position: '대리',
    department: '영업',
    email: 'sales.staff1@seohanfnc.com',
    phone: '010-4567-8901',
    extension: '211',
    location: '본사 7층',
    avatar: '/images/avatars/avatar-4.jpg',
    isManager: false,
  },
  {
    id: 5,
    name: '정수민',
    position: '과장',
    department: '마케팅',
    email: 'marketing.manager@seohanfnc.com',
    phone: '010-5678-9012',
    extension: '300',
    location: '본사 6층',
    avatar: '/images/avatars/avatar-5.jpg',
    isManager: true,
  },
  {
    id: 6,
    name: '강동원',
    position: '대리',
    department: '마케팅',
    email: 'marketing.staff1@seohanfnc.com',
    phone: '010-6789-0123',
    extension: '301',
    location: '본사 6층',
    avatar: '/images/avatars/avatar-6.jpg',
    isManager: false,
  },
  {
    id: 7,
    name: '임지원',
    position: '사원',
    department: '마케팅',
    email: 'marketing.staff2@seohanfnc.com',
    phone: '010-7890-1234',
    extension: '302',
    location: '본사 6층',
    avatar: '/images/avatars/avatar-7.jpg',
    isManager: false,
  },
  {
    id: 8,
    name: '한지민',
    position: '부장',
    department: '개발',
    email: 'dev.manager@seohanfnc.com',
    phone: '010-8901-2345',
    extension: '400',
    location: '본사 5층',
    avatar: '/images/avatars/avatar-8.jpg',
    isManager: true,
  },
  {
    id: 9,
    name: '오승환',
    position: '차장',
    department: '개발',
    email: 'dev.team1@seohanfnc.com',
    phone: '010-9012-3456',
    extension: '401',
    location: '본사 5층',
    avatar: '/images/avatars/avatar-9.jpg',
    isManager: false,
  },
  {
    id: 10,
    name: '윤서연',
    position: '과장',
    department: '개발',
    email: 'dev.team2@seohanfnc.com',
    phone: '010-0123-4567',
    extension: '402',
    location: '본사 5층',
    avatar: '/images/avatars/avatar-10.jpg',
    isManager: false,
  },
  {
    id: 11,
    name: '장미영',
    position: '부장',
    department: '인사',
    email: 'hr.manager@seohanfnc.com',
    phone: '010-1122-3344',
    extension: '500',
    location: '본사 4층',
    avatar: '/images/avatars/avatar-11.jpg',
    isManager: true,
  },
  {
    id: 12,
    name: '조현우',
    position: '대리',
    department: '인사',
    email: 'hr.staff1@seohanfnc.com',
    phone: '010-2233-4455',
    extension: '501',
    location: '본사 4층',
    avatar: '/images/avatars/avatar-12.jpg',
    isManager: false,
  },
  {
    id: 13,
    name: '권지용',
    position: '부장',
    department: '생산',
    email: 'production.manager@seohanfnc.com',
    phone: '010-3344-5566',
    extension: '600',
    location: '공장 2층',
    avatar: '/images/avatars/avatar-13.jpg',
    isManager: true,
  },
  {
    id: 14,
    name: '남주혁',
    position: '과장',
    department: '생산',
    email: 'production.team1@seohanfnc.com',
    phone: '010-4455-6677',
    extension: '601',
    location: '공장 1층',
    avatar: '/images/avatars/avatar-14.jpg',
    isManager: false,
  },
  {
    id: 15,
    name: '김태리',
    position: '대리',
    department: '생산',
    email: 'production.team2@seohanfnc.com',
    phone: '010-5566-7788',
    extension: '602',
    location: '공장 1층',
    avatar: '/images/avatars/avatar-15.jpg',
    isManager: false,
  },
  {
    id: 16,
    name: '이지은',
    position: '차장',
    department: '품질관리',
    email: 'qa.manager@seohanfnc.com',
    phone: '010-6677-8899',
    extension: '700',
    location: '공장 3층',
    avatar: '/images/avatars/avatar-16.jpg',
    isManager: true,
  },
  {
    id: 17,
    name: '박보검',
    position: '대리',
    department: '품질관리',
    email: 'qa.staff1@seohanfnc.com',
    phone: '010-7788-9900',
    extension: '701',
    location: '공장 3층',
    avatar: '/images/avatars/avatar-17.jpg',
    isManager: false,
  },
  {
    id: 18,
    name: '송중기',
    position: '부장',
    department: '재무',
    email: 'finance.manager@seohanfnc.com',
    phone: '010-8899-0011',
    extension: '800',
    location: '본사 3층',
    avatar: '/images/avatars/avatar-18.jpg',
    isManager: true,
  },
  {
    id: 19,
    name: '전지현',
    position: '과장',
    department: '재무',
    email: 'finance.staff1@seohanfnc.com',
    phone: '010-9900-1122',
    extension: '801',
    location: '본사 3층',
    avatar: '/images/avatars/avatar-19.jpg',
    isManager: false,
  },
  {
    id: 20,
    name: '현빈',
    position: '부장',
    department: '구매',
    email: 'purchase.manager@seohanfnc.com',
    phone: '010-0011-2233',
    extension: '900',
    location: '본사 2층',
    avatar: '/images/avatars/avatar-20.jpg',
    isManager: true,
  },
];

// 부서 목록
const departments = [
  { id: 'all', name: '전체 부서' },
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

// 부서별 색상
const departmentColors: Record<string, string> = {
  '경영지원': 'bg-blue-100 text-blue-800',
  '영업': 'bg-green-100 text-green-800',
  '마케팅': 'bg-purple-100 text-purple-800',
  '개발': 'bg-indigo-100 text-indigo-800',
  '인사': 'bg-pink-100 text-pink-800',
  '생산': 'bg-yellow-100 text-yellow-800',
  '품질관리': 'bg-cyan-100 text-cyan-800',
  '재무': 'bg-amber-100 text-amber-800',
  '구매': 'bg-emerald-100 text-emerald-800',
  'default': 'bg-gray-100 text-gray-800',
};

export default function MembersPage() {
  const [members, setMembers] = useState(initialMembers);
  const [filteredMembers, setFilteredMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<'name' | 'department' | 'position'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showManagersOnly, setShowManagersOnly] = useState(false);

  // 필터링 및 정렬 적용
  useEffect(() => {
    let result = [...members];

    // 부서 필터링
    if (selectedDepartment !== 'all') {
      result = result.filter(member => member.department === selectedDepartment);
    }

    // 관리자만 보기
    if (showManagersOnly) {
      result = result.filter(member => member.isManager);
    }

    // 검색어 필터링
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        member =>
          member.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          member.position.toLowerCase().includes(lowerCaseSearchTerm) ||
          member.department.toLowerCase().includes(lowerCaseSearchTerm) ||
          member.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          member.phone.includes(lowerCaseSearchTerm)
      );
    }

    // 정렬 적용
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'department') {
        comparison = a.department.localeCompare(b.department);
      } else if (sortField === 'position') {
        // 직급 정렬을 위한 가중치 부여
        const positionWeight: Record<string, number> = {
          '대표이사': 1,
          '이사': 2,
          '부장': 3,
          '차장': 4,
          '과장': 5,
          '대리': 6,
          '사원': 7,
        };

        const weightA = positionWeight[a.position] || 999;
        const weightB = positionWeight[b.position] || 999;

        comparison = weightA - weightB;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredMembers(result);
  }, [members, selectedDepartment, sortField, sortDirection, searchTerm, showManagersOnly]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 useEffect에서 처리됨
  };

  // 정렬 핸들러
  const handleSort = (field: 'name' | 'department' | 'position') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 아바타가 없는 경우 기본 이미지 및 이니셜 표시
  const renderAvatar = (member: typeof initialMembers[0]) => {
    if (member.avatar) {
      try {
        return (
          <div className="relative w-full h-full">
            <Image
              src={member.avatar}
              alt={`${member.name} 프로필 사진`}
              fill
              className="object-cover rounded-full"
            />
          </div>
        );
      } catch (error) {
        // 이미지 로드 실패 시 이니셜 표시
        const initials = member.name.charAt(0);
        return (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full text-xl font-semibold text-gray-600 dark:text-gray-300">
            {initials}
          </div>
        );
      }
    } else {
      // 아바타가 없는 경우 이니셜 표시
      const initials = member.name.charAt(0);
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full text-xl font-semibold text-gray-600 dark:text-gray-300">
          {initials}
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">임직원 목록</h1>
          <p className="text-gray-400">
            총 {filteredMembers.length}명의 임직원 정보가 있습니다
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            title="그리드 보기"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            title="리스트 보기"
          >
            <List className="h-5 w-5" />
          </button>

          <Link
            href="/intranet/members/invite"
            className="inline-flex items-center ml-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            임직원 초대
          </Link>
        </div>
      </div>
      {/* 필터 및 검색 */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-auto flex-grow">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름, 직책, 이메일, 연락처로 검색..."
                className="block w-full bg-gray-700 border-gray-600 pl-10 pr-4 py-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowManagersOnly(!showManagersOnly)}
              className={`inline-flex items-center px-3 py-2 rounded-md ${showManagersOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              <Users className="h-4 w-4 mr-1.5" />
              관리자만 보기
            </button>

            <div className="relative">
              <button
                className="inline-flex items-center px-3 py-2 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                정렬
                <ChevronDown className="h-4 w-4 ml-1.5" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                <div className="py-1">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <span>이름순</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort('department')}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <span>부서순</span>
                    {sortField === 'department' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort('position')}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <span>직급순</span>
                    {sortField === 'position' && (
                      sortDirection === 'asc'
                        ? <ArrowDownAZ className="h-4 w-4" />
                        : <ArrowUpDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 직원 목록 - 그리드 뷰 */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <Link
                key={member.id}
                href={`/intranet/members/${member.id}`}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                      {renderAvatar(member)}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{member.position}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${departmentColors[member.department] || departmentColors.default
                      }`}>
                      {member.department}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{member.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-500">다른 검색어나 필터 옵션을 시도해보세요</p>
            </div>
          )}
        </div>
      )}
      {/* 직원 목록 - 리스트 뷰 */}
      {viewMode === 'list' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-750 px-6 py-3 text-gray-300 text-sm">
            <div className="col-span-3">이름 / 직급</div>
            <div className="col-span-2">부서</div>
            <div className="col-span-3">이메일</div>
            <div className="col-span-2">연락처</div>
            <div className="col-span-2">위치</div>
          </div>

          {/* 직원 목록 */}
          <div className="divide-y divide-gray-700">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/intranet/members/${member.id}`}
                  className="block hover:bg-gray-750 transition-colors"
                >
                  {/* 데스크톱 뷰 */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-4">
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden">
                          {renderAvatar(member)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-sm text-gray-400">{member.position}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${departmentColors[member.department] || departmentColors.default
                        }`}>
                        {member.department}
                      </span>
                    </div>
                    <div className="col-span-3 text-gray-300 truncate">{member.email}</div>
                    <div className="col-span-2 text-gray-300">{member.phone}</div>
                    <div className="col-span-2 text-gray-300">{member.location}</div>
                  </div>

                  {/* 모바일 뷰 */}
                  <div className="md:hidden p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start">
                        <div className="relative w-12 h-12 mr-3 rounded-full overflow-hidden">
                          {renderAvatar(member)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-sm text-gray-400">{member.position}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${departmentColors[member.department] || departmentColors.default
                            }`}>
                            {member.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 pl-15">
                      <div className="flex items-center text-sm text-gray-400">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-1">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-500">다른 검색어나 필터 옵션을 시도해보세요</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 