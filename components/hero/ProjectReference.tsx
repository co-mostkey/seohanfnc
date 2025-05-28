"use client"

import React from 'react'

export interface ProjectReferenceProps {
  company: string
  project: string
  date: string
  isApartment?: boolean
}

export default function ProjectReference({ company, project, date, isApartment = false }: ProjectReferenceProps) {
  let accentColor = "from-blue-400 to-indigo-600"
  if (company.includes("대우")) {
    accentColor = "from-red-400 to-red-600"
  } else if (company.includes("현대")) {
    accentColor = "from-blue-400 to-blue-600"
  } else if (company.includes("지에스") || company.includes("GS")) {
    accentColor = "from-yellow-400 to-yellow-600"
  } else if (company.includes("삼성")) {
    accentColor = "from-blue-500 to-blue-700"
  } else if (company.includes("에스케이") || company.includes("SK")) {
    accentColor = "from-orange-400 to-red-500"
  } else if (company.includes("포스코")) {
    accentColor = "from-blue-600 to-blue-800"
  } else if (company.includes("롯데")) {
    accentColor = "from-red-500 to-red-700"
  }

  return (
    <div className="flex items-center py-2 px-3 bg-white/5 hover:bg-white/10 rounded-md border border-white/20 transition-colors">
      <p className="text-sm text-white truncate">
        {company}: {project} ({date})
      </p>
    </div>
  )
} 