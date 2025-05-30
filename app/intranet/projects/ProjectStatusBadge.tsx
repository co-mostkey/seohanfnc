const statusColorMap: Record<string, string> = {
    '진행중': 'bg-gray-700',
    '완료': 'bg-gray-500',
    '지연': 'bg-gray-800',
    '대기': 'bg-gray-600',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColorMap[status]}`}>{status}</span>; 