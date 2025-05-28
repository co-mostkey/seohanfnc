"use client";

import React, { useEffect, useState } from 'react';
import { ADMIN_HEADING_STYLES, ADMIN_FONT_STYLES, ADMIN_UI, ADMIN_CARD_STYLES, ADMIN_BUTTON_SIZES } from '@/lib/admin-ui-constants';
import { SiteMenuItem } from '@/types/menu';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Save, Trash2, RotateCcw, Edit, Eye, ChevronRight, ChevronDown, Move } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminMenusPage() {
    const [menus, setMenus] = useState<SiteMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState<Partial<SiteMenuItem>>({ label: '', path: '', order: 0, parentId: null, external: false });
    const [saving, setSaving] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<SiteMenuItem | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [draggedItem, setDraggedItem] = useState<SiteMenuItem | null>(null);
    const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await fetch('/api/admin/menus');
                const json = await res.json();
                setMenus(json);
            } catch (e) {
                console.error(e);
                toast.error('메뉴를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    const handleAdd = () => {
        if (!newItem.label || !newItem.path) {
            toast.error('레이블과 경로를 입력하세요.');
            return;
        }
        const id = newItem.id || `menu_${Date.now()}`;
        setMenus(prev => [...prev, {
            id,
            label: newItem.label!,
            path: newItem.path!,
            order: Number(newItem.order) || 0,
            parentId: newItem.parentId || null,
            external: newItem.external || false,
            content: newItem.content || ''
        }]);
        setNewItem({ label: '', path: '', order: 0, parentId: null, external: false });
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // 저장: 기존 파일을 통째로 교체
            await fetch('/api/admin/menus', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menus }),
            });
            toast.success('메뉴가 저장되었습니다.');
        } catch (e) {
            console.error(e);
            toast.error('저장 실패');
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = (id: string) => {
        // 해당 메뉴와 그 하위 메뉴들을 모두 삭제
        setMenus(prev => {
            // 먼저 이 메뉴를 부모로 가진 모든 하위 메뉴의 parentId를 null로 설정
            const updated = prev.map(item =>
                item.parentId === id ? { ...item, parentId: null } : item
            );
            // 그 다음 선택된 메뉴 삭제
            return updated.filter(m => m.id !== id);
        });
    };

    const resetChanges = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/menus');
            const json = await res.json();
            setMenus(json);
            toast.success('변경 사항을 초기화했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (item: SiteMenuItem) => {
        setEditItem(item);
        setEditOpen(true);
    };

    const saveEditItem = () => {
        if (!editItem) return;
        setMenus(prev => prev.map(m => (m.id === editItem.id ? editItem : m)));
        setEditOpen(false);
    };

    // 부모 메뉴 선택/해제 처리
    const handleParentChange = (value: string) => {
        setNewItem(prev => ({
            ...prev,
            parentId: value === "none" ? null : value
        }));
    };

    // 편집 시 부모 메뉴 선택/해제 처리
    const handleEditParentChange = (value: string) => {
        if (!editItem) return;
        setEditItem({
            ...editItem,
            parentId: value === "none" ? null : value
        });
    };

    // 드래그 앤 드롭 처리
    const handleDragStart = (e: React.DragEvent, item: SiteMenuItem) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        setDragOverItemId(id);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverItemId(null);
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedItem) return;
        
        // 자기 자신에게 드롭하는 경우 무시
        if (draggedItem.id === targetId) return;
        
        // 드래그한 항목이 대상 항목의 상위 메뉴인지 확인 (순환 참조 방지)
        const isTargetChildOfDragged = (targetId: string, draggedId: string): boolean => {
            const target = menus.find(m => m.id === targetId);
            if (!target) return false;
            if (target.parentId === draggedId) return true;
            if (target.parentId) return isTargetChildOfDragged(target.parentId, draggedId);
            return false;
        };
        
        if (isTargetChildOfDragged(targetId, draggedItem.id)) {
            toast.error('상위 메뉴를 하위 메뉴로 이동할 수 없습니다.');
            return;
        }
        
        setMenus(prev => {
            const target = prev.find(m => m.id === targetId);
            if (!target) return prev;
            
            // 타겟과 드래그 항목의 정렬 순서 조정
            return prev.map(item => {
                if (item.id === draggedItem.id) {
                    // 드래그한 항목을 타겟 항목과 같은 부모 아래로 이동
                    return { 
                        ...item, 
                        parentId: target.parentId,
                        order: target.order + 0.5 // 일단 타겟 다음에 배치
                    };
                }
                return item;
            });
        });
        
        // 순서 번호 정리 (1부터 순차적으로)
        normalizeMenuOrder();
    };
    
    // 메뉴 순서 정규화 - 부모 메뉴별로 1부터 순차적으로 재배치
    const normalizeMenuOrder = () => {
        setMenus(prev => {
            // 부모 ID별로 그룹화
            const groupedByParent: Record<string, SiteMenuItem[]> = {};
            
            // null 부모(최상위 메뉴)용 특수 키
            const NULL_PARENT = 'TOP_LEVEL';
            
            prev.forEach(item => {
                const parentKey = item.parentId || NULL_PARENT;
                if (!groupedByParent[parentKey]) {
                    groupedByParent[parentKey] = [];
                }
                groupedByParent[parentKey].push(item);
            });
            
            // 각 그룹 내에서 현재 순서대로 정렬하고 순서 번호 재할당
            const normalized: SiteMenuItem[] = [];
            
            Object.keys(groupedByParent).forEach(parentKey => {
                const items = groupedByParent[parentKey];
                // 현재 order 값으로 정렬
                items.sort((a, b) => a.order - b.order);
                // 순서 재할당
                items.forEach((item, index) => {
                    normalized.push({
                        ...item,
                        order: index + 1
                    });
                });
            });
            
            return normalized;
        });
    };

    // 계층 구조로 메뉴 표시하기 (최상위 메뉴만 가져옴)
    const topLevelMenus = menus.filter(m => !m.parentId).sort((a, b) => a.order - b.order);

    // 하위 메뉴 가져오기
    const getChildMenus = (parentId: string) => {
        return menus.filter(m => m.parentId === parentId).sort((a, b) => a.order - b.order);
    };

    // 메뉴 항목 렌더링 (재귀적)
    const renderMenuItem = (menu: SiteMenuItem, depth = 0) => {
        const children = getChildMenus(menu.id);
        const isDragOver = dragOverItemId === menu.id;

        return (
            <React.Fragment key={menu.id}>
                <TableRow 
                    className={`${ADMIN_UI.BORDER_LIGHT} hover:${ADMIN_UI.BG_HOVER} ${isDragOver ? 'bg-orange-900/20' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, menu)}
                    onDragOver={(e) => handleDragOver(e, menu.id)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, menu.id)}
                >
                    <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>
                        <div className="flex items-center" style={{ paddingLeft: `${depth * 16}px` }}>
                            <Move className="h-4 w-4 mr-2 cursor-move text-gray-500" />
                            {children.length > 0 && (
                                <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                            )}
                            {menu.label} {menu.external && <span className="ml-1 text-xs opacity-60">(외부)</span>}
                        </div>
                    </TableCell>
                    <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>{menu.path}</TableCell>
                    <TableCell style={ADMIN_FONT_STYLES.BODY_TEXT}>{menu.order}</TableCell>
                    <TableCell className="text-right">
                        <Button size="icon" variant="ghost" className={`hover:${ADMIN_UI.BG_ACCENT}`} onClick={() => openEdit(menu)}><Edit className={`h-4 w-4 ${ADMIN_UI.TEXT_MUTED}`} /></Button>
                        <Button size="icon" variant="ghost" className={`text-red-500 hover:text-red-400 hover:bg-red-900/50`} onClick={() => deleteItem(menu.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                </TableRow>
                {children.map(child => renderMenuItem(child, depth + 1))}
            </React.Fragment>
        );
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className={ADMIN_HEADING_STYLES.PAGE_TITLE} style={ADMIN_FONT_STYLES.PAGE_TITLE}>메뉴 관리</h1>
                <div className="space-x-2">
                    <Button onClick={() => setPreviewOpen(true)} variant="outline" className={`${ADMIN_UI.BUTTON_OUTLINE}`} style={ADMIN_FONT_STYLES.BUTTON}><Eye className="h-4 w-4 mr-1" /> 미리보기</Button>
                    <Button onClick={resetChanges} variant="outline" className={`${ADMIN_UI.BUTTON_OUTLINE}`} style={ADMIN_FONT_STYLES.BUTTON}><RotateCcw className="h-4 w-4 mr-1" /> 되돌리기</Button>
                    <Button onClick={handleSaveAll} disabled={saving} className={`${ADMIN_UI.BUTTON_PRIMARY}`} style={ADMIN_FONT_STYLES.BUTTON}><Save className="h-4 w-4 mr-1" />{saving ? '저장 중' : '저장'}</Button>
                </div>
            </div>

            {/* 추가 폼 */}
            <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-4 space-y-3`}>
                <Tabs defaultValue="basic">
                    <TabsList className="mb-3">
                        <TabsTrigger value="basic">기본 정보</TabsTrigger>
                        <TabsTrigger value="advanced">고급 설정</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input placeholder="레이블" value={newItem.label || ''} onChange={e => setNewItem(prev => ({ ...prev, label: e.target.value }))} className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} />
                    <Input placeholder="경로 (/about)" value={newItem.path || ''} onChange={e => setNewItem(prev => ({ ...prev, path: e.target.value }))} className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} />
                    <Input placeholder="순서" type="number" value={newItem.order?.toString() || '0'} onChange={e => setNewItem(prev => ({ ...prev, order: Number(e.target.value) }))} className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} />
                    <Button onClick={handleAdd} className={`${ADMIN_UI.BUTTON_SECONDARY} w-full md:w-auto`} style={ADMIN_FONT_STYLES.BUTTON}><Plus className="h-4 w-4 mr-1" /> 추가</Button>
                </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block mb-1 text-sm">상위 메뉴</label>
                                <Select
                                    value={newItem.parentId || "none"}
                                    onValueChange={handleParentChange}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="상위 메뉴 없음" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">상위 메뉴 없음</SelectItem>
                                        {menus.map(menu => (
                                            <SelectItem key={menu.id} value={menu.id}>{menu.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2 mt-7">
                                <Checkbox
                                    id="external"
                                    checked={newItem.external || false}
                                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, external: !!checked }))}
                                />
                                <label htmlFor="external" className="text-sm">외부 링크</label>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">설명(옵션)</label>
                            <Input
                                placeholder="간단한 설명"
                                value={newItem.content || ''}
                                onChange={e => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                                className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* 메뉴 설명 */}
            <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-md text-sm">
                <p>
                    <span className="font-semibold text-orange-500">드래그 앤 드롭</span>으로 메뉴 순서를 변경할 수 있습니다. 
                    메뉴를 다른 메뉴 위에 드롭하면 같은 레벨로 이동합니다.
                </p>
            </div>

            {/* 목록 */}
            <div className={`${ADMIN_CARD_STYLES.DEFAULT} p-4`}>
                <Table>
                    <TableHeader>
                        <TableRow className={ADMIN_UI.BORDER_LIGHT}>
                            <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>레이블</TableHead>
                            <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>경로</TableHead>
                            <TableHead style={ADMIN_FONT_STYLES.TABLE_HEADER}>순서</TableHead>
                            <TableHead className="text-right" style={ADMIN_FONT_STYLES.TABLE_HEADER}>관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topLevelMenus.map(menu => renderMenuItem(menu))}
                    </TableBody>
                </Table>
            </div>

            {/* 편집 다이얼로그 */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className={`${ADMIN_CARD_STYLES.DEFAULT} max-w-md w-full`}>
                    <DialogHeader>
                        <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>메뉴 항목 편집</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                        <div className="space-y-3">
                            <div>
                                <label className="block mb-1 text-sm">레이블</label>
                                <Input className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} value={editItem.label} onChange={e => setEditItem({ ...editItem, label: e.target.value })} />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">경로</label>
                                <Input className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} value={editItem.path} onChange={e => setEditItem({ ...editItem, path: e.target.value })} />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">순서</label>
                                <Input type="number" className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} value={editItem.order} onChange={e => setEditItem({ ...editItem, order: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">상위 메뉴</label>
                                <Select
                                    value={editItem.parentId || "none"}
                                    onValueChange={handleEditParentChange}
                                >
                                    <SelectTrigger className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`}>
                                        <SelectValue placeholder="상위 메뉴 없음" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">상위 메뉴 없음</SelectItem>
                                        {menus.filter(m => m.id !== editItem.id).map(menu => (
                                            <SelectItem key={menu.id} value={menu.id}>{menu.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-external"
                                    checked={editItem.external || false}
                                    onCheckedChange={(checked) => setEditItem({ ...editItem, external: !!checked })}
                                />
                                <label htmlFor="edit-external" className="text-sm">외부 링크</label>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">설명(옵션)</label>
                                <Input className={`${ADMIN_UI.BG_INPUT} ${ADMIN_UI.BORDER_MEDIUM}`} value={editItem.content || ''} onChange={e => setEditItem({ ...editItem, content: e.target.value })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button onClick={saveEditItem} className={`${ADMIN_UI.BUTTON_PRIMARY}`} style={ADMIN_FONT_STYLES.BUTTON}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 미리보기 다이얼로그 */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className={`${ADMIN_CARD_STYLES.DEFAULT} max-w-xl w-full`}>
                    <DialogHeader>
                        <DialogTitle className={`${ADMIN_UI.TEXT_PRIMARY}`} style={ADMIN_FONT_STYLES.SECTION_TITLE}>메뉴 미리보기</DialogTitle>
                    </DialogHeader>
                    <div className="border rounded-md p-4 mt-2">
                        <nav className="flex flex-col space-y-1">
                            {topLevelMenus.map(menu => {
                                const children = getChildMenus(menu.id);
                                return (
                                    <div key={menu.id} className="text-sm">
                                        <div className="flex items-center py-1.5 px-2 rounded hover:bg-gray-100/10">
                                            {children.length > 0 && <ChevronDown className="h-4 w-4 mr-1 opacity-70" />}
                                            <span className="font-medium">{menu.label}</span>
                                            {menu.external && <span className="ml-1 text-xs opacity-60">(외부)</span>}
                                        </div>
                                        {children.length > 0 && (
                                            <div className="ml-5 pl-2 border-l border-gray-700/30 space-y-1">
                                                {children.map(child => (
                                                    <div key={child.id} className="py-1 hover:text-orange-400">
                                                        {child.label}
                                                        {child.external && <span className="ml-1 text-xs opacity-60">(외부)</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 