'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useRouter, usePathname } from 'next/navigation';
import  Cookies from 'js-cookie';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Set the cookie
    Cookies.set('NEXT_LOCALE', newLocale, { 
      expires: 365,
      path: '/',
      sameSite: 'strict' 
    });
    
    // Calculate the new path by replacing the locale part
    const pathWithoutLocale = pathname.substring(3); // Remove /{locale} prefix
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Navigate to the new path
    router.push(newPath);
    window.location.reload();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t('language.label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage('en')}>
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('es')}>
          🇪🇸 Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage('fr')}>
          🇫🇷 Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 