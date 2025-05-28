// 이 파일은 더 이상 사용하지 않습니다.
// AdminRecentActivitySection.tsx 내부에서 직접 상태 아이콘을 처리합니다.
// 필요한 경우 AdminRecentActivitySection.tsx를 참조하세요.

// 아래 코드는 이전 구현을 보존합니다.

import React from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

interface StatusIconProps {
    status: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
    switch (status) {
        case 'success':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'info':
            return <Info className="h-5 w-5 text-blue-500" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'error':
            return <XCircle className="h-5 w-5 text-red-500" />;
        default:
            return <Info className="h-5 w-5 text-blue-500" />;
    }
}; 