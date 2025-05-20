"use server"

import { supabase } from "@/lib/supabase"

export type SearchSuggestion = {
  id: string | number
  type: "product" | "part_number"
  name: string
  part_number?: string
  image_url?: string
  family?: string
}

export async function searchProducts(query: string, expandPartNumbers = false, limit = 20) {
  if (!query || query.trim() === "") {
    return { products: [], suggestions: [] }
  }

  const queryLower = query.toLowerCase().trim()

  try {
    // Query the database directly for products that match the search criteria
    const { data: matchingProducts, error } = await supabase
      .from('products')
      .select(`
        id,
        part_number,
        price,
        stock_status,
        stock_quantity,
        images,
        applications,
        family_id,
        technical_features,
        dimensions,
        rating,
        review_count
      `)
      .ilike('part_number', `%${queryLower}%`)
      .limit(limit * 2)
    
    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }
    
    // If no results or error, return empty arrays
    if (!matchingProducts || matchingProducts.length === 0) {
      return { products: [], suggestions: [] }
    }
    
    // Process results to prioritize exact matches first
    const products = matchingProducts.sort((a, b) => {
      // Exact part number matches
      const aExactPartNumber = a.part_number?.toLowerCase() === queryLower
      const bExactPartNumber = b.part_number?.toLowerCase() === queryLower
      if (aExactPartNumber && !bExactPartNumber) return -1
      if (!aExactPartNumber && bExactPartNumber) return 1
      
      // Part number starts with query
      const aStartsWithPartNumber = a.part_number?.toLowerCase().startsWith(queryLower) || false
      const bStartsWithPartNumber = b.part_number?.toLowerCase().startsWith(queryLower) || false
      if (aStartsWithPartNumber && !bStartsWithPartNumber) return -1
      if (!aStartsWithPartNumber && bStartsWithPartNumber) return 1
      
      // Default to alphabetical by part number
      return (a.part_number || "").localeCompare(b.part_number || "")
    })
    
    // Process the results to ensure they have consistent format
    const processedProducts = products.map(product => {
      // Create a display name from part number and technical features
      let displayName = product.part_number || ""
      
      try {
        if (product.technical_features) {
          // Parse technical features if it's a string
          const features = typeof product.technical_features === 'string' 
            ? JSON.parse(product.technical_features) 
            : product.technical_features
            
          // Add bore size to name if available
          if (features && features.Bore) {
            displayName = `${displayName} - ${features.Bore}`.trim()
          }
        }
      } catch (e) {
        console.error("Error parsing technical features:", e)
        // Just use part number if parsing fails
      }
      
      return {
        id: product.id,
        name: displayName, // Generated display name
        part_number: product.part_number || "",
        description: "", // No description field
        family_id: product.family_id || null,
        images: Array.isArray(product.images) ? product.images : [],
        applications: Array.isArray(product.applications) ? product.applications : [],
        price: product.price || "",
        stock_status: product.stock_status || "",
        stock_quantity: product.stock_quantity || 0,
        rating: product.rating || 0,
        review_count: product.review_count || 0
      }
    })

    // Generate suggestions if requested
    let suggestions: SearchSuggestion[] = []
    const uniqueSuggestions = new Set<string>()

    if (expandPartNumbers && processedProducts.length > 0) {
      for (const product of processedProducts) {
        const productId = product.id
        const productName = product.name // Using our created displayName
        const productFamily = product.family_id
        const productImages = product.images || []
        const mainPartNumber = product.part_number

        // Add main part number as a suggestion
        if (mainPartNumber) {
          const suggestionKey = `part_number-${mainPartNumber}`
          if (!uniqueSuggestions.has(suggestionKey)) {
            uniqueSuggestions.add(suggestionKey)
            suggestions.push({
              id: productId,
              type: "part_number",
              name: productName,
              part_number: mainPartNumber,
              image_url: productImages[0] || null,
              family: productFamily,
            })
          }
        }

        // Add product as a suggestion
        const productKey = `product-${productId}`
        if (!uniqueSuggestions.has(productKey)) {
          uniqueSuggestions.add(productKey)
          suggestions.push({
            id: productId,
            type: "product",
            name: productName,
            image_url: productImages[0] || null,
            family: productFamily,
          })
        }
      }

      // Sort suggestions prioritizing exact matches
      suggestions.sort((a, b) => {
        // Part numbers first
        if (a.type === "part_number" && b.type !== "part_number") return -1
        if (a.type !== "part_number" && b.type === "part_number") return 1

        // For part numbers, exact matches first
        if (a.type === "part_number" && b.type === "part_number" && a.part_number && b.part_number) {
          const aExact = a.part_number.toLowerCase() === queryLower
          const bExact = b.part_number.toLowerCase() === queryLower
          if (aExact && !bExact) return -1
          if (!aExact && bExact) return 1

          // Then starts with
          const aStartsWith = a.part_number.toLowerCase().startsWith(queryLower)
          const bStartsWith = b.part_number.toLowerCase().startsWith(queryLower)
          if (aStartsWith && !bStartsWith) return -1
          if (!aStartsWith && bStartsWith) return 1

          // Then alphabetical
          return a.part_number.localeCompare(b.part_number)
        }

        return (a.name || "").localeCompare(b.name || "")
      })
    }

    // Apply limit
    return {
      products: processedProducts.slice(0, limit),
      suggestions: suggestions.slice(0, limit),
    }
  } catch (error) {
    console.error("Search error:", error)
    return { products: [], suggestions: [] }
  }
}
