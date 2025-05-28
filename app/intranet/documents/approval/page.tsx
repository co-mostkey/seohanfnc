'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Bookmark,
  FileText,
  FileImage,
  User,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  ListFilter,
  Eye,
  CheckCircle,
  X,
  PenSquare,
  RotateCcw,
  Check
} from 'lucide-react';

// 임시 문서 결재 데이터
const initialApprovals = [
  {
    id: 1,
    title: '2024년 예산안 검토 요청',
    document: {
      id: 101,
      name: '2024년_예산안_v1.2.xlsx',
      type: 'xlsx',
      size: '2.4MB'
    },
    status: 'pending', // pending, in_progress, approved, rejected
    priority: 'high',
    requestedBy: {
      id: 18,
      name: '송중기',
      position: '부장',
      department: '재무',
      avatar: '/images/avatars/avatar-18.jpg'
    },
    requestedAt: '2024-04-15T09:30:00',
    dueDate: '2024-04-18T18:00:00',
    approvalFlow: [
      {
        id: 2,
        name: '이영희',
        position: '이사',
        department: '영업',
        avatar: '/images/avatars/avatar-2.jpg',
        status: 'approved',
        comment: '수정사항 반영되었음을 확인했습니다.',
        approvedAt: '2024-04-15T14:20:00'
      },
      {
        id: 1,
        name: '김철수',
        position: '대표이사',
        department: '경영지원',
        avatar: '/images/avatars/avatar-1.jpg',
        status: 'pending',
        comment: '',
        approvedAt: null
      }
    ],
    comments: [
      {
        id: 1,
        user: {
          id: 18,
          name: '송중기',
          position: '부장',
          department: '재무',
          avatar: '/images/avatars/avatar-18.jpg'
        },
        text: '각 부서별 예산안을 검토하여 최종 확정 부탁드립니다.',
        timestamp: '2024-04-15T09:30:00'
      },
      {
        id: 2,
        user: {
          id: 2,
          name: '이영희',
          position: '이사',
          department: '영업',
          avatar: '/images/avatars/avatar-2.jpg'
        },
        text: '영업팀 예산 관련 수정사항을 확인했습니다. 승인합니다.',
        timestamp: '2024-04-15T14:20:00'
      }
    ],
    description: '2024년도 부서별 예산안입니다. 검토 후 승인 부탁드립니다.'
  },
  {
    id: 2,
    title: '마케팅 캠페인 계획 승인 요청',
    document: {
      id: 102,
      name: '2024_마케팅캠페인_계획.pdf',
      type: 'pdf',
      size: '3.8MB'
    },
    status: 'in_progress',
    priority: 'medium',
    requestedBy: {
      id: 5,
      name: '정수민',
      position: '과장',
      department: '마케팅',
      avatar: '/images/avatars/avatar-5.jpg'
    },
    requestedAt: '2024-04-14T11:15:00',
    dueDate: '2024-04-17T18:00:00',
    approvalFlow: [
      {
        id: 3,
        name: '박지성',
        position: '부장',
        department: '영업',
        avatar: '/images/avatars/avatar-3.jpg',
        status: 'approved',
        comment: '캠페인 예산 확인했습니다.',
        approvedAt: '2024-04-14T15:30:00'
      },
      {
        id: 2,
        name: '이영희',
        position: '이사',
        department: '영업',
        avatar: '/images/avatars/avatar-2.jpg',
        status: 'approved',
        comment: '전반적인 캠페인 방향성 좋습니다.',
        approvedAt: '2024-04-15T10:45:00'
      },
      {
        id: 1,
        name: '김철수',
        position: '대표이사',
        department: '경영지원',
        avatar: '/images/avatars/avatar-1.jpg',
        status: 'pending',
        comment: '',
        approvedAt: null
      }
    ],
    comments: [
      {
        id: 1,
        user: {
          id: 5,
          name: '정수민',
          position: '과장',
          department: '마케팅',
          avatar: '/images/avatars/avatar-5.jpg'
        },
        text: '2분기 마케팅 캠페인 계획서입니다. 검토 부탁드립니다.',
        timestamp: '2024-04-14T11:15:00'
      },
      {
        id: 2,
        user: {
          id: 3,
          name: '박지성',
          position: '부장',
          department: '영업',
          avatar: '/images/avatars/avatar-3.jpg'
        },
        text: '예산 계획 검토 완료했습니다.',
        timestamp: '2024-04-14T15:30:00'
      },
      {
        id: 3,
        user: {
          id: 2,
          name: '이영희',
          position: '이사',
          department: '영업',
          avatar: '/images/avatars/avatar-2.jpg'
        },
        text: '타겟 고객층 분석이 잘 되어있습니다. 승인합니다.',
        timestamp: '2024-04-15T10:45:00'
      }
    ],
    description: '2분기 마케팅 캠페인 계획서입니다. 예산 및 실행 계획을 검토 부탁드립니다.'
  },
  {
    id: 3,
    title: '신규 거래처 계약서 검토 요청',
    document: {
      id: 103,
      name: '거래계약서_주식회사명성.pdf',
      type: 'pdf',
      size: '1.2MB'
    },
    status: 'approved',
    priority: 'high',
    requestedBy: {
      id: 3,
      name: '박지성',
      position: '부장',
      department: '영업',
      avatar: '/images/avatars/avatar-3.jpg'
    },
    requestedAt: '2024-04-10T09:45:00',
    dueDate: '2024-04-12T18:00:00',
    approvalFlow: [
      {
        id: 2,
        name: '이영희',
        position: '이사',
        department: '영업',
        avatar: '/images/avatars/avatar-2.jpg',
        status: 'approved',
        comment: '계약 조건 검토 완료했습니다.',
        approvedAt: '2024-04-10T13:20:00'
      },
      {
        id: 1,
        name: '김철수',
        position: '대표이사',
        department: '경영지원',
        avatar: '/images/avatars/avatar-1.jpg',
        status: 'approved',
        comment: '계약 조건 확인했습니다. 승인합니다.',
        approvedAt: '2024-04-11T10:15:00'
      }
    ],
    comments: [
      {
        id: 1,
        user: {
          id: 3,
          name: '박지성',
          position: '부장',
          department: '영업',
          avatar: '/images/avatars/avatar-3.jpg'
        },
        text: '신규 거래처 계약서 검토 부탁드립니다.',
        timestamp: '2024-04-10T09:45:00'
      },
      {
        id: 2,
        user: {
          id: 2,
          name: '이영희',
          position: '이사',
          department: '영업',
          avatar: '/images/avatars/avatar-2.jpg'
        },
        text: '계약 조건 검토 완료했습니다. 이상 없습니다.',
        timestamp: '2024-04-10T13:20:00'
      },
      {
        id: 3,
        user: {
          id: 1,
          name: '김철수',
          position: '대표이사',
          department: '경영지원',
          avatar: '/images/avatars/avatar-1.jpg'
        },
        text: '검토 완료했습니다. 계약 진행하세요.',
        timestamp: '2024-04-11T10:15:00'
      }
    ],
    description: '신규 거래처 주식회사 명성과의 계약서 검토 부탁드립니다.'
  },
  {
    id: 4,
    title: '인사 평가 기준 변경안 검토',
    document: {
      id: 104,
      name: '인사평가기준_변경안_2024.docx',
      type: 'docx',
      size: '0.9MB'
    },
    status: 'rejected',
    priority: 'medium',
    requestedBy: {
      id: 11,
      name: '장미영',
      position: '부장',
      department: '인사',
      avatar: '/images/avatars/avatar-11.jpg'
    },
    requestedAt: '2024-04-08T14:30:00',
    dueDate: '2024-04-11T18:00:00',
    approvalFlow: [
      {
        id: 8,
        name: '한지민',
        position: '부장',
        department: '개발',
        avatar: '/images/avatars/avatar-8.jpg',
        status: 'approved',
        comment: '개발팀 의견 반영되었습니다.',
        approvedAt: '2024-04-09T11:20:00'
      },
      {
        id: 1,
        name: '김철수',
        position: '대표이사',
        department: '경영지원',
        avatar: '/images/avatars/avatar-1.jpg',
        status: 'rejected',
        comment: '몇 가지 사항 수정 후 재검토 필요합니다.',
        approvedAt: '2024-04-10T16:45:00'
      }
    ],
    comments: [
      {
        id: 1,
        user: {
          id: 11,
          name: '장미영',
          position: '부장',
          department: '인사',
          avatar: '/images/avatars/avatar-11.jpg'
        },
        text: '2024년 인사평가 기준 변경안입니다. 검토 부탁드립니다.',
        timestamp: '2024-04-08T14:30:00'
      },
      {
        id: 2,
        user: {
          id: 8,
          name: '한지민',
          position: '부장',
          department: '개발',
          avatar: '/images/avatars/avatar-8.jpg'
        },
        text: '개발팀 의견 반영된 것 확인했습니다.',
        timestamp: '2024-04-09T11:20:00'
      },
      {
        id: 3,
        user: {
          id: 1,
          name: '김철수',
          position: '대표이사',
          department: '경영지원',
          avatar: '/images/avatars/avatar-1.jpg'
        },
        text: '성과 평가 지표 부분과 평가 주기에 대한 부분을 수정해주세요. 현재안으로는 승인하기 어렵습니다.',
        timestamp: '2024-04-10T16:45:00'
      }
    ],
    description: '2024년 인사평가 기준 변경안입니다. 각 부서의 의견을 반영하여 작성했습니다.'
  }
];

