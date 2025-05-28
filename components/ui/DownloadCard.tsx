"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, Download } from 'lucide-react';

interface DownloadCardProps {
  title: string;
  url: string;
  fileType?: string;
  fileSize?: string;
  className?: string;
}

export function DownloadCard({
  title,
  url,
  fileType = 'PDF',
  fileSize,
  className = '',
}: DownloadCardProps) {
  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-md ${className}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
          <FileIcon className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fileType}{fileSize && ` · ${fileSize}`}
          </p>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          className="flex-shrink-0 h-9 px-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          다운로드
        </Button>
      </CardContent>
    </Card>
  );
}

export default DownloadCard; 