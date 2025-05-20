import "../globals.css"

import Header from "./components/Header"
import Footer from "./components/Footer"
import { CartProvider } from "./contexts/CartContext"
import { CountryProvider } from "./contexts/CountryContext"
import { CurrencyProvider } from "./contexts/CurrencyContext"
import { AuthProvider } from "./contexts/AuthContext"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import type React from "react"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const titles = {
    en: "Quaval Bearings - High-Quality Industrial Bearings",
    es: "Quaval Bearings - Rodamientos Industriales de Alta Calidad",
    fr: "Quaval Bearings - Roulements Industriels de Haute Qualité"
  };
  
  const descriptions = {
    en: "Quaval Bearings specializes in high-quality industrial bearings, offering precision and reliability for various applications.",
    es: "Quaval Bearings se especializa en rodamientos industriales de alta calidad, ofreciendo precisión y fiabilidad para diversas aplicaciones.",
    fr: "Quaval Bearings se spécialise dans les roulements industriels de haute qualité, offrant précision et fiabilité pour diverses applications."
  };
  
  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    generator: 'v0.dev'
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <AuthProvider>
          <CartProvider>
            <CountryProvider>
              <CurrencyProvider>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </CurrencyProvider>
            </CountryProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 