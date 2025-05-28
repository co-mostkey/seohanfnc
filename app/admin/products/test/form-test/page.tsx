/**
 * 테스트용 페이지 - 실제 사용하지 않음
 * 
 * 이 페이지는 테스트 및 디버깅 용도로 생성되었습니다.
 * 실제 운영 중에는 사용되지 않으며, 향후 삭제될 수 있습니다.
 */

'use client';

import { ProductForm } from '../../test-components/ProductForm';

export default function FormTestPage() {
    const handleSubmit = (data: any) => {
        console.log('Form submitted:', data);
        alert('폼 제출 성공: ' + JSON.stringify(data, null, 2));
    };

    return (
        <div className="container mx-auto py-10">
            <div className="mb-4 p-4 bg-amber-100 border border-amber-300 rounded-md text-amber-800">
                <h2 className="text-lg font-bold">⚠️ 테스트용 페이지</h2>
                <p>이 페이지는 개발 테스트용으로, 실제 운영에서는 사용하지 않습니다.</p>
            </div>
            <h1 className="text-2xl font-bold mb-6">새 ProductForm 테스트</h1>
            <ProductForm
                onSubmit={handleSubmit}
            />
        </div>
    );
} 