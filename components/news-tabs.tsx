"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bell, Newspaper, Calendar } from "lucide-react"

// 공지사항 데이터
const notices = [
  {
    id: 1,
    title: "서한에프앤씨 홈페이지가 새롭게 오픈했습니다",
    date: "2023-12-15",
    category: "일반",
  },
  {
    id: 2,
    title: "2024년 소방 설비 신제품 출시 안내",
    date: "2023-12-10",
    category: "제품",
  },
  {
    id: 3,
    title: "연말 휴무 안내 (12/30~1/2)",
    date: "2023-12-05",
    category: "일반",
  },
  {
    id: 4,
    title: "ISO 9001 품질경영시스템 인증 갱신",
    date: "2023-11-28",
    category: "인증",
  },
  {
    id: 5,
    title: "소방 설비 유지보수 가이드 배포 안내",
    date: "2023-11-20",
    category: "기술",
  },
]

// 뉴스 데이터
const news = [
  {
    id: 1,
    title: "서한에프앤씨, 2023 소방산업대상 수상",
    date: "2023-12-12",
    source: "소방뉴스",
  },
  {
    id: 2,
    title: "서한에프앤씨, 해외 시장 진출 확대 계획 발표",
    date: "2023-12-05",
    source: "경제신문",
  },
  {
    id: 3,
    title: "소방 설비 시장, 2024년 성장세 전망",
    date: "2023-11-30",
    source: "산업일보",
  },
  {
    id: 4,
    title: "서한에프앤씨, 신기술 개발로 특허 취득",
    date: "2023-11-22",
    source: "기술저널",
  },
  {
    id: 5,
    title: "소방 안전 중요성 강조한 세미나 개최",
    date: "2023-11-15",
    source: "안전신문",
  },
]

// 일정 데이터
const events = [
  {
    id: 1,
    title: "2024 소방 안전 박람회 참가",
    date: "2024-03-15",
    location: "서울 코엑스",
  },
  {
    id: 2,
    title: "신제품 발표회",
    date: "2024-02-20",
    location: "서한에프앤씨 본사",
  },
  {
    id: 3,
    title: "소방 설비 기술 세미나",
    date: "2024-01-25",
    location: "서울 JW 메리어트",
  },
  {
    id: 4,
    title: "협력사 간담회",
    date: "2024-01-15",
    location: "서한에프앤씨 본사",
  },
  {
    id: 5,
    title: "2024년 시무식",
    date: "2024-01-02",
    location: "서한에프앤씨 본사",
  },
]

export default function NewsTabs() {
  const [activeTab, setActiveTab] = useState("notice")

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="notice" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">소식 및 정보</h2>
            <TabsList className="grid w-auto grid-cols-3">
              <TabsTrigger value="notice" className="flex items-center gap-1">
                <Bell className="h-4 w-4" /> 공지사항
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-1">
                <Newspaper className="h-4 w-4" /> 뉴스
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> 일정
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notice" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <ul className="divide-y">
                  {notices.map((notice) => (
                    <li key={notice.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="mr-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            {notice.category}
                          </span>
                          <Link
                            href={`/support/notice/${notice.id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {notice.title}
                          </Link>
                        </div>
                        <span className="text-sm text-gray-500">{notice.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href="/support/notice"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      더 보기 <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <ul className="divide-y">
                  {news.map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="mr-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            {item.source}
                          </span>
                          <Link
                            href={`/news/${item.id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {item.title}
                          </Link>
                        </div>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href="/news"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      더 보기 <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <ul className="divide-y">
                  {events.map((event) => (
                    <li key={event.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="mr-2 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                            {event.location}
                          </span>
                          <Link
                            href={`/events/${event.id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {event.title}
                          </Link>
                        </div>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href="/events"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      더 보기 <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

