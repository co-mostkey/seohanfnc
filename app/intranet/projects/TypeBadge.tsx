const typeColorMap: Record<string, string> = {
    '개발': 'bg-gray-700',
    '디자인': 'bg-gray-600',
    '기획': 'bg-gray-500',
    '기타': 'bg-gray-400',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${typeColorMap[type]}`}>{type}</span>; 