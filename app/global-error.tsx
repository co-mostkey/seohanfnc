"use client"

import * as React from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    React.useEffect(() => {
        // 에러를 로깅 서비스에 전송
        console.error('Global error occurred:', error)
    }, [error])

    return (
        <html lang="ko">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full mx-auto text-center p-6">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="mb-4">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg
                                        className="h-6 w-6 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-xl font-semibold text-gray-900 mb-4">
                                시스템 오류가 발생했습니다
                            </h1>
                            <p className="text-gray-600 mb-6">
                                죄송합니다. 예상치 못한 오류가 발생했습니다.
                                잠시 후 다시 시도해 주세요.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={reset}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    다시 시도
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    홈으로 이동
                                </button>
                            </div>
                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-6 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                        에러 상세 정보 (개발 모드)
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                                        {error.message}
                                        {error.stack && `\n\n${error.stack}`}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
} 