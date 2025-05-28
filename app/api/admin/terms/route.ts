import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'db');
const termsFilePath = path.join(dataDir, 'terms.json');

interface Term {
    id: string;
    title: string;
    content: string;
    version: string;
    effectiveDate: string;
    lastUpdated: string;
    isRequired: boolean;
    isActive: boolean;
}

interface TermsData {
    terms: Record<string, Term>;
    metadata: {
        lastUpdated: string;
        totalTerms: number;
        activeTerms: number;
    };
}

// 약관 데이터 로드
async function loadTerms(): Promise<TermsData> {
    try {
        const content = await fs.readFile(termsFilePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('약관 데이터 로드 실패:', error);
        // 파일이 없으면 기본 구조 생성
        const defaultData: TermsData = {
            terms: {},
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalTerms: 0,
                activeTerms: 0
            }
        };
        await saveTerms(defaultData);
        return defaultData;
    }
}

// 약관 데이터 저장
async function saveTerms(data: TermsData): Promise<void> {
    try {
        // 메타데이터 업데이트
        data.metadata.lastUpdated = new Date().toISOString();
        data.metadata.totalTerms = Object.keys(data.terms).length;
        data.metadata.activeTerms = Object.values(data.terms).filter(term => term.isActive).length;

        await fs.writeFile(termsFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('약관 데이터 저장 실패:', error);
        throw new Error('약관 데이터 저장에 실패했습니다.');
    }
}

/**
 * GET - 약관 목록 조회
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const termId = searchParams?.get('id');
        const activeOnly = searchParams?.get('activeOnly') === 'true';

        const termsData = await loadTerms();

        // 특정 약관 조회
        if (termId) {
            const term = termsData.terms[termId];
            if (!term) {
                return NextResponse.json(
                    { success: false, error: '약관을 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                term,
                message: '약관을 성공적으로 불러왔습니다.'
            });
        }

        // 전체 약관 목록 조회
        let terms = Object.values(termsData.terms);

        // 활성 약관만 필터링
        if (activeOnly) {
            terms = terms.filter(term => term.isActive);
        }

        return NextResponse.json({
            success: true,
            terms,
            metadata: termsData.metadata,
            message: '약관 목록을 성공적으로 불러왔습니다.'
        });
    } catch (error) {
        console.error('약관 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '약관을 불러오는데 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * POST - 새 약관 추가
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            id,
            title,
            content,
            isRequired = false,
            isActive = true
        } = body;

        // 필수 필드 검증
        if (!id || !title || !content) {
            return NextResponse.json(
                { success: false, error: 'ID, 제목, 내용은 필수 입력 항목입니다.' },
                { status: 400 }
            );
        }

        const termsData = await loadTerms();

        // 중복 ID 확인
        if (termsData.terms[id]) {
            return NextResponse.json(
                { success: false, error: '이미 존재하는 약관 ID입니다.' },
                { status: 409 }
            );
        }

        // 새 약관 생성
        const newTerm: Term = {
            id: id.trim(),
            title: title.trim(),
            content: content.trim(),
            version: '1.0',
            effectiveDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            isRequired,
            isActive
        };

        termsData.terms[id] = newTerm;
        await saveTerms(termsData);

        return NextResponse.json({
            success: true,
            term: newTerm,
            message: '약관이 성공적으로 추가되었습니다.'
        });
    } catch (error) {
        console.error('약관 추가 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '약관 추가에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - 약관 수정
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            id,
            title,
            content,
            isRequired,
            isActive,
            updateVersion = false
        } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: '약관 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const termsData = await loadTerms();

        if (!termsData.terms[id]) {
            return NextResponse.json(
                { success: false, error: '약관을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 약관 업데이트
        const existingTerm = termsData.terms[id];
        const updatedTerm: Term = {
            ...existingTerm,
            lastUpdated: new Date().toISOString()
        };

        if (title !== undefined) updatedTerm.title = title.trim();
        if (content !== undefined) updatedTerm.content = content.trim();
        if (isRequired !== undefined) updatedTerm.isRequired = isRequired;
        if (isActive !== undefined) updatedTerm.isActive = isActive;

        // 버전 업데이트 (내용이 변경된 경우)
        if (updateVersion && content !== undefined && content !== existingTerm.content) {
            const currentVersion = parseFloat(existingTerm.version);
            updatedTerm.version = (currentVersion + 0.1).toFixed(1);
            updatedTerm.effectiveDate = new Date().toISOString();
        }

        termsData.terms[id] = updatedTerm;
        await saveTerms(termsData);

        return NextResponse.json({
            success: true,
            term: updatedTerm,
            message: '약관이 성공적으로 수정되었습니다.'
        });
    } catch (error) {
        console.error('약관 수정 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '약관 수정에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE - 약관 삭제
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams?.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: '약관 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const termsData = await loadTerms();

        if (!termsData.terms[id]) {
            return NextResponse.json(
                { success: false, error: '약관을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const deletedTerm = termsData.terms[id];
        delete termsData.terms[id];
        await saveTerms(termsData);

        return NextResponse.json({
            success: true,
            message: `${deletedTerm.title} 약관이 삭제되었습니다.`
        });
    } catch (error) {
        console.error('약관 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '약관 삭제에 실패했습니다.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 