'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Building,
    Calendar,
    User,
    MessageSquare,
    FileText,
    Award,
    Users,
    Briefcase,
    Clock,
    Smartphone,
    Edit,
    Download,
    ChevronRight
} from 'lucide-react';

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

// 직급별 색상
const positionColors: Record<string, string> = {
    '대표이사': 'bg-red-100 text-red-800',
    '이사': 'bg-orange-100 text-orange-800',
    '부장': 'bg-blue-100 text-blue-800',
    '차장': 'bg-indigo-100 text-indigo-800',
    '과장': 'bg-green-100 text-green-800',
    '대리': 'bg-yellow-100 text-yellow-800',
    '사원': 'bg-purple-100 text-purple-800',
    'default': 'bg-gray-100 text-gray-800',
};

// 부서별 색상
const departmentColors: Record<string, string> = {
    '경영지원': 'bg-blue-100 text-blue-800',
    '영업': 'bg-green-100 text-green-800',
    '마케팅': 'bg-purple-100 text-purple-800',
    '개발': 'bg-indigo-100 text-indigo-800',
    '인사': 'bg-pink-100 text-pink-800',
    '생산': 'bg-yellow-100 text-yellow-800',
    '품질관리': 'bg-cyan-100 text-cyan-800',
    '재무': 'bg-amber-100 text-amber-800',
    '구매': 'bg-emerald-100 text-emerald-800',
    'default': 'bg-gray-100 text-gray-800',
};

interface MemberDetailClientProps {
    memberId: string;
    initialMember?: any;
}

