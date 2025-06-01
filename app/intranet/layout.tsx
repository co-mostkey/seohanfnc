import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '서한F&C 인트라넷',
    description: '서한F&C 내부 인트라넷 시스템',
    robots: {
        index: false,
        follow: false,
    }
};

export default function IntranetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-900">
            {/* [TRISID] 인트라넷 전용 배경 및 레이아웃 */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
            <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
            <div className="relative">
                {children}
            </div>
        </div>
    );
} 