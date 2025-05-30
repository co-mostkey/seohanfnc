const roleColorMap: Record<string, string> = {
    '관리자': 'bg-gray-700',
    '직원': 'bg-gray-600',
    '인턴': 'bg-gray-500',
    '외부': 'bg-gray-400',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${roleColorMap[role]}`}>{role}</span>; 