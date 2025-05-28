const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products', 'products.json');

async function initializeSortOrder() {
    try {
        // 기존 제품 데이터 읽기
        const fileContent = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        let globalSortOrder = 1;

        // 각 카테고리의 제품들에 sortOrder 추가
        data.categories.forEach(category => {
            category.products.forEach(product => {
                if (!product.sortOrder) {
                    product.sortOrder = globalSortOrder++;
                }
            });
        });

        // 파일에 저장
        fs.writeFileSync(
            PRODUCTS_FILE_PATH,
            JSON.stringify(data, null, 2),
            'utf-8'
        );

        console.log('✅ sortOrder 필드가 성공적으로 초기화되었습니다.');
        console.log(`총 ${globalSortOrder - 1}개 제품에 sortOrder가 추가되었습니다.`);
    } catch (error) {
        console.error('❌ sortOrder 초기화 중 오류 발생:', error);
    }
}

initializeSortOrder(); 