const fileTypeColorMap: Record<string, string> = {
    pdf: 'bg-gray-500',
    doc: 'bg-gray-700',
    xls: 'bg-gray-600',
    ppt: 'bg-gray-400',
    etc: 'bg-gray-300',
};

return <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${fileTypeColorMap[type]}`}>{type}</span>; 