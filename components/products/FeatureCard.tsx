import React from 'react'
import {
  CheckCircle, Star, Award, Zap, Shield, BarChart2, Smartphone, Monitor, Settings, Maximize, Target,
  Clock, Link, Box, Map, Compass, LifeBuoy, Layers, GitBranch, Aperture, Cpu, Speaker, Wifi, Bluetooth, Battery, WrenchIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Map of icon names to actual icon components
const iconMap: Record<string, React.ReactNode> = {
  "check": <CheckCircle className="h-5 w-5" />,
  "star": <Star className="h-5 w-5" />,
  "award": <Award className="h-5 w-5" />,
  "zap": <Zap className="h-5 w-5" />,
  "shield": <Shield className="h-5 w-5" />,
  "chart": <BarChart2 className="h-5 w-5" />,
  "smartphone": <Smartphone className="h-5 w-5" />,
  "monitor": <Monitor className="h-5 w-5" />,
  "tool": <WrenchIcon className="h-5 w-5" />,
  "settings": <Settings className="h-5 w-5" />,
  "maximize": <Maximize className="h-5 w-5" />,
  "target": <Target className="h-5 w-5" />,
  "clock": <Clock className="h-5 w-5" />,
  "link": <Link className="h-5 w-5" />,
  "box": <Box className="h-5 w-5" />,
  "map": <Map className="h-5 w-5" />,
  "compass": <Compass className="h-5 w-5" />,
  "lifeBuoy": <LifeBuoy className="h-5 w-5" />,
  "layers": <Layers className="h-5 w-5" />,
  "gitBranch": <GitBranch className="h-5 w-5" />,
  "aperture": <Aperture className="h-5 w-5" />,
  "cpu": <Cpu className="h-5 w-5" />,
  "speaker": <Speaker className="h-5 w-5" />,
  "wifi": <Wifi className="h-5 w-5" />,
  "bluetooth": <Bluetooth className="h-5 w-5" />,
  "battery": <Battery className="h-5 w-5" />,
}

interface FeatureCardProps {
  title: string | {
    ko: string;
    en?: string;
    zh?: string;
  };
  description?: string | {
    ko: string;
    en?: string;
    zh?: string;
  };
  icon?: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon = "check",
  className
}: FeatureCardProps) {
  // Get the icon component from the iconMap or use CheckCircle as fallback
  const IconComponent = iconMap[icon] || <CheckCircle className="h-5 w-5" />

  // Process title
  const displayTitle = typeof title === 'string' ? title : (title.ko || title.en || '');

  // Process description
  const displayDescription = description
    ? (typeof description === 'string' ? description : (description.ko || description.en || ''))
    : '';

  return (
    <div className={cn(
      "group bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700",
      "hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-300",
      "transform hover:-translate-y-1 h-full",
      className
    )}>
      <div className="flex flex-col space-y-4">
        <div className="flex-shrink-0 p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 w-fit group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
          {IconComponent}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {displayTitle}
          </h3>
          {displayDescription && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {displayDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 