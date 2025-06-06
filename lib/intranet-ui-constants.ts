// [TRISID] 인트라넷 UI 테마 상수
export const INTRANET_UI = {
    // 배경색 - 다크 테마 기반
    BG_PRIMARY: 'bg-gray-900',
    BG_SECONDARY: 'bg-gray-800',
    BG_CARD: 'bg-gray-800/50 backdrop-blur-lg',
    BG_HOVER: 'hover:bg-gray-700/50',
    BG_ACTIVE: 'bg-blue-600/20',

    // 테두리
    BORDER: 'border-gray-700',
    BORDER_HOVER: 'hover:border-gray-600',
    BORDER_ACTIVE: 'border-blue-600/30',

    // 텍스트 색상
    TEXT_PRIMARY: 'text-white',
    TEXT_SECONDARY: 'text-gray-300',
    TEXT_MUTED: 'text-gray-400',
    TEXT_ACCENT: 'text-blue-400',

    // 버튼 스타일
    BUTTON_PRIMARY: 'bg-blue-600 hover:bg-blue-700 text-white',
    BUTTON_SECONDARY: 'bg-gray-700 hover:bg-gray-600 text-white',
    BUTTON_DANGER: 'bg-red-600 hover:bg-red-700 text-white',
    BUTTON_GHOST: 'hover:bg-gray-800/50 text-gray-400 hover:text-white',

    // 카드 스타일
    CARD: 'bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg',
    CARD_HOVER: 'hover:bg-gray-700/50 hover:border-gray-600',

    // 애니메이션
    TRANSITION: 'transition-all duration-200',

    // 그라데이션
    GRADIENT_BG: 'bg-gradient-to-br from-gray-900 via-slate-900 to-black',
    GRADIENT_CARD: 'bg-gradient-to-br from-gray-800/50 to-gray-900/50',
} as const;

// 인트라넷 폰트 스타일
export const INTRANET_FONT_STYLES = {
    HEADING_1: {
        fontSize: '2rem',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'white'
    },
    HEADING_2: {
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '1.3',
        color: 'white'
    },
    HEADING_3: {
        fontSize: '1.25rem',
        fontWeight: '500',
        lineHeight: '1.4',
        color: 'white'
    },
    BODY_TEXT: {
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        color: '#e5e5e5'
    },
    SMALL_TEXT: {
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.4',
        color: '#9ca3af'
    },
    MENU_ITEM: {
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.2'
    },
    BUTTON: {
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1',
        letterSpacing: '0.02em'
    }
} as const; 