"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Printer,
  Copy,
} from "lucide-react";

interface HWPViewerProps {
  _url?: string;
  title: string;
  pages?: string[];
}

export function HWPViewer({ _url, title, pages }: HWPViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지 이미지 리스트
  const defaultPages = [
    "/documents/hwp-document-preview-1.png",
    "/documents/hwp-document-preview-2.png",
    "/documents/hwp-document-preview-3.png",
  ];

  const pageImages = pages || defaultPages;
  const totalPages = pageImages.length;
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-t-lg">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center text-sm">
            페이지 {currentPage} / {totalPages}
          </div>
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
          <button
            className="text-sm px-2 flex items-center gap-1"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <span>-</span>
          </button>
          <div className="flex items-center text-sm">{zoom}%</div>
          <button
            className="text-sm px-2 flex items-center gap-1"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <span>+</span>
          </button>
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 flex justify-center items-center p-4 overflow-auto border">
        <div
          className="bg-white shadow-lg"
          style={{
            width: `${zoom * 5.5}px`,
            height: `${zoom * 8}px`,
            transformOrigin: "center",
            transition: "all 0.2s ease",
          }}
        >
          {currentPage > 0 && currentPage <= pageImages.length ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <h2 className="text-xl font-bold mb-4">HWP 미리보기</h2>
                  <p className="mb-2">페이지 {currentPage} / {totalPages}</p>
                  <div className="text-xs text-muted-foreground mt-4">
                    확대/축소: 버튼 또는 마우스 휠 / 인쇄: 버튼 클릭
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">
                페이지를 표시할 수 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 p-2 border-t">
        <div className="flex justify-center space-x-2 overflow-x-auto px-2">
          {pageImages.map((page, index) => (
            <button
              key={index}
              className={`relative w-12 h-16 border-2 transition-all ${currentPage === index + 1
                ? "border-blue-500"
                : "border-transparent"
                }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-white text-xs">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
