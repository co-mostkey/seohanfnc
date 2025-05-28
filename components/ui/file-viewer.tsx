"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Printer,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileBox,
  RotateCw
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/app/i18n/client/use-translation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

// 파일 유형 정의
export type FileType = 'pdf' | 'docx' | 'excel' | 'ppt' | 'hwp' | 'image' | 'word';

// 파일 뷰어 속성 정의
interface FileViewerProps {
  url: string;
  title: string;
  fileType: FileType;
  pages?: string[]; // 다중 페이지 문서용
}

/**
 * 통합 파일 뷰어 컴포넌트
 * 다양한 파일 형식(PDF, DOCX, Excel, PPT, HWP, 이미지)에 대한 뷰어를 제공합니다.
 */
export function FileViewer({ url, title, fileType, pages }: FileViewerProps) {
  const { t, locale } = useTranslation();
  const { toast } = useToast();

  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // 기본값
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentSheet, setCurrentSheet] = useState("sheet1");

  // 시트 목록 (Excel용)
  const sheets = ["sheet1", "sheet2", "sheet3"];

  // 이미지 페이지 목록 (Word, DOCX, PPT용)
  const defaultPages = [
    "/documents/docx-document-preview-1.png",
    "/documents/docx-document-preview-2.png",
    "/documents/docx-document-preview-3.png",
  ];

  const pageImages = pages || defaultPages;

  // 페이지 이동 함수
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, fileType === 'docx' || fileType === 'word' || fileType === 'ppt' ? pageImages.length : totalPages));
  };

  // 줌 함수
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  // 회전 함수 (이미지용)
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // 다운로드 함수
  const handleDownload = () => {
    try {
      // 실제 구현에서는 서버에서 파일을 받아오거나 URL에서 직접 다운로드
      const downloadUrl = url || "";
      const fileName = title || `document.${fileType}`;

      // 다운로드 링크 생성
      const link = window.document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      toast({
        title: t('download_started') || '다운로드가 시작되었습니다.',
        description: fileName,
      });
    } catch (error) {
      toast({
        title: t('download_failed') || '다운로드 실패',
        description: t('download_error') || '파일 다운로드 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    }
  };

  // 인쇄 함수
  const handlePrint = () => {
    try {
      window.print();
    } catch (error) {
      toast({
        title: t('print_failed') || '인쇄 실패',
        description: t('print_error') || '인쇄 중 오류가 발생했습니다.',
        variant: "destructive",
      });
    }
  };

  // 파일 타입에 따른 아이콘 선택
  const getFileIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'word':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'ppt':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'hwp':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-pink-500" />;
      default:
        return <FileBox className="h-5 w-5" />;
    }
  };

  // 컨텐츠 렌더링
  const renderContent = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <div className="relative w-full h-full flex justify-center">
            <iframe
              src={`${url}#toolbar=0&page=${currentPage}&zoom=${zoom}`}
              className="w-full h-[600px] border border-gray-200 rounded-md"
              title={title}
            />
          </div>
        );

      case 'image':
        return (
          <div className="relative w-full h-full flex justify-center">
            <div
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
              className="relative flex justify-center items-center"
            >
              <Image
                src={url}
                alt={title}
                width={800}
                height={600}
                className="max-w-full object-contain"
              />
            </div>
          </div>
        );

      case 'excel':
        return (
          <div className="w-full">
            <Tabs value={currentSheet} onValueChange={setCurrentSheet} className="mb-4">
              <TabsList>
                {sheets.map((sheet) => (
                  <TabsTrigger key={sheet} value={sheet}>
                    {sheet}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div
              className="w-full overflow-auto border border-gray-200 rounded-md"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      {['A', 'B', 'C', 'D', 'E'].map((col) => (
                        <td key={`${row}${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentSheet === 'sheet1' ? `데이터 ${row}${col}` : `샘플 ${col}${row}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'docx':
      case 'word':
      case 'ppt':
      case 'hwp':
        return (
          <div className="relative w-full h-full flex justify-center">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transition: 'transform 0.3s ease'
              }}
              className="relative flex justify-center items-center"
            >
              <Image
                src={pageImages[currentPage - 1]}
                alt={`${title} - 페이지 ${currentPage}`}
                width={800}
                height={1000}
                className="max-w-full object-contain border border-gray-200 rounded-md shadow-sm"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-md">
            <p className="text-gray-500">미리보기를 지원하지 않는 파일 형식입니다.</p>
          </div>
        );
    }
  };

  // 툴바 렌더링
  const renderToolbar = () => {
    return (
      <div className="flex items-center justify-between mb-4 bg-gray-100 p-2 rounded-md">
        <div className="flex items-center space-x-2">
          {getFileIcon()}
          <span className="font-medium text-sm text-gray-700">{title}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* 페이지 탐색 (PDF, Word, DOCX, PPT용) */}
          {(fileType === 'pdf' || fileType === 'docx' || fileType === 'word' || fileType === 'ppt') && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600">
                {currentPage} / {fileType === 'docx' || fileType === 'word' || fileType === 'ppt' ? pageImages.length : totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= (fileType === 'docx' || fileType === 'word' || fileType === 'ppt' ? pageImages.length : totalPages)}
                className="h-8 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* 줌 컨트롤 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="h-8 px-2"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm text-gray-600">{zoom}%</span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="h-8 px-2"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* 이미지 회전 컨트롤 */}
          {fileType === 'image' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="h-8 px-2"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}

          {/* 다운로드 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-2"
          >
            <Download className="h-4 w-4" />
          </Button>

          {/* 인쇄 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 px-2"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderToolbar()}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        {renderContent()}
      </div>
    </div>
  );
}
