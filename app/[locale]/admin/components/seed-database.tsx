"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Seed product families
export async function seedProductFamilies() {
  const familiesData = [
    {
      name: "Double-Row Spherical Roller Bearings",
      brand: "Quaval",
      origin: "Canada",
    },
    {
      name: "Deep Groove Ball Bearings",
      brand: "Quaval",
      origin: "Canada",
    },
    {
      name: "Tapered Roller Bearings",
      brand: "Quaval",
      origin: "Canada",
    },
  ]

  // First clear existing data
  await supabase.from("product_families").delete().gt("id", 0)

  // Insert the family data
  const { data: families, error } = await supabase.from("product_families").insert(familiesData).select()

  if (error) {
    console.error("Error seeding product families:", error)
    return []
  }

  return families
}

// Seed products
export async function seedProducts(families) {
  if (!families || families.length === 0) {
    console.error("No product families available for seeding products")
    return
  }

  const sphericalRollerFamilyId = families.find((f) => f.name === "Double-Row Spherical Roller Bearings")?.id
  const deepGrooveFamilyId = families.find((f) => f.name === "Deep Groove Ball Bearings")?.id
  const taperedRollerFamilyId = families.find((f) => f.name === "Tapered Roller Bearings")?.id

  const productsData = [
    // Spherical Roller Bearings
    {
      family_id: sphericalRollerFamilyId,
      part_number: "22316 E",
      price: 89.99,
      shipping_cost: "$10 - $15 (Calculated at checkout)",
      stock_status: "In Stock",
      stock_quantity: 12,
      images: [
        "https://m.media-amazon.com/images/I/61G1ODaXSTL._SX522_.jpg",
        "https://m.media-amazon.com/images/I/61G1ODaXSTL._SX522_.jpg",
      ],
      applications: ["Mining Equipment", "Paper Mills", "Steel Mills", "Construction Machinery"],
      shipping_time: "Ships within 2-5 business days",
      payment_methods: ["Visa", "Mastercard", "PayPal", "Bank Transfer"],
      rating: 4.9,
      review_count: 24,
      datasheet: "/datasheets/22316-E.pdf",
      related_products: [],
      countries: ["canada", "north_america", "europe"],
      manufacturing_id: "QV22316E20230001",
      upc: "123456789012",
      dimensions: {
        bore: "80 mm",
        outerDiameter: "170 mm",
        width: "58 mm",
        weight: "5.1 kg",
      },
      load_ratings: {
        dynamic: "156 kN",
        static: "172 kN",
      },
      technical_features: {
        Bore: "80mm",
        Lubrication: "Grease or Oil",
        Seal: "Open (No Seals)",
        Sleeve: "Not Included",
        "Cage Type": "Steel",
        "Radial Internal Play": "Normal",
        Precision: "P0 (Normal)",
        Speed: "4800 rpm",
        "Heat Stabilization": "Standard",
        "Vibrating Screen Execution": "No",
      },
      suffix_descriptions: {
        E: "Optimized internal design for improved load capacity",
      },
      parallel_products: {
        FAG: "22316-E1-XL",
        Timken: "22316 EJW33",
        NSK: "22316 EAE4",
        SKF: "22316 E",
      },
    },
    {
      family_id: sphericalRollerFamilyId,
      part_number: "22316 CCW33",
      price: 92.99,
      shipping_cost: "$10 - $15 (Calculated at checkout)",
      stock_status: "In Stock",
      stock_quantity: 8,
      images: [
        "https://m.media-amazon.com/images/I/61G1ODaXSTL._SX522_.jpg",
        "https://m.media-amazon.com/images/I/61G1ODaXSTL._SX522_.jpg",
      ],
      applications: ["Mining Equipment", "Paper Mills", "Steel Mills", "Construction Machinery"],
      shipping_time: "Ships within 2-5 business days",
      payment_methods: ["Visa", "Mastercard", "PayPal", "Bank Transfer"],
      rating: 4.8,
      review_count: 18,
      datasheet: "/datasheets/22316-CCW33.pdf",
      related_products: [],
      countries: ["canada", "north_america", "europe"],
      manufacturing_id: "QV22316CCW3320230001",
      upc: "123456789013",
      dimensions: {
        bore: "80 mm",
        outerDiameter: "170 mm",
        width: "58 mm",
        weight: "5.2 kg",
      },
      load_ratings: {
        dynamic: "158 kN",
        static: "175 kN",
      },
      technical_features: {
        Bore: "80mm",
        Lubrication: "Grease or Oil",
        Seal: "Open (No Seals)",
        Sleeve: "Not Included",
        "Cage Type": "Machined Brass",
        "Radial Internal Play": "C3 (Greater than Normal)",
        Precision: "P0 (Normal)",
        Speed: "4900 rpm",
        "Heat Stabilization": "Standard",
        "Vibrating Screen Execution": "No",
      },
      suffix_descriptions: {
        CCW33: "Machined brass cage, C3 clearance",
      },
      parallel_products: {
        FAG: "22316-E1-XL-C3",
        Timken: "22316 EJW33C3",
        NSK: "22316 EAE4C3",
        SKF: "22316 E/C3",
      },
    },

    // Deep Groove Ball Bearings
    {
      family_id: deepGrooveFamilyId,
      part_number: "6204-2RS",
      price: 5.99,
      shipping_cost: "$5 - $10 (Calculated at checkout)",
      stock_status: "In Stock",
      stock_quantity: 50,
      images: [
        "https://m.media-amazon.com/images/I/417pc4EWmIL._SY445_SX342_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/417pc4EWmIL._SY445_SX342_QL70_FMwebp_.jpg",
      ],
      applications: ["Automotive", "Electric Motors", "Household Appliances", "Power Tools"],
      shipping_time: "Ships within 1-3 business days",
      payment_methods: ["Visa", "Mastercard", "PayPal"],
      rating: 4.5,
      review_count: 32,
      datasheet: "/datasheets/6204-2RS.pdf",
      related_products: [],
      countries: ["canada", "north_america_us_mexico", "europe", "middle_east", "asia"],
      manufacturing_id: "QV6204RS20230001",
      upc: "123456789014",
      dimensions: {
        bore: "20 mm",
        outerDiameter: "47 mm",
        width: "14 mm",
        weight: "0.11 kg",
      },
      load_ratings: {
        dynamic: "13.5 kN",
        static: "6.55 kN",
      },
      technical_features: {
        Bore: "20mm",
        Lubrication: "Pre-lubricated with grease",
        Seal: "Double rubber seals (2RS)",
        "Cage Type": "Steel",
        "Radial Internal Play": "C0 (Normal)",
        Precision: "P0 (Normal)",
        Speed: "17000 rpm",
        "Heat Stabilization": "Standard",
      },
      suffix_descriptions: {
        "2RS": "Double rubber seal on both sides",
      },
      parallel_products: {
        FAG: "6204-2RSR",
        Timken: "6204-2RS",
        NSK: "6204DDU",
        SKF: "6204-2RS1",
      },
    },

    // Tapered Roller Bearings
    {
      family_id: taperedRollerFamilyId,
      part_number: "30205",
      price: 12.99,
      shipping_cost: "$5 - $10 (Calculated at checkout)",
      stock_status: "In Stock",
      stock_quantity: 35,
      images: [
        "https://m.media-amazon.com/images/I/41K5cnn5VCL._SY445_SX342_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/41K5cnn5VCL._SY445_SX342_QL70_FMwebp_.jpg",
      ],
      applications: ["Automotive", "Gearboxes", "Heavy Machinery", "Industrial Equipment"],
      shipping_time: "Ships within 1-3 business days",
      payment_methods: ["Visa", "Mastercard", "PayPal"],
      rating: 4.7,
      review_count: 18,
      datasheet: "/datasheets/30205.pdf",
      related_products: [],
      countries: ["canada", "north_america"],
      manufacturing_id: "QV3020520230001",
      upc: "123456789015",
      dimensions: {
        bore: "25 mm",
        outerDiameter: "52 mm",
        width: "16.25 mm",
        weight: "0.15 kg",
      },
      load_ratings: {
        dynamic: "27.5 kN",
        static: "22.8 kN",
      },
      technical_features: {
        Bore: "25mm",
        Lubrication: "Grease or Oil",
        Seal: "Open (No Seals)",
        "Cage Type": "Pressed Steel",
        Precision: "P0 (Normal)",
        Speed: "10000 rpm",
        "Heat Stabilization": "Standard",
      },
      suffix_descriptions: {
        J: "Standard design",
      },
      parallel_products: {
        FAG: "30205-A",
        Timken: "30205",
        NSK: "HR30205J",
        SKF: "30205 J2/Q",
      },
    },
  ]

  // First clear existing data
  await supabase.from("products").delete().gt("id", 0)

  // Insert the product data
  for (const product of productsData) {
    await supabase.from("products").insert(product)
  }

  // Update related products
  const { data: allProducts } = await supabase.from("products").select("id, part_number")

  if (allProducts && allProducts.length > 0) {
    // Map part numbers to IDs
    const productMap = allProducts.reduce((map, product) => {
      map[product.part_number] = product.id
      return map
    }, {})

    // Set related products
    const updates = [
      {
        id: productMap["22316 E"],
        related_products: [productMap["22316 CCW33"], productMap["6204-2RS"]],
      },
      {
        id: productMap["22316 CCW33"],
        related_products: [productMap["22316 E"], productMap["30205"]],
      },
      {
        id: productMap["6204-2RS"],
        related_products: [productMap["22316 E"], productMap["30205"]],
      },
      {
        id: productMap["30205"],
        related_products: [productMap["22316 CCW33"], productMap["6204-2RS"]],
      },
    ]

    for (const update of updates) {
      if (update.id) {
        await supabase.from("products").update({ related_products: update.related_products }).eq("id", update.id)
      }
    }
  }
}

