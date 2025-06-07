const { createStaticBTypeProductPage } = require('./app/api/admin/products/create-static-b-type.ts');

// 테스트용 B타입 제품 데이터
const testProduct = {
  id: 'test-b-type-advanced',
  nameKo: '테스트 B타입 고급 제품',
  name: 'Test B-Type Advanced Product',
  descriptionKo: 'A타입 수준 디자인과 3D 모델링이 통합된 고급 B타입 제품입니다.'
};

async function generateTestBType() {
  try {
    console.log('[TRISID] 새로운 B타입 고급 템플릿 테스트 시작...');
    await createStaticBTypeProductPage(testProduct);
    console.log('[TRISID] ✅ 테스트 B타입 제품 페이지 생성 완료!');
    console.log('[TRISID] 확인 경로: app/products/test-b-type-advanced/');
  } catch (error) {
    console.error('[TRISID] ❌ 생성 실패:', error);
  }
}

generateTestBType(); 