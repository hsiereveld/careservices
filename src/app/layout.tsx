import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider, ConsentBanner } from "@/contexts/auth-context";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/brand-colors.css";
import { ConditionalSiteHeader } from "@/components/conditional-site-header";
import { ConditionalSiteFooter } from "@/components/conditional-site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Care & Service - Tu Plataforma de Servicios",
  description:
    "Care & Service conecta inmigrantes y expatriados en España con profesionales locales. Encuentra servicios de calidad en tu idioma: cuidado, técnico, administrativo, transporte y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <ConditionalSiteHeader />
                <main className="flex-1">
                  {children}
                </main>
                <ConditionalSiteFooter />
              </div>
              <ConsentBanner />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
