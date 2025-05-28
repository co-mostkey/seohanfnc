'use client';

import { useTranslation, SupportedLocale } from '@/hooks/app/i18n/client/use-translation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

/**
 * 언어 전환 컴포넌트
 * 사용자가 애플리케이션 언어를 변경할 수 있는 드롭다운 메뉴 제공
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  // 언어 변경 핸들러
  const handleChangeLocale = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleChangeLocale('ko')}
          className={locale === 'ko' ? 'bg-accent' : ''}
        >
          {t('common.korean')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          {t('common.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
