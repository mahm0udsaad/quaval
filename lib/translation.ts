import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { 
  updateHomeContentTranslation, 
  updateFooterContentTranslation,
  getHomeContentBlocks,
  getFooterContent,
  type HomeContentBlock,
  type FooterContent 
} from './api'

// Available languages for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  // Add more languages as needed
] as const

// Initialize Gemini model
const model = google('models/gemini-1.5-pro-latest')

// Schema for home content block translation
const HomeContentTranslationSchema = z.object({
  translations: z.record(z.string(), z.object({
    text: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    label: z.string().optional(),
    value: z.string().optional(),
    link: z.string().optional(),
    alt: z.string().optional(),
    tag: z.string().optional(),
    icon: z.string().optional(),
    variant: z.string().optional(),
    color: z.string().optional(),
    textColor: z.string().optional(),
    borderColor: z.string().optional(),
    hoverColor: z.string().optional(),
    platform: z.string().optional(),
    url: z.string().optional(),
  }))
})

// Schema for footer content translation
const FooterContentTranslationSchema = z.object({
  translations: z.record(z.string(), z.object({
    text: z.string().optional(),
    url: z.string().optional(),
    alt: z.string().optional(),
    platform: z.string().optional(),
  }))
})

/**
 * Translate home content block to multiple languages
 */
export async function translateHomeContentBlock(
  contentBlock: HomeContentBlock,
  targetLanguages: string[] = ['es', 'fr']
): Promise<Record<string, any>> {
  try {
    // Prepare content for translation
    const contentToTranslate = {
      blockType: contentBlock.block_type,
      content: contentBlock.content
    }

    // Extract translatable text from content
    const translatableFields = extractTranslatableFields(contentBlock.content, contentBlock.block_type)
    
    if (Object.keys(translatableFields).length === 0) {
      console.log('No translatable content found for block:', contentBlock.block_key)
      return {}
    }

    const prompt = `
Translate the following content to ${targetLanguages.join(', ')}. 
Keep the same structure and preserve any technical terms, links, or styling classes.
Only translate user-facing text, not technical values like CSS classes, URLs, or icon names.

Content Type: ${contentBlock.block_type}
Content to translate: ${JSON.stringify(translatableFields, null, 2)}

Return translations in the exact same JSON structure as the input, with language codes as keys.
For non-translatable fields (URLs, technical values, etc.), return them unchanged.
`

    const { object } = await generateObject({
      model,
      schema: HomeContentTranslationSchema,
      prompt,
      maxTokens: 2000,
    })

    return object.translations
  } catch (error) {
    console.error('Error translating home content block:', error)
    throw error
  }
}

/**
 * Translate footer content to multiple languages
 */
export async function translateFooterContent(
  footerItem: FooterContent,
  targetLanguages: string[] = ['es', 'fr']
): Promise<Record<string, any>> {
  try {
    const translatableFields = extractFooterTranslatableFields(footerItem.content, footerItem.content_type)
    
    if (Object.keys(translatableFields).length === 0) {
      console.log('No translatable content found for footer item:', footerItem.content_key)
      return {}
    }

    const prompt = `
Translate the following footer content to ${targetLanguages.join(', ')}.
Keep the same structure and preserve any URLs, technical terms, or platform names.
Only translate user-facing text.

Content Type: ${footerItem.content_type}
Content to translate: ${JSON.stringify(translatableFields, null, 2)}

Return translations in the exact same JSON structure as the input, with language codes as keys.
`

    const { object } = await generateObject({
      model,
      schema: FooterContentTranslationSchema,
      prompt,
      maxTokens: 1000,
    })

    return object.translations
  } catch (error) {
    console.error('Error translating footer content:', error)
    throw error
  }
}

/**
 * Extract translatable fields from home content based on block type
 */
function extractTranslatableFields(content: Record<string, any>, blockType: string): Record<string, any> {
  const translatable: Record<string, any> = {}

  switch (blockType) {
    case 'text':
      if (content.text) translatable.text = content.text
      if (content.tag) translatable.tag = content.tag
      break
      
    case 'button':
      if (content.text) translatable.text = content.text
      // Don't translate link or variant
      break
      
    case 'stat':
      if (content.label) translatable.label = content.label
      if (content.value) translatable.value = content.value
      // Don't translate color
      break
      
    case 'feature':
      if (content.title) translatable.title = content.title
      if (content.description) translatable.description = content.description
      // Don't translate icon, colors, or styling classes
      break
      
    case 'image':
      if (content.alt) translatable.alt = content.alt
      // Don't translate url
      break
      
    default:
      // For other types, try to extract common translatable fields
      if (content.text) translatable.text = content.text
      if (content.title) translatable.title = content.title
      if (content.description) translatable.description = content.description
      if (content.label) translatable.label = content.label
      if (content.alt) translatable.alt = content.alt
      break
  }

  return translatable
}

