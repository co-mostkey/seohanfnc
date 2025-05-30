const typeColorMap: Record<string, string> = {
    '계약서': 'bg-gray-700',
    '보고서': 'bg-gray-600',
    '기타': 'bg-gray-500',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${typeColorMap[type]}`}>{type}</span>; 