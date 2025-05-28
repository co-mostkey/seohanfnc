/**
 * 테스트용 컴포넌트 - 실제 사용하지 않음
 * 
 * 이 컴포넌트는 ProductForm 개발 과정에서의 디버깅 용도로 생성되었습니다.
 * 실제 운영 중에는 사용되지 않으며, 향후 삭제될 수 있습니다.
 */

'use client';

import React from 'react';

interface ProductFormTestProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isSubmitting?: boolean;
}

export const ProductFormTest: React.FC<ProductFormTestProps> = ({
    initialData,
    onSubmit,
    isSubmitting = false
}) => {
    return (
        <div className="space-y-6">
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit({});
            }}>
                <div>기본 테스트 폼</div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '저장'}
                </button>
            </form>
        </div>
    );
};

export default ProductFormTest; 