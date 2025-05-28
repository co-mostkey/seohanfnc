// 공지사항 유효성 검증 함수
export function validate(data: any): { success: boolean; message?: string } {
    if (!data) {
        return {
            success: false,
            message: '데이터가 제공되지 않았습니다.'
        };
    }

    // 필수 필드 검증
    if (!data.title?.trim()) {
        return {
            success: false,
            message: '제목은 필수 입력 항목입니다.'
        };
    }

    if (!data.content?.trim()) {
        return {
            success: false,
            message: '내용은 필수 입력 항목입니다.'
        };
    }

    // 제목 길이 검증
    if (data.title.length > 100) {
        return {
            success: false,
            message: '제목은 100자를 초과할 수 없습니다.'
        };
    }

    // 카테고리 검증 - 실제 사용되는 카테고리와 일치
    const validCategories = ['일반', '뉴스', '업데이트', '이벤트', '점검', '테스트'];
    if (data.category && !validCategories.includes(data.category)) {
        return {
            success: false,
            message: '유효하지 않은 카테고리입니다.'
        };
    }

    return { success: true };
} 