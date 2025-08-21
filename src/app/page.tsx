"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrustIndicators } from "@/components/ui/trust-indicators";

import { ChatWidget } from "@/components/chat/chat-widget";
import { AnimatedText } from "@/components/ui/animated-text";
import { useTranslations } from "@/lib/i18n";

export default function Home() {
  const { t, isLoading } = useTranslations();
  
  // Define the animated words in all languages with their colors
  const immigrantWords = [
    'Immigranten',    // Dutch (primary blue)
    'Immigrants',     // English (green)
    'Inmigrantes',    // Spanish (orange)
    'Einwanderer'     // German (purple)
  ];
  
  const wordColors = [
    '#2563eb',  // Blue (Dutch)
    '#059669',  // Green (English)
    '#ea580c',  // Orange (Spanish)
    '#7c3aed'   // Purple (German)
  ];
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('chat.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-100 px-4 py-2 rounded-full text-sm font-medium">
                  🌟 {t('hero.badge')}
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight md:leading-tight">
                  {t('hero.title.connecting')}{' '}
                  <AnimatedText 
                    words={immigrantWords}
                    colors={wordColors}
                    interval={2500}
                    className="font-bold"
                  />
                  {' '}{t('hero.title.withProfessionals')}
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed" suppressHydrationWarning>
                  {t('hero.description')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  <span className="mr-2">🔍</span>
                  {t('hero.buttons.findServices')}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 border-2 border-brand-600 text-brand-600 bg-white hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-900 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-950"
                >
                  <span className="mr-2">👨‍💼</span>
                  {t('hero.buttons.becomeProfessional')}
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {t('hero.features.freeVerification')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {t('hero.features.support247')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {t('hero.features.securePayments')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-primary-300 rounded-full opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-400 rounded-full opacity-25 animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>
        </section>

      {/* Service Categories */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="font-semibold mb-2">{t('services.categories.healthcare.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.healthcare.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="font-semibold mb-2">{t('services.categories.technical.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.technical.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">{t('services.categories.administrative.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.administrative.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">👶</div>
              <h3 className="font-semibold mb-2">{t('services.categories.childcare.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.childcare.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="font-semibold mb-2">{t('services.categories.transport.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.transport.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="font-semibold mb-2">{t('services.categories.sports.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.sports.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-semibold mb-2">{t('services.categories.social.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.social.description')}
              </p>
            </div>
            <div className="p-6 bg-background border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-semibold mb-2">{t('services.categories.domestic.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('services.categories.domestic.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('howItWorks.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold mb-2">{t('howItWorks.steps.search.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('howItWorks.steps.search.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold mb-2">{t('howItWorks.steps.connect.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('howItWorks.steps.connect.description')}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-semibold mb-2">{t('howItWorks.steps.book.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('howItWorks.steps.book.description')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
            <p className="text-muted-foreground" suppressHydrationWarning>
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="glow">
                <Link href="/dashboard">{t('cta.buttons.exploreServices')}</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/chat">{t('cta.buttons.chatWithAI')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />
    </main>

    {/* AI Chat Widget */}
    <ChatWidget />
    </>
  );
}
