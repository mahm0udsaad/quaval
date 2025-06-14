import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define supported locales
const locales = ['en', 'es', 'fr']
const defaultLocale = 'en'

// Get the preferred locale
function getLocale(request: NextRequest) {
  // Skip locale detection for static assets and API routes
  const { pathname } = request.nextUrl
  
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('/favicon.') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.svg')
  ) {
    return null
  }

  // Check if locale is in cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  
  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie
  }

  // Check accept-language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const parsedLocales = acceptLanguage.split(',').map(l => l.split(';')[0])
    const locale = parsedLocales.find(l => locales.some(supportedLocale => 
      l.startsWith(supportedLocale) || l.startsWith(supportedLocale.split('-')[0])
    ))
    
    if (locale) {
      const extractedLocale = locale.split('-')[0]
      if (locales.includes(extractedLocale)) {
        return extractedLocale
      }
    }
  }
  
  // Default locale as fallback
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Get locale
  const locale = getLocale(request)
  
  // Skip redirect for static assets
  if (locale === null) {
    return NextResponse.next()
  }

  // Check if pathname already has locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Extract locale from pathname
    const currentLocale = pathname.split('/')[1]
    // Create response
    const response = NextResponse.next()
    // Set NEXT_LOCALE cookie
    response.cookies.set('NEXT_LOCALE', currentLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'strict'
    })
    return response
  }

  // Redirect if no locale in URL
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  // Copy search params
  request.nextUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value)
  })
  
  const response = NextResponse.redirect(newUrl)
  
  // Set NEXT_LOCALE cookie
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'strict'
  })
  
  return response
}

export const config = {
  matcher: [
    // Skip internal paths
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
} 