import { createClient } from "@supabase/supabase-js";


// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const uploadFile = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
        onProgress(Math.min(90, Math.random() * 80 + 10));
    }, 200);

    try {
        const filePath = `public/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        
        // Complete progress
        onProgress(100);
        
        return publicUrl;
    } finally {
        clearInterval(progressInterval);
    }
};

export type ProductFamily = {
  id: number
  name: string
  brand: string
  origin: string
  created_at?: string
}

export type Product = {
  id: number
  family_id: number
  part_number: string
  price: number
  shipping_cost: string
  stock_status: string
  stock_quantity: number
  images: string[]
  applications: string[]
  shipping_time: string
  payment_methods: string[]
  rating: number
  review_count: number
  datasheet?: string
  related_products: number[]
  countries: string[]
  manufacturing_id?: string
  upc?: string
  dimensions: {
    bore: string
    outerDiameter: string
    width: string
    weight: string
  }
  load_ratings: {
    dynamic: string
    static: string
  }
  technical_features: Record<string, string>
  suffix_descriptions?: Record<string, string>
  parallel_products?: Record<string, string>
  created_at?: string
  // Virtual fields for UI
  family_name?: string
  family_brand?: string
  family_origin?: string
  part_numbers?: string[]
  description?: string
  specifications?: Record<string, string>
}

export type ProductWithFamily = Product & {
  family: ProductFamily
}

export type Banner = {
  id: number
  title: string
  description: string
  button_text: string
  button_link: string
  image: string
}

export type BearingSpecification = {
  partNumber: string
  dimensions: {
    bore: string
    outerDiameter: string
    width: string
  }
  loadRatings: {
    dynamic: string
    static: string
  }
  geometryFactor: string
  speedReference: {
    thermalReferenceSpeed: string
    limitingSpeed: string
  }
  weight: string
}

// Add these types after the existing types
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export type Order = {
  id: string
  user_id: string
  order_number: string
  status: OrderStatus
  total: number
  created_at: string
  updated_at: string
  shipping_address: {
    name: string
    address: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    partNumber?: string
    image?: string
  }>
}

export const AVAILABLE_COUNTRIES = [
  { id: "canada", name: "Canada" },
  { id: "north_america_us_mexico", name: "North America (US and Mexico)" },
  { id: "north_america", name: "North America" },
  { id: "europe", name: "Europe" },
  { id: "middle_east", name: "Middle East" },
  { id: "asia", name: "Asia" },
]

// Product Family API Functions
export async function getProductFamilies(): Promise<ProductFamily[]> {
  const { data, error } = await supabase.from("product_families").select("*").order("name")

  if (error) {
    console.error("Error fetching product families:", error)
    return []
  }

  return data || []
}

export async function getProductFamilyById(id: number): Promise<ProductFamily | null> {
  const { data, error } = await supabase.from("product_families").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product family with id ${id}:`, error)
    return null
  }

  return data
}

export async function createProductFamily(
  family: Omit<ProductFamily, "id" | "created_at">,
): Promise<ProductFamily | null> {
  const { data, error } = await supabase.from("product_families").insert(family).select().single()

  if (error) {
    console.error("Error creating product family:", error)
    return null
  }

  return data
}

export async function updateProductFamily(id: number, family: Partial<ProductFamily>): Promise<ProductFamily | null> {
  const { data, error } = await supabase.from("product_families").update(family).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product family with id ${id}:`, error)
    return null
  }

  return data
}

export async function deleteProductFamily(id: number): Promise<boolean> {
  const { error } = await supabase.from("product_families").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product family with id ${id}:`, error)
    return false
  }

  return true
}

// Product API Functions
export async function getProducts(country?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(`
      *,
      family:product_families(id, name, brand, origin)
    `)
    .order("part_number")

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  // Transform the nested family data into flat fields
  return (data || []).map((product) => ({
    ...product,
    family_name: product.family?.name,
    family_brand: product.family?.brand,
    family_origin: product.family?.origin,
    family: undefined, // Remove the nested object
  }))
}

export async function getProductsByFamilyId(familyId: number): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("family_id", familyId).order("part_number")

  if (error) {
    console.error(`Error fetching products for family id ${familyId}:`, error)
    return []
  }

  return data || []
}

export async function getProductById(id: number): Promise<ProductWithFamily | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      family:product_families(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    return null
  }

  return data
}

