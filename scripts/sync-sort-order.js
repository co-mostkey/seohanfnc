const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const sourceFile = path.join(process.cwd(), 'data', 'products', 'products.json');
const targetFile = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');

console.log('sortOrder 동기화 시작...');

try {
    // 소스 파일에서 sortOrder 정보 읽기
    const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
    const sortOrderMap = new Map();

    // 소스 데이터에서 sortOrder 정보 추출
    sourceData.categories.forEach(category => {
        category.products.forEach(product => {
            if (product.sortOrder !== undefined) {
                sortOrderMap.set(product.id, product.sortOrder);
                console.log(`소스에서 발견: ${product.id} -> sortOrder: ${product.sortOrder}`);
            }
        });
    });

    // 타겟 파일 읽기
    const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
    let updatedCount = 0;

    // 타겟 데이터에 sortOrder 적용
    targetData.categories.forEach(category => {
        category.products.forEach(product => {
            const sortOrder = sortOrderMap.get(product.id);
            if (sortOrder !== undefined) {
                product.sortOrder = sortOrder;
                updatedCount++;
                console.log(`업데이트: ${product.id} -> sortOrder: ${sortOrder}`);
            }
        });
    });

    // 백업 생성
    const backupFile = targetFile + '.backup-' + Date.now();
    fs.writeFileSync(backupFile, fs.readFileSync(targetFile, 'utf-8'));
    console.log(`백업 생성: ${backupFile}`);

    // 타겟 파일에 저장
    fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2), 'utf-8');

    console.log(`\n✅ 동기화 완료!`);
    console.log(`- 총 ${updatedCount}개 제품의 sortOrder가 업데이트되었습니다.`);
    console.log(`- 백업 파일: ${backupFile}`);

} catch (error) {
    console.error('❌ 동기화 실패:', error);
    process.exit(1);
} 