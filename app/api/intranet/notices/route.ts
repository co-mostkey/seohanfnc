import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

// [TRISID] 인트라넷 공지사항 관리 API

const dbPath = path.join(process.cwd(), 'data/db/intranet-notices.json');

interface IntranetNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    name: string;
    position: string;
    department: string;
    avatar?: string;
  };
  isPinned: boolean;
  isImportant: boolean;
  viewCount: number;
  commentCount: number;
  attachments: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    url?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const data = await safeReadJSON(dbPath, { notices: [], lastId: 0 });
    let notices = data.notices || [];

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      notices = notices.filter((notice: IntranetNotice) =>
        notice.title.toLowerCase().includes(searchLower) ||
        notice.content.toLowerCase().includes(searchLower)
      );
    }

    // 카테고리 필터링
    if (category && category !== 'all') {
      notices = notices.filter((notice: IntranetNotice) => notice.category === category);
    }

    // 정렬: 고정 공지 우선, 그 다음 최신순
    notices.sort((a: IntranetNotice, b: IntranetNotice) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // 페이지네이션
    const totalCount = notices.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotices = notices.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      notices: paginatedNotices,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    });
  } catch (error) {
    console.error('공지사항 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 목록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST: 공지사항 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, isPinned, isImportant, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    const data = await safeReadJSON(dbPath, { notices: [], lastId: 0 });
    const newId = (data.lastId || 0) + 1;

    const newNotice: IntranetNotice = {
      id: String(newId),
      title,
      content,
      category: category || '일반',
      author: author || {
        id: 'admin',
        name: '관리자',
        position: '관리자',
        department: 'IT팀',
        avatar: '/images/avatars/default.jpg'
      },
      isPinned: isPinned || false,
      isImportant: isImportant || false,
      viewCount: 0,
      commentCount: 0,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.notices.push(newNotice);
    data.lastId = newId;

    await safeWriteJSON(dbPath, data);

    return NextResponse.json({
      success: true,
      notice: newNotice
    });
  } catch (error) {
    console.error('공지사항 추가 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 공지사항 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, category, isPinned, isImportant } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '공지사항 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const data = await safeReadJSON(dbPath, { notices: [], lastId: 0 });
    const noticeIndex = data.notices.findIndex((notice: IntranetNotice) => notice.id === id);

    if (noticeIndex === -1) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    data.notices[noticeIndex] = {
      ...data.notices[noticeIndex],
      title: title || data.notices[noticeIndex].title,
      content: content || data.notices[noticeIndex].content,
      category: category || data.notices[noticeIndex].category,
      isPinned: isPinned !== undefined ? isPinned : data.notices[noticeIndex].isPinned,
      isImportant: isImportant !== undefined ? isImportant : data.notices[noticeIndex].isImportant,
      updatedAt: new Date().toISOString()
    };

    await safeWriteJSON(dbPath, data);

    return NextResponse.json({
      success: true,
      notice: data.notices[noticeIndex]
    });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 공지사항 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noticeId = searchParams.get('id');

    if (!noticeId) {
      return NextResponse.json(
        { success: false, error: '공지사항 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const data = await safeReadJSON(dbPath, { notices: [], lastId: 0 });
    const noticeIndex = data.notices.findIndex((notice: IntranetNotice) => notice.id === noticeId);

    if (noticeIndex === -1) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    data.notices.splice(noticeIndex, 1);

    await safeWriteJSON(dbPath, data);

    return NextResponse.json({
      success: true,
      message: '공지사항이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 