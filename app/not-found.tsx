import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="container mx-auto flex min-h-[600px] items-center justify-center px-4">
            <div className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
                <h2 className="mb-4 text-2xl font-bold text-gray-700 dark:text-gray-300">페이지를 찾을 수 없습니다</h2>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                </p>
                <div className="space-x-4">
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
                    >
                        홈으로 돌아가기
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        제품 보기
                    </Link>
                </div>
            </div>
        </div>
    )
} 