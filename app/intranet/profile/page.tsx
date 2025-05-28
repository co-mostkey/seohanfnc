'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Key,
  Shield,
  Edit,
  Save,
  X,
  Calendar,
  HelpCircle,
  Building,
  Tag,
  MapPin,
  Clock,
  UserCog,
  Languages,
  Moon,
  Upload,
  Users,
  Check,
  Download
} from 'lucide-react';

// 사용자 정보 (실제로는 서버에서 가져옴)
const userData = {
  id: 1,
  name: '김철수',
  email: 'ceo@seohanfnc.com',
  phone: '010-1234-5678',
  position: '대표이사',
  department: '경영지원',
  employeeId: 'SH001',
  joinDate: '2010-03-01',
  birthDate: '1975-05-15',
  address: '서울시 강남구 테헤란로 123',
  avatar: '/images/avatars/avatar-1.jpg',
  bio: '서한에프앤씨 대표이사. 전략적 비전과 리더십으로 회사를 이끌고 있습니다.',
  role: 'admin', // admin, manager, user
  lastActive: '2024-04-18T09:30:00',
  skills: ['경영 전략', '인사 관리', '재무 분석', '마케팅 전략'],
  language: 'ko',
  theme: 'dark',
  notifications: {
    email: true,
    push: true,
    messages: true,
    tasks: true,
    announcements: true
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-15',
    sessions: [
      {
        device: 'Chrome on Windows',
        ip: '192.168.1.101',
        location: '서울, 대한민국',
        lastActive: '2024-04-18T09:30:00',
        current: true
      },
      {
        device: 'Safari on iPhone',
        ip: '192.168.0.105',
        location: '서울, 대한민국',
        lastActive: '2024-04-17T18:45:00',
        current: false
      }
    ]
  }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    address: userData.address
  });
  const [notifications, setNotifications] = useState(userData.notifications);

  // 프로필 업데이트 핸들러
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API 호출
    setIsEditing(false);
    // 성공 메시지 표시
  };

  // 알림 설정 변경 핸들러
  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    // 실제로는 API 호출로 저장
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">계정 설정</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* 사이드바 */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
            <div className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="relative h-24 w-24 rounded-full overflow-hidden">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                  <Upload className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-medium text-white">{userData.name}</h2>
              <p className="text-gray-400 text-sm">{userData.position}</p>
              <p className="text-gray-400 text-sm">{userData.department}</p>

              <div className="flex items-center mt-4 text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>마지막 접속: 오늘 오전 9:30</span>
              </div>
            </div>

            <div className="border-t border-gray-700">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'profile'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-750 hover:text-white'
                    }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  프로필 정보
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'notifications'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-750 hover:text-white'
                    }`}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  알림 설정
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'security'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-750 hover:text-white'
                    }`}
                >
                  <Lock className="h-5 w-5 mr-3" />
                  보안 설정
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'preferences'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-750 hover:text-white'
                    }`}
                >
                  <UserCog className="h-5 w-5 mr-3" />
                  환경 설정
                </button>
              </nav>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <Link
              href="/intranet/dashboard"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="mr-2">←</span>
              대시보드로 돌아가기
            </Link>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          {/* 프로필 정보 탭 */}
          {activeTab === 'profile' && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-white">프로필 정보</h2>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button
                      form="profile-form"
                      type="submit"
                      className="p-1.5 rounded-md text-blue-500 hover:text-white hover:bg-blue-600"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="p-6">
                {isEditing ? (
                  <form id="profile-form" onSubmit={handleProfileUpdate}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            이름
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            이메일
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            전화번호
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            주소
                          </label>
                          <input
                            type="text"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          자기소개
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          rows={4}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                      <div className="flex">
                        <User className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">이름</p>
                          <p className="text-white">{userData.name}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">이메일</p>
                          <p className="text-white">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Phone className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">전화번호</p>
                          <p className="text-white">{userData.phone}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Tag className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">사번</p>
                          <p className="text-white">{userData.employeeId}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Building className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">부서 / 직책</p>
                          <p className="text-white">{userData.department} / {userData.position}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">입사일</p>
                          <p className="text-white">{new Date(userData.joinDate).toLocaleDateString('ko-KR')}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">주소</p>
                          <p className="text-white">{userData.address}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Shield className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-400">권한</p>
                          <div className="mt-1">
                            {userData.role === 'admin' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                                관리자
                              </span>
                            )}
                            {userData.role === 'manager' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                                매니저
                              </span>
                            )}
                            {userData.role === 'user' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                일반 사용자
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">자기소개</p>
                      <p className="text-white">{userData.bio}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">전문 기술</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 알림 설정 탭 */}
          {activeTab === 'notifications' && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">알림 설정</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-400 mb-6">
                  알림을 받는 방식과 종류를 설정합니다. 변경 사항은 바로 적용됩니다.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">이메일 알림</p>
                        <p className="text-sm text-gray-400">
                          중요 알림을 이메일로 받습니다.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">푸시 알림</p>
                        <p className="text-sm text-gray-400">
                          브라우저 푸시 알림을 받습니다.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-white font-medium mb-4">알림 유형</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">메시지</p>
                          <p className="text-sm text-gray-400">
                            새 메시지 수신 시 알림
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.messages}
                            onChange={() => handleNotificationChange('messages')}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">태스크</p>
                          <p className="text-sm text-gray-400">
                            태스크 할당 및 변경 알림
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.tasks}
                            onChange={() => handleNotificationChange('tasks')}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">공지사항</p>
                          <p className="text-sm text-gray-400">
                            새 공지사항 등록 알림
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.announcements}
                            onChange={() => handleNotificationChange('announcements')}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 보안 설정 탭 */}
          {activeTab === 'security' && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">보안 설정</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">비밀번호 변경</p>
                        <p className="text-sm text-gray-400">
                          마지막 변경: {new Date(userData.security.lastPasswordChange).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                      변경
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">2단계 인증</p>
                        <p className="text-sm text-gray-400">
                          {userData.security.twoFactorEnabled ? '활성화됨' : '비활성화됨'}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                      {userData.security.twoFactorEnabled ? '비활성화' : '활성화'}
                    </button>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-700">
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      활성 세션
                      <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                    </h3>

                    <div className="space-y-4">
                      {userData.security.sessions.map((session, index) => (
                        <div key={index} className="flex items-start justify-between bg-gray-750 p-4 rounded-md">
                          <div>
                            <div className="flex items-center">
                              <h4 className="text-white font-medium">{session.device}</h4>
                              {session.current && (
                                <span className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">
                                  현재 세션
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              IP: {session.ip} • 위치: {session.location}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              마지막 활동: {new Date(session.lastActive).toLocaleString('ko-KR')}
                            </p>
                          </div>
                          {!session.current && (
                            <button className="text-red-500 hover:text-red-400 text-sm">
                              세션 종료
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 환경 설정 탭 */}
          {activeTab === 'preferences' && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">환경 설정</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Languages className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">언어 설정</p>
                        <p className="text-sm text-gray-400">
                          인터페이스 언어를 선택하세요
                        </p>
                      </div>
                    </div>
                    <select className="bg-gray-700 border-gray-600 text-gray-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500">
                      <option value="ko" selected={userData.language === 'ko'}>한국어</option>
                      <option value="en" selected={userData.language === 'en'}>English</option>
                      <option value="ja" selected={userData.language === 'ja'}>日本語</option>
                      <option value="zh" selected={userData.language === 'zh'}>中文</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">테마 설정</p>
                        <p className="text-sm text-gray-400">
                          인터페이스 테마를 선택하세요
                        </p>
                      </div>
                    </div>
                    <select className="bg-gray-700 border-gray-600 text-gray-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500">
                      <option value="dark" selected={userData.theme === 'dark'}>다크 모드</option>
                      <option value="light" selected={userData.theme === 'light'}>라이트 모드</option>
                      <option value="system" selected={userData.theme === 'system'}>시스템 설정에 따름</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-white font-medium">캘린더 동기화</p>
                        <p className="text-sm text-gray-400">
                          외부 캘린더와 연동 설정
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                      설정
                    </button>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-700">
                    <h3 className="text-white font-medium mb-4">데이터 및 개인정보</h3>

                    <div className="space-y-3">
                      <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                        <Users className="h-4 w-4 mr-1.5" />
                        내 정보 공개 범위 설정
                      </button>
                      <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                        <Download className="h-4 w-4 mr-1.5" />
                        내 데이터 내보내기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 