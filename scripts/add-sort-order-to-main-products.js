const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const targetFile = path.join(process.cwd(), 'content', 'data', 'products', 'products.json');

console.log('주요 제품들에 sortOrder 추가 시작...');

try {
    // 타겟 파일 읽기
    const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));

    // 주요 제품들의 sortOrder 매핑 (관리자 페이지에서 보이는 순서대로)
    const sortOrderMapping = {
        // 완강기 관련 (fire-equipment 또는 descenders 카테고리)
        'Descending-Life-Line': 1,
        'Handy-Descending-Life-Line': 2,

        // 구조대 관련 (b-type 카테고리)
        'Vertical-Rescue-Equipment': 3,
        'Sloping-Rescue-Chute': 4,
        'Fire-Truck-Rescue-Equipment': 5,
        'Air-Slide': 6,

        // 안전매트 관련 (b-type 카테고리)
        'Cylinder-Type-SafetyAirMat': 7,
        'Training-Air-Mattress-Fall-Prevention-Mat': 8,
        'Lifesaving-Mat': 9,
        'Fan-Type-Air-Safety-Mat': 10,

        // 소독기 관련
        'Solid-Aerosol-Extinguisher': 11,
        'Outdoor-Human-Disinfector': 12,
        'Indoor-Human-Disinfector': 13,
        'Vehicle-Disinfector': 14,

        // 기타
        'Portable-Water-Tank': 15
    };

    let updatedCount = 0;

    // 백업 생성
    const backupFile = targetFile + '.backup-sort-' + Date.now();
    fs.writeFileSync(backupFile, fs.readFileSync(targetFile, 'utf-8'));
    console.log(`백업 생성: ${backupFile}`);

    // 타겟 데이터에 sortOrder 적용
    targetData.categories.forEach(category => {
        if (category.products && Array.isArray(category.products)) {
            category.products.forEach(product => {
                const sortOrder = sortOrderMapping[product.id];
                if (sortOrder !== undefined) {
                    product.sortOrder = sortOrder;
                    updatedCount++;
                    console.log(`업데이트: ${product.id} -> sortOrder: ${sortOrder} (카테고리: ${category.id})`);
                }
            });
        }
    });

    // 타겟 파일에 저장
    fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2), 'utf-8');

    console.log(`\n✅ sortOrder 추가 완료!`);
    console.log(`- 총 ${updatedCount}개 제품의 sortOrder가 추가되었습니다.`);
    console.log(`- 백업 파일: ${backupFile}`);

} catch (error) {
    console.error('❌ sortOrder 추가 실패:', error);
    process.exit(1);
} 