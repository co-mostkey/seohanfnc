"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    FileText, Plus, Edit, Trash2, Save, RefreshCw,
    AlertTriangle, CheckCircle, Eye, Calendar, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_CARD_STYLES, ADMIN_UI } from '@/lib/admin-ui-constants';

interface Term {
    id: string;
    title: string;
    content: string;
    version: string;
    effectiveDate: string;
    lastUpdated: string;
    isRequired: boolean;
    isActive: boolean;
}

export default function TermsManagementPage() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [editTerm, setEditTerm] = useState<Partial<Term>>({});
    const [previewTerm, setPreviewTerm] = useState<Term | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 약관 목록 로드
    const loadTerms = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/terms');
            const data = await response.json();

            if (data.success) {
                setTerms(data.terms);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('약관 로드 오류:', error);
            toast.error('약관 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTerms();
    }, []);

    // 새 약관 추가
    const openNewTerm = () => {
        setEditTerm({
            id: '',
            title: '',
            content: '',
            isRequired: false,
            isActive: true
        });
        setModalOpen(true);
    };

    // 약관 수정
    const openEditTerm = (term: Term) => {
        setEditTerm({ ...term });
        setModalOpen(true);
    };

    // 약관 미리보기
    const openPreview = (term: Term) => {
        setPreviewTerm(term);
        setPreviewModalOpen(true);
    };

    // 약관 저장
    const saveTerm = async () => {
        if (!editTerm.id || !editTerm.title || !editTerm.content) {
            toast.error('ID, 제목, 내용을 모두 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            const method = terms.find(t => t.id === editTerm.id) ? 'PUT' : 'POST';
            const response = await fetch('/api/admin/terms', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editTerm,
                    updateVersion: method === 'PUT'
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setModalOpen(false);
                loadTerms();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('약관 저장 오류:', error);
            toast.error('약관 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    // 약관 삭제
    const deleteTerm = async (id: string) => {
        if (!confirm('이 약관을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/admin/terms?id=${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                loadTerms();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('약관 삭제 오류:', error);
            toast.error('약관 삭제에 실패했습니다.');
        }
    };

    // 약관 상태 토글
    const toggleTermStatus = async (term: Term) => {
        try {
            const response = await fetch('/api/admin/terms', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: term.id,
                    isActive: !term.isActive
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(`약관이 ${!term.isActive ? '활성화' : '비활성화'}되었습니다.`);
                loadTerms();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('약관 상태 변경 오류:', error);
            toast.error('약관 상태 변경에 실패했습니다.');
        }
    };

    const getStatusBadge = (term: Term) => {
        if (!term.isActive) {
            return <Badge variant="secondary">비활성</Badge>;
        }
        return term.isRequired ?
            <Badge className="bg-red-100 text-red-800">필수</Badge> :
            <Badge className="bg-blue-100 text-blue-800">선택</Badge>;
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span>약관 목록을 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>
                        <FileText className="h-8 w-8 mr-3" />
                        약관 관리
                    </h1>
                    <p className="text-gray-600 mt-1">
                        개인정보 처리방침, 이용약관, 마케팅 수신동의 등을 관리합니다.
                    </p>
                </div>
                <Button onClick={openNewTerm} className={`${ADMIN_UI.BUTTON_PRIMARY} flex items-center`}>
                    <Plus className="h-4 w-4 mr-2" />
                    새 약관 추가
                </Button>
            </div>

            {/* 약관 목록 */}
            <div className="grid grid-cols-1 gap-6">
                {terms.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    등록된 약관이 없습니다
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    새 약관을 추가하여 시작하세요.
                                </p>
                                <Button onClick={openNewTerm}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    첫 번째 약관 추가
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    terms.map((term) => (
                        <Card key={term.id} className={ADMIN_CARD_STYLES.DEFAULT}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <CardTitle className="text-lg">{term.title}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {getStatusBadge(term)}
                                                <Badge variant="outline">v{term.version}</Badge>
                                                <span className="text-sm text-gray-500">
                                                    ID: {term.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openPreview(term)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            미리보기
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openEditTerm(term)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            수정
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toggleTermStatus(term)}
                                            className={term.isActive ? 'text-orange-600' : 'text-green-600'}
                                        >
                                            {term.isActive ? '비활성화' : '활성화'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteTerm(term.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">시행일:</span>
                                        <div className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                            {new Date(term.effectiveDate).toLocaleDateString('ko-KR')}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">최종 수정:</span>
                                        <div className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                            {new Date(term.lastUpdated).toLocaleDateString('ko-KR')}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">내용 길이:</span>
                                        <div className="mt-1">
                                            {term.content.length.toLocaleString()} 자
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* 약관 편집 모달 */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editTerm.id && terms.find(t => t.id === editTerm.id) ? '약관 수정' : '새 약관 추가'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="termId">약관 ID *</Label>
                                <Input
                                    id="termId"
                                    value={editTerm.id || ''}
                                    onChange={(e) => setEditTerm({ ...editTerm, id: e.target.value })}
                                    placeholder="예: privacy, service, marketing"
                                    disabled={editTerm.id && terms.find(t => t.id === editTerm.id)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="termTitle">제목 *</Label>
                                <Input
                                    id="termTitle"
                                    value={editTerm.title || ''}
                                    onChange={(e) => setEditTerm({ ...editTerm, title: e.target.value })}
                                    placeholder="약관 제목을 입력하세요"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="termContent">내용 * (Markdown 지원)</Label>
                            <Textarea
                                id="termContent"
                                value={editTerm.content || ''}
                                onChange={(e) => setEditTerm({ ...editTerm, content: e.target.value })}
                                placeholder="약관 내용을 입력하세요. Markdown 문법을 사용할 수 있습니다."
                                rows={15}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editTerm.isRequired || false}
                                    onCheckedChange={(checked) => setEditTerm({ ...editTerm, isRequired: checked })}
                                />
                                <Label>필수 동의 약관</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={editTerm.isActive !== false}
                                    onCheckedChange={(checked) => setEditTerm({ ...editTerm, isActive: checked })}
                                />
                                <Label>활성화</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            취소
                        </Button>
                        <Button onClick={saveTerm} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    저장
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 약관 미리보기 모달 */}
            <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <Eye className="h-5 w-5 mr-2" />
                            {previewTerm?.title} 미리보기
                        </DialogTitle>
                    </DialogHeader>
                    {previewTerm && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                {getStatusBadge(previewTerm)}
                                <Badge variant="outline">v{previewTerm.version}</Badge>
                                <span className="text-sm text-gray-500">
                                    시행일: {new Date(previewTerm.effectiveDate).toLocaleDateString('ko-KR')}
                                </span>
                            </div>
                            <div className="prose max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                    {previewTerm.content}
                                </pre>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>
                            닫기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 