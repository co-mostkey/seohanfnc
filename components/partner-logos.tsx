import { getAssetPath } from '@/lib/utils';

import Image from "next/image"

export default function PartnerLogos() {
  return (
    <div className="mx-auto max-w-5xl">
      <h3 className="mb-12 text-center font-serif text-2xl font-light text-gray-700">파트너사</h3>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
        {/* 서한에프앤씨의 파트너사 로고로 교체 */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            <Image
              src={getAssetPath('/placeholder.svg?height=60&width=120')}
              alt={`파트너사 로고 ${index + 1}`}
              width={120}
              height={60}
              className="grayscale transition-all duration-300 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