export async function getProductByPartNumber(partNumber: string): Promise<ProductWithFamily | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      family:product_families(*)
    `)
    .eq("part_number", partNumber)
    .single()

  if (error) {
    console.error(`Error fetching product with part number ${partNumber}:`, error)
    return null
  }

  return data
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    return null
  }

  return data
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  // Create a copy of the product without the family property
  const { family, ...productToUpdate } = product as any

  const { data, error } = await supabase.from("products").update(productToUpdate).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product with id ${id}:`, error)
    return null
  }

  return data
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product with id ${id}:`, error)
    return false
  }

  return true
}

// Banner API Functions
export async function getBanners(locale = 'en'): Promise<Banner[]> {
  // For English, just return the original banners
  if (locale === 'en') {
    const { data, error } = await supabase.from("banners").select("*").order("id")

    if (error) {
      console.error("Error fetching banners:", error)
      return []
    }

    return data || []
  }
  
  // For other locales, fetch banners with translations
  // First get all base banners
  const { data: banners, error: bannersError } = await supabase
    .from("banners")
    .select("*")
    .order("id")
    
  if (bannersError) {
    console.error("Error fetching banners:", bannersError)
    return []
  }
  
  if (banners?.length === 0) {
    return []
  }
  
  // Then get translations for the current locale
  const { data: translations, error: translationsError } = await supabase
    .from("banner_translations")
    .select("*")
    .eq("locale", locale)
    .in("banner_id", banners.map(b => b.id))
    
  if (translationsError) {
    console.error("Error fetching banner translations:", translationsError)
    return banners || [] // Fall back to original banners if translations fail
  }
  
  // Merge translations with original banners
  return banners.map(banner => {
    const translation = translations?.find(t => t.banner_id === banner.id)
    if (translation) {
      return {
        ...banner,
        title: translation.title,
        description: translation.description,
        button_text: translation.button_text
      }
    }
    return banner // Use original if no translation exists
  })
}

export async function createBanner(banner: Omit<Banner, "id">): Promise<Banner | null> {
  const { data, error } = await supabase.from("banners").insert(banner).select().single()

  if (error) {
    console.error("Error creating banner:", error)
    return null
  }

  return data
}

export async function updateBanner(id: number, banner: Partial<Banner>): Promise<Banner | null> {
  const { data, error } = await supabase.from("banners").update(banner).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating banner with id ${id}:`, error)
    return null
  }

  return data
}

export async function deleteBanner(id: number): Promise<boolean> {
  const { error } = await supabase.from("banners").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting banner with id ${id}:`, error)
    return false
  }

  return true
}

// Image upload functions
export async function uploadImage(file: File, path = "products"): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `${path}/${fileName}`

  const { error } = await supabase.storage.from("images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath)

  return data.publicUrl
}

// Add these functions at the end of the file
// Order API Functions
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error)
    return []
  }

  return data || []
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching order with id ${id}:`, error)
    return null
  }

  return data
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq("order_number", orderNumber)
    .single()

  if (error) {
    console.error(`Error fetching order with order number ${orderNumber}:`, error)
    return null
  }

  return data
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating order status for order ${id}:`, error)
    return null
  }

  return data
}

// Home Page CMS API Functions
export type HomeSection = {
  id: number
  section_key: string
  section_name: string
  is_enabled: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export type HomeContentBlock = {
  id: number
  section_id: number
  block_key: string
  block_type: string
  content: Record<string, any>
  sort_order: number
  is_enabled: boolean
  created_at?: string
  updated_at?: string
}

export type HomeContentTranslation = {
  id: number
  content_block_id: number
  locale: string
  translated_content: Record<string, any>
  created_at?: string
  updated_at?: string
}

export type FooterContent = {
  id: number
  content_key: string
  content_type: string
  content: Record<string, any>
  sort_order: number
  is_enabled: boolean
  created_at?: string
  updated_at?: string
}

export type FooterContentTranslation = {
  id: number
  footer_content_id: number
  locale: string
  translated_content: Record<string, any>
  created_at?: string
  updated_at?: string
}

// Home Sections API
export async function getHomeSections(): Promise<HomeSection[]> {
  
  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .order("sort_order")

  if (error) {
    console.error("❌ Error fetching home sections:", error)
    return []
  }
  return data || []
}

export async function updateHomeSection(id: number, section: Partial<HomeSection>): Promise<HomeSection | null> {
  const { data, error } = await supabase
    .from("home_sections")
    .update(section)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating home section with id ${id}:`, error)
    return null
  }

  return data
}

