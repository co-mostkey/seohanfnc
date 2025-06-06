const fs = require('fs');
const path = require('path');

// 제품 데이터 파일 경로
const jsonPath = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');
const productsDir = path.join(process.cwd(), 'app', 'products');

try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);

    console.log('=== 개별 페이지 확인 ===');

    // 안전장비 카테고리의 모든 제품 확인
    const safetyCategory = data.categories.find(cat => cat.id === 'b-type');
    if (safetyCategory && safetyCategory.products) {
        safetyCategory.products.forEach(product => {
            const productPagePath = path.join(productsDir, product.id, 'page.tsx');
            const pageExists = fs.existsSync(productPagePath);

            console.log(`${product.id} (${product.nameKo}): ${pageExists ? '✅ 페이지 존재' : '❌ 페이지 없음'}`);
        });
    }

    // 다른 카테고리들도 확인
    data.categories.forEach(category => {
        if (category.id !== 'b-type' && category.products) {
            console.log(`\n=== ${category.nameKo} 카테고리 ===`);
            category.products.forEach(product => {
                const productPagePath = path.join(productsDir, product.id, 'page.tsx');
                const pageExists = fs.existsSync(productPagePath);

                console.log(`${product.id} (${product.nameKo}): ${pageExists ? '✅ 페이지 존재' : '❌ 페이지 없음'}`);
            });
        }
    });

} catch (error) {
    console.error('오류 발생:', error);
} 