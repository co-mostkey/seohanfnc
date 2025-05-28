"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center max-w-md w-full p-6 rounded-lg bg-gray-900/60 border border-gray-800/40 backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-6 text-red-400">
          <RefreshCw size={28} />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-white">문제가 발생했습니다</h2>
        <p className="mb-6 text-gray-400">
          죄송합니다. 제품 정보를 로드하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reset}
            variant="default"
            className="bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            다시 시도
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 bg-black/50 hover:bg-gray-900 text-white w-full sm:w-auto"
            asChild
          >
            <Link href="/" >
              <ArrowLeft size={16} className="mr-2" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-gray-500">에러 코드: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
