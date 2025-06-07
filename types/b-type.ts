// [TRISID] SafetyEquipment 타입 정의

export interface LocalizedString {
    ko: string;
    en: string;
}

export interface SafetyEquipment {
    id: string;
    nameKo: string | LocalizedString;
    nameEn: string | LocalizedString;
    category: string;
    description: string | LocalizedString;
    tags: string[];
    specifications?: Record<string, any>;
    features?: string[];
    images?: string[];
    documents?: string[];
    // 기타 필요한 속성들...
} // [TRISID] SafetyEquipment Ÿ�� ����
