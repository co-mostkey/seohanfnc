'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// 접근성 설정 인터페이스
interface AccessibilitySettings {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReaderMode: boolean;
    keyboardNavigation: boolean;
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
    announceToScreenReader: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// 접근성 프로바이더
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

    // 설정 로드
    useEffect(() => {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
                console.error('Failed to parse accessibility settings:', error);
            }
        }

        // 시스템 설정 감지
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setSettings(prev => ({ ...prev, reducedMotion: true }));
        }

        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        if (contrastQuery.matches) {
            setSettings(prev => ({ ...prev, highContrast: true }));
        }
    }, []);

    // 설정 저장 및 적용
    useEffect(() => {
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        applyAccessibilitySettings(settings);
    }, [settings]);

    const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));

        // 설정 변경 알림
        const settingNames = {
            highContrast: '고대비 모드',
            largeText: '큰 텍스트',
            reducedMotion: '애니메이션 감소',
            screenReaderMode: '스크린 리더 모드',
            keyboardNavigation: '키보드 네비게이션'
        };

        toast.success(`${settingNames[key]}가 ${value ? '활성화' : '비활성화'}되었습니다.`);
    };

    const announceToScreenReader = (message: string) => {
        const announcement = window.document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        window.document.body.appendChild(announcement);

        setTimeout(() => {
            window.document.body.removeChild(announcement);
        }, 1000);
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSetting, announceToScreenReader }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

// 접근성 설정 적용 함수
function applyAccessibilitySettings(settings: AccessibilitySettings) {
    const root = document.documentElement;

    // 고대비 모드
    if (settings.highContrast) {
        root.classList.add('high-contrast');
    } else {
        root.classList.remove('high-contrast');
    }

    // 큰 텍스트
    if (settings.largeText) {
        root.classList.add('large-text');
    } else {
        root.classList.remove('large-text');
    }

    // 애니메이션 감소
    if (settings.reducedMotion) {
        root.classList.add('reduced-motion');
    } else {
        root.classList.remove('reduced-motion');
    }

    // 스크린 리더 모드
    if (settings.screenReaderMode) {
        root.classList.add('screen-reader-mode');
    } else {
        root.classList.remove('screen-reader-mode');
    }
}

// 접근성 훅
export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
}

// 키보드 네비게이션 훅
export function useKeyboardNavigation() {
    const { settings } = useAccessibility();

    useEffect(() => {
        if (!settings.keyboardNavigation) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // ESC 키로 모달/드롭다운 닫기
            if (event.key === 'Escape') {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement && activeElement.blur) {
                    activeElement.blur();
                }
            }

            // Tab 키 네비게이션 개선
            if (event.key === 'Tab') {
                window.document.body.classList.add('keyboard-navigation');
            }
        };

        const handleMouseDown = () => {
            window.document.body.classList.remove('keyboard-navigation');
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [settings.keyboardNavigation]);
}

// 포커스 트랩 훅
export function useFocusTrap(isActive: boolean) {
    useEffect(() => {
        if (!isActive) return;

        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);

        // 첫 번째 요소에 포커스
        if (firstElement) {
            firstElement.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleTabKey);
        };
    }, [isActive]);
}

// 스크린 리더 전용 텍스트 컴포넌트
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
    return (
        <span className="sr-only">
            {children}
        </span>
    );
}

// 접근성 향상된 버튼 컴포넌트
export function AccessibleButton({
    children,
    onClick,
    ariaLabel,
    ariaDescribedBy,
    disabled = false,
    className = '',
    ...props
}: {
    children: React.ReactNode;
    onClick?: () => void;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    disabled?: boolean;
    className?: string;
    [key: string]: any;
}) {
    const { announceToScreenReader } = useAccessibility();

    const handleClick = () => {
        if (onClick) {
            onClick();
            if (ariaLabel) {
                announceToScreenReader(`${ariaLabel} 버튼이 클릭되었습니다.`);
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            disabled={disabled}
            className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

// 접근성 향상된 링크 컴포넌트
export function AccessibleLink({
    children,
    href,
    ariaLabel,
    external = false,
    className = '',
    ...props
}: {
    children: React.ReactNode;
    href: string;
    ariaLabel?: string;
    external?: boolean;
    className?: string;
    [key: string]: any;
}) {
    return (
        <a
            href={href}
            aria-label={ariaLabel}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={`focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
            {external && (
                <ScreenReaderOnly>
                    (새 창에서 열림)
                </ScreenReaderOnly>
            )}
        </a>
    );
}

// 접근성 설정 패널 컴포넌트
export function AccessibilityPanel() {
    const { settings, updateSetting } = useAccessibility();

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">접근성 설정</h3>

            <div className="space-y-3">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) => updateSetting('highContrast', e.target.checked)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>고대비 모드</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.largeText}
                        onChange={(e) => updateSetting('largeText', e.target.checked)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>큰 텍스트</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>애니메이션 감소</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.screenReaderMode}
                        onChange={(e) => updateSetting('screenReaderMode', e.target.checked)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>스크린 리더 모드</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.keyboardNavigation}
                        onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                        className="rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>키보드 네비게이션</span>
                </label>
            </div>
        </div>
    );
} 