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
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PDFViewerProps {
  url: string;
  title: string;
}

export function PDFViewer({ url, title }: PDFViewerProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // 기본 총 페이지 수 - 향후 실제 페이지 수로 대체 가능
  const [zoom, setZoom] = useState(100);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  // PDF 파일 다운로드 (샘플)
  const handleDownload = () => {
    try {
      // 실제 구현 시 서버에서 받아온 PDF 바이너리 데이터를 Blob으로 만들어 다운로드합니다.
      const pdfContent = `%PDF-1.5\n%âãÏÓ\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n3 0 obj\n<</Type/Page/Contents 4 0 R/Parent 2 0 R/Resources<<>>>>\nendobj\n4 0 obj\n<</Length 15>>\nstream\nBT /F1 12 Tf (${title}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000015 00000 n\n0000000060 00000 n\n0000000111 00000 n\n0000000170 00000 n\ntrailer\n<</Size 5/Root 1 0 R>>\nstartxref\n234\n%%EOF`;

      // Blob 데이터 생성
      const blob = new Blob([pdfContent], { type: "application/pdf" });

      // 파일 이름 추출 (URL 기준)
      const fileName = url.split("/").pop() || "document.pdf";

      // 다운로드 링크 생성 및 실행
      const downloadUrl = URL.createObjectURL(blob);

      // 다운로드 링크 제거
      const a = window.window.document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      window.window.document.body.appendChild(a);
      a.click();

      // 다운로드 링크 제거
      window.window.document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // 다운로드 완료 알림
      toast({
        title: "Download Complete",
        description: `${title} has been downloaded.`,
      });
    } catch (error) {
      console.error("PDF download error:", error);

      // 다운로드 오류 알림
      toast({
        title: "Download Error",
        description: "An error occurred while downloading the file.",
        variant: "destructive",
      });
    }
  };

  // 페이지 텍스트 생성 함수
  const getPageText = () => `Page ${currentPage} / ${totalPages}`;

  // UI 렌더링
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-3 rounded-t-lg">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center text-sm">{getPageText()}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm font-medium truncate max-w-sm">{title}</div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="flex items-center text-sm">{zoom}%</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 bg-white dark:bg-slate-900 flex justify-center items-center p-4 overflow-auto border"
        style={{ minHeight: "500px" }}
      >
        <div
          className="bg-white shadow-lg"
          style={{
            width: `${zoom * 6}px`,
            height: `${zoom * 8}px`,
            transformOrigin: "center",
          }}
        >
          <div className="flex flex-col justify-center items-center h-full border p-4">
            <div className="text-center">
              <div className="font-bold mb-4">PDF 미리보기</div>
              <div className="text-sm text-muted-foreground mb-8">
                {getPageText()}
              </div>
              <div className="border-b border-dashed mb-4 w-36 mx-auto"></div>
              <div className="text-sm">
                PDF Content Preview
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                확대/축소: 버튼 또는 마우스 휠 / 인쇄: 버튼 클릭
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
