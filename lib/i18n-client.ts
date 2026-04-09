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

// Custom localStorage detector for i18next
const customDetector = {
  name: 'customLocalStorage',
  lookup() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('preferredLanguage') || 'en'
    }
    return 'en'
  },
  cacheUserLanguage(lng: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', lng)
    }
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
      order: ['customLocalStorage', 'path', 'htmlTag', 'cookie', 'navigator'],
      caches: ['cookie'],
      lookupLocalStorage: 'preferredLanguage',
    },
    react: {
      useSuspense: false,
    },
  })

// Add custom detector
i18next.services.languageDetector.addDetector(customDetector)

export function useTranslate() {
  const { t, i18n } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as Language) || 'en'
  
  // Set document direction based on language
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = 'ltr'
    
    // Sync i18next language with current locale
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  // Change language
  const changeLanguage = useCallback((language: Language) => {
    const pathname = window.location.pathname
    const currentLang = locale
    
    // If the language is already selected, do nothing
    if (language === currentLang) return

    try {
      // Save to localStorage
      localStorage.setItem('preferredLanguage', language)
      
      // Change the i18next language
      i18n.changeLanguage(language)

      // Get the pathname without the locale
      const pathWithoutLocale = pathname.replace(`/${currentLang}`, '') || '/'
      
      // Build the new path with the new locale
      const newPath = `/${language}${pathWithoutLocale}`
      
      // Navigate to the new path
      router.push(newPath)
      
      console.log(`Language changed to: ${language}`)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }, [locale, router, i18n])

  return {
    t,
    locale,
    changeLanguage,
    direction: 'ltr',
  }
} 