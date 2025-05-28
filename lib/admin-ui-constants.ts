/**
 * 관리자 페이지 UI 관련 상수 및 설정 - 다크 테마
 */

// 주요 색상 (Tailwind 클래스명)
export const ADMIN_UI = {
    // 배경 색상
    BG_PRIMARY: "bg-black",
    BG_SECONDARY: "bg-gray-900",
    BG_MODAL: "bg-black/70",
    BG_ACCENT: "bg-orange-950",
    BG_CARD: "bg-gray-800",
    BG_INPUT: "bg-gray-800",
    BG_HOVER: "hover:bg-gray-700",
    BG_ACCENT_HOVER: "hover:bg-orange-900/70",

    // 텍스트 색상
    TEXT_PRIMARY: "text-gray-50",
    TEXT_SECONDARY: "text-gray-300",
    TEXT_MUTED: "text-gray-400",
    TEXT_ACCENT: "text-orange-400",
    TEXT_LINK: "text-orange-400 hover:text-orange-300",
    ACCENT_COLOR_FG: "text-orange-400",

    // 액션 색상
    BUTTON_PRIMARY: "bg-orange-700 hover:bg-orange-600 text-white font-medium",
    BUTTON_SECONDARY: "bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium",
    BUTTON_OUTLINE: "border border-gray-600 hover:bg-gray-800 text-gray-200 font-medium",
    BUTTON_DANGER: "bg-red-700 hover:bg-red-600 text-white font-medium",

    // 상태 색상
    SUCCESS: "bg-green-800 text-green-100 font-medium border border-green-700",
    WARNING: "bg-amber-800 text-amber-100 font-medium border border-amber-700",
    ERROR: "bg-red-800 text-red-100 font-medium border border-red-700",
    INFO: "bg-blue-800 text-blue-100 font-medium border border-blue-700",

    // 테두리
    BORDER_LIGHT: "border-gray-700",
    BORDER_MEDIUM: "border-gray-600",
    BORDER_ACCENT: "border border-orange-700",
    BORDER_FOCUS: "focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/50",

    // 폰트 크기
    TEXT_XS: "text-xs",
    TEXT_SM: "text-sm",
    TEXT_BASE: "text-base",
    TEXT_LG: "text-lg",
    TEXT_XL: "text-xl",
    TEXT_2XL: "text-2xl",

    // 폰트 패밀리
    FONT_SANS: "font-sans",
    FONT_SERIF: "font-serif",

    // 그림자
    SHADOW_SM: "shadow-sm shadow-black/30",
    SHADOW_MD: "shadow shadow-black/30",
    SHADOW_LG: "shadow-md shadow-black/30",

    // 패딩
    PADDING_CARD: "p-4",
    PADDING_CONTAINER: "p-4 md:p-6",

    // 반경
    ROUNDED_DEFAULT: "rounded-md",
    ROUNDED_FULL: "rounded-full",

    // 애니메이션
    TRANSITION: "transition-all duration-200",

    // 레이아웃
    FLEX_CENTER: "flex items-center justify-center",
    FLEX_BETWEEN: "flex items-center justify-between",
    FLEX_START: "flex items-center justify-start",
    FLEX_END: "flex items-center justify-end",
    GRID_DEFAULT: "grid gap-4",
    GRID_COLS_2: "grid-cols-1 md:grid-cols-2",
    GRID_COLS_3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    GRID_COLS_4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

// 섹션별 헤딩 스타일
export const ADMIN_HEADING_STYLES = {
    PAGE_TITLE: "text-2xl font-bold text-gray-50 mb-2 font-serif",
    SECTION_TITLE: "text-lg font-semibold text-gray-100 mb-2 font-serif",
    CARD_TITLE: "text-base font-medium text-gray-100 font-serif",
    SUBSECTION_TITLE: "text-sm font-medium text-gray-200 font-serif",
};

// 폰트 인라인 스타일 (직접 적용)
export const ADMIN_FONT_STYLES = {
    PAGE_TITLE: { fontFamily: 'var(--font-playfair)' },
    SECTION_TITLE: { fontFamily: 'var(--font-playfair)' },
    CARD_TITLE: { fontFamily: 'var(--font-playfair)' },
    HEADING: { fontFamily: 'var(--font-playfair)' },
    DIALOG_TITLE: { fontFamily: 'var(--font-playfair)' },
    DIALOG_DESCRIPTION: { fontFamily: 'var(--font-inter)' },
    BODY_TEXT: { fontFamily: 'var(--font-inter)' },
    TABLE_HEADER: { fontFamily: 'var(--font-playfair)', fontWeight: 500 },
    BADGE: { fontFamily: 'var(--font-inter)', fontWeight: 500 },
    BUTTON: { fontFamily: 'var(--font-inter)', fontWeight: 500 },
    MENU_ITEM: { fontFamily: 'var(--font-inter)' },
};

// 카드 스타일
export const ADMIN_CARD_STYLES = {
    DEFAULT: "bg-gray-800 border border-gray-700 rounded-lg shadow-sm",
    ACCENT: "bg-orange-900/80 border border-orange-800 rounded-lg shadow-sm",
    FEATURED: "bg-orange-950/50 border border-orange-900/50 rounded-lg shadow-sm",
    HEADER: "p-4 bg-gray-900 border-b border-gray-700 font-medium",
    CONTENT: "p-4",
    FOOTER: "p-4 bg-gray-900 border-t border-gray-700",
    HOVER: "transition-colors duration-200 hover:bg-gray-750 hover:border-gray-600",
    STATS: "bg-gray-800 border border-gray-700 rounded-lg shadow-sm p-4 hover:bg-gray-800/80 transition-colors",
};

// 입력 스타일
export const ADMIN_INPUT_STYLES = {
    WRAPPER: "space-y-1.5",
    LABEL: "text-sm font-medium text-gray-200",
    INPUT: "w-full rounded-md border border-gray-600 bg-gray-800 text-gray-100 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50",
    HELPER: "text-xs text-gray-400",
    ERROR: "text-xs text-red-400 font-medium",
    FOCUSED: "border-orange-500 ring-2 ring-orange-500/50",
};

// 테이블 스타일
export const ADMIN_TABLE_STYLES = {
    WRAPPER: "border border-gray-700 rounded-lg shadow-sm overflow-hidden",
    HEADER: "bg-gray-900 text-gray-200 font-medium font-serif",
    ROW_HOVER: "hover:bg-gray-700/70",
    ROW_SELECTED: "bg-orange-900/20 border-l-2 border-l-orange-600",
    ROW_UNREAD: "bg-gray-800/80",
    CELL_PADDING: "p-3",
    PAGINATION: "flex items-center justify-between mt-4 text-sm text-gray-400",
    SORTABLE_HEADER: "cursor-pointer hover:text-orange-400 flex items-center",
};

// 버튼 크기 (Tailwind의 button 컴포넌트와 함께 사용)
export const ADMIN_BUTTON_SIZES = {
    XS: "h-7 rounded-md px-2 text-xs font-medium",
    SM: "h-8 rounded-md px-3 text-xs font-medium",
    DEFAULT: "h-9 rounded-md px-4 text-sm font-medium",
    LG: "h-10 rounded-md px-6 font-medium",
    XL: "h-12 rounded-md px-8 text-base font-medium",
};

// 아이콘 크기
export const ADMIN_ICON_SIZES = {
    XS: "h-3 w-3",
    SM: "h-4 w-4",
    DEFAULT: "h-5 w-5",
    LG: "h-6 w-6",
    XL: "h-8 w-8",
}; 