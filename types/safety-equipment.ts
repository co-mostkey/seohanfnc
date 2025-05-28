/**
 * 안전장비 관련 타입 정의
 * 
 * 안전장비 제품의 데이터 구조를 정의합니다.
 */

export interface Feature {
  title: string;
  description: string;
  icon?: string; // lucide-react 아이콘 이름
}

export interface Document {
  id: string;
  nameKo: string;
  nameEn: string;
  type: 'manual' | 'certification' | 'guide' | 'datasheet' | 'other';
  filePath: string;
}

export interface AdditionalInfo {
  manufacturer: string;
  warranty: string;
  installation: string;
  maintenanceCycle: string;
  [key: string]: string; // 추가 속성을 위한 인덱스 시그니처
}

/**
 * 안전장비 제품 인터페이스
 * 
 * 안전장비 제품의 모든 정보를 포함하는 구조
 */
export interface SafetyEquipment {
  id: string;
  nameKo: string;
  nameEn: string;
  slug: string;
  description: string;
  
  // 이미지 관련
  thumbnail: string;
  images: string[];
  
  // 3D 모델 관련
  modelPath: string;
  
  // 제품 사양 (키-값 쌍)
  specifications: {
    [key: string]: string;
  };
  
  // 주요 특징
  features: Feature[];
  
  // 관련 문서
  documents: Document[];
  
  // 분류
  category: string;
  tags: string[];
  
  // 추가 정보
  additionalInfo: AdditionalInfo;
}
