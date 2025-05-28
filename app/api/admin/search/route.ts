import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// 검색 가능한 데이터 소스들
const dataDir = path.join(process.cwd(), 'data');
const dbDir = path.join(process.cwd(), 'data', 'db');
const companyFilePath = path.join(dataDir, 'company.json');
const productsFilePath = path.join(dataDir, 'products.ts');
const inquiryFilePath = path.join(dataDir, 'inquiry-data.ts');
const membersFilePath = path.join(dbDir, 'members.json');

interface SearchResult {
    id: string;
    title: string;
    content: string;
    type: 'company' | 'product' | 'inquiry' | 'award' | 'core-value' | 'research' | 'member';
    url: string;
    relevance: number;
}

// 파일 읽기 헬퍼 함수
async function readJsonFile(filePath: string) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

// TypeScript 파일에서 데이터 추출
async function readTsDataFile(filePath: string) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        // export const 배열 찾기
        const arrayMatch = content.match(/export\s+const\s+\w+\s*=\s*(\[[\s\S]*?\]);/);
        if (arrayMatch) {
            // 간단한 파싱 - 실제로는 더 정교한 파싱이 필요할 수 있음
            const arrayStr = arrayMatch[1];
            try {
                // 안전한 eval 대신 정규식으로 객체 추출
                const objects = [];
                const objectMatches = arrayStr.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
                if (objectMatches) {
                    for (const objStr of objectMatches) {
                        try {
                            // 간단한 객체 파싱 (실제로는 더 정교한 파서가 필요)
                            const obj = eval(`(${objStr})`);
                            objects.push(obj);
                        } catch (e) {
                            console.warn('Failed to parse object:', objStr);
                        }
                    }
                }
                return objects;
            } catch (e) {
                console.error('Failed to parse array:', e);
                return [];
            }
        }
        return [];
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

// 텍스트 유사도 계산 (간단한 키워드 매칭)
function calculateRelevance(searchTerm: string, text: string): number {
    if (!text || !searchTerm) return 0;

    const searchLower = searchTerm.toLowerCase();
    const textLower = text.toLowerCase();

    // 정확한 매칭
    if (textLower.includes(searchLower)) {
        return 100;
    }

    // 키워드 분할 매칭
    const searchWords = searchLower.split(/\s+/);
    const textWords = textLower.split(/\s+/);

    let matchCount = 0;
    for (const searchWord of searchWords) {
        for (const textWord of textWords) {
            if (textWord.includes(searchWord) || searchWord.includes(textWord)) {
                matchCount++;
                break;
            }
        }
    }

    return (matchCount / searchWords.length) * 80;
}

// 회사 정보에서 검색
function searchCompanyData(companyData: any, searchTerm: string): SearchResult[] {
    const results: SearchResult[] = [];

    if (!companyData) return results;

    // 기본 회사 정보
    const basicInfo = `${companyData.nameKo || ''} ${companyData.nameEn || ''} ${companyData.description || ''} ${companyData.intro || ''} ${companyData.philosophy || ''}`;
    const basicRelevance = calculateRelevance(searchTerm, basicInfo);
    if (basicRelevance > 0) {
        results.push({
            id: 'company-basic',
            title: '회사 기본정보',
            content: companyData.description || companyData.intro || '회사 기본 정보',
            type: 'company',
            url: '/admin/company',
            relevance: basicRelevance
        });
    }

    // 핵심가치 검색
    if (companyData.coreValues) {
        companyData.coreValues.forEach((value: any, index: number) => {
            const valueText = `${value.title || ''} ${value.description || ''}`;
            const relevance = calculateRelevance(searchTerm, valueText);
            if (relevance > 0) {
                results.push({
                    id: `core-value-${index}`,
                    title: `핵심가치: ${value.title}`,
                    content: value.description || '',
                    type: 'core-value',
                    url: '/admin/company',
                    relevance
                });
            }
        });
    }

    // 인증/수상 검색
    if (companyData.awardsAndCertifications) {
        companyData.awardsAndCertifications.forEach((award: any, index: number) => {
            const awardText = `${award.title || ''} ${award.issuer || ''} ${award.description || ''}`;
            const relevance = calculateRelevance(searchTerm, awardText);
            if (relevance > 0) {
                results.push({
                    id: `award-${index}`,
                    title: `인증/수상: ${award.title}`,
                    content: `${award.issuer} (${award.year}) - ${award.description || ''}`,
                    type: 'award',
                    url: '/admin/company',
                    relevance
                });
            }
        });
    }

    // 연구개발 검색
    if (companyData.researchPage) {
        const research = companyData.researchPage;

        // 연구 분야
        if (research.areas?.items) {
            research.areas.items.forEach((area: any, index: number) => {
                const areaText = `${area.title || ''} ${area.description || ''}`;
                const relevance = calculateRelevance(searchTerm, areaText);
                if (relevance > 0) {
                    results.push({
                        id: `research-area-${index}`,
                        title: `연구분야: ${area.title}`,
                        content: area.description || '',
                        type: 'research',
                        url: '/admin/research',
                        relevance
                    });
                }
            });
        }

        // 연구 성과
        if (research.achievements?.items) {
            research.achievements.items.forEach((achievement: any, index: number) => {
                const achievementText = `${achievement.title || ''} ${achievement.details || ''}`;
                const relevance = calculateRelevance(searchTerm, achievementText);
                if (relevance > 0) {
                    results.push({
                        id: `research-achievement-${index}`,
                        title: `연구성과: ${achievement.title}`,
                        content: `${achievement.year} - ${achievement.details || ''}`,
                        type: 'research',
                        url: '/admin/research',
                        relevance
                    });
                }
            });
        }
    }

    return results;
}

