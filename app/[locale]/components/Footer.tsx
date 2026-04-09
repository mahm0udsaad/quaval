"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, LinkedinIcon as LinkedIn, Instagram } from "lucide-react"
import { useTranslate } from "@/lib/i18n-client"

export default function Footer() {
  const { t, locale } = useTranslate()

  return (
    <footer className="bg-gradient-to-br from-primary-dark to-primary text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-5" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3AYNZkfFMTjKw4qXp4fHkySoTb6oo.png"
              alt={t('general.siteName')}
              width={150}
              height={35}
              className="mb-6 bg-white p-2 rounded"
            />
            <p className="text-gray-300">
              Quaval for Industrial Development Inc.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Quaval pour le développement industriel inc.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <p className="text-gray-300">3055 Saint-Martin West</p>
            <p className="text-gray-300">Laval, Quebec Canada H7T 0J3</p>
            <p className="text-gray-300 mt-3">+1 (514) 208-6840</p>
            <p className="text-gray-300 mt-1">
              <Link href="https://www.quaval.ca" className="hover:text-accent transition duration-300">
                www.quaval.ca
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end justify-between">
            <div className="flex space-x-4">
              {[Facebook, Twitter, LinkedIn, Instagram].map((Icon, index) => (
                <a key={index} href="#" className="text-white hover:text-accent transition duration-300" aria-label={`Social media link ${index + 1}`}>
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2020 Quaval for Industrial Development Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
