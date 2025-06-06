// 제품 카테고리 표시 정보 (ID와 한글 이름 매핑)
export const ProductCategoryDisplayInfo: Record<string, { name: string; color?: string }> = {
    'b-type': { name: '안전장비', color: 'bg-blue-500' },
    'fire-suppression': { name: '소방장비', color: 'bg-red-500' },
    'rescue-equipment': { name: '구조장비', color: 'bg-green-500' },
    'industrial-safety': { name: '산업안전', color: 'bg-purple-500' },
    'first-aid': { name: '응급처치', color: 'bg-pink-500' },
    'water-tank': { name: '저수조', color: 'bg-cyan-500' },
    'disinfection': { name: '소독기', color: 'bg-yellow-500' },
    'fire-truck': { name: '소방차량장비', color: 'bg-orange-500' },
    'rescue-chute': { name: '구조대', color: 'bg-emerald-500' },
    'air-mat': { name: '에어매트', color: 'bg-indigo-500' },
    'descender': { name: '하강기', color: 'bg-violet-500' },
    'flood-prevention': { name: '수해방지', color: 'bg-amber-500' },
    'airslide': { name: '에어슬라이드', color: 'bg-lime-500' },
    'lifesaving-mat': { name: '인명구조매트', color: 'bg-sky-500' },
    'vertical-rescue': { name: '수직구조장비', color: 'bg-rose-500' },
    // ... 기타 실제 categoryId와 이름 추가 ...
    'default': { name: '미분류', color: 'bg-gray-500' }
};

// 여기에 다른 전역 상수들을 추가할 수 있습니다. 