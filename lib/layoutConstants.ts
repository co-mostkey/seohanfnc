// 레이아웃 관련 높이 및 패딩 클래스 상수

// 높이 값 정의 (실제 컴포넌트 높이에 맞춰 조정 필요)
export const HEADER_HEIGHT_CLASS = "h-16"; // GlobalNav 높이
export const FOOTER_HEIGHT_CLASS = "h-auto"; // 푸터 높이 자동 조정 (투명 레이어)
export const MOBILE_NAV_HEIGHT_CLASS = "h-14"; // MobileBottomNav 높이

// 위 높이 클래스에 대응하는 padding 클래스
export const MAIN_CONTENT_PT_CLASS = "pt-20"; // GlobalNav 높이만큼 top padding (5rem, 80px)
export const MAIN_CONTENT_PB_DESKTOP_CLASS = "lg:pb-0"; // 데스크탑에서는 푸터가 투명하므로 padding 불필요
export const MAIN_CONTENT_PB_MOBILE_CLASS = "pb-14";    // 모바일에서는 MobileBottomNav 높이 고려
