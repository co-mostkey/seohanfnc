"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calculator,
  Briefcase,
  Megaphone,
  Users,
  FileText,
  Eye,
  Edit,
  MessageSquare,
  Check,
  X,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

// [TRISID] 결재 상태 아이콘 매핑
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'in_progress': return <AlertCircle className="h-4 w-4" />;
    case 'approved': return <CheckCircle className="h-4 w-4" />;
    case 'rejected': return <XCircle className="h-4 w-4" />;
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
    case 'pending': return '대기중';
    case 'in_progress': return '진행중';
    case 'approved': return '승인됨';
    case 'rejected': return '반려됨';
    case 'cancelled': return '취소됨';
    default: return '알수없음';
  }
};

// [TRISID] 카테고리 아이콘 매핑
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'accounting': return <Calculator className="h-4 w-4" />;
    case 'project': return <Briefcase className="h-4 w-4" />;
    case 'marketing': return <Megaphone className="h-4 w-4" />;
    case 'hr': return <Users className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
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

export default function ApprovalsPageNew() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const { toast } = useToast();

  // [TRISID] 임시 사용자 설정 (실제로는 인증 API에서 가져옴)
  useEffect(() => {
    // 임시로 이상무(상무) 계정으로 설정
    setCurrentUser({
      id: 'user_003',
      username: 'lee_director',
      name: '이상무',
      department: '경영진',
      position: '상무',
      role: '임원'
    });
  }, []);

  // [TRISID] 결재 데이터 로드
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch('/api/intranet/approvals');
        const data = await response.json();
        
        if (data.success) {
          setApprovals(data.approvals || []);
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('[TRISID] 결재 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  // [TRISID] 필터링된 결재 목록
  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || approval.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || approval.status === selectedStatus;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && approval.status === 'pending') ||
                      (activeTab === 'in_progress' && approval.status === 'in_progress') ||
                      (activeTab === 'completed' && (approval.status === 'approved' || approval.status === 'rejected')) ||
                      (activeTab === 'my_requests' && currentUser && approval.requesterId === currentUser.id) ||
                      (activeTab === 'my_approvals' && currentUser && approval.approvalLine.some(step => step.approverId === currentUser.id && step.status === 'pending'));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  // [TRISID] 통계 계산
  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    inProgress: approvals.filter(a => a.status === 'in_progress').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    myApprovals: currentUser ? approvals.filter(a => a.approvalLine.some(step => step.approverId === currentUser.id && step.status === 'pending')).length : 0
  };

  // [TRISID] 결재 승인/반려 처리
  const handleApprovalAction = async () => {
    if (!selectedApproval || !approvalAction || !currentUser) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/intranet/approvals/${selectedApproval.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: approvalAction,
          approverId: currentUser.id,
          comment: approvalComment.trim() || null
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "결재 처리 완료",
          description: data.message,
        });

        // 결재 목록 새로고침
        const approvalsResponse = await fetch('/api/intranet/approvals');
        const approvalsData = await approvalsResponse.json();
        if (approvalsData.success) {
          setApprovals(approvalsData.approvals || []);
        }

        setShowApprovalModal(false);
        setSelectedApproval(null);
        setApprovalComment('');
        setApprovalAction(null);
      } else {
        toast({
          title: "오류",
          description: data.error || "결재 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[TRISID] 결재 처리 오류:', error);
      toast({
        title: "오류",
        description: "결재 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // [TRISID] 결재 승인/반려 모달 열기
  const openApprovalModal = (approval: Approval, action: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setApprovalAction(action);
    setApprovalComment('');
    setShowApprovalModal(true);
  };

  // [TRISID] 승인 가능 여부 확인
  const canApprove = (approval: Approval) => {
    if (!currentUser) return false;
    return approval.approvalLine.some(step => 
      step.approverId === currentUser.id && step.status === 'pending'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">결재 시스템 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* [TRISID] 헤더 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">결재 시스템 (실제 구동)</h1>
            <p className="text-gray-400 mt-1">회계, 프로젝트, 마케팅 등 업무 승인을 관리합니다</p>
            {currentUser && (
              <div className="flex items-center mt-2 text-sm text-gray-300">
                <User className="h-4 w-4 mr-2" />
                현재 사용자: {currentUser.name} ({currentUser.department} {currentUser.position})
              </div>
            )}
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.href = '/intranet/approvals/new'}
          >
            <Plus className="h-4 w-4 mr-2" />
            새 결재 요청
          </Button>
        </div>

        {/* [TRISID] 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">전체</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">대기중</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">진행중</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">승인됨</p>
                  <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">반려됨</p>
                  <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">내 승인대기</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.myApprovals}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* [TRISID] 필터 및 검색 */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="결재 제목 또는 요청자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="in_progress">진행중</SelectItem>
                <SelectItem value="approved">승인됨</SelectItem>
                <SelectItem value="rejected">반려됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* [TRISID] 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">전체</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600">대기중</TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:bg-blue-600">진행중</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-600">완료</TabsTrigger>
            <TabsTrigger value="my_requests" className="data-[state=active]:bg-purple-600">내 요청</TabsTrigger>
            <TabsTrigger value="my_approvals" className="data-[state=active]:bg-orange-600">내 승인대기</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredApprovals.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">표시할 결재 건이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredApprovals.map((approval) => (
                  <Card key={approval.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(approval.category)}
                              <h3 className="text-lg font-semibold text-white">{approval.title}</h3>
                            </div>
                            <Badge className={`${getStatusColor(approval.status)} border`}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(approval.status)}
                                {getStatusText(approval.status)}
                              </div>
                            </Badge>
                            {approval.priority === 'high' && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                긴급
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-300 mb-3 line-clamp-2">{approval.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>요청자: {approval.requesterName} ({approval.requesterDepartment})</span>
                            <span>요청일: {new Date(approval.createdAt).toLocaleDateString('ko-KR')}</span>
                            <span>마감일: {new Date(approval.dueDate).toLocaleDateString('ko-KR')}</span>
                            {approval.amount && (
                              <span>금액: {approval.amount.toLocaleString('ko-KR')}원</span>
                            )}
                          </div>

                          {/* [TRISID] 승인라인 표시 */}
                          <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">승인 라인:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {approval.approvalLine.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                  <div className={`px-3 py-1 rounded-full text-xs border ${
                                    step.status === 'approved' ? 'bg-green-600 text-white border-green-500' :
                                    step.status === 'rejected' ? 'bg-red-600 text-white border-red-500' :
                                    step.status === 'pending' ? 'bg-yellow-600 text-white border-yellow-500' :
                                    'bg-gray-600 text-gray-300 border-gray-500'
                                  }`}>
                                    {step.approverName} ({step.approverRole})
                                    {step.status === 'pending' && step.approverId === currentUser?.id && (
                                      <span className="ml-1 text-xs">← 내 차례</span>
                                    )}
                                  </div>
                                  {index < approval.approvalLine.length - 1 && (
                                    <div className="mx-2 text-gray-500">→</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {canApprove(approval) && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => openApprovalModal(approval, 'approve')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                승인
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                onClick={() => openApprovalModal(approval, 'reject')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                반려
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Eye className="h-4 w-4 mr-1" />
                            상세
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* [TRISID] 승인/반려 모달 */}
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>
                결재 {approvalAction === 'approve' ? '승인' : '반려'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedApproval?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  {approvalAction === 'approve' ? '승인' : '반려'} 의견 (선택사항)
                </label>
                <Textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder={`${approvalAction === 'approve' ? '승인' : '반려'} 사유나 의견을 입력하세요...`}
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApprovalModal(false)}
                className="border-gray-600 text-gray-300"
              >
                취소
              </Button>
              <Button
                onClick={handleApprovalAction}
                disabled={processing}
                className={
                  approvalAction === 'approve' 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              >
                {processing ? '처리 중...' : (approvalAction === 'approve' ? '승인' : '반려')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 