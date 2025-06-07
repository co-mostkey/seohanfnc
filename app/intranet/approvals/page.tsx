"use client";

import React, { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Users,
  FileText,
  Eye,
  MessageSquare,
  Check,
  X,
  User,
  AlertTriangle,
  Download,
  RotateCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// [TRISID] 결재 상태 아이콘 매핑
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'in_progress': return <AlertCircle className="h-4 w-4" />;
    case 'approved': return <CheckCircle className="h-4 w-4" />;
    case 'rejected': return <X className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

// [TRISID] 결재 상태 색상 매핑
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// [TRISID] 상태 한글 변환
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '대기';
    case 'in_progress': return '진행중';
    case 'approved': return '승인';
    case 'rejected': return '반려';
    case 'cancelled': return '취소됨';
    default: return '알수없음';
  }
};

// [TRISID] 카테고리 아이콘 매핑
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'accounting': return <FileText className="h-5 w-5 text-green-400" />;
    case 'project': return <Briefcase className="h-5 w-5 text-blue-400" />;
    case 'marketing': return <FileText className="h-5 w-5 text-orange-400" />;
    case 'hr': return <Users className="h-5 w-5 text-purple-400" />;
    default: return <FileText className="h-5 w-5 text-gray-400" />;
  }
};

interface ApprovalStep {
  id: string;
  order: number;
  approverId: string;
  approverName: string;
  approverDepartment: string;
  approverRole: string;
  status: string;
  comment?: string;
  processedAt?: string;
}

interface Approval {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  createdAt: string;
  dueDate: string;
  approvalLine: ApprovalStep[];
  amount?: number;
}

interface User {
  id: string;
  username: string;
  name: string;
  department: string;
  position: string;
  role: string;
}

// [TRISID] 결재 상태별 액션 버튼 컴포넌트
const ApprovalActionButtons = ({ approval, currentUser, onApprove, onReject, onCancel, onView }: {
  approval: Approval;
  currentUser: User | null;
  onApprove: () => void;
  onReject: () => void;
  onCancel?: () => void;
  onView: () => void;
}) => {
  const canApprove = currentUser && (
    currentUser.role === 'admin' ||
    approval.approvalLine.some(step => step.approverId === currentUser.id && step.status === 'pending')
  );

  const isRequester = currentUser && approval.requesterId === currentUser.id;
  const canCancel = isRequester && (approval.status === 'pending' || approval.status === 'in_progress');

  return (
    <div className="flex gap-2 ml-4 flex-wrap items-center">
      {canApprove && (
        <>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onApprove}>
            <Check className="h-4 w-4 mr-1" /> 승인
          </Button>
          <Button onClick={onReject} className={cn(buttonVariants({ variant: 'outline' }), "border-red-600 text-red-400 hover:bg-red-600 hover:text-white")}>
            <X className="h-4 w-4 mr-1" /> 반려
          </Button>
        </>
      )}
      {canCancel && onCancel && (
        <Button onClick={onCancel} className={cn(buttonVariants({ variant: 'outline' }), "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white")}>
          <AlertCircle className="h-4 w-4 mr-1" /> 취소
        </Button>
      )}
      <Button onClick={onView} className={cn(buttonVariants({ variant: 'outline' }), "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white")}>
        <Eye className="h-4 w-4 mr-1" /> 상세보기
      </Button>
      {approval.status === 'approved' && (
        <Button className={cn(buttonVariants({ variant: 'outline' }), "border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white")}>
          <Download className="h-4 w-4 mr-1" /> 문서 다운로드
        </Button>
      )}
      {approval.status === 'rejected' && isRequester && (
        <Button onClick={() => alert('재신청 기능 구현 예정')} className={cn(buttonVariants({ variant: 'outline' }), "border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white")}>
          <RotateCw className="h-4 w-4 mr-1" /> 재신청
        </Button>
      )}
    </div>
  );
};

