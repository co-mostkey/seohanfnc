import Link from 'next/link';
import { ASPost } from '@/types/as-post';
import { readItems } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export default async function GuestbookPage() {
    const posts = (await readItems<ASPost>('as-board.json')) || [];
    const sorted = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-2">방명록</h1>
            <p className="text-sm text-gray-600 mb-6">자유롭게 의견을 남겨주세요.</p>
            <div className="flex justify-end mb-4">
                <Link href="/support/as/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">글쓰기</Link>
            </div>
            <table className="w-full text-sm border-t">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border-b text-left w-16">번호</th>
                        <th className="p-2 border-b text-left">제목</th>
                        <th className="p-2 border-b text-left w-24">작성자</th>
                        <th className="p-2 border-b text-left w-32">작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">등록된 글이 없습니다.</td>
                        </tr>
                    )}
                    {sorted.map((post, idx) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                            <td className="p-2 border-b">{sorted.length - idx}</td>
                            <td className="p-2 border-b">
                                <Link
                                    href={`/support/as/${post.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {post.title}
                                </Link>
                            </td>
                            <td className="p-2 border-b">{post.author}</td>
                            <td className="p-2 border-b">{post.createdAt.split('T')[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 