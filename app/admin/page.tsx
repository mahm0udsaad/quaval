"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SeedDatabaseButton } from "./components/seed-database"
import { SQLInstructionsModal } from "./components/sql-instructions-modal"
import { Database, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminDashboard() {
  const [showSqlModal, setShowSqlModal] = useState(false)
  const [analytics, setAnalytics] = useState({
    products: 0,
    banners: 0,
    categories: 0,
    orders: 150, // Keeping orders as a static number since we don't have an orders table
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)
      try {
        // Fetch product count
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        // Fetch banner count
        const { count: bannersCount, error: bannersError } = await supabase
          .from("banners")
          .select("*", { count: "exact", head: true })

        // Get unique categories from products
        const { data: productsData, error: categoriesError } = await supabase.from("products").select("family")

        // Count unique categories
        const uniqueCategories = new Set()
        if (productsData) {
          productsData.forEach((product) => {
            if (product.family) {
              uniqueCategories.add(product.family)
            }
          })
        }

        if (!productsError && !bannersError && !categoriesError) {
          setAnalytics({
            products: productsCount || 0,
            banners: bannersCount || 0,
            categories: uniqueCategories.size,
            orders: 150,
          })
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setShowSqlModal(true)}>
            <Database className="mr-2 h-4 w-4" />
            SQL Setup
          </Button>
          <SeedDatabaseButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          {isLoading ? (
            <div className="flex items-center mt-2">
              <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-primary mt-2">{analytics.products}</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Banners</h3>
          {isLoading ? (
            <div className="flex items-center mt-2">
              <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-primary mt-2">{analytics.banners}</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
          {isLoading ? (
            <div className="flex items-center mt-2">
              <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-primary mt-2">{analytics.categories}</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-primary mt-2">{analytics.orders}</p>
        </div>
      </div>

      {/* SQL Setup Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-4">Getting Started with Supabase</h2>
        <p className="mb-4">Follow these steps to set up your Quaval Bearings database with Supabase:</p>
        <ol className="list-decimal list-inside space-y-2 mb-6">
          <li>Click the "SQL Setup" button to view the necessary SQL scripts</li>
          <li>Run the scripts in your Supabase SQL Editor to create the required tables</li>
          <li>Return to this page and click "Seed Database" to populate the tables with initial data</li>
          <li>Start managing your products and banners through the admin interface</li>
        </ol>
        <div className="flex space-x-4">
          <Button onClick={() => setShowSqlModal(true)}>
            <Database className="mr-2 h-4 w-4" />
            View SQL Scripts
          </Button>
        </div>
      </div>

      <SQLInstructionsModal open={showSqlModal} onClose={() => setShowSqlModal(false)} />
    </div>
  )
}