/**
 * Extract translatable fields from footer content
 */
function extractFooterTranslatableFields(content: Record<string, any>, contentType: string): Record<string, any> {
  const translatable: Record<string, any> = {}

  switch (contentType) {
    case 'text':
    case 'link':
      if (content.text) translatable.text = content.text
      break
      
    case 'image':
      if (content.alt) translatable.alt = content.alt
      break
      
    case 'social_media':
      // Social media platform names usually don't need translation
      break
      
    default:
      if (content.text) translatable.text = content.text
      if (content.alt) translatable.alt = content.alt
      break
  }

  return translatable
}

/**
 * Save translations to database for a home content block
 */
export async function saveHomeContentTranslations(
  contentBlockId: number,
  translations: Record<string, any>
): Promise<void> {
  for (const [locale, translatedContent] of Object.entries(translations)) {
    await updateHomeContentTranslation(contentBlockId, locale, translatedContent)
  }
}

/**
 * Save translations to database for footer content
 */
export async function saveFooterContentTranslations(
  footerContentId: number,
  translations: Record<string, any>
): Promise<void> {
  for (const [locale, translatedContent] of Object.entries(translations)) {
    await updateFooterContentTranslation(footerContentId, locale, translatedContent)
  }
}

/**
 * Translate and save a single home content block
 */
export async function translateAndSaveHomeContent(
  contentBlock: HomeContentBlock,
  targetLanguages: string[] = ['es', 'fr']
): Promise<boolean> {
  try {
    const translations = await translateHomeContentBlock(contentBlock, targetLanguages)
    await saveHomeContentTranslations(contentBlock.id, translations)
    console.log(`Successfully translated content block: ${contentBlock.block_key}`)
    return true
  } catch (error) {
    console.error(`Failed to translate content block ${contentBlock.block_key}:`, error)
    return false
  }
}

/**
 * Translate and save a single footer content item
 */
export async function translateAndSaveFooterContent(
  footerItem: FooterContent,
  targetLanguages: string[] = ['es', 'fr']
): Promise<boolean> {
  try {
    const translations = await translateFooterContent(footerItem, targetLanguages)
    await saveFooterContentTranslations(footerItem.id, translations)
    console.log(`Successfully translated footer content: ${footerItem.content_key}`)
    return true
  } catch (error) {
    console.error(`Failed to translate footer content ${footerItem.content_key}:`, error)
    return false
  }
}

/**
 * Translate all existing home page content
 */
export async function translateAllHomePageContent(
  targetLanguages: string[] = ['es', 'fr']
): Promise<{ success: number; failed: number; details: any[] }> {
  const results = { success: 0, failed: 0, details: [] as any[] }
  
  try {
    // Get all home content blocks
    const contentBlocks = await getHomeContentBlocks('en') // Get English content as base
    const footerContent = await getFooterContent('en')
    
    console.log(`Starting translation of ${contentBlocks.length} content blocks and ${footerContent.length} footer items...`)
    
    // Translate home content blocks
    for (const block of contentBlocks) {
      try {
        const success = await translateAndSaveHomeContent(block, targetLanguages)
        if (success) {
          results.success++
          results.details.push({ type: 'home', id: block.id, key: block.block_key, status: 'success' })
        } else {
          results.failed++
          results.details.push({ type: 'home', id: block.id, key: block.block_key, status: 'failed' })
        }
      } catch (error) {
        results.failed++
        results.details.push({ 
          type: 'home', 
          id: block.id, 
          key: block.block_key, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // Translate footer content
    for (const item of footerContent) {
      try {
        const success = await translateAndSaveFooterContent(item, targetLanguages)
        if (success) {
          results.success++
          results.details.push({ type: 'footer', id: item.id, key: item.content_key, status: 'success' })
        } else {
          results.failed++
          results.details.push({ type: 'footer', id: item.id, key: item.content_key, status: 'failed' })
        }
      } catch (error) {
        results.failed++
        results.details.push({ 
          type: 'footer', 
          id: item.id, 
          key: item.content_key, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
  } catch (error) {
    console.error('Error in translateAllHomePageContent:', error)
    throw error
  }
  
  console.log(`Translation completed: ${results.success} successful, ${results.failed} failed`)
  return results
}

/**
 * Auto-translate content when it's created or updated
 */
export async function autoTranslateContent(
  content: HomeContentBlock | FooterContent,
  type: 'home' | 'footer',
  targetLanguages: string[] = ['es', 'fr']
): Promise<void> {
  try {
    if (type === 'home') {
      await translateAndSaveHomeContent(content as HomeContentBlock, targetLanguages)
    } else {
      await translateAndSaveFooterContent(content as FooterContent, targetLanguages)
    }
  } catch (error) {
    // Log error but don't throw - we don't want translation failures to break content creation
    console.error('Auto-translation failed:', error)
  }
} 