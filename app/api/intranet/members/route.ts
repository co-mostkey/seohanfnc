import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

// [TRISID] 인트라넷 직원 관리 API

const dbPath = path.join(process.cwd(), 'data/db/intranet-users.json');

interface IntranetMember {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'vacation';
  joinDate: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

// GET: 직원 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const data = await safeReadJSON(dbPath, { users: [], lastId: 0 });
    let members = data.users || [];

    // 부서별 필터링
    if (department && department !== 'all') {
      members = members.filter((member: IntranetMember) => member.department === department);
    }

    // 상태별 필터링
    if (status && status !== 'all') {
      members = members.filter((member: IntranetMember) => member.status === status);
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      members = members.filter((member: IntranetMember) =>
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.position.toLowerCase().includes(searchLower) ||
        member.department.toLowerCase().includes(searchLower)
      );
    }

    // 이름순 정렬
    members.sort((a: IntranetMember, b: IntranetMember) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      members
    });
  } catch (error) {
    console.error('직원 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '직원 목록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST: 직원 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, position, department, phone, avatar, joinDate, birthDate } = body;

    if (!name || !email || !position || !department) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const data = await safeReadJSON(dbPath, { users: [], lastId: 0 });
    
    // 이메일 중복 확인
    const existingMember = data.users.find((member: IntranetMember) => member.email === email);
    if (existingMember) {
      return NextResponse.json(
        { success: false, error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    const newId = (data.lastId || 0) + 1;

    const newMember: IntranetMember = {
      id: String(newId),
      name,
      email,
      position,
      department,
      phone: phone || '',
      avatar: avatar || '/images/avatars/default.jpg',
      status: 'active',
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      birthDate: birthDate || '',
      address: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.users.push(newMember);
    data.lastId = newId;

    await safeWriteJSON(dbPath, data);

    return NextResponse.json({
      success: true,
      member: newMember
    });
  } catch (error) {
    console.error('직원 추가 오류:', error);
    return NextResponse.json(
      { success: false, error: '직원 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 직원 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '직원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const data = await safeReadJSON(dbPath, { users: [], lastId: 0 });
    const memberIndex = data.users.findIndex((member: IntranetMember) => member.id === id);

    if (memberIndex === -1) {
      return NextResponse.json(
        { success: false, error: '직원을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    data.users[memberIndex] = {
      ...data.users[memberIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await safeWriteJSON(dbPath, data);

    return NextResponse.json({
      success: true,
      member: data.users[memberIndex]
    });
  } catch (error) {
    console.error('직원 정보 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '직원 정보 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 직원 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: '직원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const data = await safeReadJSON(dbPath, { users: [], lastId: 0 });
    const memberIndex = data.users.findIndex((member: IntranetMember) => member.id === memberId);

    if (memberIndex === -1) {
      return NextResponse.json(
        { success: false, error: '직원을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    data.users.splice(memberIndex, 1);

    await safeWriteJSON(dbPath, data);

    return NextResponse.json({
      success: true,
      message: '직원이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('직원 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '직원 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 