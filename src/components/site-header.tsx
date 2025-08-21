'use client';

import Link from "next/link"
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslations } from "@/lib/i18n";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  const { t } = useTranslations();
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">
            <Link
              href="/"
              className="bg-clip-text text-transparent [background-image:linear-gradient(90deg,color-mix(in_oklab,var(--primary)_85%,white_0%),color-mix(in_oklab,var(--primary)_50%,white_0%))] hover:opacity-90 flex items-center gap-2"
            >
              <span className="text-3xl">🤝</span>
              <span suppressHydrationWarning>Care & Service</span>
            </Link>
          </h1>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/services" className="hover:text-primary transition-colors">
              {t('nav.services')}
            </Link>
            <Link href="/how-it-works" className="hover:text-primary transition-colors">
              {t('nav.howItWorks')}
            </Link>
            <Link href="/professionals" className="hover:text-primary transition-colors">
              {t('nav.forProfessionals')}
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher variant="compact" />
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
