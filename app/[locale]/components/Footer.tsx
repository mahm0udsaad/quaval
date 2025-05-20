"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, LinkedinIcon as LinkedIn, Instagram } from "lucide-react"
import { useTranslate } from "@/lib/i18n-client"

export default function Footer() {
  const { t, locale } = useTranslate()

  // Define navigation items with translation keys
  const navItems = [
    { key: 'products', label: t('navigation.products'), path: `/${locale}/products` },
    { key: 'about', label: t('navigation.about'), path: `/${locale}/about-us` },
    { key: 'services', label: t('navigation.services'), path: `/${locale}/services` },
    { key: 'contact', label: t('navigation.contact'), path: `/${locale}/contact` },
    { key: 'resources', label: t('footer.resources'), path: `/${locale}/resources` },
  ]

  return (
    <footer className="bg-gradient-to-br  from-primary-dark to-primary text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-5" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3AYNZkfFMTjKw4qXp4fHkySoTb6oo.png"
              alt={t('general.siteName')}
              width={150}
              height={35}
              className="mb-6 bg-white p-2 rounded"
            />
            <p className="text-gray-300">{t('footer.tagline')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.path}
                    className="hover:text-accent transition duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <p>{t('footer.address1')}</p>
            <p>{t('footer.address2')}</p>
            <p>{t('footer.phone')}</p>
            <p>{t('footer.email')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <p className="mb-4">{t('footer.newsletterText')}</p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="px-4 py-2 rounded-md sm:rounded-r-none text-secondary focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-accent text-white px-4 py-2 rounded-md sm:rounded-l-none mt-2 sm:mt-0 hover:bg-accent/80 focus:outline-none transition duration-300"
              >
                {t('footer.subscribe')}
              </button>
            </form>
            <div className="mt-6 flex space-x-4">
              {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, index) => (
                <a key={index} href="#" className="text-white hover:text-accent transition duration-300" aria-label={`Social media link ${index + 1}`}>
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
