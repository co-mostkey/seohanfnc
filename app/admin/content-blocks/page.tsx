"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ContentBlock as ContentBlockType } from '@/types/content-block';

export default function AdminContentBlocksPage() {
  const [blocks, setBlocks] = useState<ContentBlockType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/content-blocks')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBlocks(data.data);
        }
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">콘텐츠 블록 관리</h1>
        <Button onClick={() => router.push('/admin/content-blocks/quote-info')}>새 블록 추가</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>슬러그 (ID)</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>수정일</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.map(block => (
            <TableRow key={block.id}>
              <TableCell>{block.id}</TableCell>
              <TableCell>{block.title}</TableCell>
              <TableCell>{block.updatedAt ? new Date(block.updatedAt).toLocaleString() : '-'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/content-blocks/${block.id}`)}>편집</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}