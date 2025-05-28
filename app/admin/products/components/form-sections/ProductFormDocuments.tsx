'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch, FieldArrayWithId } from 'react-hook-form';
import { ProductFormData, DocumentFormData } from '@/lib/validators/product-validator'; // Assuming DocumentFormData is part of this or defined separately
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from '@/components/admin/FileUpload';
import { FilePlus, Trash2, FileScan } from 'lucide-react';
import { toast } from 'sonner';
import { Document as ProductDocument, Product } from '@/types/product'; // Assuming Document is the type for initialData and appendDocument

interface ProductFormDocumentsProps {
    control: Control<ProductFormData>;
    register: UseFormRegister<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    watch: UseFormWatch<ProductFormData>;
    setValue: UseFormSetValue<ProductFormData>;
    handleFileDelete: (
        filePathToDelete: string,
        fieldName: keyof ProductFormData,
        listIndex?: number,
        subFieldName?: 'src' | 'path'
    ) => Promise<void>;
    documentFields: FieldArrayWithId<ProductFormData, "documents", "id">[];
    appendDocument: (value: DocumentFormData, options?: { shouldFocus?: boolean }) => void;
    removeDocument: (index?: number | number[] | undefined) => void;
    initialData?: Product | null; // For productId for FileUpload path
}

export const ProductFormDocuments: React.FC<ProductFormDocumentsProps> = ({
    control, // control is passed but not directly used in this JSX, useFieldArray uses it parent-side
    register,
    errors,
    watch,
    setValue,
    handleFileDelete,
    documentFields,
    appendDocument,
    removeDocument,
    initialData
}) => {
    const productIdForPaths = initialData?.id || 'temp-product-id';

    return (
        <Card className="mb-6 shadow-sm">
            <CardHeader className="bg-gray-900 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <CardTitle>문서/자료</CardTitle>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => appendDocument({
                            id: crypto.randomUUID(),
                            name: '',
                            path: '',
                            type: 'pdf'
                        })}
                    >
                        <FilePlus className="h-4 w-4 mr-2" /> 새 문서 추가
                    </Button>
                </div>
                <CardDescription>제품 관련 문서(PDF, DOC 등)를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                {documentFields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-700 rounded-md bg-gray-800 space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-base">문서 #{index + 1}</Label>
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeDocument(index)}
                                className="text-red-500 hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Input {...register(`documents.${index}.name`)} placeholder="문서 표시 이름" className="bg-gray-900 border-gray-700 text-gray-100" />
                        {errors.documents?.[index]?.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.documents[index]?.name?.message}</p>
                        )}
                        <div>
                            <Label htmlFor={`doc_type_${index}`}>문서 타입</Label>
                            <select
                                {...register(`documents.${index}.type`)}
                                className="w-full p-2 mt-1 rounded-md bg-gray-900 border border-gray-700 text-gray-100 focus:border-orange-500 outline-none"
                            >
                                <option value="pdf">PDF</option>
                                <option value="manual">사용자 매뉴얼</option>
                                <option value="certification">제품 인증서</option>
                                <option value="guide">유지보수 안내서</option>
                                <option value="datasheet">기술 사양서</option>
                                <option value="docx">DOCX</option>
                                <option value="xlsx">XLSX</option>
                                <option value="pptx">PPTX</option>
                                <option value="zip">ZIP</option>
                                <option value="hwp">HWP</option>
                                <option value="txt">TXT</option>
                                <option value="etc">기타</option>
                            </select>
                        </div>
                        <div>
                            <Label>문서 파일</Label>
                            {watch(`documents.${index}.path`) && (
                                <div className="mt-1 space-y-2 p-2 border rounded-md bg-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <FileScan className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                        <a
                                            href={watch(`documents.${index}.path`)!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-600 hover:underline truncate"
                                            title={watch(`documents.${index}.path`)!}
                                        >
                                            다운로드: {watch(`documents.${index}.path`)!.split('/').pop()}
                                        </a>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="xs"
                                            onClick={() => {
                                                const newPath = prompt("새로운 파일 경로를 입력하세요:", watch(`documents.${index}.path`) || '');
                                                if (newPath !== null) {
                                                    setValue(`documents.${index}.path`, newPath);
                                                }
                                            }}
                                        >
                                            경로 수정
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="xs"
                                            onClick={() => handleFileDelete(watch(`documents.${index}.path`)!, 'documents', index, 'path')}
                                        >
                                            서버 파일 삭제
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="mt-2">
                                <FileUpload
                                    endpoint="/api/admin/upload"
                                    onUploadSuccess={(file) => {
                                        setValue(`documents.${index}.path`, file.url, { shouldValidate: true });
                                        setValue(`documents.${index}.name`, file.originalName || file.filename || '업로드된 파일', { shouldValidate: true });
                                    }}
                                    onUploadError={(err) => toast.error(`문서 업로드 실패: ${err}`)}
                                    productId={productIdForPaths}
                                    fileType={initialData?.id ? `products/${initialData.id}/documents` : 'temp/documents'}
                                    accept=".pdf,.doc,.docx,.hwp,.txt,.xlsx,.pptx,.zip"
                                    maxFiles={1}
                                    idSuffix={`documents-${index}`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {watch(`documents.${index}.path`)
                                    ? '다른 파일을 업로드하여 교체할 수 있습니다.'
                                    : '새 파일을 업로드하거나 위 필드에 직접 경로를 입력하세요.'}
                            </p>
                        </div>
                    </div>
                ))}
                {documentFields.length === 0 && (
                    <p className="text-sm text-gray-500 p-4 text-center bg-gray-800 rounded-md">추가된 문서가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}; 