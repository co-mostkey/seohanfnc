"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
  }>
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3]">
        <Image
          src={images[selectedImage].src || "/placeholder.svg"}
          alt={images[selectedImage].alt}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${
              index === selectedImage ? "border-blue-600" : "border-transparent"
            }`}
          >
            <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

