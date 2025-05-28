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

// GET: 파일 다운로드
export async function GET(
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

        // 공개 문서가 아닌 경우 권한 확인 (추후 인증 시스템과 연동)
        if (!document.isPublic) {
            return NextResponse.json(
                { success: false, error: '접근 권한이 없습니다.' },
                { status: 403 }
            );
        }

        // 실제 파일 경로 확인
        let actualFilePath: string;

        // filePath가 /uploads로 시작하는 경우 (실제 업로드된 파일)
        if (document.filePath.startsWith('/uploads')) {
            actualFilePath = path.join(process.cwd(), 'public', document.filePath);
        }
        // filePath가 /documents로 시작하는 경우 (기존 시뮬레이션 파일)
        else if (document.filePath.startsWith('/documents')) {
            // 실제 파일이 없는 경우 샘플 파일 경로로 대체
            actualFilePath = path.join(process.cwd(), 'public', 'sample-documents', document.fileName);
        }
        else {
            return NextResponse.json(
                { success: false, error: '파일 경로가 올바르지 않습니다.' },
                { status: 400 }
            );
        }

        // 파일 존재 확인
        if (!fs.existsSync(actualFilePath)) {
            console.error(`파일을 찾을 수 없습니다: ${actualFilePath}`);
            return NextResponse.json(
                { success: false, error: '파일을 찾을 수 없습니다.' },
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

        // 데이터 저장
        saveDocuments(documentsData);

        // 파일 읽기
        const fileBuffer = fs.readFileSync(actualFilePath);

        // 파일 타입에 따른 Content-Type 설정
        const getContentType = (fileType: string): string => {
            switch (fileType.toLowerCase()) {
                case 'pdf':
                    return 'application/pdf';
                case 'doc':
                    return 'application/msword';
                case 'docx':
                    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                case 'xls':
                    return 'application/vnd.ms-excel';
                case 'xlsx':
                    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                case 'ppt':
                    return 'application/vnd.ms-powerpoint';
                case 'pptx':
                    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                default:
                    return 'application/octet-stream';
            }
        };

        // 파일 다운로드 응답
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': getContentType(document.fileType),
                'Content-Disposition': `attachment; filename="${encodeURIComponent(document.fileName)}"`,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('파일 다운로드 실패:', error);
        return NextResponse.json(
            { success: false, error: '파일 다운로드에 실패했습니다.' },
            { status: 500 }
        );
    }
} 