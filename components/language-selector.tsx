"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LanguageSelector() {
  const [language, setLanguage] = useState("ko")

  // For now, just logging the language change without actually changing it
  // since we're not using i18n per the instructions
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    console.log(`Language changed to: ${lang}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">언어 선택</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("ko")}
          className={language === "ko" ? "bg-muted" : ""}
        >
          한국어
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-muted" : ""}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 