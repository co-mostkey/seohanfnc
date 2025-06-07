'use client';

import React, { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import {
    Activity,
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    MoreHorizontal,
    Plus,
    Star,
    Users,
    Briefcase,
    CircleAlert,
    ChevronRight,
    ArrowUpRight,
    X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 날짜 포맷팅
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function DashboardPage() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [todayEvents, setTodayEvents] = useState<any[]>([]);
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [notices, setNotices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 새 일정 데이터
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: '',
        type: 'meeting',
        description: ''
    });

    // 새 프로젝트 데이터
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        category: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'planning'
    });

    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 사용자 정보
                const userResponse = await fetch('/api/intranet/user/current');
                const userData = await userResponse.json();
                if (userData.success && userData.user) {
                    setCurrentUser(userData.user);
                }

                // 오늘 일정
                try {
                    const today = new Date();
                    const eventsResponse = await fetch(`/api/intranet/events?year=${today.getFullYear()}&month=${today.getMonth() + 1}`);
                    const eventsData = await eventsResponse.json();
                    if (eventsData.success && eventsData.events && Array.isArray(eventsData.events)) {
                        // 오늘 일정만 필터링
                        const todayStr = today.toISOString().split('T')[0];
                        const todayEvents = eventsData.events.filter((event: any) =>
                            event.date && event.date.startsWith(todayStr)
                        );
                        setTodayEvents(todayEvents);
                    } else {
                        setTodayEvents([]);
                    }
                } catch (eventError) {
                    console.error('일정 로드 실패:', eventError);
                    setTodayEvents([]);
                }

                // 내 프로젝트
                try {
                    const projectsResponse = await fetch('/api/intranet/projects?status=in-progress');
                    const projectsData = await projectsResponse.json();
                    if (projectsData.success && projectsData.projects && Array.isArray(projectsData.projects)) {
                        setMyProjects(projectsData.projects.slice(0, 2)); // 최대 2개만 표시
                    } else {
                        setMyProjects([]);
                    }
                } catch (projectError) {
                    console.error('프로젝트 로드 실패:', projectError);
                    setMyProjects([]);
                }

                // 인트라넷 공지사항
                try {
                    const noticesResponse = await fetch('/api/intranet/notices?limit=3');
                    const noticesData = await noticesResponse.json();
                    if (noticesData.success && noticesData.notices && Array.isArray(noticesData.notices)) {
                        setNotices(noticesData.notices.slice(0, 3)); // 최대 3개만 표시
                    } else {
                        setNotices([]);
                    }
                } catch (noticeError) {
                    console.error('[TRISID] 인트라넷 공지사항 로드 실패:', noticeError);
                    setNotices([]);
                }
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 일정 추가 처리
    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/intranet/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent)
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('일정이 추가되었습니다.');
                setShowEventModal(false);
                setNewEvent({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    location: '',
                    type: 'meeting',
                    description: ''
                });

                // 오늘 일정이면 목록 새로고침
                const today = new Date().toISOString().split('T')[0];
                if (newEvent.date === today) {
                    const eventsResponse = await fetch(`/api/intranet/events?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`);
                    const eventsData = await eventsResponse.json();
                    if (eventsData.success && eventsData.events && Array.isArray(eventsData.events)) {
                        const todayEvents = eventsData.events.filter((event: any) =>
                            event.date && event.date.startsWith(today)
                        );
                        setTodayEvents(todayEvents);
                    }
                }
            } else {
                setError(data.error || '일정 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('일정 추가 오류:', error);
            setError('일정 추가 중 오류가 발생했습니다.');
        }
    };

    // 프로젝트 추가 처리
    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/intranet/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newProject,
                    manager: currentUser?.name || '',
                    members: [currentUser?.employeeId || '']
                })
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('프로젝트가 추가되었습니다.');
                setShowProjectModal(false);
                setNewProject({
                    title: '',
                    description: '',
                    category: '',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: '',
                    status: 'planning'
                });

                // 프로젝트 목록 새로고침
                const projectsResponse = await fetch('/api/intranet/projects?status=in-progress');
                const projectsData = await projectsResponse.json();
                if (projectsData.success && projectsData.projects && Array.isArray(projectsData.projects)) {
                    setMyProjects(projectsData.projects.slice(0, 2));
                }
            } else {
                setError(data.error || '프로젝트 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('프로젝트 추가 오류:', error);
            setError('프로젝트 추가 중 오류가 발생했습니다.');
        }
    };

    // 오늘 날짜
    const today = new Date();
    const todayFormatted = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    // 인사말 생성
    const getGreeting = () => {
        const hour = today.getHours();
        if (hour < 12) {
            return '좋은 아침입니다';
        } else if (hour < 18) {
            return '안녕하세요';
        } else {
            return '좋은 저녁입니다';
        }
    };

    if (isLoading || !currentUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* 헤더 */}
            <div className="mb-8">
                <h2 className="text-lg font-normal text-gray-400">{todayFormatted}</h2>
                <h1 className="text-3xl font-semibold text-white mb-2">
                    {getGreeting()}, {currentUser.name} {currentUser.position}님
                </h1>
                <p className="text-gray-400">개인 대시보드에서 업무와 일정을 확인하세요.</p>
            </div>

            {/* 알림 메시지 */}
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="mb-4 bg-green-900/20 border-green-600">
                    <AlertDescription className="text-green-200">{success}</AlertDescription>
                </Alert>
            )}

            {/* 퀵 액션 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Link
                    href="/intranet/messages"
                    className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
                >
                    <MessageSquare className="h-8 w-8 text-blue-500 mb-3" />
                    <span className="text-white font-medium">메시지</span>
                    <span className="text-sm text-gray-400 mt-1">3개 읽지 않음</span>
                </Link>

                <Link
                    href="/intranet/projects"
                    className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
                >
                    <Briefcase className="h-8 w-8 text-purple-500 mb-3" />
                    <span className="text-white font-medium">프로젝트</span>
                    <span className="text-sm text-gray-400 mt-1">{myProjects.length}개 진행 중</span>
                </Link>

                <Link
                    href="/intranet/calendar"
                    className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
                >
                    <Calendar className="h-8 w-8 text-green-500 mb-3" />
                    <span className="text-white font-medium">일정</span>
                    <span className="text-sm text-gray-400 mt-1">오늘 {todayEvents.length}개 일정</span>
                </Link>

                <Link
                    href="/intranet/notices"
                    className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-750 rounded-lg py-6 px-4 transition-colors"
                >
                    <Bell className="h-8 w-8 text-yellow-500 mb-3" />
                    <span className="text-white font-medium">공지사항</span>
                    <span className="text-sm text-gray-400 mt-1">새 공지 {notices.length}개</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {/* 오늘 일정 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">오늘 일정</h2>
                            <Link
                                href="/intranet/calendar"
                                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                            >
                                <span>전체 일정 보기</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {todayEvents.map((event) => (
                                <div key={event.id} className={`bg-gray-750 rounded-lg p-4 border-l-4 ${event.type === 'meeting' ? 'border-blue-500' :
                                    event.type === 'deadline' ? 'border-red-500' : 'border-purple-500'
                                    }`}>
                                    <div className="flex justify-between">
                                        <h3 className="text-white font-medium">{event.title}</h3>
                                        <div className="flex items-center text-gray-400 space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm">{event.time || '시간 미정'}</span>
                                        </div>
                                    </div>
                                    {event.location && (
                                        <p className="text-gray-400 text-sm mt-1">{event.location}</p>
                                    )}
                                    {event.description && (
                                        <p className="text-gray-400 text-sm mt-2">{event.description}</p>
                                    )}
                                </div>
                            ))}

                            {todayEvents.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                    <p>오늘은 일정이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowEventModal(true)}
                            className="w-full mt-4 py-2 flex items-center justify-center text-sm text-blue-500 hover:bg-gray-750 rounded-md"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            일정 추가
                        </button>
                    </div>

                    {/* 나의 프로젝트 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">나의 프로젝트</h2>
                            <Link
                                href="/intranet/projects"
                                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                            >
                                <span>모든 프로젝트</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {myProjects.map((project) => (
                                <div key={project.id} className="bg-gray-750 rounded-lg p-4">
                                    <div className="flex justify-between mb-3">
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${project.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                                                    project.status === 'on-hold' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        project.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                            'bg-gray-700 text-gray-300'
                                                    }`}>
                                                    {project.status === 'in-progress' ? '진행 중' :
                                                        project.status === 'on-hold' ? '보류 중' :
                                                            project.status === 'completed' ? '완료' : '계획 중'}
                                                </span>
                                                {project.category && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                                        {project.category}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-white font-medium">{project.title}</h3>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span className="text-xs">{formatDate(project.endDate)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">진행률</span>
                                        <span className="text-sm font-medium text-white">{project.progress || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${project.status === 'completed' ? 'bg-green-500' :
                                                project.status === 'on-hold' ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${project.progress || 0}%` }}
                                        ></div>
                                    </div>

                                    {project.tasks && (
                                        <div className="flex justify-between mt-3">
                                            <div className="flex items-center">
                                                <CheckCircle2 className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-400">
                                                    {project.tasks.filter((t: any) => t.completed).length}/{project.tasks.length} 태스크
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {myProjects.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                    <p>진행 중인 프로젝트가 없습니다.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="w-full mt-4 py-2 flex items-center justify-center text-sm text-blue-500 hover:bg-gray-750 rounded-md"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            새 프로젝트
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* 최근 공지사항 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">공지사항</h2>
                            <Link
                                href="/intranet/notices"
                                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                            >
                                <span>모든 공지</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {notices.map((notice) => (
                                <div key={notice.id} className="flex items-start bg-gray-750 rounded-lg p-4">
                                    <CircleAlert className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${notice.important ? 'text-red-500' : 'text-blue-500'
                                        }`} />
                                    <div>
                                        <h3 className="text-white font-medium">{notice.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {notice.content.substring(0, 100)}...
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <span>{typeof notice.author === 'object' && notice.author?.name
                                                ? notice.author.name
                                                : notice.author}</span>
                                            <span className="mx-2">•</span>
                                            <span>{formatDate(notice.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 나의 할일 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">나의 할일</h2>
                            <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                                <Plus className="h-4 w-4 mr-1" />
                                <span>새 할일</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start">
                                <div className="flex items-center h-6">
                                    <input
                                        id="task-1"
                                        type="checkbox"
                                        className="h-4 w-4 border-2 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                                    />
                                </div>
                                <label htmlFor="task-1" className="ml-3 block">
                                    <span className="text-white">분기별 사업계획 검토</span>
                                    <p className="text-sm text-gray-400">마감일: 2024년 4월 20일</p>
                                </label>
                                <div className="ml-auto">
                                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-6">
                                    <input
                                        id="task-2"
                                        type="checkbox"
                                        className="h-4 w-4 border-2 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                                    />
                                </div>
                                <label htmlFor="task-2" className="ml-3 block">
                                    <span className="text-white">해외 파트너십 미팅 준비</span>
                                    <p className="text-sm text-gray-400">마감일: 2024년 4월 25일</p>
                                </label>
                                <div className="ml-auto">
                                    <ArrowUpRight className="h-4 w-4 text-red-500 rotate-45" />
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-6">
                                    <input
                                        id="task-3"
                                        type="checkbox"
                                        className="h-4 w-4 border-2 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                                    />
                                </div>
                                <label htmlFor="task-3" className="ml-3 block">
                                    <span className="text-white">인사평가 결과 검토</span>
                                    <p className="text-sm text-gray-400">마감일: 2024년 5월 5일</p>
                                </label>
                                <div className="ml-auto">
                                    <ArrowUpRight className="h-4 w-4 text-yellow-500 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 최근 활동 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">최근 활동</h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                    <Image
                                        src={getImagePath('/images/avatars/avatar-3.svg')}
                                        alt="User Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-white">
                                        <span className="font-medium">박지성</span>님이 <span className="text-blue-400">프로젝트 일정</span>을 수정했습니다.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">30분 전</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                    <Image
                                        src={getImagePath('/images/avatars/avatar-11.jpg')}
                                        alt="User Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-white">
                                        <span className="font-medium">장미영</span>님이 <span className="text-blue-400">신입사원 교육 일정</span>을 등록했습니다.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">2시간 전</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                    <Image
                                        src={getImagePath('/images/avatars/avatar-5.jpg')}
                                        alt="User Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-white">
                                        <span className="font-medium">정수민</span>님이 <span className="text-blue-400">마케팅 캠페인 보고서</span>를 공유했습니다.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">어제</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 일정 추가 모달 */}
            {showEventModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">새 일정 추가</h2>
                            <button
                                onClick={() => setShowEventModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddEvent}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        일정 제목
                                    </label>
                                    <Input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="일정 제목을 입력하세요"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            날짜
                                        </label>
                                        <Input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                            className="bg-gray-700 border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            시간
                                        </label>
                                        <Input
                                            type="text"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className="bg-gray-700 border-gray-600 text-white"
                                            placeholder="예: 14:00 - 16:00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        장소
                                    </label>
                                    <Input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="장소를 입력하세요"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        유형
                                    </label>
                                    <select
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                        className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                                    >
                                        <option value="meeting">회의</option>
                                        <option value="deadline">마감일</option>
                                        <option value="event">행사</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        설명
                                    </label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                                        rows={3}
                                        placeholder="상세 설명을 입력하세요"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEventModal(false)}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    추가
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 프로젝트 추가 모달 */}
            {showProjectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">새 프로젝트</h2>
                            <button
                                onClick={() => setShowProjectModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProject}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        프로젝트명
                                    </label>
                                    <Input
                                        type="text"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="프로젝트명을 입력하세요"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        설명
                                    </label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                                        rows={3}
                                        placeholder="프로젝트 설명을 입력하세요"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        카테고리
                                    </label>
                                    <Input
                                        type="text"
                                        value={newProject.category}
                                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="예: 제품개발, 마케팅, 사업확장"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            시작일
                                        </label>
                                        <Input
                                            type="date"
                                            value={newProject.startDate}
                                            onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                                            className="bg-gray-700 border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            종료일
                                        </label>
                                        <Input
                                            type="date"
                                            value={newProject.endDate}
                                            onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                                            className="bg-gray-700 border-gray-600 text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        상태
                                    </label>
                                    <select
                                        value={newProject.status}
                                        onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                                        className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                                    >
                                        <option value="planning">계획 중</option>
                                        <option value="in-progress">진행 중</option>
                                        <option value="on-hold">보류</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowProjectModal(false)}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    추가
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 