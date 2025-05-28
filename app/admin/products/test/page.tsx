/**
 * 테스트용 페이지 - 실제 사용하지 않음
 * 
 * 이 페이지는 테스트 및 디버깅 용도로 생성되었습니다.
 * 새로 개선된 ProductForm.tsx 컴포넌트가 구현되었으므로, 
 * 이 파일은 더 이상 필요하지 않습니다.
 * 
 * 향후 프로젝트 정리 시 삭제 예정입니다.
 */

'use client';

import { ProductFormTest } from '../components/ProductForm.test';

export default function TestPage() {
    const handleSubmit = (data: any) => {
        console.log('Form submitted:', data);
    };

    return (
        <div className="container mx-auto py-10">
            <div className="mb-4 p-4 bg-amber-100 border border-amber-300 rounded-md text-amber-800">
                <h2 className="text-lg font-bold">⚠️ 테스트용 페이지</h2>
                <p>이 페이지는 개발 테스트용으로, 실제 운영에서는 사용하지 않습니다.</p>
                <p className="mt-2">관리자 페이지는 <a href="/admin" className="underline font-medium">여기</a>를 클릭하세요.</p>
            </div>
            <h1 className="text-2xl font-bold mb-6">ProductForm 테스트</h1>
            <ProductFormTest
                onSubmit={handleSubmit}
            />
        </div>
    );
} 