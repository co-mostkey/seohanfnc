"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageViewerProps {
  url: string;
  title: string;
}

export function ImageViewer({ url, title }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 p-3 rounded-t-lg">
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
          <Button variant="ghost" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="flex-1 bg-slate-100 dark:bg-slate-800 flex justify-center items-center p-4 overflow-auto"
        style={{ minHeight: "500px" }}
      >
        {url ? (
          <div
            className="relative flex justify-center items-center"
            style={{
              transformOrigin: "center",
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            <img
              src={url}
              alt={title}
              className="max-w-full max-h-full shadow-lg"
              style={{ maxHeight: "70vh" }}
            />
          </div>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-lg bg-white dark:bg-slate-900">
            <div className="text-muted-foreground">
              이미지 불러오는 중...
            </div>
            <div className="text-sm mt-2 text-muted-foreground">
              이미지를 불러올 수 없으면, 다운로드 버튼을 클릭하세요.
            </div>
          </div>
        )}
      </div>

      <div className="p-2 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-800 text-center">
        확대/축소: 버튼 또는 마우스 휠 / 회전: 버튼 클릭
      </div>
    </div>
  );
}
