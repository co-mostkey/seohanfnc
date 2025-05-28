"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, User, Users, Clock, AlertCircle, RefreshCw, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface IntranetUser {
    id: string;
    username: string;
    email: string;
    name: string;
    department: string;
    position: string;
    employeeId: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string | null;
}

interface PendingUser {
    id: string;
    username: string;
    email: string;
    name: string;
    employeeId: string;
    department: string;
    position: string;
    phone?: string;
    requestedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectReason?: string;
}

export default function IntranetUsersManagementPage() {
    const [users, setUsers] = useState<IntranetUser[]>([]);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/intranet/admin/users');
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '사용자 목록을 불러올 수 없습니다.');
            }

            setUsers(data.users || []);
            setPendingUsers(data.pendingUsers || []);
        } catch (error) {
            console.error('사용자 목록 로드 오류:', error);
            setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (pendingUser: PendingUser) => {
        setIsProcessing(true);
        setError('');

        try {
            const response = await fetch('/api/intranet/admin/users/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pendingUserId: pendingUser.id }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '승인에 실패했습니다.');
            }

            // 목록 새로고침
            await fetchUsers();
            alert(`${pendingUser.name}님의 계정이 승인되었습니다.`);
        } catch (error) {
            console.error('계정 승인 오류:', error);
            setError(error instanceof Error ? error.message : '계정 승인 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedUser || !rejectReason.trim()) {
            setError('거절 사유를 입력해주세요.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const response = await fetch('/api/intranet/admin/users/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pendingUserId: selectedUser.id,
                    rejectReason: rejectReason.trim()
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '거절에 실패했습니다.');
            }

            // 목록 새로고침
            await fetchUsers();
            setShowRejectDialog(false);
            setSelectedUser(null);
            setRejectReason('');
            alert(`${selectedUser.name}님의 계정 신청이 거절되었습니다.`);
        } catch (error) {
            console.error('계정 거절 오류:', error);
            setError(error instanceof Error ? error.message : '계정 거절 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleToggleUserStatus = async (user: IntranetUser) => {
        setIsProcessing(true);
        setError('');

        try {
            const response = await fetch(`/api/intranet/admin/users/${user.id}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || '상태 변경에 실패했습니다.');
            }

            // 목록 새로고침
            await fetchUsers();
            alert(`${user.name}님의 계정이 ${user.isActive ? '비활성화' : '활성화'}되었습니다.`);
        } catch (error) {
            console.error('사용자 상태 변경 오류:', error);
            setError(error instanceof Error ? error.message : '상태 변경 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const pendingCount = pendingUsers.filter(u => u.status === 'pending').length;
    const activeUsersCount = users.filter(u => u.isActive).length;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">인트라넷 사용자 관리</h1>
                    <p className="text-gray-600 mt-2">인트라넷 사용자 계정을 관리합니다.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                        <Users className="w-4 h-4" />
                        총 {users.length}명
                    </Badge>
                    <Badge variant="default" className="flex items-center gap-2 px-4 py-2">
                        <CheckCircle className="w-4 h-4" />
                        활성 {activeUsersCount}명
                    </Badge>
                    {pendingCount > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-2 px-4 py-2">
                            <Clock className="w-4 h-4" />
                            대기 {pendingCount}건
                        </Badge>
                    )}
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">
                        계정 신청 {pendingCount > 0 && `(${pendingCount})`}
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        활성 사용자 ({activeUsersCount})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        전체 사용자 ({users.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>대기 중인 계정 신청</CardTitle>
                            <CardDescription>
                                직원들의 인트라넷 계정 신청을 검토하고 승인하세요.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingUsers.filter(u => u.status === 'pending').length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    대기 중인 계정 신청이 없습니다.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>신청일시</TableHead>
                                            <TableHead>이름</TableHead>
                                            <TableHead>사번</TableHead>
                                            <TableHead>부서</TableHead>
                                            <TableHead>직급</TableHead>
                                            <TableHead>이메일</TableHead>
                                            <TableHead>사용자명</TableHead>
                                            <TableHead className="text-center">작업</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingUsers
                                            .filter(u => u.status === 'pending')
                                            .map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        {format(new Date(user.requestedAt), 'yyyy-MM-dd HH:mm', { locale: ko })}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell>{user.employeeId}</TableCell>
                                                    <TableCell>{user.department}</TableCell>
                                                    <TableCell>{user.position}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.username}</TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex gap-2 justify-center">
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => handleApprove(user)}
                                                                disabled={isProcessing}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                승인
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    setSelectedUser(user);
                                                                    setShowRejectDialog(true);
                                                                }}
                                                                disabled={isProcessing}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                거절
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>활성 사용자</CardTitle>
                            <CardDescription>
                                현재 활성화된 인트라넷 사용자 목록입니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>이름</TableHead>
                                        <TableHead>사번</TableHead>
                                        <TableHead>부서</TableHead>
                                        <TableHead>직급</TableHead>
                                        <TableHead>역할</TableHead>
                                        <TableHead>마지막 로그인</TableHead>
                                        <TableHead className="text-center">상태</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users
                                        .filter(u => u.isActive)
                                        .map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.employeeId}</TableCell>
                                                <TableCell>{user.department}</TableCell>
                                                <TableCell>{user.position}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === '인트라넷관리자' ? 'default' : 'secondary'}>
                                                        {user.role === '인트라넷관리자' && <Shield className="w-3 h-3 mr-1" />}
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.lastLogin
                                                        ? format(new Date(user.lastLogin), 'yyyy-MM-dd HH:mm', { locale: ko })
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleUserStatus(user)}
                                                        disabled={isProcessing || user.role === '인트라넷관리자'}
                                                    >
                                                        비활성화
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>전체 사용자</CardTitle>
                            <CardDescription>
                                모든 인트라넷 사용자 목록입니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>이름</TableHead>
                                        <TableHead>사번</TableHead>
                                        <TableHead>부서</TableHead>
                                        <TableHead>직급</TableHead>
                                        <TableHead>역할</TableHead>
                                        <TableHead>상태</TableHead>
                                        <TableHead>등록일</TableHead>
                                        <TableHead className="text-center">작업</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.employeeId}</TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell>{user.position}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === '인트라넷관리자' ? 'default' : 'secondary'}>
                                                    {user.role === '인트라넷관리자' && <Shield className="w-3 h-3 mr-1" />}
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                                    {user.isActive ? '활성' : '비활성'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(user.createdAt), 'yyyy-MM-dd', { locale: ko })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleToggleUserStatus(user)}
                                                    disabled={isProcessing || user.role === '인트라넷관리자'}
                                                >
                                                    {user.isActive ? '비활성화' : '활성화'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* 거절 사유 입력 다이얼로그 */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>계정 신청 거절</DialogTitle>
                        <DialogDescription>
                            {selectedUser?.name}님의 계정 신청을 거절하시겠습니까?
                            거절 사유를 입력해주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejectReason">거절 사유</Label>
                            <Textarea
                                id="rejectReason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="거절 사유를 입력하세요..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRejectDialog(false);
                                setSelectedUser(null);
                                setRejectReason('');
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isProcessing || !rejectReason.trim()}
                        >
                            거절
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 