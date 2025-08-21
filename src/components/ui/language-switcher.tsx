'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';
import { 
  locales, 
  localeNames, 
  localeFlags, 
  useTranslations,
  type Locale 
} from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact' | 'icon-only';
}

export function LanguageSwitcher({ 
  className = '', 
  variant = 'default' 
}: LanguageSwitcherProps) {
  const { locale: currentLocale, changeLocale } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === currentLocale || isLoading) return;
    
    setIsLoading(true);
    
    try {
      changeLocale(newLocale);
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentFlag = localeFlags[currentLocale as Locale];
  const currentName = localeNames[currentLocale as Locale];

  if (variant === 'icon-only') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`w-10 h-10 p-0 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`flex items-center gap-2 ${
                locale === currentLocale ? 'bg-accent' : ''
              }`}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${className}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-lg">{currentFlag}</span>
                <span className="text-sm font-medium">{currentLocale.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`flex items-center gap-2 ${
                locale === currentLocale ? 'bg-accent' : ''
              }`}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-lg">{currentFlag}</span>
              <span className="hidden sm:inline">{currentName}</span>
              <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`flex items-center gap-3 p-3 ${
              locale === currentLocale ? 'bg-accent' : ''
            }`}
          >
            <span className="text-xl">{localeFlags[locale]}</span>
            <div className="flex flex-col">
              <span className="font-medium">{localeNames[locale]}</span>
              <span className="text-xs text-muted-foreground">
                {locale.toUpperCase()}
              </span>
            </div>
            {locale === currentLocale && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
