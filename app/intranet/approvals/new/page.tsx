"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    X,
    Upload,
    Calculator,
    Briefcase,
    Megaphone,
    Users,
    FileText,
    UserPlus,
    Save
} from 'lucide-react';

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

interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    defaultApprovers: string[];
}

interface Employee {
    id: string;
    name: string;
    department: string;
    position: string;
    email: string;
}

interface ApprovalStep {
    approverId: string;
    approverName: string;
    approverDepartment: string;
    approverRole: string;
}

export default function NewApprovalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // [TRISID] 폼 데이터
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: '',
        amount: '',
        priority: 'normal',
        dueDate: ''
    });

    const [approvalLine, setApprovalLine] = useState<ApprovalStep[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);

    // [TRISID] 초기 데이터 로드
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 카테고리 및 직원 데이터 로드
                const [approvalsRes, employeesRes, userRes] = await Promise.all([
                    fetch('/api/intranet/approvals'),
                    fetch('/api/intranet/employees'),
                    fetch('/api/auth/intranet-verify', { method: 'POST' })
                ]);

                const [approvalsData, employeesData, userData] = await Promise.all([
                    approvalsRes.json(),
                    employeesRes.json(),
                    userRes.json()
                ]);

                if (approvalsData.success) {
                    setCategories(approvalsData.categories || []);
                }

                if (employeesData.success) {
                    setEmployees(employeesData.employees || []);
                }

                if (userData.success && userData.user) {
                    setCurrentUser(userData.user);
                }

            } catch (error) {
                console.error('[TRISID] 초기 데이터 로드 오류:', error);
            }
        };

        fetchInitialData();
    }, []);

    // [TRISID] 카테고리 변경 시 기본 결재라인 설정
    useEffect(() => {
        if (formData.category && categories.length > 0) {
            const selectedCategory = categories.find(cat => cat.id === formData.category);
            if (selectedCategory && selectedCategory.defaultApprovers.length > 0) {
                const defaultLine = selectedCategory.defaultApprovers.map(approverId => {
                    const employee = employees.find(emp => emp.id === approverId);
                    return employee ? {
                        approverId: employee.id,
                        approverName: employee.name,
                        approverDepartment: employee.department,
                        approverRole: employee.position
                    } : null;
                }).filter(Boolean) as ApprovalStep[];

                setApprovalLine(defaultLine);
            }
        }
    }, [formData.category, categories, employees]);

    // [TRISID] 폼 입력 핸들러
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // [TRISID] 결재자 추가
    const addApprover = (employee: Employee) => {
        const newStep: ApprovalStep = {
            approverId: employee.id,
            approverName: employee.name,
            approverDepartment: employee.department,
            approverRole: employee.position
        };

        setApprovalLine(prev => [...prev, newStep]);
    };

    // [TRISID] 결재자 제거
    const removeApprover = (index: number) => {
        setApprovalLine(prev => prev.filter((_, i) => i !== index));
    };

    // [TRISID] 파일 업로드 핸들러
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setAttachments(prev => [...prev, ...files]);
    };

    // [TRISID] 파일 제거
    const removeFile = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    // [TRISID] 결재 요청 제출
    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.category || approvalLine.length === 0) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...formData,
                amount: formData.amount ? parseFloat(formData.amount) : null,
                requesterId: currentUser?.id,
                requesterName: currentUser?.name,
                requesterDepartment: currentUser?.department,
                approvalLine,
                attachments: [] // 실제 구현에서는 파일 업로드 처리 필요
            };

            const response = await fetch('/api/intranet/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            const result = await response.json();

            if (result.success) {
                alert('결재 요청이 성공적으로 등록되었습니다.');
                router.push('/intranet/approvals');
            } else {
                alert(result.error || '결재 요청 등록에 실패했습니다.');
            }

        } catch (error) {
            console.error('[TRISID] 결재 요청 제출 오류:', error);
            alert('결재 요청 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // [TRISID] 사용 가능한 결재자 목록 (자신 제외, 이미 추가된 사람 제외)
    const availableApprovers = employees.filter(emp =>
        emp.id !== currentUser?.id &&
        !approvalLine.some(step => step.approverId === emp.id)
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* [TRISID] 헤더 */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        돌아가기
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">새 결재 요청</h1>
                        <p className="text-gray-400 mt-1">결재 요청서를 작성하고 승인자를 지정합니다</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* [TRISID] 좌측: 기본 정보 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 기본 정보 */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">기본 정보</CardTitle>
                                <CardDescription>결재 요청의 기본 정보를 입력합니다</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-gray-300">제목 *</Label>
                                    <Input
                                        id="title"
                                        placeholder="결재 요청 제목을 입력하세요"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="category" className="text-gray-300">카테고리 *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                                            <SelectValue placeholder="카테고리를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-600">
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    <div className="flex items-center gap-2">
                                                        {getCategoryIcon(category.id)}
                                                        <span>{category.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="priority" className="text-gray-300">우선순위</Label>
                                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-600">
                                                <SelectItem value="low">낮음</SelectItem>
                                                <SelectItem value="normal">보통</SelectItem>
                                                <SelectItem value="high">높음</SelectItem>
                                                <SelectItem value="urgent">긴급</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="amount" className="text-gray-300">금액 (원)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0"
                                            value={formData.amount}
                                            onChange={(e) => handleInputChange('amount', e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="dueDate" className="text-gray-300">처리 마감일</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-gray-300">상세 내용 *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="결재 요청의 상세 내용을 입력하세요"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="bg-gray-700 border-gray-600 text-white mt-1 min-h-32"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 첨부파일 */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">첨부파일</CardTitle>
                                <CardDescription>관련 문서를 첨부할 수 있습니다</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <Label htmlFor="file-upload">
                                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors">
                                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-400">파일을 선택하거나 여기로 드래그하세요</p>
                                                <p className="text-sm text-gray-500 mt-1">PDF, DOC, XLS, 이미지 파일 지원</p>
                                            </div>
                                        </Label>
                                    </div>

                                    {attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                                    <span className="text-gray-300">{file.name}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeFile(index)}
                                                        className="text-gray-400 hover:text-red-400"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* [TRISID] 우측: 결재라인 */}
                    <div className="space-y-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">결재라인</CardTitle>
                                <CardDescription>승인자를 순서대로 지정합니다</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* 현재 결재라인 */}
                                <div className="space-y-3">
                                    {approvalLine.map((step, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                                                        {index + 1}단계
                                                    </Badge>
                                                    <span className="text-white font-medium">{step.approverName}</span>
                                                </div>
                                                <p className="text-sm text-gray-400">{step.approverDepartment} · {step.approverRole}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeApprover(index)}
                                                className="text-gray-400 hover:text-red-400"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* 결재자 추가 */}
                                <div>
                                    <Label className="text-gray-300 mb-2 block">결재자 추가</Label>
                                    <Select onValueChange={(value) => {
                                        const employee = employees.find(emp => emp.id === value);
                                        if (employee) addApprover(employee);
                                    }}>
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="결재자를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-600">
                                            {availableApprovers.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id}>
                                                    <div>
                                                        <div className="font-medium">{employee.name}</div>
                                                        <div className="text-sm text-gray-400">{employee.department} · {employee.position}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 제출 버튼 */}
                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-4">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            제출 중...
                                        </div>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            결재 요청 제출
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 