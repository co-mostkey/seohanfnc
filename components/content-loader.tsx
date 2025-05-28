"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface ContentLoaderProps {
  contentPath?: string;
  fallback?: React.ReactNode;
}

export default function ContentLoader({ contentPath, fallback }: ContentLoaderProps) {
  const pathname = usePathname();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      setError(null);
      
      try {
        // If contentPath is provided, use it; otherwise, derive from pathname
        const path = contentPath || pathname;
        
        // Remove leading slash and replace any remaining slashes with hyphens
        const normalizedPath = path?.replace(/^\//, '').replace(/\//g, '-');
        
        // Try to load the content from the content directory
        const response = await fetch(`/api/content?path=${normalizedPath}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadContent();
  }, [contentPath, pathname]);

  // Show loading state
  if (isLoading) {
    return <div className="animate-pulse p-4 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>;
  }

  // Show error state
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Show content if available
  if (content) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default empty state
  return <div className="text-gray-400 p-4">No content available.</div>;
} 