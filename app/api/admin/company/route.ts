import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
// import { readJsonFile, writeJsonFile } from '@/lib/file-db'; // fs/promises 직접 사용으로 변경
// import { CompanyInfo } from '@/types/company'; // data/company.json 전체 구조에 맞는 타입 필요

// data/company.json 파일 경로
const COMPANY_DATA_FILE_PATH = path.join(process.cwd(), 'data', 'company.json');

// 타입을 any로 우선 설정 (실제로는 data/company.json 구조에 맞는 타입 정의 필요)
type CompanyData = any;

export async function GET() {
    try {
        console.log('Company API GET - Starting...');
        console.log('Company API GET - File path:', COMPANY_DATA_FILE_PATH);

        const fileData = await fs.readFile(COMPANY_DATA_FILE_PATH, 'utf8');
        console.log('Company API GET - File read successfully, length:', fileData.length);

        const data: CompanyData = JSON.parse(fileData);
        console.log('Company API GET - JSON parsed successfully');
        console.log('Company API GET - Awards count:', data.awardsAndCertifications?.length || 0);

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    } catch (error: any) {
        console.error('[CompanyAPI][GET] Error:', error);
        console.error('[CompanyAPI][GET] Error stack:', error.stack);
        console.error('[CompanyAPI][GET] Error code:', error.code);

        // 파일이 없는 경우 등의 초기 오류는 관리자 페이지에서 기본값으로 처리할 수 있도록 유도 가능
        if (error.code === 'ENOENT') {
            // 관리자 페이지에서 사용할 기본값을 반환하거나, 특정 에러 메시지 반환
            // 여기서는 에러를 그대로 반환하여 관리자 페이지에서 적절히 처리하도록 함
            return NextResponse.json({ message: 'company.json 파일을 찾을 수 없습니다. 관리자 페이지에서 새로 생성하거나 확인해주세요.' }, { status: 404 });
        }
        return NextResponse.json({ message: `회사 정보를 불러오지 못했습니다. 오류: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json() as Partial<CompanyData>; // 전체 구조를 업데이트

        // 현재 데이터를 읽어와서 부분 업데이트 (파일이 없다면 body가 전체 데이터가 됨)
        let currentData: CompanyData = {};
        try {
            const fileData = await fs.readFile(COMPANY_DATA_FILE_PATH, 'utf8');
            currentData = JSON.parse(fileData);
        } catch (error: any) {
            if (error.code !== 'ENOENT') { // 파일이 없는 것 외의 오류는 throw
                throw error;
            }
            // 파일이 없으면 currentData는 빈 객체로 시작
        }

        // 업데이트된 데이터 생성 (body가 currentData를 덮어쓰되, 기존 구조 유지 시도)
        // awardsAndCertifications와 researchPage 등 내부 객체도 안전하게 병합되도록 고려 필요
        // 여기서는 body가 company.json의 전체 또는 부분 구조를 올바르게 제공한다고 가정
        const updatedData: CompanyData = { ...currentData, ...body };

        await fs.writeFile(COMPANY_DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), 'utf8'); // 포맷팅을 위해 null, 2 추가

        // 데이터 저장 후 경로 재검증
        revalidatePath('/research'); // 연구개발 페이지
        revalidatePath('/about');    // 회사소개 페이지 (경로가 맞는지 확인 필요, 예시)
        // 필요에 따라 다른 관련 경로도 추가
        revalidatePath('/'); // 홈페이지 전체 재검증 추가

        return NextResponse.json(updatedData, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    } catch (error: any) {
        console.error('[CompanyAPI][PUT] Error:', error);
        return NextResponse.json({ message: `회사 정보를 저장하지 못했습니다. 오류: ${error.message}` }, { status: 500 });
    }
} 