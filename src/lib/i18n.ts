// Re-export server-side utilities
export {
  locales,
  localeNames,
  localeFlags,
  defaultLocale,
  formatDate,
  formatCurrency,
  type Locale
} from './i18n-server';

// Re-export context-based utilities
export { I18nProvider, useTranslations } from './i18n-context';
