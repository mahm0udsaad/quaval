"use client"

import { useParams } from "next/navigation"
import ProductForm from "../../components/product-form"

export default function EditProductPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm productId={productId} />
    </div>
  )
}
