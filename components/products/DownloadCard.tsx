import React from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Document {
  name: string;
  url: string;
  fileType?: string;
  fileSize?: string;
}

interface DownloadCardProps {
  documents: Document[];
  className?: string;
  title?: string;
}

export default function DownloadCard({ documents, className, title = "다운로드" }: DownloadCardProps) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className={cn("rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden", className)}>
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {documents.map((doc, index) => (
          <a
            key={index}
            href={doc.url}
            download
            className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                <Download className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                {(doc.fileType || doc.fileSize) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.fileType && <span>{doc.fileType}</span>}
                    {doc.fileType && doc.fileSize && <span> · </span>}
                    {doc.fileSize && <span>{doc.fileSize}</span>}
                  </p>
                )}
              </div>
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              다운로드
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 