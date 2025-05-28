import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
                {/* 로고 또는 브랜드 이미지 영역 */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-red-400 rounded-full animate-spin animation-delay-150"></div>
                </div>

                {/* 회사명 */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">서한에프앤씨</h1>
                    <p className="text-gray-400 text-sm">로딩 중...</p>
                </div>

                {/* 진행률 표시 (선택사항) */}
                <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
} 