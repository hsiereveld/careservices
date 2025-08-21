'use client';

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useTranslations();
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <span className="font-bold text-lg" suppressHydrationWarning>Care & Service</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.services.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/servicios/salud" className="hover:text-primary">{t('footer.services.healthcare')}</Link></li>
              <li><Link href="/servicios/tecnico" className="hover:text-primary">{t('footer.services.technical')}</Link></li>
              <li><Link href="/servicios/administrativo" className="hover:text-primary">{t('footer.services.childcare')}</Link></li>
              <li><Link href="/servicios/transporte" className="hover:text-primary">{t('footer.services.transport')}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.company.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sobre-nosotros" className="hover:text-primary">{t('footer.company.about')}</Link></li>
              <li><Link href="/como-funciona" className="hover:text-primary">{t('footer.company.careers')}</Link></li>
              <li><Link href="/profesionales" className="hover:text-primary">{t('footer.company.press')}</Link></li>
              <li><Link href="/contacto" className="hover:text-primary">{t('footer.company.contact')}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.support.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ayuda" className="hover:text-primary">{t('footer.support.help')}</Link></li>
              <li><Link href="/terminos" className="hover:text-primary">{t('footer.support.terms')}</Link></li>
              <li><Link href="/privacidad" className="hover:text-primary">{t('footer.support.privacy')}</Link></li>
              <li><Link href="/chat" className="hover:text-primary">{t('footer.support.safety')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p suppressHydrationWarning>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
