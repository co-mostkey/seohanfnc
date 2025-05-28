import React from 'react';
import Link from 'next/link';
import { FileText as DefaultFileIcon, ExternalLink, Clock, Plus, LucideIcon } from 'lucide-react';
import type { Document } from '@/data/intranetDashboardData';
import { fileTypeIcons, getRelativeTimeString, getNoticeCategoryStyle } from '@/lib/intranetUtils'; // getNoticeCategoryStyle 재활용

interface DocumentWidgetProps {
    documents: Document[];
}

export const DocumentWidget: React.FC<DocumentWidgetProps> = ({ documents }) => {
    return (
        <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white flex items-center">
                    <DefaultFileIcon className="h-5 w-5 mr-2 text-green-400" />
                    <span>최근 문서</span>
                </h3>
                <Link
                    href="/intranet/documents"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span>전체보기</span>
                </Link>
            </div>
            <div className="p-4">
                <ul className="space-y-3">
                    {documents.map((doc) => {
                        const fileIconData = fileTypeIcons[doc.fileType] || fileTypeIcons.default;
                        const IconComponent = fileIconData.icon as LucideIcon;
                        const iconColorClass = fileIconData.color;
                        return (
                            <li key={doc.id} className="relative group">
                                <Link href={`/intranet/documents/${doc.id}`} className="block" >
                                    <div className="flex items-center p-2 rounded-lg group-hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10">
                                        <div className={`mr-3 h-10 w-10 flex items-center justify-center rounded-lg bg-black/50 border border-white/10 group-hover:border-blue-500/30 transition-colors`}>
                                            {IconComponent && React.createElement(IconComponent, { className: `h-5 w-5 ${iconColorClass}` })}
                                        </div>
                                        <div className="flex-1 min-w-0"> {/* 자식 요소의 truncate가 작동하도록 min-w-0 추가 */}
                                            <p className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors truncate">
                                                {doc.title}
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${getNoticeCategoryStyle(doc.category)}`}>
                                                    {doc.category}
                                                </span>
                                                <span className="mx-1.5 text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-400 flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {getRelativeTimeString(doc.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                {documents.length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                        <DefaultFileIcon className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                        최근 문서가 없습니다.
                    </div>
                )}
                <div className="mt-4">
                    <Link
                        href="/intranet/documents/upload"
                        className="flex items-center justify-center w-full py-2 rounded-lg border border-dashed border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-all group"
                    >
                        <Plus className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" />
                        <span>새 문서 업로드</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}; 