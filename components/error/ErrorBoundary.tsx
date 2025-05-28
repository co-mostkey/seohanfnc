"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        // 다음 렌더링에서 fallback UI가 보이도록 상태를 업데이트합니다.
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 에러 리포팅 서비스에 에러를 기록할 수 있습니다
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // 커스텀 fallback UI가 제공된 경우 사용
            if (this.props.fallback) {
                return this.props.fallback
            }

            // 기본 fallback UI
            return (
                <div className="flex items-center justify-center min-h-[200px] p-4">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            문제가 발생했습니다
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            이 구성 요소를 로드하는 중 오류가 발생했습니다.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            다시 시도
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    에러 상세 정보 (개발 모드)
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                                    {this.state.error.message}
                                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary 