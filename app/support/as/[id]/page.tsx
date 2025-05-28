import { notFound } from 'next/navigation';
import { ASPost } from '@/types/as-post';
import { readItems } from '@/lib/file-db';

/**
 * 정적 빌드를 위한 파라미터 생성
 */
export async function generateStaticParams() {
    return [];
}

export default async function ASDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; const posts = await readItems<ASPost>('as-board.json'); const post = posts.find((p) => p.id === id);

    if (!post) return notFound();

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-xl font-bold mb-4">{post.title}</h1>
            <div className="text-sm text-gray-600 mb-6">
                작성자: {post.author} | 상태: <span className="capitalize">{post.status}</span> | 작성일: {post.createdAt.split('T')[0]}
            </div>
            <div className="prose mb-8 whitespace-pre-wrap break-words">
                {post.content}
            </div>
            {post.reply && (
                <div className="border-t pt-6 mt-6">
                    <h2 className="font-semibold mb-2">관리자 답변</h2>
                    <div className="whitespace-pre-wrap break-words">
                        {post.reply}
                    </div>
                </div>
            )}
        </div>
    );
} 