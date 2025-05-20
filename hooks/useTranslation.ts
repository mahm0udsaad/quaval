import { useTranslation as useNextTranslation } from 'next-i18next';
import { useParams } from 'next/navigation';

export function useTranslation(namespace = 'common') {
  const params = useParams();
  const locale = Array.isArray(params?.locale) 
    ? params?.locale[0] 
    : (params?.locale as string) || 'en';
  
  // Use the next-i18next hook
  const { t, i18n } = useNextTranslation(namespace);
  
  // Get the current direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  
  return { t, i18n, locale, dir };
} 