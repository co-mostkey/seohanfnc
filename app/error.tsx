"use client"

import * as React from 'react'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // 에러를 로깅 서비스에 전송
    console.error('Error boundary caught an error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              문제가 발생했습니다
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              죄송합니다. 요청을 처리하는 중 오류가 발생했습니다.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={reset}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              다시 시도
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              홈으로 이동
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6">
              <details className="group">
                <summary className="list-none cursor-pointer">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">에러 상세 정보</span>
                    <span className="text-xs text-gray-500">(개발 모드)</span>
                  </div>
                </summary>
                <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-md">
                  <div className="text-sm">
                    <p className="font-medium text-red-800 mb-2">오류 메시지:</p>
                    <p className="text-red-700 mb-3">{error.message}</p>
                    {error.digest && (
                      <>
                        <p className="font-medium text-red-800 mb-2">Digest:</p>
                        <p className="text-red-700 mb-3 font-mono text-xs">{error.digest}</p>
                      </>
                    )}
                    {error.stack && (
                      <>
                        <p className="font-medium text-red-800 mb-2">스택 트레이스:</p>
                        <pre className="text-xs text-red-700 overflow-auto max-h-32 bg-red-100 p-2 rounded">
                          {error.stack}
                        </pre>
                      </>
                    )}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 