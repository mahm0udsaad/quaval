'use client'

import { useTranslate } from '@/lib/i18n-client'

export default function ExampleTranslated() {
  const { t, locale, changeLanguage } = useTranslate()
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{t('general.welcome')}</h2>
      
      <div className="mt-4">
        <p>{t('home.heroSubtitle')}</p>
      </div>
      
      <div className="mt-4 space-x-2">
        <button 
          onClick={() => changeLanguage('en')} 
          className={`px-3 py-1 border rounded ${locale === 'en' ? 'bg-primary text-white' : ''}`}
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('ar')} 
          className={`px-3 py-1 border rounded ${locale === 'ar' ? 'bg-primary text-white' : ''}`}
        >
          {t('language.switchTo.ar')}
        </button>
      </div>
    </div>
  )
} 