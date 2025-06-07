declare module 'lucide-react' {
    import { FC, SVGProps } from 'react'
    export type Icon = FC<SVGProps<SVGSVGElement>>
    export const ArrowRight: Icon
    export const Shield: Icon
    export const Award: Icon
    export const Clock: Icon
    export const ChevronUp: Icon
    export const Users: Icon
    export const Building: Icon
    export const Briefcase: Icon
    export const Calendar: Icon
    export const TrendingUp: Icon
    export const Map: Icon
    export const Truck: Icon
    export const Medal: Icon
    export const FileText: Icon
    export const Layers: Icon
    export const LogIn: Icon
    export const Home: Icon
    export const ChevronLeft: Icon
    export const AlertTriangle: Icon
    export const CheckCircle: Icon
    export const ChevronRight: Icon
    export const Building2: Icon
    export const Download: Icon
    export const FileIcon: Icon
    export const MoreHorizontal: Icon
    export const Globe: Icon
    export const Bell: Icon
    export const Newspaper: Icon
    export const ArrowLeft: Icon
    export const Check: Icon
    export const BadgeCheck: Icon
    export const ExternalLink: Icon
    export const Activity: Icon
    export const Film: Icon
    export const MessageSquare: Icon
    export const Maximize: Icon
    export const Star: Icon
    export const Zap: Icon
    export const BarChart2: Icon
    export const Smartphone: Icon
    export const Monitor: Icon
    export const Settings: Icon
    export const Target: Icon
    export const Link: Icon
    export const Box: Icon
    export const Compass: Icon
    export const LifeBuoy: Icon
    export const GitBranch: Icon
    export const Aperture: Icon
    export const Cpu: Icon
    export const Speaker: Icon
    export const Wifi: Icon
    export const Bluetooth: Icon
    export const Battery: Icon
    export const WrenchIcon: Icon
    export const RotateCcw: Icon
    export const ZoomIn: Icon
    export const ZoomOut: Icon
    export const Play: Icon
    export const Pause: Icon
    export const Info: Icon
    export const CheckCircle2: Icon
    export const Eye: Icon
    export const Tag: Icon
    export const AlertCircle: Icon
    export const Moon: Icon
    export const Sun: Icon
    export const ChevronDown: Icon
    export const X: Icon
    export const Circle: Icon
    export const Printer: Icon
    export const FileSpreadsheet: Icon
    export const FileImage: Icon
    export const FileBox: Icon
    export const RotateCw: Icon
    export const Dot: Icon
    export const GripVertical: Icon
    export const PanelLeft: Icon
    export const Package: Icon
    export const Mail: Icon
    export const Grid: Icon
    export const LucideIcon: Icon
    export const BellRing: Icon
    export const User: Icon
    export const Search: Icon
    export const MonitorIcon: Icon
    export const MoveIcon: Icon
}

declare module 'framer-motion' {
    import { FC, ReactNode, CSSProperties } from 'react'

    export interface MotionProps {
        initial?: any
        animate?: any
        exit?: any
        transition?: any
        variants?: any
        whileHover?: any
        whileTap?: any
        whileInView?: any
        drag?: boolean | 'x' | 'y'
        dragConstraints?: any
        dragElastic?: number
        onDragEnd?: any
        className?: string
        style?: CSSProperties
        children?: ReactNode
        [key: string]: any
    }

    export const motion: {
        div: FC<MotionProps>
        section: FC<MotionProps>
        article: FC<MotionProps>
        header: FC<MotionProps>
        footer: FC<MotionProps>
        main: FC<MotionProps>
        nav: FC<MotionProps>
        aside: FC<MotionProps>
        video: FC<MotionProps>
        // 필요한 HTML 요소들을 더 추가할 수 있습니다
    }

    export const AnimatePresence: FC<{ children?: ReactNode; mode?: 'wait' | 'sync' | 'popLayout' }>
    export function useScroll(): any
    export function useMotionValue(initial: number): any
    export function useTransform(value: any, input: number[], output: any[]): any
    export function useInView(): any
    export function useAnimation(): any
} 