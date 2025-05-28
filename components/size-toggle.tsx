"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MonitorIcon, MoveIcon } from "lucide-react"

// 콘텐츠 크기 선택 옵션
const sizeOptions = [
  { id: "large", label: "크게보기", value: "100%" },
  { id: "medium", label: "보통", value: "75%" }
]

export function SizeToggle() {
  // 현재 선택된 사이즈 상태
  const [selectedSize, setSelectedSize] = useState("large")

  // 페이지 로드 시 localStorage에서 저장된 사이즈 설정 불러오기
  useEffect(() => {
    const savedSize = localStorage.getItem("contentSize")
    if (savedSize) {
      setSelectedSize(savedSize)
      applyContentSize(savedSize)
    }
  }, [])

  // 콘텐츠 사이즈 적용 함수
  const applyContentSize = (sizeId: string) => {
    const rootElement = document.documentElement
    const option = sizeOptions.find(opt => opt.id === sizeId)
    // Remove previous scale classes and attributes
    rootElement.classList.remove("scaled-content", "scale-content")
    rootElement.removeAttribute("data-scale")
    if (option) {
      // Update CSS variable for scale
      rootElement.style.setProperty("--content-scale", option.id === "large" ? "1" : "0.75")
      // Add classes for scaling and section adjustments
      rootElement.classList.add("scaled-content", "scale-content")
      // Set data-scale for height and background-size adjustments
      rootElement.setAttribute("data-scale", option.id === "large" ? "100" : "75")
      localStorage.setItem("contentSize", sizeId)
    }
  }

  // 사이즈 변경 핸들러
  const handleSizeChange = (sizeId: string) => {
    setSelectedSize(sizeId)
    applyContentSize(sizeId)
  }

  // 현재 선택된 사이즈 옵션 찾기
  const currentOption = sizeOptions.find(opt => opt.id === selectedSize) || sizeOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <MoveIcon className="h-3.5 w-3.5" />
          <span>{currentOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {sizeOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            className="flex items-center gap-2 text-xs"
            onClick={() => handleSizeChange(option.id)}
          >
            <MonitorIcon className="h-3.5 w-3.5" />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 