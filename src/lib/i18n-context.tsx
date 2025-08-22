'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, type SupportedLocale } from './translations';

interface I18nContextType {
  locale: string;
  t: (key: string, fallback?: string) => string;
  changeLocale: (newLocale: string) => void;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Get nested object property by path
 */
function getNestedProperty(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Translation function
 */
function translate(translations: Record<string, unknown>, key: string, fallback?: string): string {
  const value = getNestedProperty(translations, key);
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (fallback) {
    return fallback;
  }
  
  // Return the key if no translation found (for debugging)
  return `[${key}]`;
}

/**
 * Load translations for a specific locale
 */
function loadTranslations(locale: string): Record<string, unknown> {
  // Check if locale is supported
  if (locale in translations) {
    return translations[locale as SupportedLocale];
  }
  
  // Fallback to Dutch
  console.warn(`Locale ${locale} not supported, falling back to nl`);
  return translations.nl;
}

/**
 * Get locale from browser or localStorage
 */
function detectLocale(): string {
  // Import at function level to avoid circular dependency
  const { locales, defaultLocale } = require('./i18n-server');
  
  // Server-side detection
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  // Check localStorage preference first
  try {
    const savedLocale = localStorage.getItem('care-service-locale');
    if (savedLocale && locales.includes(savedLocale)) {
      return savedLocale;
    }
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
  }

  // Browser language detection
  try {
    const browserLocale = navigator.language.split('-')[0];
    if (locales.includes(browserLocale)) {
      return browserLocale;
    }
  } catch (error) {
    console.warn('Failed to detect browser language:', error);
  }

  return defaultLocale;
}

/**
 * Save locale preference
 */
function saveLocalePreference(locale: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('care-service-locale', locale);
    } catch (error) {
      console.warn('Failed to save locale preference:', error);
    }
  }
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<string>('nl');
  const [currentTranslations, setCurrentTranslations] = useState<any>(translations.nl);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize locale on mount
  useEffect(() => {
    const detectedLocale = detectLocale();
    if (detectedLocale !== 'nl') {
      setLocale(detectedLocale);
      const trans = loadTranslations(detectedLocale);
      setCurrentTranslations(trans);
    }
  }, []);

  // Update translations when locale changes
  useEffect(() => {
    const trans = loadTranslations(locale);
    setCurrentTranslations(trans);
  }, [locale]);

  const t = (key: string, fallback?: string) => 
    translate(currentTranslations, key, fallback);

  const changeLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      setIsLoading(true);
      setLocale(newLocale);
      saveLocalePreference(newLocale);
      
      // Small delay to show that something is happening
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  const value: I18nContextType = {
    locale,
    t,
    changeLocale,
    isLoading
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context;
}