export default function MemberDetailClient({ memberId, initialMember }: MemberDetailClientProps) {
    const params = useParams();
    const router = useRouter();
    const [member, setMember] = useState<any>(initialMember || null);
    const [loading, setLoading] = useState(!initialMember);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'projects'>('overview');
    const [showContactForm, setShowContactForm] = useState(false);
    const [message, setMessage] = useState('');

    // ID로 직원 찾기 (실제로는 API 호출)
    useEffect(() => {
        if (initialMember) {
            setMember(initialMember);
            setLoading(false);
            return;
        }

        try {
            const id = Number(memberId || params.id);

            // 서버에서 직원 정보 조회
            const foundMember = initialMembers.find(m => m.id === id);

            if (foundMember) {
                setMember(foundMember);
            } else {
                setError('요청하신 직원 정보를 찾을 수 없습니다.');
            }

            setLoading(false);
        } catch (err) {
            setError('직원 정보를 불러오는 중 오류가 발생했습니다.');
            setLoading(false);
        }
    }, [memberId, params.id, initialMember]);

    // 메시지 전송 핸들러
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        // 실제 구현에서는 API 호출로 메시지 전송
        alert(`${member.name}에게 메시지를 전송했습니다.`);
        setMessage('');
        setShowContactForm(false);
    };

    // 아바타가 없는 경우 기본 이미지 및 이니셜 표시
    const renderAvatar = () => {
        if (member.avatar) {
            try {
                return (
                    <div className="relative w-full h-full">
                        <Image
                            src={member.avatar}
                            alt={`${member.name} 프로필 사진`}
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>
                );
            } catch (error) {
                // 이미지 로드 실패 시 이니셜 표시
                const initials = member.name.charAt(0);
                return (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full text-3xl font-semibold text-gray-600 dark:text-gray-300">
                        {initials}
                    </div>
                );
            }
        } else {
            // 아바타가 없는 경우 이니셜 표시
            const initials = member.name.charAt(0);
            return (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full text-3xl font-semibold text-gray-600 dark:text-gray-300">
                    {initials}
                </div>
            );
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="flex items-center">
                        <div className="h-24 w-24 bg-gray-700 rounded-full mb-4"></div>
                        <div className="ml-6 space-y-3 flex-1">
                            <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-lg text-gray-400 mb-6">{error || '직원 정보를 찾을 수 없습니다.'}</p>
                <Link href="/intranet/members" className="inline-block text-blue-500 hover:text-blue-400">
                    임직원 목록으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
                <Link
                    href="/intranet/members"
                    className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    임직원 목록으로
                </Link>
            </div>
            {/* 프로필 요약 */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="relative w-32 h-32 mb-4 md:mb-0 md:mr-6">
                        {renderAvatar()}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h1 className="text-2xl font-bold text-white">{member.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${positionColors[member.position] || positionColors.default
                                    }`}>
                                    {member.position}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${departmentColors[member.department] || departmentColors.default
                                    }`}>
                                    {member.department}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">{member.biography}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{member.email}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <Building className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>내선번호: {member.extension}</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                <span>{member.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col md:flex-row gap-2 md:self-start">
                        <button
                            onClick={() => setShowContactForm(!showContactForm)}
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            메시지 보내기
                        </button>

                        <Link
                            href={`/intranet/members/${member.id}/edit`}
                            className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            <Edit className="h-4 w-4 mr-1.5" />
                            프로필 편집
                        </Link>
                    </div>
                </div>

                {/* 메시지 전송 폼 */}
                {showContactForm && (
                    <div className="mt-6 bg-gray-750 rounded-md p-4">
                        <h3 className="text-lg font-medium text-white mb-4">
                            {member.name}에게 메시지 보내기
                        </h3>
                        <form onSubmit={handleSendMessage}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                            ></textarea>
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowContactForm(false)}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                    disabled={!message.trim()}
                                >
                                    전송
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            {/* 탭 메뉴 */}
            <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            }`}
                    >
                        기본 정보
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            }`}
                    >
                        담당 문서
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'projects'
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                            }`}
                    >
                        담당 프로젝트
                    </button>
                </nav>
            </div>
            {/* 기본 정보 탭 */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 개인 정보 섹션 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2 text-gray-400" />
                            개인 정보
                        </h3>

                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-400">이름</dt>
                                <dd className="mt-1 text-sm text-white">{member.name}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">직급</dt>
                                <dd className="mt-1 text-sm text-white">{member.position}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">부서</dt>
                                <dd className="mt-1 text-sm text-white">{member.department}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">입사일</dt>
                                <dd className="mt-1 text-sm text-white">{formatDate(member.joinDate)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">생년월일</dt>
                                <dd className="mt-1 text-sm text-white">{formatDate(member.birthDate)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">주소</dt>
                                <dd className="mt-1 text-sm text-white">{member.address}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* 연락처 정보 섹션 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-gray-400" />
                            연락처 정보
                        </h3>

                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-400">이메일</dt>
                                <dd className="mt-1 text-sm text-white">{member.email}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">휴대전화</dt>
                                <dd className="mt-1 text-sm text-white">{member.phone}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">내선번호</dt>
                                <dd className="mt-1 text-sm text-white">{member.extension}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-400">근무 위치</dt>
                                <dd className="mt-1 text-sm text-white">{member.location}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* 역량 및 기술 섹션 */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-gray-400" />
                            역량 및 기술
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-2">보유 기술</h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.skills.map((skill: string, index: number) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-2">학력</h4>
                                <ul className="space-y-2">
                                    {member.education.map((edu: any, index: number) => (
                                        <li key={index} className="text-sm text-white">
                                            <div className="font-medium">{edu.school}</div>
                                            <div className="text-gray-400">{edu.degree}, {edu.year}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 조직 정보 섹션 */}
                    {member.subordinates && member.subordinates.length > 0 && (
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-gray-400" />
                                조직 정보
                            </h3>

                            <div>
                                <h4 className="text-sm font-medium text-gray-400 mb-2">부서원 ({member.subordinates.length}명)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {member.subordinates.map((id: number) => {
                                        const subordinate = initialMembers.find(m => m.id === id);
                                        return subordinate ? (
                                            <Link
                                                key={id}
                                                href={`/intranet/members/${id}`}
                                                className="flex items-center p-2 bg-gray-750 rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="relative w-8 h-8 mr-2 rounded-full overflow-hidden">
                                                    {subordinate.avatar ? (
                                                        <Image
                                                            src={subordinate.avatar}
                                                            alt={subordinate.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full bg-gray-600 text-white text-sm font-semibold">
                                                            {subordinate.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-white">{subordinate.name}</div>
                                                    <div className="text-xs text-gray-400">{subordinate.position}</div>
                                                </div>
                                            </Link>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* 담당 문서 탭 */}
            {activeTab === 'documents' && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-gray-400" />
                        담당 문서
                    </h3>

                    <div className="space-y-4">
                        {member.documents && member.documents.length > 0 ? (
                            <ul className="divide-y divide-gray-700">
                                {member.documents.map((doc: any) => (
                                    <li key={doc.id} className="py-4 first:pt-0 last:pb-0">
                                        <Link
                                            href={`/intranet/documents/${doc.id}`}
                                            className="flex justify-between items-center hover:bg-gray-750 p-2 rounded-md transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-white">{doc.title}</p>
                                                    <p className="text-xs text-gray-400">{formatDate(doc.date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Download className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-4">담당 문서가 없습니다.</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <Link
                            href="/intranet/documents"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                        >
                            전체 문서함 보기
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                </div>
            )}
            {/* 담당 프로젝트 탭 */}
            {activeTab === 'projects' && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                        담당 프로젝트
                    </h3>

                    <div className="space-y-4">
                        {member.projects && member.projects.length > 0 ? (
                            <ul className="space-y-4">
                                {member.projects.map((project: string, index: number) => (
                                    <li
                                        key={index}
                                        className="bg-gray-750 p-4 rounded-md"
                                    >
                                        <h4 className="text-white font-medium mb-2">{project}</h4>
                                        <div className="flex items-center text-sm text-gray-400">
                                            <Calendar className="h-4 w-4 mr-1.5" />
                                            <span>진행 중</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-4">담당 프로젝트가 없습니다.</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <Link
                            href="/intranet/projects"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                        >
                            전체 프로젝트 보기
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
} 