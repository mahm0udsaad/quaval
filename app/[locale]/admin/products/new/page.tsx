import ProductForm from "../components/product-form"
export const dynamic = 'force-dynamic'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
