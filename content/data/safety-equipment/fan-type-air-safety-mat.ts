/**
 * 팬형 공기안전매트 상세 정보
 * 
 * 제품의 기본 정보, 기술 사양, 특징, 관련 문서 등의 정보를 포함합니다.
 */

import { SafetyEquipment } from '../../../types/b-type';

const fanTypeAirSafetyMat: SafetyEquipment = {
  id: 'Fan-Type-Air-Safety-Mat',
  nameKo: '팬형 공기안전매트',
  nameEn: 'Fan Type Air Safety Mat',
  slug: 'fan-type-air-safety-mat',
  description: '팬형 공기안전매트는 전기 모터로 구동되는 송풍기를 통해 에어매트에 공기를 주입하여 사용하는 추락 안전장비입니다. 고층 건물 화재 및 재난 현장에서 효과적으로 활용됩니다.',

  // 제품 이미지 경로
  thumbnail: '/images/products/b-type/fan-type-air-safety-mat/thumbnail.jpg',
  images: [
    '/images/products/b-type/fan-type-air-safety-mat/image1.jpg',
    '/images/products/b-type/fan-type-air-safety-mat/image2.jpg',
    '/images/products/b-type/fan-type-air-safety-mat/image3.jpg',
  ],

  // 3D 모델 정보
  modelPath: '/models/b-type/fan-type-air-safety-mat.glb',

  // 제품 사양
  specifications: {
    '모델': '5F 형, 10F 형, 15F 형, 20F 형',
    '규격(m)': '3.5×3.5×1.5 / 4.5×4.5×2.0 / 5.5×5.5×2.5 / 6.5×6.5×3.0',
    '제품승인번호': '공매 23-1',
    '내충격성': 'KFI인정기준(공기안전매트의 성능인정 및 제품검사 기술기준) 적합',
    '송풍기': '220V, 1.5HP ~ 2.5HP (모델별 상이)',
    '팽창시간': '약 60~120초 (모델별 상이)',
    '충진방식': '전기 모터 팬 방식',
    '적용 높이': '5~20m 이하',
    '재질': '내구성 폴리에스테르 원단 (1000데니어)',
    '무게': '35kg ~ 90kg (모델별 상이)',
    '사용 환경': '-20℃ ~ 70℃',
  },

  // 주요 특징
  features: [
    {
      title: '안정적인 전력 사용',
      description: '전기 모터 송풍기로 지속적인 공기 공급이 가능하여 장시간 사용에 유리',
      icon: 'Power'
    },
    {
      title: '대형 크기 가능',
      description: '다양한 규격으로 제작 가능하여 넓은 공간 커버 가능',
      icon: 'Maximize'
    },
    {
      title: '간편한 유지보수',
      description: '전기 모터 시스템으로 유지보수가 용이하고 반복 사용이 가능',
      icon: 'Settings'
    },
    {
      title: '견고한 내구성',
      description: '고강도 폴리에스테르 원단으로 제작되어 장기간 사용이 가능',
      icon: 'Shield'
    },
    {
      title: '비상 백업 시스템',
      description: '정전 시 비상 전원 연결이 가능한 시스템 장착',
      icon: 'AlertCircle'
    }
  ],

  // 관련 문서
  documents: [
    {
      id: 'fan-type-air-safety-mat-manual',
      nameKo: '사용자 매뉴얼',
      nameEn: 'User Manual',
      type: 'manual',
      filePath: '/documents/b-type/fan-type-air-safety-mat-manual.pdf'
    },
    {
      id: 'fan-type-air-safety-mat-certification',
      nameKo: '제품 인증서',
      nameEn: 'Product Certification',
      type: 'certification',
      filePath: '/documents/b-type/fan-type-air-safety-mat-certification.pdf'
    },
    {
      id: 'fan-type-air-safety-mat-maintenance',
      nameKo: '유지보수 안내서',
      nameEn: 'Maintenance Guide',
      type: 'guide',
      filePath: '/documents/b-type/fan-type-air-safety-mat-maintenance.pdf'
    },
    {
      id: 'fan-type-air-safety-mat-datasheet',
      nameKo: '기술 사양서',
      nameEn: 'Technical Datasheet',
      type: 'datasheet',
      filePath: '/documents/b-type/fan-type-air-safety-mat-datasheet.pdf'
    }
  ],

  // 카테고리 및 태그
  category: 'b-type',
  tags: ['안전매트', '추락방지', '구조장비', '소방장비', '팬형'],

  // 추가 정보
  additionalInfo: {
    manufacturer: '서한에프앤씨',
    warranty: '2년 제한 보증',
    installation: '전문 설치 권장',
    maintenanceCycle: '3개월마다 정기 점검 권장',
    powerRequirement: 'AC 220V, 60Hz',
    certification: 'KFI 인증'
  }
};

export default fanTypeAirSafetyMat;