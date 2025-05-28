import React from 'react'
import { cn } from '@/lib/utils'

type SpecValue = string | string[] | number | boolean | Record<string, string>

interface SpecTableProps {
  specifications: Record<string, SpecValue>
  className?: string
}

export function SpecTable({ specifications, className }: SpecTableProps) {
  // Convert specifications object to array of key-value pairs
  const specEntries = Object.entries(specifications)

  const formatValue = (value: SpecValue): React.ReactNode => {
    // Handle array values
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {value.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? (
        <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
          예
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400">
          아니오
        </span>
      )
    }
    
    // Handle number values
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    
    // Handle object values (nested specs)
    if (typeof value === 'object') {
      return (
        <dl className="space-y-1">
          {Object.entries(value).map(([subKey, subValue], idx) => (
            <div key={idx} className="flex flex-col">
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{subKey}</dt>
              <dd className="text-sm">{subValue}</dd>
            </div>
          ))}
        </dl>
      )
    }
    
    // Handle string values
    return value
  }

  if (!specifications || Object.keys(specifications).length === 0) {
    return null
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-800/80">
          <tr>
            <th scope="col" className="py-3.5 px-4 text-left w-1/3 sm:w-1/4 text-gray-700 dark:text-gray-200 font-medium text-sm border-b border-gray-200 dark:border-gray-700">항목</th>
            <th scope="col" className="py-3.5 px-4 text-left w-2/3 sm:w-3/4 text-gray-700 dark:text-gray-200 font-medium text-sm border-b border-gray-200 dark:border-gray-700">내용</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {specEntries.map(([key, value], index) => (
            <tr 
              key={index} 
              className={cn(
                index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50',
                'hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors'
              )}
            >
              <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white align-top border-r border-gray-100 dark:border-gray-800">
                {key}
              </td>
              <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                {formatValue(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 