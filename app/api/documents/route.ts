import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 문서 타입 정의
interface Document {
    id: string;
    title: string;
    description: string;
    category: string;
    fileType: string;
    fileName: string;
    filePath: string;
    fileSize: string;
    uploadDate: string;
    lastModified: string;
    isPublic: boolean;
    downloadCount: number;
    tags: string[];
    version: string;
}

interface DocumentsData {
    approvalDocuments: Document[];
    generalDocuments: Document[];
    categories: {
        approval: string[];
        general: string[];
    };
    metadata: {
        lastUpdated: string;
        totalApprovalDocuments: number;
        totalGeneralDocuments: number;
        totalDownloads: number;
    };
}

// 문서 데이터 로드 함수
function loadDocuments(): DocumentsData {
    try {
        const documentsPath = path.join(process.cwd(), 'data', 'db', 'documents.json');
        const documentsData = fs.readFileSync(documentsPath, 'utf8');
        return JSON.parse(documentsData);
    } catch (error) {
        console.error('문서 데이터 로드 실패:', error);
        return {
            approvalDocuments: [],
            generalDocuments: [],
            categories: { approval: [], general: [] },
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalApprovalDocuments: 0,
                totalGeneralDocuments: 0,
                totalDownloads: 0
            }
        };
    }
}

// 문서 데이터 저장 함수
function saveDocuments(data: DocumentsData): void {
    try {
        const documentsPath = path.join(process.cwd(), 'data', 'db', 'documents.json');
        fs.writeFileSync(documentsPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('문서 데이터 저장 실패:', error);
        throw error;
    }
}

// GET: 문서 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams?.get('type'); // 'approval' 또는 'general'
        const category = searchParams?.get('category');
        const search = searchParams?.get('search');
        const page = parseInt(searchParams?.get('page') || '1');
        const limit = parseInt(searchParams?.get('limit') || '10');

        const documentsData = loadDocuments();

        let documents: Document[] = [];

        // 문서 타입에 따라 데이터 선택
        if (type === 'approval') {
            documents = documentsData.approvalDocuments;
        } else if (type === 'general') {
            documents = documentsData.generalDocuments;
        } else {
            // 타입이 지정되지 않으면 모든 문서 반환
            documents = [...documentsData.approvalDocuments, ...documentsData.generalDocuments];
        }

        // 카테고리 필터링
        if (category) {
            documents = documents.filter(doc => doc.category === category);
        }

        // 검색 필터링
        if (search) {
            const searchLower = search.toLowerCase();
            documents = documents.filter(doc =>
                doc.title.toLowerCase().includes(searchLower) ||
                doc.description.toLowerCase().includes(searchLower) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // 공개 문서만 필터링 (관리자가 아닌 경우)
        documents = documents.filter(doc => doc.isPublic);

        // 프론트엔드에서 예상하는 형태로 변환
        const transformedDocuments = documents.map(doc => ({
            id: doc.id,
            title: doc.title,
            description: doc.description,
            category: doc.id.startsWith('approval-') ? 'approval' : 'general', // ID 기반으로 카테고리 결정
            tags: doc.tags,
            fileUrl: doc.filePath, // filePath를 fileUrl로 매핑
            fileName: doc.fileName,
            fileSize: parseFileSize(doc.fileSize), // 문자열을 숫자로 변환
            fileType: doc.fileType,
            version: doc.version,
            isPublic: doc.isPublic,
            downloadCount: doc.downloadCount,
            createdAt: doc.uploadDate + 'T00:00:00Z', // ISO 형태로 변환
            updatedAt: doc.lastModified + 'T00:00:00Z' // ISO 형태로 변환
        }));

        // 페이지네이션
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDocuments = transformedDocuments.slice(startIndex, endIndex);

        // 단순한 배열 형태로 반환 (관리자 페이지와 호환)
        if (searchParams?.get('simple') === 'true') {
            return NextResponse.json(transformedDocuments);
        }

        // 상세 정보와 함께 반환
        return NextResponse.json({
            success: true,
            data: {
                documents: paginatedDocuments,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(transformedDocuments.length / limit),
                    totalItems: transformedDocuments.length,
                    itemsPerPage: limit
                },
                categories: documentsData.categories,
                metadata: documentsData.metadata
            }
        });

    } catch (error) {
        console.error('문서 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '문서 조회에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// 파일 크기 문자열을 바이트로 변환하는 헬퍼 함수
function parseFileSize(sizeStr: string): number {
    const match = sizeStr.match(/^([\d.]+)\s*(KB|MB|GB)$/i);
    if (!match) return 0;

    const size = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
        case 'KB':
            return size * 1024;
        case 'MB':
            return size * 1024 * 1024;
        case 'GB':
            return size * 1024 * 1024 * 1024;
        default:
            return size;
    }
}

// POST: 새 문서 추가 (관리자 전용)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, document } = body;

        if (!type || !document) {
            return NextResponse.json(
                { success: false, error: '필수 데이터가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const documentsData = loadDocuments();

        // 새 문서 ID 생성
        const newId = `${type}-${String(Date.now()).slice(-6)}`;
        const newDocument: Document = {
            ...document,
            id: newId,
            uploadDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            downloadCount: 0
        };

        // 문서 타입에 따라 추가
        if (type === 'approval') {
            documentsData.approvalDocuments.push(newDocument);
            documentsData.metadata.totalApprovalDocuments++;
        } else if (type === 'general') {
            documentsData.generalDocuments.push(newDocument);
            documentsData.metadata.totalGeneralDocuments++;
        } else {
            return NextResponse.json(
                { success: false, error: '잘못된 문서 타입입니다.' },
                { status: 400 }
            );
        }

        // 메타데이터 업데이트
        documentsData.metadata.lastUpdated = new Date().toISOString();

        // 데이터 저장
        saveDocuments(documentsData);

        return NextResponse.json({
            success: true,
            data: newDocument,
            message: '문서가 성공적으로 추가되었습니다.'
        });

    } catch (error) {
        console.error('문서 추가 실패:', error);
        return NextResponse.json(
            { success: false, error: '문서 추가에 실패했습니다.' },
            { status: 500 }
        );
    }
} 