// Home Content Blocks API
export async function getHomeContentBlocks(locale = 'en'): Promise<HomeContentBlock[]> {
  
  const { data: blocks, error } = await supabase
    .from("home_content_blocks")
    .select("*")
    .order("section_id, sort_order")

  if (error) {
    console.error("❌ Error fetching home content blocks:", error)
    return []
  }

  if (!blocks) {
    console.log('⚠️ No blocks returned from database');
    return [];
  }

  console.log('📊 Raw blocks fetched:', blocks.length);
  console.log('  - Sample blocks:', blocks.slice(0, 3).map(b => ({ id: b.id, section_id: b.section_id, block_key: b.block_key, block_type: b.block_type })));

  // For English, return original content
  if (locale === 'en') {
    console.log('✅ Returning original English content:', blocks.length, 'blocks');
    return blocks
  }

  // For other locales, get translations
  const { data: translations, error: translationError } = await supabase
    .from("home_content_translations")
    .select("*")
    .eq("locale", locale)
    .in("content_block_id", blocks.map(b => b.id))

  if (translationError) {
    console.error("❌ Error fetching home content translations:", translationError)
    console.log('🔄 Falling back to original content');
    return blocks // Fallback to original content
  }

  console.log('📊 Translations fetched for locale', locale, ':', translations?.length || 0);

  // Merge translations with original blocks
  const result = blocks.map(block => {
    const translation = translations?.find(t => t.content_block_id === block.id)
    if (translation) {
      return {
        ...block,
        content: translation.translated_content
      }
    }
    return block
  });

  console.log('✅ Returning translated content:', result.length, 'blocks');
  return result;
}

export async function getHomeContentBlocksBySection(sectionKey: string, locale = 'en'): Promise<HomeContentBlock[]> {
  const { data: blocks, error } = await supabase
    .from("home_content_blocks")
    .select(`
      *,
      section:home_sections(section_key)
    `)
    .eq("home_sections.section_key", sectionKey)
    .order("sort_order")

  if (error) {
    console.error(`Error fetching content blocks for section ${sectionKey}:`, error)
    return []
  }

  if (!blocks) return []

  // Filter blocks that belong to the correct section
  const filteredBlocks = blocks.filter(block => 
    (block as any).section?.section_key === sectionKey
  )

  // For English, return original content
  if (locale === 'en') {
    return filteredBlocks
  }

  // For other locales, get translations
  const { data: translations, error: translationError } = await supabase
    .from("home_content_translations")
    .select("*")
    .eq("locale", locale)
    .in("content_block_id", filteredBlocks.map(b => b.id))

  if (translationError) {
    console.error("Error fetching translations:", translationError)
    return filteredBlocks
  }

  // Merge translations
  return filteredBlocks.map(block => {
    const translation = translations?.find(t => t.content_block_id === block.id)
    if (translation) {
      return {
        ...block,
        content: translation.translated_content
      }
    }
    return block
  })
}

