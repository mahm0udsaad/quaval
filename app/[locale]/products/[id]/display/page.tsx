"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Download, Star, Truck, CreditCard } from "lucide-react"
import { useCart } from "../../../contexts/CartContext"

export default function ProductDisplayPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    })
    setAddedToCart(true)
  }

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [addedToCart])

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
        <ArrowLeft className="mr-2" />
        Back to Products
      </Link>

      {/* Product Overview Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-[400px] bg-white rounded-lg overflow-hidden border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-4"
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
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400" : "fill-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviewCount} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-primary mb-2">${product.price.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mb-6">Shipping: {product.shippingCost}</div>

          <div className="flex items-center mb-6">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.stockStatus === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {product.stockStatus}
            </span>
            {product.stockStatus === "In Stock" && (
              <span className="text-sm text-gray-500 ml-2">({product.stockQuantity} available)</span>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
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
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stockQuantity, Number.parseInt(e.target.value) || 1)))
                }
                className="w-16 text-center border-t border-b border-gray-300 py-1"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center justify-center"
              disabled={product.stockStatus !== "In Stock"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </button>
            <button className="px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary-light transition duration-300 font-semibold flex items-center justify-center">
              Buy Now
            </button>
          </div>
          {addedToCart && <p className="text-green-500">Product added to cart successfully!</p>}

          {product.datasheet && (
            <a
              href={product.datasheet}
              className="inline-flex items-center text-primary hover:text-primary-dark mt-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Technical Datasheet
            </a>
          )}
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-secondary mb-6">Technical Specifications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                    {key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Description Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-secondary mb-6">Product Description</h2>
        <p className="text-gray-700 mb-6">{product.description}</p>

        <h3 className="text-lg font-semibold text-secondary mb-3">Applications</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {product.applications.map((app, index) => (
            <li key={index}>{app}</li>
          ))}
        </ul>
      </div>

      {/* Shipping & Payment Details */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-secondary mb-6">Shipping & Payment</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start">
              <Truck className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Shipping Information</h3>
                <p className="text-gray-700">{product.shippingTime}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start">
              <CreditCard className="h-6 w-6 text-primary mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-2">Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {product.paymentMethods.map((method, index) => (
                    <span key={index} className="px-3 py-1 bg-white rounded-md text-sm border">
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
      <div>
        <h2 className="text-2xl font-bold text-secondary mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={relatedProduct.image || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">{relatedProduct.name}</h3>
                <p className="text-primary font-bold">${relatedProduct.price.toFixed(2)}</p>
                <Link
                  href={`/products/${relatedProduct.id}`}
                  className="mt-3 inline-block text-sm text-primary hover:text-primary-dark"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
