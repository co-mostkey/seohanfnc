"use client"

import React, { useEffect, useState, useRef } from "react"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"
// GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 임포트 제거
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb'
import { PageHeading } from '@/components/ui/PageHeading'
import { MapPin, Phone, Printer, Mail } from 'lucide-react'
import { cn, getImagePath } from '@/lib/utils';
import { Button } from "@/components/ui/button"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Define Kakao map types
declare global {
  interface Window {
    kakao: any // Use 'any' for simplicity or install @types/kakao.maps.d.ts
  }
}

// Location data
const locationData = [
  {
    id: 'headquarters',
    name: '본사/공장',
    address: '충북 충주시 산척면 샛강영길 59',
    zipCode: '27411',
    contact: [
      { type: 'TEL', value: '043-851-2709', icon: Phone },
      { type: 'FAX', value: '043-851-8502', icon: Printer }
    ],
    mapPosition: { lat: 36.899712, lng: 127.852345 },
    directions: {
      car: '중부내륙고속도로 충주IC에서 약 20분 소요',
      publicTransport: '충주시외버스터미널에서 택시 이용 (약 25분 소요)'
    }
  },
  {
    id: 'seoul',
    name: '서울사무실',
    address: '서울시 성동구 성수이로 147 IS BIZ 타워 409호',
    zipCode: '04794',
    contact: [
      { type: 'TEL', value: '02-3462-2709', icon: Phone },
      { type: 'FAX', value: '02-3462-8502', icon: Printer },
      { type: 'E-mail', value: 'shfnc@hanmail.net', icon: Mail }
    ],
    mapPosition: { lat: 37.544789, lng: 127.056175 },
    directions: {
      subway: '2호선 성수역 2번 출구에서 도보 약 10분',
      bus: '성수역 인근 버스 정류장 하차 후 도보 약 5분'
    }
  }
]

// Get Kakao App Key from environment variable
const KAKAO_MAP_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

