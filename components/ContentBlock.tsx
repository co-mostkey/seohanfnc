"use client";
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ContentBlock as ContentBlockType } from '@/types/content-block';

interface ContentBlockProps {
  slug: string;
  className?: string;
}

export function ContentBlock({ slug, className }: ContentBlockProps) {
  const [block, setBlock] = useState<ContentBlockType | null>(null);

  useEffect(() => {
    fetch(`/api/admin/content-blocks/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBlock(data.data);
        }
      })
      .catch(console.error);
  }, [slug]);

  if (!block) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">{block.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: block.content }} />
    </div>
  );
}
