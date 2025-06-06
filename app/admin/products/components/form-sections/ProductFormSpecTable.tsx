'use client';

import React, { useMemo } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, PlusCircle, Settings, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';

export const ProductFormSpecTable = () => {
    const { control, register, watch, setValue } = useFormContext<ProductFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "specTable",
    });

    const specTableData = watch('specTable');
    const firstColumnTitle = watch('specTableOptions.firstColumnTitle');

    const columns = useMemo(() => {
        if (!specTableData || specTableData.length === 0) return [{ key: 'title', label: firstColumnTitle || '구분' }];
        const firstRow = specTableData[0] || {};
        return Object.keys(firstRow).map(key => ({
            key: key,
            label: key === 'title' ? (firstColumnTitle || '구분') : `모델: ${key}`
        }));
    }, [specTableData, firstColumnTitle]);

    const handleAddRow = () => {
        const newRow: { [key: string]: string } = {};
        columns.forEach(col => {
            newRow[col.key] = '';
        });
        append(newRow);
    };

    const handleColumnChange = (oldKey: string, newKey: string) => {
        if (oldKey === newKey || newKey === 'title' || !newKey.trim()) return;
        const updatedTable = specTableData.map(row => {
            const newRow = { ...row };
            if (newRow.hasOwnProperty(oldKey)) {
                newRow[newKey] = newRow[oldKey];
                delete newRow[oldKey];
            }
            return newRow;
        });
        setValue('specTable', updatedTable, { shouldDirty: true, shouldValidate: true });
    };

    const handleAddColumn = () => {
        const newColumnKey = `모델_${Date.now()}`;
        const updatedTable = specTableData.map(row => ({
            ...row,
            [newColumnKey]: ''
        }));
        setValue('specTable', updatedTable, { shouldDirty: true, shouldValidate: true });
    };

    const handleRemoveColumn = (keyToRemove: string) => {
        if (keyToRemove === 'title') return;
        const updatedTable = specTableData.map(row => {
            const newRow = { ...row };
            delete newRow[keyToRemove];
            return newRow;
        });
        setValue('specTable', updatedTable, { shouldDirty: true, shouldValidate: true });
    };

    if (!specTableData) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5" />규격별 상세사양 표</CardTitle>
                <CardDescription>제품의 상세 사양을 테이블 형태로 관리합니다. 모델(컬럼)과 사양(행)을 동적으로 추가/수정할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-md">
                    <div>
                        <Label htmlFor="specTableOptions.title">테이블 제목</Label>
                        <Input
                            id="specTableOptions.title"
                            {...register('specTableOptions.title')}
                            placeholder="예: 제품 규격별 상세 정보"
                        />
                    </div>
                    <div>
                        <Label htmlFor="specTableOptions.firstColumnTitle">첫 번째 열(Y축) 제목</Label>
                        <Input
                            id="specTableOptions.firstColumnTitle"
                            {...register('specTableOptions.firstColumnTitle')}
                            placeholder="예: 구분"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableHead key={col.key}>
                                        {col.key === 'title' ? (
                                            <span>{col.label}</span>
                                        ) : (
                                            <div className="flex items-center gap-1 min-w-[150px]">
                                                <Input
                                                    defaultValue={col.key}
                                                    onBlur={(e) => handleColumnChange(col.key, e.target.value)}
                                                    placeholder={`모델명 #${index}`}
                                                    className="text-sm h-9"
                                                />
                                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => handleRemoveColumn(col.key)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, rowIndex) => (
                                <TableRow key={field.id}>
                                    {columns.map((col) => (
                                        <TableCell key={`${field.id}-${col.key}`}>
                                            <Input
                                                {...register(`specTable.${rowIndex}.${col.key}` as const)}
                                                className="min-w-[120px]"
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell className="px-2">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(rowIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={handleAddRow}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 행 추가
                    </Button>
                    <Button type="button" variant="outline" onClick={handleAddColumn}>
                        <PlusCircle className="mr-2 h-4 w-4" /> 열(모델) 추가
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}; 