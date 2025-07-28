"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, LinkedinIcon as LinkedIn, Instagram } from "lucide-react"
import { useTranslate } from "@/lib/i18n-client"
import { getFooterContent, type FooterContent } from "@/lib/api"

// Icon mapping for social media
const SocialIconMap: Record<string, any> = {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
}

export default function Footer() {
  const { t, locale } = useTranslate()
  const [footerContent, setFooterContent] = useState<FooterContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFooterContent = async () => {
      setIsLoading(true)
      try {
        const data = await getFooterContent(locale)
        setFooterContent(data)
      } catch (error) {
        console.error("Error fetching footer content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterContent()
  }, [locale])

  // Helper functions to get content
  const getContentByKey = (key: string) => {
    return footerContent.find(item => item.content_key === key && item.is_enabled)
  }

  const getContentsByType = (type: string) => {
    return footerContent.filter(item => item.content_type === type && item.is_enabled)
  }

  const renderSocialIcon = (iconName: string, className: string = "") => {
    const IconComponent = SocialIconMap[iconName]
    return IconComponent ? <IconComponent className={className} /> : null
  }

  // Fallback content while loading or if no content is available
  const navItems = [
    { key: 'products', label: t('navigation.products'), path: `/${locale}/products` },
    { key: 'about', label: t('navigation.about'), path: `/${locale}/about-us` },
    { key: 'services', label: t('navigation.services'), path: `/${locale}/services` },
    { key: 'contact', label: t('navigation.contact'), path: `/${locale}/contact` },
    { key: 'resources', label: t('footer.resources'), path: `/${locale}/resources` },
  ]

  if (isLoading) {
    return (
      <footer className="bg-gradient-to-br from-primary-dark to-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse">Loading footer...</div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gradient-to-br from-primary-dark to-primary text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-5" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {getContentByKey('company_logo') ? (
              <Image
                src={getContentByKey('company_logo')?.content.url || ""}
                alt={getContentByKey('company_logo')?.content.alt || t('general.siteName')}
                width={150}
                height={35}
                className="mb-6 bg-white p-2 rounded"
              />
            ) : (
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3AYNZkfFMTjKw4qXp4fHkySoTb6oo.png"
                alt={t('general.siteName')}
                width={150}
                height={35}
                className="mb-6 bg-white p-2 rounded"
              />
            )}
            
            <p className="text-gray-300">
              {getContentByKey('company_tagline')?.content.text || t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {getContentByKey('quick_links_title')?.content.text || t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {/* Use CMS links if available, otherwise fallback to default */}
              {getContentsByType('link').length > 0 ? (
                getContentsByType('link').map((linkItem) => (
                  <li key={linkItem.id}>
                    <Link
                      href={linkItem.content.url || '#'}
                      className="hover:text-accent transition duration-300"
                    >
                      {linkItem.content.text}
                    </Link>
                  </li>
                ))
              ) : (
                navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.path}
                      className="hover:text-accent transition duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {getContentByKey('contact_title')?.content.text || t('footer.contactUs')}
            </h3>
            <div className="space-y-1">
              <p>{getContentByKey('contact_address_1')?.content.text || t('footer.address1')}</p>
              <p>{getContentByKey('contact_address_2')?.content.text || t('footer.address2')}</p>
              <p>{getContentByKey('contact_phone')?.content.text || t('footer.phone')}</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {getContentByKey('newsletter_title')?.content.text || t('footer.newsletter')}
            </h3>
            <p className="mb-4">
              {getContentByKey('newsletter_text')?.content.text || t('footer.newsletterText')}
            </p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder={getContentByKey('newsletter_placeholder')?.content.text || t('footer.emailPlaceholder')}
                className="px-4 py-2 rounded-md sm:rounded-r-none text-secondary focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-accent text-white px-4 py-2 rounded-md sm:rounded-l-none mt-2 sm:mt-0 hover:bg-accent/80 focus:outline-none transition duration-300"
              >
                {getContentByKey('newsletter_button')?.content.text || t('footer.subscribe')}
              </button>
            </form>

            {/* Social Media */}
            <div className="mt-6 flex space-x-4">
              {getContentsByType('social_media').length > 0 ? (
                getContentsByType('social_media').map((socialItem) => (
                  <a 
                    key={socialItem.id} 
                    href={socialItem.content.url || "#"} 
                    className="text-white hover:text-accent transition duration-300" 
                    aria-label={`${socialItem.content.platform} link`}
                  >
                    {renderSocialIcon(socialItem.content.icon, "w-6 h-6")}
                  </a>
                ))
              ) : (
                // Fallback social media icons
                [Facebook, Twitter, LinkedIn, Instagram].map((Icon, index) => (
                  <a key={index} href="#" className="text-white hover:text-accent transition duration-300" aria-label={`Social media link ${index + 1}`}>
                    <Icon size={24} />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>{getContentByKey('copyright')?.content.text || t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