export async function updateHomeContentBlock(id: number, block: Partial<HomeContentBlock>): Promise<HomeContentBlock | null> {
  const { data, error } = await supabase
    .from("home_content_blocks")
    .update(block)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating home content block with id ${id}:`, error)
    return null
  }

  return data
}

export async function createHomeContentBlock(block: Omit<HomeContentBlock, "id" | "created_at" | "updated_at">): Promise<HomeContentBlock | null> {
  const { data, error } = await supabase
    .from("home_content_blocks")
    .insert(block)
    .select()
    .single()

  if (error) {
    console.error("Error creating home content block:", error)
    return null
  }

  return data
}

export async function deleteHomeContentBlock(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("home_content_blocks")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(`Error deleting home content block with id ${id}:`, error)
    return false
  }

  return true
}

// Home Content Translations API
export async function getHomeContentTranslations(contentBlockId: number): Promise<HomeContentTranslation[]> {
  const { data, error } = await supabase
    .from("home_content_translations")
    .select("*")
    .eq("content_block_id", contentBlockId)

  if (error) {
    console.error("Error fetching home content translations:", error)
    return []
  }

  return data || []
}

export async function updateHomeContentTranslation(
  contentBlockId: number, 
  locale: string, 
  translatedContent: Record<string, any>
): Promise<HomeContentTranslation | null> {
  const { data, error } = await supabase
    .from("home_content_translations")
    .upsert({
      content_block_id: contentBlockId,
      locale,
      translated_content: translatedContent
    })
    .select()
    .single()

  if (error) {
    console.error("Error updating home content translation:", error)
    return null
  }

  return data
}

// Footer Content API
export async function getFooterContent(locale = 'en'): Promise<FooterContent[]> {
  const { data: content, error } = await supabase
    .from("footer_content")
    .select("*")
    .order("sort_order")

  if (error) {
    console.error("Error fetching footer content:", error)
    return []
  }

  if (!content) return []

  // For English, return original content
  if (locale === 'en') {
    return content
  }

  // For other locales, get translations
  const { data: translations, error: translationError } = await supabase
    .from("footer_content_translations")
    .select("*")
    .eq("locale", locale)
    .in("footer_content_id", content.map(c => c.id))

  if (translationError) {
    console.error("Error fetching footer content translations:", translationError)
    return content
  }

  // Merge translations
  return content.map(item => {
    const translation = translations?.find(t => t.footer_content_id === item.id)
    if (translation) {
      return {
        ...item,
        content: translation.translated_content
      }
    }
    return item
  })
}

export async function updateFooterContent(id: number, content: Partial<FooterContent>): Promise<FooterContent | null> {
  const { data, error } = await supabase
    .from("footer_content")
    .update(content)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating footer content with id ${id}:`, error)
    return null
  }

  return data
}

export async function updateFooterContentTranslation(
  footerContentId: number, 
  locale: string, 
  translatedContent: Record<string, any>
): Promise<FooterContentTranslation | null> {
  const { data, error } = await supabase
    .from("footer_content_translations")
    .upsert({
      footer_content_id: footerContentId,
      locale,
      translated_content: translatedContent
    })
    .select()
    .single()

  if (error) {
    console.error("Error updating footer content translation:", error)
    return null
  }

  return data
}

// Utility function to get complete home page data
export async function getCompleteHomePageData(locale = 'en') {
  console.log('🔍 Starting getCompleteHomePageData for locale:', locale);
  
  try {
    const [sections, contentBlocks, footerContent] = await Promise.all([
      getHomeSections(),
      getHomeContentBlocks(locale),
      getFooterContent(locale)
    ]);

    console.log('📊 Raw data fetched:');
    console.log('  - Sections:', sections.length);
    console.log('  - Content blocks:', contentBlocks.length);
    console.log('  - Footer items:', footerContent.length);

    // Debug: Log first few content blocks
    console.log('  - Sample content blocks:', contentBlocks.slice(0, 3));

    // Group content blocks by section
    const sectionsWithContent = sections.map(section => {
      const sectionContentBlocks = contentBlocks.filter(block => block.section_id === section.id);
      console.log(`  - Section "${section.section_key}" (id: ${section.id}) has ${sectionContentBlocks.length} content blocks`);
      
      return {
        ...section,
        content_blocks: sectionContentBlocks
      };
    });

    const result = {
      sections: sectionsWithContent,
      footer: footerContent
    };

    console.log('✅ Final result summary:');
    console.log('  - Sections with content:', sectionsWithContent.length);
    console.log('  - Stats section content blocks:', sectionsWithContent.find(s => s.section_key === 'stats')?.content_blocks.length || 0);
    console.log('  - About section content blocks:', sectionsWithContent.find(s => s.section_key === 'about')?.content_blocks.length || 0);
    console.log('  - Features section content blocks:', sectionsWithContent.find(s => s.section_key === 'features')?.content_blocks.length || 0);

    return result;
  } catch (error) {
    console.error('❌ Error in getCompleteHomePageData:', error);
    return {
      sections: [],
      footer: []
    };
  }
}

// Section-specific data fetching functions
export async function getHeroSectionData(locale = 'en') {
  const sections = await getHomeSections();
  const section = sections.find(s => s.section_key === 'hero' && s.is_enabled);
  
  if (!section) return null;
  
  const contentBlocks = await getHomeContentBlocksBySection('hero', locale);
  
  return {
    ...section,
    content_blocks: contentBlocks
  };
}

