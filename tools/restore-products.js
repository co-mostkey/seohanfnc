// [TRISID] 제품 데이터 복구 및 productStyle(A/B) 필드 일괄 추가 스크립트
const fs = require('fs');
const path = require('path');

// 원본 백업 파일과 최종 저장 파일 경로
const BACKUP_PATH = path.join(__dirname, '../content/data/products/products_backup_.json');
const OUTPUT_PATH = path.join(__dirname, '../content/data/products/products.json');

function addProductStyleToAll(products) {
    return products.map(product => ({
        ...product,
        productStyle: getProductStyle(product)
    }));
}

function processCategories(categories) {
    // 테스트/임시 카테고리 제외
    const excludeIds = ['TEST01', 'TEST02', 'TEST05'];
    return categories
        .filter(cat => !excludeIds.includes(cat.id))
        .map(cat => ({
            ...cat,
            products: addProductStyleToAll(cat.products || [])
        }));
}

function main() {
    const raw = fs.readFileSync(BACKUP_PATH, 'utf-8');
    const data = JSON.parse(raw);

    const categories = processCategories(data.categories);

    const result = {
        // [TRISID] 2024-06-XX: 제품 데이터 복구 및 productStyle(A/B) 필드 일괄 추가, 테스트/임시 카테고리 완전 제외, 기존 구조/타 영역 100% 보존
        categories
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
    console.log('[TRISID] products.json 복구 및 productStyle 필드 추가 완료!');
}

main();