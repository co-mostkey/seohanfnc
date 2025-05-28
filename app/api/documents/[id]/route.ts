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

        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalApprovalDocuments = data.approvalDocuments.length;
        data.metadata.totalGeneralDocuments = data.generalDocuments.length;
        data.metadata.totalDownloads = data.approvalDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0) +
            data.generalDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0);

        fs.writeFileSync(documentsPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('문서 데이터 저장 실패:', error);
        throw error;
    }
}

// 문서 찾기 함수
function findDocument(documentsData: DocumentsData, documentId: string): { document: Document | null, type: 'approval' | 'general' | null, index: number } {
    // 승인서류에서 찾기
    let index = documentsData.approvalDocuments.findIndex(doc => doc.id === documentId);
    if (index !== -1) {
        return { document: documentsData.approvalDocuments[index], type: 'approval', index };
    }

    // 일반자료에서 찾기
    index = documentsData.generalDocuments.findIndex(doc => doc.id === documentId);
    if (index !== -1) {
        return { document: documentsData.generalDocuments[index], type: 'general', index };
    }

    return { document: null, type: null, index: -1 };
}

// GET: 특정 문서 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const documentsData = loadDocuments();

        const { document } = findDocument(documentsData, id);

        if (!document) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        if (!document.isPublic) {
            return NextResponse.json(
                { success: false, error: '접근 권한이 없습니다.' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error('문서 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '문서 조회에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// PUT: 문서 수정 (관리자 전용)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const documentsData = loadDocuments();
        const { document, type, index } = findDocument(documentsData, id);

        if (!document || type === null || index === -1) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 문서 업데이트
        const updatedDocument: Document = {
            ...document,
            ...body,
            id: document.id, // ID는 변경 불가
            lastModified: new Date().toISOString().split('T')[0]
        };

        // 해당 타입의 배열에서 문서 업데이트
        if (type === 'approval') {
            documentsData.approvalDocuments[index] = updatedDocument;
        } else {
            documentsData.generalDocuments[index] = updatedDocument;
        }

        // 메타데이터 업데이트
        documentsData.metadata.lastUpdated = new Date().toISOString();

        // 데이터 저장
        saveDocuments(documentsData);

        return NextResponse.json({
            success: true,
            data: updatedDocument,
            message: '문서가 성공적으로 수정되었습니다.'
        });

    } catch (error) {
        console.error('문서 수정 실패:', error);
        return NextResponse.json(
            { success: false, error: '문서 수정에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 문서 삭제 (관리자 전용)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const documentsData = loadDocuments();
        const { document, type, index } = findDocument(documentsData, id);

        if (!document || type === null || index === -1) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 해당 타입의 배열에서 문서 삭제
        if (type === 'approval') {
            documentsData.approvalDocuments.splice(index, 1);
            documentsData.metadata.totalApprovalDocuments--;
        } else {
            documentsData.generalDocuments.splice(index, 1);
            documentsData.metadata.totalGeneralDocuments--;
        }

        // 메타데이터 업데이트
        documentsData.metadata.lastUpdated = new Date().toISOString();

        // 데이터 저장
        saveDocuments(documentsData);

        return NextResponse.json({
            success: true,
            message: '문서가 성공적으로 삭제되었습니다.'
        });

    } catch (error) {
        console.error('문서 삭제 실패:', error);
        return NextResponse.json(
            { success: false, error: '문서 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// PATCH: 다운로드 카운트 증가
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;

        if (action !== 'download') {
            return NextResponse.json(
                { success: false, error: '잘못된 액션입니다.' },
                { status: 400 }
            );
        }

        const documentsData = loadDocuments();
        const { document, type, index } = findDocument(documentsData, id);

        if (!document || type === null || index === -1) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 다운로드 카운트 증가
        const updatedDocument = { ...document, downloadCount: document.downloadCount + 1 };

        // 해당 타입의 배열에서 문서 업데이트
        if (type === 'approval') {
            documentsData.approvalDocuments[index] = updatedDocument;
        } else {
            documentsData.generalDocuments[index] = updatedDocument;
        }

        // 전체 다운로드 카운트 증가
        documentsData.metadata.totalDownloads++;
        documentsData.metadata.lastUpdated = new Date().toISOString();

        // 데이터 저장
        saveDocuments(documentsData);

        return NextResponse.json({
            success: true,
            data: { downloadCount: updatedDocument.downloadCount },
            message: '다운로드 카운트가 업데이트되었습니다.'
        });

    } catch (error) {
        console.error('다운로드 카운트 업데이트 실패:', error);
        return NextResponse.json(
            { success: false, error: '다운로드 카운트 업데이트에 실패했습니다.' },
            { status: 500 }
        );
    }
} 