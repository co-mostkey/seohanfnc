'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/validators/product-validator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from 'lucide-react';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';

export const ProductFormDocuments = () => {
    const { control, register, setValue, watch } = useFormContext<ProductFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "documents"
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>문서 자료</CardTitle>
                    <Button
                        type="button"
                        onClick={() => append({ nameKo: '', path: '', type: 'pdf' })}
                    >
                        문서 추가
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                        <div className="absolute top-2 right-2">
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Label>문서명 (한글)</Label>
                            <Input {...register(`documents.${index}.nameKo`)} />
                        </div>
                        <div>
                            <Label>문서 파일</Label>
                            {watch(`documents.${index}.path`) ? (
                                <div className="flex items-center space-x-2">
                                    <a href={watch(`documents.${index}.path`)} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                        파일 보기
                                    </a>
                                    <Button type="button" variant="destructive" size="sm" onClick={async () => {
                                        const path = watch(`documents.${index}.path`)!;
                                        const res = await fetch(`/api/admin/upload?path=${path}`, { method: 'DELETE' });
                                        if (res.ok) {
                                            setValue(`documents.${index}.path`, '', { shouldValidate: true });
                                            toast.success('문서 파일을 삭제했습니다.');
                                        } else {
                                            toast.error('문서 파일 삭제에 실패했습니다.');
                                        }
                                    }}>
                                        삭제
                                    </Button>
                                </div>
                            ) : (
                                <FileUpload
                                    endpoint="/api/admin/upload"
                                    accept=".pdf,.doc,.docx"
                                    fileType="documents"
                                    idSuffix={`doc-${index}`}
                                    onUploadSuccess={({ url }) => {
                                        setValue(`documents.${index}.path`, url, { shouldValidate: true });
                                        toast.success('문서를 업로드했습니다.');
                                    }}
                                />
                            )}
                        </div>
                        <div>
                            <Label>문서 타입</Label>
                            <Input {...register(`documents.${index}.type`)} defaultValue="pdf" />
                        </div>
                    </div>
                ))}
                {fields.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground">추가된 문서가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}; 