export default function LocationPage() {
  const [activeLocationId, setActiveLocationId] = useState<string>(locationData[0].id)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null) // To hold the map instance

  const activeLocation = locationData.find(loc => loc.id === activeLocationId) || locationData[0]

  // Initialize or update map when script is loaded and location changes
  useEffect(() => {
    if (!isScriptLoaded || !window.kakao || !mapContainerRef.current) return

    const { lat, lng } = activeLocation.mapPosition
    const mapOption = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 4, // Adjust zoom level if needed
    }

    // Create map instance if it doesn't exist, otherwise set center
    if (!mapInstanceRef.current) {
      if (mapContainerRef.current.innerHTML === '' || !mapContainerRef.current.querySelector('*:not(style)')) {
        console.log("Initializing Kakao Map...")
        mapInstanceRef.current = new window.kakao.maps.Map(mapContainerRef.current, mapOption)
      } else {
        console.log("Map container not empty, delaying init...")
        // Optionally, try again after a short delay or handle differently
        return // Prevent re-initialization on non-empty container
      }
    } else {
      mapInstanceRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng))
    }

    // Ensure map instance exists before adding marker/infowindow
    if (!mapInstanceRef.current) return

    // Add Marker
    const marker = new window.kakao.maps.Marker({
      position: mapOption.center,
    })
    marker.setMap(mapInstanceRef.current)

    // Add InfoWindow
    const iwContent = `<div style="padding:5px; font-size:12px; text-align: center;">${activeLocation.name}<br><a href="https://map.kakao.com/link/map/${activeLocation.name},${lat},${lng}" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/${activeLocation.name},${lat},${lng}" style="color:blue" target="_blank">길찾기</a></div>`
    const infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      position: mapOption.center // Set position for infowindow
    })
    infowindow.open(mapInstanceRef.current, marker)

  }, [isScriptLoaded, activeLocationId, activeLocation])

  const handleScriptLoad = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        console.log("Kakao Maps SDK loaded.")
        setIsScriptLoaded(true)
      })
    } else {
      console.error("Kakao Maps SDK script loaded but window.kakao.maps is not available.")
    }
  }

  // Log if app key is missing
  useEffect(() => {
    if (!KAKAO_MAP_APP_KEY) {
      console.warn("Kakao Map App Key (NEXT_PUBLIC_KAKAO_MAP_APP_KEY) is not set in environment variables.")
    }
  }, [])

  const breadcrumbItems = [
    { text: '홈', href: `${basePath}/` },
    { text: '회사소개', href: `${basePath}/about` },
    { text: '오시는 길', href: `${basePath}/about/location`, active: true }
  ]

  return (
    <>
      {/* Kakao Map Script */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY || 'YOUR_APP_KEY'}&autoload=false`}
        strategy="afterInteractive" // Load after page becomes interactive
        onLoad={handleScriptLoad}
        onError={(e) => console.error("Kakao Maps script failed to load:", e)}
      />

      {/* Main Layout */}
      <main className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
          <Image
            src={getImagePath('/images/patterns/grid-pattern.svg')}
            alt="Background Pattern"
            fill
            className="object-cover w-full h-full"
          />
        </div>

        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          {/* GlobalNav는 client-layout.tsx에서 전역적으로 제공되므로 중복 사용 제거 */}
        </header>

        {/* Main Content Area */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="w-full">
            {/* Breadcrumb & Page Heading */}
            <div className="mb-6">
              <SimpleBreadcrumb items={breadcrumbItems} />
            </div>
            <div className="mb-12 md:mb-16">
              <PageHeading
                title="오시는 길"
                subtitle="서한에프앤씨 본사 및 서울사무소 위치 안내"
              />
            </div>

            {/* Location Tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {locationData.map(location => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocationId(location.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out border",
                    activeLocationId === location.id
                      ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  {location.name}
                </button>
              ))}
            </div>

            {/* Location Info & Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {/* Left Column: Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* Address & Contact Card */}
                <div className={cn(
                  "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                  "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                )}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary dark:text-primary-400" />
                    주소 및 연락처
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">{activeLocation.address}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">(우편번호: {activeLocation.zipCode})</p>
                  <ul className="space-y-1.5">
                    {activeLocation.contact.map((contact, index) => {
                      const Icon = contact.icon // Get icon component
                      return (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Icon className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          <span className="font-medium w-12">{contact.type}:</span>
                          {contact.type === 'E-mail' ? (
                            <a href={`mailto:${contact.value}`} className="hover:text-primary dark:hover:text-primary-400 underline">{contact.value}</a>
                          ) : (
                            <span>{contact.value}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    asChild
                  >
                    <Link href={`https://map.kakao.com/link/to/${activeLocation.name},${activeLocation.mapPosition.lat},${activeLocation.mapPosition.lng}`} target="_blank" rel="noopener noreferrer">
                      카카오맵 길찾기
                    </Link>
                  </Button>
                </div>

                {/* Directions Card */}
                <div className={cn(
                  "rounded-lg p-6 border border-gray-200 dark:border-gray-700/50",
                  "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
                )}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">교통 안내</h3>
                  <div className="space-y-3 text-sm">
                    {activeLocation.directions.car &&
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-0.5">자가용 이용시</h4>
                        <p className="text-gray-600 dark:text-gray-400">{activeLocation.directions.car}</p>
                      </div>
                    }
                    {activeLocation.directions.publicTransport &&
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-0.5">대중교통 이용시</h4>
                        <p className="text-gray-600 dark:text-gray-400">{activeLocation.directions.publicTransport}</p>
                      </div>
                    }
                    {activeLocation.directions.subway &&
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-0.5">지하철 이용시</h4>
                        <p className="text-gray-600 dark:text-gray-400">{activeLocation.directions.subway}</p>
                      </div>
                    }
                    {activeLocation.directions.bus &&
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-0.5">버스 이용시</h4>
                        <p className="text-gray-600 dark:text-gray-400">{activeLocation.directions.bus}</p>
                      </div>
                    }
                  </div>
                </div>
              </div>

              {/* Right Column: Map */}
              <div className="lg:col-span-8">
                <div className={cn(
                  "rounded-lg p-2 border border-gray-200 dark:border-gray-700/50",
                  "bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm",
                  "h-[400px] md:h-[500px] lg:h-full min-h-[300px]" // Ensure minimum height
                )}>
                  <div
                    ref={mapContainerRef}
                    className="w-full h-full rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800"
                  >
                    {/* Loading/Error State */}
                    {!isScriptLoaded && (
                      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        {KAKAO_MAP_APP_KEY ? '지도 로딩 중...' : '카카오맵 API 키가 필요합니다.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 