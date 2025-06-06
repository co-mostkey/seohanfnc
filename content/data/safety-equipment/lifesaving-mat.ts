/**
 * 인명구조 매트 상세 정보
 * 
 * 제품의 기본 정보, 기술 사양, 특징, 관련 문서 등의 정보를 포함합니다.
 */

import { SafetyEquipment } from '../../../types/b-type';

const lifesavingMat: SafetyEquipment = {
  id: 'Lifesaving-Mat',
  nameKo: '인명구조 매트',
  nameEn: 'Lifesaving Mat',
  slug: 'lifesaving-mat',
  description: '인명구조 매트는 화재 및 재난 현장에서 신속한 인명 구조를 위한 필수 장비입니다. 고강도 내열성 소재를 사용하여 안전하고 효과적인 구조 작업을 지원합니다.',

  // 제품 이미지 경로
  thumbnail: '/images/products/b-type/lifesaving-mat/thumbnail.jpg',
  images: [
    '/images/products/b-type/lifesaving-mat/image1.jpg',
    '/images/products/b-type/lifesaving-mat/image2.jpg',
    '/images/products/b-type/lifesaving-mat/image3.jpg',
  ],

  // 3D 모델 정보
  modelPath: '/models/b-type/lifesaving-mat.glb',

  // 제품 사양
  specifications: {
    '모델': 'LSM-110, LSM-220, LSM-330',
    '규격(m)': '3×3 / 4×4 / 5×5',
    '제품승인번호': '구매 21-7',
    '내열성': '200°C까지 내열 가능',
    '충격흡수력': '최대 100kg 충격 흡수',
    '최대 적재량': '500kg',
    '재질': '내열성 특수 폴리머 소재',
    '무게': '15kg ~ 30kg (모델별 상이)',
    '사용 환경': '-30℃ ~ 200℃',
    '보관 시 크기': '60cm × 60cm × 20cm (접었을 때)',
  },

  // 주요 특징
  features: [
    {
      title: '우수한 내열성',
      description: '200°C까지 견딜 수 있는 특수 소재로 화재 현장에서도 안전하게 사용',
      icon: 'Flame'
    },
    {
      title: '가벼운 무게',
      description: '휴대성이 뛰어나 신속한 배치와 이동이 용이함',
      icon: 'Weight'
    },
    {
      title: '고강도 내구성',
      description: '반복적인 사용에도 내구성이 유지되어 장기간 사용 가능',
      icon: 'ShieldCheck'
    },
    {
      title: '신속한 배치',
      description: '15초 이내에 완전 전개 가능하여 긴급 상황에 신속 대응',
      icon: 'Timer'
    },
    {
      title: '다용도 활용',
      description: '추락 방지, 화재 대피, 수색 구조 등 다양한 재난 상황에서 활용 가능',
      icon: 'Layers'
    }
  ],

  // 관련 문서
  documents: [
    {
      id: 'lifesaving-mat-manual',
      nameKo: '사용자 매뉴얼',
      nameEn: 'User Manual',
      type: 'manual',
      filePath: '/documents/b-type/lifesaving-mat-manual.pdf'
    },
    {
      id: 'lifesaving-mat-certification',
      nameKo: '제품 인증서',
      nameEn: 'Product Certification',
      type: 'certification',
      filePath: '/documents/b-type/lifesaving-mat-certification.pdf'
    },
    {
      id: 'lifesaving-mat-maintenance',
      nameKo: '유지보수 지침',
      nameEn: 'Maintenance Instructions',
      type: 'guide',
      filePath: '/documents/b-type/lifesaving-mat-maintenance.pdf'
    }
  ],

  // 카테고리 및 태그
  category: 'b-type',
  tags: ['인명구조', '안전매트', '화재대응', '내열성', '구조장비'],

  // 추가 정보
  additionalInfo: {
    manufacturer: '서한에프앤씨',
    warranty: '3년 제한 보증',
    installation: '현장 배치 교육 권장',
    maintenanceCycle: '사용 후 즉시 점검, 6개월마다 정기 점검 권장',
    storageRequirement: '건조하고 서늘한 곳에 보관',
    certification: 'ISO 9001, KFI 인증'
  }
};

export default lifesavingMat;