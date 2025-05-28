"use client";

import React, { useEffect, useState } from "react";
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_CARD_STYLES, ADMIN_UI } from "@/lib/admin-ui-constants";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus, Edit, Trash2, Users, UserCheck, UserX,
    Search, Filter, Download, Mail, Phone, Building,
    Calendar, Eye, Shield, RefreshCw
} from "lucide-react";
import { AdminUser } from "@/types/user";
import { Member, MemberStats } from "@/types/member";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// 관리자 사용자 편집용 타입 (password 포함)
interface AdminUserEdit extends Omit<AdminUser, 'password'> {
    password?: string;
}

export default function AdminUsersPage() {
    // 관리자 사용자 상태
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [adminLoading, setAdminLoading] = useState(true);
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [editAdminUser, setEditAdminUser] = useState<Partial<AdminUserEdit>>({});

    // 일반 회원 상태
    const [members, setMembers] = useState<Member[]>([]);
    const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
    const [memberLoading, setMemberLoading] = useState(true);
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [editMember, setEditMember] = useState<Partial<Member>>({});

    // 필터 및 검색 상태
    const [memberSearch, setMemberSearch] = useState('');
    const [memberStatusFilter, setMemberStatusFilter] = useState('all');
    const [memberSourceFilter, setMemberSourceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 관리자 사용자 로드
    const loadAdminUsers = async () => {
        setAdminLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();

            if (data.success) {
                setAdminUsers(data.users || []);
            } else {
                throw new Error(data.error);
            }
        } catch (e) {
            console.error('관리자 사용자 로드 오류:', e);
            toast.error('관리자 사용자를 불러오지 못했습니다.');
        } finally {
            setAdminLoading(false);
        }
    };

    // 일반 회원 로드
    const loadMembers = async () => {
        setMemberLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                includeStats: 'true'
            });

            if (memberSearch) params.append('search', memberSearch);
            if (memberStatusFilter !== 'all') params.append('status', memberStatusFilter);
            if (memberSourceFilter !== 'all') params.append('source', memberSourceFilter);

            const res = await fetch(`/api/admin/members?${params}`);
            const data = await res.json();

            if (data.success) {
                setMembers(data.members || []);
                setMemberStats(data.stats || null);
                setTotalPages(data.pagination?.totalPages || 1);
            } else {
                throw new Error(data.error);
            }
        } catch (e) {
            console.error('회원 목록 로드 오류:', e);
            toast.error('회원 목록을 불러오지 못했습니다.');
        } finally {
            setMemberLoading(false);
        }
    };

    useEffect(() => {
        loadAdminUsers();
        loadMembers();
    }, [currentPage, memberSearch, memberStatusFilter, memberSourceFilter]);

    // 관리자 사용자 관련 함수들
    const openNewAdmin = () => {
        setEditAdminUser({
            username: '',
            name: '',
            email: '',
            role: '스태프',
            isActive: true,
            permissions: []
        });
        setAdminModalOpen(true);
    };

    const openEditAdmin = (u: AdminUser) => {
        setEditAdminUser({ ...u });
        setAdminModalOpen(true);
    };

    const saveAdminUser = async () => {
        try {
            const method = editAdminUser.id ? 'PUT' : 'POST';
            const response = await fetch('/api/admin/users', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editAdminUser),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setAdminModalOpen(false);
                loadAdminUsers();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('관리자 사용자 저장 오류:', error);
            toast.error('저장에 실패했습니다.');
        }
    };

    const deleteAdminUser = async (id: string) => {
        if (!confirm('관리자 사용자를 삭제하시겠습니까?')) return;
        try {
            const response = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                loadAdminUsers();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('관리자 사용자 삭제 오류:', error);
            toast.error('삭제 실패');
        }
    };

    // 일반 회원 관련 함수들
    const openNewMember = () => {
        setEditMember({
            name: '',
            email: '',
            status: 'active',
            source: 'manual',
            marketingConsent: false,
            privacyConsent: true
        });
        setMemberModalOpen(true);
    };

    const openEditMember = (member: Member) => {
        setEditMember({ ...member });
        setMemberModalOpen(true);
    };

    const saveMember = async () => {
        try {
            const method = editMember.id ? 'PUT' : 'POST';
            const response = await fetch('/api/admin/members', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editMember),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setMemberModalOpen(false);
                loadMembers();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('저장에 실패했습니다.');
        }
    };

    const deleteMember = async (id: string) => {
        if (!confirm('회원을 삭제하시겠습니까?')) return;
        try {
            const response = await fetch(`/api/admin/members?id=${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                loadMembers();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('삭제 실패');
        }
    };

    // 회원 승인/거부 기능
    const approveMember = async (id: string) => {
        try {
            const response = await fetch('/api/admin/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status: 'active',
                    emailVerified: true
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('회원이 승인되었습니다.');
                loadMembers();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('회원 승인 오류:', error);
            toast.error('승인 처리에 실패했습니다.');
        }
    };

    const rejectMember = async (id: string) => {
        if (!confirm('회원 가입을 거부하시겠습니까?')) return;
        try {
            const response = await fetch('/api/admin/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status: 'suspended'
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('회원 가입이 거부되었습니다.');
                loadMembers();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('회원 거부 오류:', error);
            toast.error('거부 처리에 실패했습니다.');
        }
    };

    // 회원 상태 변경
    const changeMemberStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status: newStatus
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(`회원 상태가 ${newStatus === 'active' ? '활성' : newStatus === 'inactive' ? '비활성' : newStatus === 'suspended' ? '정지' : '대기'}로 변경되었습니다.`);
                loadMembers();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('상태 변경 오류:', error);
            toast.error('상태 변경에 실패했습니다.');
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
            suspended: 'bg-red-100 text-red-800'
        };
        return variants[status as keyof typeof variants] || variants.inactive;
    };

    const getSourceBadge = (source: string) => {
        const variants = {
            website: 'bg-blue-100 text-blue-800',
            inquiry: 'bg-purple-100 text-purple-800',
            manual: 'bg-orange-100 text-orange-800',
            import: 'bg-indigo-100 text-indigo-800'
        };
        return variants[source as keyof typeof variants] || variants.manual;
    };

    if (adminLoading && memberLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>사용자 데이터를 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>
                    사용자 관리
                </h1>
            </div>

            <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="members" className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        일반 회원 ({memberStats?.total || 0})
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        관리자 ({adminUsers.length})
                    </TabsTrigger>
                </TabsList>

                {/* 일반 회원 탭 */}
                <TabsContent value="members" className="space-y-6">
                    {/* 회원 통계 카드 */}
                    {memberStats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">전체 회원</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{memberStats.total}</div>
                                    <p className="text-xs text-muted-foreground">
                                        이번 달 +{memberStats.newThisMonth}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">활성 회원</CardTitle>
                                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{memberStats.active}</div>
                                    <p className="text-xs text-muted-foreground">
                                        최근 로그인 {memberStats.recentLogins}명
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">대기 중</CardTitle>
                                    <UserX className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{memberStats.pending}</div>
                                    <p className="text-xs text-muted-foreground">
                                        승인 대기 중
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">이번 주 신규</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{memberStats.newThisWeek}</div>
                                    <p className="text-xs text-muted-foreground">
                                        지난 7일간
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* 회원 필터 및 검색 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="이름, 이메일, 회사명으로 검색..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={memberStatusFilter} onValueChange={setMemberStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="상태 필터" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 상태</SelectItem>
                                <SelectItem value="active">활성</SelectItem>
                                <SelectItem value="inactive">비활성</SelectItem>
                                <SelectItem value="pending">대기</SelectItem>
                                <SelectItem value="suspended">정지</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={memberSourceFilter} onValueChange={setMemberSourceFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="가입 경로" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 경로</SelectItem>
                                <SelectItem value="website">웹사이트</SelectItem>
                                <SelectItem value="inquiry">문의</SelectItem>
                                <SelectItem value="manual">수동 등록</SelectItem>
                                <SelectItem value="import">일괄 등록</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={openNewMember} className={`${ADMIN_UI.BUTTON_PRIMARY} flex items-center`}>
                            <Plus className="h-4 w-4 mr-1" />
                            새 회원
                        </Button>
                    </div>

                    {/* 회원 목록 테이블 */}
                    <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-4`}>
                        <Table>
                            <TableHeader>
                                <TableRow className={ADMIN_UI.BORDER_LIGHT}>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>이름</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>이메일</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>회사</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>상태</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>가입경로</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>가입일</TableHead>
                                    <TableHead className="text-right" style={ADMIN_FONT_STYLES.TABLE_HEADER}>관리</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                            회원 목록을 불러오는 중...
                                        </TableCell>
                                    </TableRow>
                                ) : members.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            등록된 회원이 없습니다.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    members.map(member => (
                                        <TableRow key={member.id} className={`${ADMIN_UI.BORDER_LIGHT} hover:${ADMIN_UI.BG_HOVER}`}>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                <div className="flex items-center space-x-2">
                                                    <span>{member.name}</span>
                                                    {member.emailVerified && (
                                                        <Badge variant="outline" className="text-xs">
                                                            인증됨
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                <div className="flex items-center space-x-1">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <span>{member.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                {member.company && (
                                                    <div className="flex items-center space-x-1">
                                                        <Building className="h-3 w-3 text-gray-400" />
                                                        <span>{member.company}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(member.status)}>
                                                    {member.status === 'active' ? '활성' :
                                                        member.status === 'inactive' ? '비활성' :
                                                            member.status === 'pending' ? '대기' : '정지'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getSourceBadge(member.source)}>
                                                    {member.source === 'website' ? '웹사이트' :
                                                        member.source === 'inquiry' ? '문의' :
                                                            member.source === 'manual' ? '수동' : '일괄'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                                            </TableCell>
                                            <TableCell className="text-right space-x-1">
                                                {member.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white mr-1"
                                                            onClick={() => approveMember(member.id)}
                                                        >
                                                            <UserCheck className="h-3 w-3 mr-1" />
                                                            승인
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-300 text-red-600 hover:bg-red-50 mr-1"
                                                            onClick={() => rejectMember(member.id)}
                                                        >
                                                            <UserX className="h-3 w-3 mr-1" />
                                                            거부
                                                        </Button>
                                                    </>
                                                )}

                                                <Select
                                                    value={member.status}
                                                    onValueChange={(newStatus) => changeMemberStatus(member.id, newStatus)}
                                                >
                                                    <SelectTrigger className="w-20 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">활성</SelectItem>
                                                        <SelectItem value="inactive">비활성</SelectItem>
                                                        <SelectItem value="pending">대기</SelectItem>
                                                        <SelectItem value="suspended">정지</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={`hover:${ADMIN_UI.BG_ACCENT} ml-1`}
                                                    onClick={() => openEditMember(member)}
                                                >
                                                    <Edit className={`h-4 w-4 ${ADMIN_UI.TEXT_MUTED}`} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={`text-red-500 hover:text-red-400 hover:bg-red-900/50`}
                                                    onClick={() => deleteMember(member.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    이전
                                </Button>
                                <span className="flex items-center px-3 text-sm">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    다음
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* 관리자 탭 */}
                <TabsContent value="admins" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">시스템 관리자 및 스태프 계정을 관리합니다.</p>
                        <Button onClick={openNewAdmin} className={`${ADMIN_UI.BUTTON_PRIMARY} flex items-center`}>
                            <Plus className="h-4 w-4 mr-1" />
                            새 관리자
                        </Button>
                    </div>

                    <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-4`}>
                        <Table>
                            <TableHeader>
                                <TableRow className={ADMIN_UI.BORDER_LIGHT}>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>아이디</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>이름</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>이메일</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>권한</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>상태</TableHead>
                                    <TableHead className="text-right" style={ADMIN_FONT_STYLES.TABLE_HEADER}>관리</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                            관리자 목록을 불러오는 중...
                                        </TableCell>
                                    </TableRow>
                                ) : adminUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            등록된 관리자가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    adminUsers.map(u => (
                                        <TableRow key={u.id} className={`${ADMIN_UI.BORDER_LIGHT} hover:${ADMIN_UI.BG_HOVER}`}>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                <span className="font-mono text-sm">{u.username}</span>
                                            </TableCell>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                <div className="flex items-center space-x-2">
                                                    <span>{u.name}</span>
                                                    {!u.isActive && (
                                                        <Badge variant="outline" className="text-xs text-gray-500">
                                                            비활성
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                                <div className="flex items-center space-x-1">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    <span>{u.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    u.role === '관리자' ? 'bg-red-100 text-red-800' :
                                                        u.role === '에디터' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }>
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                    {u.isActive ? '활성' : '비활성'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={`hover:${ADMIN_UI.BG_ACCENT}`}
                                                    onClick={() => openEditAdmin(u)}
                                                >
                                                    <Edit className={`h-4 w-4 ${ADMIN_UI.TEXT_MUTED}`} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={`text-red-500 hover:text-red-400 hover:bg-red-900/50`}
                                                    onClick={() => deleteAdminUser(u.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* 관리자 사용자 모달 */}
            <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
                <DialogContent className={`${ADMIN_CARD_STYLES.DEFAULT} max-w-md w-full`}>
                    <DialogHeader>
                        <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                            관리자 {editAdminUser?.id ? '수정' : '추가'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label className="block mb-1 text-sm">아이디 *</Label>
                            <Input
                                value={editAdminUser.username || ''}
                                onChange={e => setEditAdminUser({ ...editAdminUser, username: e.target.value })}
                                className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                placeholder="로그인 아이디"
                                disabled={!!editAdminUser.id}
                            />
                            {editAdminUser.id && (
                                <p className="text-xs text-gray-500 mt-1">아이디는 수정할 수 없습니다.</p>
                            )}
                        </div>
                        <div>
                            <Label className="block mb-1 text-sm">이름 *</Label>
                            <Input
                                value={editAdminUser.name || ''}
                                onChange={e => setEditAdminUser({ ...editAdminUser, name: e.target.value })}
                                className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                placeholder="실명"
                            />
                        </div>
                        <div>
                            <Label className="block mb-1 text-sm">이메일 *</Label>
                            <Input
                                type="email"
                                value={editAdminUser.email || ''}
                                onChange={e => setEditAdminUser({ ...editAdminUser, email: e.target.value })}
                                className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                placeholder="이메일 주소"
                            />
                        </div>
                        <div>
                            <Label className="block mb-1 text-sm">
                                비밀번호{editAdminUser.id ? ' (변경 시에만 입력)' : ' *'}
                            </Label>
                            <Input
                                type="password"
                                value={editAdminUser.password || ''}
                                onChange={e => setEditAdminUser({ ...editAdminUser, password: e.target.value })}
                                className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                placeholder={editAdminUser.id ? "새 비밀번호 (선택사항)" : "비밀번호"}
                            />
                        </div>
                        <div>
                            <Label className="block mb-1 text-sm">권한</Label>
                            <Select
                                value={editAdminUser.role || '스태프'}
                                onValueChange={value => setEditAdminUser({ ...editAdminUser, role: value as any })}
                            >
                                <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                    <SelectValue placeholder="권한 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="관리자">관리자 (모든 권한)</SelectItem>
                                    <SelectItem value="에디터">에디터 (콘텐츠 관리)</SelectItem>
                                    <SelectItem value="스태프">스태프 (기본 권한)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={editAdminUser.isActive !== false}
                                onCheckedChange={checked => setEditAdminUser({ ...editAdminUser, isActive: checked })}
                            />
                            <Label className="text-sm">계정 활성화</Label>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setAdminModalOpen(false)}
                            className="mr-2"
                        >
                            취소
                        </Button>
                        <Button
                            onClick={saveAdminUser}
                            className={`${ADMIN_UI.BUTTON_PRIMARY}`}
                            style={ADMIN_FONT_STYLES.BUTTON}
                        >
                            저장
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 일반 회원 모달 */}
            <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
                <DialogContent className={`${ADMIN_CARD_STYLES.DEFAULT} max-w-2xl w-full`}>
                    <DialogHeader>
                        <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>
                            회원 {editMember?.id ? '수정' : '추가'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <Label className="block mb-1 text-sm">이름 *</Label>
                                <Input
                                    value={editMember.name || ''}
                                    onChange={e => setEditMember({ ...editMember, name: e.target.value })}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <Label className="block mb-1 text-sm">이메일 *</Label>
                                <Input
                                    type="email"
                                    value={editMember.email || ''}
                                    onChange={e => setEditMember({ ...editMember, email: e.target.value })}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <Label className="block mb-1 text-sm">전화번호</Label>
                                <Input
                                    value={editMember.phone || ''}
                                    onChange={e => setEditMember({ ...editMember, phone: e.target.value })}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <Label className="block mb-1 text-sm">회사명</Label>
                                <Input
                                    value={editMember.company || ''}
                                    onChange={e => setEditMember({ ...editMember, company: e.target.value })}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                            <div>
                                <Label className="block mb-1 text-sm">직책</Label>
                                <Input
                                    value={editMember.position || ''}
                                    onChange={e => setEditMember({ ...editMember, position: e.target.value })}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <Label className="block mb-1 text-sm">상태</Label>
                                <Select
                                    value={editMember.status || 'active'}
                                    onValueChange={value => setEditMember({ ...editMember, status: value as any })}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="상태 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">활성</SelectItem>
                                        <SelectItem value="inactive">비활성</SelectItem>
                                        <SelectItem value="pending">대기</SelectItem>
                                        <SelectItem value="suspended">정지</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="block mb-1 text-sm">가입 경로</Label>
                                <Select
                                    value={editMember.source || 'manual'}
                                    onValueChange={value => setEditMember({ ...editMember, source: value as any })}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="가입 경로" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="website">웹사이트</SelectItem>
                                        <SelectItem value="inquiry">문의</SelectItem>
                                        <SelectItem value="manual">수동 등록</SelectItem>
                                        <SelectItem value="import">일괄 등록</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editMember.emailVerified || false}
                                    onCheckedChange={checked => setEditMember({ ...editMember, emailVerified: checked })}
                                />
                                <Label className="text-sm">이메일 인증됨</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editMember.marketingConsent || false}
                                    onCheckedChange={checked => setEditMember({ ...editMember, marketingConsent: checked })}
                                />
                                <Label className="text-sm">마케팅 수신 동의</Label>
                            </div>
                            <div>
                                <Label className="block mb-1 text-sm">메모</Label>
                                <Textarea
                                    value={editMember.notes || ''}
                                    onChange={e => setEditMember({ ...editMember, notes: e.target.value })}
                                    className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={saveMember} className={`${ADMIN_UI.BUTTON_PRIMARY}`} style={ADMIN_FONT_STYLES.BUTTON}>
                            저장
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 