'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ASNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/as', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, email, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '등록 실패');
      }
      router.push(`/support/as/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">AS 문의 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block mb-1 text-sm font-medium">제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">작성자 *</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">내용 *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
} 