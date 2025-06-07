import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { safeReadJSON, safeWriteJSON } from '@/lib/file-lock';

const dbPath = path.join(process.cwd(), 'data/db/intranet-documents.json');
const uploadDir = path.join(process.cwd(), 'public/uploads/documents');

// 기본 데이터 구조
const defaultData = {
    documents: [],
    categories: [
        {
            id: "general",
            name: "일반 문서",
            description: "일반적인 업무 문서"
        },
        {
            id: "hr",
            name: "인사 관련",
            description: "인사 및 급여 관련 문서"
        },
        {
            id: "finance",
            name: "재무 관련",
            description: "재무 및 회계 관련 문서"
        },
        {
            id: "project",
            name: "프로젝트",
            description: "프로젝트 관련 문서"
        },
        {
            id: "manual",
            name: "매뉴얼",
            description: "업무 매뉴얼 및 가이드"
        }
    ],
    metadata: {
        lastId: 0,
        totalDocuments: 0,
        totalSize: 0,
        lastUpdated: new Date().toISOString()
    }
};

// [TRISID] 파일 업로드 API
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;

        if (!file || !title || !category) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 파일 크기 제한 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: '파일 크기는 10MB를 초과할 수 없습니다.' },
                { status: 400 }
            );
        }

        // 업로드 디렉토리 확인 및 생성
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // 파일명 생성 (타임스탬프 + 원본 파일명)
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        const fileUrl = `/uploads/documents/${fileName}`;

        // 파일 저장
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(filePath, buffer);

        // 데이터베이스에 문서 정보 저장
        const data = await safeReadJSON(dbPath, defaultData) as any;
        const newId = (data.metadata?.lastId || 0) + 1;

        const newDocument = {
            id: `doc-${newId}`,
            title,
            description: description || '',
            category,
            fileName: file.name,
            fileSize: file.size,
            fileUrl,
            uploadedBy: {
                id: "current-user",
                name: "현재 사용자", // TODO: 실제 사용자 정보로 대체
                position: "직책",
                department: "부서"
            },
            downloads: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!data.documents) data.documents = [];
        data.documents.push(newDocument);
        
        if (!data.metadata) data.metadata = defaultData.metadata;
        data.metadata.lastId = newId;
        data.metadata.totalDocuments = data.documents.length;
        data.metadata.totalSize = (data.metadata.totalSize || 0) + file.size;
        data.metadata.lastUpdated = new Date().toISOString();

        await safeWriteJSON(dbPath, data);

        return NextResponse.json({
            success: true,
            document: newDocument,
            message: '파일이 성공적으로 업로드되었습니다.'
        });

    } catch (error) {
        console.error('[TRISID] 파일 업로드 오류:', error);
        return NextResponse.json(
            { success: false, error: '파일 업로드에 실패했습니다.' },
            { status: 500 }
        );
    }
} 