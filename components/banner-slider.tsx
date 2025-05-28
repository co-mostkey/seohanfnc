"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const banners = [
  {
    id: 1,
    image: "/banners/banner-1.png",
    title: "소방 설비 신제품 출시",
    link: "/products?category=category1",
  },
  {
    id: 2,
    image: "/banners/banner-2.png",
    title: "안전 장비 특별 프로모션",
    link: "/products?category=category2",
  },
  {
    id: 3,
    image: "/banners/banner-3.png",
    title: "방재 시스템 기술 세미나",
    link: "/events/3",
  },
]

export default function BannerSlider() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="relative aspect-[16/5] w-full overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Link href={banners[currentBanner].link} >
                <div className="relative h-full w-full">
                  <Image
                    src={banners[currentBanner].image || "/placeholder.svg"}
                    alt={banners[currentBanner].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 pb-12">
                    <h3 className="max-w-[60%] truncate text-xl font-bold text-white md:text-2xl lg:text-3xl">
                      {banners[currentBanner].title}
                    </h3>
                    <Link
                      href={banners[currentBanner].link}
                      className="rounded-full border-2 border-white px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-black md:text-base"
                    >
                      자세히 보기
                    </Link>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 w-8 rounded-full transition-all ${index === currentBanner ? "bg-white" : "bg-white/40"
                  }`}
                aria-label={`배너 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

