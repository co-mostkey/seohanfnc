"use client"

import React from 'react'
import HeroCube from './HeroCube'
import NoticeBox from './NoticeBox'
import CertPatentBox from './CertPatentBox'
import DeliveryBox from './DeliveryBox'

export default function KeyFeatureBox() {
  const faces = [
    <NoticeBox key="notice" />,
    <CertPatentBox key="cert" />,
    <DeliveryBox key="deliver" />
  ]

  return (
    <div className="flex flex-col items-center justify-center bg-white/10 p-4 rounded-lg h-full w-full">
      <h3 className="text-xl font-semibold text-white mb-4">핵심 기능 강조</h3>
      <div className="w-full flex justify-center">
        <HeroCube faces={faces} width="40vw" height="40vw" />
      </div>
    </div>
  )
} 