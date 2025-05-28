'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Bell,
    Calendar,
    Download,
    Eye,
    FileText,
    Info,
    MessageSquare,
    Printer,
    Share2,
    Users,
    ThumbsUp,
    User,
    Tag,
    Pin,
    FileImage,
    Clock,
    Edit,
    MoreHorizontal,
    CircleAlert,
    Send
} from 'lucide-react';
import Image from 'next/image';

// 카테고리 색상 매핑
const categoryColors: Record<string, string> = {
    '회사소식': 'bg-blue-900 text-blue-200',
    '인사': 'bg-purple-900 text-purple-200',
    '교육': 'bg-green-900 text-green-200',
    '사내 활동': 'bg-yellow-900 text-yellow-200',
    '시설': 'bg-indigo-900 text-indigo-200',
    'default': 'bg-gray-700 text-gray-300',
};

// 상대적 날짜 계산 함수
const getRelativeTimeString = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 30) {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('ko-KR', options);
    } else if (diffInDays > 0) {
        return `${diffInDays}일 전`;
    } else if (diffInHours > 0) {
        return `${diffInHours}시간 전`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}분 전`;
    } else {
        return '방금 전';
    }
};

// 파일 타입 아이콘
const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    const iconClass = "h-5 w-5 mr-2";

    if (['pdf'].includes(extension)) {
        return <FileText className={`${iconClass} text-red-400`} />;
    } else if (['doc', 'docx'].includes(extension)) {
        return <FileText className={`${iconClass} text-blue-400`} />;
    } else if (['xls', 'xlsx'].includes(extension)) {
        return <FileText className={`${iconClass} text-green-400`} />;
    } else if (['ppt', 'pptx'].includes(extension)) {
        return <FileText className={`${iconClass} text-orange-400`} />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return <FileImage className={`${iconClass} text-purple-400`} />;
    }

    return <FileText className={`${iconClass} text-gray-400`} />;
};

interface NoticeDetailClientProps {
    noticeId: string;
    initialNotice?: any;
    noticesData: any[];
}

export default function NoticeDetailClient({ noticeId, initialNotice, noticesData }: NoticeDetailClientProps) {
    const router = useRouter();
    const params = useParams();
    const [notice, setNotice] = useState<any>(initialNotice || null);
    const [loading, setLoading] = useState(!initialNotice);
    const [error, setError] = useState<string | null>(null);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [newComment, setNewComment] = useState('');

    // ID로 공지사항 찾기 (초기 데이터가 없을 경우)
    useEffect(() => {
        if (initialNotice) {
            setNotice(initialNotice);
            setLoading(false);
            return;
        }

        try {
            // 실제 구현에서는 API 호출
            const id = noticeId || (params?.id as string);

            // 서버에서 공지사항 조회
            const foundNotice = noticesData.find(n => n.id === id);

            if (foundNotice) {
                setNotice(foundNotice);
                // 실제 구현시에는 여기서 조회수 증가 API 호출
            } else {
                // 찾지 못한 경우 리스트로 이동
                setError('요청하신 공지사항을 찾을 수 없습니다.');
            }

            setLoading(false);
        } catch (err) {
            setError('공지사항을 불러오는 중 오류가 발생했습니다.');
            setLoading(false);
        }
    }, [noticeId, initialNotice, params.id, noticesData]);

    // 좋아요 토글
    const handleLike = () => {
        if (liked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setLiked(!liked);
        // 실제 구현에서는 API 호출로 좋아요 상태 업데이트
    };

    // 댓글 추가
    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        // 실제 구현시 API 호출로 댓글 등록
        if (notice) {
            const newCommentObj = {
                id: notice.comments.length + 1,
                author: '홍길동', // 현재 로그인 사용자 이름
                department: '경영지원팀', // 현재 로그인 사용자 부서
                content: newComment,
                createdAt: new Date().toLocaleString('ko-KR')
            };

            setNotice({
                ...notice,
                comments: [...notice.comments, newCommentObj]
            });

            setNewComment('');
        }
    };

    // 인쇄하기
    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !notice) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-lg text-gray-400 mb-6">{error || '공지사항을 찾을 수 없습니다.'}</p>
                <Link href="/intranet/notices" className="inline-block text-blue-500 hover:text-blue-400">
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    const categoryColor = categoryColors[notice.category] || categoryColors.default;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* 헤더 */}
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <Link
                        href="/intranet/notices"
                        className="inline-flex items-center text-gray-400 hover:text-white mr-3"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        <span>공지사항 목록</span>
                    </Link>
                    <div className="h-6 border-l border-gray-700 mr-3"></div>
                    <div className="flex space-x-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10 ${categoryColor}`}>
                            {notice.category}
                        </span>
                        {notice.isImportant && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                <CircleAlert className="h-3.5 w-3.5 mr-1" />
                                중요
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {/* 공지사항 상세 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-white break-words">{notice.title}</h1>
                            <div className="flex items-center mt-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                                    {notice.author.avatar ? (
                                        <Image
                                            src={notice.author.avatar}
                                            alt={notice.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-600 text-white text-sm font-semibold">
                                            {notice.author.name ? notice.author.name.charAt(0) : notice.author.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-white">
                                        {notice.author.name || notice.author}
                                        {notice.author.position && (
                                            <span className="text-gray-400">
                                                ({notice.author.position}, {notice.author.department || notice.department})
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{getRelativeTimeString(notice.createdAt)}</span>
                                        <span className="mx-2">•</span>
                                        <Eye className="h-4 w-4 mr-1" />
                                        <span>{notice.views} 조회</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <Link
                                href={`/intranet/notices/${notice.id}/edit`}
                                className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                            >
                                <Edit className="h-4 w-4 mr-1.5" />
                                편집
                            </Link>
                            <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* 공지사항 내용 */}
                    <div
                        className="prose prose-invert max-w-none mt-6 border-t border-gray-700 pt-6"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                    ></div>

                    {/* 첨부파일 */}
                    {notice.attachments && notice.attachments.length > 0 && (
                        <div className="mt-8 border-t border-gray-700 pt-6">
                            <h3 className="text-lg font-medium text-white mb-4">첨부파일</h3>
                            <div className="space-y-3">
                                {notice.attachments.map((file: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-750 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex items-center justify-center">
                                                {getFileIcon(file.fileName)}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-white">{file.fileName}</p>
                                                <p className="text-xs text-gray-400">{file.fileSize}</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                            <Download className="h-4 w-4 mr-1.5" />
                                            다운로드
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 상호작용 버튼 */}
                    <div className="flex justify-center mt-8 border-t border-gray-700 pt-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={handleLike}
                                className={`inline-flex items-center px-4 py-2 rounded-md ${liked
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                <ThumbsUp className="h-5 w-5 mr-2" />
                                {liked ? '좋아요 취소' : '좋아요'}
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                                <Share2 className="h-5 w-5 mr-2" />
                                공유하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 댓글 섹션 */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">댓글 {notice.comments.length}개</h3>

                {/* 댓글 입력 */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <form onSubmit={handleAddComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                        ></textarea>
                        <div className="flex justify-end mt-3">
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className={`inline-flex items-center px-4 py-2 rounded-md ${newComment.trim()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="h-4 w-4 mr-1.5" />
                                댓글 작성
                            </button>
                        </div>
                    </form>
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-6">
                    {notice.comments && notice.comments.map((comment: any) => (
                        <div
                            key={comment.id}
                            className="bg-gray-800 rounded-lg p-4"
                        >
                            <div className="flex justify-between">
                                <div className="flex items-start">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                                        {comment.author.avatar ? (
                                            <Image
                                                src={comment.author.avatar}
                                                alt={comment.author.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-600 text-white text-sm font-semibold">
                                                {typeof comment.author === 'string' ? comment.author.charAt(0) : comment.author.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <p className="text-white font-medium">
                                                {typeof comment.author === 'string' ? comment.author : comment.author.name}
                                            </p>
                                            <span className="text-gray-400 text-sm ml-2">
                                                {comment.department}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-xs flex items-center mt-0.5">
                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                            {getRelativeTimeString(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <button className="text-gray-400 hover:text-gray-300">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-3 pl-13">
                                <p className="text-white">{comment.content}</p>

                                <div className="flex items-center mt-3">
                                    <button className="inline-flex items-center text-gray-400 hover:text-blue-400">
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        <span>좋아요</span>
                                        {comment.likes > 0 && (
                                            <span className="ml-1 text-blue-400">({comment.likes})</span>
                                        )}
                                    </button>
                                    <button className="inline-flex items-center text-gray-400 hover:text-gray-300 ml-4">
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        <span>답글</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* 이전/다음 공지 */}
            <div className="mt-8 border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href={`/intranet/notices/${parseInt(notice.id) > 1 ? parseInt(notice.id) - 1 : notice.id}`}
                        className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                            <p className="text-sm text-gray-400">이전 공지</p>
                            <p className="text-white font-medium">
                                {parseInt(notice.id) > 1 ? noticesData[parseInt(notice.id) - 2].title : '이전 공지가 없습니다'}
                            </p>
                        </div>
                    </Link>

                    <Link
                        href={`/intranet/notices/${parseInt(notice.id) < noticesData.length ? parseInt(notice.id) + 1 : notice.id}`}
                        className="flex items-center justify-end p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                        <div className="text-right">
                            <p className="text-sm text-gray-400">다음 공지</p>
                            <p className="text-white font-medium">
                                {parseInt(notice.id) < noticesData.length ? noticesData[parseInt(notice.id)].title : '다음 공지가 없습니다'}
                            </p>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400 ml-3 transform rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
} 