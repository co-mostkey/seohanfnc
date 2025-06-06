import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

const dbPath = path.join(process.cwd(), 'data/db/intranet-documents.json');

// 기본 데이터 구조
const defaultData = {
    documents: [],
    categories: [],
    metadata: {
        lastId: 0,
        totalDocuments: 0,
        totalSize: 0,
        lastUpdated: new Date().toISOString()
    }
};

// GET: 문서 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const data = await safeReadJSON(dbPath, defaultData) as any;
        let documents = data.documents || [];

        // 카테고리 필터링
        if (category && category !== 'all') {
            documents = documents.filter((doc: any) => doc.category === category);
        }

        // 검색 필터링
        if (search) {
            const searchLower = search.toLowerCase();
            documents = documents.filter((doc: any) =>
                doc.title.toLowerCase().includes(searchLower) ||
                doc.description?.toLowerCase().includes(searchLower)
            );
        }

        // 최신순 정렬
        documents.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({
            success: true,
            documents,
            categories: data.categories || []
        });
    } catch (error) {
        console.error('문서 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '문서 목록을 불러올 수 없습니다.' },
            { status: 500 }
        );
    }
}

// POST: 문서 추가
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, category, fileName, fileSize, fileUrl, uploadedBy } = body;

        if (!title || !category || !fileName || !fileUrl) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, defaultData) as any;
        const newId = (data.metadata.lastId || 0) + 1;

        const newDocument = {
            id: `doc-${newId}`,
            title,
            description: description || '',
            category,
            fileName,
            fileSize,
            fileUrl,
            uploadedBy,
            downloads: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.documents.push(newDocument);
        data.metadata.lastId = newId;
        data.metadata.totalDocuments = data.documents.length;
        data.metadata.totalSize += fileSize || 0;
        data.metadata.lastUpdated = new Date().toISOString();

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            document: newDocument
        });
    } catch (error) {
        console.error('문서 추가 오류:', error);
        return NextResponse.json(
            { success: false, error: '문서 추가에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 문서 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('id');

        if (!documentId) {
            return NextResponse.json(
                { success: false, error: '문서 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const data = await safeReadJSON(dbPath, defaultData) as any;
        const documentIndex = data.documents.findIndex((doc: any) => doc.id === documentId);

        if (documentIndex === -1) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedDoc = data.documents[documentIndex] as any;
        data.documents.splice(documentIndex, 1);

        data.metadata.totalDocuments = data.documents.length;
        data.metadata.totalSize -= deletedDoc.fileSize || 0;
        data.metadata.lastUpdated = new Date().toISOString();

        await safeWriteJSON(dbPath, data);

        // 실제 파일도 삭제 (선택사항)
        // TODO: 파일 시스템에서 실제 파일 삭제 로직 구현

        return NextResponse.json({
            success: true,
            message: '문서가 삭제되었습니다.'
        });
    } catch (error) {
        console.error('문서 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '문서 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
} 