// 제품 데이터에서 검색
function searchProductData(products: any[], searchTerm: string): SearchResult[] {
    const results: SearchResult[] = [];

    products.forEach((product, index) => {
        const productText = `${product.name || ''} ${product.description || ''} ${product.features?.join(' ') || ''} ${product.category || ''}`;
        const relevance = calculateRelevance(searchTerm, productText);
        if (relevance > 0) {
            results.push({
                id: `product-${index}`,
                title: `제품: ${product.name}`,
                content: product.description || '',
                type: 'product',
                url: '/admin/products',
                relevance
            });
        }
    });

    return results;
}

// 문의 데이터에서 검색
function searchInquiryData(inquiries: any[], searchTerm: string): SearchResult[] {
    const results: SearchResult[] = [];

    inquiries.forEach((inquiry, index) => {
        const inquiryText = `${inquiry.name || ''} ${inquiry.email || ''} ${inquiry.subject || ''} ${inquiry.message || ''} ${inquiry.company || ''}`;
        const relevance = calculateRelevance(searchTerm, inquiryText);
        if (relevance > 0) {
            results.push({
                id: `inquiry-${index}`,
                title: `문의: ${inquiry.subject || inquiry.name}`,
                content: inquiry.message || '',
                type: 'inquiry',
                url: '/admin/inquiries',
                relevance
            });
        }
    });

    return results;
}

// 회원 데이터에서 검색
function searchMemberData(memberData: any, searchTerm: string): SearchResult[] {
    const results: SearchResult[] = [];

    if (!memberData || !memberData.members || !Array.isArray(memberData.members)) return results;

    memberData.members.forEach((member: any) => {
        const memberText = `${member.name || ''} ${member.email || ''} ${member.company || ''} ${member.position || ''} ${member.phone || ''} ${member.interests?.join(' ') || ''}`;
        const relevance = calculateRelevance(searchTerm, memberText);

        if (relevance > 0) {
            const statusText = member.status === 'active' ? '활성' :
                member.status === 'inactive' ? '비활성' :
                    member.status === 'pending' ? '대기' : '정지';

            results.push({
                id: `member-${member.id}`,
                title: `회원: ${member.name}`,
                content: `${member.email} (${member.company || '개인'}) - ${statusText} - ${member.position || ''}`,
                type: 'member',
                url: '/admin/users?tab=members',
                relevance
            });
        }
    });

    return results;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams?.get('q');
        const type = searchParams?.get('type'); // 'all', 'company', 'product', 'inquiry', 'member'
        const limit = parseInt(searchParams?.get('limit') || '20');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                results: [],
                total: 0,
                message: '검색어는 최소 2글자 이상 입력해주세요.'
            });
        }

        const searchTerm = query.trim();
        let allResults: SearchResult[] = [];

        // 회사 정보 검색
        if (!type || type === 'all' || type === 'company') {
            const companyData = await readJsonFile(companyFilePath);
            const companyResults = searchCompanyData(companyData, searchTerm);
            allResults.push(...companyResults);
        }

        // 제품 검색
        if (!type || type === 'all' || type === 'product') {
            const products = await readTsDataFile(productsFilePath);
            const productResults = searchProductData(products, searchTerm);
            allResults.push(...productResults);
        }

        // 문의 검색
        if (!type || type === 'all' || type === 'inquiry') {
            const inquiries = await readTsDataFile(inquiryFilePath);
            const inquiryResults = searchInquiryData(inquiries, searchTerm);
            allResults.push(...inquiryResults);
        }

        // 회원 검색
        if (!type || type === 'all' || type === 'member') {
            const memberData = await readJsonFile(membersFilePath);
            if (memberData) {
                const memberResults = searchMemberData(memberData, searchTerm);
                allResults.push(...memberResults);
            }
        }

        // 관련도 순으로 정렬
        allResults.sort((a, b) => b.relevance - a.relevance);

        // 결과 제한
        const limitedResults = allResults.slice(0, limit);

        return NextResponse.json({
            results: limitedResults,
            total: allResults.length,
            query: searchTerm,
            searchTime: Date.now()
        });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json(
            {
                message: 'Search failed',
                error: error instanceof Error ? error.message : String(error),
                results: [],
                total: 0
            },
            { status: 500 }
        );
    }
} 