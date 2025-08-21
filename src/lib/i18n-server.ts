// Server-side i18n utilities (no React hooks)

// Supported locales
export const locales = ['nl', 'es', 'en', 'de'] as const;
export type Locale = typeof locales[number];

// Locale names for display
export const localeNames: Record<Locale, string> = {
  nl: 'Nederlands',
  es: 'Español',
  en: 'English',
  de: 'Deutsch'
};

// Locale flags for UI
export const localeFlags: Record<Locale, string> = {
  nl: '🇳🇱',
  es: '🇪🇸', 
  en: '🇬🇧',
  de: '🇩🇪'
};

// Default locale
export const defaultLocale: Locale = 'nl';

// Translation cache
const translationCache: Record<string, any> = {};

/**
 * Load translations for a specific locale (server-side)
 */
export async function loadTranslationsServer(locale: Locale): Promise<any> {
  const cacheKey = locale;
  
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const translations = await import(`../../locales/${locale}/common.json`);
    translationCache[cacheKey] = translations.default;
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, falling back to ${defaultLocale}`);
    if (locale !== defaultLocale) {
      return loadTranslationsServer(defaultLocale);
    }
    return {};
  }
}

/**
 * Get nested object property by path
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Translation function (server-side)
 */
export function translateServer(
  translations: any,
  key: string,
  fallback?: string
): string {
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
 * Format date based on locale
 */
export function formatDate(date: Date, locale: Locale): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const localeMap = {
    nl: 'nl-NL',
    es: 'es-ES',
    en: 'en-US',
    de: 'de-DE'
  };
  
  return date.toLocaleDateString(localeMap[locale], options);
}

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: number, locale: Locale): string {
  const localeMap = {
    nl: 'nl-NL',
    es: 'es-ES', 
    en: 'en-US',
    de: 'de-DE'
  };
  
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: 'EUR' // All transactions in EUR for Spain
  }).format(amount);
}
