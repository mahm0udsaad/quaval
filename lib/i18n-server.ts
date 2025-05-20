import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { Language } from './i18n-client'
import fs from 'fs'
import path from 'path'

// Server-side language resources cache
const languageResources: Record<string, any> = {}

// Function to load translation files synchronously
const loadTranslationSync = (locale: string, ns: string = 'common') => {
  const cacheKey = `${locale}:${ns}`
  
  // Return from cache if already loaded
  if (languageResources[cacheKey]) {
    return languageResources[cacheKey]
  }
  
  try {
    const filePath = path.join(process.cwd(), 'locales', locale, `${ns}.json`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const resources = JSON.parse(fileContent)
    
    // Cache the resources
    languageResources[cacheKey] = resources
    return resources
  } catch (error) {
    console.error(`Failed to load translation file ${locale}/${ns}`, error)
    return {}
  }
}

// Load translations for all supported languages at module initialization
const supportedLanguages: Language[] = ['en', 'es', 'fr']
const namespaces = ['common']

for (const lang of supportedLanguages) {
  for (const ns of namespaces) {
    loadTranslationSync(lang, ns)
  }
}

// Initialize i18next for server-side
export async function initTranslations(locale: Language, ns: string[] = ['common']) {
  const i18nInstance = createInstance()
  
  // Prepare resources object for initialization
  const resources: Record<string, Record<string, any>> = {}
  
  supportedLanguages.forEach(lang => {
    resources[lang] = {}
    ns.forEach(namespace => {
      resources[lang][namespace] = languageResources[`${lang}:${namespace}`] || {}
    })
  })
  
  await i18nInstance
    .use(initReactI18next)
    .init({
      supportedLngs: supportedLanguages,
      fallbackLng: 'en',
      lng: locale,
      fallbackNS: 'common',
      defaultNS: 'common',
      ns,
      resources
    })

  return {
    i18n: i18nInstance,
    t: i18nInstance.getFixedT(locale, ns[0]),
    resources: languageResources[`${locale}:${ns[0]}`] || {},
  }
}

// Simple translation helper for server components
export function getTranslation(locale: Language, key: string, ns: string = 'common') {
  const resources = languageResources[`${locale}:${ns}`] || {}
  
  // Split the key by dots and traverse the resources object
  const parts = key.split('.')
  let value = resources
  
  for (const part of parts) {
    if (!value || !value[part]) {
      return key // Return the key if translation is not found
    }
    value = value[part]
  }
  
  return typeof value === 'string' ? value : key
} 