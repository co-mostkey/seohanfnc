import { NextRequest, NextResponse } from 'next/server';
import { readItems, updateItem, deleteItem } from '@/lib/file-db';
import { ContentBlock } from '@/types/content-block';

const FILE_NAME = 'contentBlocks.json';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await readItems<ContentBlock>(FILE_NAME);
  const block = items.find(item => item.id === slug);
  if (!block) {
    return NextResponse.json({ success: false, message: '콘텐츠 블록을 찾을 수 없습니다.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: block });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await request.json();
  const { title, content } = body;
  if (!title || !content) {
    return NextResponse.json({ success: false, message: '필수 필드가 누락되었습니다.' }, { status: 400 });
  }
  const updated = await updateItem<ContentBlock>(FILE_NAME, slug, { title, content, updatedAt: new Date().toISOString() });
  if (!updated) {
    return NextResponse.json({ success: false, message: '업데이트에 실패했습니다.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deleted = await deleteItem<ContentBlock>(FILE_NAME, slug);
  if (!deleted) {
    return NextResponse.json({ success: false, message: '삭제에 실패했습니다.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: '삭제되었습니다.' });
}
