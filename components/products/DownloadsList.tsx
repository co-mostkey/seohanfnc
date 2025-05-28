import React from 'react';
import Link from 'next/link';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/product';

interface DownloadsListProps {
  documents: Document[];
}

export function DownloadsList({ documents }: DownloadsListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {doc.name}
              </h3>
              {doc.fileSize && (
                <span className="text-xs text-gray-400">
                  {doc.fileSize}
                </span>
              )}
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full mt-2 flex items-center justify-center"
          >
            <Link
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
} 