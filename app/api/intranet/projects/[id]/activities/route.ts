import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// [TRISID] 프로젝트 활동 로그 관리 API

const DATA_FILE = path.join(process.cwd(), 'data/db/intranet-projects.json');

// 데이터 읽기
function readProjectsData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[TRISID] 프로젝트 데이터 읽기 실패:', error);
    return { projects: [] };
  }
}

// 데이터 쓰기
function writeProjectsData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('[TRISID] 프로젝트 데이터 쓰기 실패:', error);
    return false;
  }
}

// POST: 새 활동 로그 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { action, userName, userAvatar } = await request.json();

    console.log('[TRISID] 새 활동 로그 추가 요청:', { projectId, action, userName });

    // 필수 필드 검증
    if (!action || !userName) {
      return NextResponse.json(
        { success: false, error: '액션과 사용자 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    const projectsData = readProjectsData();
    const projectIndex = projectsData.projects.findIndex((p: any) => p.id === projectId);

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 새 활동 로그 생성
    const newActivity = {
      id: `activity-${Date.now()}`,
      action,
      user: {
        name: userName,
        avatar: userAvatar || '/images/avatars/avatar-3.svg'
      },
      timestamp: new Date().toISOString()
    };

    // 프로젝트에 활동 로그 추가
    if (!projectsData.projects[projectIndex].recentActivities) {
      projectsData.projects[projectIndex].recentActivities = [];
    }
    
    // 최신 활동을 맨 앞에 추가
    projectsData.projects[projectIndex].recentActivities.unshift(newActivity);
    
    // 최대 20개까지만 유지
    if (projectsData.projects[projectIndex].recentActivities.length > 20) {
      projectsData.projects[projectIndex].recentActivities = 
        projectsData.projects[projectIndex].recentActivities.slice(0, 20);
    }

    // 업데이트 시간 갱신
    projectsData.projects[projectIndex].updatedAt = new Date().toISOString();

    // 데이터 저장
    if (!writeProjectsData(projectsData)) {
      return NextResponse.json(
        { success: false, error: '데이터 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[TRISID] 새 활동 로그 추가 성공:', newActivity);

    return NextResponse.json({
      success: true,
      activity: newActivity
    });

  } catch (error) {
    console.error('[TRISID] 활동 로그 추가 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '활동 로그 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 활동 로그 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    console.log('[TRISID] 활동 로그 조회 요청:', projectId);

    const projectsData = readProjectsData();
    const project = projectsData.projects.find((p: any) => p.id === projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const activities = project.recentActivities || [];

    console.log('[TRISID] 활동 로그 조회 성공:', activities.length, '개');

    return NextResponse.json({
      success: true,
      activities
    });

  } catch (error) {
    console.error('[TRISID] 활동 로그 조회 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '활동 로그 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 