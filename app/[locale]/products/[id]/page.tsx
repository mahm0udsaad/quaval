"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Star, Truck, CreditCard, Box, CuboidIcon as Cube } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import { getProductById } from "@/lib/api"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageMagnifier } from "@/app/[locale]/components/image-magnifier"
import { BearingSpecificationTable } from "@/app/[locale]/components/bearing-specification-table"
import { CurrencySelector } from "@/app/[locale]/components/currency-selector"
import { useCurrency } from "@/app/[locale]/contexts/CurrencyContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTranslate } from "@/lib/i18n-client"

export default function ProductPage() {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()
  const { selectedCurrency, convertPrice } = useCurrency()
  const params = useParams()
  const { t } = useTranslate()

  const [customizeModalOpen, setCustomizeModalOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")
  const [customizeSubmitted, setCustomizeSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const productId = Number.parseInt(params.id as string)
      const data = await getProductById(productId)
      if (data) {
        setProduct(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the handleAddToCart function
  const handleAddToCart = useCallback(() => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.part_number,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      partNumber: product.part_number,
    })
    setAddedToCart(true)
  }, [addToCart, product, quantity])

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [addedToCart])

  const handleCustomizeSubmit = () => {
    // Here you would typically send this to your backend
    console.log("Custom order request:", customMessage)
    setCustomizeSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setCustomizeSubmitted(false)
      setCustomizeModalOpen(false)
      setCustomMessage("")
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/products" className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
          <ArrowLeft className="mr-2" />
          {t('navigation.products')}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton className="h-20 w-20 rounded" />
              <Skeleton className="h-20 w-20 rounded" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>

        <Skeleton className="h-64 w-full mb-16" />
        <Skeleton className="h-64 w-full mb-16" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-secondary mb-4">{t('products.productNotFound')}</h1>
        <p className="mb-6">{t('products.productDoesNotExist')}</p>
        <Link href="/products" className="text-primary hover:text-primary-dark">
          {t('products.returnToProducts')}
        </Link>
      </div>
    )
  }

  // Get the previous page from the referrer
  const backLink = document.referrer.includes("/search") ? "/search" : "/products"

  // Convert price to selected currency
  const convertedPrice = convertPrice(product.price)

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href={backLink} className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
        <ArrowLeft className="mr-2" />
        {backLink === "/search" ? t('navigation.backToSearch') : t('navigation.backToProducts')}
      </Link>

      {/* Part Number and Product Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Display the part number as the main title */}
            <h1 className="text-3xl font-bold text-secondary mb-4">{product.part_number}</h1>
            {/* Display the product family as a subtitle */}
            <p className="text-lg text-gray-600 mb-4">{product.family.name}</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('products.quantity')}
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(product.stock_quantity, Number.parseInt(e.target.value) || 1)))
                    }
                    className="w-16 text-center border-t border-b border-gray-300 py-1"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center justify-center"
                disabled={product.stock_status !== "In Stock"}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t('general.addToCart')}
              </button>
              <button
                className="px-6 py-3 bg-white text-secondary border border-secondary rounded-md hover:bg-gray-50 transition duration-300 font-semibold flex items-center justify-center"
                onClick={() => setCustomizeModalOpen(true)}
              >
                {t('products.customizeOrder')}
              </button>
            </div>
            {addedToCart && <p className="text-green-500">{t('products.addedToCartSuccess')}</p>}
          </div>

          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-primary">
                {selectedCurrency.symbol} {convertedPrice.toFixed(2)}
              </div>
              <CurrencySelector />
            </div>
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400" : "fill-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.review_count} {t('products.reviews')})</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">{t('products.shipping')}: {product.shipping_cost}</div>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.stock_status === "Available"
                  ? "bg-green-100 text-green-800"
                  : product.stock_status === "Not Available"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {product.stock_status}
            </div>
          </div>
        </div>
      </div>

      {/* Product Images Section */}
      <div className="grid gap-12 mb-12">
        <div className="space-y-4">
          <div className="relative h-[400px] bg-white rounded-lg overflow-hidden border">
            <ImageMagnifier
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.part_number}
              width={400}
              height={400}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 border rounded ${
                  selectedImage === index ? "border-primary border-2" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.part_number} ${t('products.thumbnail')} ${index + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
            <button className="relative w-20 h-20 border rounded flex items-center justify-center bg-gray-50">
              <Box size={20} className="text-gray-500" />
              <span className="text-xs text-gray-500 mt-1">{t('products.package')}</span>
            </button>
            <button className="relative w-20 h-20 border rounded flex items-center justify-center bg-gray-50">
              <Cube size={20} className="text-gray-500" />
              <span className="text-xs text-gray-500 mt-1">{t('products.3dView')}</span>
            </button>
          </div>
        </div>

        {/* General Information Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-700 font-medium">{t('products.partNumber')}:</span> {product.part_number}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.family')}:</span> {product.family.name}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.price')}:</span> {selectedCurrency.symbol}{" "}
                {convertedPrice.toFixed(2)}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.brand')}:</span> {product.family.brand}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.origin')}:</span> {product.family.origin}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.availability')}:</span>{" "}
                <span className={product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}>
                  {product.stock_status}
                </span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.manufacturingId')}:</span> {product.manufacturing_id || "N/A"}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.upc')}:</span> {product.upc || "N/A"}
              </div>
            </dl>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.dimensions')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-700 font-medium">{t('products.bore')}:</span> {product.dimensions.bore}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.outerDiameter')}:</span> {product.dimensions.outerDiameter}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.width')}:</span> {product.dimensions.width}
              </div>
              <div>
                <span className="text-gray-700 font-medium">{t('products.weight')}:</span> {product.dimensions.weight}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.technicalFeatures')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Bearing Specification Table */}
            {product.dimensions && product.load_ratings && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('products.bearingSpecifications')}</h3>
                <BearingSpecificationTable
                  specifications={[
                    {
                      partNumber: product.part_number,
                      dimensions: {
                        bore: product.dimensions.bore,
                        outerDiameter: product.dimensions.outerDiameter,
                        width: product.dimensions.width,
                      },
                      loadRatings: {
                        dynamic: product.load_ratings.dynamic,
                        static: product.load_ratings.static,
                      },
                      geometryFactor: product.technical_features?.["Geometry Factor"] || "",
                      speedReference: {
                        thermalReferenceSpeed: product.technical_features?.["Thermal Reference Speed"] || "",
                        limitingSpeed: product.technical_features?.Speed || "",
                      },
                      weight: product.dimensions.weight,
                    },
                  ]}
                  selectedPartNumber={product.part_number}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {product.technical_features &&
                Object.entries(product.technical_features).map(([feature, value]) => (
                  <div key={feature}>
                    <span className="text-gray-700 font-medium">{feature}:</span> {value}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Suffix Description Section */}
        {product.suffix_descriptions && Object.keys(product.suffix_descriptions).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.suffixDescription')}</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.suffix_descriptions).map(([suffix, description]) => (
                  <div key={suffix}>
                    <span className="text-gray-700 font-medium">{suffix}:</span> {description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Parallel Products Section */}
        {product.parallel_products && Object.keys(product.parallel_products).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.parallel')}</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.parallel_products).map(([manufacturer, partNumber]) => (
                  <div key={manufacturer}>
                    <span className="text-gray-700 font-medium">{manufacturer}:</span> {partNumber}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.applications')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.applications.map((app, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span className="text-gray-700">{app}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shipping & Payment Details */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.shippingPaymentInfo')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <Truck className="h-6 w-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">{t('products.shippingInformation')}</h3>
                  <p className="text-gray-700">{product.shipping_time}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <CreditCard className="h-6 w-6 text-primary mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">{t('products.paymentMethods')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.payment_methods.map((method, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-50 rounded-md text-sm border">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.related_products.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">{t('products.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RelatedProducts productIds={product.related_products} />
            </div>
          </div>
        )}
      </div>
      <Dialog open={customizeModalOpen} onOpenChange={setCustomizeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('products.customizeOrderTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-4">
              {t('products.customizeOrderDescription')}
            </p>
            <Textarea
              placeholder={t('products.customizeOrderPlaceholder')}
              className="min-h-[100px]"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            {customizeSubmitted && (
              <p className="text-green-500 mt-2">
                {t('products.customizeOrderSubmitted')}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCustomizeSubmit} disabled={!customMessage.trim() || customizeSubmitted}>
              {customizeSubmitted ? t('products.submitted') : t('products.submitRequest')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Separate component to fetch and display related products
function RelatedProducts({ productIds }) {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedCurrency, convertPrice } = useCurrency()
  const { t } = useTranslate()

  useEffect(() => {
    async function fetchRelatedProducts() {
      setIsLoading(true)
      try {
        const products = await Promise.all(productIds.map((id) => getProductById(id)))
        setRelatedProducts(products.filter(Boolean))
      } catch (error) {
        console.error("Error fetching related products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productIds.length > 0) {
      fetchRelatedProducts()
    }
  }, [productIds])

  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      {relatedProducts.map((relatedProduct) => (
        <div key={relatedProduct.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative h-48">
            <Image
              src={relatedProduct.images[0] || "/placeholder.svg"}
              alt={relatedProduct.part_number}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">{relatedProduct.part_number}</h3>
            <p className="text-sm text-gray-600 mb-2">{relatedProduct.family.name}</p>
            <p className="text-primary font-bold">
              {selectedCurrency.symbol} {convertPrice(relatedProduct.price).toFixed(2)}
            </p>
            <Link
              href={`/products/${relatedProduct.id}`}
              className="mt-3 inline-block text-sm text-primary hover:text-primary-dark"
            >
              {t('general.viewDetails')}
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}
