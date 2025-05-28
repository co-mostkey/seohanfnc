import React from 'react';
import NoticeDetailClient from './client-component';

// 임시 공지사항 데이터 (실제로는 API 호출을 통해 가져옴)
const noticesData = [
  {
    id: '1',
    title: '2024년 하반기 경영계획 발표회 안내',
    content: `<p>안녕하세요, 서한에프앤씨 임직원 여러분.</p>
    <p>2024년 하반기 경영계획 발표회를 아래와 같이 개최하오니 임직원 여러분의 많은 참석 바랍니다.</p>
    <h3>발표회 개요</h3>
    <ul>
      <li>일시: 2024년 7월 5일 오전 10시</li>
      <li>장소: 본사 대회의실</li>
      <li>참석대상: 전 임직원</li>
      <li>주요내용: 하반기 사업 계획 및 부서별 목표 발표</li>
    </ul>
    <p>부서장들은 부서별 발표자료를 6월 30일까지 경영지원팀으로 제출해주시기 바랍니다.</p>
    <p>감사합니다.</p>`,
    category: '회사소식',
    createdAt: '2024-06-25T09:00:00',
    updatedAt: '2024-06-25T09:00:00',
    author: '경영지원팀',
    authorId: 'admin',
    department: '경영지원팀',
    views: 128,
    isPinned: true,
    isImportant: true,
    attachments: [
      { id: '1-1', fileName: '2024년_하반기_경영계획_일정.pdf', fileSize: '1.2MB' },
      { id: '1-2', fileName: '발표회_참석자_명단.xlsx', fileSize: '450KB' },
    ],
    comments: [
      { id: 1, author: '홍길동', department: '영업팀', content: '발표 자료는 어떤 형식으로 준비하면 될까요?', createdAt: '2024-06-25 14:30' },
      { id: 2, author: '경영지원팀', department: '경영지원팀', content: '파워포인트 양식을 이메일로 발송해드렸습니다. 확인 부탁드립니다.', createdAt: '2024-06-25 15:15' },
    ]
  },
  {
    id: '2',
    title: '여름 휴가 신청 안내',
    content: `<p>안녕하세요, 서한에프앤씨 임직원 여러분.</p>
    <p>2024년 여름 휴가 신청에 관하여 아래와 같이 안내드립니다.</p>
    <h3>휴가 신청 안내</h3>
    <ul>
      <li>신청기간: 2024년 6월 25일 ~ 7월 10일</li>
      <li>휴가사용기간: 2024년 7월 15일 ~ 8월 31일</li>
      <li>신청방법: 인사팀 휴가신청서 제출</li>
    </ul>
    <p>부서별 업무 공백이 발생하지 않도록 부서장과 사전 협의 후 신청해주시기 바랍니다.</p>
    <p>기타 문의사항은 인사팀으로 연락주세요.</p>`,
    category: '인사',
    createdAt: '2024-06-22T11:30:00',
    updatedAt: '2024-06-22T11:30:00',
    author: '인사팀',
    authorId: 'hr',
    department: '인사팀',
    views: 95,
    isPinned: true,
    isImportant: false,
    attachments: [
      { id: '2-1', fileName: '휴가신청서_양식.docx', fileSize: '320KB' },
    ],
    comments: []
  },
  {
    id: '3',
    title: '신규 제품 교육 일정 안내',
    content: `<p>안녕하세요, 서한에프앤씨 임직원 여러분.</p>
    <p>신규 출시 예정인 제품에 대한 교육을 아래와 같이 실시합니다.</p>
    <h3>교육 일정</h3>
    <ul>
      <li>일시: 2024년 7월 7일 오후 2시 ~ 4시</li>
      <li>장소: 교육장</li>
      <li>참석대상: 영업팀, 마케팅팀 전 직원</li>
      <li>주요내용: 신규 제품 기능 및 판매 전략 교육</li>
    </ul>
    <p>참석 여부를 7월 3일까지 영업팀 이메일로 회신해주시기 바랍니다.</p>`,
    category: '교육',
    createdAt: '2024-06-20T14:15:00',
    updatedAt: '2024-06-20T15:30:00',
    author: '영업팀',
    authorId: 'sales',
    department: '영업팀',
    views: 67,
    isPinned: false,
    isImportant: true,
    attachments: [
      { id: '3-1', fileName: '신규제품_사양서.pdf', fileSize: '2.8MB' },
    ],
    comments: [
      { id: 1, author: '김철수', department: '마케팅팀', content: '교육 자료는 미리 공유 가능한가요?', createdAt: '2024-06-20 16:30' },
      { id: 2, author: '영업팀', department: '영업팀', content: '교육 당일 자료를 배포해드릴 예정입니다.', createdAt: '2024-06-21 09:15' },
    ]
  },
];

// 정적 생성을 위한 함수
export function generateStaticParams() {
  // 정적으로 생성할 공지사항 ID 목록
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 서버에서 공지사항 데이터 조회
  const { id: noticeId } = await params;
  const initialNotice = noticesData.find(n => n.id === noticeId);

  // 클라이언트 컴포넌트에 데이터 전달
  return <NoticeDetailClient noticeId={noticeId} initialNotice={initialNotice} noticesData={noticesData} />;
}