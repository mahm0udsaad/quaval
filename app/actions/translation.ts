'use server'

import { revalidatePath } from 'next/cache'
import { 
  translateAllHomePageContent, 
  translateAndSaveHomeContent, 
  translateAndSaveFooterContent 
} from '@/lib/translation'
import { 
  getHomeContentBlocks, 
  getFooterContent 
} from '@/lib/api'

export type TranslationResult = {
  success: boolean
  message: string
  results?: {
    success: number
    failed: number
    details: any[]
  }
  error?: string
}

/**
 * Server action to translate all home page content
 */
export async function translateAllContentAction(
  targetLanguages: string[] = ['es', 'fr']
): Promise<TranslationResult> {
  try {
    const results = await translateAllHomePageContent(targetLanguages)
    
    // Revalidate the admin pages to show updated translations
    revalidatePath('/admin/home-content')
    revalidatePath('/admin')
    
    return {
      success: true,
      message: `Translation completed: ${results.success} successful, ${results.failed} failed`,
      results
    }
  } catch (error) {
    console.error('Translation error:', error)
    return {
      success: false,
      message: 'Translation failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server action to translate a single home content block
 */
export async function translateHomeContentAction(
  contentId: number,
  targetLanguages: string[] = ['es', 'fr']
): Promise<TranslationResult> {
  try {
    // Get the content block
    const homeBlocks = await getHomeContentBlocks('en')
    const block = homeBlocks.find(b => b.id === contentId)
    
    if (!block) {
      return {
        success: false,
        message: 'Content block not found',
        error: 'The specified content block does not exist'
      }
    }
    
    const success = await translateAndSaveHomeContent(block, targetLanguages)
    
    if (success) {
      // Revalidate the admin pages to show updated translations
      revalidatePath('/admin/home-content')
      revalidatePath('/admin')
      
      return {
        success: true,
        message: 'Content translated successfully'
      }
    } else {
      return {
        success: false,
        message: 'Translation failed',
        error: 'Failed to translate the content block'
      }
    }
  } catch (error) {
    console.error('Translation error:', error)
    return {
      success: false,
      message: 'Translation failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server action to translate a single footer content item
 */
export async function translateFooterContentAction(
  contentId: number,
  targetLanguages: string[] = ['es', 'fr']
): Promise<TranslationResult> {
  try {
    // Get the footer content item
    const footerItems = await getFooterContent('en')
    const item = footerItems.find(f => f.id === contentId)
    
    if (!item) {
      return {
        success: false,
        message: 'Footer content not found',
        error: 'The specified footer content does not exist'
      }
    }
    
    const success = await translateAndSaveFooterContent(item, targetLanguages)
    
    if (success) {
      // Revalidate the admin pages to show updated translations
      revalidatePath('/admin/home-content')
      revalidatePath('/admin')
      
      return {
        success: true,
        message: 'Footer content translated successfully'
      }
    } else {
      return {
        success: false,
        message: 'Translation failed',
        error: 'Failed to translate the footer content'
      }
    }
  } catch (error) {
    console.error('Translation error:', error)
    return {
      success: false,
      message: 'Translation failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server action to check translation status and get progress
 */
export async function getTranslationStatusAction(): Promise<{
  isAvailable: boolean
  supportedLanguages: string[]
  message?: string
}> {
  try {
    // Check if Google AI API key is configured
    const hasApiKey = !!(process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY)
    
    if (!hasApiKey) {
      return {
        isAvailable: false,
        supportedLanguages: [],
        message: 'Google AI API key not configured. Please set GOOGLE_AI_API_KEY environment variable.'
      }
    }
    
    return {
      isAvailable: true,
      supportedLanguages: ['es', 'fr'],
      message: 'Translation service is ready'
    }
  } catch (error) {
    return {
      isAvailable: false,
      supportedLanguages: [],
      message: 'Translation service error'
    }
  }
}

/**
 * Server action to auto-translate when content is created/updated
 * This is called automatically from the API functions
 */
export async function autoTranslateContentAction(
  contentId: number,
  contentType: 'home' | 'footer',
  targetLanguages: string[] = ['es', 'fr']
): Promise<void> {
  try {
    if (contentType === 'home') {
      await translateHomeContentAction(contentId, targetLanguages)
    } else {
      await translateFooterContentAction(contentId, targetLanguages)
    }
  } catch (error) {
    // Log error but don't throw - we don't want translation failures to break content operations
    console.error('Auto-translation failed:', error)
  }
} 