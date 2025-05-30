const priorityColorMap: Record<string, string> = {
    '높음': 'bg-gray-800',
    '중간': 'bg-gray-400',
    '낮음': 'bg-gray-500',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${priorityColorMap[priority]}`}>{priority}</span>; 