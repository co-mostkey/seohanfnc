const fs = require('fs');
const path = require('path');

// 제품 데이터 파일 경로
const productsFilePath = path.join(__dirname, '..', 'content', 'data', 'products', 'products.json');

// 파일 읽기
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

let addedCount = 0;
let styleAddedCount = 0;

// 에어매트 제품 ID 목록 (B타입으로 설정할 제품들)
const airMatProductIds = [
    'Cylinder-Type-SafetyAirMat',
    'Fan-Type-Air-Safety-Mat',
    'Training-Air-Mattress-Fall-Prevention-Mat',
    'Lifesaving-Mat'
];

// 모든 카테고리의 제품들을 순회
productsData.categories.forEach(category => {
    if (category.products && Array.isArray(category.products)) {
        category.products.forEach(product => {
            // isPublished 필드가 없는 제품에만 추가
            if (!product.hasOwnProperty('isPublished')) {
                product.isPublished = true;
                addedCount++;
                console.log(`✅ Added isPublished to: ${product.nameKo} (${product.id})`);
            }

            // productStyle 필드가 없는 제품에 추가
            if (!product.hasOwnProperty('productStyle')) {
                // 에어매트 제품인지 확인
                if (airMatProductIds.includes(product.id)) {
                    product.productStyle = 'B';
                    console.log(`🎨 Added productStyle 'B' (에어매트 스타일) to: ${product.nameKo} (${product.id})`);
                } else {
                    product.productStyle = 'A';
                    console.log(`🎨 Added productStyle 'A' (기본 스타일) to: ${product.nameKo} (${product.id})`);
                }
                styleAddedCount++;
            }
        });
    }
});

// 파일 저장
fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2), 'utf-8');

console.log(`\n✅ 완료!`);
console.log(`📊 총 ${addedCount}개의 제품에 isPublished 필드를 추가했습니다.`);
console.log(`🎨 총 ${styleAddedCount}개의 제품에 productStyle 필드를 추가했습니다.`);
console.log(`\n📋 에어매트 제품들 (B타입):`);
airMatProductIds.forEach(id => {
    console.log(`   - ${id}`);
});
console.log(`\n📋 기타 제품들은 A타입(기본 스타일)으로 설정되었습니다.`); 