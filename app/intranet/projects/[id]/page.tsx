'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Tag,
  Trash2,
  Users,
  ChevronRight,
  AlertCircle,
  PauseCircle,
  ArrowUpRight,
  ArrowDownRight,
  ListTodo
} from 'lucide-react';

// 임시 프로젝트 데이터
const initialProjects = [
  {
    id: 1,
    name: '신제품 개발 프로젝트',
    description: '2024년 하반기 출시 예정 신제품 개발 프로젝트',
    status: 'ongoing',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-07-31',
    category: '제품개발',
    priority: 'high',
    manager: {
      id: 8,
      name: '한지민',
      position: '부장',
      department: '개발',
      avatar: '/images/avatars/avatar-8.jpg'
    },
    team: [
      {
        id: 8,
        name: '한지민',
        position: '부장',
        department: '개발',
        avatar: '/images/avatars/avatar-8.jpg'
      },
      {
        id: 9,
        name: '오승환',
        position: '차장',
        department: '개발',
        avatar: '/images/avatars/avatar-9.jpg'
      },
      {
        id: 10,
        name: '윤서연',
        position: '과장',
        department: '개발',
        avatar: '/images/avatars/avatar-10.jpg'
      },
      {
        id: 5,
        name: '정수민',
        position: '과장',
        department: '마케팅',
        avatar: '/images/avatars/avatar-5.jpg'
      }
    ],
    tasks: {
      total: 24,
      completed: 16
    },
    taskList: [
      {
        id: 1,
        title: '시장 조사 보고서 작성',
        description: '경쟁사 제품 분석 및 시장 동향 조사',
        assignee: {
          id: 5,
          name: '정수민',
          avatar: '/images/avatars/avatar-5.jpg'
        },
        status: 'completed',
        dueDate: '2024-02-10',
        completedDate: '2024-02-09',
        priority: 'high'
      },
      {
        id: 2,
        title: '디자인 컨셉 기획',
        description: '제품 디자인 방향성 및 컨셉 기획안 작성',
        assignee: {
          id: 10,
          name: '윤서연',
          avatar: '/images/avatars/avatar-10.jpg'
        },
        status: 'completed',
        dueDate: '2024-02-25',
        completedDate: '2024-02-23',
        priority: 'high'
      },
      {
        id: 3,
        title: '프로토타입 개발',
        description: '초기 기능 구현 및 프로토타입 제작',
        assignee: {
          id: 9,
          name: '오승환',
          avatar: '/images/avatars/avatar-9.jpg'
        },
        status: 'completed',
        dueDate: '2024-03-20',
        completedDate: '2024-03-22',
        priority: 'high'
      },
      {
        id: 4,
        title: '사용자 테스트 진행',
        description: '프로토타입에 대한 사용자 테스트 및 피드백 수집',
        assignee: {
          id: 5,
          name: '정수민',
          avatar: '/images/avatars/avatar-5.jpg'
        },
        status: 'completed',
        dueDate: '2024-04-10',
        completedDate: '2024-04-08',
        priority: 'medium'
      },
      {
        id: 5,
        title: '기능 개선 및 추가 개발',
        description: '사용자 피드백 기반 기능 개선 및 추가 개발',
        assignee: {
          id: 9,
          name: '오승환',
          avatar: '/images/avatars/avatar-9.jpg'
        },
        status: 'in_progress',
        dueDate: '2024-05-15',
        priority: 'high'
      },
      {
        id: 6,
        title: '품질 테스트',
        description: '개선된 기능에 대한 품질 테스트 및 버그 수정',
        assignee: {
          id: 8,
          name: '한지민',
          avatar: '/images/avatars/avatar-8.jpg'
        },
        status: 'in_progress',
        dueDate: '2024-06-10',
        priority: 'medium'
      },
      {
        id: 7,
        title: '제품 패키징 디자인',
        description: '최종 출시 제품의 패키징 디자인 작업',
        assignee: {
          id: 10,
          name: '윤서연',
          avatar: '/images/avatars/avatar-10.jpg'
        },
        status: 'todo',
        dueDate: '2024-06-25',
        priority: 'medium'
      },
      {
        id: 8,
        title: '출시 준비 및 마케팅 계획',
        description: '제품 출시 준비 및 마케팅 전략 수립',
        assignee: {
          id: 5,
          name: '정수민',
          avatar: '/images/avatars/avatar-5.jpg'
        },
        status: 'todo',
        dueDate: '2024-07-20',
        priority: 'high'
      }
    ],
    milestones: [
      {
        id: 1,
        title: '기획 단계 완료',
        dueDate: '2024-02-28',
        status: 'completed',
        completedDate: '2024-02-26'
      },
      {
        id: 2,
        title: '프로토타입 개발 완료',
        dueDate: '2024-03-30',
        status: 'completed',
        completedDate: '2024-03-28'
      },
      {
        id: 3,
        title: '베타 버전 출시',
        dueDate: '2024-05-30',
        status: 'in_progress'
      },
      {
        id: 4,
        title: '최종 제품 출시',
        dueDate: '2024-07-31',
        status: 'todo'
      }
    ],
    recentActivities: [
      {
        id: 1,
        user: {
          id: 8,
          name: '한지민',
          avatar: '/images/avatars/avatar-8.jpg'
        },
        action: '디자인 명세서를 업데이트했습니다.',
        timestamp: '2024-04-15T14:30:00'
      },
      {
        id: 2,
        user: {
          id: 10,
          name: '윤서연',
          avatar: '/images/avatars/avatar-10.jpg'
        },
        action: '기능 개발 태스크를 완료했습니다.',
        timestamp: '2024-04-14T11:20:00'
      },
      {
        id: 3,
        user: {
          id: 9,
          name: '오승환',
          avatar: '/images/avatars/avatar-9.jpg'
        },
        action: '새로운 태스크를 할당받았습니다.',
        timestamp: '2024-04-12T09:45:00'
      },
      {
        id: 4,
        user: {
          id: 5,
          name: '정수민',
          avatar: '/images/avatars/avatar-5.jpg'
        },
        action: '마일스톤 일정을 업데이트했습니다.',
        timestamp: '2024-04-10T16:15:00'
      }
    ],
    documents: [
      {
        id: 1,
        name: '프로젝트 기획서',
        type: 'pdf',
        size: '2.4MB',
        uploadedBy: {
          id: 8,
          name: '한지민'
        },
        uploadedAt: '2024-01-20T10:15:00'
      },
      {
        id: 2,
        name: '시장 조사 보고서',
        type: 'docx',
        size: '3.8MB',
        uploadedBy: {
          id: 5,
          name: '정수민'
        },
        uploadedAt: '2024-02-05T14:30:00'
      },
      {
        id: 3,
        name: '제품 디자인 컨셉',
        type: 'ppt',
        size: '5.2MB',
        uploadedBy: {
          id: 10,
          name: '윤서연'
        },
        uploadedAt: '2024-02-22T09:45:00'
      },
      {
        id: 4,
        name: '사용자 테스트 결과',
        type: 'xlsx',
        size: '1.8MB',
        uploadedBy: {
          id: 5,
          name: '정수민'
        },
        uploadedAt: '2024-04-09T16:20:00'
      }
    ]
  }
];

