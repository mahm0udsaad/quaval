"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const productFamiliesTableSQL = `
-- Create Product Families Table
CREATE TABLE product_families (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  origin TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`

const productsTableSQL = `
-- Create Products Table (Part Numbers)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL REFERENCES product_families(id) ON DELETE CASCADE,
  part_number TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  shipping_cost TEXT NOT NULL,
  stock_status TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  applications TEXT[] NOT NULL,
  shipping_time TEXT NOT NULL,
  payment_methods TEXT[] NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  review_count INTEGER NOT NULL,
  datasheet TEXT,
  related_products INTEGER[] NOT NULL,
  countries TEXT[] NOT NULL,
  manufacturing_id TEXT,
  upc TEXT,
  dimensions JSONB NOT NULL,
  load_ratings JSONB NOT NULL,
  technical_features JSONB NOT NULL,
  suffix_descriptions JSONB,
  parallel_products JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(family_id, part_number)
);
`

const bannersTableSQL = `
-- Create Banners Table
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_link TEXT NOT NULL,
  image TEXT NOT NULL
);
`

export function SQLInstructionsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"product_families" | "products" | "banners">("product_families")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("SQL copied to clipboard!")
  }

  const getActiveSQL = () => {
    switch (activeTab) {
      case "product_families":
        return productFamiliesTableSQL
      case "products":
        return productsTableSQL
      case "banners":
        return bannersTableSQL
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">SQL Setup Instructions</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4">
          <p className="mb-4">
            To set up your Supabase database, copy and execute the following SQL scripts in your Supabase SQL Editor:
          </p>

          <div className="flex space-x-2 mb-4">
            <Button
              variant={activeTab === "product_families" ? "default" : "outline"}
              onClick={() => setActiveTab("product_families")}
            >
              Product Families Table
            </Button>
            <Button variant={activeTab === "products" ? "default" : "outline"} onClick={() => setActiveTab("products")}>
              Products Table
            </Button>
            <Button variant={activeTab === "banners" ? "default" : "outline"} onClick={() => setActiveTab("banners")}>
              Banners Table
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded-md relative">
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{getActiveSQL()}</pre>
            <Button size="sm" className="absolute top-2 right-2" onClick={() => copyToClipboard(getActiveSQL())}>
              Copy SQL
            </Button>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <h3 className="font-semibold text-yellow-800">Instructions:</h3>
            <ol className="list-decimal list-inside mt-2 text-yellow-800">
              <li>Navigate to your Supabase project dashboard</li>
              <li>Click on the "SQL Editor" in the left sidebar</li>
              <li>Create a "New Query"</li>
              <li>Execute the SQL scripts in this order: Product Families Table, Products Table, Banners Table</li>
              <li>Click "Run" to execute each query</li>
              <li>
                Return to the admin panel and click the "Seed Database" button to populate your tables with initial data
              </li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
