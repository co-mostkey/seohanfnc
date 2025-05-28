'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  Calendar,
  Tag,
  Users,
  Plus,
  Trash2,
  MoreHorizontal,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PauseCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
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
      }
    ]
  },
  {
    id: 2,
    name: '마케팅 캠페인 2024',
    description: '2024년 상반기 신제품 마케팅 캠페인',
    status: 'ongoing',
    progress: 80,
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    category: '마케팅',
    priority: 'medium',
    manager: {
      id: 5,
      name: '정수민',
      position: '과장',
      department: '마케팅',
      avatar: '/images/avatars/avatar-5.jpg'
    },
    team: [
      {
        id: 5,
        name: '정수민',
        position: '과장',
        department: '마케팅',
        avatar: '/images/avatars/avatar-5.jpg'
      },
      {
        id: 6,
        name: '강동원',
        position: '대리',
        department: '마케팅',
        avatar: '/images/avatars/avatar-6.jpg'
      },
      {
        id: 7,
        name: '임지원',
        position: '사원',
        department: '마케팅',
        avatar: '/images/avatars/avatar-7.jpg'
      }
    ],
    tasks: {
      total: 18,
      completed: 14
    },
    recentActivities: [
      {
        id: 1,
        user: {
          id: 5,
          name: '정수민',
          avatar: '/images/avatars/avatar-5.jpg'
        },
        action: '소셜미디어 광고 계획을 등록했습니다.',
        timestamp: '2024-04-16T09:15:00'
      }
    ]
  },
  {
    id: 3,
    name: '사내 인트라넷 개선',
    description: '기존 인트라넷 시스템 개선 및 추가 기능 개발',
    status: 'completed',
    progress: 100,
    startDate: '2023-11-01',
    endDate: '2024-03-31',
    category: '시스템개발',
    priority: 'medium',
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
      }
    ],
    tasks: {
      total: 32,
      completed: 32
    },
    recentActivities: [
      {
        id: 1,
        user: {
          id: 8,
          name: '한지민',
          avatar: '/images/avatars/avatar-8.jpg'
        },
        action: '프로젝트를 완료 처리했습니다.',
        timestamp: '2024-03-31T17:40:00'
      }
    ]
  },
  {
    id: 4,
    name: '신규 고객관리 시스템 도입',
    description: '고객 데이터 관리 및 분석을 위한 새로운 CRM 시스템 도입',
    status: 'delayed',
    progress: 40,
    startDate: '2024-01-20',
    endDate: '2024-04-30',
    category: '시스템도입',
    priority: 'high',
    manager: {
      id: 3,
      name: '박지성',
      position: '부장',
      department: '영업',
      avatar: '/images/avatars/avatar-3.jpg'
    },
    team: [
      {
        id: 3,
        name: '박지성',
        position: '부장',
        department: '영업',
        avatar: '/images/avatars/avatar-3.jpg'
      },
      {
        id: 4,
        name: '최민지',
        position: '대리',
        department: '영업',
        avatar: '/images/avatars/avatar-4.jpg'
      },
      {
        id: 9,
        name: '오승환',
        position: '차장',
        department: '개발',
        avatar: '/images/avatars/avatar-9.jpg'
      }
    ],
    tasks: {
      total: 22,
      completed: 9
    },
    recentActivities: [
      {
        id: 1,
        user: {
          id: 3,
          name: '박지성',
          avatar: '/images/avatars/avatar-3.jpg'
        },
        action: '프로젝트 일정을 연장 요청했습니다.',
        timestamp: '2024-04-10T15:20:00'
      }
    ]
  },
  {
    id: 5,
    name: '해외 시장 진출 전략',
    description: '동남아시아 시장 진출을 위한 전략 수립 및 현지 법인 설립 검토',
    status: 'planning',
    progress: 10,
    startDate: '2024-05-01',
    endDate: '2024-10-31',
    category: '사업확장',
    priority: 'high',
    manager: {
      id: 1,
      name: '김철수',
      position: '대표이사',
      department: '경영지원',
      avatar: '/images/avatars/avatar-1.jpg'
    },
    team: [
      {
        id: 1,
        name: '김철수',
        position: '대표이사',
        department: '경영지원',
        avatar: '/images/avatars/avatar-1.jpg'
      },
      {
        id: 2,
        name: '이영희',
        position: '이사',
        department: '영업',
        avatar: '/images/avatars/avatar-2.jpg'
      },
      {
        id: 18,
        name: '송중기',
        position: '부장',
        department: '재무',
        avatar: '/images/avatars/avatar-18.jpg'
      }
    ],
    tasks: {
      total: 15,
      completed: 1
    },
    recentActivities: [
      {
        id: 1,
        user: {
          id: 1,
          name: '김철수',
          avatar: '/images/avatars/avatar-1.jpg'
        },
        action: '프로젝트 킥오프 미팅을 예약했습니다.',
        timestamp: '2024-04-15T10:00:00'
      }
    ]
  },
  {
    id: 6,
    name: '공급망 최적화',
    description: '공급업체 평가 및 물류 시스템 개선을 통한 공급망 최적화',
    status: 'onhold',
    progress: 35,
    startDate: '2024-02-15',
    endDate: '2024-08-31',
    category: '물류',
    priority: 'medium',
    manager: {
      id: 20,
      name: '현빈',
      position: '부장',
      department: '구매',
      avatar: '/images/avatars/avatar-20.jpg'
    },
    team: [
      {
        id: 20,
        name: '현빈',
        position: '부장',
        department: '구매',
        avatar: '/images/avatars/avatar-20.jpg'
      },
      {
        id: 13,
        name: '권지용',
        position: '부장',
        department: '생산',
        avatar: '/images/avatars/avatar-13.jpg'
      },
      {
        id: 14,
        name: '남주혁',
        position: '과장',
        department: '생산',
        avatar: '/images/avatars/avatar-14.jpg'
      }
    ],
    tasks: {
      total: 28,
      completed: 10
    },
    recentActivities: [
      {
        id: 1,
        user: {
          id: 20,
          name: '현빈',
          avatar: '/images/avatars/avatar-20.jpg'
        },
        action: '프로젝트를 일시 중단 상태로 변경했습니다.',
        timestamp: '2024-04-05T14:10:00'
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'endDate'>('endDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 필터링 및 정렬 적용
  useEffect(() => {
    let result = [...projects];

    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        project =>
          project.name.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.category.toLowerCase().includes(term) ||
          project.manager.name.toLowerCase().includes(term)
      );
    }

    // 상태 필터링
    if (statusFilter) {
      result = result.filter(project => project.status === statusFilter);
    }

    // 카테고리 필터링
    if (categoryFilter) {
      result = result.filter(project => project.category === categoryFilter);
    }

    // 우선순위 필터링
    if (priorityFilter) {
      result = result.filter(project => project.priority === priorityFilter);
    }

    // 정렬 적용
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'progress') {
        return sortDirection === 'asc'
          ? a.progress - b.progress
          : b.progress - a.progress;
      } else if (sortBy === 'endDate') {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy, sortDirection]);

  // 정렬 핸들러
  const handleSort = (field: 'name' | 'progress' | 'endDate') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 useEffect에서 처리됨
  };

  // 상태별 프로젝트 수 계산
  const getProjectCountByStatus = (status: string) => {
    return projects.filter(project => project.status === status).length;
  };

  // 전체 카테고리 목록 추출
  const categories = Array.from(new Set(projects.map(project => project.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">프로젝트</h1>
          <p className="text-gray-400">
            총 {filteredProjects.length}개 프로젝트
            {statusFilter && ` · ${statusConfig[statusFilter as keyof typeof statusConfig].label}`}
            {categoryFilter && ` · ${categoryFilter}`}
          </p>
        </div>

        <Link
          href="/intranet/projects/create"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          새 프로젝트
        </Link>
      </div>
      {/* 상태별 프로젝트 개요 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div
            key={status}
            className={`p-4 bg-gray-800 rounded-lg border ${statusFilter === status ? config.borderColor : 'border-transparent'
              } cursor-pointer hover:bg-gray-750 transition-colors`}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-md ${config.bgColor}`}>
                <span className={config.textColor}>{config.icon}</span>
              </div>
              <span className="text-2xl font-bold text-white">{getProjectCountByStatus(status)}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">{config.label}</h3>
          </div>
        ))}
      </div>
      {/* 필터 및 검색 */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
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
                placeholder="프로젝트 검색..."
                className="block w-full bg-gray-700 border-gray-600 pl-10 pr-4 py-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* 카테고리 필터 */}
            <div className="relative">
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">모든 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* 우선순위 필터 */}
            <div className="flex items-center space-x-1">
              {Object.entries(priorityConfig).map(([priority, config]) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priorityFilter === priority ? null : priority)}
                  className={`inline-flex items-center px-3 py-2 rounded-md ${priorityFilter === priority
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-650'
                    }`}
                >
                  <span className={`mr-1.5 ${config.textColor}`}>{config.icon}</span>
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 프로젝트 목록 */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {filteredProjects.map(project => {
            const status = statusConfig[project.status as keyof typeof statusConfig];
            const priority = priorityConfig[project.priority as keyof typeof priorityConfig];

            return (
              <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
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
                      <h2 className="text-xl font-semibold text-white hover:text-blue-400 transition-colors">
                        <Link href={`/intranet/projects/${project.id}`} >
                          {project.name}
                        </Link>
                      </h2>
                      <p className="text-gray-400 mt-1">{project.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/intranet/projects/${project.id}`}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                      >
                        상세보기
                      </Link>
                      <Link
                        href={`/intranet/projects/${project.id}/edit`}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* 진행률 */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">진행률</span>
                        <span className="text-sm font-medium text-white">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${status.color}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 날짜 */}
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                      <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                    </div>

                    {/* 태스크 */}
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle2 className="h-4 w-4 mr-1.5 text-gray-500" />
                      <span>태스크: {project.tasks.completed}/{project.tasks.total}</span>
                    </div>

                    {/* 팀원 */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <div key={member.id} className="relative w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden">
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="relative w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm text-white border-2 border-gray-800">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">
                        {project.manager.name} 외 {project.team.length - 1}명
                      </span>
                    </div>
                  </div>

                  {/* 최근 활동 */}
                  {project.recentActivities.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">최근 활동</h3>
                      <div className="space-y-2">
                        {project.recentActivities.slice(0, 1).map(activity => (
                          <div key={activity.id} className="flex items-start">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                              <Image
                                src={activity.user.avatar}
                                alt={activity.user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-white">{activity.user.name}</span>
                                {' '}{activity.action}
                              </p>
                              <p className="text-xs text-gray-500">{getRelativeTime(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-1">프로젝트를 찾을 수 없습니다</p>
          <p className="text-sm text-gray-500 mb-4">검색 조건을 변경하거나 새 프로젝트를 생성하세요</p>
          <Link
            href="/intranet/projects/create"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            새 프로젝트
          </Link>
        </div>
      )}
    </div>
  );
} 