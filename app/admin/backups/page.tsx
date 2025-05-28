"use client";

import React, { useState, useEffect } from "react";
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_CARD_STYLES, ADMIN_UI } from "@/lib/admin-ui-constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Download, Calendar, RefreshCw, Check, Database, HardDrive, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// 백업 정보 타입
interface BackupInfo {
    name: string;
    createdAt: string;
    fileCount: number;
    size?: string;
}

// 스케줄된 백업 정보 타입
interface ScheduledBackupInfo {
    name: string;
    createdAt: string;
    fileCount: number;
}

export default function BackupsManagementPage() {
    const [fileBackups, setFileBackups] = useState<BackupInfo[]>([]);
    const [scheduledBackups, setScheduledBackups] = useState<ScheduledBackupInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

    useEffect(() => {
        loadBackups();
    }, []);

    // 백업 데이터 로드
    const loadBackups = async () => {
        setLoading(true);
        try {
            // 파일 백업 로드
            const fileBackupsRes = await fetch('/api/admin/backups/files');
            if (!fileBackupsRes.ok) throw new Error('파일 백업 목록을 불러오는데 실패했습니다.');
            const fileBackupsData = await fileBackupsRes.json();

            // 스케줄된 백업 로드
            const scheduledBackupsRes = await fetch('/api/admin/backups/scheduled');
            if (!scheduledBackupsRes.ok) throw new Error('스케줄된 백업 목록을 불러오는데 실패했습니다.');
            const scheduledBackupsData = await scheduledBackupsRes.json();

            setFileBackups(fileBackupsData.backups || []);
            setScheduledBackups(scheduledBackupsData.backups || []);
        } catch (error) {
            console.error('백업 목록 로드 중 오류:', error);
            toast.error('백업 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 전체 백업 생성
    const createBackup = async () => {
        setCreating(true);
        try {
            const response = await fetch('/api/admin/backups/files', {
                method: 'POST',
            });

            if (!response.ok) throw new Error('백업 생성에 실패했습니다.');

            const data = await response.json();
            toast.success('백업이 성공적으로 생성되었습니다.');
            loadBackups(); // 목록 새로고침
        } catch (error) {
            console.error('백업 생성 중 오류:', error);
            toast.error('백업 생성에 실패했습니다.');
        } finally {
            setCreating(false);
        }
    };

    // 백업에서 복원
    const restoreFromBackup = async () => {
        if (!selectedBackup) return;

        setRestoring(true);
        try {
            const response = await fetch(`/api/admin/backups/restore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    backupName: selectedBackup,
                }),
            });

            if (!response.ok) throw new Error('백업 복원에 실패했습니다.');

            const data = await response.json();
            toast.success('백업으로부터 복원이 완료되었습니다.');
            setRestoreDialogOpen(false);
        } catch (error) {
            console.error('백업 복원 중 오류:', error);
            toast.error('백업 복원에 실패했습니다.');
        } finally {
            setRestoring(false);
        }
    };

    // 복원 대화상자 열기
    const openRestoreDialog = (backupName: string) => {
        setSelectedBackup(backupName);
        setRestoreDialogOpen(true);
    };

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>백업 관리</h1>
                    <p className="text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                        데이터 백업 관리 및 복원을 위한 페이지입니다.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        onClick={loadBackups}
                        variant="outline"
                        className={`bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700`}
                        style={ADMIN_FONT_STYLES.BUTTON}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        새로고침
                    </Button>
                    <Button
                        onClick={createBackup}
                        disabled={creating}
                        className={ADMIN_UI.BUTTON_PRIMARY}
                        style={ADMIN_FONT_STYLES.BUTTON}
                    >
                        <Database className="h-4 w-4 mr-2" />
                        {creating ? '백업 생성 중...' : '새 백업 생성'}
                    </Button>
                </div>
            </div>

            {/* 전체 백업 섹션 */}
            <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                <CardHeader>
                    <CardTitle style={ADMIN_FONT_STYLES.SECTION_TITLE}>전체 백업</CardTitle>
                    <CardDescription className="text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                        모든 데이터 파일의 전체 백업 목록입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {scheduledBackups.length === 0 ? (
                        <div className="text-center py-8 text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            <Database className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                            <p>생성된 전체 백업이 없습니다.</p>
                            <p className="text-sm mt-1">위의 '새 백업 생성' 버튼을 클릭하여 백업을 만들 수 있습니다.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className={ADMIN_UI.BORDER_LIGHT}>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>백업명</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>생성일시</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>파일 수</TableHead>
                                    <TableHead className="text-right" style={ADMIN_FONT_STYLES.TABLE_HEADER}>관리</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scheduledBackups.map((backup) => (
                                    <TableRow key={backup.name} className={`${ADMIN_UI.BORDER_LIGHT} hover:${ADMIN_UI.BG_HOVER}`}>
                                        <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                            <div className="flex items-center">
                                                <HardDrive className="h-4 w-4 mr-2 text-gray-400" />
                                                {backup.name}
                                            </div>
                                        </TableCell>
                                        <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(backup.createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>{backup.fileCount}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                onClick={() => openRestoreDialog(backup.name)}
                                                variant="outline"
                                                size="sm"
                                                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                복원
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* 개별 파일 백업 섹션 */}
            <Card className={ADMIN_CARD_STYLES.DEFAULT}>
                <CardHeader>
                    <CardTitle style={ADMIN_FONT_STYLES.SECTION_TITLE}>파일별 백업</CardTitle>
                    <CardDescription className="text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                        개별 파일의 자동 백업 목록입니다. 파일이 수정될 때마다 자동으로 생성됩니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {fileBackups.length === 0 ? (
                        <div className="text-center py-8 text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            <Database className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                            <p>생성된 파일 백업이 없습니다.</p>
                            <p className="text-sm mt-1">파일을 수정하면 자동으로 백업이 생성됩니다.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className={ADMIN_UI.BORDER_LIGHT}>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>파일명</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>마지막 백업</TableHead>
                                    <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>크기</TableHead>
                                    <TableHead className="text-right" style={ADMIN_FONT_STYLES.TABLE_HEADER}>관리</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fileBackups.map((backup) => (
                                    <TableRow key={backup.name} className={`${ADMIN_UI.BORDER_LIGHT} hover:${ADMIN_UI.BG_HOVER}`}>
                                        <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                            <div className="flex items-center">
                                                <Database className="h-4 w-4 mr-2 text-gray-400" />
                                                {backup.name}
                                            </div>
                                        </TableCell>
                                        <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                {formatDate(backup.createdAt)}
                                            </div>
                                        </TableCell>
                                        <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>{backup.size || '알 수 없음'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                onClick={() => openRestoreDialog(backup.name)}
                                                variant="outline"
                                                size="sm"
                                                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                복원
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* 백업 복원 대화상자 */}
            <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                <DialogContent className={`${ADMIN_CARD_STYLES.DEFAULT} max-w-md`}>
                    <DialogHeader>
                        <DialogTitle style={ADMIN_FONT_STYLES.SECTION_TITLE}>백업에서 복원</DialogTitle>
                        <DialogDescription className="text-gray-400" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                            백업에서 데이터를 복원하시겠습니까? 현재 데이터가 백업 데이터로 대체됩니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-orange-900/20 border border-orange-800/30 p-4 rounded-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-1">
                                    <Calendar className="h-5 w-5 text-orange-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-orange-300" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        주의
                                    </h3>
                                    <div className="mt-1 text-sm text-orange-200" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                        <p>이 작업은 현재 데이터를 백업 시점의 데이터로 되돌립니다. 복원 후에는 취소할 수 없습니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="backupName" className="text-gray-300" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                복원할 백업
                            </Label>
                            <div className="mt-1 text-gray-200 font-medium" style={ADMIN_FONT_STYLES.BODY_TEXT}>
                                {selectedBackup}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRestoreDialogOpen(false)}
                            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                            disabled={restoring}
                        >
                            취소
                        </Button>
                        <Button
                            onClick={restoreFromBackup}
                            disabled={restoring}
                            className="bg-orange-700 hover:bg-orange-600 text-white"
                        >
                            {restoring ? '복원 중...' : '백업에서 복원'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 