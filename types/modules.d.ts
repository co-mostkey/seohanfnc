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
} 