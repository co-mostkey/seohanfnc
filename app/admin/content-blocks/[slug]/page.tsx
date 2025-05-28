"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContentBlock as ContentBlockType } from '@/types/content-block';

export default function ContentBlockEditPage() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/content-blocks/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const block: ContentBlockType = data.data;
          setTitle(block.title);
          setContent(block.content);
        }
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/content-blocks/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    const result = await res.json();
    setLoading(false);
    if (result.success) {
      alert('저장되었습니다.');
      router.push('/admin/content-blocks');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">콘텐츠 블록 편집: {slug}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">제목</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="content">내용 (HTML)</Label>
          <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={10} className="mt-1 font-mono text-sm" />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>{loading ? '저장중...' : '저장'}</Button>
          <Button variant="outline" onClick={() => router.push('/admin/content-blocks')}>취소</Button>
        </div>
      </form>
    </div>
  );
}