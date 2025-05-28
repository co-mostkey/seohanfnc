'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Loader2, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    className?: string;
    variant?: 'default' | 'card' | 'inline' | 'overlay';
    icon?: 'spinner' | 'refresh' | 'clock' | 'database';
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
};

const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
};

const iconComponents = {
    spinner: Loader2,
    refresh: RefreshCw,
    clock: Clock,
    database: Database
};

export function LoadingSpinner({
    size = 'md',
    text,
    className,
    variant = 'default',
    icon = 'spinner'
}: LoadingSpinnerProps) {
    const IconComponent = iconComponents[icon];

    const spinner = (
        <div className={cn("flex items-center justify-center", className)}>
            <div className="flex items-center space-x-2">
                <IconComponent className={cn(sizeClasses[size], "animate-spin text-blue-600")} />
                {text && (
                    <span className={cn("text-gray-600", textSizeClasses[size])}>
                        {text}
                    </span>
                )}
            </div>
        </div>
    );

    switch (variant) {
        case 'card':
            return (
                <Card className={className}>
                    <CardContent className="py-12">
                        {spinner}
                    </CardContent>
                </Card>
            );

        case 'inline':
            return (
                <span className={cn("inline-flex items-center space-x-1", className)}>
                    <IconComponent className={cn(sizeClasses[size], "animate-spin")} />
                    {text && <span className={textSizeClasses[size]}>{text}</span>}
                </span>
            );

        case 'overlay':
            return (
                <div className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                    className
                )}>
                    <Card className="p-6">
                        <CardContent className="p-0">
                            {spinner}
                        </CardContent>
                    </Card>
                </div>
            );

        default:
            return (
                <div className={cn("min-h-[200px]", className)}>
                    {spinner}
                </div>
            );
    }
}

// 페이지 로딩용 컴포넌트
export function PageLoading({ text = "페이지를 불러오는 중..." }: { text?: string }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

// 데이터 로딩용 컴포넌트
export function DataLoading({ text = "데이터를 불러오는 중..." }: { text?: string }) {
    return (
        <LoadingSpinner
            variant="card"
            size="md"
            text={text}
            icon="database"
        />
    );
}

// 저장 중 로딩 컴포넌트
export function SavingLoading({ text = "저장 중..." }: { text?: string }) {
    return (
        <LoadingSpinner
            variant="inline"
            size="sm"
            text={text}
            icon="refresh"
        />
    );
}

// 버튼 내부 로딩 컴포넌트
export function ButtonLoading({ text }: { text?: string }) {
    return (
        <LoadingSpinner
            variant="inline"
            size="sm"
            text={text}
            className="text-white"
        />
    );
}

// 테이블 로딩 컴포넌트
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="h-4 bg-gray-200 rounded animate-pulse flex-1"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// 스켈레톤 로딩 컴포넌트
export function SkeletonLoading({
    lines = 3,
    className
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "h-4 bg-gray-200 rounded animate-pulse",
                        index === lines - 1 ? "w-3/4" : "w-full"
                    )}
                />
            ))}
        </div>
    );
}

// 카드 스켈레톤 로딩
export function CardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={className}>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                    <SkeletonLoading lines={3} />
                    <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default LoadingSpinner; 