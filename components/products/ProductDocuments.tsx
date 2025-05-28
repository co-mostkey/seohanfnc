import React from 'react';
import { Download } from 'lucide-react';
import { Document } from '@/types/product';

interface ProductDocumentsProps {
  documents: Document[];
}

export function ProductDocuments({ documents }: ProductDocumentsProps) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">다운로드</h3>
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <a
            key={index}
            href={doc.url}
            download={doc.filename}
            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:border-gray-700"
          >
            <Download className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="font-medium">{doc.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{doc.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 