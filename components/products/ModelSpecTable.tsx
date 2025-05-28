"use client";

import React from 'react';
import { cn } from '@/lib/utils';

type ModelSpecProps = {
  specTable: Array<{
    title: string;
    [key: string]: string;
  }>;
  className?: string;
};

/**
 * 모델별 제품 사양 테이블 컴포넌트
 */
export function ModelSpecTable({ specTable, className }: ModelSpecProps) {
  if (!specTable || specTable.length === 0) {
    return null;
  }
  
  // 테이블 헤더 컬럼 (title 외의 모든 키)
  const columns = Object.keys(specTable[0]).filter(key => key !== 'title');
  
  return (
    <div className={cn("relative overflow-x-auto rounded-lg border border-gray-800", className)}>
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-300">
          <tr>
            <th scope="col" className="px-4 py-3 border-r border-gray-700 font-medium">
              구분
            </th>
            {columns.map((column, index) => (
              <th 
                key={index} 
                scope="col" 
                className="px-4 py-3 text-center font-medium"
              >
                {specTable[0][column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specTable.slice(1).map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={cn(
                "border-b border-gray-700", 
                rowIndex % 2 === 0 ? "bg-gray-800/40" : "bg-gray-800/20"
              )}
            >
              <th 
                scope="row" 
                className="px-4 py-3 font-medium text-white whitespace-nowrap border-r border-gray-700"
              >
                {row.title}
              </th>
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className="px-4 py-3 text-center"
                >
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
