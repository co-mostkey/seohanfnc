/**
 * 훈련용 에어매트리스 추락방지 매트 상세 정보
 * 
 * 제품의 기본 정보, 기술 사양, 특징, 관련 문서 등의 정보를 포함합니다.
 */

import { SafetyEquipment } from '../../../types/b-type';

const trainingAirMattress: SafetyEquipment = {
  id: 'Training-Air-Mattress-Fall-Prevention-Mat',
  nameKo: '훈련용 에어매트리스 추락방지 매트',
  nameEn: 'Training Air Mattress Fall Prevention Mat',
  slug: 'training-air-mattress-fall-prevention-mat',
  description: '훈련용 에어매트리스 추락방지 매트는 소방, 구조대, 군사 훈련 등 다양한 안전 훈련 환경에서 사용할 수 있는 특수 설계된 매트입니다. 반복적인 사용에도 내구성이 뛰어나며 효과적인 훈련을 지원합니다.',

  // 제품 이미지 경로
  thumbnail: '/images/products/b-type/training-air-mattress/thumbnail.jpg',
  images: [
    '/images/products/b-type/training-air-mattress/image1.jpg',
    '/images/products/b-type/training-air-mattress/image2.jpg',
    '/images/products/b-type/training-air-mattress/image3.jpg',
  ],

  // 3D 모델 정보
  modelPath: '/models/b-type/training-air-mattress.glb',

  // 제품 사양
  specifications: {
    '모델': 'TAM-100, TAM-200, TAM-300',
    '규격(m)': '3×2×0.5 / 4×3×0.6 / 5×4×0.7',
    '인증번호': '훈련장비 22-5',
    '내구성': '10,000회 이상 반복 사용 가능',
    '충격흡수력': '최대 120kg 충격 흡수',
    '충진방식': '전기 송풍기 포함',
    '팽창시간': '약 2분 이내',
    '재질': '고강도 PVC 코팅 폴리에스테르 (2000데니어)',
    '무게': '20kg ~ 45kg (모델별 상이)',
    '사용 환경': '-10℃ ~ 60℃',
    '보관 시 크기': '80cm × 60cm × 40cm (접었을 때)',
  },

  // 주요 특징
  features: [
    {
      title: '뛰어난 내구성',
      description: '최대 10,000회 이상의 반복 사용이 가능한 특수 소재 적용',
      icon: 'Repeat'
    },
    {
      title: '간편한 세척',
      description: '방수 처리된 표면으로 쉽게 세척이 가능하며 위생적으로 관리',
      icon: 'Droplets'
    },
    {
      title: '최적화된 충격 흡수',
      description: '이중 에어 챔버 구조로 효과적인 충격 분산 및 흡수',
      icon: 'ArrowDownCircle'
    },
    {
      title: '휴대성',
      description: '휴대용 캐리백 제공으로 이동 및 보관이 편리함',
      icon: 'Briefcase'
    },
    {
      title: '안정적인 착지면',
      description: '미끄럼 방지 바닥면 처리로 안정적인 위치 유지',
      icon: 'Anchor'
    }
  ],

  // 관련 문서
  documents: [
    {
      id: 'training-air-mattress-manual',
      nameKo: '사용자 매뉴얼',
      nameEn: 'User Manual',
      type: 'manual',
      filePath: '/documents/b-type/training-air-mattress-manual.pdf'
    },
    {
      id: 'training-air-mattress-guide',
      nameKo: '훈련 가이드',
      nameEn: 'Training Guide',
      type: 'guide',
      filePath: '/documents/b-type/training-air-mattress-guide.pdf'
    },
    {
      id: 'training-air-mattress-maintenance',
      nameKo: '유지보수 지침',
      nameEn: 'Maintenance Instructions',
      type: 'guide',
      filePath: '/documents/b-type/training-air-mattress-maintenance.pdf'
    },
    {
      id: 'training-air-mattress-datasheet',
      nameKo: '기술 사양서',
      nameEn: 'Technical Datasheet',
      type: 'datasheet',
      filePath: '/documents/b-type/training-air-mattress-datasheet.pdf'
    }
  ],

  // 카테고리 및 태그
  category: 'b-type',
  tags: ['훈련용', '안전매트', '추락방지', '교육장비', '에어매트리스'],

  // 추가 정보
  additionalInfo: {
    manufacturer: '서한에프앤씨',
    warranty: '5년 제한 보증',
    installation: '간단한 설치 매뉴얼 제공',
    maintenanceCycle: '사용 후 점검, 3개월마다 정기 점검 권장',
    accessories: '전기 송풍기, 수리키트, 휴대용 캐리백 포함',
    certification: '안전훈련장비 인증'
  }
};

export default trainingAirMattress;