"use client";

import React, { useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react';
import { UploadCloud, X, File as FileIcon, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; // next/image 추가

interface FileUploadProps {
    endpoint: string; // API 엔드포인트 (필수)
    onUploadSuccess: (uploadedFile: { url: string; filename: string; originalName?: string }) => void; // originalName을 옵셔널로 변경
    onUploadError?: (error: string) => void;
    fileType?: string;  // 'images', 'videos', 'documents', 'common' 등
    accept?: string; // 예: "image/*", ".pdf,.doc,.docx"
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMb?: number; // MB 단위
    buttonText?: string; // 업로드 버튼 텍스트 prop 추가
    currentImageUrl?: string; // 현재 이미지 URL (표시 및 교체 로직용)
    idSuffix?: string; // id 중복 방지를 위한 suffix
    productId?: string; // 제품 ID (옵셔널)
}

export const FileUpload: React.FC<FileUploadProps> = ({
    endpoint, // prop으로 받음
    onUploadSuccess,
    onUploadError,
    fileType = 'general',
    accept = "*/*",
    multiple = false,
    maxFiles = 1,
    maxSizeMb = 5, // 기본 5MB
    buttonText = "파일 업로드", // 기본 버튼 텍스트
    currentImageUrl, // prop 사용
    idSuffix = '', // idSuffix 기본값 추가
    productId, // 제품 ID 추가
}) => {
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [internalCurrentImageUrl, setInternalCurrentImageUrl] = useState(currentImageUrl);

    useEffect(() => {
        setInternalCurrentImageUrl(currentImageUrl);
    }, [currentImageUrl]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFiles(Array.from(event.target.files));
        }
        event.target.value = ''; // 동일 파일 재선택 가능하도록 초기화
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (event.dataTransfer.files) {
            addFiles(Array.from(event.dataTransfer.files));
        }
    };

    const addFiles = (newFiles: File[]) => {
        setUploadError(null);
        const validFiles = newFiles.filter(file => {
            if (file.size > maxSizeMb * 1024 * 1024) {
                setUploadError(`${file.name} 파일 크기가 너무 큽니다 (최대 ${maxSizeMb}MB).`);
                return false;
            }
            // TODO: 파일 타입(accept) 검증 로직 추가 (이미 브라우저 input accept에서 1차 처리됨)
            return true;
        });

        if (multiple) {
            setFilesToUpload(prev => {
                const updated = [...prev, ...validFiles];
                return maxFiles ? updated.slice(0, maxFiles) : updated;
            });
        } else {
            setFilesToUpload(validFiles.length > 0 ? [validFiles[0]] : []);
        }
    };

    const removeFile = (index: number) => {
        setFilesToUpload(prev => prev.filter((_, i) => i !== index));
        setUploadError(null); // 파일 제거 시 에러 메시지 초기화
    };

    const handleUpload = async () => {
        if (filesToUpload.length === 0) {
            // 엔드포인트 검사는 불필요해 보임. endpoint는 필수 prop이므로.
            // setUploadError("업로드 엔드포인트가 지정되지 않았습니다.");
            return;
        }
        setIsUploading(true);
        setUploadError(null);

        for (const file of filesToUpload) {
            const formData = new FormData();
            formData.append('file', file);
            if (fileType && fileType.trim() !== '') {
                formData.append('subDir', fileType.trim());
            }

            try {
                const response = await fetch(`/api/admin/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();

                if (response.ok && result.url) { // API 응답에 따라 result.url 확인
                    onUploadSuccess({ url: result.url, filename: result.fileName || file.name, originalName: file.name });
                    setInternalCurrentImageUrl(result.url);
                } else {
                    const errorMsg = result.error || result.message || '파일 업로드 실패';
                    setUploadError(errorMsg);
                    if (onUploadError) onUploadError(errorMsg);
                    break;
                }
            } catch (err: any) {
                const errorMsg = err.message || '알 수 없는 업로드 오류';
                setUploadError(errorMsg);
                if (onUploadError) onUploadError(errorMsg);
                console.error("Upload error:", err);
                break;
            }
        }
        setIsUploading(false);
        if (!uploadError) {
            setFilesToUpload([]);
        }
    };

    const uniqueId = `file-upload-${endpoint}-${fileType}${idSuffix ? '-' + idSuffix : ''}`;

    return (
        <div className="space-y-3">
            <div
                className={`p-4 border-2 border-dashed rounded-md transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'}
                    ${uploadError ? 'border-red-500' : ''}
                `}
                onDragEnter={() => setIsDragging(true)}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id={uniqueId} // 수정된 id 사용
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="sr-only"
                />
                <label
                    htmlFor={uniqueId} // 수정된 id 사용
                    className="flex flex-col items-center justify-center text-center cursor-pointer"
                >
                    <UploadCloud className={`w-10 h-10 mb-2 ${isDragging ? 'text-blue-400' : 'text-gray-500'}`} />
                    <p className="text-sm text-gray-400">
                        여기에 파일을 드래그하거나 클릭하여 선택하세요.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        (최대 {maxFiles}개, 파일당 최대 {maxSizeMb}MB)
                        {accept !== "*/*" && ` (${accept} 타입만 가능)`}
                    </p>
                </label>
            </div>

            {uploadError && (
                <div className="p-2 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {uploadError}
                </div>
            )}

            {filesToUpload.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">업로드할 파일:</p>
                    {filesToUpload.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md text-sm">
                            <div className="flex items-center truncate">
                                {file.type.startsWith('image/') ? (
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 object-cover rounded-sm mr-2 flex-shrink-0"
                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                    />
                                ) : (
                                    <FileIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                                )}
                                <span className="text-gray-200 truncate" title={file.name}>{file.name}</span>
                                <span className="text-gray-400 ml-2 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-400 h-6 w-6">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={isUploading || filesToUpload.length === 0} // 엔드포인트 검사 제거
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 flex items-center justify-center"
                    >
                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isUploading ? '업로드 중...' : (filesToUpload.length > 0 ? `${buttonText} (${filesToUpload.length}개)` : buttonText)}
                    </Button>
                </div>
            )}

            {internalCurrentImageUrl && filesToUpload.length === 0 && !isUploading && (
                <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-400">현재 파일:</p>
                    <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md text-sm">
                        <div className="flex items-center truncate">
                            <ImageIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                            <a
                                href={internalCurrentImageUrl.startsWith('http') ? internalCurrentImageUrl : `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${internalCurrentImageUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline truncate"
                                title={internalCurrentImageUrl}
                            >
                                {internalCurrentImageUrl.split('/').pop()}
                            </a>
                        </div>
                        {/* 기존 이미지 삭제 버튼은 onUploadSuccess에서 url: '' 등으로 처리하는 것으로 대체 가능 */}
                    </div>
                </div>
            )}
        </div>
    );
};