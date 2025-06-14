"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Menu, User, LogOut } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MobileSearch } from "./mobile-search"
import { SearchAutocomplete } from "./search-autocomplete"
import { CountrySelectorModal } from "./country-selector-modal"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useTranslate } from "@/lib/i18n-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// First, add imports for the sheet component
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { cartItems } = useCart()
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { t, locale } = useTranslate()

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Check if user has a profile image (typically from Google Auth)
  const hasUserImage = user?.user_metadata?.avatar_url || user?.identities?.[0]?.identity_data?.avatar_url

  // Navigation items with translation keys
  const navItems = [
    { key: 'products', label: t('navigation.products'), path: `/${locale}/products` },
    { key: 'about', label: t('navigation.about'), path: `/${locale}/about-us` },
    { key: 'contact', label: t('navigation.contact'), path: `/${locale}/contact` },
  ]

  return (
    <header className="bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3AYNZkfFMTjKw4qXp4fHkySoTb6oo.png"
              alt={t('general.siteName')}
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden lg:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className="text-secondary hover:text-primary transition duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-64">
              <SearchAutocomplete />
            </div>

            {/* Mobile Search Button */}
            <button
              className="md:hidden text-secondary hover:text-primary transition duration-300"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label={t('general.search')}
            >
              <Search size={24} />
            </button>

            {/* Mobile Search Dialog */}
            <MobileSearch isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />

            {/* Country Selector - always visible */}
            <div className="hidden md:block">
              <CountrySelectorModal />
            </div>

            {/* Language Selector - always visible */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Cart button - always visible */}
            <Link href={`/${locale}/cart`} className="text-secondary hover:text-primary transition duration-300 relative">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Desktop User Account Menu */}
            <div className="hidden lg:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                      {hasUserImage ? (
                        <Image 
                          src={hasUserImage}
                          alt={t('navigation.profile')} 
                          width={32} 
                          height={32}
                          className="rounded-full object-cover" 
                        />
                      ) : (
                        <User size={24} className="text-secondary hover:text-primary" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                    <DropdownMenuItem className="font-medium">{user.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/profile`}>{t('navigation.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/orders`}>{t('navigation.orders')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={`/${locale}/auth/signin`} className="text-secondary hover:text-primary transition duration-300">
                  <User size={24} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSheetOpen(true)}>
                  <Menu size={24} className="text-secondary hover:text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{t('navigation.menu')}</SheetTitle>
                </SheetHeader>
                <div className="py-6 flex flex-col gap-6">
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.path}
                        className="text-secondary hover:text-primary transition duration-300 font-medium text-lg"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-4">{t('navigation.account')}</p>
                    {user ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 mb-2">
                          {hasUserImage ? (
                            <Image 
                              src={hasUserImage}
                              alt={t('navigation.profile')} 
                              width={40} 
                              height={40}
                              className="rounded-full object-cover" 
                            />
                          ) : (
                            <User size={24} className="text-secondary" />
                          )}
                          <div className="font-medium">{user.email}</div>
                        </div>
                        <Link
                          href={`/${locale}/profile`}
                          className="text-secondary hover:text-primary"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          {t('navigation.profile')}
                        </Link>
                        <Link
                          href={`/${locale}/orders`}
                          className="text-secondary hover:text-primary"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          {t('navigation.orders')}
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut()
                            setIsSheetOpen(false)
                          }}
                          className="text-red-600 hover:text-red-800 flex items-center gap-2 mt-2"
                        >
                          <LogOut className="h-4 w-4" />
                          {t('auth.signOut')}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={`/${locale}/auth/signin`}
                        className="flex items-center gap-2 text-secondary hover:text-primary"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <User size={20} />
                        {t('auth.signIn')}
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-4">{t('navigation.regionLanguage')}</p>
                    <div className="flex items-center gap-4">
                      <CountrySelectorModal />
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
