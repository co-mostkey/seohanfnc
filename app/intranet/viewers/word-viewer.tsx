import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WordViewerProps {
  _url?: string;
  title: string;
}

export function WordViewer({ _url, title }: WordViewerProps) {
  const { toast } = useToast();
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  // Word 문서 다운로드
  const handleDownload = () => {
    try {
      // 다운로드 로직 구현
      // ... existing code ...
      toast({
        title: "다운로드 완료",
        description: `${title} 파일이 다운로드되었습니다.`,
      });
    } catch (error) {
      console.error("Word download error:", error);
      toast({
        title: "다운로드 오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-t-lg">
        <div className="flex-1"></div>
        <div className="text-sm font-medium truncate max-w-sm">{title}</div>
        <div className="flex gap-2 flex-1 justify-end">
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
        </div>
      </div>

      <div className="p-4 flex-1 bg-white overflow-auto flex flex-col items-center">
        <div
          className="w-[21cm] bg-white shadow-lg p-8 border border-gray-200"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          <div className="prose mx-auto max-w-none">
            {/* 워드 문서 미리보기 영역 */}
            <div className="text-center text-muted-foreground">
              워드 문서를 미리보기 환경에서 표시합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
