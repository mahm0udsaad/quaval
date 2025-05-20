import { getTranslation } from '@/lib/i18n-server'
import type { Language } from '@/lib/i18n-client'

interface ServerTranslatedExampleProps {
  locale: Language
}

export default function ServerTranslatedExample({ locale }: ServerTranslatedExampleProps) {
  return (
    <div className="p-4 border-t mt-4">
      <h2 className="text-xl font-bold">
        {getTranslation(locale, 'general.siteName')}
      </h2>
      
      <div className="mt-4">
        <p>{getTranslation(locale, 'home.featuredProducts')}</p>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          {getTranslation(locale, 'footer.copyright')}
        </p>
      </div>
    </div>
  )
} 