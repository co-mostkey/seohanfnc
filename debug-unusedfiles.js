const fs = require('fs');
const path = require('path');

// Unusedfiles의 제품 데이터 파일 경로
const jsonPath = path.join(process.cwd(), 'Unusedfiles', 'main_seohan-website', 'content', 'data', 'products', 'products.json');

try {
    console.log('Unusedfiles 제품 데이터 파일 경로:', jsonPath);
    console.log('파일 존재 여부:', fs.existsSync(jsonPath));

    if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);

        console.log('\n=== Unusedfiles 카테고리 정보 ===');
        data.categories.forEach(category => {
            console.log(`카테고리 ID: ${category.id}`);
            console.log(`카테고리 이름(한국어): ${category.nameKo}`);
            console.log(`제품 수: ${category.products ? category.products.length : 0}`);

            if (category.id === 'b-type' && category.products) {
                console.log('\n=== Unusedfiles 안전장비 카테고리 제품들 ===');
                category.products.forEach(product => {
                    console.log(`- ID: ${product.id}`);
                    console.log(`  이름(한국어): ${product.nameKo}`);
                    console.log(`  이름(영어): ${product.nameEn || 'N/A'}`);
                    console.log('');
                });
            }
            console.log('---');
        });
    } else {
        console.log('Unusedfiles 제품 데이터 파일이 존재하지 않습니다.');
    }
} catch (error) {
    console.error('오류 발생:', error);
} 