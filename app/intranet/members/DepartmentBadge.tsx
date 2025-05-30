const departmentColorMap: Record<string, string> = {
    '경영지원': 'bg-gray-700',
    '영업': 'bg-gray-600',
    '생산': 'bg-gray-500',
    '연구개발': 'bg-gray-400',
    '기타': 'bg-gray-300',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${departmentColorMap[department]}`}>{department}</span>; 