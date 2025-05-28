'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
            }

            return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />;
        }

        return this.props.children;
    }
}

// 기본 에러 폴백 컴포넌트
function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-red-800">
                        오류가 발생했습니다
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-gray-600">
                        예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                    </p>

                    {isDevelopment && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                <Bug className="h-4 w-4 mr-2" />
                                개발자 정보
                            </h4>
                            <pre className="text-sm text-gray-600 overflow-auto max-h-32">
                                {error.message}
                                {error.stack && '\n\n' + error.stack}
                            </pre>
                        </div>
                    )}

                    <div className="flex justify-center space-x-3">
                        <Button onClick={retry} variant="default">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            다시 시도
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/admin'}
                            variant="outline"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            관리자 홈
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// 간단한 에러 표시 컴포넌트
export function ErrorDisplay({
    error,
    title = "오류 발생",
    onRetry
}: {
    error: string | Error;
    title?: string;
    onRetry?: () => void;
}) {
    const errorMessage = typeof error === 'string' ? error : error.message;

    return (
        <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-medium text-red-800">{title}</h3>
                        <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                variant="outline"
                                size="sm"
                                className="mt-3"
                            >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                다시 시도
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// 네트워크 에러 전용 컴포넌트
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorDisplay
            error="네트워크 연결을 확인해주세요. 서버에 연결할 수 없습니다."
            title="연결 오류"
            onRetry={onRetry}
        />
    );
}

// 권한 에러 전용 컴포넌트
export function PermissionError() {
    return (
        <ErrorDisplay
            error="이 작업을 수행할 권한이 없습니다. 관리자에게 문의하세요."
            title="권한 없음"
        />
    );
}

export default ErrorBoundary; 