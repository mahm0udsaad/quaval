"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  type Product,
  type ProductFamily,
  createProduct,
  updateProduct,
  getProductById,
  getProductFamilies,
  createProductFamily,
  uploadImage,
  getProductsByFamilyId,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import { RegionSelector } from "./region-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Update the DEFAULT_TECHNICAL_FEATURES constant to include units of measurement
// Update the initial state for stock_status to "Available"
// Add functionality to fetch family images when selecting a family

// Update the DEFAULT_TECHNICAL_FEATURES constant
const DEFAULT_TECHNICAL_FEATURES = {
  Bore: "",
  Lubrication: "",
  Seal: "",
  Sleeve: "",
  "Cage Type": "",
  "Radial Internal Play": "",
  Precision: "",
  "Vibrating Screen Execution": "",
}

// Default regions
const DEFAULT_REGIONS = ["canada", "north_america_us_mexico", "north_america", "europe", "middle_east", "asia"]

interface ProductFormProps {
  productId?: number
}

export default function ProductForm({ productId }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([])
  const [isCreatingFamily, setIsCreatingFamily] = useState(false)
  const [familyProducts, setFamilyProducts] = useState<Product[]>([])

  // Family images
  const [familyImages, setFamilyImages] = useState<string[]>([""])

  // Family data
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null)
  const [newFamilyData, setNewFamilyData] = useState<Partial<ProductFamily>>({
    name: "",
    brand: "Quaval",
    origin: "Canada",
  })

  // Update the initial part number state with "Available" as default stock status
  const [partNumbers, setPartNumbers] = useState<Partial<Product>[]>([
    {
      part_number: "",
      price: 0,
      shipping_cost: "$5 - $10 (Calculated at checkout)",
      stock_status: "Available",
      stock_quantity: 0,
      images: [""],
      applications: [""],
      shipping_time: "Ships within 1-3 business days",
      payment_methods: ["Visa", "Mastercard", "PayPal"],
      rating: 0,
      review_count: 0,
      datasheet: "",
      related_products: [],
      countries: DEFAULT_REGIONS,
      manufacturing_id: "",
      upc: "",
      dimensions: {
        bore: "",
        outerDiameter: "",
        width: "",
        weight: "",
      },
      load_ratings: {
        dynamic: "",
        static: "",
      },
      technical_features: { ...DEFAULT_TECHNICAL_FEATURES },
      suffix_descriptions: {},
      parallel_products: {},
    },
  ])

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchProductFamilies()
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Update the useEffect for selectedFamilyId to fetch family images
  useEffect(() => {
    if (selectedFamilyId && !productId) {
      fetchFamilyProducts(selectedFamilyId)
      fetchFamilyImages(selectedFamilyId)
    }
  }, [selectedFamilyId])

  // Add a new function to fetch family images
  const fetchFamilyImages = async (familyId: number) => {
    try {
      // Get the first product from this family to use its images
      const products = await getProductsByFamilyId(familyId)
      if (products.length > 0 && products[0].images && products[0].images.length > 0) {
        setFamilyImages(products[0].images)
      }
    } catch (error) {
      console.error("Error fetching family images:", error)
    }
  }

  // Add an image URL to the family
  const addFamilyImageUrl = () => {
    setFamilyImages([...familyImages, ""])
  }

  // Update a family image URL
  const updateFamilyImageUrl = (imageIndex: number, url: string) => {
    const newImages = [...familyImages]
    newImages[imageIndex] = url
    setFamilyImages(newImages)
  }

  // Remove a family image URL
  const removeFamilyImageUrl = (imageIndex: number) => {
    setFamilyImages(familyImages.filter((_, i) => i !== imageIndex))
  }

  // Handle file upload for a family image
  const handleFamilyFileUpload = async (imageIndex: number, file: File) => {
    try {
      const url = await uploadImage(file)
      if (url) {
        updateFamilyImageUrl(imageIndex, url)
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchProductFamilies = async () => {
    try {
      const families = await getProductFamilies()
      setProductFamilies(families)

      // Set default family if available and no product is being edited
      if (families.length > 0 && !productId && !selectedFamilyId) {
        setSelectedFamilyId(families[0].id)
      }
    } catch (error) {
      console.error("Error fetching product families:", error)
      toast({
        title: "Error",
        description: "Failed to load product families. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchFamilyProducts = async (familyId: number) => {
    try {
      const products = await getProductsByFamilyId(familyId)
      setFamilyProducts(products)
    } catch (error) {
      console.error("Error fetching family products:", error)
    }
  }

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const product = await getProductById(productId)
      if (product) {
        setSelectedFamilyId(product.family.id)
        setFamilyImages(product.images || [""])

        // Merge existing technical features with default ones
        const mergedTechnicalFeatures = {
          ...DEFAULT_TECHNICAL_FEATURES,
          ...(product.technical_features || {}),
        }

        setPartNumbers([
          {
            ...product,
            family_id: product.family.id,
            technical_features: mergedTechnicalFeatures,
            // Ensure countries are set, with defaults if empty
            countries: product.countries && product.countries.length > 0 ? product.countries : DEFAULT_REGIONS,
          },
        ])
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new product family
  const handleCreateFamily = async () => {
    if (!newFamilyData.name || !newFamilyData.brand || !newFamilyData.origin) {
      toast({
        title: "Error",
        description: "Please fill in all required fields for the product family.",
        variant: "destructive",
      })
      return
    }

    try {
      const family = await createProductFamily(newFamilyData as Omit<ProductFamily, "id" | "created_at">)
      if (family) {
        toast({
          title: "Success",
          description: "Product family created successfully",
        })
        setProductFamilies([...productFamilies, family])
        setSelectedFamilyId(family.id)
        setIsCreatingFamily(false)
        setNewFamilyData({
          name: "",
          brand: "Quaval",
          origin: "Canada",
        })
      }
    } catch (error) {
      console.error("Error creating product family:", error)
      toast({
        title: "Error",
        description: "Failed to create product family. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update the addPartNumber function to use "Available" as default
  const addPartNumber = () => {
    setPartNumbers([
      ...partNumbers,
      {
        part_number: "",
        price: 0,
        shipping_cost: "$5 - $10 (Calculated at checkout)",
        stock_status: "Available",
        stock_quantity: 0,
        images: [""],
        applications: [""],
        shipping_time: "Ships within 1-3 business days",
        payment_methods: ["Visa", "Mastercard", "PayPal"],
        rating: 0,
        review_count: 0,
        datasheet: "",
        related_products: [],
        countries: DEFAULT_REGIONS,
        manufacturing_id: "",
        upc: "",
        dimensions: {
          bore: "",
          outerDiameter: "",
          width: "",
          weight: "",
        },
        load_ratings: {
          dynamic: "",
          static: "",
        },
        technical_features: { ...DEFAULT_TECHNICAL_FEATURES },
        suffix_descriptions: {},
        parallel_products: {},
      },
    ])
  }

  // Remove a part number
  const removePartNumber = (index: number) => {
    setPartNumbers(partNumbers.filter((_, i) => i !== index))
  }

  // Update part number data
  const updatePartNumber = (index: number, field: string, value: any) => {
    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      [field]: value,
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Update nested part number data
  const updateNestedPartNumberField = (index: number, nestedField: string, field: string, value: any) => {
    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      [nestedField]: {
        ...updatedPartNumbers[index][nestedField],
        [field]: value,
      },
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Add a technical feature to a part number
  const addTechnicalFeature = (index: number, key: string, value: string) => {
    if (!key || !value) return

    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      technical_features: {
        ...updatedPartNumbers[index].technical_features,
        [key]: value,
      },
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Remove a technical feature from a part number
  const removeTechnicalFeature = (index: number, key: string) => {
    const updatedPartNumbers = [...partNumbers]
    const newFeatures = { ...updatedPartNumbers[index].technical_features }
    delete newFeatures[key]

    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      technical_features: newFeatures,
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Update a technical feature value
  const updateTechnicalFeature = (index: number, key: string, value: string) => {
    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      technical_features: {
        ...updatedPartNumbers[index].technical_features,
        [key]: value,
      },
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Add a suffix description to a part number
  const addSuffixDescription = (index: number, key: string, value: string) => {
    if (!key || !value) return

    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      suffix_descriptions: {
        ...updatedPartNumbers[index].suffix_descriptions,
        [key]: value,
      },
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Remove a suffix description from a part number
  const removeSuffixDescription = (index: number, key: string) => {
    const updatedPartNumbers = [...partNumbers]
    const newSuffixes = { ...updatedPartNumbers[index].suffix_descriptions }
    delete newSuffixes[key]

    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      suffix_descriptions: newSuffixes,
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Add a parallel product to a part number
  const addParallelProduct = (index: number, key: string, value: string) => {
    if (!key || !value) return

    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      parallel_products: {
        ...updatedPartNumbers[index].parallel_products,
        [key]: value,
      },
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Remove a parallel product from a part number
  const removeParallelProduct = (index: number, key: string) => {
    const updatedPartNumbers = [...partNumbers]
    const newParallels = { ...updatedPartNumbers[index].parallel_products }
    delete newParallels[key]

    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      parallel_products: newParallels,
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Add an application to a part number
  const addApplication = (index: number, application: string) => {
    if (!application) return
    if (partNumbers[index].applications?.includes(application)) return

    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      applications: [...(updatedPartNumbers[index].applications || []), application],
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Remove an application from a part number
  const removeApplication = (index: number, application: string) => {
    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      applications: updatedPartNumbers[index].applications?.filter((app) => app !== application) || [],
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Add an image URL to a part number
  const addImageUrl = (index: number) => {
    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[index] = {
      ...updatedPartNumbers[index],
      images: [...(updatedPartNumbers[index].images || []), ""],
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Update an image URL for a part number
  const updateImageUrl = (partIndex: number, imageIndex: number, url: string) => {
    const updatedPartNumbers = [...partNumbers]
    const newImages = [...(updatedPartNumbers[partIndex].images || [])]
    newImages[imageIndex] = url

    updatedPartNumbers[partIndex] = {
      ...updatedPartNumbers[partIndex],
      images: newImages,
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Remove an image URL from a part number
  const removeImageUrl = (partIndex: number, imageIndex: number) => {
    const updatedPartNumbers = [...partNumbers]
    updatedPartNumbers[partIndex] = {
      ...updatedPartNumbers[partIndex],
      images: updatedPartNumbers[partIndex].images?.filter((_, i) => i !== imageIndex) || [],
    }
    setPartNumbers(updatedPartNumbers)
  }

  // Handle file upload for a part number image
  const handleFileUpload = async (partIndex: number, imageIndex: number, file: File) => {
    try {
      const url = await uploadImage(file)
      if (url) {
        updateImageUrl(partIndex, imageIndex, url)
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFamilyId) {
      toast({
        title: "Error",
        description: "Please select a product family.",
        variant: "destructive",
      })
      return
    }

    // Validate part numbers
    for (let i = 0; i < partNumbers.length; i++) {
      if (!partNumbers[i].part_number) {
        toast({
          title: "Error",
          description: `Please enter a part number for item #${i + 1}.`,
          variant: "destructive",
        })
        return
      }
    }

    setIsSaving(true)

    try {
      if (productId) {
        // Update existing product
        // Make sure to remove the family property if it exists
        const { family, ...productToUpdate } = partNumbers[0] as any

        const updatedProduct = await updateProduct(productId, {
          ...productToUpdate,
          family_id: selectedFamilyId,
          images: familyImages, // Keep using family images for the product
        })

        if (updatedProduct) {
          toast({
            title: "Success",
            description: "Product updated successfully",
            variant: "success",
          })
          router.push("/admin/products")
        }
      } else {
        // Create new products (one for each part number)
        // Add family images to each part number
        const creationPromises = partNumbers.map((partNumber) => {
          // Make sure to remove the family property if it exists
          const { family, ...productToCreate } = partNumber as any

          return createProduct({
            ...productToCreate,
            family_id: selectedFamilyId,
            images: familyImages, // Each part number gets the family images
          } as Omit<Product, "id" | "created_at">)
        })

        const results = await Promise.all(creationPromises)

        if (results.every((result) => result !== null)) {
          toast({
            title: "Success",
            description: `${results.length} product(s) created successfully`,
            variant: "success",
          })
          router.push("/admin/products")
        }
      }
    } catch (error) {
      console.error("Error saving products:", error)
      toast({
        title: "Error",
        description: "Failed to save products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Family Section */}
      <Card>
        <CardHeader>
          <CardTitle>Product Family</CardTitle>
        </CardHeader>
        <CardContent>
          {isCreatingFamily ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="family_name">Family Name</Label>
                  <Input
                    id="family_name"
                    value={newFamilyData.name}
                    onChange={(e) => setNewFamilyData({ ...newFamilyData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="family_brand">Brand</Label>
                  <Input
                    id="family_brand"
                    value={newFamilyData.brand}
                    onChange={(e) => setNewFamilyData({ ...newFamilyData, brand: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="family_origin">Origin</Label>
                  <Input
                    id="family_origin"
                    value={newFamilyData.origin}
                    onChange={(e) => setNewFamilyData({ ...newFamilyData, origin: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="button" onClick={handleCreateFamily}>
                  Create Family
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreatingFamily(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-full">
                  <Label htmlFor="family_id">Select Product Family</Label>
                  <Select
                    value={selectedFamilyId?.toString() || ""}
                    onValueChange={(value) => setSelectedFamilyId(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a product family" />
                    </SelectTrigger>
                    <SelectContent>
                      {productFamilies.map((family) => (
                        <SelectItem key={family.id} value={family.id.toString()}>
                          {family.name} ({family.brand} - {family.origin})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-6">
                  <Button type="button" onClick={() => setIsCreatingFamily(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Family
                  </Button>
                </div>
              </div>

              {familyProducts.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Existing Part Numbers in this Family:</h3>
                  <div className="flex flex-wrap gap-2">
                    {familyProducts.map((product) => (
                      <div key={product.id} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {product.part_number}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isCreatingFamily && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-3">Product Family Images</h3>
              <p className="text-sm text-gray-500 mb-4">
                These images will be shared by all part numbers in this family.
              </p>
              <div className="space-y-4">
                {familyImages.map((image, imageIndex) => (
                  <div key={imageIndex} className="flex items-center space-x-2">
                    {image && (
                      <div className="relative w-16 h-16 border rounded">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Product image ${imageIndex + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <Input
                      value={image || ""}
                      onChange={(e) => updateFamilyImageUrl(imageIndex, e.target.value)}
                      placeholder="Image URL"
                      className="flex-grow"
                      required
                    />
                    <label className="cursor-pointer bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300">
                      <Upload className="h-5 w-5" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFamilyFileUpload(imageIndex, e.target.files[0])
                          }
                        }}
                      />
                    </label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFamilyImageUrl(imageIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFamilyImageUrl} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Part Numbers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Part Numbers</h2>
          <Button type="button" onClick={addPartNumber} disabled={isCreatingFamily}>
            <Plus className="h-4 w-4 mr-2" />
            Add Part Number
          </Button>
        </div>

        {partNumbers.map((partNumber, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="bg-white rounded-lg shadow"
            defaultValue={index === 0 ? `item-${index}` : undefined}
          >
            <AccordionItem value={`item-${index}`} className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="font-semibold">
                      {partNumber.part_number ? partNumber.part_number : `Part Number #${index + 1}`}
                    </span>
                    {partNumber.part_number && (
                      <span className="ml-4 text-sm text-gray-500">
                        ${partNumber.price} - {partNumber.stock_status}
                      </span>
                    )}
                  </div>
                  {partNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        removePartNumber(index)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`part_number_${index}`}>Part Number</Label>
                      <Input
                        id={`part_number_${index}`}
                        value={partNumber.part_number || ""}
                        onChange={(e) => updatePartNumber(index, "part_number", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`price_${index}`}>Price ($)</Label>
                      <Input
                        id={`price_${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={partNumber.price || 0}
                        onChange={(e) => updatePartNumber(index, "price", Number.parseFloat(e.target.value))}
                        required
                      />
                    </div>
                  </div>

                  {/* Inventory & Identification */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Inventory & Identification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`stock_status_${index}`}>Stock Status</Label>
                        <Select
                          value={partNumber.stock_status || "In Stock"}
                          onValueChange={(value) => updatePartNumber(index, "stock_status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select stock status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Not Available">Not Available</SelectItem>
                            <SelectItem value="By Order">By Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`manufacturing_id_${index}`}>Manufacturing ID</Label>
                        <Input
                          id={`manufacturing_id_${index}`}
                          value={partNumber.manufacturing_id || ""}
                          onChange={(e) => updatePartNumber(index, "manufacturing_id", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`upc_${index}`}>UPC</Label>
                        <Input
                          id={`upc_${index}`}
                          value={partNumber.upc || ""}
                          onChange={(e) => updatePartNumber(index, "upc", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Dimensions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`bore_${index}`}>Inner (mm)</Label>
                        <Input
                          id={`bore_${index}`}
                          value={partNumber.dimensions?.bore || ""}
                          onChange={(e) => updateNestedPartNumberField(index, "dimensions", "bore", e.target.value)}
                          placeholder="e.g., 25"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`outerDiameter_${index}`}>Outer (mm)</Label>
                        <Input
                          id={`outerDiameter_${index}`}
                          value={partNumber.dimensions?.outerDiameter || ""}
                          onChange={(e) =>
                            updateNestedPartNumberField(index, "dimensions", "outerDiameter", e.target.value)
                          }
                          placeholder="e.g., 52"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`width_${index}`}>Width (mm)</Label>
                        <Input
                          id={`width_${index}`}
                          value={partNumber.dimensions?.width || ""}
                          onChange={(e) => updateNestedPartNumberField(index, "dimensions", "width", e.target.value)}
                          placeholder="e.g., 15"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight_${index}`}>Weight (kg)</Label>
                        <Input
                          id={`weight_${index}`}
                          value={partNumber.dimensions?.weight || ""}
                          onChange={(e) => updateNestedPartNumberField(index, "dimensions", "weight", e.target.value)}
                          placeholder="e.g., 0.15"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Load Ratings */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Load Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`dynamicLoad_${index}`}>Dynamic Load (C) (kN)</Label>
                        <Input
                          id={`dynamicLoad_${index}`}
                          value={partNumber.load_ratings?.dynamic || ""}
                          onChange={(e) =>
                            updateNestedPartNumberField(index, "load_ratings", "dynamic", e.target.value)
                          }
                          placeholder="e.g., 27.5"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`staticLoad_${index}`}>Static Load (C₀) (kN)</Label>
                        <Input
                          id={`staticLoad_${index}`}
                          value={partNumber.load_ratings?.static || ""}
                          onChange={(e) => updateNestedPartNumberField(index, "load_ratings", "static", e.target.value)}
                          placeholder="e.g., 22.8"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Features */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Technical Features</h3>
                    <div className="space-y-4">
                      {/* Default Technical Features */}
                      <div className="space-y-3">
                        {Object.entries(DEFAULT_TECHNICAL_FEATURES).map(([key, _]) => {
                          const value = partNumber.technical_features?.[key] || ""
                          return (
                            <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                              <div className="font-medium text-sm">{key}:</div>
                              <Input
                                value={value}
                                onChange={(e) => updateTechnicalFeature(index, key, e.target.value)}
                                placeholder={`Enter ${key}`}
                              />
                            </div>
                          )
                        })}
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Additional Technical Features</h4>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Feature Name (e.g., Material, Tolerance)"
                            className="flex-1"
                            id={`tech_key_${index}`}
                          />
                          <Input placeholder="Feature Value" className="flex-1" id={`tech_value_${index}`} />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const keyInput = document.getElementById(`tech_key_${index}`) as HTMLInputElement
                              const valueInput = document.getElementById(`tech_value_${index}`) as HTMLInputElement
                              if (keyInput && valueInput) {
                                addTechnicalFeature(index, keyInput.value, valueInput.value)
                                keyInput.value = ""
                                valueInput.value = ""
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="space-y-2">
                          {Object.entries(partNumber.technical_features || {}).map(([key, value]) => {
                            // Skip default features as they're already displayed above
                            if (Object.keys(DEFAULT_TECHNICAL_FEATURES).includes(key)) {
                              return null
                            }
                            return (
                              <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div>
                                  <span className="font-medium">{key}:</span> {value}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTechnicalFeature(index, key)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suffix Descriptions */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Suffix Descriptions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Suffix (e.g., 2RS, ZZ)" className="flex-1" id={`suffix_key_${index}`} />
                        <Input placeholder="Description" className="flex-1" id={`suffix_value_${index}`} />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const keyInput = document.getElementById(`suffix_key_${index}`) as HTMLInputElement
                            const valueInput = document.getElementById(`suffix_value_${index}`) as HTMLInputElement
                            if (keyInput && valueInput) {
                              addSuffixDescription(index, keyInput.value, valueInput.value)
                              keyInput.value = ""
                              valueInput.value = ""
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="mt-2">
                        <div className="space-y-2">
                          {Object.entries(partNumber.suffix_descriptions || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                              <div>
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSuffixDescription(index, key)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parallel Products */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Parallel Products</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Brand (e.g., FAG, SKF)" className="flex-1" id={`parallel_key_${index}`} />
                        <Input placeholder="Part Number" className="flex-1" id={`parallel_value_${index}`} />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const keyInput = document.getElementById(`parallel_key_${index}`) as HTMLInputElement
                            const valueInput = document.getElementById(`parallel_value_${index}`) as HTMLInputElement
                            if (keyInput && valueInput) {
                              addParallelProduct(index, keyInput.value, valueInput.value)
                              keyInput.value = ""
                              valueInput.value = ""
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="mt-2">
                        <div className="space-y-2">
                          {Object.entries(partNumber.parallel_products || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                              <div>
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeParallelProduct(index, key)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Applications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add application (e.g., Mining, Agriculture)"
                          className="flex-grow"
                          id={`application_${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.getElementById(`application_${index}`) as HTMLInputElement
                            if (input) {
                              addApplication(index, input.value)
                              input.value = ""
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {partNumber.applications?.map((app) => (
                          <div key={app} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span>{app}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeApplication(index, app)}
                              className="ml-1 text-red-600 hover:text-red-800 p-0 h-auto"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shipping & Additional Info */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Shipping & Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`shipping_cost_${index}`}>Shipping Cost</Label>
                        <Input
                          id={`shipping_cost_${index}`}
                          value={partNumber.shipping_cost || ""}
                          onChange={(e) => updatePartNumber(index, "shipping_cost", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`shipping_time_${index}`}>Shipping Time</Label>
                        <Input
                          id={`shipping_time_${index}`}
                          value={partNumber.shipping_time || ""}
                          onChange={(e) => updatePartNumber(index, "shipping_time", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`rating_${index}`}>Rating (0-5)</Label>
                        <Input
                          id={`rating_${index}`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={partNumber.rating || 0}
                          onChange={(e) => updatePartNumber(index, "rating", Number.parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`review_count_${index}`}>Review Count</Label>
                        <Input
                          id={`review_count_${index}`}
                          type="number"
                          min="0"
                          value={partNumber.review_count || 0}
                          onChange={(e) => updatePartNumber(index, "review_count", Number.parseInt(e.target.value))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`datasheet_${index}`}>Datasheet URL (optional)</Label>
                        <Input
                          id={`datasheet_${index}`}
                          value={partNumber.datasheet || ""}
                          onChange={(e) => updatePartNumber(index, "datasheet", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Available Markets/Regions */}
                  <div>
                    <h3 className="text-md font-semibold mb-3">Available Markets/Regions</h3>
                    <RegionSelector
                      selectedRegions={partNumber.countries || DEFAULT_REGIONS}
                      onChange={(regions) => updatePartNumber(index, "countries", regions)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Products"
          )}
        </Button>
      </div>
    </form>
  )
}