// 상태별 색상 및 아이콘 설정
const statusConfig = {
  pending: {
    label: '결재 대기',
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: <Clock className="h-4 w-4" />
  },
  in_progress: {
    label: '결재 진행중',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    icon: <ArrowRight className="h-4 w-4" />
  },
  approved: {
    label: '승인 완료',
    textColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  rejected: {
    label: '반려됨',
    textColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: <XCircle className="h-4 w-4" />
  }
};

// 우선순위별 색상 및 아이콘 설정
const priorityConfig = {
  high: {
    label: '높음',
    textColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: <ArrowUpRight className="h-4 w-4" />
  },
  medium: {
    label: '중간',
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: <ArrowUpRight className="h-4 w-4 rotate-45" />
  },
  low: {
    label: '낮음',
    textColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: <ArrowUpRight className="h-4 w-4 rotate-90" />
  }
};

// 파일 타입별 아이콘 설정
const getFileIcon = (type: string) => {
  const iconClass = "h-5 w-5";

  switch (type) {
    case 'pdf':
      return <FileText className={`${iconClass} text-red-500`} />;
    case 'docx':
    case 'doc':
      return <FileText className={`${iconClass} text-blue-500`} />;
    case 'xlsx':
    case 'xls':
      return <FileText className={`${iconClass} text-green-500`} />;
    case 'ppt':
    case 'pptx':
      return <FileText className={`${iconClass} text-orange-500`} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImage className={`${iconClass} text-purple-500`} />;
    default:
      return <FileText className={`${iconClass} text-gray-500`} />;
  }
};

// 상대적 날짜 계산 함수
const getRelativeTimeString = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 30) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('ko-KR', options);
  } else if (diffInDays > 0) {
    return `${diffInDays}일 전`;
  } else if (diffInHours > 0) {
    return `${diffInHours}시간 전`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`;
  } else {
    return '방금 전';
  }
};

export default function DocumentApprovalPage() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [filteredApprovals, setFilteredApprovals] = useState(initialApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  // 필터링 적용
  useEffect(() => {
    let result = [...approvals];

    // 상태 필터링
    if (statusFilter !== 'all') {
      result = result.filter(approval => approval.status === statusFilter);
    }

    // 우선순위 필터링
    if (priorityFilter !== 'all') {
      result = result.filter(approval => approval.priority === priorityFilter);
    }

    // 검색어 필터링
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        approval =>
          approval.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          approval.document.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          approval.requestedBy.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (approval.description && approval.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    setFilteredApprovals(result);
  }, [approvals, statusFilter, priorityFilter, searchTerm]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 useEffect에서 처리됨
  };

  // 결재 처리 핸들러
  const handleApprovalAction = (id: number, action: 'approve' | 'reject') => {
    const updatedApprovals = approvals.map(approval => {
      if (approval.id === id) {
        // 현재 사용자의 결재 단계 찾기
        const currentUserIndex = approval.approvalFlow.findIndex(step => step.id === 1); // 현재 로그인한 사용자 ID

        if (currentUserIndex !== -1) {
          // 결재 단계 업데이트
          const updatedFlow = [...approval.approvalFlow];
          updatedFlow[currentUserIndex] = {
            ...updatedFlow[currentUserIndex],
            status: action === 'approve' ? 'approved' : 'rejected',
            comment: comment,
            approvedAt: new Date().toISOString()
          };

          // 새 댓글 추가
          const newComment = {
            id: approval.comments.length + 1,
            user: {
              id: 1, // 현재 로그인한 사용자 ID
              name: '김철수',
              position: '대표이사',
              department: '경영지원',
              avatar: '/images/avatars/avatar-1.jpg'
            },
            text: comment || (action === 'approve' ? '승인합니다.' : '반려합니다.'),
            timestamp: new Date().toISOString()
          };

          let newStatus = approval.status;

          // 결재 상태 업데이트
          if (action === 'reject') {
            newStatus = 'rejected';
          } else if (action === 'approve') {
            // 모든 단계가 승인되었는지 확인
            const allApproved = updatedFlow.every(step => step.status === 'approved');
            if (allApproved) {
              newStatus = 'approved';
            } else {
              // 다음 결재자가 있으면 in_progress로 상태 변경
              const nextApproverIndex = updatedFlow.findIndex(step => step.status === 'pending');
              if (nextApproverIndex !== -1) {
                newStatus = 'in_progress';
              }
            }
          }

          return {
            ...approval,
            status: newStatus,
            approvalFlow: updatedFlow,
            comments: [...approval.comments, newComment]
          };
        }
      }
      return approval;
    });

    setApprovals(updatedApprovals);
    setSelectedApproval(null);
    setComment('');
  };

  // 선택된 결재 문서 가져오기
  const getSelectedApproval = () => {
    if (selectedApproval === null) return null;
    return approvals.find(approval => approval.id === selectedApproval);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">문서 결재</h1>
          <p className="text-gray-400">
            총 {filteredApprovals.length}개의 결재 문서가 있습니다
          </p>
        </div>

        <Link
          href="/intranet/documents/approval/create"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          <PenSquare className="h-4 w-4 mr-1.5" />
          결재 요청
        </Link>
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
                placeholder="제목, 문서명, 요청자 검색..."
                className="block w-full bg-gray-700 border-gray-600 pl-10 pr-4 py-2 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">상태: 전체</option>
                <option value="pending">결재 대기</option>
                <option value="in_progress">결재 진행중</option>
                <option value="approved">승인 완료</option>
                <option value="rejected">반려됨</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">우선순위: 전체</option>
                <option value="high">높음</option>
                <option value="medium">중간</option>
                <option value="low">낮음</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      {/* 결재 문서 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 결재 목록 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-medium text-white">결재 목록</h2>
            </div>

            <div className="divide-y divide-gray-700 max-h-[calc(100vh-250px)] overflow-y-auto">
              {filteredApprovals.length > 0 ? (
                filteredApprovals.map((approval) => {
                  const status = statusConfig[approval.status as keyof typeof statusConfig];
                  const priority = priorityConfig[approval.priority as keyof typeof priorityConfig];

                  return (
                    <button
                      key={approval.id}
                      onClick={() => setSelectedApproval(approval.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-750 transition-colors ${selectedApproval === approval.id ? 'bg-gray-750' : ''
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="max-w-[80%]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                              {status.icon}
                              <span className="ml-1">{status.label}</span>
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priority.bgColor} ${priority.textColor}`}>
                              {priority.icon}
                              <span className="ml-1">{priority.label}</span>
                            </span>
                          </div>
                          <h3 className="text-white font-medium truncate">{approval.title}</h3>
                        </div>
                        {approval.status === 'pending' && (
                          <span className="px-1.5 py-0.5 bg-blue-900 text-blue-300 text-xs rounded-md">
                            결재 필요
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-400">
                        <User className="h-3.5 w-3.5 mr-1" />
                        <span>{approval.requestedBy.name}</span>
                        <span className="mx-1.5">•</span>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{getRelativeTimeString(approval.requestedAt)}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <ListFilter className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">결재할 문서가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 결재 상세 */}
        <div className="lg:col-span-2">
          {selectedApproval !== null ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {getSelectedApproval() && (
                <>
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <h2 className="text-xl font-medium text-white">{getSelectedApproval()?.title}</h2>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig[getSelectedApproval()?.status as keyof typeof statusConfig].bgColor
                          } ${statusConfig[getSelectedApproval()?.status as keyof typeof statusConfig].textColor
                          }`}>
                          {statusConfig[getSelectedApproval()?.status as keyof typeof statusConfig].icon}
                          <span className="ml-1.5">{statusConfig[getSelectedApproval()?.status as keyof typeof statusConfig].label}</span>
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${priorityConfig[getSelectedApproval()?.priority as keyof typeof priorityConfig].bgColor
                          } ${priorityConfig[getSelectedApproval()?.priority as keyof typeof priorityConfig].textColor
                          }`}>
                          {priorityConfig[getSelectedApproval()?.priority as keyof typeof priorityConfig].icon}
                          <span className="ml-1.5">우선순위: {priorityConfig[getSelectedApproval()?.priority as keyof typeof priorityConfig].label}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">요청자</p>
                          <div className="flex items-center">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                              <Image
                                src={getSelectedApproval()?.requestedBy.avatar || ''}
                                alt={getSelectedApproval()?.requestedBy.name || ''}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-white">
                                {getSelectedApproval()?.requestedBy.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {getSelectedApproval()?.requestedBy.position}, {getSelectedApproval()?.requestedBy.department}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">요청 일시</p>
                          <p className="text-white">
                            {new Date(getSelectedApproval()?.requestedAt || '').toLocaleString('ko-KR')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">결재 문서</p>
                          <div className="flex items-center p-3 bg-gray-750 rounded-lg">
                            <div className="h-8 w-8 flex items-center justify-center mr-3">
                              {getFileIcon(getSelectedApproval()?.document.type || '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white truncate">{getSelectedApproval()?.document.name}</p>
                              <p className="text-xs text-gray-400">{getSelectedApproval()?.document.size}</p>
                            </div>
                            <Link
                              href={`/intranet/documents/${getSelectedApproval()?.document.id}`}
                              className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md transition-colors ml-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-400 mb-1">결재 기한</p>
                          <p className="text-white">
                            {new Date(getSelectedApproval()?.dueDate || '').toLocaleString('ko-KR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-400 mb-2">요청 내용</p>
                      <p className="text-white bg-gray-750 p-3 rounded-lg">
                        {getSelectedApproval()?.description}
                      </p>
                    </div>
                  </div>

                  {/* 결재선 */}
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">결재선</h3>

                    <div className="space-y-6">
                      {getSelectedApproval()?.approvalFlow.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-start ${index !== getSelectedApproval()?.approvalFlow.length! - 1
                            ? 'pb-6 border-b border-gray-700'
                            : ''
                            }`}
                        >
                          <div className="relative mr-4">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={step.avatar}
                                alt={step.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {step.status !== 'pending' && (
                              <div className={`absolute -bottom-1 -right-1 rounded-full p-1 ${step.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                {step.status === 'approved'
                                  ? <Check className="h-3 w-3 text-white" />
                                  : <X className="h-3 w-3 text-white" />
                                }
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{step.name}</h4>
                              <span className="text-sm text-gray-400">
                                {step.position}, {step.department}
                              </span>
                              {step.status === 'pending' ? (
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">
                                  대기중
                                </span>
                              ) : step.status === 'approved' ? (
                                <span className="px-2 py-0.5 bg-green-900 text-green-300 text-xs rounded-full">
                                  승인됨
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-red-900 text-red-300 text-xs rounded-full">
                                  반려됨
                                </span>
                              )}
                            </div>

                            {step.comment && (
                              <p className="text-gray-300 mb-2">
                                "{step.comment}"
                              </p>
                            )}

                            {step.approvedAt && (
                              <p className="text-xs text-gray-400">
                                {new Date(step.approvedAt).toLocaleString('ko-KR')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 결재 의견 */}
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">의견</h3>

                    <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                      {getSelectedApproval()?.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                            <Image
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 bg-gray-750 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                              <h4 className="text-white font-medium">{comment.user.name}</h4>
                              <span className="mx-2 text-gray-600">•</span>
                              <span className="text-xs text-gray-400">{getRelativeTimeString(comment.timestamp)}</span>
                            </div>
                            <p className="text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 결재 처리 버튼 */}
                    {getSelectedApproval()?.status === 'pending' ||
                      (getSelectedApproval()?.status === 'in_progress' &&
                        getSelectedApproval()?.approvalFlow.some(step => step.id === 1 && step.status === 'pending')) ? (
                      <div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="의견을 입력하세요..."
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                          rows={3}
                        ></textarea>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleApprovalAction(getSelectedApproval()?.id as number, 'reject')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                          >
                            <XCircle className="h-4 w-4 mr-1.5 inline-block" />
                            반려
                          </button>
                          <button
                            onClick={() => handleApprovalAction(getSelectedApproval()?.id as number, 'approve')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-1.5 inline-block" />
                            승인
                          </button>
                        </div>
                      </div>
                    ) : (
                      getSelectedApproval()?.status === 'rejected' && (
                        <div className="flex justify-end">
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                            <RotateCcw className="h-4 w-4 mr-1.5 inline-block" />
                            재요청
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center justify-center h-full min-h-[500px]">
              <Bookmark className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">결재 문서를 선택하세요</h3>
              <p className="text-gray-400 text-center max-w-md">
                왼쪽 목록에서 결재할 문서를 선택하면 상세 내용을 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 