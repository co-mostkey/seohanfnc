"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Save,
    X,
    ArrowLeft,
    Pin,
    Eye,
    Lock,
    Tag,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { Post } from '@/types/post';
import { getBoardCategories } from '@/data/board-data';

// 게시물 데이터 업데이트 함수
const updatePostData = async (id: string, data: any) => {
    try {
        const response = await fetch(`/api/admin/posts?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '게시물 업데이트 중 오류가 발생했습니다.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('게시물 업데이트 중 오류:', error);
        throw error;
    }
};

interface PostEditFormProps {
    initialPost: Post;
    postId: string;
}

export function PostEditForm({ initialPost, postId }: PostEditFormProps) {
    const router = useRouter();
    const [boardCategories, setBoardCategories] = useState<any[]>([]);

    // 게시물 상태 관리
    const [formData, setFormData] = useState({
        boardId: initialPost.boardId || '',
        title: {
            ko: typeof initialPost.title === 'string' ? initialPost.title : ((initialPost.title as any)?.ko || ''),
            en: typeof initialPost.title === 'object' ? ((initialPost.title as any)?.en || '') : '',
            cn: typeof initialPost.title === 'object' ? ((initialPost.title as any)?.cn || '') : '',
        } as { ko: string; en: string; cn: string },
        content: {
            ko: typeof initialPost.content === 'string' ? initialPost.content : ((initialPost.content as any)?.ko || ''),
            en: typeof initialPost.content === 'object' ? ((initialPost.content as any)?.en || '') : '',
            cn: typeof initialPost.content === 'object' ? ((initialPost.content as any)?.cn || '') : '',
        } as { ko: string; en: string; cn: string },
        category: initialPost.category || '',
        isNotice: initialPost.isNotice || false,
        isSecret: initialPost.isSecret || false,
        tags: Array.isArray(initialPost.tags) ? initialPost.tags.join(', ') : (initialPost.tags || ''),
        status: initialPost.status || 'published',
    });

    const [activeTab, setActiveTab] = useState('ko');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 게시판 카테고리 로드
    useEffect(() => {
        const loadCategories = () => {
            const categories = getBoardCategories();
            setBoardCategories(categories);
        };
        loadCategories();
    }, []);

    // 입력 필드 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [field, lang] = name.split('.');
            if (field === 'title' || field === 'content') {
                setFormData((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [lang]: value,
                    },
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // 체크박스 변경 핸들러
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            (!formData.title.ko || formData.title.ko.trim() === '') &&
            (!formData.title.en || formData.title.en.trim() === '') &&
            (!formData.title.cn || formData.title.cn.trim() === '')
        ) {
            toast.error('최소 하나의 언어로 제목을 입력해주세요.');
            return;
        }

        if (
            (!formData.content.ko || formData.content.ko.trim() === '') &&
            (!formData.content.en || formData.content.en.trim() === '') &&
            (!formData.content.cn || formData.content.cn.trim() === '')
        ) {
            toast.error('최소 하나의 언어로 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 태그 처리
            const processedTags = formData.tags
                ? typeof formData.tags === 'string'
                    ? formData.tags.split(',').map(tag => tag.trim())
                    : formData.tags
                : [];

            // 수정할 데이터
            const postData = {
                ...formData,
                tags: processedTags,
            };

            await updatePostData(postId, postData);

            toast.success('게시물이 성공적으로 수정되었습니다.');
            router.push(`/admin/posts?board=${formData.boardId}`);
        } catch (error) {
            console.error('게시물 수정 중 오류 발생:', error);
            toast.error(error instanceof Error ? error.message : '게시물 수정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        router.push(`/admin/posts?board=${formData.boardId}`);
    };

    return (
        <div className="bg-gray-900 text-white">
            {/* 헤더 */}
            <header className="bg-gray-950 border-b border-gray-800 p-4 sticky top-0 z-10">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">게시물 수정</h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                            disabled={isSubmitting}
                        >
                            <X className="h-4 w-4 mr-1.5" />
                            취소
                        </button>
                        <button
                            type="submit"
                            form="postEditForm"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
                            disabled={isSubmitting}
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            {isSubmitting ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </div>
            </header>
            {/* 메인 콘텐츠 */}
            <main className="container mx-auto p-4 my-6">
                {/* 네비게이션 */}
                <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-400 mb-6">
                        <Link
                            href={`/admin/posts?board=${formData.boardId}`}
                            className="hover:text-white transition-colors flex items-center"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            게시판으로 돌아가기
                        </Link>
                    </div>
                </div>

                {/* 게시물 수정 폼 */}
                <form id="postEditForm" onSubmit={handleSubmit} className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
                    {/* 기본 정보 */}
                    <div className="p-6 border-b border-gray-800">
                        {/* 게시판 선택 */}
                        <div className="mb-4">
                            <label htmlFor="boardId" className="block text-sm font-medium text-gray-300 mb-2">
                                게시판
                            </label>
                            <select
                                id="boardId"
                                name="boardId"
                                value={formData.boardId}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled
                            >
                                {boardCategories.map((board) => (
                                    <option key={board.id} value={board.id}>
                                        {board.name.ko || board.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 제목 탭 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                제목
                            </label>
                            <div className="mb-2 border-b border-gray-700">
                                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                                    <li className="mr-2">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('ko')}
                                            className={`inline-block p-2 border-b-2 rounded-t-lg ${activeTab === 'ko'
                                                ? 'border-blue-500 text-blue-500'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                                }`}
                                        >
                                            한국어
                                        </button>
                                    </li>
                                    <li className="mr-2">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('en')}
                                            className={`inline-block p-2 border-b-2 rounded-t-lg ${activeTab === 'en'
                                                ? 'border-blue-500 text-blue-500'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                                }`}
                                        >
                                            영어
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('cn')}
                                            className={`inline-block p-2 border-b-2 rounded-t-lg ${activeTab === 'cn'
                                                ? 'border-blue-500 text-blue-500'
                                                : 'border-transparent text-gray-400 hover:text-gray-300'
                                                }`}
                                        >
                                            중국어
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            {activeTab === 'ko' && (
                                <input
                                    type="text"
                                    id="title.ko"
                                    name="title.ko"
                                    value={formData.title.ko || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="한국어 제목을 입력하세요"
                                />
                            )}
                            {activeTab === 'en' && (
                                <input
                                    type="text"
                                    id="title.en"
                                    name="title.en"
                                    value={formData.title.en || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="영어 제목을 입력하세요"
                                />
                            )}
                            {activeTab === 'cn' && (
                                <input
                                    type="text"
                                    id="title.cn"
                                    name="title.cn"
                                    value={formData.title.cn || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="중국어 제목을 입력하세요"
                                />
                            )}
                        </div>

                        {/* 옵션 설정 */}
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 카테고리 입력 */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                    카테고리
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="카테고리 입력 (선택사항)"
                                />
                            </div>

                            {/* 태그 입력 */}
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                    태그
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="태그를 쉼표로 구분하여 입력 (선택사항)"
                                />
                            </div>
                        </div>

                        {/* 상태 설정 */}
                        <div className="flex flex-wrap gap-4">
                            {/* 공지사항 여부 */}
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isNotice"
                                    checked={formData.isNotice}
                                    onChange={handleCheckboxChange}
                                    className="sr-only"
                                />
                                <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${formData.isNotice ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 transition-transform duration-200 ease-linear transform bg-white rounded-full ${formData.isNotice ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-300 flex items-center">
                                    <Pin className={`h-4 w-4 mr-1 ${formData.isNotice ? 'text-blue-400' : 'text-gray-500'}`} />
                                    공지사항으로 설정
                                </span>
                            </label>

                            {/* 비밀글 여부 */}
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isSecret"
                                    checked={formData.isSecret}
                                    onChange={handleCheckboxChange}
                                    className="sr-only"
                                />
                                <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${formData.isSecret ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 transition-transform duration-200 ease-linear transform bg-white rounded-full ${formData.isSecret ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-300 flex items-center">
                                    <Lock className={`h-4 w-4 mr-1 ${formData.isSecret ? 'text-blue-400' : 'text-gray-500'}`} />
                                    비밀글로 설정
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* 내용 에디터 (탭) */}
                    <div className="p-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-300">내용</label>
                        </div>

                        {/* 내용 언어 탭 */}
                        <div className="mb-2 border-b border-gray-700">
                            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                                <li className="mr-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('ko')}
                                        className={`inline-block p-2 border-b-2 rounded-t-lg ${activeTab === 'ko'
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        한국어
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('en')}
                                        className={`inline-block p-2 border-b-2 rounded-t-lg ${activeTab === 'en'
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        영어
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('cn')}
                                        className={`inline-block p-2 border-b-2 rounded-t-lg ${activeTab === 'cn'
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        중국어
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* 내용 입력 영역 */}
                        {activeTab === 'ko' && (
                            <textarea
                                id="content.ko"
                                name="content.ko"
                                value={formData.content.ko || ''}
                                onChange={handleInputChange}
                                className="w-full min-h-[400px] bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="한국어 내용을 입력하세요..."
                            />
                        )}
                        {activeTab === 'en' && (
                            <textarea
                                id="content.en"
                                name="content.en"
                                value={formData.content.en || ''}
                                onChange={handleInputChange}
                                className="w-full min-h-[400px] bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="영어 내용을 입력하세요..."
                            />
                        )}
                        {activeTab === 'cn' && (
                            <textarea
                                id="content.cn"
                                name="content.cn"
                                value={formData.content.cn || ''}
                                onChange={handleInputChange}
                                className="w-full min-h-[400px] bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="중국어 내용을 입력하세요..."
                            />
                        )}
                    </div>

                    {/* 작업 버튼 (하단) */}
                    <div className="bg-gray-900 border-t border-gray-800 p-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors mr-2"
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors flex items-center"
                            disabled={isSubmitting}
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            {isSubmitting ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
} 