// 상태별 색상 및 아이콘
const statusConfig = {
  ongoing: {
    label: '진행 중',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  completed: {
    label: '완료됨',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  delayed: {
    label: '지연됨',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    icon: <AlertCircle className="h-4 w-4" />
  },
  planning: {
    label: '계획 중',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    icon: <Calendar className="h-4 w-4" />
  },
  onhold: {
    label: '보류 중',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: <PauseCircle className="h-4 w-4" />
  }
};

// 우선순위별 색상 및 아이콘
const priorityConfig = {
  high: {
    label: '높음',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    icon: <ArrowUpRight className="h-4 w-4" />
  },
  medium: {
    label: '중간',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    icon: <ArrowUpRight className="h-4 w-4 rotate-45" />
  },
  low: {
    label: '낮음',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    icon: <ArrowDownRight className="h-4 w-4" />
  }
};

// 태스크 상태별 색상 및 아이콘
const taskStatusConfig = {
  completed: {
    label: '완료',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  in_progress: {
    label: '진행 중',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    icon: <Clock className="h-4 w-4" />
  },
  todo: {
    label: '예정',
    color: 'bg-gray-500',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-500/10',
    icon: <ListTodo className="h-4 w-4" />
  },
  delayed: {
    label: '지연',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    icon: <AlertCircle className="h-4 w-4" />
  }
};

// 파일 타입별 아이콘 설정
const fileTypeIcons = {
  pdf: <FileText className="text-red-500" />,
  docx: <FileText className="text-blue-500" />,
  xlsx: <FileText className="text-green-500" />,
  ppt: <FileText className="text-orange-500" />,
  jpg: <FileText className="text-purple-500" />,
  png: <FileText className="text-purple-500" />,
  default: <FileText className="text-gray-500" />
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 상대적 시간 계산
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return formatDate(dateString).slice(0, -3); // 연도 제외
  }
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = typeof params.id === 'string' ? parseInt(params.id) : 1;

  const [project, setProject] = useState<typeof initialProjects[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'documents'>('overview');

  // 프로젝트 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    const foundProject = initialProjects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      // 프로젝트를 찾을 수 없는 경우 목록 페이지로 리다이렉트
      router.push('/intranet/projects');
    }
  }, [projectId, router]);

  if (!project) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-400">프로젝트 정보를 로드 중입니다...</p>
        </div>
      </div>
    );
  }

  // 상태 및 우선순위 설정
  const status = statusConfig[project.status as keyof typeof statusConfig];
  const priority = priorityConfig[project.priority as keyof typeof priorityConfig];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link
            href="/intranet/projects"
            className="inline-flex items-center text-gray-400 hover:text-white mr-3"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>프로젝트 목록</span>
          </Link>
          <div className="h-6 border-l border-gray-700 mr-3"></div>
          <div className="flex space-x-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300`}>
              <Tag className="h-3.5 w-3.5 mr-1" />
              {project.category}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priority.textColor}`}>
              {priority.icon}
              <span className="ml-1">우선순위: {priority.label}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
            <p className="text-gray-400 mt-1">{project.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/intranet/projects/${project.id}/edit`}
              className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              <Edit className="h-4 w-4 mr-1.5" />
              편집
            </Link>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 font-medium border-b-2 ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('overview')}
          >
            개요
          </button>
          <button
            className={`py-4 px-1 font-medium border-b-2 ${activeTab === 'tasks'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('tasks')}
          >
            태스크
          </button>
          <button
            className={`py-4 px-1 font-medium border-b-2 ${activeTab === 'team'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('team')}
          >
            팀원
          </button>
          <button
            className={`py-4 px-1 font-medium border-b-2 ${activeTab === 'documents'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('documents')}
          >
            문서
          </button>
        </nav>
      </div>
      {/* 개요 탭 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 프로젝트 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">프로젝트 정보</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">진행률</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.color}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">기간</p>
                    <p className="text-white">{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">담당자</p>
                    <p className="text-white">{project.manager.name} ({project.manager.position}, {project.manager.department})</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">태스크</p>
                    <p className="text-white">{project.tasks.completed}/{project.tasks.total} 완료</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 마일스톤 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">마일스톤</h2>
                <button className="inline-flex items-center text-sm text-blue-500 hover:text-blue-400">
                  <Plus className="h-4 w-4 mr-1" />
                  마일스톤 추가
                </button>
              </div>

              <div className="space-y-4">
                {project.milestones.map(milestone => {
                  const isCompleted = milestone.status === 'completed';
                  const isPast = new Date(milestone.dueDate) < new Date();
                  const isOverdue = isPast && !isCompleted;

                  return (
                    <div
                      key={milestone.id}
                      className={`border-l-2 pl-4 ${isCompleted
                          ? 'border-green-500'
                          : isOverdue
                            ? 'border-red-500'
                            : 'border-blue-500'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{milestone.title}</h3>
                          <p className="text-sm text-gray-400">
                            {isCompleted
                              ? `완료: ${formatDate(milestone.completedDate!)}`
                              : `마감: ${formatDate(milestone.dueDate)}`
                            }
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${isCompleted
                            ? 'bg-green-500/10 text-green-500'
                            : isOverdue
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}>
                          {isCompleted
                            ? '완료됨'
                            : isOverdue
                              ? '지연됨'
                              : '진행 중'
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 팀원 섹션 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">팀원</h2>
              <button className="inline-flex items-center text-sm text-blue-500 hover:text-blue-400">
                <Plus className="h-4 w-4 mr-1" />
                팀원 추가
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {project.team.map(member => (
                <div key={member.id} className="flex items-center p-3 bg-gray-750 rounded-lg">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{member.name}</h3>
                    <p className="text-xs text-gray-400">{member.position}, {member.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">최근 활동</h2>

            <div className="space-y-4">
              {project.recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-white font-medium">{activity.user.name}</h3>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-sm text-gray-400">{getRelativeTime(activity.timestamp)}</span>
                    </div>
                    <p className="text-gray-300 mt-1">{activity.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 태스크 탭 */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">태스크 목록</h2>
            <Link
              href={`/intranet/projects/${project.id}/tasks/create`}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              새 태스크
            </Link>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
              <div className="col-span-6">태스크</div>
              <div className="col-span-2">담당자</div>
              <div className="col-span-2">마감일</div>
              <div className="col-span-2">상태</div>
            </div>

            <div className="divide-y divide-gray-700">
              {project.taskList.map(task => {
                const taskStatus = taskStatusConfig[task.status as keyof typeof taskStatusConfig];
                const taskPriority = priorityConfig[task.priority as keyof typeof priorityConfig];

                return (
                  <div key={task.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-750">
                    <div className="col-span-6">
                      <div className="flex items-start">
                        <div className={`mt-1 h-5 w-5 rounded-full ${taskStatus.bgColor} flex items-center justify-center mr-3`}>
                          <span className={taskStatus.textColor}>{taskStatus.icon}</span>
                        </div>
                        <div>
                          <Link
                            href={`/intranet/projects/${project.id}/tasks/${task.id}`}
                            className="text-white font-medium hover:text-blue-400"
                          >
                            {task.title}
                          </Link>
                          <p className="text-sm text-gray-400">{task.description}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${taskPriority.textColor}`}>
                              {taskPriority.icon}
                              <span className="ml-1">{taskPriority.label}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                          <Image
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-gray-300">{task.assignee.name}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-300">{formatDate(task.dueDate).slice(0, -3)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${taskStatus.bgColor} ${taskStatus.textColor}`}>
                        {taskStatus.icon}
                        <span className="ml-1">{taskStatus.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* 팀원 탭 */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">팀원 관리</h2>
            <button className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              <Plus className="h-4 w-4 mr-1.5" />
              팀원 추가
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {project.team.map((member, index) => (
              <div key={member.id} className={`p-4 flex items-center justify-between ${index !== project.team.length - 1 ? 'border-b border-gray-700' : ''
                }`}>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{member.name}</h3>
                    <p className="text-gray-400">{member.position}, {member.department}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {member.id === project.manager.id && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 mr-3">
                      프로젝트 관리자
                    </span>
                  )}

                  <button className="p-2 text-gray-400 hover:text-gray-300 rounded-full hover:bg-gray-700">
                    <MessageSquare className="h-5 w-5" />
                  </button>

                  <button className="p-2 text-gray-400 hover:text-gray-300 rounded-full hover:bg-gray-700">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 문서 탭 */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">프로젝트 문서</h2>
            <button className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              <Plus className="h-4 w-4 mr-1.5" />
              문서 업로드
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
              <div className="col-span-6">파일명</div>
              <div className="col-span-2">업로더</div>
              <div className="col-span-2">업로드 날짜</div>
              <div className="col-span-1">크기</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-gray-700">
              {project.documents.map((document) => (
                <div key={document.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-750">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex items-center justify-center mr-3">
                        {fileTypeIcons[document.type as keyof typeof fileTypeIcons] || fileTypeIcons.default}
                      </div>
                      <div>
                        <p className="text-white font-medium">{document.name}</p>
                        <p className="text-xs text-gray-400">.{document.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-300">{document.uploadedBy.name}</span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-300">{formatDate(document.uploadedAt).slice(0, -3)}</span>
                  </div>

                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-300">{document.size}</span>
                  </div>

                  <div className="col-span-1 flex items-center justify-end">
                    <button className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 