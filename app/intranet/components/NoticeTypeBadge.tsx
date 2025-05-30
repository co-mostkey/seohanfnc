const noticeTypeColorMap: Record<string, string> = {
    일반: 'bg-gray-700',
    중요: 'bg-gray-500',
    안내: 'bg-gray-600',
    기타: 'bg-gray-400',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${noticeTypeColorMap[type]}`}>{type}</span>; 