export async function seedBanners() {
  const bannersData = [
    {
      title: "Premium Quality Bearings",
      description: "Discover our extensive range of high-quality industrial bearings",
      button_text: "Shop Now",
      button_link: "/products",
      image: "https://www.quaval.ca/images/home/slider/06.jpg",
    },
    {
      title: "Industry Leading Solutions",
      description: "Expert solutions for all your bearing needs",
      button_text: "Shop Now",
      button_link: "/products",
      image: "https://www.quaval.ca/images/home/slider/08.jpg",
    },
    {
      title: "Professional Support",
      description: "24/7 technical support and consultation",
      button_text: "Contact Us",
      button_link: "/contact",
      image: "https://www.quaval.ca/images/home/slider/10.jpg",
    },
  ]

  // First clear existing data
  await supabase.from("banners").delete().gt("id", 0)

  // Insert the banner data
  for (const banner of bannersData) {
    await supabase.from("banners").insert(banner)
  }
}

export function SeedDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSeed = async () => {
    try {
      setIsLoading(true)

      // Seed product families first
      const families = await seedProductFamilies()

      // Seed products with family references
      await seedProducts(families)

      // Seed banners
      await seedBanners()

      toast({
        title: "Database Seeded",
        description: "Initial data has been successfully loaded into your Supabase database.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Seeding Failed",
        description: "There was an error seeding the database. Please check the console for details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seeding Database...
        </>
      ) : (
        "Seed Database"
      )}
    </Button>
  )
}