export async function getStatsSectionData(locale = 'en') {
  const sections = await getHomeSections();
  const section = sections.find(s => s.section_key === 'stats' && s.is_enabled);
  
  if (!section) return null;
  
  const contentBlocks = await getHomeContentBlocksBySection('stats', locale);
  const stats = contentBlocks.filter(block => block.block_type === 'stat' && block.is_enabled);
  
  return {
    section: { ...section, content_blocks: contentBlocks },
    stats
  };
}

export async function getAboutSectionData(locale = 'en') {
  const sections = await getHomeSections();
  const section = sections.find(s => s.section_key === 'about' && s.is_enabled);
  
  if (!section) return null;
  
  const contentBlocks = await getHomeContentBlocksBySection('about', locale);
  
  const getContentBlock = (blockKey: string) => {
    return contentBlocks.find(block => block.block_key === blockKey && block.is_enabled);
  };
  
  return {
    section: { ...section, content_blocks: contentBlocks },
    contentBlocks: {
      heading: getContentBlock('about_heading'),
      title: getContentBlock('about_title'),
      highlight1Icon: getContentBlock('about_highlight_1_icon'),
      highlight1Title: getContentBlock('about_highlight_1_title'),
      highlight1Desc: getContentBlock('about_highlight_1_desc'),
      highlight2Icon: getContentBlock('about_highlight_2_icon'),
      highlight2Title: getContentBlock('about_highlight_2_title'),
      highlight2Desc: getContentBlock('about_highlight_2_desc'),
      button1: getContentBlock('about_button_1'),
      button2: getContentBlock('about_button_2'),
      image: getContentBlock('about_image'),
      policyTitle: getContentBlock('about_policy_title'),
      policyContent: getContentBlock('about_policy_content'),
      missionTitle: getContentBlock('about_mission_title'),
      missionContent: getContentBlock('about_mission_content'),
      missionBenefits: getContentBlock('about_mission_benefits'),
      historyTitle: getContentBlock('about_history_title'),
      historyContent: getContentBlock('about_history_content'),
      historySource: getContentBlock('about_history_source')
    }
  };
}

export async function getFeaturesSectionData(locale = 'en') {
  const sections = await getHomeSections();
  const section = sections.find(s => s.section_key === 'features' && s.is_enabled);
  
  if (!section) return null;
  
  const contentBlocks = await getHomeContentBlocksBySection('features', locale);
  
  const getContentBlock = (blockKey: string) => {
    return contentBlocks.find(block => block.block_key === blockKey && block.is_enabled);
  };
  
  const features = contentBlocks.filter(block => block.block_type === 'feature' && block.is_enabled);
  
  return {
    section: { ...section, content_blocks: contentBlocks },
    contentBlocks: {
      heading: getContentBlock('features_heading'),
      title: getContentBlock('features_title'),
      description: getContentBlock('features_description')
    },
    features
  };
}

export async function getTrustedPartnersSectionData(locale = 'en') {
  const sections = await getHomeSections();
  const section = sections.find(s => s.section_key === 'trusted_partners' && s.is_enabled);
  
  if (!section) return null;
  
  const contentBlocks = await getHomeContentBlocksBySection('trusted_partners', locale);
  
  const getContentBlock = (blockKey: string) => {
    return contentBlocks.find(block => block.block_key === blockKey && block.is_enabled);
  };
  
  const partners = contentBlocks.filter(block => 
    block.block_key.startsWith('partner_logo_') && 
    block.block_type === 'image' && 
    block.is_enabled
  );
  
  return {
    section: { ...section, content_blocks: contentBlocks },
    contentBlocks: {
      heading: getContentBlock('partners_heading'),
      title: getContentBlock('partners_title')
    },
    partners
  };
}

export async function getCTASectionData(locale = 'en') {
  const sections = await getHomeSections();
  const section = sections.find(s => s.section_key === 'cta' && s.is_enabled);
  
  if (!section) return null;
  
  const contentBlocks = await getHomeContentBlocksBySection('cta', locale);
  
  const getContentBlock = (blockKey: string) => {
    return contentBlocks.find(block => block.block_key === blockKey && block.is_enabled);
  };
  
  return {
    section: { ...section, content_blocks: contentBlocks },
    contentBlocks: {
      heading: getContentBlock('cta_heading'),
      title: getContentBlock('cta_title'),
      description: getContentBlock('cta_description'),
      button: getContentBlock('cta_button')
    }
  };
}
