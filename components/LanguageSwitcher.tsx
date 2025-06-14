'use client';

import { useTranslate } from '@/lib/i18n-client';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { languageStorage, type Language } from '@/lib/language-storage';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
] as const;

export default function LanguageSwitcher() {
  const { t, locale } = useTranslate();
  const router = useRouter();
  const pathname = usePathname();

  // Memoize current language to prevent unnecessary re-renders
  const currentLanguage = useMemo(() => {
    return LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];
  }, [locale]);

  // Optimized language change handler
  const handleLanguageChange = useCallback((newLocale: Language) => {
    if (newLocale === locale) return;
    
    console.log(`Changing language from ${locale} to ${newLocale}`);
    
    // Save to localStorage immediately
    languageStorage.setLanguage(newLocale);
    
    // Build new URL path
    const segments = pathname.split('/');
    let newPath: string;
    
    if (segments[1] && LANGUAGES.some(lang => lang.code === segments[1])) {
      // Replace existing locale in URL
      segments[1] = newLocale;
      newPath = segments.join('/');
    } else {
      // Add locale to URL if not present
      newPath = `/${newLocale}${pathname}`;
    }
    
    console.log(`Navigating to: ${newPath}`);
    
    // Simple navigation without reload - let Next.js handle the re-rendering
    router.push(newPath);
    
  }, [locale, pathname, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t('language.label')}</span>
          {/* Show current language indicator */}
          <span className="absolute -top-1 -right-1 text-xs">
            {currentLanguage.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language.code as Language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </span>
            {locale === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 