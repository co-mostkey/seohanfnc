'use client';

import Link from 'next/link';
import { Download, ExternalLink } from 'lucide-react';

interface Document {
  id: string;
  nameKo: string;
  path: string;
  type: string;
}

interface ProductDocumentsProps {
  documents?: Document[];
}

/**
 * 제품 관련 문서를 표시하는 컴포넌트
 * 다운로드 가능한 문서 목록을 표시합니다.
 */
const ProductDocuments = ({ documents }: ProductDocumentsProps) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Download className="w-5 h-5 mr-2 text-blue-400" />
        관련 자료
      </h3>
      <div className="space-y-4">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={doc.path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border border-gray-700/40 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 hover:border-blue-500/30 transition-colors"
          >
            <div className="p-2 rounded-full bg-blue-900/30 mr-3">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{doc.nameKo}</h3>
              <p className="text-xs text-gray-400">
                {doc.type.toUpperCase()} 파일
              </p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductDocuments;
