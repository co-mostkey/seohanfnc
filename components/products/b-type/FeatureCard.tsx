import React from 'react';
import { Shield, Check, Award, BadgeCheck } from 'lucide-react';

// 아이콘 타입 정의
export type IconType = 'shield' | 'check' | 'award' | 'badge';

// 컬러 타입 정의
export type ColorType = 'red' | 'blue' | 'green' | 'orange' | 'purple';

// 컴포넌트 props 인터페이스
interface FeatureCardProps {
  title: string;
  description: string;
  icon: IconType;
  color: ColorType;
}

/**
 * 제품 기능 카드 컴포넌트
 * 
 * 관리자 페이지에서 아이콘과 색상을 선택할 수 있도록 설계되었습니다.
 * 제품 상세 페이지의 인증 및 기능 아이콘으로 사용됩니다.
 */
const FeatureCard = ({ title, description, icon, color }: FeatureCardProps) => {
  // 아이콘 매핑 함수
  const getIcon = () => {
    switch(icon) {
      case 'shield':
        return <Shield className="h-5 w-5" />;
      case 'check':
        return <Check className="h-5 w-5" />;
      case 'award':
        return <Award className="h-5 w-5" />;
      case 'badge':
        return <BadgeCheck className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };
  
  // 색상 클래스 매핑 함수
  const getColorClass = () => {
    const colors: Record<ColorType, { bg: string, border: string, textIcon: string }> = {
      red: { 
        bg: 'bg-red-900/20', 
        border: 'border-red-900/30',
        textIcon: 'text-red-400'
      },
      blue: { 
        bg: 'bg-blue-900/20', 
        border: 'border-blue-900/30',
        textIcon: 'text-blue-400'
      },
      green: { 
        bg: 'bg-green-900/20', 
        border: 'border-green-900/30',
        textIcon: 'text-green-400'
      },
      orange: { 
        bg: 'bg-orange-900/20', 
        border: 'border-orange-900/30',
        textIcon: 'text-orange-400'
      },
      purple: { 
        bg: 'bg-purple-900/20', 
        border: 'border-purple-900/30',
        textIcon: 'text-purple-400'
      }
    };
    
    return colors[color] || colors.red;
  };

  // 색상 스타일 가져오기
  const colorClasses = getColorClass();

  return (
    <div 
      className={`flex items-center p-3.5 rounded-lg ${colorClasses.bg} border ${colorClasses.border} hover:bg-opacity-40 transition-colors`}
    >
      <div className={`p-2 rounded-full ${colorClasses.bg} bg-opacity-150 mr-3`}>
        <span className={colorClasses.textIcon}>
          {getIcon()}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
