import { NextRequest, NextResponse } from 'next/server';
import { readItems, saveItem } from '@/lib/file-db';
import { ContentBlock } from '@/types/content-block';

const FILE_NAME = 'contentBlocks.json';

export async function GET(request: NextRequest) {
  const items = await readItems<ContentBlock>(FILE_NAME);
  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, title, content } = body;
  if (!id || !title || !content) {
    return NextResponse.json({ success: false, message: '필수 필드가 누락되었습니다.' }, { status: 400 });
  }
  const newItem: ContentBlock = {
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveItem<ContentBlock>(FILE_NAME, newItem);
  return NextResponse.json({ success: true, data: newItem });
}
