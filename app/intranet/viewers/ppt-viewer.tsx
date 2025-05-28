"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PPTViewerProps {
  url: string
  title: string
  slides?: string[]
}

export function PPTViewer({ url, title, slides }: PPTViewerProps) {
  const { toast } = useToast()
  const [currentSlide, setCurrentSlide] = useState(1)
  const totalSlides = 5 // 총 슬라이드 수 (추후 실제 슬라이드 수로 대체)
  const [zoom, setZoom] = useState(100)

  // 슬라이드 이미지 리스트
  const defaultSlides = [
    "/documents/training-materials-preview-1.png",
    "/documents/training-materials-preview-2.png",
    "/documents/training-materials-preview-3.png",
  ]

  const slideImages = slides || defaultSlides

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  // PPT 파일 다운로드
  const handleDownload = () => {
    try {
      // 실제 구현 시 서버에서 받아온 PPTX 파일을 Blob으로 만들어 다운로드합니다.

      // 실제 구현 시 PPTX 파일을 읽어와 다운로드 링크를 생성합니다.
      // 이 예제에서는 임의의 Blob 데이터를 만들어 다운로드 과정을 시뮬레이션합니다.

      const pptContent = 'PK\u0003\u0004\u0014\u0000\u0008\u0008\u0008\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000';

      // Blob 데이터 생성
      const blob = new Blob([pptContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });

      // 파일 이름 추출 (URL 기준)
      const fileName = url.split("/").pop() || "presentation.pptx";

      // 다운로드 링크 생성 및 실행
      const downloadUrl = URL.createObjectURL(blob);
      const a = window.window.document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      window.window.document.body.appendChild(a);
      a.click();

      // 다운로드 링크 제거
      window.window.document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // 다운로드 완료 알림
      toast({
        title: '다운로드 완료',
        description: `${title} 파일이 다운로드되었습니다.`,
      });
    } catch (error) {
      console.error('PPT download error:', error);

      // 오류 알림
      toast({
        title: '다운로드 오류',
        description: '파일 다운로드 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 슬라이드 텍스트 생성 함수
  const getSlideText = () => `슬라이드 ${currentSlide} / ${totalSlides}`

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-3 rounded-t-lg">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevSlide} disabled={currentSlide === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center text-sm">
            {getSlideText()}
          </div>
          <Button variant="ghost" size="sm" onClick={handleNextSlide} disabled={currentSlide === totalSlides}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm font-medium truncate max-w-sm">
          {title}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="flex items-center text-sm">
            {zoom}%
          </div>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="flex h-full bg-slate-900 flex-col"
        style={{ minHeight: "500px" }}
      >
        <div className="flex-1 p-4 flex justify-center items-center">
          <div className="relative aspect-video overflow-hidden w-full max-w-4xl border shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center p-8">
                <h2 className="text-xl font-bold mb-4">PPT 미리보기</h2>
                <p className="mb-2">슬라이드 {currentSlide} / {totalSlides}</p>
                <p className="text-muted-foreground text-sm">
                  {getSlideText()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-3">
          <div className="flex justify-center space-x-2 overflow-x-auto p-2">
            {slideImages.map((slide, index) => (
              <button
                key={index}
                className={`relative w-24 h-16 border-2 transition-all ${currentSlide === index + 1
                  ? 'border-orange-500'
                  : 'border-transparent'
                  }`}
                onClick={() => setCurrentSlide(index + 1)}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="text-xs">슬라이드 {index + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-2 text-xs text-muted-foreground bg-slate-50 dark:bg-slate-800 text-center">
        확대/축소: 버튼 또는 마우스 휠 / 회전: 버튼 클릭
      </div>
    </div>
  )
} 
