const eventTypeColorMap: Record<string, string> = {
    회의: 'bg-gray-700',
    휴가: 'bg-gray-600',
    마감: 'bg-gray-500',
    기타: 'bg-gray-400',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${eventTypeColorMap[type]}`}>{type}</span>; 