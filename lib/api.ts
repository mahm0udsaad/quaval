import { supabase } from "./supabase"

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
  id: number
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
  items?: OrderItem[]
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

export async function getOrderById(id: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
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
