'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft, Calendar, Users, Clock, Edit, Trash2,
    CheckCircle2, Circle, Plus, Tag, Briefcase, X, Check,
    MessageSquare, Send
} from 'lucide-react';

// [TRISID] 프로젝트 상세 페이지 - 유연한 담당자 선택 및 실시간 활동 로그 + 실시간 채팅

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    startDate: string;
    endDate: string;
    progress: number;
    manager: {
        id: string;
        name: string;
        avatar?: string;
    };
    team: Array<{
        id: string;
        name: string;
        role: string;
        avatar?: string;
    }>;
    tasks: Array<{
        id: string;
        title: string;
        status: string;
        assignee: string;
        dueDate: string;
    }>;
    recentActivities: Array<{
        id: string;
        action: string;
        user: {
            name: string;
            avatar?: string;
        };
        timestamp: string;
    }>;
    messages?: Array<{
        id: string;
        message: string;
        user: {
            name: string;
            avatar?: string;
        };
        timestamp: string;
        type: string;
    }>;
}

interface NewTask {
    title: string;
    assignee: string;
    dueDate: string;
}

const statusConfig = {
    planning: { label: '계획 중', bgColor: 'bg-gray-500/10', textColor: 'text-gray-500', color: 'bg-gray-500', icon: '📋' },
    'in-progress': { label: '진행 중', bgColor: 'bg-blue-500/10', textColor: 'text-blue-500', color: 'bg-blue-500', icon: '🚀' },
    'on-hold': { label: '보류', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-500', color: 'bg-yellow-500', icon: '⏸️' },
    completed: { label: '완료', bgColor: 'bg-green-500/10', textColor: 'text-green-500', color: 'bg-green-500', icon: '✅' },
    cancelled: { label: '취소', bgColor: 'bg-red-500/10', textColor: 'text-red-500', color: 'bg-red-500', icon: '❌' }
};

const priorityConfig = {
    low: { label: '낮음', textColor: 'text-green-500', icon: '🔽' },
    normal: { label: '보통', textColor: 'text-gray-500', icon: '🔹' },
    high: { label: '높음', textColor: 'text-yellow-500', icon: '🔸' },
    urgent: { label: '긴급', textColor: 'text-red-500', icon: '🔺' }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
};

const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // [TRISID] 채팅 관리 상태
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    // [TRISID] 할일 관리 상태
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState<NewTask>({
        title: '',
        assignee: '',
        dueDate: ''
    });
    const [savingTask, setSavingTask] = useState(false);

    // [TRISID] 활동 로그 추가 함수
    const addActivityLog = async (action: string, userName: string = '사용자', userAvatar?: string) => {
        try {
            const response = await fetch(`/api/intranet/projects/${projectId}/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    userName,
                    userAvatar: userAvatar || '/images/avatars/avatar-3.svg'
                }),
            });

            if (response.ok) {
                console.log('[TRISID] 활동 로그 추가 성공:', action);
            }
        } catch (error) {
            console.error('[TRISID] 활동 로그 추가 실패:', error);
        }
    };

    // [TRISID] 실시간 활동 로그 업데이트
    const updateRecentActivities = (newActivity: any) => {
        setProject(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                recentActivities: [
                    newActivity,
                    ...(prev.recentActivities || [])
                ].slice(0, 20)
            };
        });
    };

    // [TRISID] 채팅 메시지 로드
    const loadMessages = async () => {
        try {
            console.log('[TRISID] 채팅 메시지 로드 시작:', projectId);
            const response = await fetch(`/api/intranet/projects/${projectId}/messages`);
            const data = await response.json();

            if (data.success) {
                setMessages(data.messages || []);
                console.log('[TRISID] 채팅 메시지 로드 성공:', data.messages?.length || 0, '개');
            } else {
                console.error('[TRISID] 채팅 메시지 로드 실패:', data.error);
            }
        } catch (error) {
            console.error('[TRISID] 채팅 메시지 로드 중 오류:', error);
        }
    };

    // [TRISID] 새 메시지 전송
    const handleSendMessage = async () => {
        if (!newMessage.trim() || sendingMessage) return;

        setSendingMessage(true);
        try {
            const response = await fetch(`/api/intranet/projects/${projectId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: newMessage.trim(),
                    userName: '사용자', // 실제로는 로그인한 사용자 정보를 사용
                    userAvatar: '/images/avatars/avatar-3.svg'
                }),
            });

            const data = await response.json();

            if (data.success) {
                // 메시지 목록에 새 메시지 추가
                setMessages(prev => [...prev, data.message]);
                setNewMessage('');
                console.log('[TRISID] 메시지 전송 성공:', data.message);
            } else {
                console.error('[TRISID] 메시지 전송 실패:', data.error);
            }
        } catch (error) {
            console.error('[TRISID] 메시지 전송 중 오류:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    // [TRISID] Enter 키로 메시지 전송
    const handleMessageKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (projectId) {
            loadProject();
            loadMessages();
        }
    }, [projectId]);

    const loadProject = async () => {
        try {
            console.log('[TRISID] 프로젝트 로드 시작:', projectId);
            const response = await fetch(`/api/intranet/projects/${projectId}`);
            const data = await response.json();

            if (data.success) {
                setProject(data.project);
                console.log('[TRISID] 프로젝트 로드 성공:', data.project);
            } else {
                setError(data.error || '프로젝트를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('[TRISID] 프로젝트 로드 실패:', error);
            setError('프로젝트 로드 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // [TRISID] 할일 완료/미완료 토글
    const toggleTaskCompletion = async (taskId: string) => {
        if (!project) return;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';

        try {
            const response = await fetch(`/api/intranet/projects/${projectId}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (data.success) {
                // 로컬 상태 업데이트
                setProject(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        tasks: prev.tasks.map(t =>
                            t.id === taskId ? { ...t, status: newStatus } : t
                        )
                    };
                });

                // 활동 로그 추가
                const actionText = newStatus === 'completed'
                    ? `할일 "${task.title}"을(를) 완료했습니다`
                    : `할일 "${task.title}"을(를) 미완료로 변경했습니다`;

                addActivityLog(actionText, task.assignee);

                // 실시간 UI 업데이트
                const newActivity = {
                    id: `activity-${Date.now()}`,
                    action: actionText,
                    user: {
                        name: task.assignee,
                        avatar: '/images/avatars/avatar-3.svg'
                    },
                    timestamp: new Date().toISOString()
                };

                updateRecentActivities(newActivity);

            } else {
                alert('할일 상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('[TRISID] 할일 상태 변경 오류:', error);
            alert('할일 상태 변경 중 오류가 발생했습니다.');
        }
    };

    // [TRISID] 새 할일 추가
    const handleAddTask = async () => {
        if (!newTask.title.trim() || !newTask.assignee.trim() || !newTask.dueDate) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        setSavingTask(true);

        try {
            const response = await fetch(`/api/intranet/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            const data = await response.json();

            if (data.success) {
                // 로컬 상태 업데이트
                setProject(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        tasks: [...prev.tasks, data.task]
                    };
                });

                // 활동 로그 추가
                const actionText = `새 할일 "${newTask.title}"을(를) 추가했습니다`;
                addActivityLog(actionText, newTask.assignee);

                // 실시간 UI 업데이트
                const newActivity = {
                    id: `activity-${Date.now()}-add`,
                    action: actionText,
                    user: {
                        name: newTask.assignee,
                        avatar: '/images/avatars/avatar-3.svg'
                    },
                    timestamp: new Date().toISOString()
                };

                updateRecentActivities(newActivity);

                // 폼 초기화
                setNewTask({ title: '', assignee: '', dueDate: '' });
                setShowAddTask(false);

                console.log('[TRISID] 새 할일 추가 성공:', data.task);
            } else {
                alert('할일 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('[TRISID] 할일 추가 오류:', error);
            alert('할일 추가 중 오류가 발생했습니다.');
        } finally {
            setSavingTask(false);
        }
    };

    // [TRISID] 할일 삭제
    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('이 할일을 삭제하시겠습니까?')) return;

        const taskToDelete = project?.tasks.find(t => t.id === taskId);
        if (!taskToDelete) return;

        try {
            const response = await fetch(`/api/intranet/projects/${projectId}/tasks/${taskId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                // 로컬 상태 업데이트
                setProject(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        tasks: prev.tasks.filter(t => t.id !== taskId)
                    };
                });

                // 활동 로그 추가
                const actionText = `할일 "${taskToDelete.title}"을(를) 삭제했습니다`;
                addActivityLog(actionText, taskToDelete.assignee);

                // 실시간 UI 업데이트
                const newActivity = {
                    id: `activity-${Date.now()}-delete`,
                    action: actionText,
                    user: {
                        name: taskToDelete.assignee,
                        avatar: '/images/avatars/avatar-3.svg'
                    },
                    timestamp: new Date().toISOString()
                };

                updateRecentActivities(newActivity);

                console.log('[TRISID] 할일 삭제 성공:', taskId);
            } else {
                alert('할일 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('[TRISID] 할일 삭제 오류:', error);
            alert('할일 삭제 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-1">{error || '프로젝트를 찾을 수 없습니다'}</p>
                    <Link
                        href="/intranet/projects"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors mt-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        프로젝트 목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.planning;
    const priority = priorityConfig[project.priority as keyof typeof priorityConfig] || priorityConfig.normal;
    const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
    const totalTasks = project.tasks?.length || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link
                        href="/intranet/projects"
                        className="mr-4 p-2 hover:bg-gray-700 rounded-md transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
                        <div className="flex items-center mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} mr-2`}>
                                {status.icon}
                                <span className="ml-1">{status.label}</span>
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 mr-2`}>
                                <Tag className="h-3.5 w-3.5 mr-1" />
                                {project.category}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.textColor}`}>
                                {priority.icon}
                                <span className="ml-1">우선순위: {priority.label}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        href={`/intranet/projects/${project.id}/edit`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        편집
                    </Link>
                    <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 메인 콘텐츠 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 프로젝트 정보 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">프로젝트 개요</h2>
                        <p className="text-gray-300 mb-6">{project.description}</p>

                        {/* 진행률 */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">진행률</span>
                                <span className="text-sm font-medium text-white">{project.progress}%</span>
                            </div>
                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${status.color}`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* 일정 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-400">시작일</p>
                                    <p className="text-white">{formatDate(project.startDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-400">마감일</p>
                                    <p className="text-white">{formatDate(project.endDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 할일 목록 - [TRISID] 완전한 CRUD 및 활동 로그 기능 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">
                                할일 목록
                                <span className="ml-2 text-sm font-normal text-gray-400">
                                    ({completedTasks}/{totalTasks})
                                </span>
                            </h2>
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                새 할일
                            </button>
                        </div>

                        {/* 새 할일 추가 폼 - [TRISID] 유연한 담당자 선택 */}
                        {showAddTask && (
                            <div className="bg-gray-750 rounded-lg p-4 mb-4 border border-gray-600">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-white font-medium">새 할일 추가</h3>
                                    <button
                                        onClick={() => setShowAddTask(false)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">할일 제목</label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="할일 제목을 입력하세요"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">담당자</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={newTask.assignee}
                                                    onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                                                    className="w-full bg-gray-700 text-white rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="담당자 이름 입력 또는 선택"
                                                    list="assignee-suggestions"
                                                />
                                                <datalist id="assignee-suggestions">
                                                    {project.manager && (
                                                        <option value={project.manager.name}>{project.manager.name} (매니저)</option>
                                                    )}
                                                    {project.team?.map((member) => (
                                                        <option key={member.id} value={member.name}>
                                                            {member.name} ({member.role})
                                                        </option>
                                                    ))}
                                                    <option value="외부 협력사">외부 협력사</option>
                                                    <option value="디자인팀">디자인팀</option>
                                                    <option value="마케팅팀">마케팅팀</option>
                                                    <option value="영업팀">영업팀</option>
                                                    <option value="품질관리팀">품질관리팀</option>
                                                    <option value="IT팀">IT팀</option>
                                                </datalist>
                                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                💡 팀원 선택 또는 직접 입력 가능 (예: 외부업체, 다른 부서 등)
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">마감일</label>
                                            <input
                                                type="date"
                                                value={newTask.dueDate}
                                                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                                                className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-2">
                                        <button
                                            onClick={() => setShowAddTask(false)}
                                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            onClick={handleAddTask}
                                            disabled={savingTask}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md transition-colors"
                                        >
                                            {savingTask ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    저장 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    추가
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 할일 목록 */}
                        <div className="space-y-3">
                            {project.tasks && project.tasks.length > 0 ? (
                                project.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center p-3 bg-gray-750 rounded-lg group hover:bg-gray-700 transition-colors">
                                        <button
                                            onClick={() => toggleTaskCompletion(task.id)}
                                            className="mr-3 hover:scale-110 transition-transform"
                                        >
                                            {task.status === 'completed' ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                                            )}
                                        </button>
                                        <div className="flex-1">
                                            <p className={`${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                                                {task.title}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-400 mt-1">
                                                <span>{task.assignee}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatDate(task.dueDate)}</span>
                                                <span className="mx-2">•</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${task.status === 'completed'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : task.status === 'in-progress'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {task.status === 'completed' ? '완료' : task.status === 'in-progress' ? '진행 중' : '대기'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-400 hover:text-red-300 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Circle className="h-8 w-8 mx-auto mb-2" />
                                    <p>아직 할일이 없습니다</p>
                                    <button
                                        onClick={() => setShowAddTask(true)}
                                        className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                                    >
                                        첫 번째 할일을 추가해보세요
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 사이드바 */}
                <div className="space-y-6">
                    {/* 팀 정보 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">팀 정보</h3>

                        {/* 프로젝트 매니저 */}
                        {project.manager && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-2">프로젝트 매니저</p>
                                <div className="flex items-center">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <Image
                                            src={project.manager.avatar || '/images/avatars/avatar-3.svg'}
                                            alt={project.manager.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{project.manager.name}</p>
                                        <p className="text-sm text-gray-400">매니저</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 팀원 목록 */}
                        <div>
                            <p className="text-sm text-gray-400 mb-2">팀원 ({project.team?.length || 0}명)</p>
                            <div className="space-y-3">
                                {project.team && project.team.length > 0 ? (
                                    project.team.map((member) => (
                                        <div key={member.id} className="flex items-center">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                                                <Image
                                                    src={member.avatar || '/images/avatars/avatar-3.svg'}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm">{member.name}</p>
                                                <p className="text-xs text-gray-400">{member.role}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <Users className="h-6 w-6 mx-auto mb-1" />
                                        <p className="text-sm">팀원이 없습니다</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 채팅 섹션 - [TRISID] 실시간 채팅 기능 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            팀 채팅
                            <span className="ml-2 text-sm font-normal text-gray-400">
                                (실시간 💬)
                            </span>
                        </h3>

                        {/* 채팅 메시지 영역 */}
                        <div className="space-y-3 max-h-80 overflow-y-auto mb-4 border-b border-gray-700 pb-4">
                            {messages && messages.length > 0 ? (
                                messages.map((message) => (
                                    <div key={message.id} className="flex items-start space-x-3">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src={message.user.avatar || '/images/avatars/avatar-3.svg'}
                                                alt={message.user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-white">{message.user.name}</span>
                                                <span className="text-xs text-gray-500">{getRelativeTime(message.timestamp)}</span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-300 break-words">
                                                {message.message}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">아직 메시지가 없습니다</p>
                                    <p className="text-xs text-gray-600 mt-1">첫 번째 메시지를 보내보세요!</p>
                                </div>
                            )}
                        </div>

                        {/* 메시지 입력 영역 */}
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleMessageKeyPress}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={sendingMessage}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sendingMessage}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md transition-colors flex items-center"
                            >
                                {sendingMessage ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* 최근 활동 - [TRISID] 실시간 동작하는 활동 로그 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            최근 활동
                            <span className="ml-2 text-sm font-normal text-gray-400">
                                (실시간 ✨)
                            </span>
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {project.recentActivities && project.recentActivities.length > 0 ? (
                                project.recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start p-3 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                            <Image
                                                src={activity.user.avatar || '/images/avatars/avatar-3.svg'}
                                                alt={activity.user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-300">
                                                <span className="font-medium text-white">{activity.user.name}</span>
                                                {' 님이 '}{activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{getRelativeTime(activity.timestamp)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Clock className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">최근 활동이 없습니다</p>
                                    <p className="text-xs text-gray-600 mt-1">할일을 추가하거나 완료하면 활동이 기록됩니다</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 