// [TRISID] 개선된 승인라인 상태 표시 컴포넌트
const ApprovalLineStatus = ({ approvalLine, currentUser }: {
  approvalLine: ApprovalStep[];
  currentUser: User | null;
}) => {
  const progress = (approvalLine.filter(step => step.status === 'approved').length / approvalLine.length) * 100;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">승인 진행률</span>
        <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
      </div>
      <div className="bg-gray-700/50 rounded-full h-2 w-full">
        <div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {approvalLine.map((step, index) => {
          const isMyTurn = step.status === 'pending' && currentUser?.id === step.approverId;
          const statusStyles = {
            approved: "bg-green-600/20 text-green-300 border-green-500/30",
            rejected: "bg-red-600/20 text-red-300 border-red-500/30",
            pending: isMyTurn ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 ring-2 ring-yellow-400/50 animate-pulse" : "bg-gray-600/20 text-gray-300 border-gray-500/30",
          }[step.status] || "bg-gray-700 text-gray-400";

          return (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${statusStyles}`}>
                {step.status === 'approved' && <Check className="h-3 w-3" />}
                {step.status === 'rejected' && <X className="h-3 w-3" />}
                {step.status === 'pending' && <Clock className="h-3 w-3" />}
                <span>{step.approverName} ({step.approverRole})</span>
                {isMyTurn && <span className="font-bold">(내 차례)</span>}
              </div>
              {index < approvalLine.length - 1 && <div className="h-px w-4 bg-gray-600" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


export default function ApprovalsPage() {
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalComment, setApprovalComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const categories = [
    { id: 'accounting', name: '회계' },
    { id: 'project', name: '프로젝트' },
    { id: 'marketing', name: '마케팅' },
    { id: 'hr', name: '인사' }
  ];

  useEffect(() => {
    loadCurrentUser();
    fetchApprovals();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/intranet/auth/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('[TRISID] 사용자 정보 로딩 오류:', error);
    }
  };

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/intranet/approvals');
      if (response.ok) {
        const data = await response.json();
        setApprovals(data.approvals || []);
      } else {
        throw new Error('결재 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('[TRISID] 결재 목록 로딩 오류:', error);
      toast({
        title: "로딩 실패",
        description: "결재 목록을 불러올 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || approval.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || approval.status === selectedStatus;
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'pending' && (approval.status === 'pending' || approval.status === 'in_progress')) ||
      (activeTab === 'completed' && (approval.status === 'approved' || approval.status === 'rejected')) ||
      (activeTab === 'my_requests' && currentUser && approval.requesterId === currentUser.id) ||
      (activeTab === 'my_approvals' && currentUser && (currentUser.role === 'admin' || approval.approvalLine.some(step => step.approverId === currentUser.id && step.status === 'pending')));

    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    myApprovals: currentUser ? approvals.filter(a =>
      (currentUser.role === 'admin' || a.approvalLine.some(step => step.approverId === currentUser.id)) && a.status === 'pending'
    ).length : 0
  };

  const handleApprovalAction = async () => {
    if (!selectedApproval || !currentUser) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/intranet/approvals/${selectedApproval.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: approvalAction,
          comment: approvalComment,
          approverId: currentUser.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: `결재 ${approvalAction === 'approve' ? '승인' : '반려'} 완료`,
          description: data.message,
        });
        setShowApprovalModal(false);
        setApprovalComment('');
        fetchApprovals();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "결재 처리 실패",
        description: error instanceof Error ? error.message : "결재 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const openApprovalModal = (approval: Approval, action: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleCancelApproval = async (approvalId: string) => {
    if (!confirm('정말로 이 결재를 취소하시겠습니까?')) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/intranet/approvals/${approvalId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "결재 취소 완료", description: "결재가 성공적으로 취소되었습니다." });
        fetchApprovals();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "결재 취소 실패",
        description: error instanceof Error ? error.message : "결재 취소 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">결재 시스템을 로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">결재 시스템</h1>
            <p className="text-gray-400 mt-2">전자결재 관리 및 승인 처리</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.href = '/intranet/approvals/new'}
          >
            <FileText className="h-4 w-4 mr-2" />
            새 결재 요청
          </Button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">전체</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </CardContent>
            </Card>
            <Card className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">대기중</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </CardContent>
            </Card>
            <Card className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">승인됨</p>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </CardContent>
            </Card>
            <Card className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">반려됨</p>
                  <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </CardContent>
            </Card>
            <Card className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">내 승인대기</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.myApprovals}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="결재 제목 또는 요청자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-gray-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-black/30 border-gray-700 text-gray-200 rounded-lg">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 bg-black/30 border-gray-700 text-gray-200 rounded-lg">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="in_progress">진행중</SelectItem>
                  <SelectItem value="approved">승인됨</SelectItem>
                  <SelectItem value="rejected">반려됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-black/20 p-1 rounded-lg">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600/50 data-[state=active]:text-white text-gray-400">전체</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600/50 data-[state=active]:text-white text-gray-400">대기</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-green-600/50 data-[state=active]:text-white text-gray-400">완료</TabsTrigger>
              <TabsTrigger value="my_requests" className="data-[state=active]:bg-purple-600/50 data-[state=active]:text-white text-gray-400">내 요청</TabsTrigger>
              <TabsTrigger value="my_approvals" className="data-[state=active]:bg-orange-600/50 data-[state=active]:text-white text-gray-400">내 승인대기</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-4">
                {filteredApprovals.length === 0 ? (
                  <Card className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                    <CardContent className="p-8 text-center text-gray-400">
                      <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      표시할 결재 건이 없습니다.
                    </CardContent>
                  </Card>
                ) : (
                  filteredApprovals.map((approval) => (
                    <Card key={approval.id} className="bg-black/20 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:border-blue-500/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              {getCategoryIcon(approval.category)}
                              <h3 className="text-lg font-semibold text-white">{approval.title}</h3>
                              <Badge className={`${getStatusColor(approval.status)} border shadow-sm`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(approval.status)}
                                  {getStatusText(approval.status)}
                                </div>
                              </Badge>
                              {approval.priority === 'high' && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 shadow-sm animate-pulse">
                                  <AlertTriangle className="h-3 w-3 mr-1" /> 긴급
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-300 mb-3 line-clamp-2">{approval.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                              <span>요청자: {approval.requesterName} ({approval.requesterDepartment})</span>
                              <span>요청일: {new Date(approval.createdAt).toLocaleDateString('ko-KR')}</span>
                              {approval.amount && <span>금액: {approval.amount.toLocaleString('ko-KR')}원</span>}
                            </div>
                            <ApprovalLineStatus approvalLine={approval.approvalLine} currentUser={currentUser} />
                          </div>
                          <ApprovalActionButtons
                            approval={approval}
                            currentUser={currentUser}
                            onApprove={() => openApprovalModal(approval, 'approve')}
                            onReject={() => openApprovalModal(approval, 'reject')}
                            onCancel={() => handleCancelApproval(approval.id)}
                            onView={() => { setSelectedApproval(approval); setShowDetailModal(true); }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
            <DialogContent className="bg-gray-900/80 backdrop-blur-lg border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>결재 {approvalAction === 'approve' ? '승인' : '반려'}</DialogTitle>
                <DialogDescription className="text-gray-400">{selectedApproval?.title}</DialogDescription>
              </DialogHeader>
              <Textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder={`${approvalAction === 'approve' ? '승인' : '반려'} 사유나 의견을 입력하세요...`}
                className="mt-1 bg-gray-800/80 border-gray-600 text-white"
                rows={3}
              />
              <DialogFooter>
                <Button onClick={() => setShowApprovalModal(false)} className={cn(buttonVariants({ variant: 'outline' }), "border-gray-600 text-gray-300")}>
                  취소
                </Button>
                <Button onClick={handleApprovalAction} disabled={processing} className={approvalAction === 'approve' ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
                  {processing ? '처리 중...' : (approvalAction === 'approve' ? '승인' : '반려')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="bg-gray-900/80 backdrop-blur-lg border-gray-700 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle>결재 상세 정보</DialogTitle>
              </DialogHeader>
              {/* Placeholder for details */}
              <div className="py-4 text-gray-300">
                결재 상세 내용이 여기에 표시됩니다.
              </div>
              <DialogFooter>
                <Button onClick={() => setShowDetailModal(false)} className={cn(buttonVariants({ variant: 'outline' }), "border-gray-600 text-gray-300")}>
                  닫기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
}