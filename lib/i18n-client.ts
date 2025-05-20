'use client'

import i18next from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

export type Language = 'en' | 'es' | 'fr'

// Load resources from the locales directory
const getResources = (locale: string, namespace: string) => {
  try {
    return import(`@/locales/${locale}/${namespace}.json`)
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}`, error)
    return Promise.resolve({})
  }
}

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend(getResources))
  .init({
    supportedLngs: ['en', 'es', 'fr'],
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    },
  })

export function useTranslate() {
  const { t, i18n } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as Language) || 'en'
  
  // Set document direction based on language
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = 'ltr'
  }, [locale])

  // Change language
  const changeLanguage = useCallback((language: Language) => {
    const pathname = window.location.pathname
    const currentLang = locale
    
    // If the language is already selected, do nothing
    if (language === currentLang) return

    // Get the pathname without the locale
    const pathWithoutLocale = pathname.replace(`/${currentLang}`, '') || '/'
    
    // Build the new path with the new locale
    const newPath = `/${language}${pathWithoutLocale}`
    
    // Change the language
    i18n.changeLanguage(language)
    
    // Navigate to the new path
    router.push(newPath)
  }, [locale, router, i18n])

  return {
    t,
    locale,
    changeLanguage,
    direction: 'ltr',
  }
} 