/**
 * 실린더형 안전 에어매트 상세 정보
 * 
 * 제품의 기본 정보, 기술 사양, 특징, 관련 문서 등의 정보를 포함합니다.
 */

import { SafetyEquipment } from '../../../types/safety-equipment';

const cylinderTypeSafetyMat: SafetyEquipment = {
  id: 'Cylinder-Type-SafetyAirMat',
  nameKo: '실린더형 안전 에어매트',
  nameEn: 'Cylinder Type Safety Air Mat',
  slug: 'cylinder-type-safety-air-mat',
  description: '실린더형 공기안전매트는 고층 건물, 공사 현장 등에서 추락 사고 발생 시 충격을 완화하여 인명 피해를 최소화하는 장비입니다.',
  
  // 제품 이미지 경로
  thumbnail: '/images/products/safety-equipment/cylinder-type-safety-air-mat/thumbnail.jpg',
  images: [
    '/images/products/safety-equipment/cylinder-type-safety-air-mat/image1.jpg',
    '/images/products/safety-equipment/cylinder-type-safety-air-mat/image2.jpg',
    '/images/products/safety-equipment/cylinder-type-safety-air-mat/image3.jpg',
  ],
  
  // 3D 모델 정보
  modelPath: '/models/safety-equipment/cylinder-safety-mat.glb',
  
  // 제품 사양
  specifications: {
    '모델': '10형, 20형, 30형',
    '규격(m)': '5×5×2.5 / 5×7×3.5 / 5×10×3.5',
    '제품승인번호': '공매 22-3',
    '내충격성': 'KFI인정기준(공기안전매트의 성능인정 및 제품검사 기술기준) 적합',
    '팽창시간': '약 90초 이내',
    '충진방식': '자동 실린더 방식',
    '적용 높이': '10~25m 이하',
    '재질': '내구성 폴리에스테르 원단 (1500데니어)',
    '무게': '45kg ~ 120kg (모델별 상이)',
    '사용 환경': '-20℃ ~ 70℃',
  },
  
  // 주요 특징
  features: [
    {
      title: '빠른 전개 방식',
      description: '실린더 자동 충전 방식으로 약 90초 이내에 신속 전개 가능',
      icon: 'Clock'
    },
    {
      title: '내구성 있는 소재',
      description: '고강도 폴리에스테르 원단으로 제작되어 내구성과 안전성이 우수',
      icon: 'Shield'
    },
    {
      title: '다양한 규격',
      description: '건물 높이 및 설치 공간에 따라 다양한 규격 선택 가능',
      icon: 'RulerSquare'
    },
    {
      title: '편리한 운반',
      description: '접이식 구조로 운반 및 보관이 용이하며 재사용 가능',
      icon: 'PackageOpen'
    },
    {
      title: '강화된 내충격성',
      description: '소방청 안전기준에 적합한 내충격성으로 안전하게 추락 충격 흡수',
      icon: 'Zap'
    }
  ],
  
  // 관련 문서
  documents: [
    {
      id: 'cylinder-safety-mat-manual',
      nameKo: '사용자 매뉴얼',
      nameEn: 'User Manual',
      type: 'manual',
      filePath: '/documents/safety-equipment/cylinder-type-safety-mat-manual.pdf'
    },
    {
      id: 'cylinder-safety-mat-certification',
      nameKo: '제품 인증서',
      nameEn: 'Product Certification',
      type: 'certification',
      filePath: '/documents/safety-equipment/cylinder-type-safety-mat-certification.pdf'
    },
    {
      id: 'cylinder-safety-mat-maintenance',
      nameKo: '유지보수 안내서',
      nameEn: 'Maintenance Guide',
      type: 'guide',
      filePath: '/documents/safety-equipment/cylinder-type-safety-mat-maintenance.pdf'
    }
  ],
  
  // 카테고리 및 태그
  category: 'safety-equipment',
  tags: ['안전매트', '추락방지', '구조장비', '소방장비'],

  // 추가 정보
  additionalInfo: {
    manufacturer: '서한에프앤씨',
    warranty: '3년 제한 보증',
    installation: '전문 설치 권장',
    maintenanceCycle: '6개월마다 정기 점검 권장'
  }
};

export default cylinderTypeSafetyMat;