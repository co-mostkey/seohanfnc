"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, Printer } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface ExcelViewerProps {
  url: string;
  title: string;
}

export function ExcelViewer({ url, title }: ExcelViewerProps) {
  const { toast } = useToast();
  const [zoom, setZoom] = useState(100);
  const [currentSheet, setCurrentSheet] = useState("sheet1");

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  // 시트 탭 리스트
  const handleDownload = () => {
    try {
      // 실제 운영 환경에서는 백엔드(또는 파일 시스템)에서 Excel 파일을 읽어와
      // 다운로드 링크를 생성해야 합니다.
      // 이 예제에서는 임의의 Blob 데이터를 만들어 다운로드 과정을 시뮬레이션합니다.

      // 예시용 Excel 바이너리(빈 파일) — 실제 구현 시 서버에서 받아온 데이터로 대체하세요.
      const excelContent =
        "PK\u0003\u0004\u0014\u0000\u0008\u0008\u0008\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000";

      // Blob 데이터 생성
      const blob = new Blob([excelContent], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 파일 이름 생성 (URL에서 파일 이름 추출)
      const fileName = url.split("/").pop() || "spreadsheet.xlsx";

      // 다운로드 링크 생성
      const downloadUrl = URL.createObjectURL(blob);
      const a = window.window.document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      window.window.document.body.appendChild(a);
      a.click();

      // 다운로드 링크 제거
      window.window.document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // 다운로드 완료
      toast({
        title: "다운로드 완료",
        description: `${title} 파일이 다운로드되었습니다.`,
      });
    } catch (error) {
      console.error("Excel download error:", error);

      // 다운로드 오류
      toast({
        title: "다운로드 오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 실제 구현에서는 SheetJS 등 라이브러리를 사용하여 Excel 내용을 렌더링할 수 있습니다.
  // 현재 컴포넌트는 UI 레이아웃을 보여주기 위한 목업입니다.

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/30 p-3 rounded-t-lg">
        <div className="flex gap-2">
          <Tabs value={currentSheet} onValueChange={setCurrentSheet}>
            <TabsList>
              <TabsTrigger value="sheet1">
                시트 1
              </TabsTrigger>
              <TabsTrigger value="sheet2">
                시트 2
              </TabsTrigger>
              <TabsTrigger value="sheet3">
                시트 3
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
          className="bg-white border-green-200 border-2 shadow-lg"
          style={{
            width: `${zoom * 8}px`,
            height: `${zoom * 5}px`,
            transformOrigin: "center",
          }}
        >
          <div className="flex flex-col justify-center items-center h-full p-4">
            <div className="text-center w-full">
              <div className="font-bold mb-4 text-green-600">{title}</div>
              <div className="text-sm text-muted-foreground mb-4">
                {currentSheet}
              </div>

              <div className="grid grid-cols-5 gap-1 border text-xs">
                <div className="bg-green-100 p-1 border-r font-medium"></div>
                <div className="bg-green-100 p-1 border-r font-medium">A</div>
                <div className="bg-green-100 p-1 border-r font-medium">B</div>
                <div className="bg-green-100 p-1 border-r font-medium">C</div>
                <div className="bg-green-100 p-1 font-medium">D</div>

                <div className="bg-green-100 p-1 border-t border-r font-medium">
                  1
                </div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t"></div>

                <div className="bg-green-100 p-1 border-t border-r font-medium">
                  2
                </div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t"></div>

                <div className="bg-green-100 p-1 border-t border-r font-medium">
                  3
                </div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t border-r"></div>
                <div className="p-1 border-t"></div>
              </div>

              <div className="text-xs text-muted-foreground mt-4">
                실제 환경에서는 SheetJS를 이용해 렌더링됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
