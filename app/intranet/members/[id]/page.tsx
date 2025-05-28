import React from 'react';
import MemberDetailClient from './client-component';

// 임시 직원 데이터
const initialMembers = [
  {
    id: 1,
    name: '김철수',
    position: '대표이사',
    department: '경영지원',
    email: 'ceo@seohanfnc.com',
    phone: '010-1234-5678',
    extension: '100',
    location: '본사 8층',
    avatar: '/images/avatars/avatar-1.jpg',
    joinDate: '2010-03-15',
    birthDate: '1970-06-15',
    address: '서울시 강남구',
    skills: ['경영', '전략기획', '리더십'],
    education: [
      { school: '서울대학교', degree: '경영학 석사', year: '1995' },
      { school: '서울대학교', degree: '경영학 학사', year: '1993' },
    ],
    biography: '서한에프앤씨에서 10년 이상 재직 중인 대표이사로, 회사의 전략 기획 및 경영 방향을 제시하고 있습니다. 업계에서 20년 이상의 경력을 바탕으로 회사의 성장을 이끌어왔습니다.',
    projects: ['2024년 경영 혁신 프로젝트', '해외 시장 진출 전략'],
    subordinates: [2, 3, 11, 18, 20],
    documents: [
      { id: 'doc-1', title: '2024년 경영계획.pdf', date: '2024-01-10' },
      { id: 'doc-2', title: '분기별 경영회의 안건.docx', date: '2024-03-21' },
    ],
    isManager: true,
  },
  {
    id: 2,
    name: '이영희',
    position: '이사',
    department: '영업',
    email: 'sales.director@seohanfnc.com',
    phone: '010-2345-6789',
    extension: '200',
    location: '본사 7층',
    avatar: '/images/avatars/avatar-2.jpg',
    joinDate: '2012-05-10',
    birthDate: '1975-09-22',
    address: '서울시 서초구',
    skills: ['영업관리', '협상', '고객관계관리'],
    education: [
      { school: '고려대학교', degree: '경영학 학사', year: '1998' },
    ],
    biography: '영업 부문을 총괄하는 이사로, 국내외 주요 고객사와의 관계 구축 및 영업 전략 수립을 담당하고 있습니다. 탁월한 협상 능력과 시장 분석 역량을 갖추고 있습니다.',
    projects: ['주요 고객사 유지 전략', '신규 거래처 발굴'],
    subordinates: [3, 4],
    documents: [
      { id: 'doc-3', title: '영업 실적 보고서.xlsx', date: '2024-03-15' },
    ],
    isManager: true,
  },
];

// 정적 생성을 위한 함수
export function generateStaticParams() {
  // 정적으로 생성할 멤버 ID 목록
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 서버에서 직원 정보 조회
  const { id: memberId } = await params;
  const id = Number(memberId);
  const initialMember = initialMembers.find(m => m.id === id);

  // 클라이언트 컴포넌트에 데이터 전달
  return <MemberDetailClient memberId={memberId} initialMember={initialMember} />;
} 