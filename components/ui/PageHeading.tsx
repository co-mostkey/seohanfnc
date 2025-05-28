import React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeadingProps {
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function PageHeading({ 
  title, 
  subtitle, 
  className,
  align = 'left'
}: PageHeadingProps) {
  return (
    <div className={cn(
      "mb-6",
      {
        "text-center": align === 'center',
        "text-right": align === 'right',
        "text-left": align === 'left',
      },
      className
    )}>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-gray-900 dark:text-gray-100 max-w-2xl font-medium text-base",
          {
            "mx-auto": align === 'center'
          }
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// default export도 제공
export default PageHeading; 