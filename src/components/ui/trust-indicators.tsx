'use client';

import { useTranslations } from '@/lib/i18n';

interface TrustIndicatorsProps {
  className?: string;
}

export function TrustIndicators({ className = "" }: TrustIndicatorsProps) {
  const { t } = useTranslations();
  return (
    <section className={`py-12 bg-gray-50/50 dark:bg-gray-800/50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('trust.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300" suppressHydrationWarning>
            {t('trust.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">5,000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('trust.stats.servicesCompleted')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">1,200+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('trust.stats.professionalVerified')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">4.8★</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('trust.stats.averageRating')}</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">24u</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('trust.stats.responseTime')}</div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('trust.badges.identityVerification')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🛡️</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('trust.badges.securePayments')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📞</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('trust.badges.support247')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
