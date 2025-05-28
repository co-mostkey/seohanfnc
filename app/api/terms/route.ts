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
        // 파일이 없으면 기본 구조 반환
        return {
            terms: {},
            metadata: {
                lastUpdated: new Date().toISOString(),
                totalTerms: 0,
                activeTerms: 0
            }
        };
    }
}

/**
 * GET - 공개 약관 조회 (활성화된 약관만)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const termId = searchParams?.get('id');

        const termsData = await loadTerms();

        // 활성화된 약관만 필터링
        const activeTerms = Object.values(termsData.terms).filter(term => term.isActive);

        // 특정 약관 조회
        if (termId) {
            const term = activeTerms.find(t => t.id === termId);
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

        // 전체 활성 약관 목록 조회
        return NextResponse.json({
            success: true,
            terms: activeTerms,
            metadata: {
                ...termsData.metadata,
                totalTerms: activeTerms.length,
                activeTerms: activeTerms.length
            },
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